// A4 横（1123×794 px = 96dpi）の 1 枚もののチートシートを SVG で組む共通部分。
//
// SVG は文字を自動で折り返さないため、文字幅を見積もって折り返し、セクションを
// 段組みに流し込む。入りきらなければ例外にする（内容を削って調整する）。
// 文字幅は多めに見積もるので、実際のフォントでは少し余裕が出る。
// 出力はメモ本文に埋め込む前提で、空行を含めない（マークダウンの HTML ブロックが切れるため）。

import { readFileSync, writeFileSync } from 'node:fs';

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

export const DESC_FS = 9.6; // 説明の文字の大きさ（倍率 1 のとき。ヘッダーや図でも使う）

// 本文の寸法。内容が少ないシートは倍率を上げて紙面を使い切る（buildSvg が倍率を選ぶ）。
const r2 = (n) => Math.round(n * 100) / 100;
const metrics = (scale) => ({
  descFs: r2(DESC_FS * scale),
  cmdFs: r2(10.0 * scale),
  descLh: r2(12.2 * scale),
  cmdLh: r2(13.4 * scale),
  secH: r2(21 * scale), // セクション見出しの帯
  secFs: r2(11.5 * scale),
  entryGap: r2(4 * scale),
  secGap: r2(8 * scale),
});
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

// 行頭に置かない文字（閉じ括弧・句読点）
const NO_LINE_START = new Set([...'）)」』】、。，．,.:：']);

// 見積もった幅で折り返す。
// 説明文: 日本語は 1 文字単位、英数字の連なりと <…> は途中で切らない。閉じ括弧・句読点は行頭に置かない。
// コマンド（mono）: 空白の位置で折り返す（1 行に入らない長い語だけは文字の途中で折り返す）。
function wrap(s, fs, width, mono = false) {
  const tokens = [];
  if (mono) {
    for (const m of s.matchAll(/\s+|\S+/g)) {
      // 1 行に入らない長い語（空白の無い正規表現など）は 1 文字ずつに分けて折り返す
      if (textW(m[0], fs, true) > width) tokens.push(...m[0]);
      else tokens.push(m[0]);
    }
  } else {
    let buf = '';
    const flush = () => {
      if (buf) tokens.push(buf);
      buf = '';
    };
    const chars = [...s];
    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      const close = ch === '<' ? chars.indexOf('>', i) : -1;
      if (close > i) {
        flush();
        tokens.push(chars.slice(i, close + 1).join(''));
        i = close;
      } else if (ch.codePointAt(0) <= 0x7f && !/\s/.test(ch)) {
        buf += ch;
      } else {
        flush();
        tokens.push(ch);
      }
    }
    flush();
  }
  // 行はトークンの配列で持つ（行頭禁則で送るときに語の途中で切らないため）
  const lines = [];
  let cur = [];
  const w = (ts) => textW(ts.join(''), fs, mono);
  for (const t of tokens) {
    if (!cur.length || w([...cur, t]) <= width) {
      cur.push(t);
    } else if (NO_LINE_START.has(t) && cur.length > 1) {
      // 閉じ括弧などを行頭に送らず、直前のトークンと一緒に次の行へ
      lines.push(cur.slice(0, -1).join('').trimEnd());
      cur = [cur[cur.length - 1], t];
    } else {
      lines.push(cur.join('').trimEnd());
      cur = t.trim() ? [t.trimStart()] : [];
    }
  }
  if (cur.length) lines.push(cur.join(''));
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

// ---- ヘッダーの部品 ----------------------------------------------------------

// 左上の題名（大きな見出し語 + 小見出し）と、その下の注記。
export function titleBlock(main, sub, note, accent) {
  const subX = M + Math.round(textW(main, 30) * 1.12) + 10;
  return [
    text(M, M + 30, main, 30, accent, { weight: '800' }),
    text(subX, M + 30, sub, 22, INK, { weight: '700' }),
    text(M, M + 52, note, DESC_FS + 0.6, SUB),
  ];
}

/**
 * 右上の流れ図。箱を横に並べ、隣の箱への矢印を上段に、戻る向き（任意の箱どうし）を下段に描く。
 * @param {string[]} boxes
 * @param {Array<string|null>} forward  箱 i → i+1 の矢印のラベル（null なら描かない）
 * @param {Array<[number, number, number, string, string]>} back  [出発, 到着, 段, ラベル, 色]。
 *   段 0 は隣り合う矢印が同じ箱で重ならないよう、出発を中心の左 8px、到着を右 8px にずらす
 */
export function flow({ boxes, forward, back = [], boxW = 86, gap = 70, fwdColor = '#16a34a' }) {
  const out = [];
  const bh = 26;
  const x0 = W - M - (boxW * boxes.length + gap * (boxes.length - 1));
  const by = M + 14;
  boxes.forEach((name, i) => {
    const bx = x0 + i * (boxW + gap);
    out.push(`<rect x="${bx}" y="${by}" width="${boxW}" height="${bh}" rx="5" fill="#ffffff" stroke="#cbd2d9" stroke-width="1.2"/>`);
    out.push(text(bx + boxW / 2, by + 17, name, 11, INK, { weight: '600', anchor: 'middle' }));
  });
  forward.forEach((label, i) => {
    if (label == null) return;
    const sx = x0 + i * (boxW + gap) + boxW + 4;
    const ex = sx + gap - 8;
    out.push(`<path d="M${sx} ${by + 9} L${ex - 5} ${by + 9}" stroke="${fwdColor}" stroke-width="1.6"/>`);
    out.push(`<path d="M${ex - 5} ${by + 5.5} l6 3.5 l-6 3.5 z" fill="${fwdColor}"/>`);
    out.push(text((sx + ex) / 2, by + 4, label, 9.5, fwdColor, { mono: true, anchor: 'middle' }));
  });
  for (const [a, b, level, label, col] of back) {
    const sx = x0 + a * (boxW + gap) + boxW / 2 - (level === 0 ? 8 : 0);
    const ex = x0 + b * (boxW + gap) + boxW / 2 + (level === 0 ? 8 : -8);
    const yy = by + bh + 8 + level * 20;
    out.push(`<path d="M${sx} ${by + bh} L${sx} ${yy} L${ex} ${yy} L${ex} ${by + bh + 5}" fill="none" stroke="${col}" stroke-width="1.3"/>`);
    out.push(`<path d="M${ex - 3.5} ${by + bh + 6} l3.5 -6 l3.5 6 z" fill="${col}"/>`);
    out.push(text((sx + ex) / 2, yy + 10, label, 9, col, { mono: true, anchor: 'middle' }));
  }
  return out;
}

// ---- 内容の部品 -------------------------------------------------------------
// entry: 説明 + コマンドの帯（danger で赤）/ term: 用語と説明の 1 行 /
// pair: 「記法｜意味」の 2 列の行（記法の列幅はセクションの keyW）/ diagram: 任意の図

export const entry = (desc, ...cmds) => ({ kind: 'entry', desc, cmds, danger: false });
export const danger = (desc, ...cmds) => ({ kind: 'entry', desc, cmds, danger: true });
export const term = (name, desc) => ({ kind: 'term', name, desc });
export const pair = (key, desc) => ({ kind: 'pair', key, desc });
// draw(x, y, width, height, color) が SVG 要素の配列を返す。
export const diagram = (height, draw) => ({ kind: 'diagram', height, draw });

// 1 項目の (高さ, 描画関数) を返す。この倍率で組めない（用語が 1 行に収まらない）ときは null。
// prompt はコマンドの先頭に付ける文字（シェルなら "$ "）、keyW は pair の記法の列幅。
function layoutItem(item, innerW, { prompt, keyW, k }) {
  if (item.kind === 'entry') {
    const dl = wrap(item.desc, k.descFs, innerW);
    const cl = [];
    for (const c of item.cmds) {
      const indent = ' '.repeat(prompt.length);
      wrap(prompt + c, k.cmdFs, innerW - 8, true).forEach((line, i) => cl.push(i === 0 ? line : indent + line));
    }
    const h = dl.length * k.descLh + cl.length * k.cmdLh + 3 + k.entryGap;
    const draw = (x, y, color) => {
      const out = [];
      let yy = y;
      for (const line of dl) {
        out.push(text(x, yy + k.descFs, line, k.descFs, SUB));
        yy += k.descLh;
      }
      yy += 1;
      const bh = cl.length * k.cmdLh + 2;
      out.push(`<rect x="${f1(x - 3)}" y="${f1(yy)}" width="${f1(innerW + 6)}" height="${f1(bh)}" rx="3" ` +
        `fill="${item.danger ? DANGER_BG : CMD_BG}"/>`);
      out.push(`<rect x="${f1(x - 3)}" y="${f1(yy)}" width="2.5" height="${f1(bh)}" ` +
        `fill="${item.danger ? DANGER : color}"/>`);
      yy += 1;
      for (const line of cl) {
        out.push(text(x + 3, yy + k.cmdFs, line, k.cmdFs, item.danger ? DANGER : INK, { mono: true }));
        yy += k.cmdLh;
      }
      return out;
    };
    return [h, draw];
  }
  if (item.kind === 'term') {
    const tw = textW(item.name, k.cmdFs, true) + 6;
    if (tw + textW(item.desc, k.descFs) > innerW) return null; // この倍率では 1 行に収まらない
    const draw = (x, y, color) => [
      text(x, y + k.cmdFs, item.name, k.cmdFs, color, { mono: true, weight: '700' }),
      text(x + tw, y + k.cmdFs, item.desc, k.descFs, SUB),
    ];
    return [k.cmdLh + 1, draw];
  }
  if (item.kind === 'pair') {
    const kl = wrap(item.key, k.cmdFs, keyW - 4, true);
    const dl = wrap(item.desc, k.descFs, innerW - keyW - 2);
    const h = Math.max(kl.length * k.cmdLh, dl.length * k.descLh + 1.2) + 4;
    const draw = (x, y) => {
      const out = [`<rect x="${f1(x - 3)}" y="${f1(y)}" width="${f1(keyW)}" height="${f1(h - 2)}" rx="2" fill="${CMD_BG}"/>`];
      kl.forEach((line, i) => out.push(text(x, y + 1 + k.cmdFs + i * k.cmdLh, line, k.cmdFs, INK, { mono: true })));
      dl.forEach((line, i) => out.push(text(x + keyW + 2, y + 1 + k.cmdFs + i * k.descLh, line, k.descFs, SUB)));
      return out;
    };
    return [h, draw];
  }
  if (item.kind === 'diagram') {
    const draw = (x, y, color) => item.draw(x, y + 6, innerW, item.height, color);
    return [item.height + 6 + k.entryGap, draw];
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
 * @param {string} [sheet.prompt]  コマンドの先頭に付ける文字（既定 "$ "。正規表現などは ""）
 * @param {Array<{title: string, color: string, items: object[], keyW?: number, prompt?: string}>} sheet.sections
 * @param {[string, string]} sheet.footer  左下・右下の文字
 * @returns {{svg: string, spare: number, scale: number}}  spare は最後の列の残り（px）、scale は文字の倍率
 */
export function buildSvg(sheet) {
  const innerW = COL_W - 2 * PAD;
  const colX = (c) => M + c * (COL_W + GAP);
  const prompt = sheet.prompt ?? '$ ';
  const layout = (k) => {
    const sections = sheet.sections.map(({ title, color, items, keyW = 92, prompt: own }) => ({
      title, color, laid: items.map((it) => layoutItem(it, innerW, { prompt: own ?? prompt, keyW, k })),
    }));
    return sections.some((s) => s.laid.includes(null)) ? null : sections;
  };

  // 列の下端を bottom として流し込む。入りきらなければ null。
  const pour = (sections, k, bottom) => {
    let col = 0;
    let y = TOP;
    const body = [];
    for (const { title, color, laid } of sections) {
      // 列の下に見出し + 1〜2 件だけ残して分かれるなら、セクションごと次の列へ
      const total = k.secH + laid.reduce((s, [h]) => s + h, 0);
      const headH = k.secH + laid.slice(0, 2).reduce((s, [h]) => s + h, 0);
      if (y + total > bottom && y + headH + 40 > bottom) {
        col += 1;
        y = TOP;
      }
      if (col >= COLS) return null;
      let x = colX(col);
      body.push(`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(COL_W)}" height="${f1(k.secH - 4)}" rx="4" fill="${color}"/>`);
      body.push(text(x + PAD + 1, y + k.secH * 0.6, title, k.secFs, '#ffffff', { weight: '700' }));
      y += k.secH;
      for (const [h, draw] of laid) {
        if (y + h > bottom) {
          col += 1;
          y = TOP;
          if (col >= COLS) return null;
          x = colX(col);
          body.push(text(x + PAD, y + k.descFs, `${title}（続き）`, k.descFs, color, { weight: '700' }));
          y += k.descLh + 2;
        }
        body.push(...draw(x + PAD, y, color));
        y += h;
      }
      y += k.secGap;
    }
    return { body, spare: BOTTOM - y, cols: col + 1 };
  };

  // 4 列に収まる一番大きい文字の倍率（1.3 倍まで）を選ぶ
  let k;
  let sections;
  let best = null;
  let scale = 1.3;
  for (; scale >= 1 - 1e-9; scale = r2(scale - 0.02)) {
    k = metrics(scale);
    sections = layout(k);
    best = sections && pour(sections, k, BOTTOM);
    if (best) break;
  }
  if (!best) throw new Error(`${sheet.label}: 4 列に入りきらない（内容を削る）`);
  // 下端を少しずつ上げ、4 列に収まる一番低い（＝列の高さがそろう）位置で組む
  for (let bottom = BOTTOM - 4; bottom > TOP + 100; bottom -= 4) {
    const r = pour(sections, k, bottom);
    if (!r || r.cols < best.cols) break;
    best = r;
  }
  const { body, spare } = best;

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
  return { svg: parts.filter(Boolean).join('\n'), spare, scale };
}

// セクションに載せたコマンドの一覧（折り返す前の形）。
export const commandsOf = (sections) =>
  sections.flatMap((s) => s.items).flatMap((it) => (it.kind === 'entry' ? it.cmds : it.kind === 'pair' ? [it.key] : []));

// マークダウンに書かれたコマンドの集合（コードスパン `…` と、フェンスで囲んだコードブロックの各行）。
// 部分一致で探すと git stash が git stash list などに一致してしまうため、まとまりごとに集める。
export function commandsInMarkdown(md) {
  const found = new Set();
  const fence = /^```[^\n]*\n([\s\S]*?)^```/gm;
  for (const m of md.matchAll(fence)) {
    for (const line of m[1].split('\n')) found.add(line.trim());
  }
  // 表の中では | を \| と書くので戻す
  for (const m of md.replace(fence, '').matchAll(/`([^`\n]+)`/g)) found.add(m[1].replace(/\\\|/g, '|'));
  return found;
}

// ---- メモの書き出し ----------------------------------------------------------

const contents = (name) => new URL(`../../contents/${name}.md`, import.meta.url);

// チートシートのメモ本文（front matter + 説明 + SVG + 作り方）。
export function noteOf(sheet, svg) {
  const tags = sheet.tags.map((t) => `  - "${t}"`).join('\n');
  return `---
title: "${sheet.name} 1画面版"
tags:
${tags}
created: ${sheet.created}
modified: ${sheet.created}
sirusita: "1"
---

A4 横（297×210mm）の比率で 1 枚にまとめた${sheet.what ?? ` ${sheet.name.split(' ')[0]} `}のチートシートです。プレビューの幅に合わせて全体が拡大・縮小されます。各${sheet.unit ?? 'コマンド'}の詳しい説明は「${sheet.name}」を見てください。

${svg}

## この画面の作り方

全体が 1 つの SVG（\`viewBox="0 0 1123 794"\` = A4 横を 96dpi で表した大きさ）です。座標を固定して描いているので、ウィンドウの幅が変わってもレイアウトは崩れず、拡大・縮小されるだけです。

- \`<svg>\` から \`</svg>\` までの間に**空行を入れない**でください。空行があると、そこでマークダウンの HTML として扱われなくなります。
- SVG の文字は自動で折り返されません。行を増やすときは \`<text>\` の \`y\` を 1 行分ずらして追加します。
- 図や文字の位置は \`x\` / \`y\`（左上が 0、右が x、下が y）で決まります。
- このメモは Sirusita のリポジトリの \`scripts/cheatsheet/\` で生成しています。
`;
}

/**
 * 1 枚分を生成して書き出す。check のときは書き出さずに、メモが生成結果と一致するかと、
 * 載せたコマンドがすべて詳しい版（contents/<name>.md）にも載っているかを確かめる。
 * @returns {string[]} 問題の一覧（空なら OK）
 */
export function runSheet(sheet, { check }) {
  const { svg, spare, scale } = buildSvg(sheet);
  const note = noteOf(sheet, svg);
  const out = contents(`${sheet.name} 1画面版`);
  const problems = [];
  if (check) {
    if (readFileSync(out, 'utf8') !== note) problems.push(`「${sheet.name} 1画面版」が生成結果と違う（--check を外して実行すると書き直す）`);
    const known = commandsInMarkdown(readFileSync(contents(sheet.name), 'utf8'));
    for (const c of commandsOf(sheet.sections)) {
      if (!known.has(c)) problems.push(`「${sheet.name}」に載っていない: ${c}`);
    }
  } else {
    writeFileSync(out, note);
  }
  console.log(`${sheet.name} 1画面版: 文字 ${scale} 倍、最後の列の残り ${Math.round(spare)}px${problems.length ? '' : ' ok'}`);
  return problems;
}
