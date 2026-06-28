---
title: "TypeScript基本文法"
tags:
  - "プログラミング"
created: 2026-06-28T10:00:00+09:00
modified: 2026-06-28T10:00:00+09:00
sirusita: "1"
---

## TypeScript基本文法

JavaScriptに静的な型システムを加えた言語の基本構文。コンパイル時に型の不整合を検出し、安全で保守しやすいコードを実現する型注釈の実例集。

---

### 1. 型注釈と基本型

変数・引数・戻り値に `: 型名` で型を付与する。`string` / `number` / `boolean` / `array` などの基本型を持つ。

```typescript
// 変数への型注釈
let name: string = "Alice";
let age: number = 20;
let active: boolean = true;

// 配列の型（2通りの記法）
let nums: number[] = [1, 2, 3];
let words: Array<string> = ["a", "b"];

// タプル（要素ごとに型を固定）
let pair: [string, number] = ["x", 1];

```

---

### 2. interface と type

オブジェクトの構造を定義する `interface` と、型に別名を付ける `type`。`?` で省略可能なプロパティを表現。

```typescript
// interfaceによるオブジェクト型の定義
interface User {
  id: number;
  name: string;
  email?: string; // 省略可能なプロパティ
}

// type による型エイリアス
type Point = {
  x: number;
  y: number;
};

const u: User = { id: 1, name: "Bob" };

```

---

### 3. ユニオン型・リテラル型

`|` で複数の型のいずれかを許す union 型と、特定の値のみを許すリテラル型。

```typescript
// ユニオン型（文字列または数値）
let id: string | number;
id = "abc";
id = 123;

// リテラル型（決まった値のみ許可）
type Direction = "up" | "down" | "left" | "right";
let move: Direction = "up";
// move = "back"; // エラー

```

---

### 4. 関数の型

引数と戻り値に型を指定する。アロー関数の型注釈やオプション引数・デフォルト引数も表現可能。

```typescript
// 引数と戻り値の型注釈
function add(a: number, b: number): number {
  return a + b;
}

// アロー関数（関数全体の型を定義）
const multiply: (a: number, b: number) => number = (a, b) => a * b;

// オプション引数（?）とデフォルト引数
function greet(name: string, prefix: string = "Mr."): string {
  return `${prefix} ${name}`;
}

```

---

### 5. ジェネリクス（Generics）

型を引数のように受け取り、様々な型に対応する再利用可能な関数・クラスを定義する仕組み。

```typescript
// 型引数 T を受け取る関数
function identity<T>(value: T): T {
  return value;
}
identity<string>("hello");
identity<number>(42);

// ジェネリックなインターフェース
interface Box<T> {
  content: T;
}
const stringBox: Box<string> = { content: "text" };

```

---

### 6. 列挙型（enum）と型ガード

名前付き定数の集合を表す `enum` と、`typeof` / `in` による型の絞り込み（型ガード）。

```typescript
// enum（列挙型）
enum Status {
  Active,
  Inactive,
  Pending,
}
let s: Status = Status.Active;

// 型ガード（typeof による絞り込み）
function printId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase()); // string として扱える
  } else {
    console.log(id.toFixed(2));    // number として扱える
  }
}

```

---

### 7. ユーティリティ型

既存の型から新しい型を生成する組み込み型。`Partial` / `Pick` / `Omit` / `Readonly` などが代表的。

```typescript
interface Todo {
  title: string;
  done: boolean;
  priority: number;
}

// Partial（全プロパティを省略可能に）
type TodoUpdate = Partial<Todo>;

// Pick（一部のプロパティだけ抽出）
type TodoPreview = Pick<Todo, "title" | "done">;

// Omit（指定プロパティを除外）
type TodoNoPriority = Omit<Todo, "priority">;

// Readonly（全プロパティを読み取り専用に）
type FrozenTodo = Readonly<Todo>;

```

---

### 8. クラスとアクセス修飾子

クラスのメンバーに `public` / `private` / `protected` を指定し、可視性を制御する。`readonly` で再代入も禁止可能。

```typescript
class Account {
  // アクセス修飾子（コンストラクタ引数で簡潔に宣言）
  constructor(
    public readonly id: number,
    private balance: number,
  ) {}

  // メソッドからは private メンバーへアクセス可能
  deposit(amount: number): void {
    this.balance += amount;
  }

  getBalance(): number {
    return this.balance;
  }
}

const acc = new Account(1, 1000);
acc.deposit(500);
// acc.balance; // エラー（privateのため外部参照不可）

```
