<script>
  import { Modal, Button } from 'flowbite-svelte';
  import { SAMPLES } from './samples.js';

  // existingTitles: 既にあるメモのタイトル（「追加済み」の目印に使う。追加自体は妨げない）
  let { open = $bindable(false), existingTitles = [], onAdd } = $props();

  let query = $state('');
  let selected = $state(new Set());

  let existing = $derived(new Set(existingTitles));
  let filtered = $derived.by(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SAMPLES;
    return SAMPLES.filter(s =>
      s.title.toLowerCase().includes(q) || s.tags.some(t => t.toLowerCase().includes(q)));
  });
  let allFilteredSelected = $derived(filtered.length > 0 && filtered.every(s => selected.has(s.key)));

  // 開くたびに選択と検索をリセットする
  $effect(() => {
    if (open) {
      query = '';
      selected = new Set();
    }
  });

  function toggle(key) {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    selected = next;
  }

  function toggleAll() {
    const next = new Set(selected);
    for (const s of filtered) {
      if (allFilteredSelected) next.delete(s.key);
      else next.add(s.key);
    }
    selected = next;
  }

  function submit() {
    const picked = SAMPLES.filter(s => selected.has(s.key));
    if (picked.length === 0) return;
    open = false;
    onAdd?.(picked);
  }
</script>

<Modal title="サンプル集から追加" bind:open size="md">
  <p class="hint">追加したいサンプルを選んでください。選んだものが新しいマークダウンとして追加されます。</p>
  <div class="controls">
    <input class="search" placeholder="タイトル・タグで絞り込み" bind:value={query} />
    <button class="select-all" onclick={toggleAll} disabled={filtered.length === 0}>
      {allFilteredSelected ? '選択解除' : '全て選択'}
    </button>
  </div>
  <div class="sample-list">
    {#each filtered as s (s.key)}
      <label class="sample-item">
        <input type="checkbox" checked={selected.has(s.key)} onchange={() => toggle(s.key)} />
        <span class="sample-title">{s.title}</span>
        {#if existing.has(s.title)}<span class="added">追加済み</span>{/if}
        <span class="sample-tags">{s.tags.join(', ')}</span>
      </label>
    {:else}
      <p class="empty">一致するサンプルがありません</p>
    {/each}
  </div>
  {#snippet footer()}
    <Button type="button" disabled={selected.size === 0} onclick={submit}>追加（{selected.size}件）</Button>
    <Button type="button" color="alternative" onclick={() => (open = false)}>キャンセル</Button>
  {/snippet}
</Modal>

<style>
  .hint {
    font-size: 12px;
    color: #999999;
    margin-bottom: 8px;
  }
  .controls {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
  }
  .search {
    flex: 1;
    padding: 6px 8px;
    background: #3c3c3c;
    border: 1px solid #555555;
    border-radius: 4px;
    color: #ffffff;
    font-size: 13px;
  }
  .search::placeholder {
    color: #888888;
  }
  .search:focus {
    outline: none;
    border-color: #0e639c;
  }
  .select-all {
    flex: none;
    padding: 0 10px;
    background: #3c3c3c;
    border: none;
    border-radius: 4px;
    color: #cccccc;
    font-size: 12px;
    cursor: pointer;
  }
  .select-all:hover:not(:disabled) {
    background: #4a4a4a;
    color: #ffffff;
  }
  .sample-list {
    max-height: 50vh;
    overflow-y: auto;
  }
  .sample-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 6px;
    border-radius: 4px;
    font-size: 13px;
    color: #cccccc;
    cursor: pointer;
  }
  .sample-item:hover {
    background: #2a2d2e;
  }
  .sample-title {
    white-space: nowrap;
  }
  .added {
    flex: none;
    font-size: 11px;
    color: #e0a040;
  }
  .sample-tags {
    margin-left: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 11px;
    color: #777777;
  }
  .empty {
    padding: 8px;
    font-size: 12px;
    color: #888888;
  }
</style>
