---
title: "Mermaid"
tags:
  - "Markdown"
  - "図表"
created: 2026-06-15T21:26:39+09:00
modified: 2026-10-09T10:00:00+09:00
sirusita: "1"
---

## 1. 概要・基本ルール

* **`:::mermaid`（コードブロック）**：Markdown内でMermaidを描画するための宣言
* **方向の指定（`TD` / `LR`など）**：グラフの進行方向（上から下、左から右など）の定義
* **ノードとID**：要素に固有のIDを割り当て、表示テキストを括弧（`[]`, `()`, `{}`）で指定

---

## 2. フローチャート（`flowchart`）

* **`flowchart TD`**：上から下へ進むフローチャートの宣言
* **`-->`**：矢印によるノード間の接続
* **`id1[長方形] / id2(丸角) / id3{ひし形}`**：括弧の形状によるノードのデザイン変更
* **`-- テキスト -->`**：線の上に文字を載せる記述

```mermaid
flowchart LR
    A[開始] --> B{条件分岐}
    B -- Yes --> C[処理A]
    B -- No --> D[処理B]

```

---

## 3. シーケンス図（`sequenceDiagram`）

* **`sequenceDiagram`**：時系列の処理を表すシーケンス図の宣言
* **`participant <名前>`**：登場人物（オブジェクト）の定義
* **`->>` / `-->>**`：実線矢印（リクエスト）と破線矢印（レスポンス）の表現
* **`activate / deactivate`**：生存線（処理中ブロック）の活性化・非活性化

```mermaid
sequenceDiagram
    ユーザー->>ブラウザ: ページ要求
    ブラウザ->>サーバー: APIリクエスト
    サーバー-->>ブラウザ: JSONデータ
    ブラウザ-->>ユーザー: 画面表示

```

---

## 4. クラス図（`classDiagram`）

* **`classDiagram`**：システムの構造を表すクラス図の宣言
* **`class <クラス名>`**：クラスの定義
* **`<型> <変数名>` / `<関数名>()`**：プロパティやメソッドの定義
* **`<|--` / `*--` / `o--`**：継承・コンポジション・集約などの関係性の表現

```mermaid
classDiagram
    class Note {
        string id
        string title
        List~string~ tags
        save()
    }
    class Tag {
        string path
        rename(newPath)
    }
    class ImportedNote
    Note <|-- ImportedNote
    Note o-- Tag
```

---

## 5. ガントチャート（`gantt`）

* **`gantt`**：プロジェクトの工程管理を表すガントチャートの宣言
* **`title <タイトル>`**：チャート全体のタイトル設定
* **`section <セクション名>`**：タスクのグループ分け
* **`<タスク名> : <ステータス>, <開始日>, <期間>`**：スケジュールの具体的な記述

```mermaid
gantt
    title リリース計画
    dateFormat YYYY-MM-DD
    section 開発
    設計       :done,    d1, 2026-10-01, 3d
    実装       :active,  d2, after d1, 5d
    section 公開
    テスト     :         d3, after d2, 3d
    リリース   :milestone, after d3, 0d
```

---

## 6. その他の便利なグラフ

* **`gitGraph`**：Gitのブランチやコミットの履歴の可視化
* **`pie`**：円グラフによる割合の表現
* **`mindmap`**：アイデアの整理に便利なマインドマップの作成
* **`stateDiagram-v2`**：状態と遷移を表す状態遷移図

```mermaid
gitGraph
    commit
    branch feature
    checkout feature
    commit
    commit
    checkout main
    merge feature
    commit
```

```mermaid
pie title メモのタグ内訳
    "プログラミング" : 14
    "コマンド" : 11
    "図表" : 6
    "その他" : 8
```

```mermaid
mindmap
  root((Sirusita))
    書く
      マークダウン
      数式
      図
    整理
      タグ
      階層タグ
    共有
      インポート
      エクスポート
```

```mermaid
stateDiagram-v2
    [*] --> 下書き
    下書き --> 公開: 公開する
    公開 --> 下書き: 非公開にする
    公開 --> [*]: 削除
```
