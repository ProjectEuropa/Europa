---
description: 本番環境にデプロイする
---

# 本番デプロイ

<!-- turbo-allは意図的に省略: 本番デプロイはユーザー確認が必須のため、各ステップを手動実行する -->

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

4. フロントエンドのビルド:
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

8. **ユーザーに確認**: 本番デプロイしてよいか確認を取る

9. バックエンドをProduction環境にデプロイ:
```bash
cd hono-worker && npm run deploy:production
```

10. デプロイ結果を確認

> **Note**: フロントエンド（Cloudflare Pages）はmasterブランチへのpushでgit連携により自動デプロイされます。バックエンド（hono-worker）は `npm run deploy:production` で手動デプロイです。

## 注意
- **必ずユーザーの明示的な許可を得てからデプロイすること**
- 環境変数が本番環境に正しく設定されていること
- Discord関連のシークレットも設定されていること（Discord連携使用時）
