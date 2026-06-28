---
title: "Rust基本文法"
tags:
  - "プログラミング"
created: 2026-06-28T10:00:00+09:00
modified: 2026-06-28T10:00:00+09:00
sirusita: "1"
---

## Rust基本文法

メモリ安全性と高速性を両立する、所有権システムを特徴とするシステムプログラミング言語の基本構文。

---

### 1. 変数と型

`let` による不変変数の宣言が基本。可変にする場合は `mut` を付与する。型は推論されるが、明示も可能。

```rust
// 不変変数（再代入は不可）
let x = 5;

// 可変変数（mutで再代入を許可）
let mut count = 0;
count += 1;

// 型の明示的な指定
let pi: f64 = 3.14;
let flag: bool = true;
let ch: char = 'A';

// 定数（型注釈が必須・大文字で命名）
const MAX_POINTS: u32 = 100_000;

// シャドーイング（同名で再束縛し型変更も可能）
let spaces = "   ";
let spaces = spaces.len();
```

---

### 2. 関数

`fn` で定義。引数には型注釈が必須。戻り値の型は `->` で指定し、末尾の式（セミコロンなし）が戻り値となる。

```rust
// 引数と戻り値を持つ関数
fn add(a: i32, b: i32) -> i32 {
    a + b // セミコロンなしの式が戻り値
}

// returnによる早期リターン
fn abs(n: i32) -> i32 {
    if n < 0 {
        return -n;
    }
    n
}

fn main() {
    let result = add(2, 3);
    println!("結果: {}", result); // 結果: 5
}
```

---

### 3. 制御構文（if / match / loop / while / for）

`if` は式として値を返せる。`match` は網羅的なパターンマッチを行う。繰り返しは `loop` / `while` / `for` の3種。

```rust
// ifは式（三項演算子の代わりになる）
let n = 7;
let parity = if n % 2 == 0 { "偶数" } else { "奇数" };

// matchによる分岐（全パターンの網羅が必須）
match n {
    1 => println!("一"),
    2 | 3 => println!("二か三"),
    4..=6 => println!("四から六"),
    _ => println!("その他"),
}

// loop（breakで値を返せる無限ループ）
let mut i = 0;
let doubled = loop {
    i += 1;
    if i == 5 {
        break i * 2;
    }
};

// while
let mut m = 3;
while m > 0 {
    m -= 1;
}

// for（範囲やイテレータを走査）
for k in 0..3 {
    println!("k = {}", k); // 0, 1, 2
}
```

---

### 4. 所有権と借用

各値には所有者が一つ存在し、所有権の移動（ムーブ）が起きる。参照（借用）により所有権を移さず値へアクセスする。

```rust
fn main() {
    // 所有権の移動（s1はムーブ後に無効化される）
    let s1 = String::from("hello");
    let s2 = s1; // s1の所有権がs2へ移動
    // println!("{}", s1); // エラー: s1は使用不可

    // 不変借用（&で参照を渡す。所有権は移動しない）
    let s = String::from("world");
    let len = calc_len(&s);
    println!("{} の長さは {}", s, len); // sは引き続き有効

    // 可変借用（&mutで内容を変更可能。同時に一つだけ）
    let mut text = String::from("foo");
    append_bar(&mut text);
    println!("{}", text); // foobar
}

fn calc_len(s: &String) -> usize {
    s.len()
}

fn append_bar(s: &mut String) {
    s.push_str("bar");
}
```

---

### 5. 構造体と列挙型

`struct` で複数の値をまとめる。`enum` で取りうる状態を列挙する。`impl` ブロックでメソッドを定義する。

```rust
// 構造体の定義
struct Rectangle {
    width: u32,
    height: u32,
}

// メソッドと関連関数の実装
impl Rectangle {
    // メソッド（第一引数は&self）
    fn area(&self) -> u32 {
        self.width * self.height
    }

    // 関連関数（コンストラクタとして使う）
    fn new(w: u32, h: u32) -> Rectangle {
        Rectangle { width: w, height: h }
    }
}

// 列挙型（各要素が値を保持できる）
enum Shape {
    Circle(f64),
    Square(f64),
    Rect { w: f64, h: f64 },
}

fn main() {
    let rect = Rectangle::new(3, 4);
    println!("面積: {}", rect.area()); // 面積: 12
}
```

---

### 6. パターンマッチと Option / Result

`match` や `if let` で値を分解する。`Option<T>` は値の有無を、`Result<T, E>` は成功か失敗を表現する。

```rust
// Option（値があればSome、なければNone）
fn find_even(v: &[i32]) -> Option<i32> {
    for &x in v {
        if x % 2 == 0 {
            return Some(x);
        }
    }
    None
}

// Result（成功Ok、失敗Err）
fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err(String::from("ゼロ除算"))
    } else {
        Ok(a / b)
    }
}

fn main() {
    // matchで分解
    match find_even(&[1, 3, 4, 5]) {
        Some(n) => println!("見つかった: {}", n),
        None => println!("なし"),
    }

    // if letで簡潔に分岐
    if let Ok(result) = divide(10, 2) {
        println!("商: {}", result); // 商: 5
    }

    // ?演算子でエラーを伝播
    let _ = run();
}

fn run() -> Result<(), String> {
    let q = divide(8, 4)?; // Errなら即座にreturn
    println!("q = {}", q);
    Ok(())
}
```

---

### 7. トレイトとジェネリクス

`trait` は共通の振る舞いを定義する。ジェネリクス `<T>` で型に依存しない汎用コードを記述する。

```rust
// トレイトの定義
trait Greet {
    fn hello(&self) -> String;
}

struct Japanese;
struct English;

// トレイトの実装
impl Greet for Japanese {
    fn hello(&self) -> String {
        String::from("こんにちは")
    }
}
impl Greet for English {
    fn hello(&self) -> String {
        String::from("Hello")
    }
}

// ジェネリック関数（トレイト境界で制約）
fn largest<T: PartialOrd + Copy>(list: &[T]) -> T {
    let mut max = list[0];
    for &item in list {
        if item > max {
            max = item;
        }
    }
    max
}

fn main() {
    let g: &dyn Greet = &Japanese;
    println!("{}", g.hello()); // こんにちは

    let nums = vec![10, 25, 3, 42, 7];
    println!("最大値: {}", largest(&nums)); // 最大値: 42
}
```

---

### 8. ベクタと文字列（Vec / String）

`Vec<T>` は可変長の配列、`String` は可変長の文字列。コレクションはイテレータと組み合わせて操作する。

```rust
fn main() {
    // ベクタの生成と要素追加
    let mut v: Vec<i32> = Vec::new();
    v.push(1);
    v.push(2);
    v.push(3);

    // マクロでの初期化
    let nums = vec![10, 20, 30];

    // イテレータでの加工（mapとcollect）
    let doubled: Vec<i32> = nums.iter().map(|x| x * 2).collect();
    println!("{:?}", doubled); // [20, 40, 60]

    // フィルタと合計
    let sum: i32 = v.iter().filter(|&&x| x > 1).sum();
    println!("合計: {}", sum); // 合計: 5

    // 文字列の生成と連結
    let mut s = String::from("Hello");
    s.push_str(", world");
    s.push('!');

    // フォーマットによる文字列構築
    let name = "Rust";
    let msg = format!("{} へようこそ", name);
    println!("{}", msg); // Rust へようこそ

    // 文字数のカウントと反復
    for c in "あいう".chars() {
        print!("{} ", c); // あ い う
    }
}
```
