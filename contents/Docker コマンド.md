---
title: "Docker コマンド"
tags:
  - "コマンド"
created: 2026-06-28T10:00:00+09:00
modified: 2026-06-28T10:00:00+09:00
sirusita: "1"
---

## Docker コマンド

コンテナ仮想化ツール Docker の主要コマンドをまとめたチートシート。イメージ操作、コンテナのライフサイクル、ボリューム・ネットワーク、Dockerfile、Compose、クリーンアップまでを網羅。

---

## 1. イメージ操作

* **`docker pull <イメージ>`**：レジストリ（Docker Hub 等）からイメージを取得
* **`docker images`**：ローカルに保存されたイメージの一覧を表示
* **`docker build -t <名前>:<タグ> .`**：カレントの Dockerfile からイメージをビルド
* **`docker build --no-cache -t <名前> .`**：キャッシュを使わずに再ビルド
* **`docker tag <元> <新名>`**：イメージに別名（タグ）を付与
* **`docker rmi <イメージ>`**：ローカルイメージを削除
* **`docker history <イメージ>`**：イメージのレイヤー構成（各命令）を表示
* **`docker save / docker load`**：イメージを tar に保存・復元（オフライン移送）

```bash
# Dockerfile からビルドして Docker Hub へ push
docker build -t myapp:1.0 .
docker tag myapp:1.0 username/myapp:1.0
docker push username/myapp:1.0
```

---

## 2. コンテナの起動（run）

* **`docker run <イメージ>`**：イメージからコンテナを生成して実行
* **`docker run -d <イメージ>`**：バックグラウンド（デタッチ）で実行
* **`docker run -it <イメージ> bash`**：対話的（`-i -t`）にシェルを起動
* **`docker run --name <名前> <イメージ>`**：コンテナに名前を付ける
* **`docker run -p 8080:80 <イメージ>`**：ホスト 8080 をコンテナ 80 へポートフォワード
* **`docker run -v <ホスト>:<コンテナ> <イメージ>`**：ディレクトリをマウント
* **`docker run -e KEY=値 <イメージ>`**：環境変数を渡す
* **`docker run --rm <イメージ>`**：終了時にコンテナを自動削除

```bash
# nginx を 8080 で公開し、ホストの html をマウントして起動
docker run -d --name web -p 8080:80 \
  -v "$PWD/html":/usr/share/nginx/html:ro \
  nginx:latest
```

---

## 3. コンテナの管理

* **`docker ps`**：稼働中のコンテナ一覧を表示
* **`docker ps -a`**：停止中も含めた全コンテナを表示
* **`docker stop <コンテナ>`**：コンテナを正常停止（SIGTERM）
* **`docker start <コンテナ>`**：停止中のコンテナを再開
* **`docker restart <コンテナ>`**：コンテナを再起動
* **`docker rm <コンテナ>`**：停止中のコンテナを削除（`-f` で稼働中も強制削除）
* **`docker rename <旧> <新>`**：コンテナ名を変更
* **`docker stats`**：コンテナごとの CPU・メモリ使用量をリアルタイム表示

---

## 4. コンテナ内の操作・調査

* **`docker exec -it <コンテナ> bash`**：稼働中コンテナ内でシェルを起動
* **`docker exec <コンテナ> <コマンド>`**：コンテナ内で任意のコマンドを実行
* **`docker logs <コンテナ>`**：標準出力／エラーのログを表示
* **`docker logs -f <コンテナ>`**：ログをリアルタイムに追従（`--tail 100` で末尾指定）
* **`docker inspect <コンテナ>`**：設定情報を JSON で詳細表示
* **`docker cp <コンテナ>:<パス> <ホスト>`**：コンテナ⇔ホスト間でファイルをコピー
* **`docker top <コンテナ>`**：コンテナ内で実行中のプロセスを表示

```bash
# 稼働中コンテナに入って調査し、ログを末尾から追従
docker exec -it web bash
docker logs -f --tail 100 web
```

---

## 5. ボリューム・ネットワーク

* **`docker volume create <名前>`**：名前付きボリュームを作成
* **`docker volume ls`**：ボリュームの一覧を表示
* **`docker volume rm <名前>`**：ボリュームを削除
* **`docker volume inspect <名前>`**：ボリュームの保存先など詳細を表示
* **`docker network ls`**：ネットワークの一覧を表示
* **`docker network create <名前>`**：ユーザー定義ネットワークを作成
* **`docker network connect <NW> <コンテナ>`**：コンテナをネットワークへ接続

```bash
# 名前付きボリュームでデータを永続化して DB を起動
docker volume create pgdata
docker run -d --name db \
  -v pgdata:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=secret \
  postgres:16
```

---

## 6. Dockerfile の主要命令

* **`FROM <イメージ>`**：ベースイメージの指定（最初に記述）
* **`WORKDIR <パス>`**：以降の作業ディレクトリを設定
* **`COPY <元> <先>`**：ホストのファイルをイメージへコピー
* **`RUN <コマンド>`**：ビルド時にコマンドを実行しレイヤーを作成
* **`ENV KEY=値`**：環境変数を設定
* **`EXPOSE <ポート>`**：コンテナが使用するポートを明示（ドキュメント的役割）
* **`CMD ["実行", "引数"]`**：コンテナ起動時のデフォルトコマンド
* **`ENTRYPOINT ["実行"]`**：起動時に必ず実行するコマンド（`CMD` は引数になる）

```dockerfile
FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 7. Docker Compose の基本

* **`docker compose up`**：`compose.yaml` 定義のサービスを一括起動
* **`docker compose up -d`**：バックグラウンドで起動
* **`docker compose up --build`**：イメージを再ビルドしてから起動
* **`docker compose down`**：サービスを停止しコンテナ・ネットワークを削除
* **`docker compose down -v`**：ボリュームも含めて削除
* **`docker compose ps`**：Compose 管理下のコンテナ状態を表示
* **`docker compose logs -f`**：全サービスのログを追従表示
* **`docker compose exec <サービス> bash`**：指定サービスのコンテナでシェル起動

```yaml
# compose.yaml の例
services:
  web:
    build: .
    ports:
      - "8080:80"
    depends_on:
      - db
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

---

## 8. クリーンアップ（prune）

* **`docker system prune`**：停止コンテナ・未使用ネットワーク・ダングリングイメージを一括削除
* **`docker system prune -a`**：未使用イメージも含めて徹底的に削除
* **`docker image prune`**：未使用（ダングリング）イメージを削除
* **`docker container prune`**：停止中のコンテナをまとめて削除
* **`docker volume prune`**：未使用ボリュームを削除
* **`docker system df`**：Docker が使用しているディスク容量を確認

```bash
# 使用容量を確認してから不要リソースを一掃
docker system df
docker system prune -a --volumes
```
