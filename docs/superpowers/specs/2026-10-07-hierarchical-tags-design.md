# 階層タグ（スラッシュ区切り）設計

- 日付: 2026-10-07
- ステータス: 承認済み（実装前）

## 背景・目的

タグが増えるとサイドバーのタグフィルタ（フラットな一覧・完全一致フィルタ）が選びづらくなる。
`プログラミング/Go` のようなスラッシュ区切りタグを階層として扱い、ツリー表示と
「親を選ぶと子孫も含めて絞り込む」フィルタを提供する。あわせて既存タグを階層へ移すための
一括リネーム機能を用意する。

## スコープ

対象:

1. タグの正規化（Go 側・保存時に強制）
2. サイドバーのタグツリー表示（開閉・件数表示）と前方一致フィルタ
3. タグの一括リネーム（配下タグごと移動・既存タグとの統合）

対象外（今回は実装しない）:

- タグ入力の補完
- タグの検索ボックス
- 階層を別ファイルで管理する方式（メモの自己完結性を損なうため不採用）

## 方針

- **保存形式は変更しない。** タグは従来どおり front matter の文字列配列で、階層は `/` 区切りの
  文字列（例: `"プログラミング/Go"`）として表現する。Obsidian / Bear と同じ慣習で、既存メモは
  そのまま互換。
- **`/` は常に階層区切りとして扱う。** `TCP/IP` のようなタグも階層になる（Obsidian と同様の
  割り切り）。エスケープ記法は設けない。

## 1. バックエンド（Go / `note_service.go`）

### `NormalizeTag(tag string) string`

- `/` で分割 → 各セグメントを `strings.TrimSpace` → 空セグメントを除去 → `/` で再結合。
- 例:
  - `" a / b// c/ "` → `"a/b/c"`
  - `"/"` → `""`
  - `"Go"` → `"Go"`
- 大文字小文字は変更しない（`Markdown` と `markdown` の統一はリネームで行う）。

### `normalizeTags(tags []string) []string`

- 各タグを `NormalizeTag` し、空文字を除外、出現順を保ったまま重複を除去する。
- 戻り値は nil ではなく空スライス（既存の `tags == nil` → `[]string{}` の扱いに合わせる）。
- `CreateImported` と `UpdateNote` の入口で適用する。これにより手入力・インポート
  （`CreateNote` は `CreateImported` 経由）のいずれでも保存されるタグは正規化済みになる。
- `GetNote` の読み込み時にも適用する（機能追加前に保存された `" a / b "` のような旧タグも
  一覧・ツリー・`RenameTag` で正規化済みとして扱うため。ファイルは次回保存時に正規化される）。

### `RenameTag(oldTag, newTag string) (int, error)`（新規公開 API）

- `oldTag` / `newTag` を `NormalizeTag`。どちらかが空ならエラー。両者が等しければ 0 を返す。
- 全メモを走査し、各タグについて:
  - `tag == old` → `new`
  - `strings.HasPrefix(tag, old+"/")` → `new + tag[len(old):]`（配下タグごと移動）
  - それ以外は変更しない（`ab` が `a` の前方一致に誤マッチしないこと）
- 置換後のタグ列を `normalizeTags` で重複除去する（既存タグとの統合）。
- タグ列が変化したメモだけを書き戻す。**`created` / `modified` は保持する**
  （整理操作で一覧の並び＝更新日時降順が崩れないようにするため）。本文・タイトルも保持。
- 戻り値は更新したメモ件数。途中で書き込みに失敗した場合は、それまでの件数とエラーを返す。
- 書き戻しは既存の `writeNote` を利用する（front matter のエスケープ方針は従来どおり `%q`）。

### バインディング

- `RenameTag` 追加後に `wails generate module` で `frontend/wailsjs/` を再生成する。

## 2. フロントエンド: タグツリー

### `frontend/src/tagTree.js`（新規・純粋関数）

- `matchesTag(noteTags, selected)`:
  `noteTags` のいずれかが `t === selected || t.startsWith(selected + '/')` なら true。
- `buildTagTree(tags, notes)`:
  - `tags`（`ListTags()` の結果）から中間ノードを補完してツリーを作る
    （`a/b/c` しか無くても `a`、`a/b` ノードを生成）。
  - ノード: `{ name, path, count, children }`
    - `name`: 末尾セグメント（表示名）
    - `path`: フルパス（フィルタ・リネームのキー）
    - `count`: `matchesTag(note.tags, path)` を満たすメモ数（子孫込み・1 メモ 1 カウント）
  - 各階層の子は `name` でソート（`localeCompare`）。

### `Sidebar.svelte`

- 既存の「全て」「タグ無し」はそのまま残す。
- その下にツリーを表示: 階層ごとにインデント、子を持つノードは ▸/▾ トグル、
  ラベルは `name (count)`。ラベルクリックで `onSelectTag(path)`。
- 再帰描画は Svelte 5 の `{#snippet}` を自己再帰させて実装する（別コンポーネントは作らない）。
- フィルタは `filteredNotes` の `n.tags.includes(selectedTag)` を `matchesTag(n.tags, selectedTag)` に置換。
- 開閉状態: 展開中ノードの `path` 集合を `localStorage`（キー `sirusita.tagTree.expanded`）に保存。
  読み書きは try/catch で囲み、失敗時は全て閉じた状態で動作する。初期状態は全て閉じる。

## 3. フロントエンド: リネーム UI

- ツリーの各ノード行にホバー時のみ ✎ ボタンを表示（クリックはフィルタ選択と独立。
  `stopPropagation` 相当で選択を発火させない）。
- ✎ で Flowbite Svelte の `Modal` を開く。入力欄の初期値はそのノードの `path`。
  - 入力値を `NormalizeTag` 相当（フロントでも同じロジックの `normalizeTag` を `tagTree.js` に置く）
    で正規化したものが、自身および自身の配下以外の既存タグ/中間ノードと一致する場合、
    「既存タグ『◯◯』と統合されます」と注記を表示。
  - 正規化後が空、または元と同じなら確定ボタンを無効化。
- 確定時（`App.svelte` 側のハンドラ `handleRenameTag(old, new)`）:
  1. `RenameTag(old, new)` を呼ぶ
  2. `refreshList()`
  3. 選択中タグが `old` または `old/` 配下なら、同じ置換規則で新パスへ移す
  4. 開いているメモのタグは `RenameTag` 呼び出し**前**にローカルで同じ規則で付け替える
     （`GetNote` で読み直すと未保存の本文編集を失い、旧タグのまま自動保存されると
     リネームが巻き戻るため）。失敗時は元に戻す
  5. トースト「n件のマークダウンを更新しました」。失敗時は「タグの変更に失敗しました」
- `Sidebar` への追加 prop: `onRenameTag`（コールバック props の規約に従う）。

## 4. 既存コードへの影響

- `NoteToolbar.svelte` のカンマ区切り分割は現状維持（正規化は Go 側で行う）。
  ただしタグ入力欄は現状メモ切替時にしか再同期されないため、`note.tags` が変化したとき
  （保存後の正規化・リネーム）にも再同期するよう変更する。これをしないとリネーム後に
  タグ欄の blur で旧タグが書き戻される。
- `app.go` のインポートは `CreateImported` 経由のため、追加変更なしで正規化される。
- メモファイル形式・`sirusita` マーカーは変更なし。

## 5. テスト

`note_service_test.go`（新規）:

- `NormalizeTag`: 空白・連続スラッシュ・先頭末尾スラッシュ・空入力・スラッシュのみ
- `UpdateNote` / `CreateNote`: 保存されたタグが正規化・重複除去されていること
- `RenameTag`:
  - 完全一致タグの置換
  - 配下タグ（`a/x`, `a/x/y`）の一括移動
  - 前方一致の誤マッチ防止（`a` のリネームで `ab` が変わらない）
  - 統合時の重複除去（`PlantUML` → `図表` で `図表` 既存メモが重複しない）
  - `created` / `modified` / タイトル / 本文が保持されること
  - 戻り値の件数が変更メモ数と一致すること（無関係メモは書き戻さない）
  - 空の old/new でエラー

フロントエンド: npm のテスト基盤は追加せず、`tagTree.js` を純粋関数として分離して
Node 組み込みの `node --test`（`frontend/src/tagTree.test.js`）で単体テストする。加えて
`wails build` の成功と実機での動作確認（ツリー表示・開閉保持・親選択で子孫表示・
リネーム/統合・選択タグ追従）で検証する。

## 6. ドキュメント

- `CLAUDE.md` の NoteService API 表に `RenameTag` を追記、構成に `tagTree.js` を追記。
