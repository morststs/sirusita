// サンプル集の「正規表現 1画面版」の内容。生成・確認は build.mjs から行う。
// パターンは詳しい版の「正規表現」（contents/正規表現.md）に載っている形で書く。
import { entry, pair, text, textW, titleBlock, INK, MARGIN as M, SUB, W } from './lib.mjs';

// ヘッダー: 郵便番号のパターンを部分ごとに色分けして読み方を示す
function header() {
  const parts = [
    ['^', '行頭', '#64748b'],
    ['(\\d{3})', '数字 3 つ → $1', '#2563eb'],
    ['-', 'そのまま', '#64748b'],
    ['(\\d{4})', '数字 4 つ → $2', '#16a34a'],
    ['$', '行末', '#64748b'],
  ];
  const fs = 22;
  const gap = 18;
  // 各部分の幅は、パターンと下の説明の広いほうに合わせる
  const widths = parts.map(([p, label]) => Math.max(textW(p, fs, true), textW(label, 9.5)) );
  const total = widths.reduce((s, w) => s + w, 0) + gap * (parts.length - 1);
  let x = W - M - total;
  const y = M + 30;
  const out = [text(x, M + 4, '例: 郵便番号（123-4567）', 9.5, SUB)];
  parts.forEach(([p, label, color], i) => {
    const cx = x + widths[i] / 2;
    out.push(text(cx, y, p, fs, color, { mono: true, weight: '700', anchor: 'middle' }));
    out.push(`<line x1="${(cx - widths[i] / 2).toFixed(1)}" y1="${y + 7}" x2="${(cx + widths[i] / 2).toFixed(1)}" y2="${y + 7}" stroke="${color}" stroke-width="2"/>`);
    out.push(text(cx, y + 21, label, 9.5, color, { anchor: 'middle' }));
    x += widths[i] + gap;
  });
  out.push(text(W - M, y + 42, '置換 $1-$2 や後方参照 \\1 で、( ) で囲んだ部分を使える', 9.5, INK, { anchor: 'end' }));
  return [
    ...titleBlock('正規表現', 'チートシート',
      '記法と意味の早見表。細かな仕様はエンジン（PCRE / JavaScript / Python / Go の RE2）で異なる', '#7c3aed'),
    ...out,
  ];
}

const sections = [
  { title: '文字クラス', color: '#2563eb', keyW: 60, items: [
    pair('.', '改行以外の任意の 1 文字'),
    pair('\\d', '数字（[0-9]）'),
    pair('\\D', '数字以外'),
    pair('\\w', '単語構成文字（[A-Za-z0-9_]）'),
    pair('\\W', '単語構成文字以外'),
    pair('\\s', '空白（スペース・タブ・改行）'),
    pair('\\S', '空白以外'),
    pair('[abc]', 'a, b, c のどれか 1 文字'),
    pair('[a-z]', 'a〜z の範囲の 1 文字'),
    pair('[^abc]', 'a, b, c 以外の 1 文字'),
    pair('[.+*]', '[ ] の中の記号は文字そのもの'),
    entry('英字 1 文字 + 数字 1 文字（A1, b9）', '[A-Za-z]\\d'),
  ] },
  { title: '量指定子', color: '#16a34a', keyW: 60, items: [
    pair('*', '0 回以上'),
    pair('+', '1 回以上'),
    pair('?', '0 回か 1 回'),
    pair('{n}', 'ちょうど n 回'),
    pair('{n,}', 'n 回以上'),
    pair('{n,m}', 'n 回以上 m 回以下'),
    pair('*?', '0 回以上（最短マッチ・非貪欲）'),
    pair('+?', '1 回以上（最短マッチ）'),
    pair('??', '0 回か 1 回（なるべく 0 回）'),
    entry('a が 2〜4 個続く', 'a{2,4}'),
    entry('貪欲: <p>あ</p> 全体 / 非貪欲: <p> だけ', '<.+>', '<.+?>'),
  ] },
  { title: 'アンカー・境界', color: '#0d9488', keyW: 60, items: [
    pair('^', '行の先頭'),
    pair('$', '行の末尾'),
    pair('\\b', '単語の境目'),
    pair('\\B', '単語の境目以外'),
    pair('\\A', '文字列全体の先頭'),
    pair('\\z', '文字列全体の末尾'),
    entry('行全体が数字だけ', '^\\d+$'),
    entry('単語の cat だけ（category は除く）', '\\bcat\\b'),
  ] },
  { title: 'グループ・キャプチャ', color: '#d97706', keyW: 112, items: [
    pair('(abc)', 'グループ化して取り出す'),
    pair('(?:abc)', 'まとめるだけ（取り出さない）'),
    pair('(?<name>abc)', '名前付きで取り出す'),
    pair('\\1', '1 番目に取り出した内容'),
    pair('\\k<name>', '名前付きの後方参照'),
    entry('日付を 3 つに分ける（置換 $1/$2/$3 で 2026/06/28）', '(\\d{4})-(\\d{2})-(\\d{2})'),
    entry('名前付きで年と月を取り出す', '(?<year>\\d{4})-(?<month>\\d{2})'),
  ] },
  { title: '選択・後方参照', color: '#db2777', keyW: 92, items: [
    pair('a|b', 'a または b'),
    pair('(cat|dog)', 'cat または dog'),
    entry('http / https / ftp で始まる', '^(https?|ftp)://'),
    entry('同じ単語の連続（the the）', '\\b(\\w+)\\s+\\1\\b'),
    entry('開きと閉じが同じタグ', '<(\\w+)>.*?</\\1>'),
  ] },
  { title: '先読み・後読み', color: '#7c3aed', keyW: 76, items: [
    pair('(?=...)', '直後が ... である'),
    pair('(?!...)', '直後が ... でない'),
    pair('(?<=...)', '直前が ... である'),
    pair('(?<!...)', '直前が ... でない'),
    entry('「円」の前の数字（円は含まない）', '\\d+(?=円)'),
    entry('「$」の後の数字', '(?<=\\$)\\d+'),
    entry('英大文字・小文字・数字を含む 8 文字以上', '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'),
  ] },
  { title: 'エスケープ', color: '#475569', keyW: 60, items: [
    pair('\\.', 'ドットそのもの'),
    pair('\\*', '* そのもの（\\+ \\? も同様）'),
    pair('\\(', '( そのもの（\\) \\[ \\{ なども）'),
    pair('\\^', '^ そのもの（\\$ も同様）'),
    pair('\\\\', 'バックスラッシュそのもの'),
    pair('\\t', 'タブ'),
    pair('\\n', '改行（\\r は復帰）'),
    entry('小数（ドットはエスケープが必要）', '\\d+\\.\\d+'),
  ] },
  { title: 'よく使うパターン', color: '#ea580c', items: [
    entry('メールアドレス', '^[\\w.+-]+@[\\w-]+\\.[\\w.-]+$'),
    entry('URL', 'https?://[\\w./?=&%#-]+'),
    entry('日付（YYYY-MM-DD）', '\\d{4}-\\d{2}-\\d{2}'),
    entry('時刻（HH:MM）', '([01]\\d|2[0-3]):[0-5]\\d'),
    entry('IPv4 アドレス（大まかに）', '(\\d{1,3}\\.){3}\\d{1,3}'),
    entry('IPv4 アドレス（各数 0〜255 を厳密に）',
      '^((25[0-5]|2[0-4]\\d|1?\\d?\\d)\\.){3}(25[0-5]|2[0-4]\\d|1?\\d?\\d)$'),
    entry('郵便番号（日本）', '\\d{3}-\\d{4}'),
    entry('電話番号（日本）', '0\\d{1,4}-\\d{1,4}-\\d{4}'),
    entry('16 進のカラーコード', '#[0-9A-Fa-f]{6}'),
    entry('ひらがなだけ', '[ぁ-ん]+'),
  ] },
];

export default {
  name: '正規表現',
  tags: ['コマンド', 'プログラミング'],
  created: '2026-10-12T16:00:00+09:00',
  what: '正規表現',
  unit: '記法',
  prompt: '',
  label: '正規表現 チートシート',
  accent: '#7c3aed',
  header,
  sections,
  footer: ['Sirusita サンプル集 ・ A4 横（297×210mm）', 'Go の regexp（RE2）は後読み・後方参照に非対応'],
};
