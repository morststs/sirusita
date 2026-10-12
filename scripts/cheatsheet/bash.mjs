// サンプル集の「bash コマンド 1画面版」の内容。生成・確認は build.mjs から行う。
// コマンドは詳しい版の「bash コマンド」（contents/bash コマンド.md）に載っている形で書く。
import { danger, entry, flow, pair, titleBlock } from './lib.mjs';

// ヘッダー: リダイレクトとパイプでのデータの流れ
const header = () => [
  ...titleBlock('bash', 'コマンド チートシート',
    '< > の部分は実際の値に置き換える。赤は元に戻しにくい操作。詳しくは「bash コマンド」', '#2f855a'),
  ...flow({
    boxes: ['in.txt', 'コマンド1', 'コマンド2', 'out.txt', 'err.log'],
    forward: ['< 入力', '| パイプ', '> 出力', null],
    back: [[2, 4, 1, '2> (標準エラー)', '#c81e1e']],
    boxW: 74,
    gap: 50,
  }),
];

const sections = [
  { title: 'ファイル・ディレクトリ操作', color: '#2f855a', items: [
    entry('隠しファイルも詳細付きで一覧（-h でサイズを K/M/G）', 'ls -la', 'ls -lh'),
    entry('今のディレクトリ / 直前のディレクトリへ戻る', 'pwd', 'cd -'),
    entry('途中の階層もまとめて作る', 'mkdir -p a/b/c'),
    entry('ディレクトリごとコピー / 属性を保ってコピー', 'cp -r <元> <先>', 'cp -a <元> <先>'),
    entry('移動・名前変更', 'mv <元> <先>'),
    entry('空ファイルを作る / 更新日時を今にする', 'touch <ファイル>'),
    entry('シンボリックリンクを作る', 'ln -s <実体> <リンク名>'),
    danger('中身ごと強制削除（取り消せない）', 'rm -rf <対象>'),
  ] },
  { title: '内容の表示・確認', color: '#0d9488', items: [
    entry('全部表示 / ページ単位（q で終了、/語 で検索）', 'cat <ファイル>', 'less <ファイル>'),
    entry('先頭 / 末尾の 20 行', 'head -n 20 <ファイル>', 'tail -n 20 <ファイル>'),
    entry('追記を追いかけて表示（ログの監視）', 'tail -f <ファイル>'),
    entry('行数を数える / 2 つのファイルの差分', 'wc -l <ファイル>', 'diff <A> <B>'),
  ] },
  { title: '検索（find / grep）', color: '#2563eb', items: [
    entry('名前で再帰的に探す', 'find . -name "*.txt"'),
    entry('ディレクトリだけを探す', 'find . -type d -name "node_modules"'),
    entry('1 日以内に更新 / 10MB より大きい', 'find . -mtime -1', 'find . -size +10M'),
    entry('再帰的に、行番号付きで文字列を探す', 'grep -rn "TODO" .'),
    entry('大文字小文字を無視 / 一致しない行だけ', 'grep -i "error" app.log', 'grep -v "debug" app.log'),
    entry('拡張正規表現で複数のパターン', 'grep -E "foo|bar" <ファイル>'),
    entry('.js だけを対象に探す', 'grep -rn --include="*.js" "console.log" .'),
    danger('30 日より古い .tmp を探して削除', 'find /tmp -name "*.tmp" -mtime +30 -delete'),
  ] },
  { title: 'パイプ・リダイレクト', color: '#7c3aed', keyW: 92, items: [
    entry('左の出力を右の入力へつなぐ（パイプ）', '<コマンド> | <コマンド>'),
    pair('> <ファイル>', '標準出力を上書き保存'),
    pair('>> <ファイル>', '標準出力をファイルへ追記'),
    pair('2> <ファイル>', '標準エラーをファイルへ'),
    pair('2>&1', '標準エラーも標準出力へ'),
    pair('< <ファイル>', 'ファイルを標準入力にする'),
    pair('tee <ファイル>', '画面とファイルの両方へ出す'),
    entry('結果とエラーをまとめてログへ / 画面にも出す',
      './build.sh > build.log 2>&1', './build.sh 2>&1 | tee build.log'),
  ] },
  { title: '権限（chmod / chown）', color: '#d97706', items: [
    entry('rwxr-xr-x にする（r=4, w=2, x=1 の合計）', 'chmod 755 <ファイル>'),
    entry('実行権限を付ける', 'chmod +x <ファイル>'),
    entry('再帰的に（X はディレクトリだけに x）', 'chmod -R u+rwX,go+rX <ディレクトリ>'),
    entry('ファイルだけ 644 にする', 'find . -type f -exec chmod 644 {} +'),
    entry('所有者とグループを変える（-R で再帰）', 'chown user:group <ファイル>'),
  ] },
  { title: 'スクリプトの基礎', color: '#db2777', prompt: '', items: [
    entry('エラーで止める（先頭に書く）', 'set -euo pipefail'),
    entry('代入（= の前後に空白を入れない）/ 展開', 'name="値"', 'echo "$name"'),
    entry('コマンドの出力を埋め込む', '$(コマンド)'),
    entry('条件分岐（[ ] の内側に空白が必要）', 'if [ "$x" = "a" ]; then ... fi'),
    entry('繰り返し / 1 行ずつ読む',
      'for i in 1 2 3; do ... done', 'while read line; do ... done < file'),
    entry('パターンで分岐', 'case "$x" in a) ...;; *) ...;; esac'),
  ] },
  { title: 'xargs・連結', color: '#0284c7', items: [
    entry('A が成功したら B / 失敗したら B',
      '<コマンドA> && <コマンドB>', '<コマンドA> || <コマンドB>'),
    entry('成否に関係なく順に実行', '<コマンドA>; <コマンドB>'),
    entry('標準入力を引数にして実行', '<コマンド> | xargs <コマンド>'),
    entry('{} の位置に引数を埋め込む', 'xargs -I {} <コマンド> {}'),
    entry('空白を含むファイル名も安全に削除', 'find . -name "*.bak" -print0 | xargs -0 rm -f'),
  ] },
  { title: 'プロセス', color: '#ea580c', items: [
    entry('全プロセス / 使用率をリアルタイムで', 'ps aux', 'top'),
    entry('バックグラウンドで実行 / ログアウト後も続ける', '<コマンド> &', 'nohup <コマンド> &'),
    entry('ジョブの一覧 / 前面へ / 背面で再開', 'jobs', 'fg', 'bg'),
    entry('終了シグナルを送る / 名前でまとめて', 'kill <PID>', 'pkill <名前>'),
    danger('強制終了（後始末されない）', 'kill -9 <PID>'),
    entry('ポート 8080 を使っているプロセス', 'lsof -i :8080'),
  ] },
  { title: '便利なワンライナー', color: '#475569', items: [
    entry('容量の大きいディレクトリ TOP10', 'du -sh ./* | sort -rh | head -n 10'),
    entry('重複行を数えて多い順に', 'sort access.log | uniq -c | sort -rn | head'),
    entry('名前に一致するプロセスの数', 'ps aux | grep nginx | grep -v grep | wc -l'),
  ] },
];

export default {
  name: 'bash コマンド',
  tags: ['コマンド'],
  created: '2026-10-12T16:00:00+09:00',
  label: 'bash コマンド チートシート',
  accent: '#2f855a',
  header,
  sections,
  footer: ['Sirusita サンプル集 ・ A4 横（297×210mm）', 'man <コマンド> / <コマンド> --help で詳しい説明'],
};
