# Third-Party Licenses

本プロジェクト（Sirusita）は以下のサードパーティ製ソフトウェアを利用しています。
大半は寛容（permissive）なオープンソースライセンスで、D2 のみ MPL-2.0（弱コピーレフト）です。

> 注: 下表は**直接依存**を対象としています。推移的依存の完全な一覧は `go.mod` / `go.sum`
> および `frontend/package.json` / `frontend/package-lock.json` を参照してください。
> 推移的依存は MIT / BSD / ISC / Apache-2.0 等の寛容ライセンスが大半で、GPL/LGPL/AGPL は
> 含まれません。例外として D2 の推移的依存 `github.com/golang/freetype` は
> 「FreeType License または GPLv2 以降」の選択制デュアルライセンスであり、本プロジェクトは
> **FreeType License（BSD 系の寛容ライセンス）** を選択して利用します。
>
> なお `apexcharts`（`flowbite` 経由の推移的依存）は収益制限付きの非 OSS ライセンスへ移行して
> いますが、その JavaScript 本体は tree-shaking により**配布ビルドには含まれません**
> （バンドルに残るのは flowbite 自身の MIT ライセンス CSS のみ）。

## バックエンド（Go）

| パッケージ | バージョン | ライセンス |
|---|---|---|
| github.com/wailsapp/wails/v2 | v2.12.0 | MIT |
| github.com/adrg/frontmatter | v0.2.0 | MIT |
| github.com/google/uuid | v1.6.0 | BSD-3-Clause |
| oss.terrastruct.com/d2 | v0.6.9 | MPL-2.0 |

## フロントエンド（npm）

| パッケージ | ライセンス |
|---|---|
| svelte | MIT |
| vite | MIT |
| @sveltejs/vite-plugin-svelte | MIT |
| tailwindcss | MIT |
| @tailwindcss/vite | MIT |
| flowbite | MIT |
| flowbite-svelte | MIT |
| flowbite-svelte-icons | MIT |
| marked | MIT |
| marked-katex-extension | MIT |
| marked-highlight | MIT |
| katex | MIT |
| mermaid | MIT |
| highlight.js | BSD-3-Clause |
| monaco-editor | MIT |
| dompurify | MPL-2.0 OR Apache-2.0 |

## フォント（Google Fonts CDN 経由で読み込み）

| フォント | ライセンス |
|---|---|
| Noto Sans JP | SIL Open Font License 1.1 |
| Source Code Pro | SIL Open Font License 1.1 |

これらのフォントは `frontend/index.html` から Google Fonts CDN 経由で読み込まれており、
フォントファイル自体は本リポジトリに同梱・再配布していません。

### 同梱フォント（アプリ内に再配布）

| フォント | ライセンス |
|---|---|
| KaTeX フォント（`KaTeX_*` woff2/woff/ttf） | MIT（KaTeX に同梱、KaTeX 本体と同一の MIT ライセンス） |

KaTeX のフォントは数式表示のためアプリのバンドルに同梱しています。KaTeX 本体（MIT）の
配布物に含まれ、同じ MIT ライセンスで再配布できます（著作権表示の保持が必要）。

## ライセンス全文の入手

各ライセンス全文は、対応するパッケージの配布物（`node_modules/<pkg>/LICENSE` および
Go モジュールキャッシュ内の各モジュール `LICENSE`）に含まれています。
網羅的な一覧が必要な場合は以下のツールで生成できます。

```bash
# Go
go install github.com/google/go-licenses@latest && go-licenses report ./...

# npm
npx license-checker --production --summary
```

## 注意（MPL-2.0 OR Apache-2.0: DOMPurify）

DOMPurify はデュアルライセンスです。本プロジェクトは Apache-2.0 を選択して利用することも、
MPL-2.0 を選択することも可能です。再配布時は選択したライセンスの条件に従ってください。

## 注意（MPL-2.0: D2）

D2（`oss.terrastruct.com/d2`）は Mozilla Public License 2.0（弱コピーレフト）です。
本プロジェクトは D2 を**無改変**でライブラリとして利用しているため、以下を満たせば問題ありません。

- 本プロジェクト自身のコードは MIT のまま配布できます（MPL-2.0 はファイル単位のコピーレフトで、
  GPL のように結合著作物全体へ伝播しません）。MPL-2.0 §3.2 は実行ファイル形式での配布を許可しています。
- D2 の著作権・ライセンス表示を保持し、D2 の改変が生じた場合は当該ファイルを MPL-2.0 で提供します
  （本プロジェクトは D2 を改変していません）。
- D2 のソースは https://github.com/terrastruct/d2 で公開されています。
