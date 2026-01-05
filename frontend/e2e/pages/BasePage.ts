import { Page, expect } from '@playwright/test';

/**
 * Base Page Object with common functionality
 */
export class BasePage {
  constructor(protected page: Page) {}

  // Navigation
  get header() {
    return this.page.getByRole('banner');
  }

  get mainNav() {
    return this.page.getByRole('navigation', { name: 'メインナビゲーション' });
  }

  get homeLink() {
    return this.page.getByRole('link', { name: 'ホームページに戻る' });
  }

  get loginLink() {
    return this.page.getByRole('link', { name: 'ログインページに移動' });
  }

  get registerLink() {
    return this.page.getByRole('link', { name: '新規登録ページに移動' });
  }

  get logoutButton() {
    return this.page.getByRole('button', { name: /ログアウト/ });
  }

  // Actions
  async navigateToHome() {
    await this.homeLink.click();
    await expect(this.page).toHaveURL('/');
  }

  async navigateToLogin() {
    await this.loginLink.click();
    await expect(this.page).toHaveURL('/login');
  }

  async navigateToRegister() {
    await this.registerLink.click();
    await expect(this.page).toHaveURL('/register');
  }

  async logout() {
    await this.logoutButton.click();
  }

  // Assertions
  async expectAuthenticated() {
    await expect(this.logoutButton).toBeVisible({ timeout: 5000 });
  }

  async expectUnauthenticated() {
    await expect(this.loginLink).toBeVisible({ timeout: 5000 });
    await expect(this.registerLink).toBeVisible({ timeout: 5000 });
  }

  // Toast notifications (sonner)
  async expectToast(message: string | RegExp, timeout = 5000) {
    await expect(this.page.getByText(message).first()).toBeVisible({ timeout });
  }

  async expectErrorToast(message: string | RegExp) {
    await this.expectToast(message, 5000);
  }

  async expectSuccessToast(message: string | RegExp) {
    await this.expectToast(message, 5000);
  }

  // Storage helpers
  async clearStorage() {
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  async getAuthStorage() {
    return await this.page.evaluate(() => {
      const storage = localStorage.getItem('auth-storage');
      return storage ? JSON.parse(storage) : null;
    });
  }
}
