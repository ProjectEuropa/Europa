import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test.describe('Homepage', () => {
  test('should load correctly', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();

    // EUROPAロゴが表示されることを確認
    await expect(homePage.homeLink).toBeVisible();

    // 未認証状態でログイン/新規登録リンクが表示される
    await homePage.expectUnauthenticatedView();
  });
});
