import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

test.describe('Basic Authentication Pages', () => {
  test('Login page should be accessible', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.expectVisible();
  });

  test('Registration page should be accessible', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.goto();
    await registerPage.expectVisible();
  });

  test('Navigation between pages works', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);

    // ログインページから登録ページへ
    await loginPage.goto();
    await loginPage.registerLink.click();
    await expect(page).toHaveURL('/register');

    // 登録ページからログインページへ
    await registerPage.loginLink.click();
    await expect(page).toHaveURL('/login');
  });
});
