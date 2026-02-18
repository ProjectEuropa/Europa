---
description: ステージング環境にデプロイする
---

# ステージングデプロイ

// turbo-all

## 手順

### 検証フェーズ

1. バックエンドのlint/format確認:
```bash
cd hono-worker && npm run check
```

2. バックエンドのユニットテスト:
```bash
cd hono-worker && npm run test:run
```

3. フロントエンドのビルド確認:
```bash
cd frontend && npm run build
```

### デプロイフェーズ

4. バックエンドをStaging環境にデプロイ:
```bash
cd hono-worker && npm run deploy:staging
```

5. デプロイ結果を確認（ログやエラーがないか）

> **Note**: フロントエンド（Cloudflare Pages）はgit連携による自動デプロイです。stagingブランチへのpushで自動的にデプロイされます。

## 注意
- 環境変数（DATABASE_URL, JWT_SECRET等）がStaging環境に設定済みであること
- R2バケットがStaging用に設定済みであること
- CORS originsが正しく設定されていること
