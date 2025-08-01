import { Page, expect } from '@playwright/test';

export interface TestUser {
  id?: string;
  name: string;
  email: string;
  password?: string;
  createdAt?: string;
}

export const testUsers = {
  valid: {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  },
  invalid: {
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
 */
export async function loginUser(page: Page, user: TestUser) {
  // ローカルストレージに認証情報を設定
  await page.goto('/');
  await page.evaluate((userData) => {
    localStorage.setItem('auth-storage', JSON.stringify({
      state: {
        token: 'mock-jwt-token',
        user: {
          id: userData.id || '1',
          name: userData.name,
          email: userData.email,
          createdAt: userData.createdAt || '2024-01-01T00:00:00Z',
        },
      },
    }));
  }, user);

  // ユーザー情報取得APIをモック
  await page.route('**/api/v1/user/profile', async (route) => {
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
 */
export async function mockLoginSuccess(page: Page, user: TestUser) {
  await page.route('**/api/v1/auth/login', async (route) => {
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
 */
export async function mockLoginFailure(page: Page, status: number = 401, message: string = 'Invalid credentials') {
  await page.route('**/api/v1/auth/login', async (route) => {
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
 */
export async function mockRegisterSuccess(page: Page, user: TestUser) {
  await page.route('**/api/v1/auth/register', async (route) => {
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
 * 登録失敗のAPIモックを設定
 */
export async function mockRegisterFailure(page: Page, errors: Record<string, string[]>) {
  await page.route('**/api/v1/auth/register', async (route) => {
    await route.fulfill({
      status: 422,
      contentType: 'application/json',
      body: JSON.stringify({
        errors,
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

  // ローカルストレージにトークンが保存されていることを確認
  const token = await page.evaluate(() => {
    const authStorage = localStorage.getItem('auth-storage');
    return authStorage ? JSON.parse(authStorage).state?.token : null;
  });
  expect(token).toBeTruthy();
}

/**
 * 未認証状態を確認
 */
export async function expectUnauthenticated(page: Page) {
  // ログイン・登録リンクが表示されることを確認
  await expect(page.getByRole('link', { name: /ログイン/ })).toBeVisible({ timeout: 5000 });
  await expect(page.getByRole('link', { name: /新規登録/ })).toBeVisible({ timeout: 5000 });

  // ローカルストレージにトークンが保存されていないことを確認
  const token = await page.evaluate(() => {
    const authStorage = localStorage.getItem('auth-storage');
    return authStorage ? JSON.parse(authStorage).state?.token : null;
  });
  expect(token).toBeFalsy();
}
