import { test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

test.describe('Mobile: Authentication Pages', () => {
  test('Login page should be accessible on mobile', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    // テスト間の状態リークを防止
    await loginPage.clearStorage();
    await loginPage.expectVisible();
  });

  test('Registration page should be accessible on mobile', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.goto();
    // テスト間の状態リークを防止
    await registerPage.clearStorage();
    await registerPage.expectVisible();
  });
});
