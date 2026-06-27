import { Marked } from 'marked';
import markedKatex from 'marked-katex-extension';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js/lib/common';
import DOMPurify from 'dompurify';

// 見出しに連番 ID（heading-0, heading-1, ...）を振る Marked インスタンス。
// renderMarkdown / extractHeadings は同じ走査順で見出しを数えるため、
// TOC のリンク（#heading-N）とプレビュー内の id が必ず一致する。
let headingCounter = 0;

const md = new Marked({
  renderer: {
    heading(token) {
      const text = this.parser.parseInline(token.tokens);
      const id = `heading-${headingCounter++}`;
      return `<h${token.depth} id="${id}">${text}</h${token.depth}>\n`;
    },
  },
});

// 数式対応（KaTeX）。$...$ / $$...$$ をその場でレンダリングする。
// output: 'html' で MathML を出さず span のみにし、DOMPurify を通しても崩れないようにする。
md.use(
  markedKatex({
    throwOnError: false,
    output: 'html',
  }),
);

// HTML エスケープ（図のソースをそのまま <pre><code> に流すため）。
function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// シンタックスハイライト（Highlight.js）。コードブロックを言語別に色付けする。
// mermaid / d2 は Preview 側で図に変換するため、ここではハイライトせず素のまま残す。
md.use(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      if (lang === 'mermaid' || lang === 'd2') {
        return escapeHtml(code);
      }
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  }),
);

// インライントークンからプレーンテキストを取り出す（TOC 表示用）。
function inlineText(tokens) {
  if (!tokens) return '';
  return tokens
    .map((t) => (t.tokens ? inlineText(t.tokens) : t.text || ''))
    .join('');
}

// マークダウン本文を安全な HTML に変換する（見出しに id 付き）。
export function renderMarkdown(body) {
  headingCounter = 0;
  return DOMPurify.sanitize(md.parse(body || ''));
}

// 各トップレベルブロックの開始ソース行（0始まり）を順番に返す。
// renderMarkdown と同じトークン順なので、レンダリング後のトップレベル要素へ
// 順番に対応づければ「要素 ↔ ソース行」のアンカーになる（分割スクロール同期用）。
// 空行（space）/ リンク定義（def）は要素を生成しないので除外する。
export function topLevelLineStarts(body) {
  const tokens = md.lexer(body || '');
  const starts = [];
  let line = 0;
  for (const t of tokens) {
    if (t.type !== 'space' && t.type !== 'def') {
      starts.push(line);
    }
    line += ((t.raw || '').match(/\n/g) || []).length;
  }
  return starts;
}

// 本文から見出し一覧を抽出する。renderMarkdown と同じ順序で番号を振るため、
// id はプレビュー側の見出し id と一致する。
export function extractHeadings(body) {
  const tokens = md.lexer(body || '');
  const headings = [];
  let i = 0;
  for (const t of tokens) {
    if (t.type === 'heading') {
      headings.push({
        id: `heading-${i}`,
        depth: t.depth,
        text: inlineText(t.tokens) || t.text || '',
      });
      i++;
    }
  }
  return headings;
}
