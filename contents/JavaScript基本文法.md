---
title: "JavaScript基本文法"
tags:
  - "プログラミング"
created: 2026-06-28T10:00:00+09:00
modified: 2026-06-28T10:00:00+09:00
sirusita: "1"
---

## JavaScript基本文法

Webのフロントからサーバーまで幅広く動作する動的型付け言語の基本構文。ES2015（ES6）以降のモダンな書き方を中心とした実例集。

---

### 1. 変数宣言（let / const）

ブロックスコープを持つ `let` と再代入不可の `const` を使うのが基本。`var` は関数スコープのため現在は非推奨。

```javascript
// 再代入が可能な変数
let count = 0;
count = 1;

// 再代入が不可の定数（オブジェクトの中身は変更可能）
const name = "Alice";
const user = { age: 20 };
user.age = 21; // プロパティの変更はOK

```

---

### 2. データ型とテンプレートリテラル

プリミティブ型（数値・文字列・真偽値・null・undefined・シンボル・BigInt）とオブジェクト型を持つ。バッククォートによる文字列の埋め込みが便利。

```javascript
const num = 42;          // number
const text = "hello";    // string
const flag = true;       // boolean
const empty = null;      // null

// テンプレートリテラル（変数や式の埋め込み）
const who = "World";
const msg = `Hello, ${who}! 1+1=${1 + 1}`;
// => "Hello, World! 1+1=2"

```

---

### 3. 条件分岐とループ

`if / else` や `switch` による分岐と、`for` / `for...of` による反復。厳密等価演算子 `===` の使用が推奨。

```javascript
// if文（=== は型も含めた厳密な比較）
if (num === 42) {
  console.log("正解");
} else {
  console.log("不正解");
}

// switch文
switch (text) {
  case "hello":
    console.log("挨拶");
    break;
  default:
    console.log("その他");
}

// for...of（配列の各要素を走査）
for (const item of [10, 20, 30]) {
  console.log(item);
}

```

---

### 4. 関数（アロー関数・デフォルト引数）

`function` 宣言に加え、簡潔に書けるアロー関数が主流。引数のデフォルト値も指定可能。

```javascript
// 通常の関数宣言
function add(a, b) {
  return a + b;
}

// アロー関数（式が1つなら return 省略可）
const square = (x) => x * x;

// デフォルト引数
const greet = (name = "Guest") => `Hi, ${name}`;
greet();        // => "Hi, Guest"
greet("Bob");   // => "Hi, Bob"

```

---

### 5. 配列・オブジェクト操作

`map` / `filter` / `reduce` などの高階関数、分割代入、スプレッド構文によるモダンな操作。

```javascript
const nums = [1, 2, 3, 4];

// map（各要素を変換）/ filter（条件で絞り込み）
const doubled = nums.map((n) => n * 2);       // [2, 4, 6, 8]
const evens = nums.filter((n) => n % 2 === 0); // [2, 4]

// 分割代入（配列・オブジェクト）
const [first, second] = nums;          // first=1, second=2
const { age } = { age: 30, city: "Tokyo" };

// スプレッド構文（展開・結合）
const merged = [...nums, 5, 6];
const clone = { ...user, age: 22 };

```

---

### 6. 非同期処理（Promise / async-await）

非同期の結果を表す `Promise` と、それを同期的な見た目で扱える `async / await` 構文。

```javascript
// Promiseを返す関数
function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve("done"), 1000);
  });
}

// async / await による待機（try/catch でエラー処理）
async function main() {
  try {
    const result = await fetchData();
    console.log(result); // "done"
  } catch (err) {
    console.error(err);
  }
}

```

---

### 7. クラス（Class）

`class` 構文によるオブジェクト指向の記述。コンストラクタ・メソッド・継承（extends）をサポート。

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} が鳴く`;
  }
}

// 継承（extends と super）
class Dog extends Animal {
  speak() {
    return `${this.name} がワンと鳴く`;
  }
}

const dog = new Dog("ポチ");
dog.speak(); // "ポチ がワンと鳴く"

```

---

### 8. モジュール（import / export）

ファイル単位でコードを分割し再利用する仕組み。名前付きエクスポートとデフォルトエクスポートの2種類。

```javascript
// math.js（エクスポート側）
export const PI = 3.14;
export function add(a, b) {
  return a + b;
}
export default function multiply(a, b) {
  return a * b;
}

// main.js（インポート側）
import multiply, { PI, add } from "./math.js";
add(1, 2);      // 3
multiply(2, 3); // 6

```
