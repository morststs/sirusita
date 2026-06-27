<script>
  import { onMount } from 'svelte';

  let { body = '', onChange, initialRatio = 0, onScroll } = $props();

  let textarea;

  function handleInput(e) {
    onChange?.(e.target.value);
  }

  // タブ切り替えで再マウントされた直後に、前回のスクロール割合を復元する。
  onMount(() => {
    const max = textarea.scrollHeight - textarea.clientHeight;
    if (max > 0) textarea.scrollTop = initialRatio * max;
  });

  function handleScroll() {
    const max = textarea.scrollHeight - textarea.clientHeight;
    onScroll?.(max > 0 ? textarea.scrollTop / max : 0);
  }
</script>

<textarea
  bind:this={textarea}
  class="editor"
  value={body}
  oninput={handleInput}
  onscroll={handleScroll}
  placeholder="マークダウンで入力..."></textarea>

<style>
  .editor {
    box-sizing: border-box;
    display: block;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    resize: none;
    padding: 16px;
    font-family: "Source Code Pro", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 14px;
    line-height: 1.6;
    background: #1e1e1e;
    color: #d4d4d4;
  }
  .editor::placeholder {
    color: #6a6a6a;
  }
</style>
