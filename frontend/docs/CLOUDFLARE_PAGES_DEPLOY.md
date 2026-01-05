# Cloudflare Pages デプロイ手順

## 概要

Next.jsフロントエンドをCloudflare Pagesにデプロイする手順です。

## 前提条件

- Cloudflareアカウント
- GitHubリポジトリへのアクセス
- Node.js 22.15.1以上

## 1. 必要な環境変数

フロントエンドで使用する環境変数：

### 必須

```bash
# バックエンドAPIのURL
NEXT_PUBLIC_API_BASE_URL=https://your-worker.workers.dev
```

### オプション（ステージング環境でBasic認証が必要な場合）

```bash
NEXT_PUBLIC_BASIC_AUTH_USER=your-username
NEXT_PUBLIC_BASIC_AUTH_PASSWORD=your-password
```

## 2. Cloudflare Pagesプロジェクトの作成

### 2.1 Cloudflare Dashboardにアクセス

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にログイン
2. 左側メニューから **「Workers & Pages」** を選択
3. **「Create application」** ボタンをクリック
4. **「Pages」** タブを選択
5. **「Connect to Git」** を選択

### 2.2 GitHubリポジトリと連携

1. **「Connect GitHub」** をクリック
2. リポジトリへのアクセスを許可
3. デプロイしたいリポジトリを選択
4. **「Begin setup」** をクリック

### 2.3 ビルド設定

以下の設定を入力：

```
Project name: europa-frontend-staging (または任意の名前)
Production branch: main (または master)
Framework preset: Next.js
Build command: npx @cloudflare/next-on-pages
Build output directory: .vercel/output/static
Root directory: frontend
```

> **注意**: このビルド設定を機能させるには、`frontend/next.config.ts` ファイルで `output: 'export'` が設定されている必要があります。

#### 環境変数の設定

**「Environment variables」** セクションで以下を追加：

##### ステージング環境（Preview）

```
NEXT_PUBLIC_API_BASE_URL = https://hono-worker.<your-subdomain>.workers.dev
NODE_VERSION = 22.15.1
```

Basic認証が必要な場合は追加：

```
NEXT_PUBLIC_BASIC_AUTH_USER = your-username
NEXT_PUBLIC_BASIC_AUTH_PASSWORD = your-password
```

### 2.4 デプロイ

1. **「Save and Deploy」** をクリック
2. 初回ビルドが開始される
3. ビルド完了後、デプロイされたURLが表示される

## 3. カスタムドメインの設定（オプション）

### 3.1 ドメインの追加

1. Cloudflare Pages のプロジェクトページを開く
2. **「Custom domains」** タブを選択
3. **「Set up a custom domain」** をクリック
4. ドメイン名を入力（例：`stg.project-europa.work`）
5. DNSレコードが自動で設定される

### 3.2 DNS確認

Cloudflareで管理しているドメインの場合、自動的にCNAMEレコードが追加されます。

## 4. 環境別の設定

### 4.1 プロダクション環境

本番環境用の環境変数を設定：

```
NEXT_PUBLIC_API_BASE_URL = https://api.project-europa.work
NODE_VERSION = 22.15.1
```

### 4.2 プレビュー環境（ブランチごと）

プルリクエストごとに自動でプレビュー環境が作成されます。

## 5. バックエンドURLの更新

フロントエンドをデプロイした後、バックエンド（hono-worker）の`FRONTEND_URL`を更新：

```bash
cd hono-worker

# ステージング環境
npx wrangler secret put FRONTEND_URL --env staging
# プロンプトで入力: https://pre.project-europa.work

# 本番環境
npx wrangler secret put FRONTEND_URL --env production
# プロンプトで入力: https://www.project-europa.work
```

または、`wrangler.toml`の`vars`を更新：

```toml
[env.staging]
vars = { 
  ENVIRONMENT = "staging", 
  API_VERSION = "v2", 
  LOG_LEVEL = "debug", 
  FRONTEND_URL = "https://pre.project-europa.work"
}
```

変更後、再デプロイ：

```bash
npx wrangler deploy --env staging
```

## 6. デプロイの確認

### 6.1 デプロイステータス

1. Cloudflare Pagesのプロジェクトページで **「Deployments」** を確認
2. ビルドログを確認
3. デプロイが成功したら、URLをクリックして確認

### 6.2 動作確認

1. デプロイされたURLにアクセス
2. ログイン機能を試す
3. ブラウザのコンソールでAPIリクエストを確認
4. バックエンドとの通信を確認

## 7. トラブルシューティング

### 問題1: ビルドエラー

**エラー例:**
```
Error: Command failed with exit code 1: npx @cloudflare/next-on-pages
```

**解決策:**

1. `Node.js`のバージョンを確認
   ```
   NODE_VERSION = 22.15.1
   ```

2. ビルドコマンドを確認
   ```
   npx @cloudflare/next-on-pages
   ```

3. `Root directory`が`frontend`になっているか確認

### 問題2: APIリクエストが失敗する

**エラー例:**
```
Failed to fetch
CORS error
```

**解決策:**

1. `NEXT_PUBLIC_API_BASE_URL`が正しく設定されているか確認
2. バックエンドの`FRONTEND_URL`が正しく設定されているか確認
3. バックエンドのCORS設定を確認

### 問題3: 環境変数が反映されない

**原因:**
- Next.jsでは`NEXT_PUBLIC_`プレフィックスが必要
- ビルド時に環境変数が埋め込まれる

**解決策:**

1. 環境変数名に`NEXT_PUBLIC_`プレフィックスを付ける
2. 環境変数を変更した後、再デプロイする（**「Retry deployment」**）

### 問題4: Pages Functions でエラー

**エラー例:**
```
Error: Dynamic server usage
```

**解決策:**

`next.config.ts`に以下を追加：

```typescript
const nextConfig = {
  output: 'export', // 静的エクスポート
  images: {
    unoptimized: true, // Cloudflare Pages では画像最適化を無効化
  },
};
```

**注意:** 現在の設定では不要ですが、必要に応じて追加してください。

## 8. CI/CD パイプライン

Cloudflare Pagesは自動的にCI/CDを提供：

- **main/master ブランチ** → 本番環境に自動デプロイ
- **その他のブランチ** → プレビュー環境に自動デプロイ
- **プルリクエスト** → プレビュー環境のURLがコメントで追加される

## 9. 参考リンク

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [@cloudflare/next-on-pages](https://github.com/cloudflare/next-on-pages)
- [Cloudflare Pages GitHub Integration](https://developers.cloudflare.com/pages/get-started/git-integration/)

## 10. デプロイ前チェックリスト

- [ ] GitHubリポジトリがCloudflareに連携されている
- [ ] ビルド設定が正しい（コマンド、出力ディレクトリ、ルートディレクトリ）
- [ ] 環境変数が設定されている（`NEXT_PUBLIC_API_BASE_URL`など）
- [ ] Node.jsバージョンが指定されている（`NODE_VERSION=22.15.1`）
- [ ] バックエンドの`FRONTEND_URL`が更新されている
- [ ] カスタムドメイン設定（必要な場合）
- [ ] デプロイ後に動作確認
