import { test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

test.describe('Mobile: Authentication Pages', () => {
  test('Login page should be accessible on mobile', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.expectVisible();
  });

  test('Registration page should be accessible on mobile', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.goto();
    await registerPage.expectVisible();
  });
});
