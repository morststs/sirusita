---
title: "Git コマンド 1画面版"
tags:
  - "コマンド"
created: 2026-10-12T13:00:00+09:00
modified: 2026-10-12T13:00:00+09:00
sirusita: "1"
---

A4 横（297×210mm）の比率で 1 枚にまとめた Git のチートシートです。プレビューの幅に合わせて全体が拡大・縮小されます。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1123 794" width="100%" role="img" aria-label="Git コマンド チートシート">
<rect x="0" y="0" width="1123" height="794" rx="6" fill="#ffffff"/>
<rect x="0" y="0" width="1123" height="5" fill="#f05133"/>
<line x1="16" y1="102" x2="1107" y2="102" stroke="#e4e7eb" stroke-width="1"/>
<text x="16.0" y="46.0" font-size="30" fill="#f05133" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="800">Git</text>
<text x="78.0" y="46.0" font-size="22" fill="#1f2933" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">コマンド チートシート</text>
<text x="16.0" y="68.0" font-size="10.2" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">&lt;名前&gt; は置き換える部分。赤は元に戻しにくい操作</text>
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
<path d="M1064.0 56 L1064.0 64 L908.0 64 L908.0 61" fill="none" stroke="#0284c7" stroke-width="1.3"/>
<path d="M904.5 62 l3.5 -6 l3.5 6 z" fill="#0284c7"/>
<text x="986.0" y="74.0" font-size="9" fill="#0284c7" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" text-anchor="middle">fetch</text>
<path d="M760.0 56 L760.0 64 L596.0 64 L596.0 61" fill="none" stroke="#ea580c" stroke-width="1.3"/>
<path d="M592.5 62 l3.5 -6 l3.5 6 z" fill="#ea580c"/>
<text x="678.0" y="74.0" font-size="9" fill="#ea580c" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" text-anchor="middle">restore --staged</text>
<path d="M908.0 56 L908.0 84 L588.0 84 L588.0 61" fill="none" stroke="#ea580c" stroke-width="1.3"/>
<path d="M584.5 62 l3.5 -6 l3.5 6 z" fill="#ea580c"/>
<text x="748.0" y="94.0" font-size="9" fill="#ea580c" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" text-anchor="middle">switch / restore</text>
<line x1="837.2" y1="112" x2="837.2" y2="762" stroke="#e4e7eb" stroke-width="1"/>
<line x1="561.5" y1="112" x2="561.5" y2="762" stroke="#e4e7eb" stroke-width="1"/>
<line x1="285.8" y1="112" x2="285.8" y2="762" stroke="#e4e7eb" stroke-width="1"/>
<rect x="16.0" y="112.0" width="263.8" height="17" rx="4" fill="#d97706"/>
<text x="23.0" y="124.5" font-size="11.5" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">設定</text>
<text x="22.0" y="142.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">コミットに記録する名前とメール</text>
<rect x="19.0" y="146.2" width="257.8" height="28.8" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="146.2" width="2.5" height="28.8" fill="#d97706"/>
<text x="25.0" y="157.2" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git config --global user.name &lt;名前&gt;</text>
<text x="25.0" y="170.6" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git config --global user.email &lt;メール&gt;</text>
<text x="22.0" y="188.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">既定のブランチ名を main にする</text>
<rect x="19.0" y="192.2" width="257.8" height="28.8" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="192.2" width="2.5" height="28.8" fill="#d97706"/>
<text x="25.0" y="203.2" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git config --global init.defaultBranch</text>
<text x="25.0" y="216.6" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">  main</text>
<text x="22.0" y="234.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">別名を作る（git st で status）</text>
<rect x="19.0" y="238.2" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="238.2" width="2.5" height="15.4" fill="#d97706"/>
<text x="25.0" y="249.2" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git config --global alias.st status</text>
<text x="22.0" y="267.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">設定の一覧と定義したファイル</text>
<rect x="19.0" y="270.8" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="270.8" width="2.5" height="15.4" fill="#d97706"/>
<text x="25.0" y="281.8" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git config --list --show-origin</text>
<rect x="16.0" y="298.2" width="263.8" height="17" rx="4" fill="#0d9488"/>
<text x="23.0" y="310.7" font-size="11.5" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">始める</text>
<text x="22.0" y="328.8" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">今のフォルダーをリポジトリにする</text>
<rect x="19.0" y="332.4" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="332.4" width="2.5" height="15.4" fill="#0d9488"/>
<text x="25.0" y="343.4" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git init</text>
<text x="22.0" y="361.4" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">リモートを手元に複製（--depth 1 で最新だけ）</text>
<rect x="19.0" y="365.0" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="365.0" width="2.5" height="15.4" fill="#0d9488"/>
<text x="25.0" y="376.0" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git clone &lt;URL&gt;</text>
<rect x="16.0" y="392.4" width="263.8" height="17" rx="4" fill="#475569"/>
<text x="23.0" y="404.9" font-size="11.5" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">基本用語</text>
<text x="22.0" y="423.4" font-size="10.0" fill="#475569" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" font-weight="700">HEAD</text>
<text x="52.0" y="423.4" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">今いるコミット（ブランチ）</text>
<text x="22.0" y="437.8" font-size="10.0" fill="#475569" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" font-weight="700">HEAD^ / HEAD~3</text>
<text x="112.0" y="437.8" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">1 つ前 / 3 つ前</text>
<text x="22.0" y="452.2" font-size="10.0" fill="#475569" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" font-weight="700">origin</text>
<text x="64.0" y="452.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">clone 元リモートの既定名</text>
<text x="22.0" y="466.6" font-size="10.0" fill="#475569" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" font-weight="700">ステージ</text>
<text x="68.0" y="466.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">次のコミットに入れる変更の置き場</text>
<rect x="16.0" y="479.0" width="263.8" height="17" rx="4" fill="#16a34a"/>
<text x="23.0" y="491.5" font-size="11.5" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">変更を記録する</text>
<text x="22.0" y="509.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ステージに追加（-A ですべて、-p で部分ごと）</text>
<rect x="19.0" y="513.2" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="513.2" width="2.5" height="15.4" fill="#16a34a"/>
<text x="25.0" y="524.2" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git add &lt;ファイル&gt;</text>
<text x="22.0" y="542.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ステージの内容をコミット</text>
<rect x="19.0" y="545.8" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="545.8" width="2.5" height="15.4" fill="#16a34a"/>
<text x="25.0" y="556.8" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git commit -m &quot;&lt;メッセージ&gt;&quot;</text>
<text x="22.0" y="574.8" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">追跡中の変更を add してコミット</text>
<rect x="19.0" y="578.4" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="578.4" width="2.5" height="15.4" fill="#16a34a"/>
<text x="25.0" y="589.4" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git commit -am &quot;&lt;メッセージ&gt;&quot;</text>
<text x="22.0" y="607.4" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">直前のコミットに今の変更を足す</text>
<rect x="19.0" y="611.0" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="611.0" width="2.5" height="15.4" fill="#16a34a"/>
<text x="25.0" y="622.0" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git commit --amend --no-edit</text>
<text x="22.0" y="640.0" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">名前変更・削除をステージまで済ませる</text>
<rect x="19.0" y="643.6" width="257.8" height="28.8" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="643.6" width="2.5" height="28.8" fill="#16a34a"/>
<text x="25.0" y="654.6" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git mv &lt;旧&gt; &lt;新&gt;</text>
<text x="25.0" y="668.0" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git rm &lt;ファイル&gt;</text>
<text x="22.0" y="686.0" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ファイルは残して追跡だけやめる</text>
<rect x="19.0" y="689.6" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="689.6" width="2.5" height="15.4" fill="#16a34a"/>
<text x="25.0" y="700.6" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git rm --cached &lt;ファイル&gt;</text>
<rect x="291.8" y="112.0" width="263.8" height="17" rx="4" fill="#2563eb"/>
<text x="298.8" y="124.5" font-size="11.5" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">ブランチ</text>
<text x="297.8" y="142.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">一覧（-a でリモートも、-vv で追跡先も）</text>
<rect x="294.8" y="146.2" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="146.2" width="2.5" height="15.4" fill="#2563eb"/>
<text x="300.8" y="157.2" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git branch</text>
<text x="297.8" y="175.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">切り替える / 作って切り替える</text>
<rect x="294.8" y="178.8" width="257.8" height="28.8" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="178.8" width="2.5" height="28.8" fill="#2563eb"/>
<text x="300.8" y="189.8" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git switch &lt;ブランチ&gt;</text>
<text x="300.8" y="203.2" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git switch -c &lt;ブランチ&gt;</text>
<text x="297.8" y="221.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">直前にいたブランチへ戻る</text>
<rect x="294.8" y="224.8" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="224.8" width="2.5" height="15.4" fill="#2563eb"/>
<text x="300.8" y="235.8" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git switch -</text>
<text x="297.8" y="253.8" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">今のブランチの名前を変える</text>
<rect x="294.8" y="257.4" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="257.4" width="2.5" height="15.4" fill="#2563eb"/>
<text x="300.8" y="268.4" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git branch -m &lt;新しい名前&gt;</text>
<text x="297.8" y="286.4" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">統合済みのブランチを削除</text>
<rect x="294.8" y="290.0" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="290.0" width="2.5" height="15.4" fill="#2563eb"/>
<text x="300.8" y="301.0" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git branch -d &lt;ブランチ&gt;</text>
<text x="297.8" y="319.0" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">統合していなくても強制削除</text>
<rect x="294.8" y="322.6" width="257.8" height="15.4" rx="3" fill="#fdecec"/>
<rect x="294.8" y="322.6" width="2.5" height="15.4" fill="#c81e1e"/>
<text x="300.8" y="333.6" font-size="10.0" fill="#c81e1e" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git branch -D &lt;ブランチ&gt;</text>
<rect x="291.8" y="350.0" width="263.8" height="17" rx="4" fill="#7c3aed"/>
<text x="298.8" y="362.5" font-size="11.5" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">マージ</text>
<text x="297.8" y="380.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">main へ統合（--no-ff で必ずマージコミット）</text>
<rect x="294.8" y="384.2" width="257.8" height="28.8" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="384.2" width="2.5" height="28.8" fill="#7c3aed"/>
<text x="300.8" y="395.2" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git switch main</text>
<text x="300.8" y="408.6" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git merge --no-ff feature</text>
<line x1="309.75" y1="435.00000000000006" x2="459.75" y2="435.00000000000006" stroke="#94a3b8" stroke-width="2"/>
<path d="M339.75 435.00000000000006 L369.75 457.00000000000006 L429.75 457.00000000000006 L459.75 435.00000000000006" fill="none" stroke="#7c3aed" stroke-width="2"/>
<circle cx="309.8" cy="435.0" r="5" fill="#94a3b8"/>
<circle cx="339.8" cy="435.0" r="5" fill="#94a3b8"/>
<circle cx="399.8" cy="435.0" r="5" fill="#94a3b8"/>
<circle cx="369.8" cy="457.0" r="5" fill="#7c3aed"/>
<circle cx="429.8" cy="457.0" r="5" fill="#7c3aed"/>
<circle cx="459.8" cy="435.0" r="5" fill="#ffffff" stroke="#7c3aed" stroke-width="1.6"/>
<text x="468.8" y="438.5" font-size="9.0" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">マージコミット</text>
<text x="438.8" y="460.5" font-size="9.0" fill="#7c3aed" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">feature</text>
<text x="297.8" y="482.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">1 つにまとめて取り込む（コミットは自分で）</text>
<rect x="294.8" y="486.2" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="486.2" width="2.5" height="15.4" fill="#7c3aed"/>
<text x="300.8" y="497.2" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git merge --squash &lt;ブランチ&gt;</text>
<text x="297.8" y="515.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">衝突したマージをやめて元に戻す</text>
<rect x="294.8" y="518.8" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="518.8" width="2.5" height="15.4" fill="#7c3aed"/>
<text x="300.8" y="529.8" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git merge --abort</text>
<rect x="291.8" y="546.2" width="263.8" height="17" rx="4" fill="#db2777"/>
<text x="298.8" y="558.7" font-size="11.5" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">リベース</text>
<text x="297.8" y="576.8" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">feature の付け根を main の先端へ移す</text>
<rect x="294.8" y="580.4" width="257.8" height="28.8" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="580.4" width="2.5" height="28.8" fill="#db2777"/>
<text x="300.8" y="591.4" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git switch feature</text>
<text x="300.8" y="604.8" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git rebase main</text>
<text x="297.8" y="623.2" font-size="8.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">前</text>
<line x1="311.75" y1="631.2" x2="363.75" y2="631.2" stroke="#94a3b8" stroke-width="2"/>
<path d="M311.75 631.2 L337.75 649.2 L363.75 649.2" fill="none" stroke="#db2777" stroke-width="2"/>
<circle cx="311.8" cy="631.2" r="5" fill="#94a3b8"/>
<circle cx="337.8" cy="631.2" r="5" fill="#94a3b8"/>
<circle cx="363.8" cy="631.2" r="5" fill="#94a3b8"/>
<circle cx="337.8" cy="649.2" r="5" fill="#db2777"/>
<circle cx="363.8" cy="649.2" r="5" fill="#db2777"/>
<path d="M385.75 640.2 l14 0" stroke="#52606d" stroke-width="1.4"/>
<path d="M399.75 636.7 l5 3.5 l-5 3.5 z" fill="#52606d"/>
<text x="415.8" y="623.2" font-size="8.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">後</text>
<line x1="419.75" y1="631.2" x2="471.75" y2="631.2" stroke="#94a3b8" stroke-width="2"/>
<path d="M471.75 631.2 L497.75 649.2 L523.75 649.2" fill="none" stroke="#db2777" stroke-width="2"/>
<circle cx="419.8" cy="631.2" r="5" fill="#94a3b8"/>
<circle cx="445.8" cy="631.2" r="5" fill="#94a3b8"/>
<circle cx="471.8" cy="631.2" r="5" fill="#94a3b8"/>
<circle cx="497.8" cy="649.2" r="5" fill="#db2777"/>
<circle cx="523.8" cy="649.2" r="5" fill="#db2777"/>
<text x="297.8" y="669.2" font-size="9.0" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">feature のコミットは作り直される（ID が変わる）</text>
<text x="297.8" y="694.8" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">直近 3 件を並べ替え・まとめる</text>
<rect x="294.8" y="698.4" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="698.4" width="2.5" height="15.4" fill="#db2777"/>
<text x="300.8" y="709.4" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git rebase -i HEAD~3</text>
<text x="573.5" y="121.0" font-size="9.5" fill="#db2777" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">リベース（続き）</text>
<text x="573.5" y="135.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">衝突を直して続ける / 中止する</text>
<rect x="570.5" y="139.2" width="257.8" height="28.8" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="139.2" width="2.5" height="28.8" fill="#db2777"/>
<text x="576.5" y="150.2" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git rebase --continue</text>
<text x="576.5" y="163.6" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git rebase --abort</text>
<text x="573.5" y="181.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ほかのブランチから 1 件だけ取り込む</text>
<rect x="570.5" y="185.2" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="185.2" width="2.5" height="15.4" fill="#db2777"/>
<text x="576.5" y="196.2" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git cherry-pick &lt;コミット&gt;</text>
<rect x="567.5" y="212.6" width="263.8" height="17" rx="4" fill="#0891b2"/>
<text x="574.5" y="225.1" font-size="11.5" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">確認する</text>
<text x="573.5" y="243.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">変更とステージの状態を短く</text>
<rect x="570.5" y="246.8" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="246.8" width="2.5" height="15.4" fill="#0891b2"/>
<text x="576.5" y="257.8" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git status -sb</text>
<text x="573.5" y="275.8" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">全ブランチの履歴をグラフで</text>
<rect x="570.5" y="279.4" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="279.4" width="2.5" height="15.4" fill="#0891b2"/>
<text x="576.5" y="290.4" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git log --oneline --graph --all</text>
<text x="573.5" y="308.4" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ファイルの変更履歴を差分付きで</text>
<rect x="570.5" y="312.0" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="312.0" width="2.5" height="15.4" fill="#0891b2"/>
<text x="576.5" y="323.0" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git log -p &lt;ファイル&gt;</text>
<text x="573.5" y="341.0" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">文字列が増減したコミットを探す</text>
<rect x="570.5" y="344.6" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="344.6" width="2.5" height="15.4" fill="#0891b2"/>
<text x="576.5" y="355.6" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git log -S &quot;&lt;文字列&gt;&quot;</text>
<text x="573.5" y="373.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">未ステージの差分（--staged でステージ済み）</text>
<rect x="570.5" y="377.2" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="377.2" width="2.5" height="15.4" fill="#0891b2"/>
<text x="576.5" y="388.2" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git diff</text>
<text x="573.5" y="406.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">2 点間で変わったファイル</text>
<rect x="570.5" y="409.8" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="409.8" width="2.5" height="15.4" fill="#0891b2"/>
<text x="576.5" y="420.8" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git diff &lt;A&gt;..&lt;B&gt; --stat</text>
<text x="573.5" y="438.8" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">過去のコミット時点のファイル</text>
<rect x="570.5" y="442.4" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="442.4" width="2.5" height="15.4" fill="#0891b2"/>
<text x="576.5" y="453.4" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git show &lt;コミット&gt;:&lt;ファイル&gt;</text>
<text x="573.5" y="471.4" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">行ごとの最終変更</text>
<rect x="570.5" y="475.0" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="475.0" width="2.5" height="15.4" fill="#0891b2"/>
<text x="576.5" y="486.0" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git blame -L 10,20 &lt;ファイル&gt;</text>
<rect x="567.5" y="502.4" width="263.8" height="17" rx="4" fill="#ea580c"/>
<text x="574.5" y="514.9" font-size="11.5" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">取り消す</text>
<text x="573.5" y="533.0" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">作業ツリーの変更を破棄</text>
<rect x="570.5" y="536.6" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="536.6" width="2.5" height="15.4" fill="#ea580c"/>
<text x="576.5" y="547.6" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git restore &lt;ファイル&gt;</text>
<text x="573.5" y="565.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ステージから外す（変更は残る）</text>
<rect x="570.5" y="569.2" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="569.2" width="2.5" height="15.4" fill="#ea580c"/>
<text x="576.5" y="580.2" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git restore --staged &lt;ファイル&gt;</text>
<text x="573.5" y="598.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">過去のコミットの版に戻す</text>
<rect x="570.5" y="601.8" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="601.8" width="2.5" height="15.4" fill="#ea580c"/>
<text x="576.5" y="612.8" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git restore -s &lt;コミット&gt; &lt;ファイル&gt;</text>
<text x="573.5" y="630.8" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">直前のコミットだけ取り消す</text>
<rect x="570.5" y="634.4" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="634.4" width="2.5" height="15.4" fill="#ea580c"/>
<text x="576.5" y="645.4" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git reset --soft HEAD~1</text>
<text x="573.5" y="663.4" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">打ち消すコミットを作る（共有済みならこちら）</text>
<rect x="570.5" y="667.0" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="667.0" width="2.5" height="15.4" fill="#ea580c"/>
<text x="576.5" y="678.0" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git revert &lt;コミット&gt;</text>
<text x="573.5" y="696.0" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">HEAD の移動履歴。消えたコミットの救出に</text>
<rect x="570.5" y="699.6" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="699.6" width="2.5" height="15.4" fill="#ea580c"/>
<text x="576.5" y="710.6" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git reflog</text>
<text x="573.5" y="728.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">未コミットの変更をすべて捨てる</text>
<rect x="570.5" y="732.2" width="257.8" height="15.4" rx="3" fill="#fdecec"/>
<rect x="570.5" y="732.2" width="2.5" height="15.4" fill="#c81e1e"/>
<text x="576.5" y="743.2" font-size="10.0" fill="#c81e1e" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git reset --hard &lt;コミット&gt;</text>
<text x="849.2" y="121.0" font-size="9.5" fill="#ea580c" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">取り消す（続き）</text>
<text x="849.2" y="135.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">未追跡ファイルを削除（-n で事前確認）</text>
<rect x="846.2" y="139.2" width="257.8" height="15.4" rx="3" fill="#fdecec"/>
<rect x="846.2" y="139.2" width="2.5" height="15.4" fill="#c81e1e"/>
<text x="852.2" y="150.2" font-size="10.0" fill="#c81e1e" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git clean -fd</text>
<rect x="843.2" y="166.6" width="263.8" height="17" rx="4" fill="#9333ea"/>
<text x="850.2" y="179.1" font-size="11.5" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">退避する（stash）</text>
<text x="849.2" y="197.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">一時的に退避（-u で未追跡も）</text>
<rect x="846.2" y="200.8" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="846.2" y="200.8" width="2.5" height="15.4" fill="#9333ea"/>
<text x="852.2" y="211.8" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git stash -u</text>
<text x="849.2" y="229.8" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">メモを付けて退避</text>
<rect x="846.2" y="233.4" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="846.2" y="233.4" width="2.5" height="15.4" fill="#9333ea"/>
<text x="852.2" y="244.4" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git stash push -m &quot;&lt;メモ&gt;&quot;</text>
<text x="849.2" y="262.4" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">一覧 / 中身を差分で見る</text>
<rect x="846.2" y="266.0" width="257.8" height="28.8" rx="3" fill="#f2f4f8"/>
<rect x="846.2" y="266.0" width="2.5" height="28.8" fill="#9333ea"/>
<text x="852.2" y="277.0" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git stash list</text>
<text x="852.2" y="290.4" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git stash show -p stash@{0}</text>
<text x="849.2" y="308.4" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">戻して消す / 戻して残す</text>
<rect x="846.2" y="312.0" width="257.8" height="28.8" rx="3" fill="#f2f4f8"/>
<rect x="846.2" y="312.0" width="2.5" height="28.8" fill="#9333ea"/>
<text x="852.2" y="323.0" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git stash pop</text>
<text x="852.2" y="336.4" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git stash apply stash@{1}</text>
<text x="849.2" y="354.4" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">退避をすべて消す</text>
<rect x="846.2" y="358.0" width="257.8" height="15.4" rx="3" fill="#fdecec"/>
<rect x="846.2" y="358.0" width="2.5" height="15.4" fill="#c81e1e"/>
<text x="852.2" y="369.0" font-size="10.0" fill="#c81e1e" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git stash clear</text>
<rect x="843.2" y="385.4" width="263.8" height="17" rx="4" fill="#0284c7"/>
<text x="850.2" y="397.9" font-size="11.5" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">同期する</text>
<text x="849.2" y="416.0" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">リモートを登録 / 確認</text>
<rect x="846.2" y="419.6" width="257.8" height="28.8" rx="3" fill="#f2f4f8"/>
<rect x="846.2" y="419.6" width="2.5" height="28.8" fill="#0284c7"/>
<text x="852.2" y="430.6" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git remote add origin &lt;URL&gt;</text>
<text x="852.2" y="444.0" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git remote -v</text>
<text x="849.2" y="462.0" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">取得だけ（消えたブランチの参照も掃除）</text>
<rect x="846.2" y="465.6" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="846.2" y="465.6" width="2.5" height="15.4" fill="#0284c7"/>
<text x="852.2" y="476.6" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git fetch --prune</text>
<text x="849.2" y="494.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">取得して統合（--rebase で一直線に）</text>
<rect x="846.2" y="498.2" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="846.2" y="498.2" width="2.5" height="15.4" fill="#0284c7"/>
<text x="852.2" y="509.2" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git pull</text>
<text x="849.2" y="527.2" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">初回の push で追跡先も設定</text>
<rect x="846.2" y="530.8" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="846.2" y="530.8" width="2.5" height="15.4" fill="#0284c7"/>
<text x="852.2" y="541.8" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git push -u origin &lt;ブランチ&gt;</text>
<text x="849.2" y="559.8" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">リモートのブランチを削除</text>
<rect x="846.2" y="563.4" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="846.2" y="563.4" width="2.5" height="15.4" fill="#0284c7"/>
<text x="852.2" y="574.4" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git push origin --delete &lt;ブランチ&gt;</text>
<text x="849.2" y="592.4" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">強制 push（他人の push があれば止まる）</text>
<rect x="846.2" y="596.0" width="257.8" height="15.4" rx="3" fill="#fdecec"/>
<rect x="846.2" y="596.0" width="2.5" height="15.4" fill="#c81e1e"/>
<text x="852.2" y="607.0" font-size="10.0" fill="#c81e1e" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git push --force-with-lease</text>
<rect x="843.2" y="623.4" width="263.8" height="17" rx="4" fill="#65a30d"/>
<text x="850.2" y="635.9" font-size="11.5" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">タグ</text>
<text x="849.2" y="654.0" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">注釈付きタグを付ける</text>
<rect x="846.2" y="657.6" width="257.8" height="15.4" rx="3" fill="#f2f4f8"/>
<rect x="846.2" y="657.6" width="2.5" height="15.4" fill="#65a30d"/>
<text x="852.2" y="668.6" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git tag -a v1.0.0 -m &quot;&lt;メモ&gt;&quot;</text>
<text x="849.2" y="686.6" font-size="9.6" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">1 つ送る / すべて送る</text>
<rect x="846.2" y="690.2" width="257.8" height="28.8" rx="3" fill="#f2f4f8"/>
<rect x="846.2" y="690.2" width="2.5" height="28.8" fill="#65a30d"/>
<text x="852.2" y="701.2" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git push origin v1.0.0</text>
<text x="852.2" y="714.6" font-size="10.0" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ git push --tags</text>
<text x="16.0" y="780.0" font-size="8.5" fill="#9aa5b1" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">Sirusita サンプル集 ・ A4 横（297×210mm）</text>
<text x="1107.0" y="780.0" font-size="8.5" fill="#9aa5b1" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" text-anchor="end">git help &lt;コマンド&gt; で詳しい説明</text>
</svg>

## この画面の作り方

全体が 1 つの SVG（`viewBox="0 0 1123 794"` = A4 横を 96dpi で表した大きさ）です。座標を固定して描いているので、ウィンドウの幅が変わってもレイアウトは崩れず、拡大・縮小されるだけです。

- `<svg>` から `</svg>` までの間に**空行を入れない**でください。空行があると、そこでマークダウンの HTML として扱われなくなります。
- SVG の文字は自動で折り返されません。行を増やすときは `<text>` の `y` を 1 行分ずらして追加します。
- 図や文字の位置は `x` / `y`（左上が 0、右が x、下が y）で決まります。
