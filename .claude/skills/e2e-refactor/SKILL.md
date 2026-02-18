---
name: e2e-refactor
description: |
  Refactor tests to use semantic locators and POM.
  Triggers: "テストをリファクタリング", "ロケータを改善"
  Use when: Tests don't use semantic locators, Page Object pattern not applied, tests use deprecated patterns like class/ID selectors or fixed waits.
  Outputs: Updated/new Page Objects and refactored spec files.
---

# E2E Test Refactorer

既存のE2Eテストをリファクタリングし、Page Object Modelパターンとセマンティックロケータを適用するスキルです。

## When to use

- 既存のE2Eテストがセマンティックロケータを使用していないとき
- Page Objectパターンが適用されていないテストを改善するとき
- ユーザーが「E2Eテストをリファクタリングして」「テストを改善して」と依頼したとき
- 固定waitや非推奨なロケータを使用しているテストを発見したとき

## Instructions

### 1. 既存テストを分析

対象テストファイルを読み取り、以下を特定:
- 使用されているページ/URL
- 直接使用されているロケータ
- 繰り返し使用されているパターン
- 非推奨なロケータ（クラス名、ID等）

### 2. 問題点を特定

#### 非推奨ロケータ

```typescript
// Before - 実装依存（クラス、ID、data-testid）
page.locator('.submit-btn')
page.locator('#email')
page.locator('#features')  // IDセレクタも非推奨
page.locator('[data-testid="password"]')

// After - セマンティック
page.getByRole('button', { name: '送信' })
page.getByRole('textbox', { name: /メールアドレス/ })
page.getByLabel('パスワード')
```

#### セクションスコープの適用

```typescript
// Before - ページ全体から検索
get searchLink() {
  return this.page.getByRole('link', { name: /検索/ });
}

// After - 親要素でスコープ
get featuresSection() {
  return this.page.getByRole('region', { name: /features/i });
}

get searchLink() {
  return this.featuresSection.getByRole('link', { name: /検索/ });
}
```

#### 固定wait

```typescript
// Before
await page.waitForTimeout(3000);

// After
await expect(page.getByRole('heading')).toBeVisible();
```

#### 直接ロケータ

```typescript
// Before - テストファイルに直接記述
await page.locator('input#email').fill('test@example.com');
await page.getByRole('button', { name: 'ログイン' }).click();

// After - Page Objectを使用
await loginPage.login('test@example.com', 'password');
```

### 3. Page Objectを作成/更新

既存のPage Objectがある場合は拡張、なければ新規作成:

```typescript
// frontend/e2e/pages/[PageName]Page.ts
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class [PageName]Page extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators - セマンティック優先
  get emailInput() {
    return this.page.getByRole('textbox', { name: /メールアドレス/ });
  }

  // Actions
  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  // Assertions
  async expectEmailError(message: string | RegExp) {
    await expect(this.page.getByText(message)).toBeVisible();
  }
}
```

### 4. テストをリファクタリング

```typescript
// Before
test('login test', async ({ page }) => {
  await page.goto('/login');
  await page.locator('#email').fill('test@example.com');
  await page.locator('#password').fill('password');
  await page.locator('.btn-login').click();
  await page.waitForTimeout(2000);
  expect(page.url()).toBe('/');
});

// After
test('login test', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('test@example.com', 'password');
  await loginPage.expectLoginSuccess();
});
```

## Checklist

### ロケータ

- [ ] `page.locator('.class')` → `page.getByRole()` / `page.getByLabel()`
- [ ] `page.locator('#id')` → `page.getByRole()` / `page.getByLabel()`
- [ ] `page.locator('[data-testid]')` → セマンティックロケータ優先

### 待機処理

- [ ] `waitForTimeout()` → auto-retry assertions
- [ ] `waitForSelector()` → `expect().toBeVisible()`
- [ ] `waitForNavigation()` → `expect(page).toHaveURL()`

### 構造

- [ ] 繰り返しロケータ → Page Objectのgetter
- [ ] 繰り返しアクション → Page Objectのメソッド
- [ ] 繰り返しアサーション → Page Objectの`expect*`メソッド

### Strict Mode対応

- [ ] 複数要素にマッチするロケータ → 親要素でスコープ（推奨）または `.first()`

### `.first()`の見直し

- [ ] 不必要な `.first()` の削除（本来ユニークな要素に使っている場合）
- [ ] `.first()` を使っている箇所 → 親要素でスコープに置き換え可能か検討

## Output

1. 更新された/新規のPage Object
2. リファクタリングされたテストファイル
3. `frontend/e2e/pages/index.ts` の更新（必要な場合）

リファクタリング後、`npm run test:e2e -- [test-file].spec.ts` でテストを実行して動作確認する。
