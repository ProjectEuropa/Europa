import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { MyPage } from './pages/MyPage';
import {
  testUsers,
  loginUser,
  logoutUser,
  mockLoginSuccess,
  mockLoginFailure,
  mockRegisterSuccess,
  generateUniqueTestUser,
  useRealApi,
} from './helpers/auth-helpers';

test.describe('Authentication Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await logoutUser(page);
  });

  test.describe('Login Integration', () => {
    test('should successfully login with valid credentials', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await mockLoginSuccess(page, testUsers.valid);
      await loginPage.goto();
      await loginPage.login(testUsers.valid.email, testUsers.valid.password!);

      // 成功後の状態を確認
      await loginPage.expectLoginSuccess();
    });

    test('should show error message for invalid credentials', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await mockLoginFailure(page);
      await loginPage.goto();
      await loginPage.login(testUsers.invalid.email, testUsers.invalid.password);

      // エラーメッセージが表示されることを確認
      await loginPage.expectLoginError();

      // ログインページに留まることを確認
      await expect(page).toHaveURL('/login');
      await loginPage.expectUnauthenticated();
    });

    // Skip: ネットワークエラー時のトーストメッセージ実装が未完了
    test.skip('should handle network errors gracefully', async ({ page }) => {
      const loginPage = new LoginPage(page);

      // ネットワークエラーをシミュレート
      await page.route('**/api/v2/auth/login', async (route) => {
        await route.abort('failed');
      });

      await loginPage.goto();
      await loginPage.login(testUsers.valid.email, testUsers.valid.password!);

      // エラートーストまたはメッセージが表示されることを確認
      await loginPage.expectToast(/接続に問題があります/);
    });
  });

  test.describe('Registration Integration', () => {
    test('should successfully register with valid information', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      // Use unique email for real API to avoid conflicts, mock user for mock mode
      const newUser = useRealApi ? generateUniqueTestUser() : testUsers.valid;

      await mockRegisterSuccess(page, newUser);
      await registerPage.goto();
      await registerPage.register({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password!,
        passwordConfirmation: newUser.password!,
      });

      // 成功後の状態を確認
      await registerPage.expectRegisterSuccess();
    });

    test('should show error for existing email', async ({ page }) => {
      const registerPage = new RegisterPage(page);

      // Mock only when not using real API (real API will return actual 409 error)
      if (!useRealApi) {
        await page.route('**/api/v2/auth/register', async (route) => {
          await route.fulfill({
            status: 409,
            contentType: 'application/json',
            body: JSON.stringify({
              message: 'Email already exists',
            }),
          });
        });
      }

      await registerPage.goto();
      await registerPage.register({
        name: testUsers.existing.name,
        email: testUsers.existing.email,
        password: testUsers.existing.password!,
        passwordConfirmation: testUsers.existing.password!,
      });

      // エラーメッセージが表示されることを確認
      await registerPage.expectEmailExistsError();

      // 登録ページに留まることを確認
      await expect(page).toHaveURL('/register');
      await registerPage.expectUnauthenticated();
    });

    test('should validate password confirmation', async ({ page }) => {
      const registerPage = new RegisterPage(page);
      // Use unique email to avoid potential conflicts (validation is client-side anyway)
      const testUser = useRealApi ? generateUniqueTestUser() : testUsers.valid;

      await registerPage.goto();
      await registerPage.register({
        name: testUser.name,
        email: testUser.email,
        password: testUser.password!,
        passwordConfirmation: 'differentpassword',
      });

      // パスワード不一致エラーが表示されることを確認
      await registerPage.expectPasswordMismatchError();
    });
  });

  test.describe('Authentication Flow', () => {
    test('should complete full login-logout cycle', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const homePage = new HomePage(page);

      // ログイン
      await mockLoginSuccess(page, testUsers.valid);
      await loginPage.goto();
      await loginPage.login(testUsers.valid.email, testUsers.valid.password!);

      // ログイン成功を確認
      await loginPage.expectLoginSuccess();

      // ログアウト
      await homePage.logout();

      await expect(page).toHaveURL('/', { timeout: 5000 });
      await homePage.expectUnauthenticatedView();
    });

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
      const myPage = new MyPage(page);

      await page.goto('/mypage');
      await expect(page).toHaveURL('/login', { timeout: 5000 });
    });
  });

  test.describe('Session Persistence', () => {
    test('should maintain authentication across page reloads', async ({ page }) => {
      const myPage = new MyPage(page);
      const homePage = new HomePage(page);

      await loginUser(page, testUsers.valid);
      await myPage.goto();
      await homePage.expectAuthenticated();

      // ページをリロード
      await page.reload();
      await homePage.expectAuthenticated();
      await expect(page).toHaveURL('/mypage');
    });

    test('should maintain authentication across navigation', async ({ page }) => {
      const homePage = new HomePage(page);
      const myPage = new MyPage(page);

      await loginUser(page, testUsers.valid);

      // 複数のページを移動
      await homePage.goto();
      await homePage.expectAuthenticated();

      await page.goto('/about');
      await homePage.expectAuthenticated();

      await myPage.goto();
      await homePage.expectAuthenticated();
    });
  });

  test.describe('Error Handling', () => {
    test.skip('should handle expired token gracefully', async ({ page }) => {
      const myPage = new MyPage(page);
      const loginPage = new LoginPage(page);

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

      await myPage.goto();

      // ログインページにリダイレクトされることを確認
      await expect(page).toHaveURL('/login', { timeout: 5000 });
      await loginPage.expectUnauthenticated();
    });

    test('should handle API server errors', async ({ page }) => {
      const loginPage = new LoginPage(page);

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

      await loginPage.goto();
      await loginPage.login(testUsers.valid.email, testUsers.valid.password!);

      // エラーメッセージが表示されることを確認
      await loginPage.expectToast(/サーバーで問題が発生しました/);
    });
  });
});
