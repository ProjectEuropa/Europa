import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

test.describe('Navigation', () => {
  test('Navigation between pages', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);

    // ホームページから開始
    await homePage.goto();
    await expect(homePage.homeLink).toBeVisible();

    // ログインページへ移動
    await homePage.navigateToLogin();
    await expect(page).toHaveURL(/.*login/);
    await loginPage.expectVisible();

    // 新規登録ページへ移動
    await homePage.navigateToRegister();
    await expect(page).toHaveURL(/.*register/);
    await registerPage.expectVisible();

    // ホームページに戻る
    await homePage.navigateToHome();
    await expect(homePage.homeLink).toBeVisible();
  });

  test('Header navigation', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();

    // ヘッダーの要素を確認
    await expect(homePage.homeLink).toBeVisible();

    // メインナビゲーションメニューがある場合の確認
    await expect(homePage.mainNav).toBeVisible();
  });

  test('Responsive design', async ({ page }) => {
    const homePage = new HomePage(page);

    // デスクトップサイズ
    await page.setViewportSize({ width: 1200, height: 800 });
    await homePage.goto();
    await expect(homePage.homeLink).toBeVisible();

    // タブレットサイズ
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await expect(homePage.homeLink).toBeVisible();

    // モバイルサイズ
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await expect(homePage.homeLink).toBeVisible();
  });
});
