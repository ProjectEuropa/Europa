---
description: ステージング環境にデプロイする
---

# ステージングデプロイ

// turbo-all

## 手順

1. バックエンドのビルド確認:
```bash
cd hono-worker && npm run check:fix
```

2. バックエンドをStaging環境にデプロイ:
```bash
cd hono-worker && npm run deploy:staging
```

3. フロントエンドのビルド確認:
```bash
cd frontend && npm run build
```

4. デプロイ結果を確認（ログやエラーがないか）

## 注意
- 環境変数（DATABASE_URL, JWT_SECRET等）がStaging環境に設定済みであること
- R2バケットがStaging用に設定済みであること
- CORS originsが正しく設定されていること
