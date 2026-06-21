import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

// flowbite-svelte などが配布する TypeScript 入り .svelte を
// ビルドできるよう vitePreprocess を有効化する。
// Svelte 5 の組み込み TS 除去では一部の型注釈（例: アロー関数の戻り値型）が
// 残ってしまうため、script: true で esbuild による TS トランスパイルを明示的に有効化する。
export default {
  preprocess: vitePreprocess({ script: true }),
}
