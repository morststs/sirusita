<script>
  import { Accordion, AccordionItem, Modal, Button } from 'flowbite-svelte';
  import { IS_WEB } from '$backend';
  import { STORE_URL } from './links.js';
  import { buildTagTree, matchesTag, normalizeTag, allTagPaths, renameTagPath } from './tagTree.js';

  let {
    notes = [],
    tags = [],
    selectedTag = null,
    selectedNote = null,
    onCreateNote,
    onImport,
    onSelectTag,
    onSelectNote,
    onRenameTag
  } = $props();

  // 「タグ無し」フィルタ用のセンチネル（実在タグ文字列と衝突しない Symbol）。
  const UNTAGGED = Symbol('untagged');

  // タグツリーの展開状態（path の集合）。localStorage は使えない環境もあるので失敗時は全て閉じる。
  const EXPANDED_KEY = 'sirusita.tagTree.expanded';
  function loadExpanded() {
    try {
      const raw = localStorage.getItem(EXPANDED_KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  }
  let expanded = $state(loadExpanded());

  function saveExpanded(set) {
    try {
      localStorage.setItem(EXPANDED_KEY, JSON.stringify([...set]));
    } catch {
      // 保存できなくても動作は継続
    }
  }

  function toggleExpanded(path) {
    const next = new Set(expanded);
    if (next.has(path)) next.delete(path);
    else next.add(path);
    expanded = next;
    saveExpanded(next);
  }

  let tagTree = $derived(buildTagTree(tags, notes));

  let filteredNotes = $derived(
    selectedTag === null
      ? notes
      : selectedTag === UNTAGGED
        ? notes.filter(n => !n.tags || n.tags.length === 0)
        : notes.filter(n => matchesTag(n.tags, selectedTag))
  );

  // タグ名変更モーダルの状態
  let renameOpen = $state(false);
  let renameFrom = $state('');
  let renameTo = $state('');
  let renameTarget = $derived(normalizeTag(renameTo));
  let renameDisabled = $derived(renameTarget === '' || renameTarget === renameFrom);
  // 自分自身・自分の配下以外の既存タグ（中間ノード含む）と一致すれば統合になる
  let renameMerge = $derived(
    !renameDisabled &&
      !(renameTarget === renameFrom || renameTarget.startsWith(renameFrom + '/')) &&
      allTagPaths(tags).has(renameTarget)
  );

  function openRename(path) {
    renameFrom = path;
    renameTo = path;
    renameOpen = true;
  }

  function submitRename() {
    if (renameDisabled) return;
    // 展開状態もリネームに追従させる
    const moved = new Set([...expanded].map(p => renameTagPath(p, renameFrom, renameTarget) ?? p));
    expanded = moved;
    saveExpanded(moved);
    onRenameTag?.(renameFrom, renameTarget);
    renameOpen = false;
  }
</script>

{#snippet tagNode(node, depth)}
  <div class="tag-row" style="padding-left: {depth * 12}px">
    {#if node.children.length > 0}
      <button class="tag-toggle"
        onclick={() => toggleExpanded(node.path)}
        title={expanded.has(node.path) ? '折りたたむ' : '展開する'}>
        {expanded.has(node.path) ? '▾' : '▸'}
      </button>
    {:else}
      <span class="tag-toggle-spacer"></span>
    {/if}
    <button
      class="tag-item"
      class:active={selectedTag === node.path}
      onclick={() => onSelectTag?.(node.path)}
      title={node.path}>
      {node.name} <span class="tag-count">({node.count})</span>
    </button>
    <button class="tag-rename" onclick={() => openRename(node.path)} title="タグ名を変更">✎</button>
  </div>
  {#if node.children.length > 0 && expanded.has(node.path)}
    {#each node.children as child (child.path)}
      {@render tagNode(child, depth + 1)}
    {/each}
  {/if}
{/snippet}

<div class="sidebar-content">
  <div class="sidebar-actions">
    <button class="new-note-btn" onclick={() => onCreateNote?.()} title="新規マークダウン">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 2h8l4 4v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.5" fill="none"/>
        <path d="M12 2v4h4" stroke="currentColor" stroke-width="1.5" fill="none"/>
        <path d="M10 10v6M7 13h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
    <button class="import-btn" onclick={() => onImport?.()} title="マークダウン / ZIP をインポート">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 3v9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M6 8l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 15v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
  </div>

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
        <button
          class="tag-item"
          class:active={selectedTag === UNTAGGED}
          onclick={() => onSelectTag?.(UNTAGGED)}>
          タグ無し
        </button>
        {#each tagTree as node (node.path)}
          {@render tagNode(node, 0)}
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

  {#if IS_WEB}
    <div class="web-note">
      <p>メモはこのブラウザ内（IndexedDB）にだけ保存されます。サイトデータを消去すると失われるので、必要なメモはエクスポートしてください。</p>
      {#if STORE_URL}
        <a href={STORE_URL} target="_blank" rel="noopener noreferrer" title="Microsoft Store を開きます">Windows アプリ版（Microsoft Store） ↗</a>
      {/if}
    </div>
  {/if}

  <Modal title="タグ名を変更" bind:open={renameOpen} size="xs">
    <p class="rename-hint">「/」で区切ると階層になります。配下のタグもまとめて変更されます。</p>
    <input
      class="rename-input"
      bind:value={renameTo}
      onkeydown={(e) => { if (e.isComposing || e.keyCode === 229) return; if (e.key === 'Enter') { e.preventDefault(); submitRename(); } }} />
    {#if renameMerge}
      <p class="rename-merge">既存タグ「{renameTarget}」と統合されます</p>
    {/if}
    {#snippet footer()}
      <Button type="button" disabled={renameDisabled} onclick={submitRename}>変更</Button>
      <Button type="button" color="alternative" onclick={() => (renameOpen = false)}>キャンセル</Button>
    {/snippet}
  </Modal>
</div>

<style>
  .web-note {
    margin-top: 16px;
    padding: 8px;
    border-top: 1px solid #333333;
    font-size: 11px;
    line-height: 1.6;
    color: #888888;
  }
  .web-note a {
    display: inline-block;
    margin-top: 6px;
    color: #4fa3e0;
  }
  .sidebar-content {
    padding: 12px;
  }
  .sidebar-actions {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }
  .new-note-btn, .import-btn {
    width: 36px;
    height: 36px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  .new-note-btn {
    background: #0e639c;
  }
  .new-note-btn:hover {
    background: #1177bb;
  }
  .import-btn {
    background: #3c3c3c;
    color: #cccccc;
  }
  .import-btn:hover {
    background: #4a4a4a;
    color: #ffffff;
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
    font-family: inherit;
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
  .tag-row {
    display: flex;
    align-items: center;
  }
  .tag-row .tag-item {
    flex: 1;
    min-width: 0;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tag-toggle, .tag-toggle-spacer {
    flex: none;
    width: 18px;
  }
  .tag-toggle {
    padding: 0;
    border: none;
    background: none;
    color: #888888;
    cursor: pointer;
    font-size: 11px;
  }
  .tag-toggle:hover {
    color: #ffffff;
  }
  .tag-count {
    color: #777777;
    font-size: 11px;
  }
  .tag-rename {
    flex: none;
    visibility: hidden;
    padding: 0 4px;
    border: none;
    background: none;
    color: #888888;
    cursor: pointer;
    font-size: 12px;
  }
  .tag-row:hover .tag-rename {
    visibility: visible;
  }
  .tag-rename:hover {
    color: #ffffff;
  }
  .rename-hint {
    font-size: 12px;
    color: #999999;
    margin-bottom: 8px;
  }
  .rename-input {
    width: 100%;
    padding: 6px 8px;
    background: #3c3c3c;
    border: 1px solid #555555;
    border-radius: 4px;
    color: #ffffff;
    font-size: 13px;
  }
  .rename-input:focus {
    outline: none;
    border-color: #0e639c;
  }
  .rename-merge {
    margin-top: 8px;
    font-size: 12px;
    color: #e0a040;
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
