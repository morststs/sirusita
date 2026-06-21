<script>
  import { onMount, onDestroy } from 'svelte';
  import Sidebar from './Sidebar.svelte';
  import NoteToolbar from './NoteToolbar.svelte';
  import Editor from './Editor.svelte';
  import Preview from './Preview.svelte';
  import { ListNotes, GetNote, CreateNote, UpdateNote, DeleteNote, ListTags } from '../wailsjs/go/main/NoteService';
  import { ExportNote, ImportNote, ImportFiles } from '../wailsjs/go/main/App';
  import { OnFileDrop, OnFileDropOff } from '../wailsjs/runtime/runtime';

  let notes = $state([]);
  let tags = $state([]);
  let selectedNote = $state(null);
  let selectedTag = $state(null);
  let activeTab = $state('edit');
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

  async function handleDelete() {
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
        {#if activeTab === 'preview'}
          <div class="font-controls">
            <button class="font-btn" onclick={() => changeFontSize(-1)} disabled={previewFontSize <= FONT_MIN} title="文字を小さく">A-</button>
            <span class="font-size-label">{previewFontSize}px</span>
            <button class="font-btn" onclick={() => changeFontSize(1)} disabled={previewFontSize >= FONT_MAX} title="文字を大きく">A+</button>
          </div>
        {/if}
      </div>
      <div class="editor-area">
        {#if activeTab === 'edit'}
          <Editor body={selectedNote.body} onChange={handleBodyChange} />
        {:else}
          <Preview body={selectedNote.body} fontSize={previewFontSize} />
        {/if}
      </div>
    {:else}
      <div class="empty-state">マークダウンを選択または新規作成してください</div>
    {/if}
  </div>
</div>

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
  .font-controls {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 6px;
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
  .editor-area {
    flex: 1;
    overflow: auto;
    background: #1e1e1e;
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
</style>
