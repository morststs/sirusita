// node --test frontend/src/frontMatter.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFrontMatter } from './frontMatter.js';

test('parseFrontMatter: CRLF でも本文を取り出す', () => {
  assert.deepEqual(parseFrontMatter('---\r\ntitle: "a"\r\n---\r\n本文'), { title: 'a', tags: [], body: '本文' });
});

test('parseFrontMatter: 先頭以外の --- は front matter とみなさない', () => {
  assert.equal(parseFrontMatter('## 見出し\n---\n本文').body, '## 見出し\n---\n本文');
});

test('parseFrontMatter: 閉じが無ければ全文を本文にする', () => {
  assert.equal(parseFrontMatter('---\ntitle: "a"\n本文').body, '---\ntitle: "a"\n本文');
});

test('parseFrontMatter: title / tags / 本文を取り出す', () => {
  const md = '---\ntitle: "Go \\"基本\\""\ntags:\n  - "プログラミング/Go"\n  - memo\ncreated: 2026-06-27T22:35:34+09:00\nsirusita: "1"\n---\n\n## 見出し\n';
  assert.deepEqual(parseFrontMatter(md, 'x'), {
    title: 'Go "基本"',
    tags: ['プログラミング/Go', 'memo'],
    body: '## 見出し\n'
  });
});

test('parseFrontMatter: インラインのタグ配列', () => {
  assert.deepEqual(parseFrontMatter('---\ntitle: a\ntags: ["x", y]\n---\n本文').tags, ['x', 'y']);
});

test('parseFrontMatter: front matter が無ければ fallbackTitle と全文', () => {
  assert.deepEqual(parseFrontMatter('## 見出し', 'ファイル名'), { title: 'ファイル名', tags: [], body: '## 見出し' });
});
