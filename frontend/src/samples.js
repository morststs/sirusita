// 同梱サンプル集。contents/*.md をビルド時に取り込み（vite.config.js の samplesPlugin）、
// アプリから選んでメモとして追加できるようにする（デスクトップ版・Web 版で共通）。
import files from 'virtual:samples';
import { parseFrontMatter } from './frontMatter.js';

// タグの無いサンプルのカテゴリー名（一覧の最後に置く）
export const OTHER_CATEGORY = 'その他';

// サンプルのタグの最初の階層（追加したメモのタグは全て「サンプル/…」になる）
export const SAMPLE_TAG_ROOT = 'サンプル';

const withRoot = (tag) =>
  tag === SAMPLE_TAG_ROOT || tag.startsWith(SAMPLE_TAG_ROOT + '/') ? tag : `${SAMPLE_TAG_ROOT}/${tag}`;

// [{ key, title, tags, body, category }]（カテゴリー順 → タイトル順）。
// カテゴリーは最初のタグから「サンプル/」を除いたもの（例: "Markdown/PlantUML"）。
export const SAMPLES = files
  .map(({ name, raw }) => {
    const s = parseFrontMatter(raw, name);
    const tags = s.tags.length ? s.tags.map(withRoot) : [SAMPLE_TAG_ROOT];
    const first = s.tags[0] ? tags[0].slice(SAMPLE_TAG_ROOT.length + 1) : '';
    return { key: name, ...s, tags, category: first || OTHER_CATEGORY };
  })
  .sort((a, b) => {
    if (a.category !== b.category) {
      if (a.category === OTHER_CATEGORY) return 1;
      if (b.category === OTHER_CATEGORY) return -1;
      return a.category.localeCompare(b.category, 'ja');
    }
    return a.title.localeCompare(b.title, 'ja');
  });
