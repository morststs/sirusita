<script>
  import { onMount, onDestroy } from 'svelte';
  import Sidebar from './Sidebar.svelte';
  import NoteToolbar from './NoteToolbar.svelte';
  import Editor from './Editor.svelte';
  import Preview from './Preview.svelte';
  import Toc from './Toc.svelte';
  import { extractHeadings } from './markdown.js';
  import { ListNotes, GetNote, CreateNote, UpdateNote, DeleteNote, ListTags } from '../wailsjs/go/main/NoteService';
  import { ExportNote, ImportNote, ImportFiles } from '../wailsjs/go/main/App';
  import { OnFileDrop, OnFileDropOff } from '../wailsjs/runtime/runtime';

  let notes = $state([]);
  let tags = $state([]);
  let selectedNote = $state(null);
  let selectedTag = $state(null);
  let activeTab = $state('edit');
  // 編集⇄プレビュー間で共有するスクロール割合（0..1）。
  let scrollRatio = $state(0);
  // TOC から見出しがクリックされたときのジャンプ先 id（プレビューが消費したら null に戻す）。
  let pendingHeadingId = $state(null);
  // 見出し一覧パネルの表示状態。
  let showToc = $state(false);
  // 削除確認ダイアログの表示状態。
  let showDeleteConfirm = $state(false);
  // 本文から抽出した見出し一覧（編集に追従してリアルタイム更新）。
  let headings = $derived(extractHeadings(selectedNote?.body || ''));
  let toastMessage = $state('');
  let toastTimer = null;
  let saveTimer = null;

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
    await refreshList();

    // マークダウンファイルをウィンドウへドラッグ&ドロップで取り込む
    // （第2引数 false でウィンドウ全体をドロップ対象にする）
    OnFileDrop((x, y, paths) => { handleFileDrop(paths); }, false);
  });

  onDestroy(() => {
    clearTimeout(toastTimer);
    clearTimeout(saveTimer);
    stopDrag();
    OnFileDropOff();
  });

  async function handleFileDrop(paths) {
    if (!paths || paths.length === 0) return;
    try {
      const imported = await ImportFiles(paths);
      if (imported && imported.length > 0) {
        await refreshList();
        selectedNote = imported[imported.length - 1];
        activeTab = 'edit';
        showToast(imported.length + '件のマークダウンをインポートしました');
      } else {
        showToast('マークダウンファイル (.md) が見つかりませんでした');
      }
    } catch (err) {
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

  // 見出しクリック: プレビューへ切り替え、その見出しまでスクロールさせる。
  function handleSelectHeading(id) {
    activeTab = 'preview';
    pendingHeadingId = id;
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
    try {
      selectedNote = await GetNote(id);
      activeTab = 'preview';
    } catch (err) {
      showToast('マークダウンの読み込みに失敗しました');
      await refreshList();
    }
  }

  function handleSelectTag(tag) {
    selectedTag = tag;
  }

  async function handleCreateNote() {
    try {
      const note = await CreateNote('無題', '', []);
      await refreshList();
      selectedNote = note;
      activeTab = 'edit';
    } catch (err) {
      showToast('マークダウンの作成に失敗しました');
    }
  }

  async function handleImport() {
    try {
      const imported = await ImportNote();
      if (imported && imported.length > 0) {
        await refreshList();
        selectedNote = imported[imported.length - 1];
        activeTab = 'edit';
        showToast(imported.length + '件のマークダウンをインポートしました');
      }
    } catch (err) {
      showToast('インポートに失敗しました');
    }
  }

  async function handleBodyChange(body) {
    if (!selectedNote) return;
    selectedNote.body = body;

    clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
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
    }, 500);
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
    showDeleteConfirm = true;
  }

  function cancelDelete() {
    showDeleteConfirm = false;
  }

  async function confirmDelete() {
    showDeleteConfirm = false;
    if (!selectedNote) return;
    try {
      await DeleteNote(selectedNote.id);
      selectedNote = null;
      await refreshList();
    } catch (err) {
      showToast('マークダウンの削除に失敗しました');
    }
  }
</script>

<div class="app-layout" class:dragging>
  <div class="sidebar" style="width: {sidebarWidth}px">
    <Sidebar {notes} {tags} {selectedTag} {selectedNote}
      onSelectNote={handleSelectNote}
      onSelectTag={handleSelectTag}
      onCreateNote={handleCreateNote}
      onImport={handleImport} />
  </div>
  <div class="splitter" class:active={dragging} onmousedown={startDrag} title="ドラッグで幅を調整"></div>
  <div class="main-area">
    {#if selectedNote}
      <NoteToolbar note={selectedNote}
        onUpdate={handleToolbarUpdate}
        onExport={handleExport}
        onDelete={handleDelete} />
      <div class="tab-bar">
        <button class:active={activeTab === 'edit'} onclick={() => activeTab = 'edit'}>編集</button>
        <button class:active={activeTab === 'preview'} onclick={() => activeTab = 'preview'}>プレビュー</button>
        <div class="tab-controls">
          {#if activeTab === 'preview'}
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
        <div class="editor-area">
          {#if activeTab === 'edit'}
            <Editor body={selectedNote.body} onChange={handleBodyChange}
              initialRatio={scrollRatio}
              onScroll={(r) => scrollRatio = r} />
          {:else}
            <Preview body={selectedNote.body} fontSize={previewFontSize}
              initialRatio={scrollRatio}
              {pendingHeadingId}
              onScroll={(r) => scrollRatio = r}
              onConsumePending={() => pendingHeadingId = null} />
          {/if}
        </div>
        {#if showToc}
          <div class="toc-panel">
            <Toc {headings} onSelect={handleSelectHeading} />
          </div>
        {/if}
      </div>
    {:else}
      <div class="empty-state">マークダウンを選択または新規作成してください</div>
    {/if}
  </div>
</div>

{#if showDeleteConfirm && selectedNote}
  <div class="modal-overlay" onclick={cancelDelete}>
    <div class="modal" onclick={(e) => e.stopPropagation()}>
      <div class="modal-title">削除の確認</div>
      <div class="modal-body">
        「{selectedNote.title || '無題'}」を削除します。<br />
        この操作は元に戻せません。よろしいですか？
      </div>
      <div class="modal-actions">
        <button class="modal-btn cancel" onclick={cancelDelete}>キャンセル</button>
        <button class="modal-btn danger" onclick={confirmDelete}>削除する</button>
      </div>
    </div>
  </div>
{/if}

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
    font-family: "Noto Sans JP", sans-serif;
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
    font-family: "Noto Sans JP", sans-serif;
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
    font-family: "Noto Sans JP", sans-serif;
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
  .toc-panel {
    width: 240px;
    flex-shrink: 0;
    overflow: hidden;
  }
  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #6a6a6a;
    font-size: 16px;
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
    font-family: "Noto Sans JP", sans-serif;
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
