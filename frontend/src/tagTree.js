// 階層タグ（"親/子"）ユーティリティ。正規化・リネーム規則は Go 側（note_service.go）と同じ。

export function normalizeTag(tag) {
  return tag.split('/').map(s => s.trim()).filter(s => s.length > 0).join('/');
}

// メモのタグのいずれかが selected 自身または配下なら true（"ab" は "a" の配下ではない）。
export function matchesTag(noteTags, selected) {
  return (noteTags || []).some(t => t === selected || t.startsWith(selected + '/'));
}

// path が oldPath 自身または配下なら newPath 側へ付け替えた値を、対象外なら null を返す。
export function renameTagPath(path, oldPath, newPath) {
  if (path === oldPath) return newPath;
  if (path.startsWith(oldPath + '/')) return newPath + path.slice(oldPath.length);
  return null;
}

// 1 メモ分のタグ列にリネームを適用し、重複を除く（出現順保持）。
export function renameTags(tags, oldPath, newPath) {
  const renamed = tags.map(t => renameTagPath(t, oldPath, newPath) ?? t);
  return [...new Set(renamed)];
}

// 中間ノードを含む全パス（"a/b/c" → "a", "a/b", "a/b/c"）。
export function allTagPaths(tags) {
  const paths = new Set();
  for (const tag of tags) {
    const segs = tag.split('/');
    for (let i = 1; i <= segs.length; i++) paths.add(segs.slice(0, i).join('/'));
  }
  return paths;
}

// サイドバー表示用のツリーを作る。count は子孫込みで該当するメモ数。
export function buildTagTree(tags, notes) {
  const roots = [];
  const byPath = new Map();
  // 浅い順に処理すれば親ノードが必ず先に存在する
  const paths = [...allTagPaths(tags)].sort((a, b) => a.split('/').length - b.split('/').length);
  for (const path of paths) {
    const i = path.lastIndexOf('/');
    const node = {
      name: path.slice(i + 1),
      path,
      count: notes.filter(n => matchesTag(n.tags, path)).length,
      children: [],
    };
    byPath.set(path, node);
    (i < 0 ? roots : byPath.get(path.slice(0, i)).children).push(node);
  }
  const sortRec = list => {
    list.sort((a, b) => a.name.localeCompare(b.name));
    list.forEach(n => sortRec(n.children));
  };
  sortRec(roots);
  return roots;
}
