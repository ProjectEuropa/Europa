import { test, expect } from '@playwright/test';
import {
  testUsers,
  loginUser,
  logoutUser,
  mockLoginSuccess,
  mockLoginFailure,
  mockRegisterSuccess,
  mockRegisterFailure,
  fillLoginForm,
  fillRegisterForm,
  expectAuthenticated,
  expectUnauthenticated,
} from './helpers/auth-helpers';

test.describe('Authentication Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // 各テスト前にローカルストレージをクリア
    await logoutUser(page);
  });

  test.describe('Login Integration', () => {
    test('should successfully login with valid credentials', async ({ page }) => {
      await mockLoginSuccess(page, testUsers.valid);
      await page.goto('/login');

      await fillLoginForm(page, testUsers.valid.email, testUsers.valid.password!);
      await page.getByRole('button', { name: 'ログイン' }).click();

      // 成功後の状態を確認（ログイン成功後はホームページにリダイレクト）
      await expect(page).toHaveURL('/', { timeout: 5000 });
      await expectAuthenticated(page);
    });

    test('should show error message for invalid credentials', async ({ page }) => {
      await mockLoginFailure(page);
      await page.goto('/login');

      await fillLoginForm(page, testUsers.invalid.email, testUsers.invalid.password);
      await page.getByRole('button', { name: 'ログイン' }).click();

      // エラーメッセージが表示されることを確認
      await expect(page.locator('text=メールアドレスまたはパスワードが正しくありません').first()).toBeVisible({ timeout: 5000 });

      // ログインページに留まることを確認
      await expect(page).toHaveURL('/login');
      await expectUnauthenticated(page);
    });

    test.skip('should handle network errors gracefully', async ({ page }) => {
      // ネットワークエラーをシミュレート
      await page.route('**/api/v2/auth/login', async (route) => {
        await route.abort('failed');
      });

      await page.goto('/login');
      await fillLoginForm(page, testUsers.valid.email, testUsers.valid.password!);
      await page.getByRole('button', { name: 'ログイン' }).click();

      // エラートーストまたはメッセージが表示されることを確認
      await expect(page.locator('text=接続に問題があります')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Registration Integration', () => {
    test('should successfully register with valid information', async ({ page }) => {
      await mockRegisterSuccess(page, testUsers.valid);
      await page.goto('/register');

      await fillRegisterForm(page, testUsers.valid);
      await page.getByRole('button', { name: /アカウント作成/ }).click();

      // 成功後の状態を確認（登録成功後はホームページにリダイレクト）
      await expect(page).toHaveURL('/', { timeout: 5000 });
      await expectAuthenticated(page);
    });

    test('should show error for existing email', async ({ page }) => {
      await mockRegisterFailure(page, {
        email: ['このメールアドレスは既に使用されています'],
      });

      await page.goto('/register');
      await fillRegisterForm(page, testUsers.existing);
      await page.getByRole('button', { name: /アカウント作成/ }).click();

      // エラーメッセージが表示されることを確認
      await expect(page.locator('text=このメールアドレスは既に使用されています')).toBeVisible({ timeout: 5000 });

      // 登録ページに留まることを確認
      await expect(page).toHaveURL('/register');
      await expectUnauthenticated(page);
    });

    test('should validate password confirmation', async ({ page }) => {
      await page.goto('/register');

      await fillRegisterForm(page, {
        ...testUsers.valid,
        passwordConfirmation: 'differentpassword',
      });
      await page.getByRole('button', { name: /アカウント作成/ }).click();

      // パスワード不一致エラーが表示されることを確認
      await expect(page.locator('text=パスワードが一致しません')).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Authentication Flow', () => {
    test('should complete full login-logout cycle', async ({ page }) => {
      // ログイン
      await mockLoginSuccess(page, testUsers.valid);
      await page.goto('/login');
      await fillLoginForm(page, testUsers.valid.email, testUsers.valid.password!);
      await page.getByRole('button', { name: 'ログイン' }).click();

      // ログイン成功後はホームページにリダイレクト
      await expect(page).toHaveURL('/', { timeout: 5000 });
      await expectAuthenticated(page);

      // ログアウト
      await page.getByRole('button', { name: /ログアウト/ }).click();

      await expect(page).toHaveURL('/', { timeout: 5000 });
      await expectUnauthenticated(page);
    });

    // TODO: Zustand store hydration timing issue with localStorage mock
    test.skip('should redirect authenticated user from auth pages', async ({ page }) => {
      await loginUser(page, testUsers.valid);

      // ストアのハイドレーションを確実にするためにリロード
      await page.reload();

      // ログインページにアクセス（認証済みユーザーはホームにリダイレクト）
      await page.goto('/login');
      await expect(page).toHaveURL('/', { timeout: 5000 });

      // 登録ページにアクセス（認証済みユーザーはホームにリダイレクト）
      await page.goto('/register');
      await expect(page).toHaveURL('/', { timeout: 5000 });
    });

    test('should redirect unauthenticated user from protected pages', async ({ page }) => {
      await page.goto('/mypage');
      await expect(page).toHaveURL('/login', { timeout: 5000 });
    });
  });

  test.describe('Session Persistence', () => {
    test('should maintain authentication across page reloads', async ({ page }) => {
      await loginUser(page, testUsers.valid);
      await page.goto('/mypage');
      await expectAuthenticated(page);

      // ページをリロード
      await page.reload();
      await expectAuthenticated(page);
      await expect(page).toHaveURL('/mypage');
    });

    test('should maintain authentication across navigation', async ({ page }) => {
      await loginUser(page, testUsers.valid);

      // 複数のページを移動
      await page.goto('/');
      await expectAuthenticated(page);

      await page.goto('/about');
      await expectAuthenticated(page);

      await page.goto('/mypage');
      await expectAuthenticated(page);
    });
  });

  test.describe('Error Handling', () => {
    // TODO: API mock timing issue - /mypage triggers multiple API calls
    test.skip('should handle expired token gracefully', async ({ page }) => {
      await loginUser(page, testUsers.valid);

      // 期限切れトークンのレスポンスをモック
      await page.route('**/api/v2/auth/me', async (route) => {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Token expired',
          }),
        });
      });

      await page.goto('/mypage');

      // ログインページにリダイレクトされることを確認
      await expect(page).toHaveURL('/login', { timeout: 5000 });
      await expectUnauthenticated(page);
    });

    test('should handle API server errors', async ({ page }) => {
      // サーバーエラーをシミュレート
      await page.route('**/api/v2/auth/login', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Internal server error',
          }),
        });
      });

      await page.goto('/login');
      await fillLoginForm(page, testUsers.valid.email, testUsers.valid.password!);
      await page.getByRole('button', { name: 'ログイン' }).click();

      // エラーメッセージが表示されることを確認
      await expect(page.locator('text=サーバーで問題が発生しました')).toBeVisible({ timeout: 5000 });
    });
  });
});
