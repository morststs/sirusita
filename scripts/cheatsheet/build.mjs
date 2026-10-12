// サンプル集の「〇〇 1画面版」（A4 横の SVG チートシート）をまとめて生成する。
//
//   node scripts/cheatsheet/build.mjs           contents/ のメモを書き直す
//   node scripts/cheatsheet/build.mjs --check   生成結果とメモが一致し、載せたコマンドが
//                                               すべて詳しい版のメモにも載っているかを確かめる
//
// 1 枚の内容は 1 ファイル（git.mjs など）。追加したらここの一覧に足す。
import { runSheet } from './lib.mjs';
import bash from './bash.mjs';
import docker from './docker.mjs';
import git from './git.mjs';
import regex from './regex.mjs';

const sheets = [git, docker, bash, regex];

const check = process.argv.includes('--check');
const problems = sheets.flatMap((sheet) => runSheet(sheet, { check }));
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
