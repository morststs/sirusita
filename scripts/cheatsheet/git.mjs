// サンプル集の「Git コマンド 1画面版」（A4 横の SVG チートシート）を生成する。
//
//   node scripts/cheatsheet/git.mjs           contents/ のメモを書き直す
//   node scripts/cheatsheet/git.mjs --check   生成結果とメモが一致し、全コマンドが
//                                             「Git コマンド」にも載っているかを確かめる
//
// 内容を変えるときは、詳しい版の「Git コマンド」（contents/Git コマンド.md）と用語・
// プレースホルダーをそろえる（--check が 1画面版のコマンドの載り漏れを検出する）。
import { readFileSync, writeFileSync } from 'node:fs';
import {
  buildSvg, commandsInMarkdown, commandsOf, danger, diagram, entry, term, text,
  DESC_FS, INK, MARGIN as M, SUB, W, f1,
} from './lib.mjs';

const OUT = new URL('../../contents/Git コマンド 1画面版.md', import.meta.url);
const DETAIL = new URL('../../contents/Git コマンド.md', import.meta.url);

// ---- 図 ------------------------------------------------------------------------

const MAIN_C = '#94a3b8';

function commit(cx, cy, fill, stroke) {
  const s = stroke ? ` stroke="${stroke}" stroke-width="1.6"` : '';
  return `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="5" fill="${fill}"${s}/>`;
}

// feature を main へ --no-ff でマージした形
function mergeGraph(x, y, w, h, color) {
  const out = [];
  const [y1, y2] = [y + 12, y + 34];
  const xs = [0, 1, 2, 3, 4, 5].map((i) => x + 12 + i * 30);
  out.push(`<line x1="${xs[0]}" y1="${y1}" x2="${xs[5]}" y2="${y1}" stroke="${MAIN_C}" stroke-width="2"/>`);
  out.push(`<path d="M${xs[1]} ${y1} L${xs[2]} ${y2} L${xs[4]} ${y2} L${xs[5]} ${y1}" fill="none" stroke="${color}" stroke-width="2"/>`);
  for (const i of [0, 1, 3]) out.push(commit(xs[i], y1, MAIN_C));
  for (const i of [2, 4]) out.push(commit(xs[i], y2, color));
  out.push(commit(xs[5], y1, '#ffffff', color));
  out.push(text(xs[5] + 9, y1 + 3.5, 'マージコミット', DESC_FS - 0.6, SUB));
  out.push(text(xs[4] + 9, y2 + 3.5, 'feature', DESC_FS - 0.6, color, { mono: true }));
  return out;
}

// 前: main から分岐した feature / 後: main の先端に付け直した feature
function rebaseGraph(x, y, w, h, color) {
  const out = [];
  const [y1, y2] = [y + 12, y + 30];
  const xs = [0, 1, 2, 3].map((i) => x + 14 + i * 26);
  out.push(text(x, y + 4, '前', DESC_FS - 1, SUB));
  out.push(`<line x1="${xs[0]}" y1="${y1}" x2="${xs[2]}" y2="${y1}" stroke="${MAIN_C}" stroke-width="2"/>`);
  out.push(`<path d="M${xs[0]} ${y1} L${xs[1]} ${y2} L${xs[2]} ${y2}" fill="none" stroke="${color}" stroke-width="2"/>`);
  for (const i of [0, 1, 2]) out.push(commit(xs[i], y1, MAIN_C));
  out.push(commit(xs[1], y2, color));
  out.push(commit(xs[2], y2, color));
  const ax = xs[2] + 22;
  out.push(`<path d="M${ax} ${y + 21} l14 0" stroke="${SUB}" stroke-width="1.4"/>`);
  out.push(`<path d="M${ax + 14} ${y + 17.5} l5 3.5 l-5 3.5 z" fill="${SUB}"/>`);
  const bx = [0, 1, 2, 3, 4, 5].map((i) => ax + 34 + i * 26);
  out.push(text(ax + 30, y + 4, '後', DESC_FS - 1, SUB));
  out.push(`<line x1="${bx[0]}" y1="${y1}" x2="${bx[2]}" y2="${y1}" stroke="${MAIN_C}" stroke-width="2"/>`);
  out.push(`<path d="M${bx[2]} ${y1} L${bx[3]} ${y2} L${bx[4]} ${y2}" fill="none" stroke="${color}" stroke-width="2"/>`);
  for (const i of [0, 1, 2]) out.push(commit(bx[i], y1, MAIN_C));
  out.push(commit(bx[3], y2, color));
  out.push(commit(bx[4], y2, color));
  out.push(text(x, y + 50, 'feature のコミットは作り直される（ID が変わる）', DESC_FS - 0.6, SUB));
  return out;
}

// ヘッダー: 題名と、右側にデータの流れ（作業ツリー → ステージ → ローカル → リモート）
function header() {
  const out = [
    text(M, M + 30, 'Git', 30, '#f05133', { weight: '800' }),
    text(M + 62, M + 30, 'コマンド チートシート', 22, INK, { weight: '700' }),
    text(M, M + 52, '< > の部分は実際の値に置き換える。赤は元に戻しにくい操作。詳しくは「Git コマンド」', DESC_FS + 0.6, SUB),
  ];
  const boxes = ['作業ツリー', 'ステージ', 'ローカル', 'リモート'];
  const [bw, bh, gap] = [86, 26, 70];
  const x0 = W - M - (bw * 4 + gap * 3);
  const by = M + 14;
  boxes.forEach((name, i) => {
    const bx = x0 + i * (bw + gap);
    out.push(`<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="5" fill="#ffffff" stroke="#cbd2d9" stroke-width="1.2"/>`);
    out.push(text(bx + bw / 2, by + 17, name, 11, INK, { weight: '600', anchor: 'middle' }));
  });
  ['add', 'commit', 'push'].forEach((label, i) => {
    const sx = x0 + i * (bw + gap) + bw + 4;
    const ex = sx + gap - 8;
    out.push(`<path d="M${sx} ${by + 9} L${ex - 5} ${by + 9}" stroke="#16a34a" stroke-width="1.6"/>`);
    out.push(`<path d="M${ex - 5} ${by + 5.5} l6 3.5 l-6 3.5 z" fill="#16a34a"/>`);
    out.push(text((sx + ex) / 2, by + 4, label, 9.5, '#16a34a', { mono: true, anchor: 'middle' }));
  });
  // 戻る向き。隣り合う矢印が同じ箱で重ならないよう、段 0 は出発を中心の左 8px、到着を右 8px にずらす。
  // restore の戻し元は既定でステージ、restore --staged はローカル（HEAD）からステージへ戻す。
  const back = [
    [1, 0, 0, 'restore', '#ea580c'], [2, 1, 0, 'restore --staged', '#ea580c'],
    [3, 2, 0, 'fetch', '#0284c7'], [2, 0, 1, 'switch', '#2563eb'],
  ];
  for (const [a, b, level, label, col] of back) {
    const sx = x0 + a * (bw + gap) + bw / 2 - (level === 0 ? 8 : 0);
    const ex = x0 + b * (bw + gap) + bw / 2 + (level === 0 ? 8 : -8);
    const yy = by + bh + 8 + level * 20;
    out.push(`<path d="M${sx} ${by + bh} L${sx} ${yy} L${ex} ${yy} L${ex} ${by + bh + 5}" fill="none" stroke="${col}" stroke-width="1.3"/>`);
    out.push(`<path d="M${ex - 3.5} ${by + bh + 6} l3.5 -6 l3.5 6 z" fill="${col}"/>`);
    out.push(text((sx + ex) / 2, yy + 10, label, 9, col, { mono: true, anchor: 'middle' }));
  }
  return out;
}

// ---- 内容 ----------------------------------------------------------------------
// セクション名・順番・プレースホルダーは「Git コマンド」とそろえる。

const sections = [
  { title: '基本用語', color: '#475569', items: [
    term('ステージ', '次のコミットに含める変更の置き場'),
    term('HEAD', '今いるコミット（今のブランチの先端）'),
    term('HEAD^ / HEAD~3', '1 つ前 / 3 つ前のコミット'),
    term('origin', 'clone 元リモートの既定の名前'),
  ] },
  { title: '初期設定', color: '#d97706', items: [
    entry('コミットに記録する名前とメールアドレス',
      'git config --global user.name <名前>',
      'git config --global user.email <メール>'),
    entry('既定のブランチ名を main にする', 'git config --global init.defaultBranch main'),
    entry('設定の一覧と定義したファイル', 'git config --list --show-origin'),
  ] },
  { title: '作成・クローン', color: '#0d9488', items: [
    entry('今のディレクトリをリポジトリにする', 'git init'),
    entry('リモートを複製（--depth 1 で最新だけ）', 'git clone <URL>'),
  ] },
  { title: '変更の記録', color: '#16a34a', items: [
    entry('ステージに追加（-A で全体、-p で部分ごと）', 'git add <ファイル名>'),
    entry('ステージの内容をコミット', 'git commit -m "<メッセージ>"'),
    entry('追跡中の変更を add してコミット', 'git commit -am "<メッセージ>"'),
    entry('直前のコミットに足す（push 前だけ）', 'git commit --amend --no-edit'),
    entry('追跡だけやめる（ファイルは残る）', 'git rm --cached <ファイル名>'),
  ] },
  { title: '状態・履歴・差分の確認', color: '#0891b2', items: [
    entry('変更とステージの状態を短く', 'git status -sb'),
    entry('全ブランチの履歴をグラフで', 'git log --oneline --graph --all'),
    entry('文字列が増減したコミットを探す', 'git log -S "<文字列>"'),
    entry('未ステージの差分（--staged でステージ済み）', 'git diff'),
    entry('過去のコミット時点のファイル', 'git show <コミットID>:<ファイル名>'),
    entry('行ごとに最後に変更したコミット', 'git blame -L 10,20 <ファイル名>'),
  ] },
  { title: 'ブランチの操作', color: '#2563eb', items: [
    entry('一覧（-a でリモートも、-vv で追跡先も）', 'git branch'),
    entry('切り替える / 作って切り替える', 'git switch <ブランチ名>', 'git switch -c <ブランチ名>'),
    entry('直前にいたブランチへ戻る', 'git switch -'),
    entry('今のブランチの名前を変える', 'git branch -m <新しい名前>'),
    entry('統合済みのブランチを削除', 'git branch -d <ブランチ名>'),
    danger('統合していなくても強制削除', 'git branch -D <ブランチ名>'),
  ] },
  { title: 'マージ・リベース', color: '#7c3aed', items: [
    entry('main へ取り込む（--no-ff で必ずマージコミット）', 'git switch main', 'git merge --no-ff feature'),
    diagram(46, mergeGraph),
    entry('1 つにまとめて取り込む（コミットは自分で）', 'git merge --squash <ブランチ名>'),
    entry('feature を最新の main の上に載せ直す', 'git switch feature', 'git rebase main'),
    diagram(62, rebaseGraph),
    entry('直近 3 件を並べ替え・まとめる', 'git rebase -i HEAD~3'),
    entry('衝突を直して続ける / 中止する（merge も --abort）', 'git rebase --continue', 'git rebase --abort'),
    entry('ほかのブランチから 1 件だけ取り込む', 'git cherry-pick <コミットID>'),
  ] },
  { title: 'リモートとの連携', color: '#0284c7', items: [
    entry('リモートを登録 / 一覧', 'git remote add origin <URL>', 'git remote -v'),
    entry('取得だけ（--prune で消えたブランチも掃除）', 'git fetch'),
    entry('取得してマージ（--rebase で一直線に）', 'git pull'),
    entry('初回の push で追跡先も設定', 'git push -u origin <ブランチ名>'),
    entry('リモートのブランチを削除', 'git push origin --delete <ブランチ名>'),
    danger('強制 push（他人の push があれば止まる）', 'git push --force-with-lease'),
  ] },
  { title: '変更の取り消し', color: '#ea580c', items: [
    entry('作業ツリーの変更を戻す（ステージの内容に）', 'git restore <ファイル名>'),
    entry('ステージから外す（変更は残る）', 'git restore --staged <ファイル名>'),
    entry('ファイルを過去のコミットの版に戻す', 'git restore -s <コミットID> <ファイル名>'),
    entry('直前のコミットを取り消す（変更はステージに）', 'git reset --soft HEAD~1'),
    entry('打ち消すコミットを作る（push 済みならこちら）', 'git revert <コミットID>'),
    entry('HEAD の移動履歴。消えたコミットの救出に', 'git reflog'),
    danger('その時点まで完全に巻き戻す（未コミットは消える）', 'git reset --hard <コミットID>'),
    danger('未追跡ファイルを削除（-nd で事前に確認）', 'git clean -fd'),
  ] },
  { title: '一時退避（stash）', color: '#9333ea', items: [
    entry('退避（-u で未追跡も）/ メモを付けて退避', 'git stash', 'git stash push -m "<メモ>"'),
    entry('一覧 / 中身を差分で見る', 'git stash list', 'git stash show -p stash@{0}'),
    entry('戻して消す / 戻して残す', 'git stash pop', 'git stash apply stash@{1}'),
    danger('退避をすべて消す', 'git stash clear'),
  ] },
  { title: 'タグ', color: '#65a30d', items: [
    entry('注釈付きタグを付ける', 'git tag -a v1.0.0 -m "<メモ>"'),
    entry('1 つ送る / すべて送る', 'git push origin v1.0.0', 'git push --tags'),
  ] },
  { title: 'worktree（同時作業）', color: '#64748b', items: [
    entry('別ブランチを別ディレクトリで同時に開く', 'git worktree add <パス> <ブランチ名>'),
    entry('一覧 / 削除', 'git worktree list', 'git worktree remove <パス>'),
  ] },
];

// ---- 出力 ----------------------------------------------------------------------

const { svg, spare } = buildSvg({
  label: 'Git コマンド チートシート',
  accent: '#f05133',
  header,
  sections,
  footer: ['Sirusita サンプル集 ・ A4 横（297×210mm）', 'git help <コマンド> で詳しい説明'],
});

const note = `---
title: "Git コマンド 1画面版"
tags:
  - "コマンド"
created: 2026-10-12T13:00:00+09:00
modified: 2026-10-12T13:00:00+09:00
sirusita: "1"
---

A4 横（297×210mm）の比率で 1 枚にまとめた Git のチートシートです。プレビューの幅に合わせて全体が拡大・縮小されます。各コマンドの詳しい説明は「Git コマンド」を見てください。

${svg}

## この画面の作り方

全体が 1 つの SVG（\`viewBox="0 0 1123 794"\` = A4 横を 96dpi で表した大きさ）です。座標を固定して描いているので、ウィンドウの幅が変わってもレイアウトは崩れず、拡大・縮小されるだけです。

- \`<svg>\` から \`</svg>\` までの間に**空行を入れない**でください。空行があると、そこでマークダウンの HTML として扱われなくなります。
- SVG の文字は自動で折り返されません。行を増やすときは \`<text>\` の \`y\` を 1 行分ずらして追加します。
- 図や文字の位置は \`x\` / \`y\`（左上が 0、右が x、下が y）で決まります。
- このメモは Sirusita のリポジトリの \`scripts/cheatsheet/git.mjs\` で生成しています。
`;

if (process.argv.includes('--check')) {
  let ok = true;
  if (readFileSync(OUT, 'utf8') !== note) {
    console.error('「Git コマンド 1画面版」が生成結果と違う: node scripts/cheatsheet/git.mjs で書き直す');
    ok = false;
  }
  const known = commandsInMarkdown(readFileSync(DETAIL, 'utf8'));
  const missing = commandsOf(sections).filter((c) => !known.has(c));
  if (missing.length) {
    console.error('「Git コマンド」に載っていないコマンド:\n  ' + missing.join('\n  '));
    ok = false;
  }
  if (!ok) process.exit(1);
  console.log(`ok（最後の列の残り ${Math.round(spare)}px）`);
} else {
  writeFileSync(OUT, note);
  console.log(`書き出した: contents/Git コマンド 1画面版.md（最後の列の残り ${Math.round(spare)}px）`);
}
