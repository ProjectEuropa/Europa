// @ts-ignore
// @vitest-ignore
import { test as playwrightTest, expect as playwrightExpect } from '@playwright/test';

// Vitestとの競合を避けるためにplaywrightTestとして明示的にインポート
playwrightTest('Homepage should load correctly', async ({ page }) => {
  await page.goto('/');

  // EUROPAロゴが表示されることを確認
  await playwrightExpect(page.getByRole('link', { name: 'ホームページに戻る' })).toBeVisible();

  // ログインリンクが表示されることを確認
  await playwrightExpect(page.getByRole('navigation').getByRole('link', { name: 'ログインページに移動' })).toBeVisible();

  // 新規登録リンクが表示されることを確認
  await playwrightExpect(page.getByRole('navigation').getByRole('link', { name: '新規登録ページに移動' })).toBeVisible();
});
