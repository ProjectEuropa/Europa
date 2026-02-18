# 開発時の注意点（よくあるハマりポイント）

## CORS設定
- **症状**: ブラウザでCORSエラー
- **原因**: ALLOWED_ORIGINS環境変数の設定漏れ
- **解決**: `hono-worker/.dev.vars` に `ALLOWED_ORIGINS=http://localhost:3000` を追加
- **本番**: Cloudflare Workers環境変数で設定

## Cookie送信
- **症状**: 認証が効かない、401エラー
- **原因**: `credentials: 'include'` の指定漏れ
- **解決**: fetch/axios呼び出しに `credentials: 'include'` を追加
- **参照**: `frontend/src/lib/api/client.ts`

## SameSite Cookie
- **症状**: 本番環境でCookieが送信されない
- **原因**: SameSite=Lax（開発用設定）のまま
- **解決**: 本番では `SameSite=None; Secure` を使用

## E2Eテスト
- **Page Object Model**: `frontend/e2e/pages/` にPOMパターンを適用
- **ロケータ**: セマンティックロケータ（`getByRole`, `getByLabel`）を優先、`data-testid` は補助的に使用
- **非同期待機**: `waitFor` / `toBeVisible` を適切に使用
- **認証状態**: HttpOnly Cookie のため `storageState` 単体では不十分。テスト前にログインAPIを実行してCookieを取得する

## 型定義
- フロントエンド/バックエンドでZodスキーマを共有していない
- 両方のスキーマを同期させる必要あり

## 環境変数
- フロントエンド: `.env.local`（NEXT_PUBLIC_プレフィックス必須）
  - 例: `NEXT_PUBLIC_API_URL=http://localhost:8787`
- バックエンド: `.dev.vars`（ローカル）、Cloudflare Dashboard（本番）
  - 例: `DATABASE_URL=postgresql://...`, `ALLOWED_ORIGINS=http://localhost:3000`
