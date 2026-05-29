# UI_test

GitHub Pages で公開できる、1ページ構成の「画面操作UIのモックアップ」です。実際のカメラ接続は行わず、サンプルの風景画像をカメラ映像に見立てて、キーボード操作で表示中心の移動と拡大縮小を体験できます。

## 機能

- 日本語表記の遠隔カメラ操作UI
- 工場・遠隔操作・カメラUI・プロトタイプ感のあるデザイン
- カメラ映像ウインドウ内に風景画像を表示
- キーボード操作による表示中心の移動
- Enter / Shift + Enter によるズームイン・ワイド表示
- Escape による初期位置リセット
- 現在倍率、中心位置、最終操作のステータス表示
- レスポンシブ対応
- GitHub Actions による GitHub Pages デプロイ
- Docker / Docker Compose によるローカル開発

## 技術構成

- Vite
- Vanilla TypeScript
- CSS
- Docker / Docker Compose
- GitHub Actions / GitHub Pages

## セットアップ

Node.js 20 以上を推奨します。

```bash
make install
```

## ローカル起動

```bash
make dev
```

起動後、ブラウザで以下を開きます。

```text
http://localhost:5173/
```

## Docker で起動

```bash
docker compose up --build
```

起動後、ブラウザで以下を開きます。

```text
http://localhost:5173/
```

## 操作方法

| キー          | 操作                           |
| ------------- | ------------------------------ |
| ↑             | 表示中心を上に移動             |
| ↓             | 表示中心を下に移動             |
| ←             | 表示中心を左に移動             |
| →             | 表示中心を右に移動             |
| Enter         | ズームイン                     |
| Shift + Enter | ワイド表示、つまりズームアウト |
| Escape        | 初期位置に戻す                 |

矢印キー操作時は、ブラウザのスクロールが発生しないように制御しています。

## ビルド

```bash
make build
```

成果物は `dist/` に出力されます。

## プレビュー

```bash
make preview
```

起動後、ブラウザで以下を開きます。

```text
http://localhost:4173/
```

## Lint / Format

TypeScript の型チェックを実行します。

```bash
make lint
```

Prettier で整形します。

```bash
make format
```

## クリーンアップ

```bash
make clean
```

`node_modules` と `dist` を削除します。

## GitHub Pages へのデプロイ

`.github/workflows/deploy.yml` に GitHub Actions workflow を用意しています。

main ブランチへ push すると、以下の流れで GitHub Pages へデプロイされます。

1. `actions/checkout@v4` でソースを取得
2. `actions/setup-node@v4` で Node.js 20 をセットアップ
3. `npm ci` で依存関係をインストール
4. `npm run build` で静的ファイルを生成
5. `actions/configure-pages@v5` で Pages を設定
6. `actions/upload-pages-artifact@v3` で `dist` をアップロード
7. `actions/deploy-pages@v4` で `github-pages` environment にデプロイ

Vite の `base` は `./` に設定しているため、リポジトリ名配下の GitHub Pages でもアセットパスが壊れにくい構成です。
