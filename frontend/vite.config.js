import {defineConfig} from 'vite'
import {svelte} from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import {fileURLToPath} from 'node:url'
import {readdirSync, readFileSync} from 'node:fs'
import {join} from 'node:path'
import {execSync} from 'node:child_process'

// ヘルプに表示するバージョン。CI では SIRUSITA_VERSION（タグ名など）を渡し、
// 無ければ git describe（例: v1.5.0 / v1.5.0-3-gabc1234）、それも無理なら 'dev'。
function appVersion() {
  if (process.env.SIRUSITA_VERSION) return process.env.SIRUSITA_VERSION
  try {
    return execSync('git describe --tags --always', {stdio: ['ignore', 'pipe', 'ignore']}).toString().trim() || 'dev'
  } catch {
    return 'dev'
  }
}

// 同梱サンプル集（リポジトリ直下の contents/*.md）を `virtual:samples` として取り込む。
// import.meta.glob はファイル名の「#」（C#基本文法.md）を URL のフラグメントと解釈して
// 解決できないため、fs で直接読む。出力は [{ name, raw }]（name は拡張子なしのファイル名）。
// 開発サーバーでの変更監視も addWatchFile は使わない（Vite はモジュールの作り直し時に監視ファイルを
// import として解決し直し、「#」入りのパスで「Failed to resolve import」になる）。
function samplesPlugin() {
  const id = 'virtual:samples'
  const resolved = '\0' + id
  const dir = fileURLToPath(new URL('../contents', import.meta.url))
  return {
    name: 'sirusita-samples',
    resolveId: (source) => (source === id ? resolved : null),
    load(source) {
      if (source !== resolved) return null
      const items = readdirSync(dir)
        .filter((f) => f.endsWith('.md'))
        .map((f) => ({name: f.slice(0, -3), raw: readFileSync(join(dir, f), 'utf8')}))
      return 'export default ' + JSON.stringify(items)
    },
    // contents/*.md が変わったら virtual:samples を作り直してページを再読み込みする。
    configureServer(server) {
      server.watcher.add(dir)
      server.watcher.on('all', (_event, file) => {
        if (!file.startsWith(dir) || !file.endsWith('.md')) return
        const mod = server.moduleGraph.getModuleById(resolved)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({type: 'full-reload'})
      })
    },
  }
}

// `--mode web` で Web 版（GitHub Pages）をビルドする。それ以外はデスクトップ版（Wails）。
// App.svelte などは '$backend' から import し、ここでどちらの実装を使うか切り替える。
// 想定外のモード（例: 打ち間違いで "web" の後ろに見えない文字が付いた）だと、黙ってデスクトップ版の
// $backend（Wails 前提）になり、ブラウザで開くと保存がすべて失敗する。起動時に止めて気付けるようにする。
const KNOWN_MODES = ['development', 'production', 'web']

export default defineConfig(({mode}) => {
  if (!KNOWN_MODES.includes(mode)) {
    throw new Error(`未知の --mode ${JSON.stringify(mode)}。使えるのは ${KNOWN_MODES.join(' / ')} のみ（Web 版は npm run dev:web）`)
  }
  const web = mode === 'web'
  return {
    plugins: [samplesPlugin(), tailwindcss(), svelte()],
    // 独自ドメインのルートでも github.io のサブパスでも動くよう相対パスにする
    base: web ? './' : '/',
    define: {
      __APP_VERSION__: JSON.stringify(appVersion()),
    },
    resolve: {
      alias: {
        $backend: fileURLToPath(new URL(web ? './src/backend/web.js' : './src/backend/wails.js', import.meta.url)),
      },
    },
    // サンプル集（samplesPlugin）がリポジトリ直下の contents/ を読むため、開発サーバーにも許可する
    server: {
      fs: {
        allow: ['.', '../contents'],
      },
    },
    build: {
      // Wails が go:embed する frontend/dist を上書きしないよう出力先を分ける
      outDir: web ? 'dist-web' : 'dist',
    },
  }
})
