---
title: "C言語基本文法"
tags:
  - "プログラミング"
created: 2026-06-28T10:00:00+09:00
modified: 2026-06-28T10:00:00+09:00
sirusita: "1"
---

## C言語の基本文法

ハードウェアに近い低水準操作を可能とする、手続き型・静的型付け言語の基本構文。

---

### 1. 変数と型・書式指定子

整数・浮動小数点・文字といった基本型と、`printf` で用いる書式指定子の対応。

```c
#include <stdio.h>

int main(void) {
    int    age   = 25;       // 整数型
    double pi    = 3.14159;  // 倍精度浮動小数点型
    char   grade = 'A';      // 文字型（1バイト）

    // %d=整数, %f=浮動小数点, %c=文字, %s=文字列
    printf("年齢:%d 円周率:%.2f 評価:%c\n", age, pi, grade);
    return 0;
}
```

---

### 2. 条件分岐（if, switch）

真偽判定による分岐処理。`switch` では各 `case` に `break` が必須。

```c
int score = 75;

// if-else if-else による分岐
if (score >= 80) {
    printf("優\n");
} else if (score >= 60) {
    printf("良\n");
} else {
    printf("不可\n");
}

// switch文（breakがないと次のcaseに継続する点に注意）
char rank = 'B';
switch (rank) {
    case 'A': printf("最高\n"); break;
    case 'B': printf("普通\n"); break;
    default:  printf("不明\n"); break;
}
```

---

### 3. ループ処理（for, while）

繰り返し処理の基本構文。回数が決まる場合は `for`、条件継続には `while` を用いる。

```c
// forループ（0から4までの5回）
for (int i = 0; i < 5; i++) {
    printf("i=%d\n", i);
}

// whileループ（条件が真の間だけ反復）
int n = 3;
while (n > 0) {
    printf("カウント:%d\n", n);
    n--;
}
```

---

### 4. 関数

処理をまとめて再利用する仕組み。戻り値の型・引数の型を明示する必要がある。

```c
#include <stdio.h>

// 2つの整数の和を返す関数
int add(int a, int b) {
    return a + b;
}

// 戻り値を持たない関数（void）
void greet(const char *name) {
    printf("こんにちは、%sさん\n", name);
}

int main(void) {
    printf("合計:%d\n", add(3, 4));
    greet("田中");
    return 0;
}
```

---

### 5. ポインタとアドレス

変数のメモリ上の番地を扱う仕組み。`&` でアドレス取得、`*` で参照先の値にアクセスする。

```c
int x = 10;
int *p = &x;   // pはxのアドレスを保持

printf("値:%d\n", *p);      // 参照先の値を取得 → 10
*p = 20;                    // ポインタ経由で値を書き換え
printf("変更後:%d\n", x);   // → 20

// アドレスそのものの表示
printf("xのアドレス:%p\n", (void *)&x);
```

---

### 6. 配列と文字列

同じ型のデータを連続して格納する配列。C言語では文字列を `char` 配列（終端は `'\0'`）で表す。

```c
// 整数配列
int nums[3] = {10, 20, 30};
for (int i = 0; i < 3; i++) {
    printf("%d ", nums[i]);
}
printf("\n");

// 文字列（末尾にヌル文字'\0'が自動付与される）
char name[] = "Sirusita";
printf("文字列:%s 長さ:%lu\n", name, strlen(name));
```

---

### 7. 構造体（struct）

複数の異なる型のデータを1つにまとめる型定義。関連するデータの一括管理に有用。

```c
#include <stdio.h>

// 構造体の定義
struct Person {
    char name[20];
    int  age;
};

int main(void) {
    // 構造体変数の初期化
    struct Person p = {"佐藤", 30};

    // メンバへのアクセスはドット演算子
    printf("名前:%s 年齢:%d\n", p.name, p.age);
    return 0;
}
```

---

### 8. メモリ確保と標準入出力

`malloc`/`free` による動的メモリ管理と、`scanf` による入力受け取り。

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int size;
    printf("要素数を入力: ");
    scanf("%d", &size);              // 標準入力から整数を取得

    // 必要なサイズのメモリを動的に確保
    int *arr = malloc(sizeof(int) * size);
    if (arr == NULL) return 1;       // 確保失敗の確認

    for (int i = 0; i < size; i++) {
        arr[i] = i * i;
    }

    free(arr);                       // 確保したメモリを必ず解放
    return 0;
}
```
