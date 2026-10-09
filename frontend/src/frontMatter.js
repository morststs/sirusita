// マークダウン先頭の YAML front matter（--- で囲んだ部分）を取り除く。
// ヘルプ表示で contents/ のメモをそのまま本文として見せるために使う。
const FRONT_MATTER_RE = /^---\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n|$)(?:[ \t]*\r?\n)*/;

export function stripFrontMatter(md) {
  return md.replace(FRONT_MATTER_RE, '');
}

// YAML のスカラー値を文字列にする。"..." は Go の %q（JSON とほぼ同じエスケープ）で書かれている。
function unquote(v) {
  v = v.trim();
  if (v.startsWith('"') && v.endsWith('"') && v.length >= 2) {
    try {
      return JSON.parse(v);
    } catch {
      return v.slice(1, -1);
    }
  }
  if (v.startsWith("'") && v.endsWith("'") && v.length >= 2) return v.slice(1, -1).replace(/''/g, "'");
  return v;
}

// 同梱サンプル（contents/）の front matter から title と tags を取り出し、本文と合わせて返す。
// sirusita 形式（title: "..." / tags: のブロックリスト）を読めれば十分なので、YAML の一部だけを扱う。
// title が無ければ fallbackTitle を使う。
export function parseFrontMatter(md, fallbackTitle = '') {
  const m = md.match(FRONT_MATTER_RE);
  const result = { title: fallbackTitle, tags: [], body: md };
  if (!m) return result;
  result.body = md.slice(m[0].length);
  const lines = m[0].split(/\r?\n/);
  let inTags = false;
  for (const line of lines) {
    const item = line.match(/^\s+-\s*(.*)$/);
    if (inTags && item) {
      const tag = unquote(item[1]);
      if (tag) result.tags.push(tag);
      continue;
    }
    inTags = false;
    const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (!kv) continue;
    if (kv[1] === 'title') {
      const t = unquote(kv[2]);
      if (t) result.title = t;
    } else if (kv[1] === 'tags') {
      const inline = kv[2].trim();
      if (inline.startsWith('[') && inline.endsWith(']')) {
        result.tags = inline.slice(1, -1).split(',').map(unquote).filter(Boolean);
      } else {
        inTags = inline === '';
      }
    }
  }
  return result;
}
