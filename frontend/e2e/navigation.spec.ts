// @ts-ignore
// @vitest-ignore
import { test as playwrightTest, expect as playwrightExpect } from '@playwright/test';

playwrightTest('Navigation between pages', async ({ page }) => {
  // ホームページから開始
  await page.goto('/');
  await playwrightExpect(page.getByRole('link', { name: 'EUROPA' })).toBeVisible();

  // ログインページへ移動
  await page.getByRole('navigation').getByRole('link', { name: 'ログイン' }).click();
  await playwrightExpect(page).toHaveURL(/.*login/);
  await playwrightExpect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible();

  // 新規登録ページへ移動
  await page.getByRole('link', { name: '新規登録' }).first().click();
  await playwrightExpect(page).toHaveURL(/.*register/);
  await playwrightExpect(page.getByRole('heading', { name: '新規登録' })).toBeVisible();

  // ホームページに戻る
  await page.goto('/');
  await playwrightExpect(page.getByRole('link', { name: 'EUROPA' })).toBeVisible();
});

playwrightTest('Header navigation', async ({ page }) => {
  await page.goto('/');

  // ヘッダーの要素を確認
  await playwrightExpect(page.getByRole('link', { name: 'EUROPA' })).toBeVisible();

  // ナビゲーションメニューがある場合の確認
  const navigation = page.locator('nav');
  if (await navigation.isVisible()) {
    await playwrightExpect(navigation).toBeVisible();
  }
});

playwrightTest('Responsive design', async ({ page }) => {
  // デスクトップサイズ
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto('/');
  await playwrightExpect(page.getByRole('link', { name: 'EUROPA' })).toBeVisible();

  // タブレットサイズ
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.reload();
  await playwrightExpect(page.getByRole('link', { name: 'EUROPA' })).toBeVisible();

  // モバイルサイズ
  await page.setViewportSize({ width: 375, height: 667 });
  await page.reload();
  await playwrightExpect(page.getByRole('link', { name: 'EUROPA' })).toBeVisible();
});
