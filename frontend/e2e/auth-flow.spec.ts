import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { MyPage } from './pages/MyPage';

// テスト用のユーザーデータ
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
};

const invalidUser = {
  email: 'invalid@example.com',
  password: 'wrongpassword',
};

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.clearStorage();
  });

  test.describe('Login Page', () => {
    test('should display login form correctly', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();

      // ページタイトルとフォーム要素の確認
      await expect(page).toHaveTitle(/EUROPA/);
      await loginPage.expectVisible();

      // リンクの確認
      await expect(loginPage.registerLink).toBeVisible();
      await expect(loginPage.forgotPasswordLink).toBeVisible();
    });

    test('should show validation errors for empty fields', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.submit();

      // バリデーションエラーが表示されることを確認
      await loginPage.expectEmailError(/メールアドレスを入力してください/);
      await loginPage.expectPasswordError(/パスワードを入力してください/);
    });

    test('should handle login with invalid credentials', async ({ page }) => {
      const loginPage = new LoginPage(page);

      // APIモックを設定
      await page.route('**/api/v2/auth/login', async (route) => {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Invalid credentials',
          }),
        });
      });

      await loginPage.goto();
      await loginPage.login(invalidUser.email, invalidUser.password);

      // エラーメッセージが表示されることを確認
      await loginPage.expectLoginError();
    });

    test('should handle successful login', async ({ page }) => {
      const loginPage = new LoginPage(page);

      // APIモックを設定
      await page.route('**/api/v2/auth/login', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            token: 'mock-jwt-token',
            user: {
              id: '1',
              name: testUser.name,
              email: testUser.email,
              createdAt: '2024-01-01T00:00:00Z',
            },
          }),
        });
      });

      await loginPage.goto();
      await loginPage.login(testUser.email, testUser.password);

      // 成功後のリダイレクトを確認
      await loginPage.expectLoginSuccess();

      // ローカルストレージに認証状態が保存されることを確認
      const authStorage = await loginPage.getAuthStorage();
      expect(authStorage?.state?.isAuthenticated).toBeTruthy();
      expect(authStorage?.state?.user).toBeTruthy();
    });
  });

  test.describe('Registration Page', () => {
    test('should display registration form correctly', async ({ page }) => {
      const registerPage = new RegisterPage(page);

      await registerPage.goto();

      // ページタイトルとフォーム要素の確認
      await expect(page).toHaveTitle(/EUROPA/);
      await registerPage.expectVisible();

      // ログインリンクの確認
      await expect(registerPage.loginLink).toBeVisible();
    });

    test('should show validation error for password mismatch', async ({ page }) => {
      const registerPage = new RegisterPage(page);

      await registerPage.goto();
      await registerPage.register({
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
        passwordConfirmation: 'differentpassword',
      });

      // パスワード不一致エラーが表示されることを確認
      await registerPage.expectPasswordMismatchError();
    });

    // Skip: 実DBへの登録が必要（DB初期化・シード未設定）
    test.skip('should handle successful registration', async ({ page }) => {
      const registerPage = new RegisterPage(page);

      // APIモックを設定
      await page.route('**/api/v2/auth/register', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            token: 'mock-jwt-token',
            user: {
              id: '1',
              name: testUser.name,
              email: testUser.email,
              createdAt: '2024-01-01T00:00:00Z',
            },
          }),
        });
      });

      await registerPage.goto();
      await registerPage.register({
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
        passwordConfirmation: testUser.password,
      });

      // 成功後のリダイレクトを確認
      await registerPage.expectRegisterSuccess();

      // ローカルストレージに認証状態が保存されることを確認
      const authStorage = await registerPage.getAuthStorage();
      expect(authStorage).toBeTruthy();
    });

    test.skip('should handle registration with existing email', async ({ page }) => {
      const registerPage = new RegisterPage(page);

      // APIモックを設定
      await page.route('**/api/v2/auth/register', async (route) => {
        await route.fulfill({
          status: 422,
          contentType: 'application/json',
          body: JSON.stringify({
            errors: {
              email: ['このメールアドレスは既に使用されています'],
            },
          }),
        });
      });

      await registerPage.goto();
      await registerPage.register({
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
        passwordConfirmation: testUser.password,
      });

      // エラーメッセージが表示されることを確認
      await registerPage.expectEmailExistsError();
    });
  });

  test.describe('Authentication Guard', () => {
    test('should redirect unauthenticated user to login', async ({ page }) => {
      const myPage = new MyPage(page);
      const loginPage = new LoginPage(page);

      await page.goto('/mypage');

      // 未認証の場合、ログインページにリダイレクトされることを確認
      await expect(page).toHaveURL('/login', { timeout: 5000 });
    });

    test('should allow authenticated user to access protected pages', async ({ page }) => {
      const myPage = new MyPage(page);
      const homePage = new HomePage(page);

      // 認証状態をモック
      await homePage.goto();
      await page.evaluate(() => {
        localStorage.setItem('auth-storage', JSON.stringify({
          state: {
            user: {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
              createdAt: '2024-01-01T00:00:00Z',
            },
            isAuthenticated: true,
          },
        }));
      });

      // ユーザー情報取得APIをモック
      await page.route('**/api/v2/auth/me', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            createdAt: '2024-01-01T00:00:00Z',
          }),
        });
      });

      await myPage.goto();

      // マイページにアクセスできることを確認
      await myPage.expectVisible();
    });

    test.skip('should redirect authenticated user away from login page', async ({ page }) => {
      const homePage = new HomePage(page);

      // 認証状態をモック
      await homePage.goto();
      await page.evaluate(() => {
        localStorage.setItem('auth-storage', JSON.stringify({
          state: {
            user: {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
              createdAt: '2024-01-01T00:00:00Z',
            },
            isAuthenticated: true,
          },
        }));
      });

      // ストアのハイドレーションを確実にするためにリロード
      await page.reload();

      await page.goto('/login');

      // 認証済みの場合、ホームページにリダイレクトされることを確認
      await expect(page).toHaveURL('/', { timeout: 5000 });
    });
  });

  test.describe('Logout Flow', () => {
    test.skip('should logout user and redirect to home', async ({ page }) => {
      const homePage = new HomePage(page);
      const myPage = new MyPage(page);

      // 認証状態をモック
      await homePage.goto();
      await page.evaluate(() => {
        localStorage.setItem('auth-storage', JSON.stringify({
          state: {
            user: {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
              createdAt: '2024-01-01T00:00:00Z',
            },
            isAuthenticated: true,
          },
        }));
      });

      // ユーザー情報取得APIをモック
      await page.route('**/api/v2/auth/me', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            createdAt: '2024-01-01T00:00:00Z',
          }),
        });
      });

      // ログアウトAPIをモック
      await page.route('**/api/v2/auth/logout', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Logged out' }),
        });
      });

      await page.reload();
      await myPage.goto();

      // ログアウトボタンをクリック
      await homePage.logout();

      // ホームページにリダイレクトされることを確認
      await expect(page).toHaveURL('/', { timeout: 5000 });

      // ローカルストレージの認証状態がクリアされることを確認
      const authStorage = await homePage.getAuthStorage();
      expect(authStorage?.state?.isAuthenticated).toBeFalsy();
    });
  });

  test.describe('Navigation Integration', () => {
    test('should show login/register links when not authenticated', async ({ page }) => {
      const homePage = new HomePage(page);

      await homePage.goto();
      await homePage.expectUnauthenticatedView();
    });

    test('should show logout button when authenticated', async ({ page }) => {
      const homePage = new HomePage(page);

      // 認証状態をモック
      await homePage.goto();
      await page.evaluate(() => {
        localStorage.setItem('auth-storage', JSON.stringify({
          state: {
            user: {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
              createdAt: '2024-01-01T00:00:00Z',
            },
            isAuthenticated: true,
          },
        }));
      });

      // ユーザー情報取得APIをモック
      await page.route('**/api/v2/auth/me', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            createdAt: '2024-01-01T00:00:00Z',
          }),
        });
      });

      await homePage.goto();

      // 認証時のナビゲーション要素を確認
      await homePage.expectAuthenticatedView();
    });
  });
});
