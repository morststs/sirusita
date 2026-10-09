// node --test frontend/src/frontMatter.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stripFrontMatter, parseFrontMatter } from './frontMatter.js';

test('stripFrontMatter: 先頭の front matter と直後の空行を除く', () => {
  const md = '---\ntitle: "a"\ntags:\n  - "x"\n---\n\n## 見出し\n本文\n';
  assert.equal(stripFrontMatter(md), '## 見出し\n本文\n');
});

test('stripFrontMatter: CRLF でも除く', () => {
  assert.equal(stripFrontMatter('---\r\ntitle: "a"\r\n---\r\n本文'), '本文');
});

test('stripFrontMatter: front matter が無ければそのまま', () => {
  assert.equal(stripFrontMatter('## 見出し\n---\n本文'), '## 見出し\n---\n本文');
});

test('stripFrontMatter: 閉じが無ければそのまま', () => {
  assert.equal(stripFrontMatter('---\ntitle: "a"\n本文'), '---\ntitle: "a"\n本文');
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
