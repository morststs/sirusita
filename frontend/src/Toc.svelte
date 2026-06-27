<script>
  // 見出し一覧パネル。見出しをクリックすると onSelect(id) で親へ通知する。
  let { headings = [], onSelect } = $props();
</script>

<div class="toc">
  <div class="toc-header">見出し</div>
  {#if headings.length === 0}
    <div class="toc-empty">見出しがありません</div>
  {:else}
    <ul class="toc-list">
      {#each headings as h (h.id)}
        <li>
          <button
            class="toc-item"
            style="padding-left: {(h.depth - 1) * 14 + 10}px"
            title={h.text}
            onclick={() => onSelect?.(h.id)}>{h.text}</button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .toc {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #252526;
    border-left: 1px solid #3c3c3c;
    overflow: hidden;
  }
  .toc-header {
    padding: 8px 12px;
    font-size: 12px;
    color: #969696;
    border-bottom: 1px solid #3c3c3c;
    flex-shrink: 0;
  }
  .toc-empty {
    padding: 12px;
    color: #6a6a6a;
    font-size: 13px;
  }
  .toc-list {
    list-style: none;
    margin: 0;
    padding: 4px 0;
    overflow-y: auto;
  }
  .toc-item {
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 4px 10px;
    border: none;
    background: none;
    text-align: left;
    color: #cccccc;
    cursor: pointer;
    font-family: "Noto Sans JP", sans-serif;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .toc-item:hover {
    background: #2a2d2e;
    color: #ffffff;
  }
</style>
