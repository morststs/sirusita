<script>
  import { onMount, tick } from 'svelte';
  import DOMPurify from 'dompurify';
  import { renderMarkdown, topLevelLineStarts } from './markdown.js';
  import { OpenURL, RenderD2 } from '../wailsjs/go/main/App';

  let {
    body = '',
    fontSize = 15,
    initialRatio = 0,
    pendingHeadingId = null,
    onScroll,
    onLineScroll,
    onConsumePending,
  } = $props();

  let container;
  // 分割スクロール同期で、プログラム側スクロールのエコーを無視するための抑止フラグ。
  let suppressScroll = false;
  let suppressTimer = null;

  let html = $derived(renderMarkdown(body));
  // 各トップレベルブロックの開始ソース行（renderMarkdown と同じ順序）。
  let lineStarts = $derived(topLevelLineStarts(body));

  // マウント時、ジャンプ要求がなければ前回のスクロール割合を復元する。
  // （ジャンプ要求は下の $effect が担当するので、ここでは触らない）
  onMount(async () => {
    await tick();
    if (!pendingHeadingId) {
      const max = container.scrollHeight - container.clientHeight;
      if (max > 0) container.scrollTop = initialRatio * max;
    }
  });

  // 見出しジャンプ要求に反応する。マウント直後だけでなく、
  // すでにプレビュー表示中に見出しをクリックした場合もここで処理する。
  $effect(() => {
    if (!pendingHeadingId) return;
    // body が変わった直後でも DOM 反映後にジャンプできるよう tick を待つ。
    tick().then(() => {
      if (!pendingHeadingId || !container) return;
      scrollToId(pendingHeadingId);
      onConsumePending?.();
    });
  });

  // 生成された SVG を <pre> と差し替えて表示する。
  // 既定の DOMPurify は SVG を保持しつつ script / on* を除去する。
  // fitNatural=true のとき、viewBox しか持たない SVG（D2）へ自然サイズ(px)を明示し、
  // コンテナ幅へ引き伸ばされて巨大化するのを防ぐ（CSS の max-width で縮小のみ許可）。
  function injectSvg(pre, svg, fitNatural = false) {
    const wrapper = document.createElement('div');
    wrapper.className = 'diagram';
    // スクロール同期用の行アンカーを差し替え後の要素へ引き継ぐ。
    if (pre.dataset.sourceLine != null) wrapper.dataset.sourceLine = pre.dataset.sourceLine;
    wrapper.innerHTML = DOMPurify.sanitize(svg);
    if (fitNatural) {
      const root = wrapper.querySelector('svg');
      const vb = root?.getAttribute('viewBox')?.split(/[\s,]+/);
      if (root && !root.getAttribute('width') && vb?.length === 4) {
        root.setAttribute('width', vb[2]);
        root.setAttribute('height', vb[3]);
      }
    }
    pre.replaceWith(wrapper);
  }

  // 各トップレベル要素に開始ソース行を data-source-line として付与する。
  function assignSourceLines() {
    const children = container.children;
    for (let i = 0; i < children.length && i < lineStarts.length; i++) {
      children[i].dataset.sourceLine = String(lineStarts[i]);
    }
  }

  // 構文エラー時はコードを残し、エラー内容をツールチップに出す。
  function markError(pre, err) {
    pre.classList.add('diagram-error');
    pre.setAttribute('title', String(err?.message || err));
  }

  // Mermaid は重いので、図が存在するときだけ動的に読み込む。
  let mermaidMod = null;

  async function getMermaid() {
    if (!mermaidMod) {
      mermaidMod = (await import('mermaid')).default;
      mermaidMod.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'strict',
        flowchart: { htmlLabels: false },
      });
    }
    return mermaidMod;
  }

  // ```mermaid コードブロックを SVG 図に置き換える。
  async function renderMermaid() {
    const blocks = container.querySelectorAll('pre > code.language-mermaid');
    if (blocks.length === 0) return;
    const mermaid = await getMermaid();
    for (const code of blocks) {
      const pre = code.parentElement;
      const id = 'mermaid-' + Math.random().toString(36).slice(2);
      try {
        const { svg } = await mermaid.render(id, code.textContent || '');
        injectSvg(pre, svg);
      } catch (err) {
        markError(pre, err);
      }
    }
  }

  // ```d2 コードブロックを Go バックエンド（完全オフライン）で SVG 化して置き換える。
  async function renderD2() {
    const blocks = container.querySelectorAll('pre > code.language-d2');
    for (const code of blocks) {
      const pre = code.parentElement;
      try {
        const svg = await RenderD2(code.textContent || '');
        injectSvg(pre, svg, true);
      } catch (err) {
        markError(pre, err);
      }
    }
  }

  // html が変わるたびに行アンカーを付与し、図（Mermaid / D2）を描画し直す。
  $effect(() => {
    void html;
    tick().then(() => {
      if (!container) return;
      assignSourceLines();
      renderMermaid();
      renderD2();
    });
  });

  // data-source-line を持つ要素の {行, コンテンツ内オフセット} 一覧を取得する。
  function collectAnchors() {
    const cTop = container.getBoundingClientRect().top - container.scrollTop;
    const anchors = [];
    for (const el of container.querySelectorAll('[data-source-line]')) {
      anchors.push({
        line: parseInt(el.dataset.sourceLine, 10),
        top: el.getBoundingClientRect().top - cTop,
      });
    }
    return anchors;
  }

  // 現在のスクロール位置に対応する「分数ソース行」を返す（編集側へ報告する用）。
  function topSourceLine() {
    const anchors = collectAnchors();
    if (anchors.length === 0) return 0;
    const y = container.scrollTop;
    for (let i = 0; i < anchors.length; i++) {
      if (anchors[i].top > y) {
        if (i === 0) return anchors[0].line;
        const a = anchors[i - 1], b = anchors[i];
        const r = b.top > a.top ? (y - a.top) / (b.top - a.top) : 0;
        return a.line + r * (b.line - a.line);
      }
    }
    return anchors[anchors.length - 1].line;
  }

  // 指定された分数ソース行が先頭に来るようスクロールする（編集側からの同期）。
  export function scrollToSourceLine(line) {
    const anchors = collectAnchors();
    if (anchors.length === 0) return;
    let target = 0;
    if (line <= anchors[0].line) {
      target = anchors[0].top;
    } else if (line >= anchors[anchors.length - 1].line) {
      target = anchors[anchors.length - 1].top;
    } else {
      for (let i = 1; i < anchors.length; i++) {
        if (anchors[i].line >= line) {
          const a = anchors[i - 1], b = anchors[i];
          const r = b.line > a.line ? (line - a.line) / (b.line - a.line) : 0;
          target = a.top + r * (b.top - a.top);
          break;
        }
      }
    }
    suppressScroll = true;
    container.scrollTop = target;
    clearTimeout(suppressTimer);
    suppressTimer = setTimeout(() => { suppressScroll = false; }, 120);
  }

  function scrollToId(id) {
    const el = container.querySelector('#' + CSS.escape(id));
    if (!el) return;
    // offsetParent に依存しないよう、矩形の差分でスクロール量を算出する。
    const delta = el.getBoundingClientRect().top - container.getBoundingClientRect().top;
    container.scrollTop += delta;
  }

  function handleScroll() {
    const max = container.scrollHeight - container.clientHeight;
    onScroll?.(max > 0 ? container.scrollTop / max : 0);
    // 分割モードの同期: プログラム由来のスクロール（エコー）は無視する。
    if (!suppressScroll) onLineScroll?.(topSourceLine());
  }

  function handleClick(e) {
    if (e.target.tagName === 'A' && e.target.href?.startsWith('http')) {
      e.preventDefault();
      OpenURL(e.target.href);
    }
  }
</script>

<div
  bind:this={container}
  class="preview"
  onclick={handleClick}
  onscroll={handleScroll}
  style="font-size: {fontSize}px">{@html html}</div>

<style>
  .preview {
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
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
  /* 図（Mermaid / D2） */
  .preview :global(.diagram) {
    display: flex;
    justify-content: center;
    margin: 16px 0;
  }
  .preview :global(.diagram svg) {
    max-width: 100%;
    height: auto;
  }
  /* 構文エラー時はコードブロックを赤枠で残す */
  .preview :global(pre.diagram-error) {
    border-color: #d16969;
  }
  /* ブロック数式（$$...$$）は中央寄せ・横スクロール可 */
  .preview :global(.katex-display) {
    margin: 12px 0;
    overflow-x: auto;
    overflow-y: hidden;
  }
</style>
