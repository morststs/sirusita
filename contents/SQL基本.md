---
title: "SQL基本"
tags:
  - "プログラミング"
created: 2026-06-28T10:00:00+09:00
modified: 2026-06-28T10:00:00+09:00
sirusita: "1"
---

## SQL基本

標準SQL（PostgreSQL系）でよく使う構文のチートシート。検索・並び替え・集計・結合・更新・テーブル定義・サブクエリ・便利な関数までを網羅。

---

### 1. SELECT / WHERE（データの取得と絞り込み）

`SELECT` で取り出す列を指定し、`WHERE` で行を絞り込む。

```sql
-- 全列を取得
SELECT * FROM users;

-- 必要な列だけ取得（別名は AS）
SELECT id, name AS 名前, email FROM users;

-- WHERE で条件を指定
SELECT * FROM users
WHERE age >= 20                 -- 20歳以上
  AND status = 'active';        -- かつ アクティブ

-- いろいろな条件
SELECT * FROM products
WHERE price BETWEEN 100 AND 500 -- 範囲指定（100〜500）
  AND category IN ('food', 'drink') -- いずれかに一致
  AND name LIKE '%茶%';         -- 部分一致（%は任意の文字列）
```

---

### 2. 並び替え（ORDER BY）と件数制限（LIMIT）

`ORDER BY` で並び替え、`LIMIT` / `OFFSET` で取得件数や開始位置を制御する。

```sql
-- 価格の高い順に並べる（DESC=降順、ASC=昇順）
SELECT name, price FROM products
ORDER BY price DESC;

-- 複数キーで並び替え（カテゴリ昇順 -> その中で価格降順）
SELECT * FROM products
ORDER BY category ASC, price DESC;

-- 上位5件だけ取得
SELECT * FROM products
ORDER BY price DESC
LIMIT 5;

-- 6件目から10件分取得（ページング: 2ページ目）
SELECT * FROM products
ORDER BY id
LIMIT 5 OFFSET 5;
```

---

### 3. 集計（GROUP BY / HAVING / 集計関数）

`GROUP BY` で行をグループ化し、集計関数で計算する。グループ後の絞り込みは `HAVING` を使う。

```sql
-- 主な集計関数
SELECT
  COUNT(*)      AS 件数,        -- 行数
  SUM(amount)   AS 合計,        -- 合計
  AVG(amount)   AS 平均,        -- 平均
  MAX(amount)   AS 最大,        -- 最大
  MIN(amount)   AS 最小         -- 最小
FROM orders;

-- カテゴリごとに売上を集計
SELECT category, SUM(amount) AS 売上合計
FROM orders
GROUP BY category;

-- HAVING でグループを絞り込む（合計が1000を超えるカテゴリのみ）
SELECT category, SUM(amount) AS 売上合計
FROM orders
GROUP BY category
HAVING SUM(amount) > 1000
ORDER BY 売上合計 DESC;
```

---

### 4. JOIN（テーブルの結合）

複数のテーブルを関連する列で結合する。INNER は両方に存在する行、LEFT/RIGHT は片方を基準に残す。

```sql
-- INNER JOIN: 両テーブルに一致する行のみ
SELECT u.name, o.amount
FROM users AS u
INNER JOIN orders AS o ON u.id = o.user_id;

-- LEFT JOIN: 左(users)を全て残し、右に無ければ NULL
SELECT u.name, o.amount
FROM users AS u
LEFT JOIN orders AS o ON u.id = o.user_id;

-- RIGHT JOIN: 右(orders)を全て残す
SELECT u.name, o.amount
FROM users AS u
RIGHT JOIN orders AS o ON u.id = o.user_id;

-- 結合 + 集計（ユーザーごとの注文回数）
SELECT u.name, COUNT(o.id) AS 注文回数
FROM users AS u
LEFT JOIN orders AS o ON u.id = o.user_id
GROUP BY u.name;
```

---

### 5. INSERT / UPDATE / DELETE（データの追加・更新・削除）

行の追加・更新・削除を行う。UPDATE と DELETE では `WHERE` の付け忘れに注意。

```sql
-- INSERT: 1行追加
INSERT INTO users (name, email, age)
VALUES ('山田太郎', 'taro@example.com', 25);

-- INSERT: 複数行をまとめて追加
INSERT INTO users (name, age) VALUES
  ('佐藤', 30),
  ('鈴木', 28);

-- UPDATE: 条件に合う行を更新（WHERE 必須）
UPDATE users
SET age = 26, status = 'active'
WHERE id = 1;

-- DELETE: 条件に合う行を削除（WHERE 必須）
DELETE FROM users
WHERE status = 'inactive';
```

---

### 6. テーブル定義（CREATE TABLE / 制約）

`CREATE TABLE` でテーブルを作成する。制約（NOT NULL, UNIQUE, 主キー, 外部キーなど）でデータの整合性を保つ。

```sql
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,          -- 自動採番の主キー
  name        VARCHAR(100) NOT NULL,       -- NULL 禁止
  email       VARCHAR(255) UNIQUE,         -- 重複禁止
  age         INTEGER CHECK (age >= 0),    -- 0以上のみ許可
  status      VARCHAR(20) DEFAULT 'active',-- 既定値
  created_at  TIMESTAMP DEFAULT NOW()      -- 作成日時
);

-- 外部キー制約（users を参照）
CREATE TABLE orders (
  id       SERIAL PRIMARY KEY,
  user_id  INTEGER REFERENCES users(id),   -- users.id を参照
  amount   NUMERIC(10, 2) NOT NULL         -- 数値（整数10桁・小数2桁）
);

-- 列の追加・テーブル削除
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
DROP TABLE IF EXISTS orders;
```

---

### 7. サブクエリ（問い合わせの入れ子）

クエリの中に別のクエリを書き、その結果を条件や値として使う。

```sql
-- WHERE 内のサブクエリ（平均より高い商品）
SELECT name, price FROM products
WHERE price > (SELECT AVG(price) FROM products);

-- IN を使ったサブクエリ（注文のあるユーザーだけ）
SELECT name FROM users
WHERE id IN (SELECT DISTINCT user_id FROM orders);

-- EXISTS（注文が存在するユーザー）
SELECT name FROM users AS u
WHERE EXISTS (
  SELECT 1 FROM orders AS o WHERE o.user_id = u.id
);

-- FROM 句のサブクエリ（派生テーブル）
SELECT category, 平均
FROM (
  SELECT category, AVG(price) AS 平均
  FROM products
  GROUP BY category
) AS t
WHERE 平均 > 300;
```

---

### 8. よく使う関数（COUNT / COALESCE / CASE など）

集計・NULL処理・条件分岐・文字列/日付操作などでよく使う関数をまとめる。

```sql
-- COUNT の使い分け
SELECT
  COUNT(*)        AS 全行数,     -- NULL含む全行
  COUNT(email)    AS メール数,   -- NULL を除いた件数
  COUNT(DISTINCT category) AS 種類数 -- 重複を除いた件数
FROM users;

-- COALESCE: 最初の非NULL値を返す（NULLの既定値設定）
SELECT name, COALESCE(phone, '未登録') AS 電話番号
FROM users;

-- CASE: 条件分岐で値を振り分ける
SELECT name,
  CASE
    WHEN age < 20 THEN '未成年'
    WHEN age < 65 THEN '成人'
    ELSE 'シニア'
  END AS 区分
FROM users;

-- 文字列・日付関数
SELECT
  UPPER(name)              AS 大文字,
  LENGTH(name)             AS 文字数,
  CONCAT(name, 'さん')     AS 敬称付き,
  CURRENT_DATE             AS 今日,
  EXTRACT(YEAR FROM NOW()) AS 今年
FROM users;
```
