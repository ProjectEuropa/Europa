---
description: 本番環境にデプロイする
---

# 本番デプロイ

## 手順

1. 全テスト実行:
```bash
cd frontend && npm run ci
```

2. バックエンドのチェック:
```bash
cd hono-worker && npm run check:fix
```

3. バックエンドのテスト:
// turbo
```bash
cd hono-worker && npm run test:run
```

4. **ユーザーに確認**: 本番デプロイしてよいか確認を取る

5. バックエンドをProduction環境にデプロイ:
```bash
cd hono-worker && npm run deploy:production
```

6. デプロイ結果を確認

## 注意
- **必ずユーザーの明示的な許可を得てからデプロイすること**
- 環境変数が本番環境に正しく設定されていること
- Discord関連のシークレットも設定されていること（Discord連携使用時）
