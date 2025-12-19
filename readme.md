# Project Europa

このリポジトリは、Cloudflare Workers (Hono) バックエンドとNext.jsフロントエンドで構成されるProject Europaのコードベースを含んでいます。

## 環境構築手順

### 技術スタック

#### バックエンド (hono-worker)
*   **Cloudflare Workers:** サーバーレス実行環境
*   **Hono:** 軽量Webフレームワーク (v4.4.0)
*   **Neon:** サーバーレスPostgreSQLデータベース
*   **R2:** Cloudflareオブジェクトストレージ

#### フロントエンド
*   **Next.js:** 15.x (frontendディレクトリにあります)
*   **React:** 19.x
*   **TailwindCSS:** 4.x
*   **shadcn/ui:** UIコンポーネント

### セットアップ

#### 1. hono-workerのセットアップ

```bash
cd hono-worker
npm install
```

環境変数の設定（`wrangler.toml`と`.dev.vars`を適切に設定）

開発サーバーの起動:
```bash
npm run dev
```

デプロイ:
```bash
# ステージング環境
npm run deploy:staging

# 本番環境
npm run deploy:production
```

#### 2. フロントエンドのセットアップ

```bash
cd frontend
npm install
```

開発サーバーの起動:
```bash
npm run dev
```
(通常、`http://localhost:3002` で起動します)

本番ビルド:
```bash
npm run build
```

### 開発用コマンド

#### hono-worker
*   `npm run dev` - 開発サーバー起動
*   `npm run test` - テスト実行
*   `npm run lint` - Lintチェック
*   `npm run format` - コードフォーマット
*   `npm run check:fix` - Lint + Format実行

#### frontend
*   `npm run dev` - 開発サーバー起動（Turbopack）
*   `npm run build` - 本番ビルド
*   `npm run test` - ユニットテスト実行
*   `npm run test:e2e` - E2Eテスト実行（Playwright）
*   `npm run lint` - Lintチェック
*   `npm run format` - コードフォーマット
*   `npm run type-check` - TypeScriptの型チェック
