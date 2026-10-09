<script>
  import { Modal, Button } from 'flowbite-svelte';
  import { normalizeTag } from './tagTree.js';

  // targets: 選んだメモ（[{ id, title, tags }]）。allTags: 既存タグ（入力候補に使う）
  let { open = $bindable(false), targets = [], allTags = [], onApply } = $props();

  let addInput = $state('');
  let removing = $state(new Set());

  // 開くたびに入力をリセットする
  $effect(() => {
    if (open) {
      addInput = '';
      removing = new Set();
    }
  });

  // 追加するタグ（カンマ区切り。正規化して空・重複を除く）
  let adding = $derived([...new Set(addInput.split(',').map(normalizeTag).filter(Boolean))]);

  // 選んだメモに付いているタグと、付いている件数（多い順 → 名前順）
  let present = $derived.by(() => {
    const counts = new Map();
    for (const n of targets) {
      for (const t of new Set(n.tags || [])) counts.set(t, (counts.get(t) || 0) + 1);
    }
    return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ja'));
  });

  let disabled = $derived(adding.length === 0 && removing.size === 0);

  function toggleRemove(tag) {
    const next = new Set(removing);
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    removing = next;
  }

  function submit() {
    if (disabled) return;
    open = false;
    onApply?.(adding, [...removing]);
  }
</script>

<Modal title="タグをまとめて変更（{targets.length}件）" bind:open size="sm">
  <div class="field">
    <div class="label">付けるタグ</div>
    <input
      class="tag-input"
      list="bulk-tag-candidates"
      placeholder="例: プログラミング/Go, メモ（カンマ区切り）"
      bind:value={addInput}
      onkeydown={(e) => { if (e.isComposing || e.keyCode === 229) return; if (e.key === 'Enter') { e.preventDefault(); submit(); } }} />
    <datalist id="bulk-tag-candidates">
      {#each allTags as t (t)}<option value={t}></option>{/each}
    </datalist>
    {#if adding.length > 0}
      <div class="chips">
        {#each adding as t (t)}<span class="chip add">+ {t}</span>{/each}
      </div>
    {/if}
  </div>

  <div class="field">
    <div class="label">外すタグ</div>
    {#if present.length === 0}
      <p class="empty">選んだマークダウンにはタグがありません</p>
    {:else}
      <div class="remove-list">
        {#each present as [tag, count] (tag)}
          <label class="remove-item" class:checked={removing.has(tag)}>
            <input type="checkbox" checked={removing.has(tag)} onchange={() => toggleRemove(tag)} />
            <span class="remove-name">{tag}</span>
            <span class="remove-count">{count}/{targets.length}件</span>
          </label>
        {/each}
      </div>
    {/if}
  </div>
  <p class="hint">外すのはチェックしたタグそのものだけで、配下のタグ（例: 「親/子」）は残ります。作成・更新日時は変わりません。</p>

  {#snippet footer()}
    <Button type="button" {disabled} onclick={submit}>変更</Button>
    <Button type="button" color="alternative" onclick={() => (open = false)}>キャンセル</Button>
  {/snippet}
</Modal>

<style>
  .field {
    margin-bottom: 14px;
  }
  .label {
    margin-bottom: 6px;
    font-size: 12px;
    font-weight: 700;
    color: #e8e8e8;
  }
  .tag-input {
    width: 100%;
    padding: 6px 8px;
    background: #3c3c3c;
    border: 1px solid #555555;
    border-radius: 4px;
    color: #ffffff;
    font-size: 13px;
  }
  .tag-input::placeholder {
    color: #888888;
  }
  .tag-input:focus {
    outline: none;
    border-color: #0e639c;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 6px;
  }
  .chip {
    padding: 1px 8px;
    border-radius: 10px;
    font-size: 12px;
  }
  .chip.add {
    background: #094771;
    color: #ffffff;
  }
  .remove-list {
    max-height: 30vh;
    overflow-y: auto;
  }
  .remove-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 6px;
    border-radius: 4px;
    font-size: 13px;
    color: #cccccc;
    cursor: pointer;
  }
  .remove-item:hover {
    background: #2a2d2e;
  }
  .remove-item.checked .remove-name {
    color: #f0a090;
    text-decoration: line-through;
  }
  .remove-name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .remove-count {
    flex: none;
    font-size: 11px;
    color: #888888;
  }
  .empty, .hint {
    font-size: 12px;
    color: #888888;
  }
</style>
