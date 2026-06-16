<script>
  let { body = '', onChange } = $props();

  function handleInput(e) {
    onChange?.(e.target.value);
  }
</script>

<textarea
  class="editor"
  value={body}
  oninput={handleInput}
  placeholder="マークダウンで入力..."></textarea>

<style>
  .editor {
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
