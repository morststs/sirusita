// 同梱サンプル集。contents/*.md をビルド時に取り込み（vite.config.js の samplesPlugin）、
// アプリから選んでメモとして追加できるようにする（デスクトップ版・Web 版で共通）。
import files from 'virtual:samples';
import { parseFrontMatter } from './frontMatter.js';

// タグの無いサンプルのカテゴリー名（一覧の最後に置く）
export const OTHER_CATEGORY = 'その他';

// [{ key, title, tags, body, category }]（カテゴリー順 → タイトル順）。
// カテゴリーは最初のタグ（例: "Markdown/PlantUML"）。
export const SAMPLES = files
  .map(({ name, raw }) => {
    const s = parseFrontMatter(raw, name);
    return { key: name, ...s, category: s.tags[0] || OTHER_CATEGORY };
  })
  .sort((a, b) => {
    if (a.category !== b.category) {
      if (a.category === OTHER_CATEGORY) return 1;
      if (b.category === OTHER_CATEGORY) return -1;
      return a.category.localeCompare(b.category, 'ja');
    }
    return a.title.localeCompare(b.title, 'ja');
  });
