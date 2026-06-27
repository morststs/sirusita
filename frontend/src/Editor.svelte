<script>
  import { onMount, onDestroy } from 'svelte';
  import monaco from './monaco.js';

  let { body = '', onChange, initialRatio = 0, onScroll } = $props();

  let container;
  let editor;
  // 親からの body 反映時に onChange ループを起こさないためのフラグ。
  let applyingExternal = false;

  onMount(() => {
    editor = monaco.editor.create(container, {
      value: body,
      language: 'markdown',
      theme: 'vs-dark',
      automaticLayout: true,
      wordWrap: 'on',
      minimap: { enabled: false },
      fontSize: 14,
      lineHeight: 22,
      fontFamily: '"Source Code Pro", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      renderWhitespace: 'none',
      padding: { top: 12, bottom: 12 },
      tabSize: 2,
    });

    editor.onDidChangeModelContent(() => {
      if (applyingExternal) return;
      onChange?.(editor.getValue());
    });

    // タブ切り替えで再生成された直後に、前回のスクロール割合を復元する。
    requestAnimationFrame(() => {
      const max = editor.getScrollHeight() - editor.getLayoutInfo().height;
      if (max > 0) editor.setScrollTop(initialRatio * max);
    });

    editor.onDidScrollChange(() => {
      const max = editor.getScrollHeight() - editor.getLayoutInfo().height;
      onScroll?.(max > 0 ? editor.getScrollTop() / max : 0);
    });
  });

  onDestroy(() => {
    editor?.dispose();
  });

  // 親が body を差し替えたとき（別メモを開いた等）にエディタへ反映する。
  // 入力に追従する自己更新ではカーソルが飛ばないよう値が異なる場合のみ setValue する。
  $effect(() => {
    const v = body;
    if (editor && editor.getValue() !== v) {
      applyingExternal = true;
      editor.setValue(v);
      applyingExternal = false;
    }
  });
</script>

<div class="editor" bind:this={container}></div>

<style>
  .editor {
    width: 100%;
    height: 100%;
  }
</style>
