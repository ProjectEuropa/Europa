// @ts-ignore
// @vitest-ignore
import { test as playwrightTest, expect as playwrightExpect } from '@playwright/test';

playwrightTest('Login flow', async ({ page }) => {
  await page.goto('/login');

  // ログインページの要素を確認
  await playwrightExpect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible();
  await playwrightExpect(page.getByLabel('メールアドレス')).toBeVisible();
  await playwrightExpect(page.getByLabel('パスワード')).toBeVisible();
  await playwrightExpect(page.getByRole('button', { name: 'ログイン' })).toBeVisible();

  // 新規登録リンクを確認
  await playwrightExpect(page.getByText('新規登録')).toBeVisible();
});

playwrightTest('Registration flow', async ({ page }) => {
  await page.goto('/register');

  // 新規登録ページの要素を確認
  await playwrightExpect(page.getByRole('heading', { name: '新規登録' })).toBeVisible();
  await playwrightExpect(page.getByLabel('名前')).toBeVisible();
  await playwrightExpect(page.getByLabel('メールアドレス')).toBeVisible();
  await playwrightExpect(page.getByLabel('パスワード')).toBeVisible();
  await playwrightExpect(page.getByRole('button', { name: '登録' })).toBeVisible();

  // ログインリンクを確認
  await playwrightExpect(page.getByRole('link', { name: 'ログイン' })).toBeVisible();
});
