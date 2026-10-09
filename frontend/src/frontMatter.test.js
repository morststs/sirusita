// node --test frontend/src/frontMatter.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stripFrontMatter } from './frontMatter.js';

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
