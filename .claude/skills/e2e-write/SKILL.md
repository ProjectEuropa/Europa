---
name: e2e-write
description: |
  Create new E2E tests using Playwright with Page Object Model pattern and semantic locators.
  Triggers: "E2Eテストを書いて", "テストを作成して", "新機能のテストが必要", "E2E test", "create test"
  Use when: Creating E2E tests for new pages or components, after implementing new features.
  Outputs: Page Object files (frontend/e2e/pages/) and spec files (frontend/e2e/*.spec.ts)
---

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

  get emailInput() {
    return this.page.getByLabel('メールアドレス*');
  }

  get passwordInput() {
    return this.page.getByLabel('パスワード*');
  }

  get submitButton() {
    return this.page.getByRole('button', { name: '送信' });
  }

  // Actions
  async goto() {
    await this.page.goto('/path');
  }

  // Assertions
  async expectVisible() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
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
    // 必須: テスト間の状態リークを防止（gotoの後に実行）
    await [pageName]Page.clearStorage();
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

// NG - 実装依存（クラス名、ID）
page.locator('.btn-submit')
page.locator('#email-input')
page.locator('#features')  // ← IDセレクタも禁止
```

### セクションスコープの使用

ページ内に同じテキストのリンクや要素が複数ある場合、親要素でスコープして検索する:

```typescript
// Good - 親要素でスコープ
get featuresSection() {
  return this.page.getByRole('region', { name: /features/i });
}

get searchTeamLink() {
  // featuresセクション内のリンクに限定
  return this.featuresSection.getByRole('link', { name: /チームデータ検索/ });
}

// NG - ページ全体から検索（複数マッチの可能性）
get searchTeamLink() {
  return this.page.getByRole('link', { name: /チームデータ検索/ });
}
```

**親要素のロケータもセマンティック優先**:
```typescript
// Good - role属性でスコープ
this.page.getByRole('region', { name: /features/i })
this.page.getByRole('main')
this.page.getByRole('navigation')

// NG - IDセレクタでスコープ
this.page.locator('#features')
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
// strict mode違反を避ける方法

// 方法1: 親要素でスコープ（推奨）
page.getByRole('main').getByRole('button', { name: '送信' })

// 方法2: .first()を使用（本当に複数存在し、最初の要素が正解の場合のみ）
page.getByRole('link', { name: '新規登録' }).first()
```

**`.first()`使用時の注意**:
- 本来ユニークであるべき要素に使うとフレーキーテストの原因になる
- 親要素でスコープできる場合はそちらを優先
- 使用する場合は、なぜ複数要素が存在するのかコメントで説明

## Output

1. `frontend/e2e/pages/[PageName]Page.ts` - Page Object
2. `frontend/e2e/[page-name].spec.ts` - テストファイル
3. `frontend/e2e/pages/index.ts` の更新

作成後、`npm run test:e2e -- [page-name].spec.ts` でテストを実行して動作確認する。
