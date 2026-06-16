# Third-Party Licenses

本プロジェクト（Sirusita）は以下のサードパーティ製ソフトウェアを利用しています。
各ライセンスはいずれも寛容（permissive）なオープンソースライセンスです。

> 注: 下表は**直接依存**を対象としています。推移的依存の完全な一覧は `go.mod` / `go.sum`
> および `frontend/package.json` / `frontend/package-lock.json` を参照してください。
> いずれの推移的依存も MIT / BSD / Apache-2.0 等の寛容ライセンスです。

## バックエンド（Go）

| パッケージ | バージョン | ライセンス |
|---|---|---|
| github.com/wailsapp/wails/v2 | v2.12.0 | MIT |
| github.com/adrg/frontmatter | v0.2.0 | MIT |
| github.com/google/uuid | v1.6.0 | BSD-3-Clause |

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
| dompurify | MPL-2.0 OR Apache-2.0 |

## フォント（Google Fonts CDN 経由で読み込み）

| フォント | ライセンス |
|---|---|
| Noto Sans JP | SIL Open Font License 1.1 |
| Source Code Pro | SIL Open Font License 1.1 |

これらのフォントは `frontend/index.html` から Google Fonts CDN 経由で読み込まれており、
フォントファイル自体は本リポジトリに同梱・再配布していません。

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
