---
description: ステージング環境にデプロイする
---

# ステージングデプロイ

// turbo-all
<!-- 上記はAntiGravityワークフローの自動実行ディレクティブです -->

## 手順

### 検証フェーズ

1. フロントエンドのlint/format確認:
```bash
cd frontend && npm run check
```

2. フロントエンドのTypeScript型チェック:
```bash
cd frontend && npm run type-check
```

3. フロントエンドのビルド確認:
```bash
cd frontend && npm run build
```

4. バックエンドのlint/format確認:
```bash
cd hono-worker && npm run check
```

5. バックエンドのユニットテスト:
```bash
cd hono-worker && npm run test:run
```

### デプロイフェーズ

6. バックエンドをStaging環境にデプロイ:
```bash
cd hono-worker && npm run deploy:staging
```

7. フロントエンドをStagingブランチにプッシュ（Cloudflare Pages自動デプロイ）:
```bash
git push origin staging
```

8. デプロイ結果を確認（ログやエラーがないか）

> **Note**: フロントエンド（Cloudflare Pages）はgit連携による自動デプロイです。stagingブランチへのpushで自動的にデプロイされます。

## 注意
- 環境変数（DATABASE_URL, JWT_SECRET等）がStaging環境に設定済みであること
- R2バケットがStaging用に設定済みであること
- CORS originsが正しく設定されていること
