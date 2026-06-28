---
title: "C++基本文法"
tags:
  - "プログラミング"
created: 2026-06-28T10:00:00+09:00
modified: 2026-06-28T10:00:00+09:00
sirusita: "1"
---

## C++の基本文法

C言語を拡張し、オブジェクト指向やジェネリックプログラミングを備えた静的型付け言語の基本構文。

---

### 1. 変数と型（auto）

明示的な型指定に加え、`auto` による型推論で簡潔に変数を定義できる。

```cpp
#include <string>

int         count = 10;        // 明示的な型指定
double      pi    = 3.14;
std::string name  = "Sirusita";

auto x = 42;        // int と推論
auto y = 3.14;      // double と推論
auto z = name;      // std::string と推論
```

---

### 2. 入出力（cin / cout）

標準入出力ストリームを用いた入出力。`<<` で出力、`>>` で入力を行う。

```cpp
#include <iostream>
using namespace std;

int main() {
    string name;
    int age;

    cout << "名前と年齢を入力: ";
    cin >> name >> age;          // 標準入力から受け取る

    // endlで改行とフラッシュ
    cout << name << "さん(" << age << "歳)" << endl;
    return 0;
}
```

---

### 3. 条件分岐とループ（範囲for）

基本の条件分岐に加え、コンテナを簡潔に走査する範囲ベースの `for` を利用できる。

```cpp
#include <vector>
using namespace std;

int score = 85;
if (score >= 80) {
    cout << "合格" << endl;
} else {
    cout << "不合格" << endl;
}

vector<int> nums = {1, 2, 3};
// 範囲for（参照&で要素を直接走査）
for (const auto &n : nums) {
    cout << n << " ";
}
```

---

### 4. 関数（参照渡し / オーバーロード）

参照渡しによる効率的な引数受け渡しと、同名で引数違いの関数を定義するオーバーロード。

```cpp
#include <iostream>
using namespace std;

// 参照渡し（コピーを避けつつ値を書き換え可能）
void doubleValue(int &x) {
    x *= 2;
}

// オーバーロード（引数の型・数で区別）
int  add(int a, int b)       { return a + b; }
double add(double a, double b) { return a + b; }

int main() {
    int v = 5;
    doubleValue(v);              // v は 10 になる
    cout << add(1, 2) << " " << add(1.5, 2.5) << endl;
    return 0;
}
```

---

### 5. クラスとオブジェクト（コンストラクタ / 継承）

データと振る舞いをまとめるクラス定義。コンストラクタによる初期化と継承による拡張を行う。

```cpp
#include <iostream>
#include <string>
using namespace std;

class Animal {
protected:
    string name;
public:
    // コンストラクタ
    Animal(string n) : name(n) {}
    virtual void speak() { cout << name << "が鳴く" << endl; }
};

// 継承（Animalを基底クラスとする）
class Dog : public Animal {
public:
    Dog(string n) : Animal(n) {}
    void speak() override { cout << name << ":ワン" << endl; }
};

int main() {
    Dog d("ポチ");
    d.speak();      // → ポチ:ワン
    return 0;
}
```

---

### 6. STLコンテナ（vector / map / string）

標準テンプレートライブラリが提供する、可変長配列・連想配列・文字列のコンテナ。

```cpp
#include <vector>
#include <map>
#include <string>
using namespace std;

vector<int> v = {1, 2, 3};
v.push_back(4);                 // 末尾に追加

map<string, int> scores;        // キーと値の連想配列
scores["Tanaka"] = 90;
scores["Sato"]   = 85;

string s = "Hello";
s += " World";                  // 文字列の連結
cout << s.size() << endl;       // 文字数を取得
```

---

### 7. テンプレート

型を引数化し、同一のロジックを複数の型で再利用するジェネリックプログラミングの仕組み。

```cpp
#include <iostream>
using namespace std;

// 型に依存しない汎用関数
template <typename T>
T getMax(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    cout << getMax(3, 7) << endl;        // int として動作
    cout << getMax(2.5, 1.8) << endl;    // double として動作
    return 0;
}
```

---

### 8. スマートポインタ（unique_ptr / shared_ptr）

所有権を管理し、メモリの自動解放を実現するポインタ。手動の `delete` が不要となる。

```cpp
#include <memory>
#include <iostream>
using namespace std;

int main() {
    // unique_ptr（単独所有・コピー不可）
    auto up = make_unique<int>(42);
    cout << *up << endl;

    // shared_ptr（参照カウントで共有所有）
    auto sp1 = make_shared<int>(100);
    auto sp2 = sp1;                       // 所有権を共有
    cout << "参照数:" << sp1.use_count() << endl;  // → 2

    return 0;   // スコープを抜けると自動的に解放される
}
```
