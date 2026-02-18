# 認証設計判断

## 選定: JWT + HttpOnly Cookie

### 選定理由
1. **XSS対策**: HttpOnly属性によりJavaScriptからトークンにアクセス不可
2. **トークン漏洩防止**: localStorageに保存しないため、XSS攻撃でもトークン窃取されない
3. **自動送信**: ブラウザがCookieを自動送信するため、フロントエンドの実装がシンプル

### 環境別設定
- **Production/Staging**: `SameSite=None; Secure`（クロスオリジン対応）
- **Development**: `SameSite=Lax`（localhost cross-port対応）

### 実装箇所
- バックエンド:
  - `hono-worker/src/middleware/auth.ts` - JWT検証ミドルウェア
  - `hono-worker/src/utils/jwt.ts` - JWT生成・検証ユーティリティ
  - `hono-worker/src/routes/auth.ts` - 認証エンドポイント（/api/v2/auth/login, /register, /logout等）
- フロントエンド: `frontend/src/stores/authStore.ts`（トークンは保存しない、user情報のみ）

### 重要な実装詳細
- フロントエンドAPI呼び出しは必ず `credentials: 'include'` を指定
- JWT有効期限: 7日間
- パスワードハッシュ: bcryptjs
