import { test, expect } from '@playwright/test';

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
    // 各テスト前にローカルストレージをクリア
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test.describe('Login Page', () => {
    test('should display login form correctly', async ({ page }) => {
      await page.goto('/login');

      // ページタイトルとフォーム要素の確認
      await expect(page).toHaveTitle(/ログイン/);
      await expect(page.getByRole('heading', { name: /ログイン/ })).toBeVisible();

      // フォーム要素の確認
      await expect(page.getByLabel(/メールアドレス/)).toBeVisible();
      await expect(page.getByLabel(/パスワード/)).toBeVisible();
      await expect(page.getByRole('button', { name: 'ログイン' })).toBeVisible();

      // リンクの確認
      await expect(page.getByRole('link', { name: /新規登録/ })).toBeVisible();
      await expect(page.getByRole('link', { name: /パスワードを忘れた/ })).toBeVisible();
    });

    test('should show validation errors for empty fields', async ({ page }) => {
      await page.goto('/login');

      // 空のフォームで送信
      await page.getByRole('button', { name: 'ログイン' }).click();

      // バリデーションエラーが表示されることを確認
      // Note: React Hook Formのバリデーションはブラウザの標準バリデーションを使用する場合があります
      const emailInput = page.getByLabel(/メールアドレス/);
      const passwordInput = page.getByLabel(/パスワード/);

      await expect(emailInput).toHaveAttribute('required');
      await expect(passwordInput).toHaveAttribute('required');
    });

    test('should handle login with invalid credentials', async ({ page }) => {
      // APIモックを設定
      await page.route('**/api/v1/auth/login', async (route) => {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Invalid credentials',
          }),
        });
      });

      await page.goto('/login');

      // 無効な認証情報でログイン試行
      await page.getByLabel(/メールアドレス/).fill(invalidUser.email);
      await page.getByLabel(/パスワード/).fill(invalidUser.password);
      await page.getByRole('button', { name: 'ログイン' }).click();

      // エラーメッセージまたはトーストが表示されることを確認
      await expect(page.locator('text=メールアドレスまたはパスワードが正しくありません')).toBeVisible({ timeout: 5000 });
    });

    test('should handle successful login', async ({ page }) => {
      // APIモックを設定
      await page.route('**/api/v1/auth/login', async (route) => {
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

      await page.goto('/login');

      // 有効な認証情報でログイン
      await page.getByLabel(/メールアドレス/).fill(testUser.email);
      await page.getByLabel(/パスワード/).fill(testUser.password);
      await page.getByRole('button', { name: 'ログイン' }).click();

      // 成功メッセージまたはリダイレクトを確認
      await expect(page).toHaveURL('/mypage', { timeout: 5000 });

      // ローカルストレージにトークンが保存されることを確認
      const token = await page.evaluate(() => localStorage.getItem('auth-storage'));
      expect(token).toBeTruthy();
    });
  });

  test.describe('Registration Page', () => {
    test('should display registration form correctly', async ({ page }) => {
      await page.goto('/register');

      // ページタイトルとフォーム要素の確認
      await expect(page).toHaveTitle(/新規登録/);
      await expect(page.getByRole('heading', { name: /新規登録/ })).toBeVisible();

      // フォーム要素の確認
      await expect(page.getByLabel(/名前/)).toBeVisible();
      await expect(page.getByLabel(/メールアドレス/)).toBeVisible();
      await expect(page.getByLabel('パスワード', { exact: true })).toBeVisible();
      await expect(page.getByLabel(/パスワード確認/)).toBeVisible();
      await expect(page.getByRole('button', { name: /アカウント作成/ })).toBeVisible();

      // ログインリンクの確認
      await expect(page.getByRole('link', { name: /ログイン/ })).toBeVisible();
    });

    test('should show validation error for password mismatch', async ({ page }) => {
      await page.goto('/register');

      // パスワードが一致しない場合
      await page.getByLabel(/名前/).fill(testUser.name);
      await page.getByLabel(/メールアドレス/).fill(testUser.email);
      await page.getByLabel('パスワード', { exact: true }).fill(testUser.password);
      await page.getByLabel(/パスワード確認/).fill('differentpassword');

      await page.getByRole('button', { name: /アカウント作成/ }).click();

      // パスワード不一致エラーが表示されることを確認
      await expect(page.locator('text=パスワードが一致しません')).toBeVisible({ timeout: 3000 });
    });

    test('should handle successful registration', async ({ page }) => {
      // APIモックを設定
      await page.route('**/api/v1/auth/register', async (route) => {
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

      await page.goto('/register');

      // 有効な情報で登録
      await page.getByLabel(/名前/).fill(testUser.name);
      await page.getByLabel(/メールアドレス/).fill(testUser.email);
      await page.getByLabel('パスワード', { exact: true }).fill(testUser.password);
      await page.getByLabel(/パスワード確認/).fill(testUser.password);

      await page.getByRole('button', { name: /アカウント作成/ }).click();

      // 成功後のリダイレクトを確認
      await expect(page).toHaveURL('/mypage', { timeout: 5000 });

      // ローカルストレージにトークンが保存されることを確認
      const token = await page.evaluate(() => localStorage.getItem('auth-storage'));
      expect(token).toBeTruthy();
    });

    test('should handle registration with existing email', async ({ page }) => {
      // APIモックを設定
      await page.route('**/api/v1/auth/register', async (route) => {
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

      await page.goto('/register');

      // 既存のメールアドレスで登録試行
      await page.getByLabel(/名前/).fill(testUser.name);
      await page.getByLabel(/メールアドレス/).fill(testUser.email);
      await page.getByLabel('パスワード', { exact: true }).fill(testUser.password);
      await page.getByLabel(/パスワード確認/).fill(testUser.password);

      await page.getByRole('button', { name: /アカウント作成/ }).click();

      // エラーメッセージが表示されることを確認
      await expect(page.locator('text=このメールアドレスは既に使用されています')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Authentication Guard', () => {
    test('should redirect unauthenticated user to login', async ({ page }) => {
      await page.goto('/mypage');

      // 未認証の場合、ログインページにリダイレクトされることを確認
      await expect(page).toHaveURL('/login', { timeout: 5000 });
    });

    test('should allow authenticated user to access protected pages', async ({ page }) => {
      // 認証状態をモック
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.setItem('auth-storage', JSON.stringify({
          state: {
            token: 'mock-jwt-token',
            user: {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
              createdAt: '2024-01-01T00:00:00Z',
            },
          },
        }));
      });

      // ユーザー情報取得APIをモック
      await page.route('**/api/v1/user/profile', async (route) => {
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

      await page.goto('/mypage');

      // マイページにアクセスできることを確認
      await expect(page).toHaveURL('/mypage');
      await expect(page.getByRole('heading', { name: /マイページ/ })).toBeVisible({ timeout: 5000 });
    });

    test('should redirect authenticated user away from login page', async ({ page }) => {
      // 認証状態をモック
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.setItem('auth-storage', JSON.stringify({
          state: {
            token: 'mock-jwt-token',
            user: {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
              createdAt: '2024-01-01T00:00:00Z',
            },
          },
        }));
      });

      await page.goto('/login');

      // 認証済みの場合、マイページにリダイレクトされることを確認
      await expect(page).toHaveURL('/mypage', { timeout: 5000 });
    });
  });

  test.describe('Logout Flow', () => {
    test('should logout user and redirect to home', async ({ page }) => {
      // 認証状態をモック
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.setItem('auth-storage', JSON.stringify({
          state: {
            token: 'mock-jwt-token',
            user: {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
              createdAt: '2024-01-01T00:00:00Z',
            },
          },
        }));
      });

      // ユーザー情報取得APIをモック
      await page.route('**/api/v1/user/profile', async (route) => {
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

      await page.goto('/mypage');

      // ログアウトボタンをクリック
      await page.getByRole('button', { name: /ログアウト/ }).click();

      // ホームページにリダイレクトされることを確認
      await expect(page).toHaveURL('/', { timeout: 5000 });

      // ローカルストレージがクリアされることを確認
      const token = await page.evaluate(() => localStorage.getItem('auth-storage'));
      expect(token).toBeFalsy();
    });
  });

  test.describe('Navigation Integration', () => {
    test('should show login/register links when not authenticated', async ({ page }) => {
      await page.goto('/');

      // 未認証時のナビゲーションリンクを確認
      await expect(page.getByRole('link', { name: /ログイン/ })).toBeVisible();
      await expect(page.getByRole('link', { name: /新規登録/ })).toBeVisible();
    });

    test('should show logout button when authenticated', async ({ page }) => {
      // 認証状態をモック
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.setItem('auth-storage', JSON.stringify({
          state: {
            token: 'mock-jwt-token',
            user: {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
              createdAt: '2024-01-01T00:00:00Z',
            },
          },
        }));
      });

      // ユーザー情報取得APIをモック
      await page.route('**/api/v1/user/profile', async (route) => {
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

      await page.goto('/');

      // 認証時のナビゲーション要素を確認
      await expect(page.getByRole('button', { name: /ログアウト/ })).toBeVisible({ timeout: 5000 });
      await expect(page.getByRole('link', { name: /ログイン/ })).not.toBeVisible();
      await expect(page.getByRole('link', { name: /新規登録/ })).not.toBeVisible();
    });
  });
});
