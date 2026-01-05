# E2E Test Writer

新しいE2Eテストを作成するスキルです。Page Object Modelパターンに従い、セマンティックロケータを使用した高品質なテストを生成します。

## When to use

- 新しいページやコンポーネントのE2Eテストを作成するとき
- ユーザーが「E2Eテストを書いて」「テストを作成して」と依頼したとき
- 新機能の実装後にテストが必要なとき

## Instructions

### 1. 対象ページのコンポーネントを調査

まず、対象ページのReactコンポーネントを読み取り、以下を把握する:
- ページのURL
- フォーム要素（input, button, select等）
- aria-label, role属性
- 表示されるテキスト・見出し
- APIエンドポイント

### 2. Page Objectを作成

`frontend/e2e/pages/` に新しいPage Objectを作成:

```typescript
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class [PageName]Page extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators（セマンティック優先順位を厳守）
  // 1. getByRole - 最優先
  // 2. getByLabel - フォーム要素
  // 3. getByText - テキストコンテンツ
  // 4. getByTestId - 最終手段

  // Actions
  async goto() {
    await this.page.goto('/path');
  }

  // Assertions
  async expectVisible() {
    // ページ固有の表示確認
  }
}
```

### 3. Page Objectをエクスポート

`frontend/e2e/pages/index.ts` に追加:
```typescript
export { [PageName]Page } from './[PageName]Page';
```

### 4. テストファイルを作成

`frontend/e2e/[page-name].spec.ts` を作成:

```typescript
import { test, expect } from '@playwright/test';
import { [PageName]Page } from './pages/[PageName]Page';

test.describe('[PageName]', () => {
  test('should load correctly', async ({ page }) => {
    const [pageName]Page = new [PageName]Page(page);
    await [pageName]Page.goto();
    await [pageName]Page.expectVisible();
  });

  // 追加のテストケース
});
```

## Rules

### ロケータの優先順位（必須）

```typescript
// Good - セマンティックロケータ
page.getByRole('button', { name: '送信' })
page.getByRole('textbox', { name: /メールアドレス/ })
page.getByLabel('パスワード')

// Avoid - 実装依存
page.locator('.btn-submit')
page.locator('#email-input')
```

### 待機処理（必須）

```typescript
// Good - auto-retry assertions
await expect(page.getByRole('button')).toBeVisible();
await expect(page).toHaveURL('/dashboard');

// NG - 固定wait
await page.waitForTimeout(3000);
```

### APIモック

```typescript
await page.route('**/api/v2/endpoint', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ data: 'mock' }),
  });
});
```

### 複数要素への対応

```typescript
// strict mode違反を避ける
page.getByRole('link', { name: '新規登録' }).first()
page.getByRole('main').getByRole('button', { name: '送信' })
```

## Output

1. `frontend/e2e/pages/[PageName]Page.ts` - Page Object
2. `frontend/e2e/[page-name].spec.ts` - テストファイル
3. `frontend/e2e/pages/index.ts` の更新

作成後、`npm run test:e2e -- [page-name].spec.ts` でテストを実行して動作確認する。
