<script>
  import { Button, Tooltip } from 'flowbite-svelte';
  import { TrashBinOutline, DownloadOutline } from 'flowbite-svelte-icons';

  let { note, onUpdate, onDelete, onExport } = $props();

  let title = $state('');
  let tagsInput = $state('');
  let currentNoteId = null;

  $effect(() => {
    if (note && note.id !== currentNoteId) {
      currentNoteId = note.id;
      title = note.title || '';
      tagsInput = (note.tags || []).join(', ');
    }
  });

  function handleTitleChange() {
    onUpdate?.({ field: 'title', value: title });
  }

  function handleTagsChange() {
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    onUpdate?.({ field: 'tags', value: tags });
  }
</script>

<div class="toolbar">
  <input
    class="title-input"
    type="text"
    placeholder="タイトル"
    bind:value={title}
    onblur={handleTitleChange} />
  <div class="toolbar-row">
    <input
      class="tags-input"
      type="text"
      placeholder="タグ (カンマ区切り)"
      bind:value={tagsInput}
      onblur={handleTagsChange} />
    <Button color="alternative" size="sm" class="export-btn !p-2" onclick={() => onExport?.()} aria-label="エクスポート">
      <DownloadOutline class="h-5 w-5" />
    </Button>
    <Tooltip>ファイルとしてエクスポート</Tooltip>
    <Button color="red" size="sm" class="delete-btn !p-2" onclick={() => onDelete?.()} aria-label="削除">
      <TrashBinOutline class="h-5 w-5" />
    </Button>
    <Tooltip>削除</Tooltip>
  </div>
</div>

<style>
  .toolbar {
    padding: 12px 16px;
    border-bottom: 1px solid #3c3c3c;
    background: #252526;
  }
  .title-input {
    width: 100%;
    font-size: 20px;
    font-weight: bold;
    font-family: "Noto Sans JP", sans-serif;
    border: none;
    outline: none;
    padding: 4px 0;
    margin-bottom: 8px;
    background: transparent;
    color: #e7e7e7;
  }
  .title-input::placeholder {
    color: #6a6a6a;
  }
  .toolbar-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .tags-input {
    flex: 1;
    border: 1px solid #3c3c3c;
    border-radius: 4px;
    padding: 6px 8px;
    font-size: 13px;
    font-family: "Noto Sans JP", sans-serif;
    outline: none;
    background: #3c3c3c;
    color: #cccccc;
  }
  .tags-input::placeholder {
    color: #6a6a6a;
  }
  .tags-input:focus {
    border-color: #007acc;
    background: #1e1e1e;
  }
</style>
