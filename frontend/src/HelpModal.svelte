<script>
  import { Modal } from 'flowbite-svelte';
  import Preview from './Preview.svelte';
  import { HELP_TITLE, HELP_BODY } from './help.js';

  let { open = $bindable(false), fontSize = 15 } = $props();
</script>

<!-- 使い方（contents/ の「Sirusita の使い方」）を読み取り専用のプレビューで表示する -->
<Modal title={HELP_TITLE} bind:open size="xl">
  <div class="help-body">
    {#if open}
      <Preview body={HELP_BODY} {fontSize} />
    {/if}
  </div>
</Modal>

<style>
  .help-body {
    height: 70vh;
    background: #1e1e1e;
    border-radius: 6px;
  }
</style>
