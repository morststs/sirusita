// node --test frontend/src/tagTree.test.js で実行（Vite のバンドルには含まれない）
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeTag, matchesTag, renameTagPath, renameTags, allTagPaths, buildTagTree } from './tagTree.js';

test('normalizeTag', () => {
  assert.equal(normalizeTag(' a / b// c/ '), 'a/b/c');
  assert.equal(normalizeTag('/'), '');
  assert.equal(normalizeTag('Go'), 'Go');
});

test('matchesTag は自身と配下に一致し、前方一致の誤マッチをしない', () => {
  assert.equal(matchesTag(['a'], 'a'), true);
  assert.equal(matchesTag(['a/x/y'], 'a'), true);
  assert.equal(matchesTag(['ab'], 'a'), false);
  assert.equal(matchesTag([], 'a'), false);
  assert.equal(matchesTag(null, 'a'), false);
});

test('renameTagPath / renameTags', () => {
  assert.equal(renameTagPath('a', 'a', 'z'), 'z');
  assert.equal(renameTagPath('a/x', 'a', 'z/q'), 'z/q/x');
  assert.equal(renameTagPath('ab', 'a', 'z'), null);
  assert.deepEqual(renameTags(['PlantUML', '図表', 'x'], 'PlantUML', '図表'), ['図表', 'x']);
  assert.equal(renameTagPath('a/b', 'a', 'a/b'), 'a/b/b');
  assert.deepEqual(renameTags(['a/x', '図表/a/x'], 'a', '図表/a'), ['図表/a/x']);
});

test('allTagPaths は中間ノードを補完する', () => {
  assert.deepEqual([...allTagPaths(['a/b/c', 'd'])].sort(), ['a', 'a/b', 'a/b/c', 'd']);
});

test('buildTagTree は階層・件数（子孫込み・1メモ1件）・名前順を作る', () => {
  const notes = [
    { tags: ['p/Go', 'p/Rust'] },
    { tags: ['p/Go'] },
    { tags: ['c'] },
    { tags: [] },
  ];
  const tree = buildTagTree(['p/Rust', 'p/Go', 'c'], notes);
  assert.deepEqual(tree.map(n => n.path), ['c', 'p']);
  const p = tree[1];
  assert.equal(p.name, 'p');
  assert.equal(p.count, 2);
  assert.deepEqual(p.children.map(n => [n.name, n.path, n.count]), [['Go', 'p/Go', 2], ['Rust', 'p/Rust', 1]]);
});
