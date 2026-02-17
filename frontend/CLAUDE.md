# Frontend Development Guide

## Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # UIコンポーネント（ui/, auth/, search/等）
├── hooks/         # カスタムフック（useAuth, useToast等）
├── lib/api/       # APIクライアント実装
├── providers/     # プロバイダー（Query, Toast）
├── stores/        # Zustand状態管理
├── schemas/       # Zod検証スキーマ
├── types/         # TypeScript型定義
├── utils/         # ユーティリティ関数
└── __tests__/     # ユニットテスト
```

### Naming Conventions

- ページ: `page.tsx`
- クライアントコンポーネント: `Client${Name}.tsx`
- フック: `useXxx.ts`
- ストア: `xxxStore.ts`
- スキーマ: `xxx.ts`（schemas/配下）

## Technology Stack

- **Next.js**: 16.1.3 (App Router, 静的生成 `output: 'export'`)
  - **重要**: 静的エクスポートのため **SSR (Server Side Rendering) は不可**。
  - データ取得は基本クライアントサイド（TanStack Query）で行い、スケルトン表示やプリフェッチを併用すること。

| 技術 | バージョン | 用途 |
|-----|-----------|------|
| Next.js | 16.1.3 | Webフレームワーク（App Router, 静的生成, Turbopack） |
| React | 19.2.0 | UIライブラリ |
| TypeScript | 5.7.3 | 型安全性（strict有効） |
| Zustand | 5.0.10 | 状態管理（persist middleware） |
| React Hook Form | 7.54.2 | フォーム管理 |
| Zod | 4.3.5 | バリデーション |
| TanStack Query | 5.90.19 | サーバー状態管理 |
| Tailwind CSS | 4.1.7 | スタイリング |
| shadcn/ui | - | UIコンポーネント（Radix UI基盤） |
| Biome | 2.5.2 | Lint/Format |
| Vitest | 4.x | ユニットテスト |
| Playwright | 1.50.1 | E2Eテスト |

**Node.js**: 24.x（Volta管理、Active LTS）

## Development Workflow

```bash
# 開発
npm run dev          # ポート3002、Turbopack使用

# コード品質
npm run check:fix    # Biome lint + format 自動修正
npm run type-check   # TypeScript型チェック

# テスト
npm run test:run     # Vitestユニットテスト
npm run test:e2e     # Playwright E2Eテスト

# ビルド
npm run build        # 静的生成（output: 'export'）
npm run ci           # test:run + build
```

### Pre-commit Hook（lint-staged）

- TypeScript/JavaScript: `biome check --write` + `vitest related --run --reporter=verbose`
- JSON/Markdown/CSS: `biome format --write`

## Coding Standards

### Biome Settings

- インデント: 2スペース
- セミコロン: 常に付与
- クォート: シングル（JSXはダブル）
- any: **禁止**（noExplicitAny: error）
- const強制、exhaustive deps警告

### TypeScript

- target: ES2020
- strict: true
- パスエイリアス: `@/*` → `./src/*`

## API Design

**エンドポイント形式**: `/api/v2/...`

**認証方式**: HttpOnly Cookie + credentials: 'include'

**エラーハンドリング**:
- 401: 認証エラー → 日本語メッセージ自動変換
- 422: バリデーション → フィールド別エラー表示
- 500+: サーバーエラー → 汎用メッセージ

**APIクライアント**: `src/lib/api/client.ts`（fetch wrapper）

## State Management

### Zustand Configuration

```typescript
// persist middleware
{
  name: 'auth-storage',
  partialize: state => ({ user, isAuthenticated }), // token除外
}
```

### SSR Hydration Pattern

```typescript
// src/stores/authStore.ts
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  hasHydrated: boolean; // Hydration完了フラグ
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    }
  )
);

// Usage in components (avoid hydration mismatch)
export function MyComponent() {
  const { hasHydrated, user } = useAuthStore();

  if (!hasHydrated) return null; // Wait for hydration
  return <div>{user?.name}</div>;
}
```

**Store Structure**: State + Actions を union型で定義

## Component Design

### shadcn/ui + React Hook Form + Zod Integration

```typescript
<Form onSubmit={handleSubmit(onSubmit)}>
  <FormField control={control} name="email" render={...} />
</Form>
```

**Styling**: Tailwind CSS + CVA（class-variance-authority）

---

# E2E Testing Rules

> Reference: https://engineering.reiwatravel.co.jp/blog/Advent-Calendar-20251223

## Core Principles

1. **セマンティックロケーター優先** - UIの変更に対する耐性を高める
2. **明示的待機** - フレーキーテストを防止
3. **Page Object Model** - 保守性向上
4. **認証パターン分離** - テストシナリオの明確化
5. **PC/SP分離** - レスポンシブテストの堅牢性

---

## Locator Priority (MUST)

```
getByRole() > getByLabel() > getByText() > getByTestId()
```

### Good Examples

```typescript
// Role-based（最優先）
page.getByRole('button', { name: 'ログイン' })
page.getByRole('textbox', { name: 'メールアドレス' })
page.getByRole('link', { name: /新規登録/ })

// Label-based
page.getByLabel('パスワード')

// Text-based
page.getByText(/ログインしました/)
```

### Bad Examples

```typescript
// Avoid ID selectors
page.locator('input#email')        // ❌
page.locator('#submit-button')     // ❌

// Avoid class selectors
page.locator('.btn-primary')       // ❌
```

---

## Wait Handling (MUST)

### Allowed

```typescript
// Auto-retry assertions
await expect(page).toHaveURL('/dashboard');
await expect(element).toBeVisible();
await expect(element).toHaveText('Success');

// Network waiting
await page.waitForResponse('**/api/v2/auth/login');
```

### Prohibited

```typescript
// Fixed time waits
await page.waitForTimeout(1000);   // ❌ Avoid
await new Promise(r => setTimeout(r, 500)); // ❌ Avoid
```

### Rare Exceptions (with documentation)

```typescript
// If an automatic wait cannot be used, document the reason
// Animation delay (unavoidable)
await page.waitForTimeout(300); // Wait for CSS animation completion (transition: 300ms)
```

---

## API Mocking (MUST)

### Endpoint Format

- Base: `/api/v2/...`
- Success: `{ data: {...}, message?: string }`
- Error: `{ message: string, errors?: { [field]: string[] } }`

### Mock Setup

```typescript
await page.route('**/api/v2/auth/login', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      token: 'mock-jwt-token',
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
    }),
  });
});
```

**Rule**: 実APIへの呼び出しは禁止（テストの再現性確保）

---

## Storage Initialization (MUST)

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});
```

**Purpose**: Zustand hydration問題を回避、テスト間の状態汚染を防止

---

## Test Data Management (MUST)

**Location**: `e2e/helpers/auth-helpers.ts`

```typescript
export const testUsers = {
  valid: {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  },
  invalid: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },
};
```

**Rule**: テストごとに異なるデータを使用しない、データ変更は1箇所で管理

---

## Page Object Model (RECOMMENDED)

### Structure

```
e2e/
├── pages/
│   ├── BasePage.ts      # 共通機能
│   ├── LoginPage.ts
│   ├── RegisterPage.ts
│   ├── HomePage.ts
│   └── SearchPage.ts
├── fixtures/
│   └── auth.fixtures.ts
├── helpers/
│   └── auth-helpers.ts
└── *.spec.ts
```

### Example: LoginPage

```typescript
import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  // Locators (semantic priority)
  get emailInput() { return this.page.getByLabel('メールアドレス'); }
  get passwordInput() { return this.page.getByLabel('パスワード'); }
  get submitButton() { return this.page.getByRole('button', { name: 'ログイン' }); }
  get errorMessage() { return this.page.getByRole('alert'); }

  // Actions
  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  // Assertions
  async expectVisible() {
    await expect(this.page).toHaveURL('/login');
    await expect(this.submitButton).toBeVisible();
  }

  async expectError(message: string | RegExp) {
    await expect(this.errorMessage).toContainText(message);
  }
}
```

### Usage in Tests

```typescript
import { LoginPage } from './pages/LoginPage';

test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('test@example.com', 'password123');

  await expect(page).toHaveURL('/');
});
```

---

## Authentication Patterns (RECOMMENDED)

### Pattern Types

| パターン | 用途 | 実装 |
|---------|-----|------|
| 未ログイン | 公開ページテスト | デフォルト状態 |
| ログイン済み | 認証必須ページテスト | `loginUser()` ヘルパー |
| 特定権限 | 管理者機能テスト | カスタムフィクスチャ |

### Auth Fixtures

```typescript
// e2e/fixtures/auth.fixtures.ts
import { test as base, Page } from '@playwright/test';
import { loginUser, testUsers } from '../helpers/auth-helpers';

export const test = base.extend<{
  authenticatedPage: Page;
}>({
  authenticatedPage: async ({ page }, use) => {
    await loginUser(page, testUsers.valid);
    await use(page);
  },
});

export { expect } from '@playwright/test';
```

### Usage

```typescript
import { test, expect } from './fixtures/auth.fixtures';

test('authenticated user can access mypage', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/mypage');
  await expect(authenticatedPage).toHaveURL('/mypage');
});
```

---

## PC/SP Separation (RECOMMENDED)

### File Naming

- PC版: `*.spec.ts`
- SP版: `*.mobile.spec.ts`

### Playwright Config

```typescript
// playwright.config.ts
projects: [
  {
    name: 'Desktop Chrome',
    use: { ...devices['Desktop Chrome'] },
    testMatch: '**/*.spec.ts',
    testIgnore: '**/*.mobile.spec.ts',
  },
  {
    name: 'Mobile Safari',
    use: { ...devices['iPhone 13'] },
    testMatch: '**/*.mobile.spec.ts',
  },
],
```

### Viewport Sizes

| デバイス | サイズ |
|---------|--------|
| デスクトップ | 1200x800 |
| タブレット | 768x1024 |
| モバイル | 375x667 |

---

## Error Testing (RECOMMENDED)

### Status Code Coverage

| Code | Type | Test Pattern |
|------|------|-------------|
| 401 | 認証エラー | Invalid credentials |
| 409 | 重複エラー | Email already exists |
| 422 | バリデーション | Field validation errors |
| 500 | サーバーエラー | Server unavailable |

### Example

```typescript
test('should show validation error on 422', async ({ page }) => {
  await page.route('**/api/v2/auth/login', async (route) => {
    await route.fulfill({
      status: 422,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Validation failed',
        errors: {
          email: ['メールアドレスの形式が正しくありません'],
        },
      }),
    });
  });

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('invalid', 'password');

  await expect(page.getByText(/メールアドレスの形式/)).toBeVisible();
});
```

---

## Toast Notification Testing (RECOMMENDED)

```typescript
// Wait for toast with timeout
await expect(page.getByText('ログインしました')).toBeVisible({ timeout: 5000 });

// Sonner library is used for toasts
```

---

## Skip Test Management (RECOMMENDED)

```typescript
// Always include reason comment
test.skip('should redirect authenticated user', async ({ page }) => {
  // TODO: Zustand hydration timing issue - fix in #123
});
```

**Rule**: `test.skip()` には理由コメント必須、定期的にレビュー

---

## Test Naming Convention (OPTIONAL)

```typescript
// Pattern: "should [expected behavior] when [condition]"
test('should show error message when password is invalid', ...);
test('should redirect to dashboard when login succeeds', ...);
test('should display loading state when submitting form', ...);
```

---

## Auth Storage Structure

```json
{
  "auth-storage": {
    "state": {
      "user": { "id": "1", "name": "Test", "email": "test@example.com" },
      "isAuthenticated": true
    }
  }
}
```

**Note**: token は永続化されない（HttpOnly Cookie使用）

---

## CI/CD Integration

### GitHub Actions

1. **setup**: 依存関係キャッシュ
2. **test**: Vitest実行（カバレッジ）
3. **build**: Next.js静的ビルド
4. **e2e**: Playwright実行（Chromiumのみ、リトライ2回）

### E2E in CI

```yaml
- name: Run E2E tests
  run: npm run test:e2e
  env:
    CI: true
```

**Settings**:
- workers: 1（CI環境）
- retries: 2
- reporter: html + github + json

### E2E Auto-Fix Workflow

E2Eテスト失敗時の自動修復については `.claude/skills/e2e-debug/SKILL.md` を参照。

- エラーパターンと解決策
- ロケータ変換ルール
- CI自動修復モードの手順
