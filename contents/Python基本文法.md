---
title: "Python基本文法"
tags:
  - "プログラミング"
created: 2026-06-28T10:00:00+09:00
modified: 2026-06-28T10:00:00+09:00
sirusita: "1"
---

## Python基本文法

Python 3 系でよく使う基本文法のチートシート。変数・制御構文・関数・データ構造・クラス・例外処理・標準ライブラリまでを網羅。

---

### 1. 変数と型

Python は動的型付けで、宣言時に型を書く必要はない。`type()` で型を確認できる。

```python
# 基本的な型
name = "Sirusita"      # str（文字列）
count = 42             # int（整数）
price = 99.9           # float（浮動小数点数）
is_active = True       # bool（真偽値）
nothing = None         # None（値が無いことを表す）

# 型の確認と変換
print(type(count))     # <class 'int'>
print(int("100"))      # 文字列 -> 整数: 100
print(str(3.14))       # 数値 -> 文字列: "3.14"

# 複数代入とアンパック
x, y = 1, 2            # x=1, y=2
a = b = 0              # a も b も 0
```

---

### 2. 文字列とf-string

f-string（`f"..."`）を使うと、文字列の中に変数や式を埋め込める。書式指定も可能。

```python
name = "Taro"
score = 87.567

# 変数と式の埋め込み
print(f"こんにちは、{name}さん")          # こんにちは、Taroさん
print(f"合計は {10 + 20} です")           # 合計は 30 です

# 書式指定（小数点以下2桁・3桁区切り）
print(f"点数: {score:.2f}")               # 点数: 87.57
print(f"金額: {1234567:,} 円")            # 金額: 1,234,567 円

# よく使う文字列メソッド
text = " Hello World "
print(text.strip())                       # 前後の空白を除去: "Hello World"
print(text.strip().upper())               # 大文字化: "HELLO WORLD"
print("a,b,c".split(","))                 # 分割: ['a', 'b', 'c']
print("-".join(["2026", "06", "28"]))     # 連結: "2026-06-28"
```

---

### 3. 条件分岐（if / match）

`if / elif / else` で条件分岐。Python 3.10 以降は `match` 文も使える。

```python
score = 75

# if / elif / else
if score >= 80:
    grade = "A"
elif score >= 60:
    grade = "B"
else:
    grade = "C"
print(grade)                              # B

# 三項演算子（条件式を1行で）
status = "合格" if score >= 60 else "不合格"

# match 文（Python 3.10+）
command = "start"
match command:
    case "start":
        print("開始します")
    case "stop":
        print("停止します")
    case _:                               # _ は任意の値（デフォルト）
        print("不明なコマンド")
```

---

### 4. ループ（for / while / 内包表記）

`for` は反復可能オブジェクトを順に処理し、`while` は条件が真の間繰り返す。内包表記で簡潔に記述できる。

```python
# for ループと range / enumerate
for i in range(3):                        # 0, 1, 2
    print(i)

for index, fruit in enumerate(["apple", "banana"]):
    print(index, fruit)                   # 0 apple / 1 banana

# while ループと break / continue
n = 0
while n < 5:
    n += 1
    if n == 2:
        continue                          # 2 をスキップ
    if n == 4:
        break                             # 4 で終了
    print(n)                              # 1, 3

# リスト内包表記（偶数の2乗だけ集める）
squares = [x * x for x in range(10) if x % 2 == 0]
print(squares)                            # [0, 4, 16, 36, 64]

# 辞書内包表記
table = {x: x ** 2 for x in range(1, 4)}  # {1: 1, 2: 4, 3: 9}
```

---

### 5. 関数（デフォルト引数 / 可変長 / 型ヒント）

`def` で関数を定義する。デフォルト引数・可変長引数・型ヒントを活用すると柔軟で読みやすくなる。

```python
# 基本・デフォルト引数・型ヒント
def greet(name: str, greeting: str = "こんにちは") -> str:
    return f"{greeting}、{name}さん"

print(greet("花子"))                      # こんにちは、花子さん
print(greet("Bob", "Hello"))              # Hello、Bobさん

# 可変長引数 *args（タプル）と **kwargs（辞書）
def summarize(*args, **kwargs):
    print("位置引数:", args)              # タプルで受け取る
    print("キーワード引数:", kwargs)      # 辞書で受け取る

summarize(1, 2, 3, name="Taro", age=20)

# ラムダ式（無名関数）
double = lambda x: x * 2
print(double(5))                          # 10
```

---

### 6. データ構造（list / dict / set / tuple）

代表的な4つのコレクション型。用途に応じて使い分ける。

```python
# list（順序あり・変更可）
nums = [3, 1, 2]
nums.append(4)                            # 末尾追加: [3, 1, 2, 4]
nums.sort()                               # ソート: [1, 2, 3, 4]
print(nums[0], nums[-1])                  # 先頭 1 / 末尾 4

# dict（キーと値のペア）
user = {"name": "Taro", "age": 20}
user["email"] = "taro@example.com"        # 追加
print(user.get("age"))                    # 20
for key, value in user.items():           # キーと値を反復
    print(key, value)

# set（重複なし・集合演算）
a = {1, 2, 3}
b = {2, 3, 4}
print(a & b)                              # 積集合: {2, 3}
print(a | b)                              # 和集合: {1, 2, 3, 4}

# tuple（変更不可）
point = (10, 20)
px, py = point                            # アンパック: px=10, py=20
```

---

### 7. クラスとオブジェクト

`class` でクラスを定義する。`__init__` で初期化し、`self` でインスタンス自身を参照する。

```python
class Animal:
    def __init__(self, name: str):
        self.name = name                  # インスタンス変数

    def speak(self) -> str:               # メソッド
        return f"{self.name} が鳴いた"

# 継承
class Dog(Animal):
    def speak(self) -> str:               # メソッドのオーバーライド
        return f"{self.name}: ワン！"

dog = Dog("ポチ")
print(dog.speak())                        # ポチ: ワン！
print(isinstance(dog, Animal))            # True（Animal を継承）

# 文字列表現を整える __repr__
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __repr__(self):
        return f"Point({self.x}, {self.y})"

print(Point(1, 2))                        # Point(1, 2)
```

---

### 8. 例外処理とよく使う標準ライブラリ

`try / except` で例外を捕捉する。標準ライブラリも豊富で、import するだけで使える。

```python
# 例外処理
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"エラー: {e}")                 # エラー: division by zero
except (ValueError, TypeError):
    print("値または型のエラー")
else:
    print("正常終了")                     # 例外が出なかった時だけ実行
finally:
    print("必ず実行される後処理")

# よく使う標準ライブラリ
import datetime, json, math, random, os

print(datetime.date.today())              # 今日の日付
print(json.dumps({"a": 1}))               # 辞書 -> JSON文字列: {"a": 1}
print(math.sqrt(16))                      # 平方根: 4.0
print(random.randint(1, 6))              # 1〜6 のサイコロ
print(os.path.join("dir", "file.txt"))    # パス連結: dir/file.txt
```
