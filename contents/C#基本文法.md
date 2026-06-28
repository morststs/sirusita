---
title: "C#基本文法"
tags:
  - "プログラミング"
created: 2026-06-28T10:00:00+09:00
modified: 2026-06-28T10:00:00+09:00
sirusita: "1"
---

## C#基本文法

.NET 上で動作する、オブジェクト指向と関数型の特徴を併せ持つ静的型付け言語の基本構文。

---

### 1. 変数と型（var／値型・参照型）

値型はデータそのもの、参照型はオブジェクトへの参照を保持する。`var` で型推論が可能。

```csharp
// 値型（スタックに値を保持）
int count = 10;
double price = 99.9;
bool flag = true;

// 参照型（ヒープのオブジェクトを参照）
string name = "Sirusita";

// var による型推論
var message = "Hello"; // string と推論される

// null 許容型（値型に null を許可）
int? maybe = null;
```

---

### 2. 条件分岐とループ

`if` / `switch` による分岐と、`for` / `foreach` / `while` による反復。switch 式も利用可能。

```csharp
// if-else 文
int score = 80;
if (score >= 90)
    Console.WriteLine("優");
else if (score >= 60)
    Console.WriteLine("可");
else
    Console.WriteLine("不可");

// switch 式（パターンに応じて値を返す）
string grade = score switch
{
    >= 90 => "A",
    >= 70 => "B",
    _     => "C",
};

// foreach 文（コレクションを順に走査）
int[] nums = { 1, 2, 3 };
foreach (var n in nums)
{
    Console.WriteLine(n);
}
```

---

### 3. メソッド

戻り値の型・名前・引数を明示する関数定義。式形式メンバーや既定値引数も使える。

```csharp
// 通常のメソッド
public int Add(int a, int b)
{
    return a + b;
}

// 式形式メンバー（短い処理を簡潔に記述）
public int Square(int x) => x * x;

// 既定値引数と名前付き引数
public string Greet(string name, string prefix = "Mr.")
    => $"{prefix} {name}";
```

---

### 4. クラスとプロパティ

データと振る舞いをまとめるクラス。getter / setter を簡潔に書く自動プロパティが特徴。

```csharp
class Person
{
    // 自動実装プロパティ
    public string Name { get; set; }

    // 読み取り専用プロパティ
    public int Age { get; }

    // コンストラクタ（生成時の初期化）
    public Person(string name, int age)
    {
        Name = name;
        Age = age;
    }

    public string Introduce() => $"I am {Name}, {Age} years old.";
}

// 利用例
var p = new Person("Taro", 20);
Console.WriteLine(p.Introduce());
```

---

### 5. 継承／インターフェース

`:` で継承とインターフェース実装を表す。`virtual` / `override` でメソッドを多態化する。

```csharp
// インターフェース（実装すべき契約）
interface IGreeter
{
    string Greet();
}

// 基底クラス
class Animal
{
    public virtual string Sound() => "...";
}

// 継承とインターフェース実装
class Dog : Animal, IGreeter
{
    public override string Sound() => "Woof"; // 上書き
    public string Greet() => "Hello from Dog";
}
```

---

### 6. コレクションとジェネリクス（List<T>／Dictionary）

型パラメータで要素型を指定する、型安全な可変長データ構造。

```csharp
using System.Collections.Generic;

// List<T>（順序付き・重複可）
var list = new List<string> { "apple", "banana" };
list.Add("cherry");

// Dictionary<TKey, TValue>（キーと値のペア）
var map = new Dictionary<string, int>
{
    ["price"] = 100,
    ["stock"] = 5,
};
int price = map["price"];

// HashSet<T>（重複を許さない集合）
var set = new HashSet<int> { 1, 2, 2 }; // 要素は {1, 2}
```

---

### 7. LINQ

コレクションを宣言的に問い合わせる統合言語クエリ。メソッド構文とクエリ構文の二系統。

```csharp
using System.Linq;

var nums = new[] { 1, 2, 3, 4, 5 };

// メソッド構文（メソッドチェーン）
var result = nums
    .Where(n => n % 2 == 0)  // 偶数のみ抽出
    .Select(n => n * 10)     // 各要素を 10 倍
    .ToList();
// result = [20, 40]

// クエリ構文（SQL ライクな記述）
var query = from n in nums
            where n > 2
            orderby n descending
            select n;

int total = nums.Sum(); // 合計の算出
```

---

### 8. 例外処理

`try-catch-finally` で実行時エラーを捕捉。`using` でリソースを自動解放する。

```csharp
// try-catch-finally
try
{
    int x = int.Parse("abc"); // FormatException が発生
}
catch (FormatException ex)
{
    Console.WriteLine($"変換失敗: {ex.Message}");
}
finally
{
    Console.WriteLine("必ず実行される後処理");
}

// using 宣言（スコープ終了時に自動 Dispose）
using var reader = new System.IO.StreamReader("a.txt");
string? line = reader.ReadLine();
```

---

### 9. async／await

非同期処理を同期的な見た目で記述する仕組み。I/O 待ちでスレッドを解放する。

```csharp
using System.Threading.Tasks;

// 非同期メソッド（Task を返す）
public async Task<string> FetchAsync()
{
    await Task.Delay(1000);   // 非同期に 1 秒待機
    return "完了";
}

// 呼び出し側（await で結果を待つ）
public async Task RunAsync()
{
    string result = await FetchAsync();
    Console.WriteLine(result);
}
```

---

### 10. レコード型

不変なデータ保持に適した参照型。値ベースの等価比較と簡潔な定義が特徴。

```csharp
// レコードの定義（プライマリコンストラクタで簡潔に）
public record Point(int X, int Y);

var a = new Point(1, 2);
var b = new Point(1, 2);

// 値ベースの等価比較（同じ値なら等しい）
bool same = a == b; // true

// 非破壊的更新（with 式で一部だけ変えた複製を生成）
var c = a with { X = 10 }; // Point { X = 10, Y = 2 }
```
