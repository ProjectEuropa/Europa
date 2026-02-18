---
description: ステージング環境にデプロイする
---

# ステージングデプロイ

// turbo-all
> [!NOTE]
> `// turbo-all` はAntiGravityワークフローのディレクティブで、全ステップを自動実行するためのフラグです。

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

3. フロントエンドのユニットテスト:
```bash
cd frontend && npm run test:run
```

4. フロントエンドのビルド確認:
```bash
cd frontend && npm run build
```

5. バックエンドのlint/format確認:
```bash
cd hono-worker && npm run check
```

6. バックエンドのTypeScript型チェック:
```bash
cd hono-worker && npx tsc --noEmit
```

7. バックエンドのユニットテスト:
```bash
cd hono-worker && npm run test:run
```

### デプロイフェーズ

8. バックエンドをStaging環境にデプロイ:
```bash
cd hono-worker && npm run deploy:staging
```

9. デプロイ結果を確認（ログやエラーがないか）

> **Note**: フロントエンド（Cloudflare Pages）はmasterブランチへのpushでgit連携により自動デプロイされます。バックエンド（hono-worker）は `npm run deploy:staging` で手動デプロイです。

## 注意
- 環境変数（DATABASE_URL, JWT_SECRET等）がStaging環境に設定済みであること
- R2バケットがStaging用に設定済みであること
- CORS originsが正しく設定されていること
