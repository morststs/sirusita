<script>
  import { onMount, onDestroy } from 'svelte';
  import monaco from './monaco.js';

  let { body = '', onChange, initialRatio = 0, onScroll, onLineScroll } = $props();

  let container;
  let editor;
  // 親からの body 反映時に onChange ループを起こさないためのフラグ。
  let applyingExternal = false;
  // 分割スクロール同期で、プログラム側スクロールのエコーを無視するための抑止フラグ。
  let suppressScroll = false;
  let suppressTimer = null;

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
      // 分割モードの同期: プログラム由来のスクロール（エコー）は無視する。
      if (!suppressScroll) onLineScroll?.(topSourceLine());
    });
  });

  onDestroy(() => {
    editor?.dispose();
    clearTimeout(suppressTimer);
  });

  // ビューポート先頭に対応する「分数ソース行」（0始まり）を返す。
  function topSourceLine() {
    const ranges = editor.getVisibleRanges();
    if (!ranges.length) return 0;
    const ln = ranges[0].startLineNumber; // 1始まり
    const lineTop = editor.getTopForLineNumber(ln);
    const lh = editor.getOption(monaco.editor.EditorOption.lineHeight);
    const frac = lh > 0 ? (editor.getScrollTop() - lineTop) / lh : 0;
    return (ln - 1) + Math.max(0, Math.min(1, frac));
  }

  // 指定された分数ソース行が先頭に来るようスクロールする（プレビュー側からの同期）。
  export function scrollToSourceLine(line) {
    if (!editor) return;
    const ln = Math.floor(line) + 1; // 1始まり
    const frac = line - Math.floor(line);
    const lh = editor.getOption(monaco.editor.EditorOption.lineHeight);
    const top = editor.getTopForLineNumber(ln) + frac * lh;
    suppressScroll = true;
    editor.setScrollTop(top);
    clearTimeout(suppressTimer);
    suppressTimer = setTimeout(() => { suppressScroll = false; }, 120);
  }

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
