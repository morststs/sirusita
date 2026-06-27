import { Marked } from 'marked';
import markedKatex from 'marked-katex-extension';
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
