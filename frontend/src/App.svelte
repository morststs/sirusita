<script>
  import { onMount, onDestroy } from 'svelte';
  import Sidebar from './Sidebar.svelte';
  import NoteToolbar from './NoteToolbar.svelte';
  import Editor from './Editor.svelte';
  import Preview from './Preview.svelte';
  import Toc from './Toc.svelte';
  import HelpModal from './HelpModal.svelte';
  import SampleModal from './SampleModal.svelte';
  import { extractHeadings } from './markdown.js';
  import {
    ListNotes, GetNote, CreateNote, UpdateNote, DeleteNote, ListTags, RenameTag,
    ExportNote, ImportNote, OnImportDrop, OffImportDrop,
  } from '$backend';
  import { renameTagPath, renameTags, allTagPaths } from './tagTree.js';

  let notes = $state([]);
  let tags = $state([]);
  let selectedNote = $state(null);
  let selectedTag = $state(null);
  // 表示モード: 'edit'（編集のみ）/ 'preview'（プレビューのみ）/ 'split'（横に並べて表示）。
  let view = $state('edit');
  // 編集⇄プレビュー間で共有するスクロール割合（0..1）。
  let scrollRatio = $state(0);
  // TOC から見出しがクリックされたときのジャンプ先 id（プレビューが消費したら null に戻す）。
  let pendingHeadingId = $state(null);
  // 見出し一覧パネルの表示状態。
  let showToc = $state(false);
  // 削除確認ダイアログの対象（[{ id, title }]。空なら閉じている）。
  let deleteTargets = $state([]);
  // 使い方（ヘルプ）の表示状態。
  let showHelp = $state(false);
  // サンプル集から追加ダイアログの表示状態。
  let showSamples = $state(false);
  // 本文から抽出した見出し一覧（編集に追従してリアルタイム更新）。
  let headings = $derived(extractHeadings(selectedNote?.body || ''));
  let toastMessage = $state('');
  let toastTimer = null;
  let saveTimer = null;
  let pendingSave = null;

  // サイドバー幅（スプリッターでリサイズ可能）
  let sidebarWidth = $state(250);
  const SIDEBAR_MIN = 200;
  const SIDEBAR_MAX = 600;
  let dragging = $state(false);

  // プレビュー文字サイズ
  let previewFontSize = $state(15);
  const FONT_MIN = 11;
  const FONT_MAX = 28;

  onMount(async () => {
    const savedWidth = parseInt(localStorage.getItem('sidebarWidth'), 10);
    if (!isNaN(savedWidth)) {
      sidebarWidth = Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, savedWidth));
    }
    const savedFont = parseInt(localStorage.getItem('previewFontSize'), 10);
    if (!isNaN(savedFont)) {
      previewFontSize = Math.min(FONT_MAX, Math.max(FONT_MIN, savedFont));
    }
    showToc = localStorage.getItem('showToc') === '1';
    const savedView = localStorage.getItem('view');
    if (savedView === 'edit' || savedView === 'preview' || savedView === 'split') {
      view = savedView;
    }
    await refreshList();

    // マークダウン / ZIP をウィンドウへドラッグ&ドロップで取り込む
    OnImportDrop(handleFileDrop);
  });

  onDestroy(() => {
    clearTimeout(toastTimer);
    clearTimeout(saveTimer);
    stopDrag();
    OffImportDrop();
  });

  // runImport は取り込みを実行する関数（$backend の OnImportDrop 参照）。
  async function handleFileDrop(runImport) {
    await flushPendingSave();
    try {
      const imported = await runImport();
      if (imported && imported.length > 0) {
        await refreshList();
        selectedNote = imported[imported.length - 1];
        navView('edit');
        showToast(imported.length + '件のマークダウンをインポートしました');
      } else {
        showToast('マークダウンファイル (.md) が見つかりませんでした');
      }
    } catch (err) {
      console.error(err);
      await refreshList().catch(() => {});
      showToast('インポートに失敗しました');
    }
  }

  function startDrag(e) {
    dragging = true;
    e.preventDefault();
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
  }

  function onDrag(e) {
    sidebarWidth = Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, e.clientX));
  }

  function stopDrag() {
    if (!dragging) return;
    dragging = false;
    localStorage.setItem('sidebarWidth', String(sidebarWidth));
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', stopDrag);
  }

  function changeFontSize(delta) {
    previewFontSize = Math.min(FONT_MAX, Math.max(FONT_MIN, previewFontSize + delta));
    localStorage.setItem('previewFontSize', String(previewFontSize));
  }

  function toggleToc() {
    showToc = !showToc;
    localStorage.setItem('showToc', showToc ? '1' : '0');
  }

  // 表示モードを切り替えて保存する（タブのクリックから呼ばれる）。
  function setView(v) {
    view = v;
    localStorage.setItem('view', v);
  }

  // ノート操作に伴う自動切り替え。分割表示中はそのまま維持する。
  function navView(v) {
    if (view !== 'split') setView(v);
  }

  // 見出しクリック: プレビューを表示し、その見出しまでスクロールさせる。
  // 編集のみ表示中ならプレビューへ切り替える（プレビュー/分割では既に表示中）。
  function handleSelectHeading(id) {
    if (view === 'edit') setView('preview');
    pendingHeadingId = id;
  }

  // 分割モードの行アンカー・スクロール同期。
  // 各ペインは「自分がプログラムで動いたエコー」を内部の抑止フラグで無視するので、
  // ここでは単純に相手へ行を橋渡しするだけでループしない。
  let editorRef = $state(null);
  let previewRef = $state(null);
  function syncFromEditor(line) {
    if (view === 'split') previewRef?.scrollToSourceLine(line);
  }
  function syncFromPreview(line) {
    if (view === 'split') editorRef?.scrollToSourceLine(line);
  }

  // 別のメモを開いたらスクロール位置をリセットする（先頭から表示）。
  let lastNoteId = null;
  $effect(() => {
    const id = selectedNote?.id ?? null;
    if (id !== lastNoteId) {
      lastNoteId = id;
      scrollRatio = 0;
    }
  });

  async function refreshList() {
    try {
      notes = await ListNotes() || [];
      tags = await ListTags() || [];
    } catch (e) {
      showToast('マークダウン一覧の読み込みに失敗しました');
    }
  }

  function showToast(msg) {
    toastMessage = msg;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastMessage = ''; }, 3000);
  }

  async function handleSelectNote(id) {
    // 切替前に未保存の本文を保存する（タイマーが切替後のメモに対して走ると編集が失われるため）
    await flushPendingSave();
    try {
      selectedNote = await GetNote(id);
      navView('preview');
    } catch (err) {
      showToast('マークダウンの読み込みに失敗しました');
      await refreshList();
    }
  }

  function handleSelectTag(tag) {
    selectedTag = tag;
  }

  async function handleRenameTag(oldTag, newTag) {
    // 開いているメモのタグは先にローカルで付け替える。GetNote で読み直すと未保存の本文編集を
    // 失い、また旧タグのまま自動保存されるとリネームが巻き戻るため。
    await flushPendingSave();
    const targetId = selectedNote?.id;
    const prevTags = selectedNote?.tags;
    if (selectedNote) selectedNote.tags = renameTags(selectedNote.tags || [], oldTag, newTag);
    try {
      const count = await RenameTag(oldTag, newTag);
      if (typeof selectedTag === 'string') {
        selectedTag = renameTagPath(selectedTag, oldTag, newTag) ?? selectedTag;
      }
      await refreshList();
      if (typeof selectedTag === 'string' && !allTagPaths(tags).has(selectedTag)) selectedTag = null;
      showToast(count + '件のマークダウンを更新しました');
    } catch (err) {
      // 部分失敗で開いているメモが既にディスク上で書き換わっている場合があるため、ディスクから tags だけ読み直す
      if (selectedNote && selectedNote.id === targetId) {
        try {
          const fresh = await GetNote(targetId);
          if (selectedNote && selectedNote.id === targetId) selectedNote.tags = fresh.tags;
        } catch {
          if (selectedNote && selectedNote.id === targetId && prevTags) selectedNote.tags = prevTags;
        }
      }
      await refreshList();
      showToast('タグの変更に失敗しました');
    }
  }

  async function handleCreateNote() {
    await flushPendingSave();
    try {
      const note = await CreateNote('無題', '', []);
      await refreshList();
      selectedNote = note;
      navView('edit');
    } catch (err) {
      showToast('マークダウンの作成に失敗しました');
    }
  }

  async function handleImport() {
    await flushPendingSave();
    try {
      const imported = await ImportNote();
      if (imported && imported.length > 0) {
        await refreshList();
        selectedNote = imported[imported.length - 1];
        navView('edit');
        showToast(imported.length + '件のマークダウンをインポートしました');
      }
    } catch (err) {
      console.error(err);
      await refreshList().catch(() => {});
      showToast('インポートに失敗しました');
    }
  }

  // 同梱サンプル（samples.js）を選んだ順に新しいメモとして作る。
  async function handleAddSamples(picked) {
    await flushPendingSave();
    let last = null;
    let count = 0;
    try {
      for (const s of picked) {
        last = await CreateNote(s.title, s.body, s.tags);
        count++;
      }
    } catch (err) {
      console.error(err);
    }
    await refreshList();
    if (last) {
      selectedNote = last;
      navView('preview');
    }
    showToast(count === picked.length
      ? count + '件のサンプルを追加しました'
      : 'サンプルの追加に失敗しました（' + count + '/' + picked.length + '件追加）');
  }

  async function handleBodyChange(body) {
    if (!selectedNote) return;
    selectedNote.body = body;

    clearTimeout(saveTimer);
    saveTimer = setTimeout(runBodySave, 500);
  }

  // 本文の自動保存本体。実行中は pendingSave に Promise を保持する。
  async function runBodySave() {
    saveTimer = null;
    // 実行中の保存があれば完了を待ち、UpdateNote が重ならないようにする
    // （複数の待機者が同時に再開しうるので、while で再確認する）
    while (pendingSave) await pendingSave;
    if (!selectedNote) return;
    const p = (async () => {
      try {
        selectedNote = await UpdateNote(
          selectedNote.id,
          selectedNote.title,
          selectedNote.body,
          selectedNote.tags || []
        );
        await refreshList();
      } catch (err) {
        showToast('マークダウンの保存に失敗しました');
      }
    })();
    pendingSave = p;
    await p;
    if (pendingSave === p) pendingSave = null;
  }

  // 保存待ち（タイマー）なら今すぐ保存し、保存中ならその完了を待つ。
  async function flushPendingSave() {
    if (saveTimer) {
      clearTimeout(saveTimer);
      if (selectedNote) await runBodySave();
      else saveTimer = null;
    } else if (pendingSave) {
      await pendingSave;
    }
  }

  async function handleToolbarUpdate({ field, value }) {
    if (!selectedNote) return;
    if (field === 'title') {
      selectedNote.title = value;
    } else if (field === 'tags') {
      selectedNote.tags = value;
    }
    try {
      selectedNote = await UpdateNote(
        selectedNote.id,
        selectedNote.title,
        selectedNote.body,
        selectedNote.tags || []
      );
      await refreshList();
    } catch (err) {
      showToast('マークダウンの更新に失敗しました');
    }
  }

  async function handleExport() {
    if (!selectedNote) return;
    try {
      const path = await ExportNote(selectedNote.title || '', selectedNote.body || '');
      if (path) {
        showToast('エクスポートしました: ' + path);
      }
    } catch (err) {
      showToast('エクスポートに失敗しました');
    }
  }

  // 削除ボタン: まず確認ダイアログを開く（実削除は confirmDelete）。
  function handleDelete() {
    if (!selectedNote) return;
    deleteTargets = [{ id: selectedNote.id, title: selectedNote.title }];
  }

  // サイドバーで複数選択して削除するとき。
  function handleDeleteNotes(targets) {
    if (targets.length > 0) deleteTargets = targets;
  }

  function cancelDelete() {
    deleteTargets = [];
  }

  async function confirmDelete() {
    const targets = deleteTargets;
    deleteTargets = [];
    if (targets.length === 0) return;
    await flushPendingSave();
    let failed = 0;
    for (const t of targets) {
      try {
        await DeleteNote(t.id);
        if (selectedNote && selectedNote.id === t.id) selectedNote = null;
      } catch (err) {
        failed++;
      }
    }
    await refreshList();
    if (failed > 0) {
      showToast('マークダウンの削除に失敗しました（' + failed + '件）');
    } else if (targets.length > 1) {
      showToast(targets.length + '件のマークダウンを削除しました');
    }
  }
</script>

<div class="app-layout" class:dragging>
  <div class="sidebar" style="width: {sidebarWidth}px">
    <Sidebar {notes} {tags} {selectedTag} {selectedNote}
      onSelectNote={handleSelectNote}
      onSelectTag={handleSelectTag}
      onCreateNote={handleCreateNote}
      onImport={handleImport}
      onAddSamples={() => showSamples = true}
      onHelp={() => showHelp = true}
      onRenameTag={handleRenameTag}
      onDeleteNotes={handleDeleteNotes} />
  </div>
  <div class="splitter" class:active={dragging} onmousedown={startDrag} title="ドラッグで幅を調整"></div>
  <div class="main-area">
    {#if selectedNote}
      <NoteToolbar note={selectedNote}
        onUpdate={handleToolbarUpdate}
        onExport={handleExport}
        onDelete={handleDelete} />
      {#snippet editorPane()}
        <Editor bind:this={editorRef} body={selectedNote.body} onChange={handleBodyChange}
          initialRatio={scrollRatio}
          onScroll={(r) => scrollRatio = r}
          onLineScroll={syncFromEditor} />
      {/snippet}
      {#snippet previewPane()}
        <Preview bind:this={previewRef} body={selectedNote.body} fontSize={previewFontSize}
          initialRatio={scrollRatio}
          {pendingHeadingId}
          onScroll={(r) => scrollRatio = r}
          onLineScroll={syncFromPreview}
          onConsumePending={() => pendingHeadingId = null} />
      {/snippet}

      <div class="tab-bar">
        <button class:active={view === 'edit'} onclick={() => setView('edit')}>編集</button>
        <button class:active={view === 'preview'} onclick={() => setView('preview')}>プレビュー</button>
        <button class:active={view === 'split'} onclick={() => setView('split')} title="編集とプレビューを横に並べる">分割</button>
        <div class="tab-controls">
          {#if view === 'split' || view === 'preview'}
            <div class="font-controls">
              <button class="font-btn" onclick={() => changeFontSize(-1)} disabled={previewFontSize <= FONT_MIN} title="文字を小さく">A-</button>
              <span class="font-size-label">{previewFontSize}px</span>
              <button class="font-btn" onclick={() => changeFontSize(1)} disabled={previewFontSize >= FONT_MAX} title="文字を大きく">A+</button>
            </div>
          {/if}
          <button class="toc-btn" class:active={showToc} onclick={toggleToc} title="見出し一覧">☰ 見出し</button>
        </div>
      </div>
      <div class="content-row">
        {#if view === 'split'}
          <div class="editor-area">{@render editorPane()}</div>
          <div class="pane-divider"></div>
          <div class="editor-area">{@render previewPane()}</div>
        {:else if view === 'edit'}
          <div class="editor-area">{@render editorPane()}</div>
        {:else}
          <div class="editor-area">{@render previewPane()}</div>
        {/if}
        {#if showToc}
          <div class="toc-panel">
            <Toc {headings} onSelect={handleSelectHeading} />
          </div>
        {/if}
      </div>
    {:else}
      <div class="empty-state">
        <p>マークダウンを選択または新規作成してください</p>
        <p class="empty-hint">使い方はサイドバー上部の「?」から確認できます</p>
      </div>
    {/if}
  </div>
</div>

{#if deleteTargets.length > 0}
  <div class="modal-overlay" onclick={cancelDelete}>
    <div class="modal" onclick={(e) => e.stopPropagation()}>
      <div class="modal-title">削除の確認</div>
      <div class="modal-body">
        {#if deleteTargets.length === 1}
          「{deleteTargets[0].title || '無題'}」を削除します。<br />
        {:else}
          次の {deleteTargets.length} 件のマークダウンを削除します。
          <ul class="delete-list">
            {#each deleteTargets as t (t.id)}
              <li>{t.title || '無題'}</li>
            {/each}
          </ul>
        {/if}
        この操作は元に戻せません。よろしいですか？
      </div>
      <div class="modal-actions">
        <button class="modal-btn cancel" onclick={cancelDelete}>キャンセル</button>
        <button class="modal-btn danger" onclick={confirmDelete}>
          {deleteTargets.length > 1 ? deleteTargets.length + '件を削除する' : '削除する'}
        </button>
      </div>
    </div>
  </div>
{/if}

<HelpModal bind:open={showHelp} fontSize={previewFontSize} />
<SampleModal bind:open={showSamples} existingTitles={notes.map(n => n.title)} onAdd={handleAddSamples} />

{#if toastMessage}
  <div class="toast">{toastMessage}</div>
{/if}

<style>
  .splitter {
    width: 5px;
    flex-shrink: 0;
    cursor: col-resize;
    background: #3c3c3c;
    transition: background 0.15s;
  }
  .splitter:hover, .splitter.active {
    background: #007acc;
  }
  /* ドラッグ中はテキスト選択を抑止し、カーソルを統一 */
  .app-layout.dragging {
    cursor: col-resize;
    user-select: none;
  }
  .tab-bar {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #3c3c3c;
    padding: 0 16px;
    background: #252526;
  }
  .tab-bar button {
    padding: 8px 16px;
    border: none;
    background: none;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    color: #969696;
    font-family: inherit;
  }
  .tab-bar button:hover {
    color: #ffffff;
  }
  .tab-bar button.active {
    border-bottom-color: #007acc;
    color: #ffffff;
  }
  .tab-controls {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .font-controls {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .toc-btn {
    padding: 4px 10px;
    border: 1px solid #3c3c3c;
    border-radius: 4px;
    background: #2d2d2d;
    color: #cccccc;
    cursor: pointer;
    font-family: inherit;
    font-size: 13px;
  }
  .toc-btn:hover {
    border-color: #007acc;
    color: #ffffff;
  }
  .toc-btn.active {
    border-color: #007acc;
    background: #094771;
    color: #ffffff;
  }
  .font-btn {
    padding: 2px 8px;
    border: 1px solid #3c3c3c;
    border-radius: 4px;
    background: #2d2d2d;
    color: #cccccc;
    cursor: pointer;
    font-family: inherit;
  }
  .font-btn:hover:not(:disabled) {
    border-color: #007acc;
    color: #ffffff;
  }
  .font-btn:disabled {
    opacity: 0.4;
    cursor: default;
  }
  .font-size-label {
    color: #969696;
    font-size: 12px;
    min-width: 34px;
    text-align: center;
  }
  .content-row {
    flex: 1;
    display: flex;
    min-height: 0;
  }
  .editor-area {
    flex: 1;
    overflow: hidden;
    min-width: 0;
    background: #1e1e1e;
  }
  /* 分割表示の編集ペインとプレビューペインの境界線 */
  .pane-divider {
    width: 1px;
    flex-shrink: 0;
    background: #3c3c3c;
  }
  .toc-panel {
    width: 240px;
    flex-shrink: 0;
    overflow: hidden;
  }
  .empty-state {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #6a6a6a;
    font-size: 16px;
  }
  .empty-state p {
    margin: 0;
  }
  .empty-hint {
    font-size: 13px;
  }
  .toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #007acc;
    color: #ffffff;
    padding: 12px 20px;
    border-radius: 6px;
    z-index: 1000;
  }
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1100;
  }
  .modal {
    width: 360px;
    max-width: calc(100vw - 40px);
    background: #252526;
    border: 1px solid #3c3c3c;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    overflow: hidden;
  }
  .modal-title {
    padding: 14px 18px;
    font-size: 15px;
    font-weight: bold;
    color: #e7e7e7;
    border-bottom: 1px solid #3c3c3c;
  }
  .modal-body {
    padding: 18px;
    color: #cccccc;
    font-size: 14px;
    line-height: 1.7;
  }
  .delete-list {
    max-height: 40vh;
    overflow-y: auto;
    margin: 8px 0;
    padding: 6px 10px 6px 26px;
    border-radius: 4px;
    background: #1e1e1e;
    list-style: disc;
    font-size: 13px;
  }
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 18px;
    border-top: 1px solid #3c3c3c;
  }
  .modal-btn {
    padding: 6px 16px;
    border-radius: 4px;
    border: 1px solid #3c3c3c;
    cursor: pointer;
    font-family: inherit;
    font-size: 13px;
  }
  .modal-btn.cancel {
    background: #2d2d2d;
    color: #cccccc;
  }
  .modal-btn.cancel:hover {
    background: #3a3a3a;
    color: #ffffff;
  }
  .modal-btn.danger {
    background: #a1260d;
    border-color: #a1260d;
    color: #ffffff;
  }
  .modal-btn.danger:hover {
    background: #c4341a;
    border-color: #c4341a;
  }
</style>
