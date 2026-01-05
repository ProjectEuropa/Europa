# Hono Worker Development Guide

## Project Structure

```
src/
├── index.ts           # メインアプリケーション（Honoインスタンス）
├── middleware/        # ミドルウェア
│   ├── auth.ts       # JWT認証
│   ├── cors.ts       # CORS設定
│   └── error.ts      # エラーハンドリング
├── routes/            # APIルート
│   ├── auth.ts       # 認証エンドポイント
│   ├── events.ts     # イベント管理
│   └── files.ts      # ファイル管理
├── types/             # 型定義
│   ├── api.ts        # APIレスポンス・リクエスト型
│   └── bindings.ts   # Cloudflare Workers環境変数型
├── utils/             # ユーティリティ
│   ├── validation.ts # Zodスキーマ
│   ├── jwt.ts        # JWT生成・検証
│   ├── password.ts   # パスワードハッシング
│   ├── email.ts      # メール送信（Resend）
│   └── query-builder.ts # SQLクエリビルダー
└── db/
    └── schema.sql    # データベーススキーマ
```

## Technology Stack

| 技術 | バージョン | 用途 |
|-----|-----------|------|
| Hono | 4.x | サーバーレスWebフレームワーク |
| Cloudflare Workers | - | Edge Computing実行環境 |
| Neon PostgreSQL | - | サーバーレスDB |
| Cloudflare R2 | - | S3互換オブジェクトストレージ |
| Zod | 4.x | バリデーション |
| bcryptjs | 2.x | パスワードハッシング |
| Resend | 3.x | メール送信 |
| Biome | 2.x | Lint/Format |
| Vitest | 4.x | テストフレームワーク |

## Development Workflow

```bash
# 開発
npm run dev              # wrangler devでローカル開発

# コード品質
npm run check:fix        # Biome lint + format 自動修正

# テスト
npm run test:run         # Vitest単回実行
npm run test:coverage    # カバレッジ生成

# デプロイ
npm run deploy:staging   # Staging環境
npm run deploy:production # 本番環境
```

## API Design

### Endpoint Structure

```
/api/v2
├── /auth
│   ├── POST /register       # ユーザー登録
│   ├── POST /login          # ログイン
│   ├── POST /logout         # ログアウト
│   ├── GET  /me             # 自分の情報取得
│   └── POST /password/reset # パスワードリセット
├── /events
│   ├── GET  /               # イベント一覧（ページネーション）
│   ├── POST /               # イベント作成（認証必須）
│   └── GET  /:id            # イベント詳細
└── /files
    ├── GET    /             # ファイル一覧（フィルタリング）
    ├── POST   /             # ファイルアップロード
    ├── DELETE /:id          # ファイル削除
    └── GET    /:id/download # ファイルダウンロード
```

### Response Format

```typescript
// Success Response
interface SuccessResponse<T> {
  data?: T;
  message?: string;
}

// Error Response
interface ErrorResponse {
  message: string;
  errors?: { [field: string]: string[] };
}

// Pagination Response
interface PaginatedResponse<T> {
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  };
}
```

## Authentication

### JWT + HttpOnly Cookie

```typescript
// JWT Configuration
{
  algorithm: 'HS256',
  expiresIn: '7d',        // Default
  rememberMe: '30d',      // Remember Me option
}

// Cookie Settings
{
  httpOnly: true,
  secure: true,           // Production only
  sameSite: 'None',       // Production: None, Dev: Lax
  path: '/',
}
```

### Middleware

```typescript
// Required authentication
app.use('/api/v2/protected/*', authMiddleware);

// Optional authentication (user info if available)
app.use('/api/v2/public/*', optionalAuthMiddleware);
```

## Validation

### Zod Schemas

```typescript
// src/utils/validation.ts
export const registerSchema = z.object({
  name: z.string().min(1, '名前を入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
});
```

### Request Validation

```typescript
app.post('/api/v2/auth/register', async (c) => {
  const body = await c.req.json();
  const result = registerSchema.safeParse(body);

  if (!result.success) {
    throw new HTTPException(422, {
      message: 'Validation failed',
      cause: result.error.flatten().fieldErrors,
    });
  }

  // Process validated data
  const { name, email, password } = result.data;
});
```

## Error Handling

### Global Error Handler

```typescript
// src/index.ts
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({
      message: err.message,
      errors: err.cause,
    }, err.status);
  }

  console.error('[Error]', err);
  return c.json({ message: 'Internal Server Error' }, 500);
});
```

### HTTP Exception Usage

```typescript
import { HTTPException } from 'hono/http-exception';

// 401 Unauthorized
throw new HTTPException(401, { message: '認証が必要です' });

// 404 Not Found
throw new HTTPException(404, { message: 'リソースが見つかりません' });

// 422 Validation Error
throw new HTTPException(422, {
  message: 'Validation failed',
  cause: { email: ['既に使用されています'] },
});
```

## CORS Configuration

```typescript
// src/middleware/cors.ts
const allowedOrigins = {
  development: ['http://localhost:3000', 'http://localhost:3002'],
  staging: ['https://pre.project-europa.work'],
  production: ['https://project-europa.work'],
};

app.use('*', cors({
  origin: (origin) => {
    const env = c.env.ENVIRONMENT || 'development';
    return allowedOrigins[env].includes(origin) ? origin : null;
  },
  credentials: true,
}));
```

## Database

### Neon PostgreSQL Connection

```typescript
import { neon } from '@neondatabase/serverless';

const sql = neon(c.env.DATABASE_URL);

// Parameterized query (SQL injection safe)
const users = await sql`
  SELECT * FROM users WHERE email = ${email}
`;
```

### Schema

```sql
-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Files
CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  upload_user_id INTEGER REFERENCES users(id),
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER,
  data_type VARCHAR(1) NOT NULL,  -- '1': Team, '2': Match
  delete_password VARCHAR(255),    -- For anonymous uploads
  downloadable_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags (normalized)
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  tag_name VARCHAR(100) UNIQUE NOT NULL
);

-- File-Tag relationship
CREATE TABLE file_tags (
  file_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (file_id, tag_id)
);
```

## File Storage (R2)

### Configuration

```toml
# wrangler.toml
[[r2_buckets]]
binding = "FILES_BUCKET"
bucket_name = "europa-files-prod"
```

### Usage

```typescript
// Upload
await c.env.FILES_BUCKET.put(key, file, {
  httpMetadata: { contentType: file.type },
});

// Download
const object = await c.env.FILES_BUCKET.get(key);
if (!object) {
  throw new HTTPException(404, { message: 'File not found' });
}

return new Response(object.body, {
  headers: { 'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream' },
});

// Delete
await c.env.FILES_BUCKET.delete(key);
```

## Password Management

### Bcrypt Hashing

```typescript
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

// Hash password
const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

// Verify password
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

### Legacy SHA-256 Support

```typescript
// For backward compatibility during migration
import { createHash } from 'crypto';

const sha256Hash = createHash('sha256').update(password).digest('hex');
```

## Environment Configuration

### wrangler.toml

```toml
[env.staging]
name = "hono-worker-stg"
vars = { ENVIRONMENT = "staging", LOG_LEVEL = "debug" }

[[env.staging.r2_buckets]]
binding = "FILES_BUCKET"
bucket_name = "europa-files-stg"

[env.production]
name = "hono-worker-prod"
vars = { ENVIRONMENT = "production", LOG_LEVEL = "info" }

[[env.production.r2_buckets]]
binding = "FILES_BUCKET"
bucket_name = "europa-files-prod"
```

### Secrets (via wrangler secret)

```bash
# Set secrets
wrangler secret put DATABASE_URL --env production
wrangler secret put JWT_SECRET --env production
wrangler secret put RESEND_API_KEY --env production
```

| Secret | Description |
|--------|-------------|
| DATABASE_URL | Neon PostgreSQL接続文字列 |
| JWT_SECRET | JWT署名キー（≥32文字推奨） |
| RESEND_API_KEY | メール送信APIキー |
| RESEND_FROM_EMAIL | 送信元メールアドレス |

## Coding Standards

### Biome Settings

- インデント: 4スペース
- 行幅: 100文字
- セミコロン: 常に付与
- クォート: シングル
- any: 禁止（理由コメント必須）

### Security Rules

```typescript
// ✅ Good: Parameterized query
const users = await sql`SELECT * FROM users WHERE id = ${userId}`;

// ❌ Bad: String concatenation (SQL injection risk)
const users = await sql("SELECT * FROM users WHERE id = " + userId);

// ✅ Good: Zod validation
const data = schema.safeParse(input);

// ✅ Good: bcrypt for passwords
const hashed = await bcrypt.hash(password, 10);
```

## Testing

### Vitest Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      include: ['src/**/*.ts'],
      exclude: ['**/*.test.ts', 'src/types/', 'src/index.ts'],
    },
  },
});
```

### Test Structure

```typescript
describe('buildFileQueryWhere', () => {
  it('should return empty conditions for empty filters', () => {
    const result = buildFileQueryWhere({});
    expect(result.conditions).toEqual([]);
    expect(result.params).toEqual([]);
  });

  it('should escape special characters in keyword', () => {
    const result = buildFileQueryWhere({ keyword: "test'; DROP TABLE--" });
    expect(result.params[0]).not.toContain("'");
  });
});
```

## Deployment

```bash
# Staging
npm run deploy:staging

# Production
npm run deploy:production
```

### Deployment Checklist

1. [ ] All tests passing
2. [ ] Environment variables set
3. [ ] Database migrations applied
4. [ ] R2 bucket configured
5. [ ] CORS origins updated
