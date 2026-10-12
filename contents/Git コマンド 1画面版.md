---
title: "Git コマンド 1画面版"
tags:
  - "コマンド"
created: 2026-10-12T13:00:00+09:00
modified: 2026-10-12T13:00:00+09:00
sirusita: "1"
---

A4 横（297×210mm）の比率で 1 枚にまとめた Git のチートシートです。プレビューの幅に合わせて全体が拡大・縮小されます。各コマンドの詳しい説明は「Git コマンド」を見てください。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1123 794" width="100%" role="img" aria-label="Git コマンド チートシート">
<rect x="0" y="0" width="1123" height="794" rx="6" fill="#ffffff"/>
<rect x="0" y="0" width="1123" height="5" fill="#f05133"/>
<line x1="16" y1="102" x2="1107" y2="102" stroke="#e4e7eb" stroke-width="1"/>
<text x="16.0" y="46.0" font-size="30" fill="#f05133" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="800">Git</text>
<text x="78.0" y="46.0" font-size="22" fill="#1f2933" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">コマンド チートシート</text>
<text x="16.0" y="68.0" font-size="10.2" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">&lt; &gt; の部分は実際の値に置き換える。赤は元に戻しにくい操作。詳しくは「Git コマンド」</text>
<rect x="553" y="30" width="86" height="26" rx="5" fill="#ffffff" stroke="#cbd2d9" stroke-width="1.2"/>
<text x="596.0" y="47.0" font-size="11" fill="#1f2933" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="600" text-anchor="middle">作業ツリー</text>
<rect x="709" y="30" width="86" height="26" rx="5" fill="#ffffff" stroke="#cbd2d9" stroke-width="1.2"/>
<text x="752.0" y="47.0" font-size="11" fill="#1f2933" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="600" text-anchor="middle">ステージ</text>
<rect x="865" y="30" width="86" height="26" rx="5" fill="#ffffff" stroke="#cbd2d9" stroke-width="1.2"/>
<text x="908.0" y="47.0" font-size="11" fill="#1f2933" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="600" text-anchor="middle">ローカル</text>
<rect x="1021" y="30" width="86" height="26" rx="5" fill="#ffffff" stroke="#cbd2d9" stroke-width="1.2"/>
<text x="1064.0" y="47.0" font-size="11" fill="#1f2933" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="600" text-anchor="middle">リモート</text>
<path d="M643 39 L700 39" stroke="#16a34a" stroke-width="1.6"/>
<path d="M700 35.5 l6 3.5 l-6 3.5 z" fill="#16a34a"/>
<text x="674.0" y="34.0" font-size="9.5" fill="#16a34a" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" text-anchor="middle">add</text>
<path d="M799 39 L856 39" stroke="#16a34a" stroke-width="1.6"/>
<path d="M856 35.5 l6 3.5 l-6 3.5 z" fill="#16a34a"/>
<text x="830.0" y="34.0" font-size="9.5" fill="#16a34a" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" text-anchor="middle">commit</text>
<path d="M955 39 L1012 39" stroke="#16a34a" stroke-width="1.6"/>
<path d="M1012 35.5 l6 3.5 l-6 3.5 z" fill="#16a34a"/>
<text x="986.0" y="34.0" font-size="9.5" fill="#16a34a" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" text-anchor="middle">push</text>
<path d="M744 56 L744 64 L604 64 L604 61" fill="none" stroke="#ea580c" stroke-width="1.3"/>
<path d="M600.5 62 l3.5 -6 l3.5 6 z" fill="#ea580c"/>
<text x="674.0" y="74.0" font-size="9" fill="#ea580c" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" text-anchor="middle">restore</text>
<path d="M900 56 L900 64 L760 64 L760 61" fill="none" stroke="#ea580c" stroke-width="1.3"/>
<path d="M756.5 62 l3.5 -6 l3.5 6 z" fill="#ea580c"/>
<text x="830.0" y="74.0" font-size="9" fill="#ea580c" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" text-anchor="middle">restore --staged</text>
<path d="M1056 56 L1056 64 L916 64 L916 61" fill="none" stroke="#0284c7" stroke-width="1.3"/>
<path d="M912.5 62 l3.5 -6 l3.5 6 z" fill="#0284c7"/>
<text x="986.0" y="74.0" font-size="9" fill="#0284c7" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" text-anchor="middle">fetch</text>
<path d="M908 56 L908 84 L588 84 L588 61" fill="none" stroke="#2563eb" stroke-width="1.3"/>
<path d="M584.5 62 l3.5 -6 l3.5 6 z" fill="#2563eb"/>
<text x="748.0" y="94.0" font-size="9" fill="#2563eb" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" text-anchor="middle">switch</text>
<line x1="837.3" y1="112" x2="837.3" y2="762" stroke="#e4e7eb" stroke-width="1"/>
<line x1="561.5" y1="112" x2="561.5" y2="762" stroke="#e4e7eb" stroke-width="1"/>
<line x1="285.8" y1="112" x2="285.8" y2="762" stroke="#e4e7eb" stroke-width="1"/>
<rect x="16.0" y="112.0" width="263.8" height="17" rx="4" fill="#475569"/>
<text x="23.0" y="124.5" font-size="11.5" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">基本用語</text>
<text x="22.0" y="143.0" font-size="10" fill="#475569" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" font-weight="700">ステージ</text>
<text x="68.0" y="143.0" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">次のコミットに含める変更の置き場</text>
<text x="22.0" y="157.4" font-size="10" fill="#475569" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" font-weight="700">HEAD</text>
<text x="52.0" y="157.4" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">今いるコミット（今のブランチの先端）</text>
<text x="22.0" y="171.8" font-size="10" fill="#475569" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" font-weight="700">HEAD^ / HEAD~3</text>
<text x="112.0" y="171.8" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">1 つ前 / 3 つ前のコミット</text>
<text x="22.0" y="186.2" font-size="10" fill="#475569" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" font-weight="700">origin</text>
<text x="64.0" y="186.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">clone 元リモートの既定の名前</text>
<rect x="16.0" y="198.6" width="263.8" height="17" rx="4" fill="#d97706"/>
<text x="23.0" y="211.1" font-size="11.5" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">初期設定</text>
<text x="22.0" y="229.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">コミットに記録する名前とメールアドレス</text>
<rect x="19.0" y="232.8" width="257.8" height="28.8" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="232.8" width="2.5" height="28.8" fill="#d97706"/>
<text x="25.0" y="243.8" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git config --global user.name &lt;名前&gt;</text>
<text x="25.0" y="257.2" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git config --global user.email &lt;メール&gt;</text>
<text x="22.0" y="275.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">既定のブランチ名を main にする</text>
<rect x="19.0" y="278.8" width="257.8" height="28.8" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="278.8" width="2.5" height="28.8" fill="#d97706"/>
<text x="25.0" y="289.8" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git config --global init.defaultBranch</text>
<text x="25.0" y="303.2" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">  main</text>
<text x="22.0" y="321.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">設定の一覧と定義したファイル</text>
<rect x="19.0" y="324.8" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="324.8" width="2.5" height="15.4" fill="#d97706"/>
<text x="25.0" y="335.8" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git config --list --show-origin</text>
<rect x="16.0" y="352.2" width="263.8" height="17" rx="4" fill="#0d9488"/>
<text x="23.0" y="364.7" font-size="11.5" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">作成・クローン</text>
<text x="22.0" y="382.8" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">今のディレクトリをリポジトリにする</text>
<rect x="19.0" y="386.4" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="386.4" width="2.5" height="15.4" fill="#0d9488"/>
<text x="25.0" y="397.4" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git init</text>
<text x="22.0" y="415.4" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">リモートを複製（--depth 1 で最新だけ）</text>
<rect x="19.0" y="419.0" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="419.0" width="2.5" height="15.4" fill="#0d9488"/>
<text x="25.0" y="430.0" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git clone &lt;URL&gt;</text>
<rect x="16.0" y="446.4" width="263.8" height="17" rx="4" fill="#16a34a"/>
<text x="23.0" y="458.9" font-size="11.5" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">変更の記録</text>
<text x="22.0" y="477.0" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ステージに追加（-A で全体、-p で部分ごと）</text>
<rect x="19.0" y="480.6" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="480.6" width="2.5" height="15.4" fill="#16a34a"/>
<text x="25.0" y="491.6" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git add &lt;ファイル名&gt;</text>
<text x="22.0" y="509.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ステージの内容をコミット</text>
<rect x="19.0" y="513.2" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="513.2" width="2.5" height="15.4" fill="#16a34a"/>
<text x="25.0" y="524.2" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git commit -m &quot;&lt;メッセージ&gt;&quot;</text>
<text x="22.0" y="542.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">追跡中の変更を add してコミット</text>
<rect x="19.0" y="545.8" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="545.8" width="2.5" height="15.4" fill="#16a34a"/>
<text x="25.0" y="556.8" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git commit -am &quot;&lt;メッセージ&gt;&quot;</text>
<text x="22.0" y="574.8" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">直前のコミットに足す（push 前だけ）</text>
<rect x="19.0" y="578.4" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="578.4" width="2.5" height="15.4" fill="#16a34a"/>
<text x="25.0" y="589.4" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git commit --amend --no-edit</text>
<text x="22.0" y="607.4" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">追跡だけやめる（ファイルは残る）</text>
<rect x="19.0" y="611.0" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="611.0" width="2.5" height="15.4" fill="#16a34a"/>
<text x="25.0" y="622.0" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git rm --cached &lt;ファイル名&gt;</text>
<rect x="291.8" y="112.0" width="263.8" height="17" rx="4" fill="#0891b2"/>
<text x="298.8" y="124.5" font-size="11.5" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">状態・履歴・差分の確認</text>
<text x="297.8" y="142.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">変更とステージの状態を短く</text>
<rect x="294.8" y="146.2" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="146.2" width="2.5" height="15.4" fill="#0891b2"/>
<text x="300.8" y="157.2" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git status -sb</text>
<text x="297.8" y="175.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">全ブランチの履歴をグラフで</text>
<rect x="294.8" y="178.8" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="178.8" width="2.5" height="15.4" fill="#0891b2"/>
<text x="300.8" y="189.8" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git log --oneline --graph --all</text>
<text x="297.8" y="207.8" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">文字列が増減したコミットを探す</text>
<rect x="294.8" y="211.4" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="211.4" width="2.5" height="15.4" fill="#0891b2"/>
<text x="300.8" y="222.4" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git log -S &quot;&lt;文字列&gt;&quot;</text>
<text x="297.8" y="240.4" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">未ステージの差分（--staged でステージ済み）</text>
<rect x="294.8" y="244.0" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="244.0" width="2.5" height="15.4" fill="#0891b2"/>
<text x="300.8" y="255.0" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git diff</text>
<text x="297.8" y="273.0" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">過去のコミット時点のファイル</text>
<rect x="294.8" y="276.6" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="276.6" width="2.5" height="15.4" fill="#0891b2"/>
<text x="300.8" y="287.6" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git show &lt;コミットID&gt;:&lt;ファイル名&gt;</text>
<text x="297.8" y="305.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">行ごとに最後に変更したコミット</text>
<rect x="294.8" y="309.2" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="309.2" width="2.5" height="15.4" fill="#0891b2"/>
<text x="300.8" y="320.2" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git blame -L 10,20 &lt;ファイル名&gt;</text>
<rect x="291.8" y="336.6" width="263.8" height="17" rx="4" fill="#2563eb"/>
<text x="298.8" y="349.1" font-size="11.5" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">ブランチの操作</text>
<text x="297.8" y="367.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">一覧（-a でリモートも、-vv で追跡先も）</text>
<rect x="294.8" y="370.8" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="370.8" width="2.5" height="15.4" fill="#2563eb"/>
<text x="300.8" y="381.8" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git branch</text>
<text x="297.8" y="399.8" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">切り替える / 作って切り替える</text>
<rect x="294.8" y="403.4" width="257.8" height="28.8" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="403.4" width="2.5" height="28.8" fill="#2563eb"/>
<text x="300.8" y="414.4" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git switch &lt;ブランチ名&gt;</text>
<text x="300.8" y="427.8" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git switch -c &lt;ブランチ名&gt;</text>
<text x="297.8" y="445.8" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">直前にいたブランチへ戻る</text>
<rect x="294.8" y="449.4" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="449.4" width="2.5" height="15.4" fill="#2563eb"/>
<text x="300.8" y="460.4" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git switch -</text>
<text x="297.8" y="478.4" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">今のブランチの名前を変える</text>
<rect x="294.8" y="482.0" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="482.0" width="2.5" height="15.4" fill="#2563eb"/>
<text x="300.8" y="493.0" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git branch -m &lt;新しい名前&gt;</text>
<text x="297.8" y="511.0" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">統合済みのブランチを削除</text>
<rect x="294.8" y="514.6" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="514.6" width="2.5" height="15.4" fill="#2563eb"/>
<text x="300.8" y="525.6" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git branch -d &lt;ブランチ名&gt;</text>
<text x="297.8" y="543.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">統合していなくても強制削除</text>
<rect x="294.8" y="547.2" width="257.8" height="15.4" rx="3" fill="#fdecec"/>
<rect x="294.8" y="547.2" width="2.5" height="15.4" fill="#c81e1e"/>
<text x="300.8" y="558.2" font-size="10" fill="#c81e1e" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git branch -D &lt;ブランチ名&gt;</text>
<rect x="291.8" y="574.6" width="263.8" height="17" rx="4" fill="#7c3aed"/>
<text x="298.8" y="587.1" font-size="11.5" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">マージ・リベース</text>
<text x="297.8" y="605.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">main へ取り込む（--no-ff で必ずマージコミット）</text>
<rect x="294.8" y="608.8" width="257.8" height="28.8" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="608.8" width="2.5" height="28.8" fill="#7c3aed"/>
<text x="300.8" y="619.8" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git switch main</text>
<text x="300.8" y="633.2" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git merge --no-ff feature</text>
<line x1="309.75" y1="659.6000000000001" x2="459.75" y2="659.6000000000001" stroke="#94a3b8" stroke-width="2"/>
<path d="M339.75 659.6000000000001 L369.75 681.6000000000001 L429.75 681.6000000000001 L459.75 659.6000000000001" fill="none" stroke="#7c3aed" stroke-width="2"/>
<circle cx="309.8" cy="659.6" r="5" fill="#94a3b8"/>
<circle cx="339.8" cy="659.6" r="5" fill="#94a3b8"/>
<circle cx="399.8" cy="659.6" r="5" fill="#94a3b8"/>
<circle cx="369.8" cy="681.6" r="5" fill="#7c3aed"/>
<circle cx="429.8" cy="681.6" r="5" fill="#7c3aed"/>
<circle cx="459.8" cy="659.6" r="5" fill="#ffffff" stroke="#7c3aed" stroke-width="1.6"/>
<text x="468.8" y="663.1" font-size="9" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">マージコミット</text>
<text x="438.8" y="685.1" font-size="9" fill="#7c3aed" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">feature</text>
<text x="297.8" y="707.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">1 つにまとめて取り込む（コミットは自分で）</text>
<rect x="294.8" y="710.8" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="710.8" width="2.5" height="15.4" fill="#7c3aed"/>
<text x="300.8" y="721.8" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git merge --squash &lt;ブランチ名&gt;</text>
<text x="573.5" y="121.0" font-size="9.5" fill="#7c3aed" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">マージ・リベース（続き）</text>
<text x="573.5" y="135.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">feature を最新の main の上に載せ直す</text>
<rect x="570.5" y="139.2" width="257.8" height="28.8" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="139.2" width="2.5" height="28.8" fill="#7c3aed"/>
<text x="576.5" y="150.2" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git switch feature</text>
<text x="576.5" y="163.6" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git rebase main</text>
<text x="573.5" y="182.0" font-size="8.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">前</text>
<line x1="587.5" y1="190" x2="639.5" y2="190" stroke="#94a3b8" stroke-width="2"/>
<path d="M587.5 190 L613.5 208 L639.5 208" fill="none" stroke="#7c3aed" stroke-width="2"/>
<circle cx="587.5" cy="190.0" r="5" fill="#94a3b8"/>
<circle cx="613.5" cy="190.0" r="5" fill="#94a3b8"/>
<circle cx="639.5" cy="190.0" r="5" fill="#94a3b8"/>
<circle cx="613.5" cy="208.0" r="5" fill="#7c3aed"/>
<circle cx="639.5" cy="208.0" r="5" fill="#7c3aed"/>
<path d="M661.5 199 l14 0" stroke="#52606d" stroke-width="1.4"/>
<path d="M675.5 195.5 l5 3.5 l-5 3.5 z" fill="#52606d"/>
<text x="691.5" y="182.0" font-size="8.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">後</text>
<line x1="695.5" y1="190" x2="747.5" y2="190" stroke="#94a3b8" stroke-width="2"/>
<path d="M747.5 190 L773.5 208 L799.5 208" fill="none" stroke="#7c3aed" stroke-width="2"/>
<circle cx="695.5" cy="190.0" r="5" fill="#94a3b8"/>
<circle cx="721.5" cy="190.0" r="5" fill="#94a3b8"/>
<circle cx="747.5" cy="190.0" r="5" fill="#94a3b8"/>
<circle cx="773.5" cy="208.0" r="5" fill="#7c3aed"/>
<circle cx="799.5" cy="208.0" r="5" fill="#7c3aed"/>
<text x="573.5" y="228.0" font-size="9" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">feature のコミットは作り直される（ID が変わる）</text>
<text x="573.5" y="253.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">直近 3 件を並べ替え・まとめる</text>
<rect x="570.5" y="257.2" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="257.2" width="2.5" height="15.4" fill="#7c3aed"/>
<text x="576.5" y="268.2" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git rebase -i HEAD~3</text>
<text x="573.5" y="286.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">衝突を直して続ける / 中止する（merge も --abort）</text>
<rect x="570.5" y="289.8" width="257.8" height="28.8" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="289.8" width="2.5" height="28.8" fill="#7c3aed"/>
<text x="576.5" y="300.8" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git rebase --continue</text>
<text x="576.5" y="314.2" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git rebase --abort</text>
<text x="573.5" y="332.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ほかのブランチから 1 件だけ取り込む</text>
<rect x="570.5" y="335.8" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="335.8" width="2.5" height="15.4" fill="#7c3aed"/>
<text x="576.5" y="346.8" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git cherry-pick &lt;コミットID&gt;</text>
<rect x="567.5" y="363.2" width="263.8" height="17" rx="4" fill="#0284c7"/>
<text x="574.5" y="375.7" font-size="11.5" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">リモートとの連携</text>
<text x="573.5" y="393.8" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">リモートを登録 / 一覧</text>
<rect x="570.5" y="397.4" width="257.8" height="28.8" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="397.4" width="2.5" height="28.8" fill="#0284c7"/>
<text x="576.5" y="408.4" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git remote add origin &lt;URL&gt;</text>
<text x="576.5" y="421.8" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git remote -v</text>
<text x="573.5" y="439.8" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">取得だけ（--prune で消えたブランチも掃除）</text>
<rect x="570.5" y="443.4" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="443.4" width="2.5" height="15.4" fill="#0284c7"/>
<text x="576.5" y="454.4" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git fetch</text>
<text x="573.5" y="472.4" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">取得してマージ（--rebase で一直線に）</text>
<rect x="570.5" y="476.0" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="476.0" width="2.5" height="15.4" fill="#0284c7"/>
<text x="576.5" y="487.0" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git pull</text>
<text x="573.5" y="505.0" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">初回の push で追跡先も設定</text>
<rect x="570.5" y="508.6" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="508.6" width="2.5" height="15.4" fill="#0284c7"/>
<text x="576.5" y="519.6" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git push -u origin &lt;ブランチ名&gt;</text>
<text x="573.5" y="537.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">リモートのブランチを削除</text>
<rect x="570.5" y="541.2" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="541.2" width="2.5" height="15.4" fill="#0284c7"/>
<text x="576.5" y="552.2" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git push origin --delete &lt;ブランチ名&gt;</text>
<text x="573.5" y="570.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">強制 push（他人の push があれば止まる）</text>
<rect x="570.5" y="573.8" width="257.8" height="15.4" rx="3" fill="#fdecec"/>
<rect x="570.5" y="573.8" width="2.5" height="15.4" fill="#c81e1e"/>
<text x="576.5" y="584.8" font-size="10" fill="#c81e1e" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git push --force-with-lease</text>
<rect x="567.5" y="601.2" width="263.8" height="17" rx="4" fill="#ea580c"/>
<text x="574.5" y="613.7" font-size="11.5" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">変更の取り消し</text>
<text x="573.5" y="631.8" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">作業ツリーの変更を戻す（ステージの内容に）</text>
<rect x="570.5" y="635.4" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="635.4" width="2.5" height="15.4" fill="#ea580c"/>
<text x="576.5" y="646.4" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git restore &lt;ファイル名&gt;</text>
<text x="573.5" y="664.4" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ステージから外す（変更は残る）</text>
<rect x="570.5" y="668.0" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="668.0" width="2.5" height="15.4" fill="#ea580c"/>
<text x="576.5" y="679.0" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git restore --staged &lt;ファイル名&gt;</text>
<text x="573.5" y="697.0" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ファイルを過去のコミットの版に戻す</text>
<rect x="570.5" y="700.6" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="700.6" width="2.5" height="15.4" fill="#ea580c"/>
<text x="576.5" y="711.6" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git restore -s &lt;コミットID&gt; &lt;ファイル名&gt;</text>
<text x="573.5" y="729.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">直前のコミットを取り消す（変更はステージに）</text>
<rect x="570.5" y="733.2" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="733.2" width="2.5" height="15.4" fill="#ea580c"/>
<text x="576.5" y="744.2" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git reset --soft HEAD~1</text>
<text x="849.3" y="121.0" font-size="9.5" fill="#ea580c" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">変更の取り消し（続き）</text>
<text x="849.3" y="135.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">打ち消すコミットを作る（push 済みならこちら）</text>
<rect x="846.3" y="139.2" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="139.2" width="2.5" height="15.4" fill="#ea580c"/>
<text x="852.3" y="150.2" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git revert &lt;コミットID&gt;</text>
<text x="849.3" y="168.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">HEAD の移動履歴。消えたコミットの救出に</text>
<rect x="846.3" y="171.8" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="171.8" width="2.5" height="15.4" fill="#ea580c"/>
<text x="852.3" y="182.8" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git reflog</text>
<text x="849.3" y="200.8" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">その時点まで完全に巻き戻す（未コミットは消える）</text>
<rect x="846.3" y="204.4" width="257.8" height="15.4" rx="3" fill="#fdecec"/>
<rect x="846.3" y="204.4" width="2.5" height="15.4" fill="#c81e1e"/>
<text x="852.3" y="215.4" font-size="10" fill="#c81e1e" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git reset --hard &lt;コミットID&gt;</text>
<text x="849.3" y="233.4" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">未追跡ファイルを削除（-nd で事前に確認）</text>
<rect x="846.3" y="237.0" width="257.8" height="15.4" rx="3" fill="#fdecec"/>
<rect x="846.3" y="237.0" width="2.5" height="15.4" fill="#c81e1e"/>
<text x="852.3" y="248.0" font-size="10" fill="#c81e1e" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git clean -fd</text>
<rect x="843.3" y="264.4" width="263.8" height="17" rx="4" fill="#9333ea"/>
<text x="850.3" y="276.9" font-size="11.5" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">一時退避（stash）</text>
<text x="849.3" y="295.0" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">退避（-u で未追跡も）/ メモを付けて退避</text>
<rect x="846.3" y="298.6" width="257.8" height="28.8" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="298.6" width="2.5" height="28.8" fill="#9333ea"/>
<text x="852.3" y="309.6" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git stash</text>
<text x="852.3" y="323.0" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git stash push -m &quot;&lt;メモ&gt;&quot;</text>
<text x="849.3" y="341.0" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">一覧 / 中身を差分で見る</text>
<rect x="846.3" y="344.6" width="257.8" height="28.8" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="344.6" width="2.5" height="28.8" fill="#9333ea"/>
<text x="852.3" y="355.6" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git stash list</text>
<text x="852.3" y="369.0" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git stash show -p stash@{0}</text>
<text x="849.3" y="387.0" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">戻して消す / 戻して残す</text>
<rect x="846.3" y="390.6" width="257.8" height="28.8" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="390.6" width="2.5" height="28.8" fill="#9333ea"/>
<text x="852.3" y="401.6" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git stash pop</text>
<text x="852.3" y="415.0" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git stash apply stash@{1}</text>
<text x="849.3" y="433.0" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">退避をすべて消す</text>
<rect x="846.3" y="436.6" width="257.8" height="15.4" rx="3" fill="#fdecec"/>
<rect x="846.3" y="436.6" width="2.5" height="15.4" fill="#c81e1e"/>
<text x="852.3" y="447.6" font-size="10" fill="#c81e1e" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git stash clear</text>
<rect x="843.3" y="464.0" width="263.8" height="17" rx="4" fill="#65a30d"/>
<text x="850.3" y="476.5" font-size="11.5" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">タグ</text>
<text x="849.3" y="494.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">注釈付きタグを付ける</text>
<rect x="846.3" y="498.2" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="498.2" width="2.5" height="15.4" fill="#65a30d"/>
<text x="852.3" y="509.2" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git tag -a v1.0.0 -m &quot;&lt;メモ&gt;&quot;</text>
<text x="849.3" y="527.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">1 つ送る / すべて送る</text>
<rect x="846.3" y="530.8" width="257.8" height="28.8" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="530.8" width="2.5" height="28.8" fill="#65a30d"/>
<text x="852.3" y="541.8" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git push origin v1.0.0</text>
<text x="852.3" y="555.2" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git push --tags</text>
<rect x="843.3" y="571.6" width="263.8" height="17" rx="4" fill="#64748b"/>
<text x="850.3" y="584.1" font-size="11.5" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">worktree（同時作業）</text>
<text x="849.3" y="602.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">別ブランチを別ディレクトリで同時に開く</text>
<rect x="846.3" y="605.8" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="605.8" width="2.5" height="15.4" fill="#64748b"/>
<text x="852.3" y="616.8" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git worktree add &lt;パス&gt; &lt;ブランチ名&gt;</text>
<text x="849.3" y="634.8" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">一覧 / 削除</text>
<rect x="846.3" y="638.4" width="257.8" height="28.8" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="638.4" width="2.5" height="28.8" fill="#64748b"/>
<text x="852.3" y="649.4" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git worktree list</text>
<text x="852.3" y="662.8" font-size="10" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git worktree remove &lt;パス&gt;</text>
<text x="16.0" y="780.0" font-size="8.5" fill="#9aa5b1" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">Sirusita サンプル集 ・ A4 横（297×210mm）</text>
<text x="1107.0" y="780.0" font-size="8.5" fill="#9aa5b1" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" text-anchor="end">git help &lt;コマンド&gt; で詳しい説明</text>
</svg>

## この画面の作り方

全体が 1 つの SVG（`viewBox="0 0 1123 794"` = A4 横を 96dpi で表した大きさ）です。座標を固定して描いているので、ウィンドウの幅が変わってもレイアウトは崩れず、拡大・縮小されるだけです。

- `<svg>` から `</svg>` までの間に**空行を入れない**でください。空行があると、そこでマークダウンの HTML として扱われなくなります。
- SVG の文字は自動で折り返されません。行を増やすときは `<text>` の `y` を 1 行分ずらして追加します。
- 図や文字の位置は `x` / `y`（左上が 0、右が x、下が y）で決まります。
- このメモは Sirusita のリポジトリの `scripts/cheatsheet/git.mjs` で生成しています。
