<script>
  import { Modal } from 'flowbite-svelte';
  import Preview from './Preview.svelte';
  import { HELP_TITLE, HELP_BODY, APP_VERSION } from './help.js';

  let { open = $bindable(false), fontSize = 15 } = $props();
</script>

<!-- 使い方（contents/ の「Sirusita の使い方」）を読み取り専用のプレビューで表示する。
     ウィンドウいっぱい近くまで広げ、本文だけをスクロールさせる。 -->
<Modal title={HELP_TITLE} bind:open size="none"
  class="help-modal w-[94vw] h-[92vh] max-w-none max-h-none"
  classes={{ body: 'flex-1 min-h-0 flex flex-col' }}>
  <div class="help-body">
    {#if open}
      <div class="help-fill">
        <Preview body={HELP_BODY} {fontSize} />
      </div>
    {/if}
  </div>
  {#snippet footer()}
    <span class="help-version">Sirusita {APP_VERSION}</span>
  {/snippet}
</Modal>

<style>
  .help-body {
    flex: 1;
    min-height: 0;
    position: relative;
    background: #1e1e1e;
    border-radius: 6px;
  }
  .help-fill {
    position: absolute;
    inset: 0;
  }
  .help-version {
    margin-left: auto;
    font-size: 12px;
    color: #999999;
  }
</style>
