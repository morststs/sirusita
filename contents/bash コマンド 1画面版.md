---
title: "bash コマンド 1画面版"
tags:
  - "コマンド"
created: 2026-10-12T16:00:00+09:00
modified: 2026-10-12T16:00:00+09:00
sirusita: "1"
---

A4 横（297×210mm）の比率で 1 枚にまとめた bash のチートシートです。プレビューの幅に合わせて全体が拡大・縮小されます。各コマンドの詳しい説明は「bash コマンド」を見てください。

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1123 794" width="100%" role="img" aria-label="bash コマンド チートシート">
<rect x="0" y="0" width="1123" height="794" rx="6" fill="#ffffff"/>
<rect x="0" y="0" width="1123" height="5" fill="#2f855a"/>
<line x1="16" y1="102" x2="1107" y2="102" stroke="#e4e7eb" stroke-width="1"/>
<text x="16.0" y="46.0" font-size="30" fill="#2f855a" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="800">bash</text>
<text x="101.0" y="46.0" font-size="22" fill="#1f2933" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">コマンド チートシート</text>
<text x="16.0" y="68.0" font-size="10.2" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">&lt; &gt; の部分は実際の値に置き換える。赤は元に戻しにくい操作。詳しくは「bash コマンド」</text>
<rect x="537" y="30" width="74" height="26" rx="5" fill="#ffffff" stroke="#cbd2d9" stroke-width="1.2"/>
<text x="574.0" y="47.0" font-size="11" fill="#1f2933" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="600" text-anchor="middle">in.txt</text>
<rect x="661" y="30" width="74" height="26" rx="5" fill="#ffffff" stroke="#cbd2d9" stroke-width="1.2"/>
<text x="698.0" y="47.0" font-size="11" fill="#1f2933" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="600" text-anchor="middle">コマンド1</text>
<rect x="785" y="30" width="74" height="26" rx="5" fill="#ffffff" stroke="#cbd2d9" stroke-width="1.2"/>
<text x="822.0" y="47.0" font-size="11" fill="#1f2933" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="600" text-anchor="middle">コマンド2</text>
<rect x="909" y="30" width="74" height="26" rx="5" fill="#ffffff" stroke="#cbd2d9" stroke-width="1.2"/>
<text x="946.0" y="47.0" font-size="11" fill="#1f2933" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="600" text-anchor="middle">out.txt</text>
<rect x="1033" y="30" width="74" height="26" rx="5" fill="#ffffff" stroke="#cbd2d9" stroke-width="1.2"/>
<text x="1070.0" y="47.0" font-size="11" fill="#1f2933" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="600" text-anchor="middle">err.log</text>
<path d="M615 39 L652 39" stroke="#16a34a" stroke-width="1.6"/>
<path d="M652 35.5 l6 3.5 l-6 3.5 z" fill="#16a34a"/>
<text x="636.0" y="34.0" font-size="9.5" fill="#16a34a" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" text-anchor="middle">&lt; 入力</text>
<path d="M739 39 L776 39" stroke="#16a34a" stroke-width="1.6"/>
<path d="M776 35.5 l6 3.5 l-6 3.5 z" fill="#16a34a"/>
<text x="760.0" y="34.0" font-size="9.5" fill="#16a34a" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" text-anchor="middle">| パイプ</text>
<path d="M863 39 L900 39" stroke="#16a34a" stroke-width="1.6"/>
<path d="M900 35.5 l6 3.5 l-6 3.5 z" fill="#16a34a"/>
<text x="884.0" y="34.0" font-size="9.5" fill="#16a34a" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" text-anchor="middle">&gt; 出力</text>
<path d="M822 56 L822 84 L1062 84 L1062 61" fill="none" stroke="#c81e1e" stroke-width="1.3"/>
<path d="M1058.5 62 l3.5 -6 l3.5 6 z" fill="#c81e1e"/>
<text x="942.0" y="94.0" font-size="9" fill="#c81e1e" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace" text-anchor="middle">2&gt; (標準エラー)</text>
<line x1="837.3" y1="112" x2="837.3" y2="762" stroke="#e4e7eb" stroke-width="1"/>
<line x1="561.5" y1="112" x2="561.5" y2="762" stroke="#e4e7eb" stroke-width="1"/>
<line x1="285.8" y1="112" x2="285.8" y2="762" stroke="#e4e7eb" stroke-width="1"/>
<rect x="16.0" y="112.0" width="263.8" height="19.1" rx="4" fill="#2f855a"/>
<text x="23.0" y="125.9" font-size="12.65" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">ファイル・ディレクトリ操作</text>
<text x="22.0" y="145.7" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">隠しファイルも詳細付きで一覧（-h でサイズを</text>
<text x="22.0" y="159.1" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">K/M/G）</text>
<rect x="19.0" y="162.9" width="257.8" height="31.5" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="162.9" width="2.5" height="31.5" fill="#2f855a"/>
<text x="25.0" y="174.9" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ ls -la</text>
<text x="25.0" y="189.7" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ ls -lh</text>
<text x="22.0" y="209.4" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">今のディレクトリ / 直前のディレクトリへ戻る</text>
<rect x="19.0" y="213.2" width="257.8" height="31.5" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="213.2" width="2.5" height="31.5" fill="#2f855a"/>
<text x="25.0" y="225.2" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ pwd</text>
<text x="25.0" y="240.0" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ cd -</text>
<text x="22.0" y="259.7" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">途中の階層もまとめて作る</text>
<rect x="19.0" y="263.5" width="257.8" height="16.7" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="263.5" width="2.5" height="16.7" fill="#2f855a"/>
<text x="25.0" y="275.5" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ mkdir -p a/b/c</text>
<text x="22.0" y="295.2" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ディレクトリごとコピー / 属性を保ってコピー</text>
<rect x="19.0" y="299.1" width="257.8" height="31.5" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="299.1" width="2.5" height="31.5" fill="#2f855a"/>
<text x="25.0" y="311.1" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ cp -r &lt;元&gt; &lt;先&gt;</text>
<text x="25.0" y="325.8" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ cp -a &lt;元&gt; &lt;先&gt;</text>
<text x="22.0" y="345.5" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">移動・名前変更</text>
<rect x="19.0" y="349.4" width="257.8" height="16.7" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="349.4" width="2.5" height="16.7" fill="#2f855a"/>
<text x="25.0" y="361.4" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ mv &lt;元&gt; &lt;先&gt;</text>
<text x="22.0" y="381.1" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">空ファイルを作る / 更新日時を今にする</text>
<rect x="19.0" y="385.0" width="257.8" height="16.7" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="385.0" width="2.5" height="16.7" fill="#2f855a"/>
<text x="25.0" y="397.0" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ touch &lt;ファイル&gt;</text>
<text x="22.0" y="416.7" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">シンボリックリンクを作る</text>
<rect x="19.0" y="420.5" width="257.8" height="16.7" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="420.5" width="2.5" height="16.7" fill="#2f855a"/>
<text x="25.0" y="432.5" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ ln -s &lt;実体&gt; &lt;リンク名&gt;</text>
<text x="22.0" y="452.2" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">中身ごと強制削除（取り消せない）</text>
<rect x="19.0" y="456.1" width="257.8" height="16.7" rx="3" fill="#fdecec"/>
<rect x="19.0" y="456.1" width="2.5" height="16.7" fill="#c81e1e"/>
<text x="25.0" y="468.1" font-size="11" fill="#c81e1e" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ rm -rf &lt;対象&gt;</text>
<rect x="16.0" y="486.0" width="263.8" height="19.1" rx="4" fill="#0d9488"/>
<text x="23.0" y="499.9" font-size="12.65" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">内容の表示・確認</text>
<text x="22.0" y="519.7" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">全部表示 / ページ単位（q で終了、/語 で検索）</text>
<rect x="19.0" y="523.5" width="257.8" height="31.5" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="523.5" width="2.5" height="31.5" fill="#0d9488"/>
<text x="25.0" y="535.5" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ cat &lt;ファイル&gt;</text>
<text x="25.0" y="550.3" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ less &lt;ファイル&gt;</text>
<text x="22.0" y="570.0" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">先頭 / 末尾の 20 行</text>
<rect x="19.0" y="573.8" width="257.8" height="31.5" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="573.8" width="2.5" height="31.5" fill="#0d9488"/>
<text x="25.0" y="585.8" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ head -n 20 &lt;ファイル&gt;</text>
<text x="25.0" y="600.6" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ tail -n 20 &lt;ファイル&gt;</text>
<text x="22.0" y="620.3" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">追記を追いかけて表示（ログの監視）</text>
<rect x="19.0" y="624.1" width="257.8" height="16.7" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="624.1" width="2.5" height="16.7" fill="#0d9488"/>
<text x="25.0" y="636.1" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ tail -f &lt;ファイル&gt;</text>
<text x="22.0" y="655.8" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">行数を数える / 2 つのファイルの差分</text>
<rect x="19.0" y="659.7" width="257.8" height="31.5" rx="3" fill="#f2f4f8"/>
<rect x="19.0" y="659.7" width="2.5" height="31.5" fill="#0d9488"/>
<text x="25.0" y="671.7" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ wc -l &lt;ファイル&gt;</text>
<text x="25.0" y="686.4" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ diff &lt;A&gt; &lt;B&gt;</text>
<rect x="291.8" y="112.0" width="263.8" height="19.1" rx="4" fill="#2563eb"/>
<text x="298.8" y="125.9" font-size="12.65" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">検索（find / grep）</text>
<text x="297.8" y="145.7" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">名前で再帰的に探す</text>
<rect x="294.8" y="149.5" width="257.8" height="16.7" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="149.5" width="2.5" height="16.7" fill="#2563eb"/>
<text x="300.8" y="161.5" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ find . -name &quot;*.txt&quot;</text>
<text x="297.8" y="181.2" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ディレクトリだけを探す</text>
<rect x="294.8" y="185.1" width="257.8" height="31.5" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="185.1" width="2.5" height="31.5" fill="#2563eb"/>
<text x="300.8" y="197.1" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ find . -type d -name</text>
<text x="300.8" y="211.8" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">  &quot;node_modules&quot;</text>
<text x="297.8" y="231.5" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">1 日以内に更新 / 10MB より大きい</text>
<rect x="294.8" y="235.4" width="257.8" height="31.5" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="235.4" width="2.5" height="31.5" fill="#2563eb"/>
<text x="300.8" y="247.4" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ find . -mtime -1</text>
<text x="300.8" y="262.1" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ find . -size +10M</text>
<text x="297.8" y="281.8" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">再帰的に、行番号付きで文字列を探す</text>
<rect x="294.8" y="285.7" width="257.8" height="16.7" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="285.7" width="2.5" height="16.7" fill="#2563eb"/>
<text x="300.8" y="297.7" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ grep -rn &quot;TODO&quot; .</text>
<text x="297.8" y="317.4" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">大文字小文字を無視 / 一致しない行だけ</text>
<rect x="294.8" y="321.2" width="257.8" height="31.5" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="321.2" width="2.5" height="31.5" fill="#2563eb"/>
<text x="300.8" y="333.2" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ grep -i &quot;error&quot; app.log</text>
<text x="300.8" y="348.0" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ grep -v &quot;debug&quot; app.log</text>
<text x="297.8" y="367.7" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">拡張正規表現で複数のパターン</text>
<rect x="294.8" y="371.5" width="257.8" height="16.7" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="371.5" width="2.5" height="16.7" fill="#2563eb"/>
<text x="300.8" y="383.5" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ grep -E &quot;foo|bar&quot; &lt;ファイル&gt;</text>
<text x="297.8" y="403.2" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">.js だけを対象に探す</text>
<rect x="294.8" y="407.1" width="257.8" height="31.5" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="407.1" width="2.5" height="31.5" fill="#2563eb"/>
<text x="300.8" y="419.1" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ grep -rn --include=&quot;*.js&quot;</text>
<text x="300.8" y="433.8" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">  &quot;console.log&quot; .</text>
<text x="297.8" y="453.5" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">30 日より古い .tmp を探して削除</text>
<rect x="294.8" y="457.4" width="257.8" height="31.5" rx="3" fill="#fdecec"/>
<rect x="294.8" y="457.4" width="2.5" height="31.5" fill="#c81e1e"/>
<text x="300.8" y="469.4" font-size="11" fill="#c81e1e" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ find /tmp -name &quot;*.tmp&quot; -mtime +30</text>
<text x="300.8" y="484.1" font-size="11" fill="#c81e1e" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">  -delete</text>
<rect x="291.8" y="502.1" width="263.8" height="19.1" rx="4" fill="#7c3aed"/>
<text x="298.8" y="515.9" font-size="12.65" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">パイプ・リダイレクト</text>
<text x="297.8" y="535.7" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">左の出力を右の入力へつなぐ（パイプ）</text>
<rect x="294.8" y="539.6" width="257.8" height="16.7" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="539.6" width="2.5" height="16.7" fill="#7c3aed"/>
<text x="300.8" y="551.6" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ &lt;コマンド&gt; | &lt;コマンド&gt;</text>
<rect x="294.8" y="560.7" width="92.0" height="16.7" rx="2" fill="#f2f4f8"/>
<text x="297.8" y="572.7" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">&gt; &lt;ファイル&gt;</text>
<text x="391.8" y="572.7" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">標準出力を上書き保存</text>
<rect x="294.8" y="579.5" width="92.0" height="16.7" rx="2" fill="#f2f4f8"/>
<text x="297.8" y="591.5" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">&gt;&gt; &lt;ファイル&gt;</text>
<text x="391.8" y="591.5" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">標準出力をファイルへ追記</text>
<rect x="294.8" y="598.2" width="92.0" height="16.7" rx="2" fill="#f2f4f8"/>
<text x="297.8" y="610.2" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">2&gt; &lt;ファイル&gt;</text>
<text x="391.8" y="610.2" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">標準エラーをファイルへ</text>
<rect x="294.8" y="617.0" width="92.0" height="16.7" rx="2" fill="#f2f4f8"/>
<text x="297.8" y="629.0" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">2&gt;&amp;1</text>
<text x="391.8" y="629.0" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">標準エラーも標準出力へ</text>
<rect x="294.8" y="635.7" width="92.0" height="16.7" rx="2" fill="#f2f4f8"/>
<text x="297.8" y="647.7" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">&lt; &lt;ファイル&gt;</text>
<text x="391.8" y="647.7" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ファイルを標準入力にする</text>
<rect x="294.8" y="654.4" width="92.0" height="16.7" rx="2" fill="#f2f4f8"/>
<text x="297.8" y="666.4" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">tee &lt;ファイル&gt;</text>
<text x="391.8" y="666.4" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">画面とファイルの両方へ出す</text>
<text x="297.8" y="683.7" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">結果とエラーをまとめてログへ / 画面にも出す</text>
<rect x="294.8" y="687.6" width="257.8" height="31.5" rx="3" fill="#f2f4f8"/>
<rect x="294.8" y="687.6" width="2.5" height="31.5" fill="#7c3aed"/>
<text x="300.8" y="699.6" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ ./build.sh &gt; build.log 2&gt;&amp;1</text>
<text x="300.8" y="714.3" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ ./build.sh 2&gt;&amp;1 | tee build.log</text>
<rect x="567.5" y="112.0" width="263.8" height="19.1" rx="4" fill="#d97706"/>
<text x="574.5" y="125.9" font-size="12.65" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">権限（chmod / chown）</text>
<text x="573.5" y="145.7" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">rwxr-xr-x にする（r=4, w=2, x=1 の合計）</text>
<rect x="570.5" y="149.5" width="257.8" height="16.7" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="149.5" width="2.5" height="16.7" fill="#d97706"/>
<text x="576.5" y="161.5" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ chmod 755 &lt;ファイル&gt;</text>
<text x="573.5" y="181.2" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">実行権限を付ける</text>
<rect x="570.5" y="185.1" width="257.8" height="16.7" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="185.1" width="2.5" height="16.7" fill="#d97706"/>
<text x="576.5" y="197.1" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ chmod +x &lt;ファイル&gt;</text>
<text x="573.5" y="216.8" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">再帰的に（X はディレクトリだけに x）</text>
<rect x="570.5" y="220.6" width="257.8" height="16.7" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="220.6" width="2.5" height="16.7" fill="#d97706"/>
<text x="576.5" y="232.6" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ chmod -R u+rwX,go+rX &lt;ディレクトリ&gt;</text>
<text x="573.5" y="252.3" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ファイルだけ 644 にする</text>
<rect x="570.5" y="256.2" width="257.8" height="31.5" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="256.2" width="2.5" height="31.5" fill="#d97706"/>
<text x="576.5" y="268.2" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ find . -type f -exec chmod 644 {}</text>
<text x="576.5" y="282.9" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">  +</text>
<text x="573.5" y="302.6" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">所有者とグループを変える（-R で再帰）</text>
<rect x="570.5" y="306.5" width="257.8" height="16.7" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="306.5" width="2.5" height="16.7" fill="#d97706"/>
<text x="576.5" y="318.5" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ chown user:group &lt;ファイル&gt;</text>
<rect x="567.5" y="336.4" width="263.8" height="19.1" rx="4" fill="#db2777"/>
<text x="574.5" y="350.3" font-size="12.65" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">スクリプトの基礎</text>
<text x="573.5" y="370.1" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">エラーで止める（先頭に書く）</text>
<rect x="570.5" y="374.0" width="257.8" height="16.7" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="374.0" width="2.5" height="16.7" fill="#db2777"/>
<text x="576.5" y="386.0" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">set -euo pipefail</text>
<text x="573.5" y="405.7" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">代入（= の前後に空白を入れない）/ 展開</text>
<rect x="570.5" y="409.5" width="257.8" height="31.5" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="409.5" width="2.5" height="31.5" fill="#db2777"/>
<text x="576.5" y="421.5" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">name=&quot;値&quot;</text>
<text x="576.5" y="436.3" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">echo &quot;$name&quot;</text>
<text x="573.5" y="456.0" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">コマンドの出力を埋め込む</text>
<rect x="570.5" y="459.8" width="257.8" height="16.7" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="459.8" width="2.5" height="16.7" fill="#db2777"/>
<text x="576.5" y="471.8" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$(コマンド)</text>
<text x="573.5" y="491.5" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">条件分岐（[ ] の内側に空白が必要）</text>
<rect x="570.5" y="495.4" width="257.8" height="16.7" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="495.4" width="2.5" height="16.7" fill="#db2777"/>
<text x="576.5" y="507.4" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">if [ &quot;$x&quot; = &quot;a&quot; ]; then ... fi</text>
<text x="573.5" y="527.1" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">繰り返し / 1 行ずつ読む</text>
<rect x="570.5" y="530.9" width="257.8" height="31.5" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="530.9" width="2.5" height="31.5" fill="#db2777"/>
<text x="576.5" y="542.9" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">for i in 1 2 3; do ... done</text>
<text x="576.5" y="557.7" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">while read line; do ... done &lt; file</text>
<text x="573.5" y="577.4" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">パターンで分岐</text>
<rect x="570.5" y="581.2" width="257.8" height="16.7" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="581.2" width="2.5" height="16.7" fill="#db2777"/>
<text x="576.5" y="593.2" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">case &quot;$x&quot; in a) ...;; *) ...;; esac</text>
<rect x="567.5" y="611.2" width="263.8" height="19.1" rx="4" fill="#0284c7"/>
<text x="574.5" y="625.0" font-size="12.65" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">xargs・連結</text>
<text x="573.5" y="644.8" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">A が成功したら B / 失敗したら B</text>
<rect x="570.5" y="648.7" width="257.8" height="31.5" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="648.7" width="2.5" height="31.5" fill="#0284c7"/>
<text x="576.5" y="660.7" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ &lt;コマンドA&gt; &amp;&amp; &lt;コマンドB&gt;</text>
<text x="576.5" y="675.4" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ &lt;コマンドA&gt; || &lt;コマンドB&gt;</text>
<text x="573.5" y="695.1" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">成否に関係なく順に実行</text>
<rect x="570.5" y="699.0" width="257.8" height="16.7" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="699.0" width="2.5" height="16.7" fill="#0284c7"/>
<text x="576.5" y="711.0" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ &lt;コマンドA&gt;; &lt;コマンドB&gt;</text>
<text x="573.5" y="730.7" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">標準入力を引数にして実行</text>
<rect x="570.5" y="734.6" width="257.8" height="16.7" rx="3" fill="#f2f4f8"/>
<rect x="570.5" y="734.6" width="2.5" height="16.7" fill="#0284c7"/>
<text x="576.5" y="746.6" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ &lt;コマンド&gt; | xargs &lt;コマンド&gt;</text>
<text x="849.3" y="122.6" font-size="10.56" fill="#0284c7" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">xargs・連結（続き）</text>
<text x="849.3" y="138.0" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">{} の位置に引数を埋め込む</text>
<rect x="846.3" y="141.8" width="257.8" height="16.7" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="141.8" width="2.5" height="16.7" fill="#0284c7"/>
<text x="852.3" y="153.8" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ xargs -I {} &lt;コマンド&gt; {}</text>
<text x="849.3" y="173.5" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">空白を含むファイル名も安全に削除</text>
<rect x="846.3" y="177.4" width="257.8" height="31.5" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="177.4" width="2.5" height="31.5" fill="#0284c7"/>
<text x="852.3" y="189.4" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ find . -name &quot;*.bak&quot; -print0 |</text>
<text x="852.3" y="204.1" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">  xargs -0 rm -f</text>
<rect x="843.3" y="222.1" width="263.8" height="19.1" rx="4" fill="#ea580c"/>
<text x="850.3" y="235.9" font-size="12.65" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">プロセス</text>
<text x="849.3" y="255.7" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">全プロセス / 使用率をリアルタイムで</text>
<rect x="846.3" y="259.6" width="257.8" height="31.5" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="259.6" width="2.5" height="31.5" fill="#ea580c"/>
<text x="852.3" y="271.6" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ ps aux</text>
<text x="852.3" y="286.3" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ top</text>
<text x="849.3" y="306.0" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">バックグラウンドで実行 / ログアウト後も続ける</text>
<rect x="846.3" y="309.9" width="257.8" height="31.5" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="309.9" width="2.5" height="31.5" fill="#ea580c"/>
<text x="852.3" y="321.9" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ &lt;コマンド&gt; &amp;</text>
<text x="852.3" y="336.6" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ nohup &lt;コマンド&gt; &amp;</text>
<text x="849.3" y="356.3" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ジョブの一覧 / 前面へ / 背面で再開</text>
<rect x="846.3" y="360.2" width="257.8" height="46.2" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="360.2" width="2.5" height="46.2" fill="#ea580c"/>
<text x="852.3" y="372.2" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ jobs</text>
<text x="852.3" y="386.9" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ fg</text>
<text x="852.3" y="401.7" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ bg</text>
<text x="849.3" y="421.4" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">終了シグナルを送る / 名前でまとめて</text>
<rect x="846.3" y="425.2" width="257.8" height="31.5" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="425.2" width="2.5" height="31.5" fill="#ea580c"/>
<text x="852.3" y="437.2" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ kill &lt;PID&gt;</text>
<text x="852.3" y="452.0" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ pkill &lt;名前&gt;</text>
<text x="849.3" y="471.7" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">強制終了（後始末されない）</text>
<rect x="846.3" y="475.5" width="257.8" height="16.7" rx="3" fill="#fdecec"/>
<rect x="846.3" y="475.5" width="2.5" height="16.7" fill="#c81e1e"/>
<text x="852.3" y="487.5" font-size="11" fill="#c81e1e" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ kill -9 &lt;PID&gt;</text>
<text x="849.3" y="507.2" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">ポート 8080 を使っているプロセス</text>
<rect x="846.3" y="511.1" width="257.8" height="16.7" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="511.1" width="2.5" height="16.7" fill="#ea580c"/>
<text x="852.3" y="523.1" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ lsof -i :8080</text>
<rect x="843.3" y="541.0" width="263.8" height="19.1" rx="4" fill="#475569"/>
<text x="850.3" y="554.9" font-size="12.65" fill="#ffffff" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" font-weight="700">便利なワンライナー</text>
<text x="849.3" y="574.7" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">容量の大きいディレクトリ TOP10</text>
<rect x="846.3" y="578.6" width="257.8" height="16.7" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="578.6" width="2.5" height="16.7" fill="#475569"/>
<text x="852.3" y="590.6" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ du -sh ./* | sort -rh | head -n 10</text>
<text x="849.3" y="610.3" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">重複行を数えて多い順に</text>
<rect x="846.3" y="614.1" width="257.8" height="31.5" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="614.1" width="2.5" height="31.5" fill="#475569"/>
<text x="852.3" y="626.1" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ sort access.log | uniq -c | sort</text>
<text x="852.3" y="640.9" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">  -rn | head</text>
<text x="849.3" y="660.6" font-size="10.56" fill="#52606d" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">名前に一致するプロセスの数</text>
<rect x="846.3" y="664.4" width="257.8" height="31.5" rx="3" fill="#f2f4f8"/>
<rect x="846.3" y="664.4" width="2.5" height="31.5" fill="#475569"/>
<text x="852.3" y="676.4" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">$ ps aux | grep nginx | grep -v grep</text>
<text x="852.3" y="691.2" font-size="11" fill="#1f2933" font-family="Consolas, Menlo, 'Liberation Mono', 'Noto Sans Mono', monospace">  | wc -l</text>
<text x="16.0" y="780.0" font-size="8.5" fill="#9aa5b1" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif">Sirusita サンプル集 ・ A4 横（297×210mm）</text>
<text x="1107.0" y="780.0" font-size="8.5" fill="#9aa5b1" font-family="'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', Meiryo, 'Noto Sans CJK JP', sans-serif" text-anchor="end">man &lt;コマンド&gt; / &lt;コマンド&gt; --help で詳しい説明</text>
</svg>

## この画面の作り方

全体が 1 つの SVG（`viewBox="0 0 1123 794"` = A4 横を 96dpi で表した大きさ）です。座標を固定して描いているので、ウィンドウの幅が変わってもレイアウトは崩れず、拡大・縮小されるだけです。

- `<svg>` から `</svg>` までの間に**空行を入れない**でください。空行があると、そこでマークダウンの HTML として扱われなくなります。
- SVG の文字は自動で折り返されません。行を増やすときは `<text>` の `y` を 1 行分ずらして追加します。
- 図や文字の位置は `x` / `y`（左上が 0、右が x、下が y）で決まります。
- このメモは Sirusita のリポジトリの `scripts/cheatsheet/` で生成しています。
