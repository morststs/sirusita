// サンプル集の「Docker コマンド 1画面版」の内容。生成・確認は build.mjs から行う。
// コマンドは詳しい版の「Docker コマンド」（contents/Docker コマンド.md）に載っている形で書く。
import { danger, entry, flow, pair, titleBlock } from './lib.mjs';

// ヘッダー: Dockerfile からイメージを作り、コンテナとして動かして消すまでの流れ
const header = () => [
  ...titleBlock('Docker', 'コマンド チートシート',
    '< > の部分は実際の値に置き換える。赤は元に戻しにくい操作。詳しくは「Docker コマンド」', '#1d63ed'),
  ...flow({
    boxes: ['Dockerfile', 'イメージ', '実行中', '停止中', '削除済み'],
    forward: ['build', 'run', 'stop', 'rm'],
    back: [[3, 2, 0, 'start', '#16a34a'], [2, 4, 1, 'rm -f', '#c81e1e']],
    boxW: 74,
    gap: 50,
  }),
];

const sections = [
  { title: 'イメージ', color: '#1d63ed', items: [
    entry('レジストリから取得 / 手元の一覧', 'docker pull <イメージ>', 'docker images'),
    entry('今のディレクトリの Dockerfile からビルド', 'docker build -t <名前>:<タグ> .'),
    entry('キャッシュを使わずにビルドし直す', 'docker build --no-cache -t <名前> .'),
    entry('別名（タグ）を付ける', 'docker tag <元> <新名>'),
    entry('レジストリにログインして送る', 'docker login', 'docker push <名前>:<タグ>'),
    entry('レイヤーの構成（各命令）を見る', 'docker history <イメージ>'),
    entry('tar に保存 / tar から読み込む（オフラインで移す）',
      'docker save -o <ファイル>.tar <イメージ>', 'docker load -i <ファイル>.tar'),
    entry('イメージを削除', 'docker rmi <イメージ>'),
  ] },
  { title: 'コンテナの起動（run）', color: '#0d9488', items: [
    entry('バックグラウンドで起動', 'docker run -d <イメージ>'),
    entry('対話的にシェルを起動', 'docker run -it <イメージ> bash'),
    entry('名前を付ける', 'docker run --name <名前> <イメージ>'),
    entry('ホストの 8080 をコンテナの 80 へつなぐ', 'docker run -p 8080:80 <イメージ>'),
    entry('ディレクトリをマウント', 'docker run -v <ホスト>:<コンテナ> <イメージ>'),
    entry('環境変数を渡す', 'docker run -e KEY=値 <イメージ>'),
    entry('終了したら自動で削除', 'docker run --rm <イメージ>'),
    entry('落ちても自動で再起動（手動で止めるまで）', 'docker run --restart unless-stopped <イメージ>'),
  ] },
  { title: 'コンテナの管理', color: '#16a34a', items: [
    entry('稼働中の一覧（-a で停止中も）', 'docker ps', 'docker ps -a'),
    entry('停止 / 再開 / 再起動',
      'docker stop <コンテナ>', 'docker start <コンテナ>', 'docker restart <コンテナ>'),
    entry('名前を変える', 'docker rename <旧> <新>'),
    entry('CPU・メモリの使用量をリアルタイムで', 'docker stats'),
    entry('停止中のコンテナを削除', 'docker rm <コンテナ>'),
    danger('稼働中でも強制的に削除', 'docker rm -f <コンテナ>'),
  ] },
  { title: 'コンテナ内の操作・調査', color: '#7c3aed', items: [
    entry('稼働中のコンテナでシェルを起動', 'docker exec -it <コンテナ> bash'),
    entry('コンテナ内でコマンドを実行', 'docker exec <コンテナ> <コマンド>'),
    entry('ログを表示 / 追従（--tail 100 で末尾だけ）', 'docker logs <コンテナ>', 'docker logs -f <コンテナ>'),
    entry('設定を JSON で詳しく', 'docker inspect <コンテナ>'),
    entry('コンテナからホストへコピー（逆向きも可）', 'docker cp <コンテナ>:<パス> <ホスト>'),
    entry('コンテナ内のプロセス', 'docker top <コンテナ>'),
  ] },
  { title: 'ボリューム・ネットワーク', color: '#0284c7', items: [
    entry('ボリュームを作成 / 一覧', 'docker volume create <名前>', 'docker volume ls'),
    entry('保存先などの詳細', 'docker volume inspect <名前>'),
    danger('ボリュームを削除（中のデータも消える）', 'docker volume rm <名前>'),
    entry('ネットワークの一覧 / 作成', 'docker network ls', 'docker network create <名前>'),
    entry('コンテナをネットワークへ接続', 'docker network connect <NW> <コンテナ>'),
  ] },
  { title: 'Dockerfile の主要命令', color: '#d97706', keyW: 132, items: [
    pair('FROM <イメージ>', 'ベースイメージ（先頭）'),
    pair('WORKDIR <パス>', '以降の作業ディレクトリ'),
    pair('COPY <元> <先>', 'ホストのファイルをコピー'),
    pair('RUN <コマンド>', 'ビルド時に実行'),
    pair('ENV KEY=値', '環境変数'),
    pair('EXPOSE <ポート>', '使うポートを明示'),
    pair('CMD ["実行", "引数"]', '起動時の既定のコマンド'),
    pair('ENTRYPOINT ["実行"]', '必ず実行（CMD は引数に）'),
  ] },
  { title: 'Docker Compose', color: '#db2777', items: [
    entry('compose.yaml のサービスをまとめて起動（-d で裏で）', 'docker compose up -d'),
    entry('イメージをビルドし直してから起動', 'docker compose up --build'),
    entry('停止してコンテナ・ネットワークを削除', 'docker compose down'),
    danger('ボリュームも含めて削除', 'docker compose down -v'),
    entry('状態 / 全サービスのログを追従', 'docker compose ps', 'docker compose logs -f'),
    entry('サービスのコンテナでシェルを起動', 'docker compose exec <サービス> bash'),
  ] },
  { title: 'クリーンアップ', color: '#ea580c', items: [
    entry('Docker が使っているディスク容量', 'docker system df'),
    entry('停止中のコンテナ / 未使用のイメージをまとめて削除',
      'docker container prune', 'docker image prune'),
    entry('ビルドキャッシュを 5GiB 残して古いものから削除', 'docker builder prune --keep-storage 5GiB'),
    danger('停止コンテナ・未使用のネットワーク・イメージ・キャッシュを一括削除',
      'docker system prune'),
    danger('使っていないイメージもすべて削除', 'docker system prune -a'),
    danger('未使用のボリュームを削除（データも消える）', 'docker volume prune'),
  ] },
  { title: '使用例', color: '#475569', items: [
    entry('ビルドしてレジストリへ送る',
      'docker build -t myapp:1.0 .', 'docker tag myapp:1.0 username/myapp:1.0', 'docker push username/myapp:1.0'),
    entry('動いているコンテナに入る / ログを末尾から追う',
      'docker exec -it web bash', 'docker logs -f --tail 100 web'),
    entry('buildx のキャッシュの使用量 / 5GiB 残して削除',
      'docker buildx du', 'docker buildx prune --keep-storage 5GiB -f'),
    danger('未使用のものをボリュームも含めて一掃', 'docker system prune -a --volumes'),
  ] },
];

export default {
  name: 'Docker コマンド',
  tags: ['コマンド'],
  created: '2026-10-12T16:00:00+09:00',
  label: 'Docker コマンド チートシート',
  accent: '#1d63ed',
  header,
  sections,
  footer: ['Sirusita サンプル集 ・ A4 横（297×210mm）', 'docker <コマンド> --help で詳しい説明'],
};
