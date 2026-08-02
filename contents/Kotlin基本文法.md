---
title: "Kotlin基本文法"
tags:
  - "プログラミング"
created: 2026-08-02T10:05:00+09:00
modified: 2026-08-02T10:05:00+09:00
sirusita: "1"
---

## Kotlin基本文法

Java との完全な相互運用性を持つ、JetBrains 開発の静的型付け言語の基本構文。Android 公式開発言語。簡潔さと null 安全性を重視した設計。

---

### 1. 変数宣言（val / var）

再代入不可の `val`（推奨）と、再代入可能な `var` の2種類。型は推論されるが明示も可能。

```kotlin
// val：再代入不可（Javaのfinalに相当）
val name: String = "tako"

// var：再代入可能
var count = 0
count += 1

// 型推論により型注釈は省略可能
val pi = 3.14
```

---

### 2. Null安全性（Nullable型）

型名に `?` を付けると null を許容する。安全呼び出し `?.` やエルビス演算子 `?:` で null を安全に扱う。

```kotlin
// 通常の型はnullを許容しない（コンパイルエラーになる）
var name: String = "tako"
// name = null // エラー

// ?を付けるとnull許容型になる
var nickname: String? = null

// 安全呼び出し演算子（?.）：nullなら評価せずnullを返す
val length = nickname?.length

// エルビス演算子（?:）：nullの場合のデフォルト値を指定
val displayName = nickname ?: "名無し"

// !!演算子：null非許容として強制アンラップ（nullなら例外）
val forced = nickname!!.length
```

---

### 3. 条件分岐（if / when）

`if` は式として値を返せる。`when` は Java の `switch` に相当し、より柔軟な条件を書ける。

```kotlin
val n = 7

// ifは式（三項演算子の代わりになる）
val parity = if (n % 2 == 0) "偶数" else "奇数"

// when：複数値・範囲・任意条件を扱える
when (n) {
    1, 2 -> println("1か2")
    in 3..6 -> println("3から6の範囲")
    else -> println("それ以外")
}

// 型の判定にも使える（when (obj) { is String -> ... }）
fun describe(x: Any): String = when (x) {
    is Int -> "整数: $x"
    is String -> "文字列: $x"
    else -> "不明"
}
```

---

### 4. 関数

`fun` で定義。デフォルト引数・名前付き引数・単一式関数をサポート。

```kotlin
// 引数と戻り値の型を指定
fun add(a: Int, b: Int): Int {
    return a + b
}

// 単一式関数（=で本体を1式に省略）
fun square(x: Int) = x * x

// デフォルト引数・名前付き引数
fun greet(name: String, greeting: String = "Hello") {
    println("$greeting, $name!")
}

fun main() {
    greet("World")                       // Hello, World!
    greet(name = "Kotlin", greeting = "Hi") // Hi, Kotlin!
}
```

---

### 5. クラスとデータクラス

`class` で通常のクラスを、`data class` で等値比較・`toString()` 等が自動生成されるクラスを定義する。

```kotlin
// 通常のクラス（プライマリコンストラクタをクラス宣言に直接書ける）
class User(val name: String, var age: Int) {
    fun greet() = "Hi, I am $name"
}

// データクラス（equals/hashCode/toString/copyが自動生成される）
data class Point(val x: Int, val y: Int)

fun main() {
    val u = User("tako", 20)
    println(u.greet())

    val p1 = Point(1, 2)
    val p2 = p1.copy(y = 5) // 一部フィールドだけ変更した複製
    println(p1 == p2) // false（内容比較）
}
```

---

### 6. コレクションと関数型プログラミング

`List` / `Map` / `Set` は標準で不変（読み取り専用）版と可変版が分かれている。ラムダ式と組み合わせて簡潔にデータ処理を書ける。

```kotlin
// 不変リスト（listOf）と可変リスト（mutableListOf）
val numbers = listOf(1, 2, 3, 4, 5)
val mutableNumbers = mutableListOf(1, 2, 3)
mutableNumbers.add(4)

// ラムダ式によるフィルタ・変換・合計
val doubled = numbers.map { it * 2 }
val evens = numbers.filter { it % 2 == 0 }
val total = numbers.sum()

// Map（連想配列）
val user = mapOf("name" to "tako", "age" to "20")
println(user["name"])

println(doubled) // [2, 4, 6, 8, 10]
println(evens)   // [2, 4]
```

---

### 7. Null安全 × 拡張関数 × スコープ関数

Kotlin らしいイディオムとして、既存クラスへメソッドを後付けする拡張関数と、`let` / `also` / `apply` などのスコープ関数がよく使われる。

```kotlin
// 拡張関数（既存の型にメソッドを追加する）
fun String.shout(): String = this.uppercase() + "!"

fun main() {
    println("hello".shout()) // HELLO!

    // let：nullチェックと同時に処理を行う定番パターン
    val nickname: String? = "tako"
    nickname?.let {
        println("ニックネームは $it")
    }

    // apply：オブジェクトを初期化しつつ自分自身を返す
    val sb = StringBuilder().apply {
        append("Hello, ")
        append("Kotlin")
    }
    println(sb.toString())
}
```
