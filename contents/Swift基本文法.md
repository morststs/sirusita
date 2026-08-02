---
title: "Swift基本文法"
tags:
  - "プログラミング"
created: 2026-08-02T10:10:00+09:00
modified: 2026-08-02T10:10:00+09:00
sirusita: "1"
---

## Swift基本文法

Apple 開発の、安全性とパフォーマンスを重視した静的型付け言語の基本構文。iOS/macOS アプリ開発の標準言語。Optional 型による厳格な null 安全性が特徴。

---

### 1. 変数宣言（let / var）

再代入不可の `let`（推奨）と、再代入可能な `var` の2種類。型は推論されるが明示も可能。

```swift
// let：定数（再代入不可）
let name: String = "tako"

// var：変数（再代入可能）
var count = 0
count += 1

// 型推論により型注釈は省略可能
let pi = 3.14
```

---

### 2. Optional型（nilを許容する型）

型名に `?` を付けると nil を許容する Optional 型になる。値の取り出しには `if let` / `guard let` / `??`（nilデフォルト演算子）を使う。

```swift
// 通常の型はnilを許容しない
var name: String = "tako"
// name = nil // コンパイルエラー

// ?を付けるとOptional型になる
var nickname: String? = nil

// if letでアンラップ（値があるときだけブロックを実行）
if let n = nickname {
    print("ニックネーム: \(n)")
} else {
    print("ニックネームなし")
}

// guard let：早期リターンでアンラップ（関数内でよく使う）
func printNickname(_ nickname: String?) {
    guard let n = nickname else {
        print("nil です")
        return
    }
    print(n)
}

// ??（nilデフォルト演算子）
let displayName = nickname ?? "名無し"

// !（強制アンラップ。nilなら実行時クラッシュするため多用は非推奨）
let forced = nickname!
```

---

### 3. 条件分岐（if / switch）

`switch` は網羅的である必要があり、範囲やパターンマッチも扱える。`if` は丸括弧を省略できる。

```swift
let n = 7

// if（条件式に丸括弧不要）
if n % 2 == 0 {
    print("偶数")
} else {
    print("奇数")
}

// switch：範囲・複数値・whereによる追加条件を指定可能
switch n {
case 1, 2:
    print("1か2")
case 3...6:
    print("3から6の範囲")
case let x where x > 100:
    print("100より大きい: \(x)")
default:
    print("それ以外")
}
```

---

### 4. 関数とクロージャ

`func` で定義。引数ラベルにより呼び出し側の可読性を高める設計が特徴。クロージャは `{ }` で記述する無名関数。

```swift
// 引数ラベル（呼び出し時の名前）と引数名（関数内の名前）
func greet(to name: String, message: String = "Hello") -> String {
    return "\(message), \(name)!"
}

print(greet(to: "World"))              // Hello, World!
print(greet(to: "Swift", message: "Hi")) // Hi, Swift!

// クロージャ（無名関数）
let add: (Int, Int) -> Int = { a, b in
    return a + b
}
print(add(2, 3)) // 5

// 末尾クロージャ構文（最後の引数がクロージャの場合に省略記法が使える）
let numbers = [3, 1, 4, 1, 5]
let doubled = numbers.map { $0 * 2 } // $0は第1引数の省略記法
print(doubled) // [6, 2, 8, 2, 10]
```

---

### 5. 構造体とクラス（struct / class）

`struct` は値型（コピーされる）、`class` は参照型（共有される）。Swift では可能な限り `struct` を使うことが推奨される。

```swift
// struct（値型）：代入・受け渡し時にコピーされる
struct Point {
    var x: Int
    var y: Int

    func distanceFromOrigin() -> Double {
        return (Double(x * x + y * y)).squareRoot()
    }
}

// class（参照型）：代入・受け渡し時に参照が共有される
class Counter {
    var count = 0
    func increment() {
        count += 1
    }
}

var p1 = Point(x: 3, y: 4)
var p2 = p1       // コピーされる（p2を変更してもp1は変わらない）
p2.x = 10

let c1 = Counter()
let c2 = c1        // 参照が共有される（c2の変更はc1にも反映される）
c2.increment()
print(c1.count)    // 1
```

---

### 6. プロトコルと拡張（Protocol / Extension）

`protocol` は Java の interface に相当する振る舞いの定義。`extension` で既存の型に後からメソッドを追加できる。

```swift
// プロトコルの定義
protocol Greetable {
    func greet() -> String
}

struct Japanese: Greetable {
    func greet() -> String { "こんにちは" }
}

// 既存の型（Int）に拡張でメソッドを追加
extension Int {
    func squared() -> Int {
        return self * self
    }
}

func describe(_ g: Greetable) {
    print(g.greet())
}

describe(Japanese())    // こんにちは
print(5.squared())      // 25
```

---

### 7. 配列・辞書とOptional Chaining

配列 `[Element]`、辞書 `[Key: Value]` を標準サポート。プロパティやメソッドの連鎖に `?.` を挟むことで、途中が nil でも安全にアクセスできる。

```swift
struct Address {
    var city: String?
}

struct User {
    var address: Address?
}

let user = User(address: Address(city: "Tokyo"))

// Optional Chaining：address や city が nil でもクラッシュしない
let city = user.address?.city ?? "不明"
print(city) // Tokyo

// 配列
var fruits = ["apple", "banana", "cherry"]
fruits.append("durian")
let upperFruits = fruits.map { $0.uppercased() }

// 辞書
var scores: [String: Int] = ["math": 80, "english": 90]
scores["science"] = 75
print(scores["math"] ?? 0) // 80
```
