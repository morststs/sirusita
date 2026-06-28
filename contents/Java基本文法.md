---
title: "Java基本文法"
tags:
  - "プログラミング"
created: 2026-06-28T10:00:00+09:00
modified: 2026-06-28T10:00:00+09:00
sirusita: "1"
---

## Java基本文法

オブジェクト指向と静的型付けを基盤とする、JVM 上で動作する汎用言語の基本構文。

---

### 1. 変数と型（プリミティブ／参照）

8 種のプリミティブ型と、オブジェクトを指す参照型の二系統。型推論には `var` を使用する。

```java
// プリミティブ型（値そのものを保持）
int count = 10;
double price = 99.9;
boolean flag = true;
char initial = 'A';

// 参照型（オブジェクトへの参照を保持）
String name = "Sirusita";

// var による型推論（ローカル変数限定・Java 10以降）
var message = "Hello"; // String と推論される
```

---

### 2. 条件分岐とループ（拡張for）

`if` / `switch` による分岐と、配列・コレクションを走査する拡張 for 文。

```java
// if-else 文
int score = 80;
if (score >= 90) {
    System.out.println("優");
} else if (score >= 60) {
    System.out.println("可");
} else {
    System.out.println("不可");
}

// switch 文（アロー構文・Java 14以降）
String grade = switch (score / 10) {
    case 10, 9 -> "A";
    case 8, 7  -> "B";
    default    -> "C";
};

// 拡張 for 文（要素を順に取り出す）
int[] nums = {1, 2, 3};
for (int n : nums) {
    System.out.println(n);
}
```

---

### 3. メソッド定義

戻り値の型・名前・引数を明示する関数定義。可変長引数やオーバーロードも可能。

```java
// 引数を 2 つ取り int を返すメソッド
public int add(int a, int b) {
    return a + b;
}

// 可変長引数（任意個の引数を受け取る）
public int sum(int... values) {
    int total = 0;
    for (int v : values) {
        total += v;
    }
    return total;
}
```

---

### 4. クラスとオブジェクト（コンストラクタ／継承／インターフェース）

データと振る舞いをまとめるクラス。`extends` で継承、`implements` でインターフェース実装。

```java
// インターフェースの定義（実装すべき契約）
interface Greeter {
    String greet();
}

// クラスとコンストラクタ
class Person implements Greeter {
    private String name;

    // コンストラクタ（生成時の初期化）
    public Person(String name) {
        this.name = name;
    }

    @Override
    public String greet() {
        return "Hi, " + name;
    }
}

// 継承（Person を拡張）
class Student extends Person {
    public Student(String name) {
        super(name); // 親のコンストラクタ呼び出し
    }
}
```

---

### 5. コレクション（List／Map／Set）

可変長のデータ構造を提供する標準ライブラリ。インターフェースと実装クラスを使い分ける。

```java
import java.util.*;

// List（順序付き・重複可）
List<String> list = new ArrayList<>();
list.add("apple");
list.add("banana");

// Map（キーと値のペア）
Map<String, Integer> map = new HashMap<>();
map.put("price", 100);
int price = map.get("price");

// Set（重複を許さない集合）
Set<Integer> set = new HashSet<>();
set.add(1);
set.add(1); // 重複は無視される
```

---

### 6. ジェネリクス

型をパラメータ化し、型安全なクラスやメソッドを実現する仕組み。

```java
// ジェネリックなクラス（型 T を後から指定）
class Box<T> {
    private T value;

    public void set(T value) {
        this.value = value;
    }

    public T get() {
        return value;
    }
}

// 利用例（String 専用の Box として扱う）
Box<String> box = new Box<>();
box.set("data");
String s = box.get(); // キャスト不要
```

---

### 7. 例外処理（try-catch）

実行時のエラーを捕捉・処理する構文。`finally` で後始末、`try-with-resources` で自動クローズ。

```java
// try-catch-finally
try {
    int result = 10 / 0; // ArithmeticException が発生
} catch (ArithmeticException e) {
    System.out.println("ゼロ除算: " + e.getMessage());
} finally {
    System.out.println("必ず実行される後処理");
}

// try-with-resources（リソースを自動でクローズ）
try (var reader = new java.io.BufferedReader(new java.io.FileReader("a.txt"))) {
    System.out.println(reader.readLine());
} catch (java.io.IOException e) {
    System.out.println("読み込み失敗");
}
```

---

### 8. ラムダ式とStream API

関数型インターフェースを簡潔に記述するラムダ式と、コレクションを宣言的に処理する Stream。

```java
import java.util.*;
import java.util.stream.*;

// ラムダ式（関数を値として渡す）
Runnable task = () -> System.out.println("実行");
task.run();

// Stream API（フィルタ・変換・集約を連結）
List<Integer> nums = List.of(1, 2, 3, 4, 5);
List<Integer> result = nums.stream()
    .filter(n -> n % 2 == 0)   // 偶数のみ抽出
    .map(n -> n * 10)          // 各要素を 10 倍
    .collect(Collectors.toList());
// result = [20, 40]

// 合計の算出
int total = nums.stream().mapToInt(Integer::intValue).sum();
```
