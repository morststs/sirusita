<script>
  import { Accordion, AccordionItem } from 'flowbite-svelte';

  let {
    notes = [],
    tags = [],
    selectedTag = null,
    selectedNote = null,
    onCreateNote,
    onSelectTag,
    onSelectNote
  } = $props();

  let filteredNotes = $derived(
    selectedTag
      ? notes.filter(n => n.tags && n.tags.includes(selectedTag))
      : notes
  );
</script>

<div class="sidebar-content">
  <button class="new-note-btn" onclick={() => onCreateNote?.()} title="新規マークダウン">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 2h8l4 4v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M12 2v4h4" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M10 10v6M7 13h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  </button>

  <Accordion multiple flush class="accordion-menu">
    <AccordionItem open>
      {#snippet header()}タグフィルタ{/snippet}
      <div class="tag-list">
        <button
          class="tag-item"
          class:active={selectedTag === null}
          onclick={() => onSelectTag?.(null)}>
          全て
        </button>
        {#each tags as tag}
          <button
            class="tag-item"
            class:active={selectedTag === tag}
            onclick={() => onSelectTag?.(tag)}>
            {tag}
          </button>
        {/each}
      </div>
    </AccordionItem>

    <AccordionItem open>
      {#snippet header()}マークダウン一覧{/snippet}
      <div class="note-list">
        {#each filteredNotes as note}
          <button
            class="note-item"
            class:active={selectedNote && selectedNote.id === note.id}
            onclick={() => onSelectNote?.(note.id)}>
            <span class="note-title">{note.title || '無題'}</span>
          </button>
        {/each}
      </div>
    </AccordionItem>
  </Accordion>
</div>

<style>
  .sidebar-content {
    padding: 12px;
  }
  .new-note-btn {
    width: 36px;
    height: 36px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0e639c;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 16px;
  }
  .new-note-btn:hover {
    background: #1177bb;
  }
  .tag-list, .note-list {
    padding: 4px 0;
  }
  .tag-item, .note-item {
    display: block;
    width: 100%;
    text-align: left;
    padding: 6px 8px;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 4px;
    font-size: 13px;
    font-family: "Noto Sans JP", sans-serif;
    color: #bbbbbb;
  }
  .tag-item:hover, .note-item:hover {
    background: #2a2d2e;
    color: #ffffff;
  }
  .tag-item.active, .note-item.active {
    background: #094771;
    color: #ffffff;
  }
  .note-item {
    overflow: hidden;
  }
  .note-title {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
