---
title: "openssl コマンド"
tags:
  - "コマンド"
created: 2026-08-02T10:30:00+09:00
modified: 2026-08-02T10:30:00+09:00
sirusita: "1"
---

## openssl コマンド

暗号化・証明書関連のツールキット OpenSSL のチートシート。TLS証明書の確認・作成、鍵ペアの生成、ハッシュ・暗号化まで幅広く使う。

---

## 1. 証明書の確認

* **`openssl x509 -in <ファイル> -text -noout`**：証明書ファイル（PEM）の内容を人間可読な形式で表示
* **`openssl x509 -in <ファイル> -noout -dates`**：有効期限（開始/終了）のみ表示
* **`openssl x509 -in <ファイル> -noout -subject -issuer`**：主体者・発行者のみ表示
* **`openssl s_client -connect <ホスト>:443`**：TLS接続してサーバー証明書を取得・表示
* **`openssl s_client -connect <ホスト>:443 -servername <ホスト>`**：SNI付きで接続（複数証明書を持つサーバー向け）

```bash
# 稼働中サーバーの証明書の有効期限を確認
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null \
  | openssl x509 -noout -dates
```

---

## 2. 秘密鍵・自己署名証明書の生成

* **`openssl genrsa -out key.pem 2048`**：RSA秘密鍵を生成（2048ビット）
* **`openssl ecparam -genkey -name prime256v1 -out key.pem`**：楕円曲線（ECDSA）の秘密鍵を生成
* **`openssl req -new -key key.pem -out csr.pem`**：秘密鍵から証明書署名要求（CSR）を生成
* **`openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes`**：鍵生成から自己署名証明書の作成まで一括実行
* **`openssl req -in csr.pem -noout -text`**：CSRの内容を確認

```bash
# 開発用の自己署名証明書をワンライナーで作成（有効期限365日、パスフレーズなし）
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem \
  -days 365 -nodes -subj "/CN=localhost"
```

---

## 3. ハッシュ値の計算

* **`openssl dgst -sha256 <ファイル>`**：SHA-256ハッシュを計算
* **`openssl dgst -md5 <ファイル>`**：MD5ハッシュを計算（整合性チェック用途。セキュリティ用途には非推奨）
* **`openssl dgst -sha256 -hmac "<鍵>" <ファイル>`**：HMAC-SHA256を計算（署名検証などに使用）

```bash
# ダウンロードしたファイルの整合性をSHA-256で検証
openssl dgst -sha256 download.tar.gz
```

---

## 4. 対称暗号化・復号

* **`openssl enc -aes-256-cbc -salt -in <平文> -out <暗号文> -pass pass:<パスワード>`**：AES-256でファイルを暗号化
* **`openssl enc -aes-256-cbc -d -in <暗号文> -out <平文> -pass pass:<パスワード>`**：復号（`-d`）
* **`openssl rand -base64 32`**：暗号学的に安全な乱数を生成（鍵やパスワードの生成に便利）
* **`openssl rand -hex 16`**：16進数表記でランダムなバイト列を生成

```bash
# 機密ファイルを暗号化して保存し、必要な時だけ復号
openssl enc -aes-256-cbc -salt -in secrets.env -out secrets.env.enc -pass pass:"$SECRET_PASS"
openssl enc -aes-256-cbc -d -in secrets.env.enc -out secrets.env -pass pass:"$SECRET_PASS"
```

---

## 5. Base64 エンコード・デコード

* **`openssl base64 -in <ファイル>`**：Base64エンコード
* **`openssl base64 -d -in <ファイル>`**：Base64デコード（`-d`）
* **`echo -n "<文字列>" | openssl base64`**：文字列を直接エンコード

```bash
# 認証ヘッダー用にユーザー名:パスワードをBase64化
echo -n "user:password" | openssl base64
```

---

## 6. PKCS#12（.pfx / .p12）の変換

* **`openssl pkcs12 -export -out cert.pfx -inkey key.pem -in cert.pem`**：鍵＋証明書をPFX形式へまとめる（Windows署名等で使用）
* **`openssl pkcs12 -in cert.pfx -nocerts -out key.pem -nodes`**：PFXから秘密鍵を取り出す
* **`openssl pkcs12 -in cert.pfx -clcerts -nokeys -out cert.pem`**：PFXから証明書を取り出す

```bash
# 秘密鍵と証明書からPFXを作成（Windowsコード署名用など）
openssl pkcs12 -export -out cert.pfx -inkey key.pem -in cert.pem -password pass:"$PFX_PASS"
```
