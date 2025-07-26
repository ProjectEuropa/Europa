import { test, expect } from '@playwright/test';

test.describe('Basic Authentication Pages', () => {
  test('Login page should be accessible', async ({ page }) => {
    await page.goto('/login');

    // ページが正常に読み込まれることを確認
    await expect(page).toHaveURL('/login');

    // 基本的な要素が存在することを確認
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /ログイン/ })).toBeVisible();
  });

  test('Registration page should be accessible', async ({ page }) => {
    await page.goto('/register');

    // ページが正常に読み込まれることを確認
    await expect(page).toHaveURL('/register');

    // 基本的な要素が存在することを確認（実際のページ構造に合わせて）
    await expect(page.locator('input#name')).toBeVisible();
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
    await expect(page.locator('input#confirmPassword')).toBeVisible();
    await expect(page.getByRole('button', { name: /アカウント作成/ })).toBeVisible();
  });

  test('Pages should be responsive', async ({ page }) => {
    // モバイルサイズでテスト
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();

    await page.goto('/register');
    await expect(page.locator('input#name')).toBeVisible();
  });

  test('Navigation between pages works', async ({ page }) => {
    // ログインページから登録ページへ
    await page.goto('/login');
    await page.getByRole('link', { name: /新規登録/ }).first().click();
    await expect(page).toHaveURL('/register');

    // 登録ページからログインページへ
    await page.getByRole('link', { name: /ログイン/ }).first().click();
    await expect(page).toHaveURL('/login');
  });
});
