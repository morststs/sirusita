import {defineConfig} from 'vite'
import {svelte} from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import {fileURLToPath} from 'node:url'

// `--mode web` で Web 版（GitHub Pages）をビルドする。それ以外はデスクトップ版（Wails）。
// App.svelte などは '$backend' から import し、ここでどちらの実装を使うか切り替える。
export default defineConfig(({mode}) => {
  const web = mode === 'web'
  return {
    plugins: [tailwindcss(), svelte()],
    // 独自ドメインのルートでも github.io のサブパスでも動くよう相対パスにする
    base: web ? './' : '/',
    resolve: {
      alias: {
        $backend: fileURLToPath(new URL(web ? './src/backend/web.js' : './src/backend/wails.js', import.meta.url)),
      },
    },
    build: {
      // Wails が go:embed する frontend/dist を上書きしないよう出力先を分ける
      outDir: web ? 'dist-web' : 'dist',
    },
  }
})
