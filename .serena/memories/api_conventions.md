# API設計規約

## エンドポイント形式
- ベースパス: `/api/v2/...`
- RESTful設計

## 認証
- HttpOnly Cookie + `credentials: 'include'`
- 認証必須エンドポイント: `authMiddleware`
- 認証任意エンドポイント: `optionalAuthMiddleware`

## バリデーション
- Zodスキーマによる入力検証必須
- バリデーションエラー: 422ステータス + フィールド別エラー

## レスポンス形式

### 成功時
```json
{
  "data": { ... },
  "message": "操作が完了しました"
}
```

### エラー時
```json
{
  "error": {
    "message": "エラーメッセージ",
    "code": "ERROR_CODE"
  }
}
```

## エラーハンドリング
- 401（認証）→ 日本語メッセージに変換、ログインページへリダイレクト
- 422（バリデーション）→ フィールド別エラー表示
- 500+（サーバー）→ 汎用エラーメッセージ

## 実装箇所
- フロントエンドエラー処理: `frontend/src/utils/apiErrorHandler.ts`
- バックエンドエラー処理: `hono-worker/src/middleware/error.ts`
