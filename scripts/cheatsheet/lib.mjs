// A4 横（1123×794 px = 96dpi）の 1 枚もののチートシートを SVG で組む共通部分。
//
// SVG は文字を自動で折り返さないため、文字幅を見積もって折り返し、セクションを
// 段組みに流し込む。入りきらなければ例外にする（内容を削って調整する）。
// 文字幅は多めに見積もるので、実際のフォントでは少し余裕が出る。
// 出力はメモ本文に埋め込む前提で、空行を含めない（マークダウンの HTML ブロックが切れるため）。

export const W = 1123;
export const H = 794;
const M = 16; // 余白
const COLS = 4;
const GAP = 12;
const HEADER_H = 96;
const FOOTER_H = 16;
const COL_W = (W - 2 * M - GAP * (COLS - 1)) / COLS;
const TOP = M + HEADER_H;
const BOTTOM = H - M - FOOTER_H;
export const MARGIN = M;

const SANS = "'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif";
const MONO = "Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace";

export const DESC_FS = 9.6;
const CMD_FS = 10.0;
const DESC_LH = 12.2;
const CMD_LH = 13.4;
const SEC_H = 21; // セクション見出しの帯
const ENTRY_GAP = 4;
const SEC_GAP = 8;
const PAD = 6; // 列内の左右の余白

export const INK = '#1f2933';
export const SUB = '#52606d';
const CMD_BG = '#f2f4f8';
const DANGER = '#c81e1e';
const DANGER_BG = '#fdecec';

// 1 文字の幅（em）。ASCII 以外は全角とみなして 1em、半角は等幅 0.6em / プロポーショナル 0.56em と多めに見積もる。
const charW = (ch, mono) => (ch.codePointAt(0) > 0x7f ? 1.0 : mono ? 0.6 : 0.56);

export function textW(s, fs, mono = false) {
  let w = 0;
  for (const ch of s) w += charW(ch, mono);
  return w * fs;
}

// 見積もった幅で折り返す（日本語は 1 文字単位、英数字の連なりは途中で切らない）。
function wrap(s, fs, width, mono = false) {
  const tokens = [];
  let buf = '';
  for (const ch of s) {
    if (ch.codePointAt(0) <= 0x7f && !/\s/.test(ch)) {
      buf += ch;
    } else {
      if (buf) tokens.push(buf);
      buf = '';
      tokens.push(ch);
    }
  }
  if (buf) tokens.push(buf);
  const lines = [];
  let cur = '';
  for (const t of tokens) {
    if (textW(cur + t, fs, mono) <= width || !cur) {
      cur += t;
    } else {
      lines.push(cur.trimEnd());
      cur = t.trimStart();
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');

// 小数 1 桁の座標（座標の数値はこの形と素の数値の 2 通りで出す）。
export const f1 = (n) => n.toFixed(1);

// <text> 要素。
export function text(x, y, s, fs, fill, { mono = false, weight, anchor } = {}) {
  const attrs = [`x="${f1(x)}"`, `y="${f1(y)}"`, `font-size="${fs}"`, `fill="${fill}"`,
    `font-family="${mono ? MONO : SANS}"`];
  if (weight) attrs.push(`font-weight="${weight}"`);
  if (anchor) attrs.push(`text-anchor="${anchor}"`);
  return `<text ${attrs.join(' ')}>${esc(s)}</text>`;
}

// ---- 内容の部品 -------------------------------------------------------------
// entry: 説明 + コマンドの帯（danger で赤）/ term: 用語と説明の 1 行 / diagram: 任意の図

export const entry = (desc, ...cmds) => ({ kind: 'entry', desc, cmds, danger: false });
export const danger = (desc, ...cmds) => ({ kind: 'entry', desc, cmds, danger: true });
export const term = (name, desc) => ({ kind: 'term', name, desc });
// draw(x, y, width, height, color) が SVG 要素の配列を返す。
export const diagram = (height, draw) => ({ kind: 'diagram', height, draw });

// 1 項目の (高さ, 描画関数) を返す。
function layoutItem(item, innerW) {
  if (item.kind === 'entry') {
    const dl = wrap(item.desc, DESC_FS, innerW);
    const cl = [];
    for (const c of item.cmds) {
      wrap('$ ' + c, CMD_FS, innerW - 8, true).forEach((line, i) => cl.push(i === 0 ? line : '  ' + line));
    }
    const h = dl.length * DESC_LH + cl.length * CMD_LH + 3 + ENTRY_GAP;
    const draw = (x, y, color) => {
      const out = [];
      let yy = y;
      for (const line of dl) {
        out.push(text(x, yy + DESC_FS, line, DESC_FS, SUB));
        yy += DESC_LH;
      }
      yy += 1;
      const bh = cl.length * CMD_LH + 2;
      out.push(`<rect x="${f1(x - 3)}" y="${f1(yy)}" width="${f1(innerW + 6)}" height="${f1(bh)}" rx="3" ` +
        `fill="${item.danger ? DANGER_BG : CMD_BG}"/>`);
      out.push(`<rect x="${f1(x - 3)}" y="${f1(yy)}" width="2.5" height="${f1(bh)}" ` +
        `fill="${item.danger ? DANGER : color}"/>`);
      yy += 1;
      for (const line of cl) {
        out.push(text(x + 3, yy + CMD_FS, line, CMD_FS, item.danger ? DANGER : INK, { mono: true }));
        yy += CMD_LH;
      }
      return out;
    };
    return [h, draw];
  }
  if (item.kind === 'term') {
    const tw = textW(item.name, CMD_FS, true) + 6;
    if (tw + textW(item.desc, DESC_FS) > innerW) throw new Error(`用語が長すぎる: ${item.name}`);
    const draw = (x, y, color) => [
      text(x, y + CMD_FS, item.name, CMD_FS, color, { mono: true, weight: '700' }),
      text(x + tw, y + CMD_FS, item.desc, DESC_FS, SUB),
    ];
    return [CMD_LH + 1, draw];
  }
  if (item.kind === 'diagram') {
    const draw = (x, y, color) => item.draw(x, y + 6, innerW, item.height, color);
    return [item.height + 6 + ENTRY_GAP, draw];
  }
  throw new Error(`不明な項目: ${item.kind}`);
}

// ---- 流し込み ----------------------------------------------------------------

/**
 * チートシートの SVG を組み立てる。
 * @param {object} sheet
 * @param {string} sheet.label      aria-label
 * @param {string} sheet.accent     上端の帯の色
 * @param {() => string[]} sheet.header  ヘッダー（上から HEADER_H の範囲）の要素
 * @param {Array<{title: string, color: string, items: object[]}>} sheet.sections
 * @param {[string, string]} sheet.footer  左下・右下の文字
 * @returns {{svg: string, spare: number}}  spare は最後の列の残り（px）
 */
export function buildSvg(sheet) {
  const innerW = COL_W - 2 * PAD;
  let col = 0;
  let y = TOP;
  const body = [];
  const colX = (c) => M + c * (COL_W + GAP);

  for (const { title, color, items } of sheet.sections) {
    const laid = items.map((it) => layoutItem(it, innerW));
    // 列の下に見出し + 1〜2 件だけ残して分かれるなら、セクションごと次の列へ
    const total = SEC_H + laid.reduce((s, [h]) => s + h, 0);
    const headH = SEC_H + laid.slice(0, 2).reduce((s, [h]) => s + h, 0);
    if (y + total > BOTTOM && y + headH + 40 > BOTTOM) {
      col += 1;
      y = TOP;
    }
    if (col >= COLS) throw new Error(`入りきらない: ${title}`);
    let x = colX(col);
    body.push(`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(COL_W)}" height="${SEC_H - 4}" rx="4" fill="${color}"/>`);
    body.push(text(x + PAD + 1, y + 12.5, title, 11.5, '#ffffff', { weight: '700' }));
    y += SEC_H;
    for (const [h, draw] of laid) {
      if (y + h > BOTTOM) {
        col += 1;
        y = TOP;
        if (col >= COLS) throw new Error(`入りきらない: ${title} の途中`);
        x = colX(col);
        body.push(text(x + PAD, y + 9, `${title}（続き）`, 9.5, color, { weight: '700' }));
        y += 14;
      }
      body.push(...draw(x + PAD, y, color));
      y += h;
    }
    y += SEC_GAP;
  }

  // 列の区切り線
  for (let c = 1; c < COLS; c++) {
    const lx = M + c * (COL_W + GAP) - GAP / 2;
    body.unshift(`<line x1="${f1(lx)}" y1="${TOP}" x2="${f1(lx)}" y2="${BOTTOM}" stroke="#e4e7eb" stroke-width="1"/>`);
  }

  const footer = [
    text(M, H - M + 2, sheet.footer[0], 8.5, '#9aa5b1'),
    text(W - M, H - M + 2, sheet.footer[1], 8.5, '#9aa5b1', { anchor: 'end' }),
  ];
  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(sheet.label)}">`,
    `<rect x="0" y="0" width="${W}" height="${H}" rx="6" fill="#ffffff"/>`,
    `<rect x="0" y="0" width="${W}" height="5" fill="${sheet.accent}"/>`,
    `<line x1="${M}" y1="${TOP - 10}" x2="${W - M}" y2="${TOP - 10}" stroke="#e4e7eb" stroke-width="1"/>`,
    ...sheet.header(),
    ...body,
    ...footer,
    '</svg>',
  ];
  return { svg: parts.filter(Boolean).join('\n'), spare: BOTTOM - y };
}

// セクションに載せたコマンドの一覧（折り返す前の形）。
export const commandsOf = (sections) =>
  sections.flatMap((s) => s.items).flatMap((it) => (it.kind === 'entry' ? it.cmds : []));

// マークダウンに書かれたコマンドの集合（コードスパン `…` と、フェンスで囲んだコードブロックの各行）。
// 部分一致で探すと git stash が git stash list などに一致してしまうため、まとまりごとに集める。
export function commandsInMarkdown(md) {
  const found = new Set();
  const fence = /^```[^\n]*\n([\s\S]*?)^```/gm;
  for (const m of md.matchAll(fence)) {
    for (const line of m[1].split('\n')) found.add(line.trim());
  }
  for (const m of md.replace(fence, '').matchAll(/`([^`\n]+)`/g)) found.add(m[1]);
  return found;
}
