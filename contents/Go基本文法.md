---
title: "Go基本文法"
tags:
  - "プログラミング"
created: 2026-06-27T22:35:34+09:00
modified: 2026-06-27T23:14:07+09:00
sirusita: "1"
---

## Go言語の基本文法

シンプルさと高い可読性を重視した、Google開発の静的型付け言語の基本構文。

---

### 1. 変数宣言と初期化

明示的な型指定と、型推論を用いた簡潔な変数定義のスタイル。

```go
// 1. varによる明示的な宣言
var msg string = "Hello"

// 2. 短縮変数の宣言（関数内限定・型推論）
count := 10 

```

---

### 2. 条件分岐（if, switch）

丸括弧（`()`）を省略するシンプルな構文。`if` 内でのローカル変数宣言や、`break` 不要の `switch` が特徴。

```go
// if文（条件式の前で簡易文の実行が可能）
if err := doSomething(); err != nil {
    return err
}

// switch文（自動でbreakされるため記述が簡潔）
switch os := getOS(); os {
case "darwin":
    fmt.Println("macOS")
default:
    fmt.Println("Other OS")
}

```

---

### 3. ループ処理（for）

Go言語における唯一の反復構文。通常のループから、配列・スライスを走査する `range` 処理まで一手に担う仕様。

```go
// 通常のforループ
for i := 0; i < 5; i++ {
    fmt.Println(i)
}

// スライスの反復処理（インデックスと値の取得）
items := []string{"a", "b"}
for index, value := range items {
    fmt.Printf("%d: %s\n", index, value)
}

```

---

### 4. 関数定義

複数の戻り値を返せる柔軟な構文。エラーハンドリングにおいて多用されるコア機能。

```go
// 引数と複数の戻り値を指定した関数
func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("zero division")
    }
    return a / b, nil
}

```

---

### 5. 構造体とメソッド（Structs & Methods）

オブジェクト指向の「クラス」の代わりにデータ構造を定義する仕組み。レシーバを指定することで構造体に紐づくメソッドを実装。

```go
// 構造体の定義
type User struct {
    Name string
    Age  int
}

// メソッドの定義（構造体Userに紐づく関数）
func (u User) Greet() string {
    return "Hi, I am " + u.Name
}

```

---

### 6. インターフェース（Interfaces）

明示的な `implements` 宣言を必要としないダックタイピング（暗黙的）な実装スタイル。メソッドのシグネチャのみを定義。

```go
// インターフェースの定義
type Greeter interface {
    Greet() string
}

// ※構造体UserがGreet()メソッドを持っていれば、自動的にGreeterを満たすとみなされる

```

---

### 7. ゴルーチンとチャネル（Goroutines & Channels）

並行処理を簡単に実装するための組み込み機構。軽量スレッドである `go` キーワードと、データ同期のためのパイプライン。

```go
// ゴルーチンの起動（非同期処理）
go processTask()

// チャネルによるデータの送受信
ch := make(chan string)
go func() {
    ch <- "done" // 送信
}()
msg := <-ch     // 受信

```
