// 同梱サンプル集。contents/*.md をビルド時に取り込み（vite.config.js の samplesPlugin）、
// アプリから選んでメモとして追加できるようにする（デスクトップ版・Web 版で共通）。
import files from 'virtual:samples';
import { parseFrontMatter } from './frontMatter.js';

// [{ key, title, tags, body }]（タイトル順）
export const SAMPLES = files
  .map(({ name, raw }) => ({ key: name, ...parseFrontMatter(raw, name) }))
  .sort((a, b) => a.title.localeCompare(b.title, 'ja'));
