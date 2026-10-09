// マークダウン先頭の YAML front matter（--- で囲んだ部分）を取り除く。
// ヘルプ表示で contents/ のメモをそのまま本文として見せるために使う。
const FRONT_MATTER_RE = /^---\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n|$)(?:[ \t]*\r?\n)*/;

export function stripFrontMatter(md) {
  return md.replace(FRONT_MATTER_RE, '');
}
