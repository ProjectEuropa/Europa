---
description: 新しいAPIエンドポイントを作成する
---

# 新APIエンドポイント作成

// turbo-all

## 手順

1. `hono-worker/src/routes/` にルートファイルを作成または追加
2. `hono-worker/src/index.ts` でルートを登録
3. Zodバリデーションスキーマを `hono-worker/src/utils/validation.ts` に追加
4. 必要なら型定義を `hono-worker/src/types/api.ts` に追加
5. Vitest テストを作成

## 規約
- エンドポイント形式: `/api/v2/...`
- レスポンス: `{ data?: T, message?: string }`（成功）/ `{ message: string, errors?: {...} }`（エラー）
- `hono-worker/CLAUDE.md` のコーディング規約に従う
- Zodでリクエストバリデーション必須
- パラメータ化クエリ使用（SQLインジェクション防止）

## 確認コマンド
// turbo
```bash
cd /Users/masato/Desktop/spa-auth/Europa/hono-worker && npm run check:fix
```
