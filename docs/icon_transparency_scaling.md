# アイコンの透過とスケールアップ方法

## 現在のアイコンサイズ
- icon16.png: 16x16
- icon48.png: 48x48
- icon128.png: 128x128 (実際は1024x1024)

## 方法1: ImageMagick (コマンドライン)

### 背景を透過させる
```bash
# 白背景を透過に変換
convert icon128.png -transparent white icon128_transparent.png

# より精密な透過処理（白に近い色も透過）
convert icon128.png -fuzz 10% -transparent white icon128_transparent.png
```

### スケールアップ（高品質）
```bash
# 128x128 から 512x512 へ
convert icon128.png -resize 512x512 -filter Lanczos icon512.png

# 透過とスケールを同時に
convert icon128.png -transparent white -resize 512x512 -filter Lanczos icon512_transparent.png
```

### すべてのサイズを一度に生成
```bash
# 元画像から全サイズ生成（透過付き）
for size in 16 48 128 256 512; do
  convert icon128.png -transparent white -resize ${size}x${size} -filter Lanczos icon${size}_transparent.png
done
```

## 方法2: GIMP (GUI)

1. **透過処理**:
   - ファイル → 開く → icon128.png
   - レイヤー → 透明部分 → アルファチャンネルを追加
   - ツール → 選択ツール → 色域を選択
   - 白い背景をクリック
   - Delete キーで削除
   - ファイル → エクスポート → PNG

2. **スケールアップ**:
   - 画像 → 画像の拡大・縮小
   - 補間方法: キュービック（最高品質）
   - サイズ指定して拡大

## 方法3: オンラインツール

### 透過処理
1. **Remove.bg** - https://www.remove.bg/
   - 自動で背景除去（AIベース）
   
2. **Online PNG Tools** - https://onlinepngtools.com/create-transparent-png
   - 色を指定して透過

### スケールアップ
1. **waifu2x** - http://waifu2x.udp.jp/
   - AIベースの高品質アップスケーリング
   - ノイズ除去オプションあり

2. **Bigjpg** - https://bigjpg.com/
   - 最大16倍まで拡大可能
   - アイコンに最適

## 方法4: Inkscape でベクター化してからスケール

```bash
# PNGをSVGに変換（トレース）
inkscape icon128.png --export-type=svg --export-filename=icon_vector.svg

# SVGから任意のサイズのPNGを生成
inkscape icon_vector.svg -w 512 -h 512 -o icon512.png --export-background-opacity=0
```

## Chrome Web Store 推奨サイズ

### 必須
- 128x128 (ストアアイコン)

### オプション（プロモーション用）
- 440x280 (小タイル)
- 920x680 (大タイル)  
- 1400x560 (マーキータイル)

## 推奨手順

1. **まず icon128.png を透過処理**
   ```bash
   convert icon128.png -fuzz 5% -transparent white icon128_transparent.png
   ```

2. **必要なサイズを生成**
   ```bash
   # 拡張機能用
   convert icon128_transparent.png -resize 16x16 icon16.png
   convert icon128_transparent.png -resize 48x48 icon48.png
   
   # 高解像度版（オプション）
   convert icon128_transparent.png -resize 256x256 -filter Lanczos icon256.png
   convert icon128_transparent.png -resize 512x512 -filter Lanczos icon512.png
   ```

3. **品質確認**
   - 各サイズで輪郭がシャープか確認
   - 透過部分に白い縁が残っていないか確認

## 注意点
- PNG形式で保存（透過サポート）
- アンチエイリアスを有効にして滑らかに
- 小さいサイズ（16x16）は別途最適化が必要な場合あり