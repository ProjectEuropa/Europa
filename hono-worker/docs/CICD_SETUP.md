# CI/CD セットアップガイド

このドキュメントでは、Hono WorkerのCI/CDパイプラインのセットアップ方法を説明します。

## 📋 概要

Hono WorkerのCI/CDは以下の3つのワークフローで構成されています：

1. **Backend CI** (`.github/workflows/backend-ci.yml`)
   - Lint、テスト、型チェックを実行
   - PRとpushの両方で実行

2. **Hono Worker Deploy** (`.github/workflows/hono-worker-deploy.yml`)
   - Cloudflare Workersへのデプロイを実行
   - Staging環境への自動デプロイとProduction環境への手動デプロイに対応

## 🔧 必要な GitHub Secrets

以下のシークレットをGitHubリポジトリに設定する必要があります：

### 必須シークレット

| シークレット名 | 説明 | 取得方法 |
|-------------|------|---------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API トークン | Cloudflareダッシュボード > My Profile > API Tokens > Create Token |
| `CLOUDFLARE_ACCOUNT_ID` | CloudflareアカウントID | Cloudflareダッシュボード > Workers & Pages > Overview (右サイドバー) |

### オプショナル（通知用）

| シークレット名 | 説明 |
|-------------|------|
| `SLACK_WEBHOOK` | Slack通知用のWebhook URL |
| `CODECOV_TOKEN` | Codecovカバレッジレポート用トークン |

## 🔑 Cloudflare API Token の作成

### ステップ 1: Cloudflareダッシュボードにログイン

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にアクセス
2. アカウントにログイン

### ステップ 2: API Tokenを作成

1. 右上のプロフィールアイコンをクリック
2. **My Profile** を選択
3. 左メニューから **API Tokens** を選択
4. **Create Token** をクリック

### ステップ 3: カスタムトークンを設定

**Option 1: テンプレートを使用（推奨）**

1. "Edit Cloudflare Workers" テンプレートを選択
2. **Use template** をクリック

**Option 2: カスタム設定**

以下の権限を設定：

| 設定項目 | 値 |
|---------|---|
| Permissions | Account > Cloudflare Workers Scripts > Edit |
| Permissions | Account > Account Settings > Read |
| Permissions | Zone > Workers Routes > Edit (カスタムドメイン使用時) |
| Account Resources | Include > 対象のアカウント |
| Zone Resources | Include > 対象のゾーン（カスタムドメイン使用時） |

### ステップ 4: トークンを保存

1. **Continue to summary** をクリック
2. **Create Token** をクリック
3. 表示されたトークンを**安全な場所にコピー**（一度しか表示されません）

## 🔍 Cloudflare Account ID の確認

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にログイン
2. **Workers & Pages** を選択
3. 右サイドバーに **Account ID** が表示されます
4. コピーボタンをクリックしてIDをコピー

## 📝 GitHub Secrets の設定

### ステップ 1: リポジトリ設定にアクセス

1. GitHubリポジトリページを開く
2. **Settings** タブをクリック
3. 左メニューから **Secrets and variables** > **Actions** を選択

### ステップ 2: シークレットを追加

1. **New repository secret** をクリック
2. 以下のシークレットを追加：

```
Name: CLOUDFLARE_API_TOKEN
Secret: [作成したAPIトークン]
```

```
Name: CLOUDFLARE_ACCOUNT_ID
Secret: [CloudflareアカウントID]
```

## 🚀 デプロイワークフロー

### Staging環境への自動デプロイ

- **トリガー**: `master` ブランチへのpush
- **条件**: `hono-worker/` ディレクトリに変更がある場合
- **環境**: Staging (`pre.project-europa.work`)

```bash
git push origin master
# 自動的にStagingにデプロイされます
```

### Production環境への手動デプロイ

1. GitHubリポジトリページを開く
2. **Actions** タブをクリック
3. **Hono Worker Deploy** ワークフローを選択
4. **Run workflow** をクリック
5. 環境を選択:
   - **staging**: Staging環境
   - **production**: Production環境
6. **Run workflow** を実行

## 🏗️ ワークフローの構成

### 1. Pre-deployment checks

- 依存関係のインストール
- Lintチェック
- テスト実行
- 型チェック

### 2. Deploy

- Cloudflare Workersへデプロイ
- 環境変数の設定
- R2バケットのバインディング

### 3. Post-deployment

- ヘルスチェック（APIエンドポイントの疎通確認）
- デプロイ成功の確認

### 4. Notification

- Slackへの通知（エラー時）

## 🔐 Cloudflare Secrets の設定

以下のシークレットはCloudflare側で設定する必要があります：

```bash
# JWT Secret
wrangler secret put JWT_SECRET --env staging
wrangler secret put JWT_SECRET --env production

# Database URL
wrangler secret put DATABASE_URL --env staging
wrangler secret put DATABASE_URL --env production
```

### JWT_SECRET の生成

```bash
# ランダムな32文字の文字列を生成
openssl rand -base64 32
```

### DATABASE_URL の形式

```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

## 📊 環境設定

### Staging環境

- **Worker名**: `hono-worker` (デフォルト)
- **URL**: `https://pre.project-europa.work`
- **R2 Bucket**: `europa-files-stg`
- **Frontend URL**: `https://pre.project-europa.work`

### Production環境

- **Worker名**: `hono-worker-prod`
- **URL**: `https://project-europa.work`
- **R2 Bucket**: `europa-files-prod`
- **Frontend URL**: `https://project-europa.work`

## 🧪 ローカルテスト

デプロイ前にローカルでテストすることを推奨します：

```bash
cd hono-worker

# 依存関係のインストール
npm install

# Lintチェック
npm run lint

# テスト実行
npm run test:run

# 型チェック
npx tsc --noEmit

# ローカル開発サーバー起動
npm run dev
```

## 📈 モニタリング

### Cloudflare ダッシュボード

デプロイ後、以下の情報をCloudflareダッシュボードで確認できます：

1. **Workers & Pages** > 対象のWorkerを選択
2. 以下のメトリクスを確認：
   - リクエスト数
   - エラー率
   - レスポンスタイム
   - CPU使用時間

### GitHub Actions

- **Actions** タブでワークフローの実行履歴を確認
- デプロイログの確認
- エラーの詳細確認

## 🔄 ロールバック

問題が発生した場合、以前のバージョンにロールバックできます：

### 方法1: 以前のコミットから再デプロイ

```bash
# 以前のコミットをチェックアウト
git checkout [commit-hash]

# 手動でワークフローを実行
# GitHub Actions > Hono Worker Deploy > Run workflow
```

### 方法2: Cloudflareダッシュボードから

1. **Workers & Pages** > 対象のWorkerを選択
2. **Deployments** タブを開く
3. 以前のデプロイメントを選択
4. **Rollback to this deployment** をクリック

## ⚠️ トラブルシューティング

### デプロイが失敗する

**症状**: ワークフローが失敗する

**確認事項**:
1. GitHub Secretsが正しく設定されているか
2. Cloudflare API Tokenの権限が適切か
3. Cloudflare Account IDが正しいか
4. wrangler.tomlの設定が正しいか

### ヘルスチェックが失敗する

**症状**: デプロイは成功するがヘルスチェックで失敗

**確認事項**:
1. Cloudflare Secretsが設定されているか（JWT_SECRET、DATABASE_URL）
2. データベース接続が正しいか
3. R2バケットが存在するか
4. カスタムドメインのDNS設定が正しいか

### APIトークンのエラー

**症状**: "Authentication error" や "Invalid API Token"

**対処法**:
1. Cloudflareで新しいAPIトークンを作成
2. 必要な権限が付与されているか確認
3. GitHub Secretsを更新

## 📚 関連ドキュメント

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Hono Documentation](https://hono.dev/)

## 🆘 サポート

問題が解決しない場合は、以下を確認してください：

1. GitHub Actionsのログを確認
2. Cloudflare Workersのログを確認（Real-time Logs機能）
3. ドキュメントを再確認
4. チームに相談
