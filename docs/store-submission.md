# Microsoft Store 提出内容の控え

Partner Center（製品「Sirusita」、種類: **MSIX または PWA アプリ**）に入力する内容の控え。
次回の更新提出や、製品を作り直したときにそのまま再利用する。
状況と注意点は [`CLAUDE.md`](../CLAUDE.md) の「MSIX / Microsoft Store」を参照。

> 製品の種類は必ず「**MSIX または PWA アプリ**」を選ぶ（後から変更できない）。

## 提出前チェックリスト

Partner Center の申請画面の各項目と、この文書の該当節の対応。上から順に埋める。

| # | Partner Center の項目 | 用意するもの / 入力内容 | 状態 |
|---|---|---|---|
| 1 | 製品の作成・名前の予約 | 「Sirusita」 | 済 |
| 2 | 価格と提供の状況 | [価格と提供の状況](#価格と提供の状況) | |
| 3 | プロパティ | [プロパティ](#プロパティ)（プライバシー ポリシー URL が必須） | |
| 4 | 年齢区分 | [年齢区分（IARC）](#年齢区分iarc) | |
| 5 | パッケージ | `sirusita.msix`（[パッケージ](#パッケージ)） | MSIX 1.5.0 ビルド済み |
| 6 | Store 登録情報（日本語） | 説明・短い説明・機能・キーワード（[Store 登録情報](#store-登録情報日本語のみ追加言語なし)）、**スクリーンショット 1 枚以上（必須）** | スクリーンショット未作成 |
| 7 | 申請オプション | runFullTrust の理由（[申請オプション](#申請オプション)） | |
| 8 | 追加のテスト情報 | [追加のテスト情報](#追加のテスト情報認定の注意書き顧客には非表示) | |

自分で用意する必要があるのは **スクリーンショット**（と任意の Store ロゴ）だけ。他はこの文書からコピーする。

### MSIX の入手場所

- v1.5.0 のビルド: `tmp/sirusita.msix`（ローカル。`tmp/` は gitignore 済み）
- GitHub から取る場合: Actions の「Build MSIX for Microsoft Store」の実行ページ下部 **Artifacts** の
  `sirusita-msix` をダウンロード → **zip を展開**すると `sirusita.msix` が出てくる
  （v1.5.0: https://github.com/morststs/sirusita/actions/runs/37723808587 。Artifact の保存期限は 90 日）

## 製品 ID（Partner Center「製品 ID の表示」）

| 項目 | 値 |
|---|---|
| Package/Identity/Name | `morststs.sirusita` |
| Package/Identity/Publisher | `CN=CE782894-A6A6-48CC-8F6D-36D71DA87B9A` |
| Package/Properties/PublisherDisplayName | `morststs` |
| Package Family Name (PFN) | `morststs.sirusita_q9kp0rnkmck24` |
| Microsoft Store ID | `9PPT0S6GKBLW` |

最初の3つは `build/msix/AppxManifest.xml` に設定済み。
Store ページの URL は `https://apps.microsoft.com/detail/9PPT0S6GKBLW`（公開後に開ける）。

## 初回提出の手順

1. MSIX をビルドする。`v*` タグの push で `msix.yml` が自動で動くが、タグ前に作る場合は手動実行する。
   ```bash
   gh workflow run msix.yml -f version=1.5.0
   gh run list --workflow msix.yml --limit 1      # run-id を確認
   gh run download <run-id> -n sirusita-msix      # 展開済みの sirusita.msix がカレントに出る（ブラウザでは zip を展開）
   ```
2. Partner Center の「パッケージ」に `sirusita.msix` をアップロードする。
   警告「restricted capabilities require approval: runFullTrust」は想定どおり（下の申請オプションで理由を書く）。
3. 以降の各節（価格、プロパティ、年齢区分、Store 登録情報、申請オプション）を入力して申請する。
4. 更新のたびに MSIX のバージョンを上げる（タグの `X.Y.Z` がそのままバージョンになる。先頭は 0 にできない）。

## 価格と提供の状況

- 市場: 世界中のすべての市場（新しいマーケットにも自動で提供: オン）
- 対象ユーザー: 一般ユーザー / 見つかりやすさ: 検索可能
- スケジュール: できるだけ早く / 購入の停止: 終了しない
- 価格: Default 市場グループで JPY・¥0（無料）。無料試用版・販売価格・組織のライセンスは既定のまま

## プロパティ

- カテゴリ: 仕事効率化
- 個人情報: 「いいえ、製品では個人情報を使用しません」
- Web サイト: `https://github.com/morststs/sirusita`
- サポートの連絡先情報: `https://github.com/morststs/sirusita/issues`
- プライバシー ポリシーの URL: `https://github.com/morststs/sirusita/blob/main/PRIVACY.md`（GitHub 上で整形表示される。Pages は .md を text/markdown で配信し、ブラウザによっては表示せずダウンロードされるため。同じファイルは Web 版のビルドにも同梱される）
- 電話番号・住所: **空欄**（入力すると Store ページで公開される）
- 表示モード（Mixed Reality）: PC / HoloLens ともにチェックなし
- 製品の公表: 「代替ドライブやリムーバブル ストレージへのインストール」のみチェック。
  OneDrive バックアップは外す（メモはパッケージのデータフォルダーではなく
  `%USERPROFILE%\.sirusita` にあり、実際にはバックアップされないため）。
  録画とブロードキャストは外す（ゲーム向け）。アクセシビリティのテスト済み・
  ペン入力・生成 AI・Store 外の購入はチェックなし
- システム要件: キーボードとマウスの「最小ハードウェア要件」のみチェック、他はすべて未指定

## 年齢区分（IARC）

- 「IARC のアンケートへ回答する準備ができています」
- アプリの種類: その他のすべてのアプリの種類
- 質問はすべて「いいえ」（性・暴力などのコンテンツ、ユーザー コンテンツの共有、
  オンライン コンテンツ、年齢制限商品、現在地の共有、デジタル商品の購入、
  現金のリワード・暗号資産・NFT、ウェブブラウザ/検索エンジン、ニュース/教育）
- 評価機関から直接取得した評価・物理メディア: いいえ

## パッケージ

- `sirusita.msix`（X64, Windows.Desktop min 10.0.22000.0）をアップロードする
- デバイス ファミリ: Windows 10/11 Desktop のみ。「将来のデバイス ファミリを Microsoft に任せる」は外す
- 「Windows 10/11 Desktop」は Partner Center 上のデバイス ファミリ名であり、実際のインストール可能範囲はマニフェストの MinVersion（10.0.22000.0）により Windows 11 に限られる
- アップロード時の警告「restricted capabilities require approval: runFullTrust」は想定どおり

## Store 登録情報（日本語のみ。追加言語なし）

### 説明

```
Sirusita は、マークダウンで書けるシンプルなメモアプリです。

メモはマークダウンで書き、プレビューで確認できます。タグで分類でき、「プログラミング/Go」のように「/」で区切ると階層タグとしてまとめて絞り込めます。

・数式（KaTeX）、図（Mermaid / D2）、コードのシンタックスハイライトをプレビューに表示
・タグと階層タグでの整理、タグ名の一括変更
・マークダウンや ZIP のインポート、マークダウンのエクスポート（ドラッグ＆ドロップにも対応）
・プレビューの文字サイズ変更と、見出し一覧からのジャンプ

インターネットに接続しなくても使えます。メモはお使いの PC 内（ユーザー フォルダーの .sirusita）にだけ保存され、外部に送信されることはありません。
```

### 短い説明（推奨 270 文字以下）

```
マークダウンで書けるシンプルなメモアプリ。タグ・階層タグでの整理、数式や図（Mermaid / D2）のプレビューに対応。オフラインで動作し、メモは PC 内にだけ保存されます。
```

### 製品の機能（10 個以内）

```
マークダウンの編集とプレビュー
数式（KaTeX）と図（Mermaid / D2）の表示
コードのシンタックスハイライト
タグと階層タグでの整理、タグ名の一括変更
マークダウン / ZIP のインポート（ドラッグ＆ドロップ対応）
マークダウンのエクスポート
見出し一覧からのジャンプ、プレビューの文字サイズ変更
完全オフライン動作（メモは PC 内のみに保存）
```

### キーワード（最大 7 個）

```
マークダウン メモ / メモ帳 / Markdown / タグ / 階層タグ / 数式 / 図表
```

### その他

- 著作権と商標の情報: `© 2026 morststs`
- 開発元: `morststs`
- 短いタイトル・ボイス タイトル: 空（Xbox 用）
- 追加のライセンス条項（任意）:
  ```
  本アプリのソースコードは MIT License で公開しています。https://github.com/morststs/sirusita/blob/main/LICENSE
  同梱するサードパーティ製ソフトウェアのライセンスは https://github.com/morststs/sirusita/blob/main/THIRD_PARTY_LICENSES.md を参照してください。
  ```
- トレーラー: なし。Xbox 画像: なし

### ロゴ・画像

任意（未設定ならパッケージ内のロゴが使われる）。用意する場合は
`build/appicon.png` から作る（生成物はリポジトリに含めない）。1:1 ボックス アート（2160×2160）、
アプリ タイル アイコン（300×300 / 150×150 / 71×71）、必要なら 9:16 ポスター アート（1440×2160）。

### スクリーンショット

**1 枚以上必須**（最大 10 枚）。横 1366×縦 768 以上の PNG。アプリの初期ウィンドウより大きい場合は最大化してから撮る。
`contents/` のサンプルメモ（数式・Mermaid / D2 の図を含むもの）を開いたプレビューや、
階層タグのツリーが見える画面が見栄えする。

## 申請オプション

- 公開の保留: 「認定されたらすぐに…公開する」
- 制限付き機能 runFullTrust の理由（**上限 500 文字**。超えると途中で切れる）:

```
Win32 desktop app (Go + Wails) packaged as MSIX, so runFullTrust is required to launch sirusita.exe. Full trust is used only for normal desktop behavior: showing the UI with WebView2, saving the user's notes as files under %USERPROFILE%\.sirusita\notes, and importing/exporting files the user selects (or drops onto the window). No drivers, services, background tasks, admin rights, or network access.
```

## 追加のテスト情報（認定の注意書き。顧客には非表示）

左メニュー「追加のテスト情報」で入力する（申請一覧には出てこないので忘れやすい）。資格情報は空。

```
Sirusita is a Markdown memo app.

How to test:
1. Launch the app and click the "new markdown" icon button at the top of the sidebar to create a note. Type Markdown in the editor; the preview shows the rendered result.
2. Enter tags in the toolbar (comma separated; "a/b" makes a hierarchical tag) and filter by tag in the sidebar.
3. The import icon button in the sidebar imports Markdown or ZIP files (dropping files onto the window also works); the export button in the toolbar saves the open note as a Markdown file.

Notes:
- No account, sign-in, or license key is required. All features are available immediately.
- The app works fully offline and does not send any data to any server. It does not collect personal information.
- Notes are stored only on the local device, under %USERPROFILE%\.sirusita\notes.
- The UI language is Japanese.
- Dependencies: Microsoft Edge WebView2 Runtime (included in Windows 11). No drivers, NT services, or other products are required.
- runFullTrust is declared because this is a packaged Win32 desktop application (built with Go and Wails).
```

## 公開後にやること

Store で公開され、`https://apps.microsoft.com/detail/9PPT0S6GKBLW` が開けることを確認してから:

1. `frontend/src/links.js` の `STORE_URL` にそのURLを設定する（Web 版の案内に Store へのリンクが出る）。
2. `.github/workflows/release.yml` の `body` に Store 版のリンクを追加する。
3. `README.md` に Store 版の案内を追記する（「準備中」の表記を置き換える）。
