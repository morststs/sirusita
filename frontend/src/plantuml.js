// PlantUML の図を SVG 文字列にする（@plantuml/core = PlantUML 公式の TeaVM 版。Java もサーバーも不要）。
// 重いので Preview から必要になったときだけ動的 import される。
//
// themes.js / emoji.js は同梱しない（GPL のテーマ・CC BY の絵文字を含み、容量も大きいため）。
// そのため !theme はテーマなしで描画され、絵文字の記法は描かれない。
import * as vizNs from '@plantuml/core/viz-global.js';
import { renderToString } from '@plantuml/core';

// viz-global.js（Graphviz のレイアウト）は UMD。バンドル方法によって exports か globalThis.Viz の
// どちらかに載るので、見つかった方をエンジンへ明示的に渡す。
const Viz = [vizNs, vizNs.default, globalThis.Viz].find((v) => typeof v?.instance === 'function');
if (Viz) globalThis.PLANTUML_VIZ = Viz;

// エンジンは !theme や !include <…> のたびに <script> を差し込んで追加ファイルを読みに行く。
// 外部・同梱外のスクリプトを一切読まないよう、すべて失敗として返す（図はテーマなし等で描画される）。
globalThis.PLANTUML_STDLIB_LOADER = (name, ok, fail) => {
  fail(`Sirusita では ${name} を読み込めません（!theme・!include の標準ライブラリは未対応）`);
};

// 絵文字・アイコンの記法（<:smile:> / <&icon>）は、データが未登録だと上のローダーで読みに行き、
// 失敗すると図全体がエラーになる。空の表を登録して「該当なし」として描画を続けさせる。
globalThis.PLANTUML_EMOJI ??= {};
globalThis.PLANTUML_EMOJI_SHORTCUT ??= {};
globalThis.PLANTUML_OPENICONIC ??= {};

// 図の幅・高さの上限(px)。超えるとエラーにする（巨大な SVG で固まるのを防ぐ）。
const MAX_SVG_SIZE = 8192;

// source（```plantuml ブロックの中身）を SVG 文字列にする。
// @startuml がなければ補う（Markdown では省略して書くことが多いため）。
export function renderPlantUML(source) {
  let lines = source.replace(/\r\n?/g, '\n').replace(/\n+$/, '').split('\n');
  if (!lines.some((l) => /^\s*@start[a-z]+/i.test(l))) {
    lines = ['@startuml', ...lines, '@enduml'];
  }
  return new Promise((resolve, reject) => {
    renderToString(
      lines,
      (svg) => resolve(svg),
      (message) => reject(new Error(message)),
      { dark: true, maxSvgSize: MAX_SVG_SIZE },
    );
  });
}
