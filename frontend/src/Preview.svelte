<script>
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';
  import { OpenURL } from '../wailsjs/go/main/App';

  let { body = '', fontSize = 15 } = $props();

  let html = $derived(DOMPurify.sanitize(marked(body || '')));

  function handleClick(e) {
    if (e.target.tagName === 'A' && e.target.href?.startsWith('http')) {
      e.preventDefault();
      OpenURL(e.target.href);
    }
  }
</script>

<div class="preview" onclick={handleClick} style="font-size: {fontSize}px">{@html html}</div>

<style>
  .preview {
    padding: 16px;
    line-height: 1.6;
    color: #d4d4d4;
  }
  .preview :global(h1) { font-size: 1.6em; margin: 16px 0 8px; color: #e7e7e7; }
  .preview :global(h2) { font-size: 1.35em; margin: 14px 0 6px; color: #e7e7e7; }
  .preview :global(h3) { font-size: 1.1em; margin: 12px 0 4px; color: #e7e7e7; }
  .preview :global(p) { margin: 8px 0; }
  .preview :global(a) { color: #3794ff; text-decoration: none; }
  .preview :global(a:hover) { text-decoration: underline; }
  .preview :global(code) {
    background: #2d2d2d;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 0.88em;
    font-family: "Source Code Pro", "SFMono-Regular", Consolas, monospace;
    color: #ce9178;
  }
  .preview :global(pre) {
    background: #1e1e1e;
    border: 1px solid #3c3c3c;
    padding: 12px;
    border-radius: 6px;
    overflow-x: auto;
  }
  .preview :global(pre code) {
    background: none;
    color: #d4d4d4;
    padding: 0;
  }
  .preview :global(ul), .preview :global(ol) {
    padding-left: 24px;
    margin: 8px 0;
  }
  .preview :global(blockquote) {
    border-left: 3px solid #007acc;
    padding-left: 12px;
    color: #969696;
    margin: 8px 0;
  }
  .preview :global(hr) {
    border: none;
    border-top: 1px solid #3c3c3c;
    margin: 16px 0;
  }
  .preview :global(table) {
    border-collapse: collapse;
    margin: 8px 0;
  }
  .preview :global(th), .preview :global(td) {
    border: 1px solid #3c3c3c;
    padding: 6px 12px;
  }
  .preview :global(th) {
    background: #2d2d2d;
    color: #e7e7e7;
  }
</style>
