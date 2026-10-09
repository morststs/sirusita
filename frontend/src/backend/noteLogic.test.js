// node --test frontend/src/backend/noteLogic.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  UUID_RE, normalizeTags, formatRFC3339, buildNote, applyUpdate, toMeta,
  sortByModifiedDesc, collectTags, planRename, planEditTags, exportMarkdown, sanitizeFilename, exportFilename, newNoteId,
} from './noteLogic.js';

const NOW = new Date(2026, 9, 7, 9, 5, 3); // ローカル時刻 2026-10-07 09:05:03

test('UUID_RE', () => {
  assert.ok(UUID_RE.test('0b6f9a8e-1c2d-4e5f-8a9b-0c1d2e3f4a5b'));
  assert.ok(!UUID_RE.test('../etc/passwd'));
});

test('normalizeTags は正規化・空除去・重複除去（出現順）', () => {
  assert.deepEqual(normalizeTags(['b', ' a / x ', '', '/', 'a/x', 'b']), ['b', 'a/x']);
  assert.deepEqual(normalizeTags(null), []);
});

test('formatRFC3339 は Go の time.RFC3339 と同じ形', () => {
  const s = formatRFC3339(NOW);
  assert.match(s, /^2026-10-07T09:05:03(Z|[+-]\d{2}:\d{2})$/);
  const off = -NOW.getTimezoneOffset();
  if (off === 0) assert.ok(s.endsWith('Z'));
});

test('buildNote は日時が空なら現在時刻、タグは正規化', () => {
  const n = buildNote({ id: 'id1', title: 't', body: 'b', tags: [' a / b '], created: '', modified: '' }, NOW);
  assert.equal(n.created, formatRFC3339(NOW));
  assert.equal(n.modified, n.created);
  assert.deepEqual(n.tags, ['a/b']);
  const kept = buildNote({ id: 'id2', title: 't', body: '', tags: null, created: 'C', modified: 'M' }, NOW);
  assert.equal(kept.created, 'C');
  assert.equal(kept.modified, 'M');
  assert.deepEqual(kept.tags, []);
});

test('applyUpdate は created を保持し modified を更新', () => {
  const ex = { id: 'x', title: 'old', tags: [], created: 'C0', modified: 'M0', body: 'old' };
  const u = applyUpdate(ex, { title: 'new', body: 'nb', tags: ['x//y'] }, NOW);
  assert.deepEqual(u, { id: 'x', title: 'new', tags: ['x/y'], created: 'C0', modified: formatRFC3339(NOW), body: 'nb' });
});

test('toMeta は body を除く', () => {
  assert.deepEqual(toMeta({ id: 'x', title: 't', tags: ['a'], created: 'c', modified: 'm', body: 'b' }),
    { id: 'x', title: 't', tags: ['a'], created: 'c', modified: 'm' });
});

test('sortByModifiedDesc', () => {
  const r = sortByModifiedDesc([{ modified: '2026-01-01' }, { modified: '2026-03-01' }, { modified: '2026-02-01' }]);
  assert.deepEqual(r.map(n => n.modified), ['2026-03-01', '2026-02-01', '2026-01-01']);
});

test('collectTags は重複除去してソート', () => {
  assert.deepEqual(collectTags([{ tags: ['b', 'a'] }, { tags: ['a', ' c '] }, { tags: [] }]), ['a', 'b', 'c']);
});

test('planRename は配下ごと付け替え・統合・日時保持、無関係は含めない', () => {
  const notes = [
    { id: '1', tags: ['a', 'other'], created: 'c1', modified: 'm1' },
    { id: '2', tags: ['a/x', '図表/a/x'], created: 'c2', modified: 'm2' },
    { id: '3', tags: ['ab'], created: 'c3', modified: 'm3' },
  ];
  const changed = planRename(notes, 'a', '図表/a');
  assert.deepEqual(changed.map(n => n.id), ['1', '2']);
  assert.deepEqual(changed[0].tags, ['図表/a', 'other']);
  assert.deepEqual(changed[1].tags, ['図表/a/x']);
  assert.equal(changed[0].modified, 'm1');
  assert.deepEqual(planRename(notes, 'a', 'a'), []);
  assert.throws(() => planRename(notes, '', 'b'));
  assert.throws(() => planRename(notes, 'a', ' / '));
});

test('exportMarkdown / exportFilename', () => {
  assert.equal(exportMarkdown('T', 'body'), '# T\n\nbody\n');
  assert.equal(exportMarkdown('  ', 'body\n'), 'body\n');
  assert.equal(sanitizeFilename(' a/b:c*?"<>|\td '), 'a-b-c------ d');
  assert.equal(exportFilename(''), 'note.md');
  assert.equal(exportFilename('メモ/1'), 'メモ-1.md');
});

test('newNoteId: randomUUID が無い（HTTP など非セキュアコンテキスト）ときも UUID v4 を返す', () => {
  const fill = (a) => { for (let i = 0; i < a.length; i++) a[i] = 0xff; return a; };
  const id = newNoteId({ getRandomValues: fill });
  assert.equal(id, 'ffffffff-ffff-4fff-bfff-ffffffffffff');
  assert.match(id, UUID_RE);
  const zero = newNoteId({ getRandomValues: (a) => a });
  assert.equal(zero, '00000000-0000-4000-8000-000000000000');
});

test('newNoteId: randomUUID があればそれを使う', () => {
  assert.equal(newNoteId({ randomUUID: () => 'from-native' }), 'from-native');
  assert.match(newNoteId(globalThis.crypto), UUID_RE);
});

test('planEditTags: 完全一致だけ外し、追加は末尾へ。対象外・変化なしは返さない', () => {
  const notes = [
    { id: 'a', tags: ['x', 'x/y', 'keep'], created: 'c', modified: 'm' },
    { id: 'b', tags: ['keep', 'new'] },
    { id: 'c', tags: ['other'] },
  ];
  const changed = planEditTags(notes, ['a', 'b'], [' new ', 'z/ w'], ['x']);
  assert.deepEqual(changed, [
    { id: 'a', tags: ['x/y', 'keep', 'new', 'z/w'], created: 'c', modified: 'm' },
    { id: 'b', tags: ['keep', 'new', 'z/w'] },
  ]);
  assert.deepEqual(planEditTags(notes, ['b'], ['new'], ['absent']), []);
});
