---
title: "Docker コマンド 1画面版"
tags:
  - "コマンド"
created: 2026-10-12T16:00:00+09:00
modified: 2026-10-12T16:00:00+09:00
sirusita: "1"
---

A4 横（297×210mm）の比率で 1 枚にまとめた Docker のチートシートです。プレビューの幅に合わせて全体が拡大・縮小されます。各コマンドの詳しい説明は「Docker コマンド」を見てください。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1123 794" width="100%" role="img" aria-label="Docker コマンド チートシート">
<rect x="0" y="0" width="1123" height="794" rx="6" fill="#ffffff"/>
<rect x="0" y="0" width="1123" height="5" fill="#1d63ed"/>
<line x1="16" y1="102" x2="1107" y2="102" stroke="#e4e7eb" stroke-width="1"/>
<text x="16.0" y="46.0" font-size="30" fill="#1d63ed" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="800">Docker</text>
<text x="139.0" y="46.0" font-size="22" fill="#1f2933" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">コマンド チートシート</text>
<text x="16.0" y="68.0" font-size="10.2" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">&lt; &gt; の部分は実際の値に置き換える。赤は元に戻しにくい操作。詳しくは「Docker コマンド」</text>
<rect x="537" y="30" width="74" height="26" rx="5" fill="#ffffff" stroke="#cbd2d9" stroke-width="1.2"/>
<text x="574.0" y="47.0" font-size="11" fill="#1f2933" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="600" text-anchor="middle">Dockerfile</text>
<rect x="661" y="30" width="74" height="26" rx="5" fill="#ffffff" stroke="#cbd2d9" stroke-width="1.2"/>
<text x="698.0" y="47.0" font-size="11" fill="#1f2933" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="600" text-anchor="middle">イメージ</text>
<rect x="785" y="30" width="74" height="26" rx="5" fill="#ffffff" stroke="#cbd2d9" stroke-width="1.2"/>
<text x="822.0" y="47.0" font-size="11" fill="#1f2933" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="600" text-anchor="middle">実行中</text>
<rect x="909" y="30" width="74" height="26" rx="5" fill="#ffffff" stroke="#cbd2d9" stroke-width="1.2"/>
<text x="946.0" y="47.0" font-size="11" fill="#1f2933" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="600" text-anchor="middle">停止中</text>
<rect x="1033" y="30" width="74" height="26" rx="5" fill="#ffffff" stroke="#cbd2d9" stroke-width="1.2"/>
<text x="1070.0" y="47.0" font-size="11" fill="#1f2933" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="600" text-anchor="middle">削除済み</text>
<path d="M615 39 L652 39" stroke="#16a34a" stroke-width="1.6"/>
<path d="M652 35.5 l6 3.5 l-6 3.5 z" fill="#16a34a"/>
<text x="636.0" y="34.0" font-size="9.5" fill="#16a34a" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" text-anchor="middle">build</text>
<path d="M739 39 L776 39" stroke="#16a34a" stroke-width="1.6"/>
<path d="M776 35.5 l6 3.5 l-6 3.5 z" fill="#16a34a"/>
<text x="760.0" y="34.0" font-size="9.5" fill="#16a34a" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" text-anchor="middle">run</text>
<path d="M863 39 L900 39" stroke="#16a34a" stroke-width="1.6"/>
<path d="M900 35.5 l6 3.5 l-6 3.5 z" fill="#16a34a"/>
<text x="884.0" y="34.0" font-size="9.5" fill="#16a34a" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" text-anchor="middle">stop</text>
<path d="M987 39 L1024 39" stroke="#16a34a" stroke-width="1.6"/>
<path d="M1024 35.5 l6 3.5 l-6 3.5 z" fill="#16a34a"/>
<text x="1008.0" y="34.0" font-size="9.5" fill="#16a34a" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" text-anchor="middle">rm</text>
<path d="M938 56 L938 64 L830 64 L830 61" fill="none" stroke="#16a34a" stroke-width="1.3"/>
<path d="M826.5 62 l3.5 -6 l3.5 6 z" fill="#16a34a"/>
<text x="884.0" y="74.0" font-size="9" fill="#16a34a" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" text-anchor="middle">start</text>
<path d="M822 56 L822 84 L1062 84 L1062 61" fill="none" stroke="#c81e1e" stroke-width="1.3"/>
<path d="M1058.5 62 l3.5 -6 l3.5 6 z" fill="#c81e1e"/>
<text x="942.0" y="94.0" font-size="9" fill="#c81e1e" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" text-anchor="middle">rm -f</text>
<line x1="837.3" y1="112" x2="837.3" y2="762" stroke="#e4e7eb" stroke-width="1"/>
<line x1="561.5" y1="112" x2="561.5" y2="762" stroke="#e4e7eb" stroke-width="1"/>
<line x1="285.8" y1="112" x2="285.8" y2="762" stroke="#e4e7eb" stroke-width="1"/>
<rect x="16.0" y="112.0" width="263.8" height="18.3" rx="4" fill="#1d63ed"/>
<text x="23.0" y="125.4" font-size="12.19" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">イメージ</text>
<text x="22.0" y="144.4" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">レジストリから取得 / 手元の一覧</text>
<rect x="19.0" y="148.2" width="257.8" height="30.4" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="148.2" width="2.5" height="30.4" fill="#1d63ed"/>
<text x="25.0" y="159.8" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker pull &lt;イメージ&gt;</text>
<text x="25.0" y="174.0" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker images</text>
<text x="22.0" y="193.0" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">今のディレクトリの Dockerfile からビルド</text>
<rect x="19.0" y="196.8" width="257.8" height="16.2" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="196.8" width="2.5" height="16.2" fill="#1d63ed"/>
<text x="25.0" y="208.4" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker build -t &lt;名前&gt;:&lt;タグ&gt; .</text>
<text x="22.0" y="227.4" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">キャッシュを使わずにビルドし直す</text>
<rect x="19.0" y="231.1" width="257.8" height="16.2" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="231.1" width="2.5" height="16.2" fill="#1d63ed"/>
<text x="25.0" y="242.7" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker build --no-cache -t &lt;名前&gt; .</text>
<text x="22.0" y="261.8" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">別名（タグ）を付ける</text>
<rect x="19.0" y="265.5" width="257.8" height="16.2" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="265.5" width="2.5" height="16.2" fill="#1d63ed"/>
<text x="25.0" y="277.1" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker tag &lt;元&gt; &lt;新名&gt;</text>
<text x="22.0" y="296.1" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">レジストリにログインして送る</text>
<rect x="19.0" y="299.9" width="257.8" height="30.4" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="299.9" width="2.5" height="30.4" fill="#1d63ed"/>
<text x="25.0" y="311.5" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker login</text>
<text x="25.0" y="325.7" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker push &lt;名前&gt;:&lt;タグ&gt;</text>
<text x="22.0" y="344.7" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">レイヤーの構成（各命令）を見る</text>
<rect x="19.0" y="348.4" width="257.8" height="16.2" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="348.4" width="2.5" height="16.2" fill="#1d63ed"/>
<text x="25.0" y="360.0" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker history &lt;イメージ&gt;</text>
<text x="22.0" y="379.1" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">tar に保存 / tar から読み込む（オフラインで移</text>
<text x="22.0" y="392.0" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">す）</text>
<rect x="19.0" y="395.7" width="257.8" height="44.6" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="395.7" width="2.5" height="44.6" fill="#1d63ed"/>
<text x="25.0" y="407.3" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker save -o &lt;ファイル&gt;.tar</text>
<text x="25.0" y="421.5" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">  &lt;イメージ&gt;</text>
<text x="25.0" y="435.7" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker load -i &lt;ファイル&gt;.tar</text>
<text x="22.0" y="454.8" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">イメージを削除</text>
<rect x="19.0" y="458.5" width="257.8" height="16.2" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="458.5" width="2.5" height="16.2" fill="#1d63ed"/>
<text x="25.0" y="470.1" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker rmi &lt;イメージ&gt;</text>
<rect x="16.0" y="487.4" width="263.8" height="18.3" rx="4" fill="#0d9488"/>
<text x="23.0" y="500.8" font-size="12.19" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">コンテナの起動（run）</text>
<text x="22.0" y="519.9" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">バックグラウンドで起動</text>
<rect x="19.0" y="523.6" width="257.8" height="16.2" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="523.6" width="2.5" height="16.2" fill="#0d9488"/>
<text x="25.0" y="535.2" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker run -d &lt;イメージ&gt;</text>
<text x="22.0" y="554.2" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">対話的にシェルを起動</text>
<rect x="19.0" y="558.0" width="257.8" height="16.2" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="558.0" width="2.5" height="16.2" fill="#0d9488"/>
<text x="25.0" y="569.6" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker run -it &lt;イメージ&gt; bash</text>
<text x="22.0" y="588.6" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">名前を付ける</text>
<rect x="19.0" y="592.4" width="257.8" height="16.2" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="592.4" width="2.5" height="16.2" fill="#0d9488"/>
<text x="25.0" y="604.0" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker run --name &lt;名前&gt; &lt;イメージ&gt;</text>
<text x="22.0" y="623.0" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ホストの 8080 をコンテナの 80 へつなぐ</text>
<rect x="19.0" y="626.7" width="257.8" height="16.2" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="626.7" width="2.5" height="16.2" fill="#0d9488"/>
<text x="25.0" y="638.3" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker run -p 8080:80 &lt;イメージ&gt;</text>
<text x="22.0" y="657.3" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ディレクトリをマウント</text>
<rect x="19.0" y="661.1" width="257.8" height="30.4" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="661.1" width="2.5" height="30.4" fill="#0d9488"/>
<text x="25.0" y="672.7" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker run -v &lt;ホスト&gt;:&lt;コンテナ&gt;</text>
<text x="25.0" y="686.9" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">  &lt;イメージ&gt;</text>
<text x="22.0" y="705.9" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">環境変数を渡す</text>
<rect x="19.0" y="709.7" width="257.8" height="16.2" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="709.7" width="2.5" height="16.2" fill="#0d9488"/>
<text x="25.0" y="721.3" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker run -e KEY=値 &lt;イメージ&gt;</text>
<text x="297.8" y="122.2" font-size="10.18" fill="#0d9488" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">コンテナの起動（run）（続き）</text>
<text x="297.8" y="137.1" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">終了したら自動で削除</text>
<rect x="294.8" y="140.9" width="257.8" height="16.2" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="140.9" width="2.5" height="16.2" fill="#0d9488"/>
<text x="300.8" y="152.5" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker run --rm &lt;イメージ&gt;</text>
<text x="297.8" y="171.5" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">落ちても自動で再起動（手動で止めるまで）</text>
<rect x="294.8" y="175.2" width="257.8" height="30.4" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="175.2" width="2.5" height="30.4" fill="#0d9488"/>
<text x="300.8" y="186.8" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker run --restart unless-stopped</text>
<text x="300.8" y="201.0" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">  &lt;イメージ&gt;</text>
<rect x="291.8" y="218.3" width="263.8" height="18.3" rx="4" fill="#16a34a"/>
<text x="298.8" y="231.7" font-size="12.19" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">コンテナの管理</text>
<text x="297.8" y="250.8" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">稼働中の一覧（-a で停止中も）</text>
<rect x="294.8" y="254.5" width="257.8" height="30.4" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="254.5" width="2.5" height="30.4" fill="#16a34a"/>
<text x="300.8" y="266.1" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker ps</text>
<text x="300.8" y="280.3" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker ps -a</text>
<text x="297.8" y="299.4" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">停止 / 再開 / 再起動</text>
<rect x="294.8" y="303.1" width="257.8" height="44.6" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="303.1" width="2.5" height="44.6" fill="#16a34a"/>
<text x="300.8" y="314.7" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker stop &lt;コンテナ&gt;</text>
<text x="300.8" y="328.9" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker start &lt;コンテナ&gt;</text>
<text x="300.8" y="343.1" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker restart &lt;コンテナ&gt;</text>
<text x="297.8" y="362.1" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">名前を変える</text>
<rect x="294.8" y="365.9" width="257.8" height="16.2" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="365.9" width="2.5" height="16.2" fill="#16a34a"/>
<text x="300.8" y="377.5" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker rename &lt;旧&gt; &lt;新&gt;</text>
<text x="297.8" y="396.5" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">CPU・メモリの使用量をリアルタイムで</text>
<rect x="294.8" y="400.3" width="257.8" height="16.2" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="400.3" width="2.5" height="16.2" fill="#16a34a"/>
<text x="300.8" y="411.9" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker stats</text>
<text x="297.8" y="430.9" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">停止中のコンテナを削除</text>
<rect x="294.8" y="434.6" width="257.8" height="16.2" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="434.6" width="2.5" height="16.2" fill="#16a34a"/>
<text x="300.8" y="446.2" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker rm &lt;コンテナ&gt;</text>
<text x="297.8" y="465.2" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">稼働中でも強制的に削除</text>
<rect x="294.8" y="469.0" width="257.8" height="16.2" rx="3" fill="#fdecec"/>
<rect x="294.8" y="469.0" width="2.5" height="16.2" fill="#c81e1e"/>
<text x="300.8" y="480.6" font-size="10.6" fill="#c81e1e" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker rm -f &lt;コンテナ&gt;</text>
<rect x="291.8" y="497.9" width="263.8" height="18.3" rx="4" fill="#7c3aed"/>
<text x="298.8" y="511.3" font-size="12.19" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">コンテナ内の操作・調査</text>
<text x="297.8" y="530.4" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">稼働中のコンテナでシェルを起動</text>
<rect x="294.8" y="534.1" width="257.8" height="16.2" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="534.1" width="2.5" height="16.2" fill="#7c3aed"/>
<text x="300.8" y="545.7" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker exec -it &lt;コンテナ&gt; bash</text>
<text x="297.8" y="564.7" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">コンテナ内でコマンドを実行</text>
<rect x="294.8" y="568.5" width="257.8" height="16.2" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="568.5" width="2.5" height="16.2" fill="#7c3aed"/>
<text x="300.8" y="580.1" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker exec &lt;コンテナ&gt; &lt;コマンド&gt;</text>
<text x="297.8" y="599.1" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ログを表示 / 追従（--tail 100 で末尾だけ）</text>
<rect x="294.8" y="602.8" width="257.8" height="30.4" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="602.8" width="2.5" height="30.4" fill="#7c3aed"/>
<text x="300.8" y="614.4" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker logs &lt;コンテナ&gt;</text>
<text x="300.8" y="628.6" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker logs -f &lt;コンテナ&gt;</text>
<text x="297.8" y="647.7" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">設定を JSON で詳しく</text>
<rect x="294.8" y="651.4" width="257.8" height="16.2" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="651.4" width="2.5" height="16.2" fill="#7c3aed"/>
<text x="300.8" y="663.0" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker inspect &lt;コンテナ&gt;</text>
<text x="297.8" y="682.0" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">コンテナからホストへコピー（逆向きも可）</text>
<rect x="294.8" y="685.8" width="257.8" height="16.2" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="685.8" width="2.5" height="16.2" fill="#7c3aed"/>
<text x="300.8" y="697.4" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker cp &lt;コンテナ&gt;:&lt;パス&gt; &lt;ホスト&gt;</text>
<text x="297.8" y="716.4" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">コンテナ内のプロセス</text>
<rect x="294.8" y="720.2" width="257.8" height="16.2" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="720.2" width="2.5" height="16.2" fill="#7c3aed"/>
<text x="300.8" y="731.8" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker top &lt;コンテナ&gt;</text>
<rect x="567.5" y="112.0" width="263.8" height="18.3" rx="4" fill="#0284c7"/>
<text x="574.5" y="125.4" font-size="12.19" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">ボリューム・ネットワーク</text>
<text x="573.5" y="144.4" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ボリュームを作成 / 一覧</text>
<rect x="570.5" y="148.2" width="257.8" height="30.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="148.2" width="2.5" height="30.4" fill="#0284c7"/>
<text x="576.5" y="159.8" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker volume create &lt;名前&gt;</text>
<text x="576.5" y="174.0" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker volume ls</text>
<text x="573.5" y="193.0" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">保存先などの詳細</text>
<rect x="570.5" y="196.8" width="257.8" height="16.2" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="196.8" width="2.5" height="16.2" fill="#0284c7"/>
<text x="576.5" y="208.4" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker volume inspect &lt;名前&gt;</text>
<text x="573.5" y="227.4" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ボリュームを削除（中のデータも消える）</text>
<rect x="570.5" y="231.1" width="257.8" height="16.2" rx="3" fill="#fdecec"/>
<rect x="570.5" y="231.1" width="2.5" height="16.2" fill="#c81e1e"/>
<text x="576.5" y="242.7" font-size="10.6" fill="#c81e1e" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker volume rm &lt;名前&gt;</text>
<text x="573.5" y="261.8" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ネットワークの一覧 / 作成</text>
<rect x="570.5" y="265.5" width="257.8" height="30.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="265.5" width="2.5" height="30.4" fill="#0284c7"/>
<text x="576.5" y="277.1" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker network ls</text>
<text x="576.5" y="291.3" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker network create &lt;名前&gt;</text>
<text x="573.5" y="310.3" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">コンテナをネットワークへ接続</text>
<rect x="570.5" y="314.1" width="257.8" height="30.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="314.1" width="2.5" height="30.4" fill="#0284c7"/>
<text x="576.5" y="325.7" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker network connect &lt;NW&gt;</text>
<text x="576.5" y="339.9" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">  &lt;コンテナ&gt;</text>
<rect x="567.5" y="357.2" width="263.8" height="18.3" rx="4" fill="#d97706"/>
<text x="574.5" y="370.5" font-size="12.19" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">Dockerfile の主要命令</text>
<rect x="570.5" y="379.4" width="132.0" height="16.2" rx="2" fill="#f2f4f8"/>
<text x="573.5" y="391.1" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">FROM &lt;イメージ&gt;</text>
<text x="707.5" y="391.1" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ベースイメージ（先頭）</text>
<rect x="570.5" y="397.6" width="132.0" height="16.2" rx="2" fill="#f2f4f8"/>
<text x="573.5" y="409.3" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">WORKDIR &lt;パス&gt;</text>
<text x="707.5" y="409.3" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">以降の作業ディレクトリ</text>
<rect x="570.5" y="415.8" width="132.0" height="29.1" rx="2" fill="#f2f4f8"/>
<text x="573.5" y="427.4" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">COPY &lt;元&gt; &lt;先&gt;</text>
<text x="707.5" y="427.4" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ホストのファイルをコピ</text>
<text x="707.5" y="440.4" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ー</text>
<rect x="570.5" y="446.9" width="132.0" height="16.2" rx="2" fill="#f2f4f8"/>
<text x="573.5" y="458.5" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">RUN &lt;コマンド&gt;</text>
<text x="707.5" y="458.5" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ビルド時に実行</text>
<rect x="570.5" y="465.1" width="132.0" height="16.2" rx="2" fill="#f2f4f8"/>
<text x="573.5" y="476.7" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">ENV KEY=値</text>
<text x="707.5" y="476.7" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">環境変数</text>
<rect x="570.5" y="483.3" width="132.0" height="16.2" rx="2" fill="#f2f4f8"/>
<text x="573.5" y="494.9" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">EXPOSE &lt;ポート&gt;</text>
<text x="707.5" y="494.9" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">使うポートを明示</text>
<rect x="570.5" y="501.5" width="132.0" height="16.2" rx="2" fill="#f2f4f8"/>
<text x="573.5" y="513.1" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">CMD [&quot;実行&quot;, &quot;引数&quot;]</text>
<text x="707.5" y="513.1" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">起動時の既定のコマンド</text>
<rect x="570.5" y="519.7" width="132.0" height="29.1" rx="2" fill="#f2f4f8"/>
<text x="573.5" y="531.3" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">ENTRYPOINT [&quot;実行&quot;]</text>
<text x="707.5" y="531.3" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">必ず実行（CMD は引数</text>
<text x="707.5" y="544.2" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">に）</text>
<rect x="567.5" y="559.2" width="263.8" height="18.3" rx="4" fill="#db2777"/>
<text x="574.5" y="572.6" font-size="12.19" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">Docker Compose</text>
<text x="573.5" y="591.7" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">compose.yaml のサービスをまとめて起動（-d で裏</text>
<text x="573.5" y="604.6" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">で）</text>
<rect x="570.5" y="608.4" width="257.8" height="16.2" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="608.4" width="2.5" height="16.2" fill="#db2777"/>
<text x="576.5" y="620.0" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker compose up -d</text>
<text x="573.5" y="639.0" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">イメージをビルドし直してから起動</text>
<rect x="570.5" y="642.7" width="257.8" height="16.2" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="642.7" width="2.5" height="16.2" fill="#db2777"/>
<text x="576.5" y="654.3" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker compose up --build</text>
<text x="573.5" y="673.4" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">停止してコンテナ・ネットワークを削除</text>
<rect x="570.5" y="677.1" width="257.8" height="16.2" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="677.1" width="2.5" height="16.2" fill="#db2777"/>
<text x="576.5" y="688.7" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker compose down</text>
<text x="573.5" y="707.7" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ボリュームも含めて削除</text>
<rect x="570.5" y="711.5" width="257.8" height="16.2" rx="3" fill="#fdecec"/>
<rect x="570.5" y="711.5" width="2.5" height="16.2" fill="#c81e1e"/>
<text x="576.5" y="723.1" font-size="10.6" fill="#c81e1e" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker compose down -v</text>
<text x="849.3" y="122.2" font-size="10.18" fill="#db2777" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">Docker Compose（続き）</text>
<text x="849.3" y="137.1" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">状態 / 全サービスのログを追従</text>
<rect x="846.3" y="140.9" width="257.8" height="30.4" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="140.9" width="2.5" height="30.4" fill="#db2777"/>
<text x="852.3" y="152.5" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker compose ps</text>
<text x="852.3" y="166.7" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker compose logs -f</text>
<text x="849.3" y="185.7" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">サービスのコンテナでシェルを起動</text>
<rect x="846.3" y="189.4" width="257.8" height="16.2" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="189.4" width="2.5" height="16.2" fill="#db2777"/>
<text x="852.3" y="201.0" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker compose exec &lt;サービス&gt; bash</text>
<rect x="843.3" y="218.3" width="263.8" height="18.3" rx="4" fill="#ea580c"/>
<text x="850.3" y="231.7" font-size="12.19" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">クリーンアップ</text>
<text x="849.3" y="250.8" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">Docker が使っているディスク容量</text>
<rect x="846.3" y="254.5" width="257.8" height="16.2" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="254.5" width="2.5" height="16.2" fill="#ea580c"/>
<text x="852.3" y="266.1" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker system df</text>
<text x="849.3" y="285.2" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">停止中のコンテナ / 未使用のイメージをまとめて削除</text>
<rect x="846.3" y="288.9" width="257.8" height="30.4" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="288.9" width="2.5" height="30.4" fill="#ea580c"/>
<text x="852.3" y="300.5" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker container prune</text>
<text x="852.3" y="314.7" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker image prune</text>
<text x="849.3" y="333.7" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ビルドキャッシュを 5GiB 残して古いものから削除</text>
<rect x="846.3" y="337.5" width="257.8" height="30.4" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="337.5" width="2.5" height="30.4" fill="#ea580c"/>
<text x="852.3" y="349.1" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker builder prune --keep-storage</text>
<text x="852.3" y="363.3" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">  5GiB</text>
<text x="849.3" y="382.3" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">停止コンテナ・未使用のネットワーク・イメージ・キ</text>
<text x="849.3" y="395.2" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ャッシュを一括削除</text>
<rect x="846.3" y="399.0" width="257.8" height="16.2" rx="3" fill="#fdecec"/>
<rect x="846.3" y="399.0" width="2.5" height="16.2" fill="#c81e1e"/>
<text x="852.3" y="410.6" font-size="10.6" fill="#c81e1e" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker system prune</text>
<text x="849.3" y="429.6" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">使っていないイメージもすべて削除</text>
<rect x="846.3" y="433.3" width="257.8" height="16.2" rx="3" fill="#fdecec"/>
<rect x="846.3" y="433.3" width="2.5" height="16.2" fill="#c81e1e"/>
<text x="852.3" y="444.9" font-size="10.6" fill="#c81e1e" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker system prune -a</text>
<text x="849.3" y="464.0" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">未使用のボリュームを削除（データも消える）</text>
<rect x="846.3" y="467.7" width="257.8" height="16.2" rx="3" fill="#fdecec"/>
<rect x="846.3" y="467.7" width="2.5" height="16.2" fill="#c81e1e"/>
<text x="852.3" y="479.3" font-size="10.6" fill="#c81e1e" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker volume prune</text>
<rect x="843.3" y="496.6" width="263.8" height="18.3" rx="4" fill="#475569"/>
<text x="850.3" y="510.0" font-size="12.19" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">使用例</text>
<text x="849.3" y="529.1" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ビルドしてレジストリへ送る</text>
<rect x="846.3" y="532.8" width="257.8" height="58.8" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="532.8" width="2.5" height="58.8" fill="#475569"/>
<text x="852.3" y="544.4" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker build -t myapp:1.0 .</text>
<text x="852.3" y="558.6" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker tag myapp:1.0</text>
<text x="852.3" y="572.8" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">  username/myapp:1.0</text>
<text x="852.3" y="587.0" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker push username/myapp:1.0</text>
<text x="849.3" y="606.0" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">動いているコンテナに入る / ログを末尾から追う</text>
<rect x="846.3" y="609.8" width="257.8" height="30.4" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="609.8" width="2.5" height="30.4" fill="#475569"/>
<text x="852.3" y="621.4" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker exec -it web bash</text>
<text x="852.3" y="635.6" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker logs -f --tail 100 web</text>
<text x="849.3" y="654.6" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">buildx のキャッシュの使用量 / 5GiB 残して削除</text>
<rect x="846.3" y="658.4" width="257.8" height="44.6" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="658.4" width="2.5" height="44.6" fill="#475569"/>
<text x="852.3" y="670.0" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker buildx du</text>
<text x="852.3" y="684.2" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker buildx prune --keep-storage</text>
<text x="852.3" y="698.4" font-size="10.6" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">  5GiB -f</text>
<text x="849.3" y="717.4" font-size="10.18" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">未使用のものをボリュームも含めて一掃</text>
<rect x="846.3" y="721.1" width="257.8" height="16.2" rx="3" fill="#fdecec"/>
<rect x="846.3" y="721.1" width="2.5" height="16.2" fill="#c81e1e"/>
<text x="852.3" y="732.7" font-size="10.6" fill="#c81e1e" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ docker system prune -a --volumes</text>
<text x="16.0" y="780.0" font-size="8.5" fill="#9aa5b1" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">Sirusita サンプル集 ・ A4 横（297×210mm）</text>
<text x="1107.0" y="780.0" font-size="8.5" fill="#9aa5b1" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" text-anchor="end">docker &lt;コマンド&gt; --help で詳しい説明</text>
</svg>

## この画面の作り方

全体が 1 つの SVG（`viewBox="0 0 1123 794"` = A4 横を 96dpi で表した大きさ）です。座標を固定して描いているので、ウィンドウの幅が変わってもレイアウトは崩れず、拡大・縮小されるだけです。

- `<svg>` から `</svg>` までの間に**空行を入れない**でください。空行があると、そこでマークダウンの HTML として扱われなくなります。
- SVG の文字は自動で折り返されません。行を増やすときは `<text>` の `y` を 1 行分ずらして追加します。
- 図や文字の位置は `x` / `y`（左上が 0、右が x、下が y）で決まります。
- このメモは Sirusita のリポジトリの `scripts/cheatsheet/` で生成しています。
