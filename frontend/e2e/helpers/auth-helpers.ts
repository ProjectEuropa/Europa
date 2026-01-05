import { Page, expect } from '@playwright/test';

export interface TestUser {
  id?: string;
  name: string;
  email: string;
  password?: string;
  createdAt?: string;
}

/**
 * Check if we're running with a real API (Neon database)
 * When E2E_API_URL is set, we use real API calls instead of mocks
 */
export const useRealApi = !!process.env.E2E_API_URL;

/**
 * Generate a unique email address for registration tests
 * Uses timestamp and random string to ensure uniqueness across test runs
 */
export function generateUniqueEmail(prefix: string = 'e2e-register'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}@test.com`;
}

/**
 * Generate a unique test user for registration tests
 */
export function generateUniqueTestUser(): TestUser & { password: string } {
  return {
    name: 'E2E New User',
    email: generateUniqueEmail(),
    password: 'password123',
  };
}

/**
 * Test users - uses seed data credentials when running with real API
 */
export const testUsers = useRealApi
  ? {
      // Credentials from seed-e2e.sql
      valid: {
        name: 'E2E Test User',
        email: 'e2e@test.com',
        password: 'password123',
      },
      invalid: {
        name: 'Invalid User',
        email: 'invalid@example.com',
        password: 'wrongpassword',
      },
      existing: {
        name: 'E2E Admin User',
        email: 'e2e-admin@test.com',
        password: 'password123',
      },
    }
  : {
      // Mock test users
      valid: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      },
      invalid: {
        name: 'Invalid User',
        email: 'invalid@example.com',
        password: 'wrongpassword',
      },
      existing: {
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123',
      },
    };

/**
 * ユーザーをログイン状態にする
 * When useRealApi is true, performs actual login via API
 */
export async function loginUser(page: Page, user: TestUser) {
  if (useRealApi) {
    // Perform real login via API
    const { LoginPage } = await import('../pages/LoginPage');
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.email, user.password!);
    // Wait for redirect after successful login
    await page.waitForURL(/\/(mypage)?$/, { timeout: 10000 });
    return;
  }

  // Mock mode: set localStorage directly
  await page.goto('/');
  await page.evaluate((userData) => {
    localStorage.setItem('auth-storage', JSON.stringify({
      state: {
        user: {
          id: userData.id || '1',
          name: userData.name,
          email: userData.email,
          createdAt: userData.createdAt || '2024-01-01T00:00:00Z',
        },
        isAuthenticated: true,
      },
    }));
  }, user);

  // ユーザー情報取得APIをモック
  await page.route('**/api/v2/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: user.id || '1',
        name: user.name,
        email: user.email,
        createdAt: user.createdAt || '2024-01-01T00:00:00Z',
      }),
    });
  });
}

/**
 * ユーザーをログアウト状態にする
 */
export async function logoutUser(page: Page) {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * ログイン成功のAPIモックを設定
 * When useRealApi is true, this is a no-op (real API will be used)
 */
export async function mockLoginSuccess(page: Page, user: TestUser) {
  if (useRealApi) return; // Use real API

  await page.route('**/api/v2/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        token: 'mock-jwt-token',
        user: {
          id: user.id || '1',
          name: user.name,
          email: user.email,
          createdAt: user.createdAt || '2024-01-01T00:00:00Z',
        },
      }),
    });
  });
}

/**
 * ログイン失敗のAPIモックを設定
 * When useRealApi is true, this is a no-op (real API will return actual errors)
 */
export async function mockLoginFailure(page: Page, status: number = 401, message: string = 'Invalid credentials') {
  if (useRealApi) return; // Use real API - invalid credentials will fail naturally

  await page.route('**/api/v2/auth/login', async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify({
        message,
        ...(status === 422 && {
          errors: {
            email: ['メールアドレスまたはパスワードが正しくありません'],
            password: ['メールアドレスまたはパスワードが正しくありません'],
          },
        }),
      }),
    });
  });
}

/**
 * 登録成功のAPIモックを設定
 * When useRealApi is true, this is a no-op (real API will be used)
 * Note: In real API mode, registration tests should use unique emails
 */
export async function mockRegisterSuccess(page: Page, user: TestUser) {
  if (useRealApi) return; // Use real API

  await page.route('**/api/v2/auth/register', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        token: 'mock-jwt-token',
        user: {
          id: user.id || '1',
          name: user.name,
          email: user.email,
          createdAt: user.createdAt || '2024-01-01T00:00:00Z',
        },
      }),
    });
  });
}

/**
 * フォームにログイン情報を入力
 */
export async function fillLoginForm(page: Page, email: string, password: string) {
  await page.locator('input#email').fill(email);
  await page.locator('input#password').fill(password);
}

/**
 * フォームに登録情報を入力
 */
export async function fillRegisterForm(page: Page, user: TestUser & { passwordConfirmation?: string }) {
  await page.getByLabel(/名前/).fill(user.name);
  await page.getByLabel(/メールアドレス/).fill(user.email);
  if (user.password) {
    await page.locator('input#password').fill(user.password);
    await page.locator('input#passwordConfirmation').fill(user.passwordConfirmation || user.password);
  }
}

/**
 * 認証状態を確認
 */
export async function expectAuthenticated(page: Page) {
  // ログアウトボタンが表示されることを確認
  await expect(page.getByRole('button', { name: /ログアウト/ })).toBeVisible({ timeout: 5000 });

  // ローカルストレージに認証状態が保存されていることを確認
  // Note: tokenは永続化されない設定のため、isAuthenticatedとuserで確認
  const isAuthenticated = await page.evaluate(() => {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return false;
    const parsed = JSON.parse(authStorage);
    return parsed.state?.isAuthenticated && parsed.state?.user;
  });
  expect(isAuthenticated).toBeTruthy();
}

/**
 * 未認証状態を確認
 */
export async function expectUnauthenticated(page: Page) {
  // ログイン・登録リンクが表示されることを確認
  await expect(page.getByRole('link', { name: 'ログインページに移動' })).toBeVisible({ timeout: 5000 });
  await expect(page.getByRole('link', { name: '新規登録ページに移動' })).toBeVisible({ timeout: 5000 });

  // ローカルストレージに認証状態が保存されていないことを確認
  const isAuthenticated = await page.evaluate(() => {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return false;
    const parsed = JSON.parse(authStorage);
    return parsed.state?.isAuthenticated;
  });
  expect(isAuthenticated).toBeFalsy();
}
