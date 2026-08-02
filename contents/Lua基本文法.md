---
title: "Lua基本文法"
tags:
  - "プログラミング"
created: 2026-08-02T10:00:00+09:00
modified: 2026-08-02T10:00:00+09:00
sirusita: "1"
---

## Lua基本文法

軽量で組み込み用途に強いスクリプト言語の基本構文。ゲームエンジン（Roblox, LÖVE 等）や Neovim の設定言語としても使われる。配列の添字は 1 始まりが特徴。

---

### 1. 変数と型

`local` を付けるとローカル変数、付けなければグローバル変数になる。動的型付けで、`nil` / `boolean` / `number` / `string` / `table` / `function` などの型を持つ。

```lua
-- ローカル変数（宣言したスコープ内でのみ有効）
local name = "tako"
local age = 20

-- グローバル変数（localを付けない。基本的には非推奨）
score = 100

-- 型は動的に決まる。type()で確認可能
print(type(name))  -- string
print(type(age))   -- number
print(type(nil))   -- nil

-- 複数代入
local a, b = 1, 2
a, b = b, a  -- 値の入れ替え
```

---

### 2. 条件分岐（if / elseif / else）

`then` と `end` で囲む。`falsy` とみなされるのは `nil` と `false` のみ（`0` や `""` は truthy）。

```lua
local n = 7

if n % 2 == 0 then
    print("偶数")
elseif n > 100 then
    print("大きい奇数")
else
    print("奇数")
end

-- 三項演算子の代用（and/orの組み合わせ）
local label = (n % 2 == 0) and "偶数" or "奇数"
```

---

### 3. ループ処理（for / while / repeat）

数値 for、テーブル走査用の `ipairs`/`pairs`、条件付きの `while`、後置判定の `repeat...until` がある。

```lua
-- 数値for（開始, 終了, 増分）
for i = 1, 5 do
    print(i)  -- 1, 2, 3, 4, 5
end

-- 配列（連番テーブル）をipairsで順に走査
local fruits = {"apple", "banana", "cherry"}
for index, value in ipairs(fruits) do
    print(index, value)
end

-- 連想配列をpairsで走査（順序は保証されない）
local user = {name = "tako", age = 20}
for key, value in pairs(user) do
    print(key, value)
end

-- while
local count = 0
while count < 3 do
    count = count + 1
end

-- repeat...until（少なくとも1回は実行される）
local i = 0
repeat
    i = i + 1
until i >= 3
```

---

### 4. 関数

`function` で定義。複数の戻り値を返せる。可変長引数は `...` で受け取る。

```lua
-- 引数と戻り値を持つ関数
local function add(a, b)
    return a + b
end

-- 複数の戻り値
local function minmax(list)
    local mn, mx = list[1], list[1]
    for _, v in ipairs(list) do
        if v < mn then mn = v end
        if v > mx then mx = v end
    end
    return mn, mx
end

local low, high = minmax({3, 1, 4, 1, 5})

-- 可変長引数
local function sum(...)
    local total = 0
    for _, v in ipairs({...}) do
        total = total + v
    end
    return total
end

print(sum(1, 2, 3))  -- 6
```

---

### 5. テーブル（table）

Lua で唯一の複合データ構造。配列（連番キー）にも連想配列（文字列キー）にもなり、オブジェクト表現にも使われる。

```lua
-- 配列的な使い方（添字は1始まり）
local arr = {"a", "b", "c"}
print(arr[1])       -- a
table.insert(arr, "d")     -- 末尾に追加
table.remove(arr, 1)       -- 先頭を削除

-- 連想配列的な使い方
local point = {x = 10, y = 20}
print(point.x)       -- 10（point["x"]と同じ）

-- ネストしたテーブル
local config = {
    name = "app",
    servers = {"web1", "web2"},
}

-- #演算子で配列の長さを取得（連番テーブルのみ有効）
print(#arr)
```

---

### 6. メタテーブルとオブジェクト指向風の実装

Lua に「クラス」構文はないが、テーブルと `metatable` の `__index` を組み合わせてオブジェクト指向のようなコードを書ける。

```lua
-- 「クラス」をテーブルとして定義
local Animal = {}
Animal.__index = Animal

-- コンストラクタ
function Animal.new(name)
    local self = setmetatable({}, Animal)
    self.name = name
    return self
end

-- 「メソッド」（第一引数selfで自分自身を受け取る）
function Animal:speak()
    print(self.name .. " が鳴いた")
end

local cat = Animal.new("たま")
cat:speak()  -- たま が鳴いた（cat:speak() は Animal.speak(cat) の糖衣構文）
```

---

### 7. モジュール（require）

ファイルの末尾でテーブルを `return` すると、他のファイルから `require` で読み込める。

```lua
-- mathutils.lua
local M = {}

function M.double(x)
    return x * 2
end

return M
```

```lua
-- main.lua
local mathutils = require("mathutils")
print(mathutils.double(21))  -- 42
```
