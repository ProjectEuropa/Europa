import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login Page Object
 */
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators (semantic priority: getByRole > getByLabel > getByText)
  get emailInput() {
    return this.page.getByRole('textbox', { name: /メールアドレス/ });
  }

  get passwordInput() {
    return this.page.getByLabel('パスワード*');
  }

  get submitButton() {
    return this.page.getByRole('button', { name: 'ログイン', exact: true });
  }

  override get registerLink() {
    // ログインページのメインコンテンツ内の新規登録リンク
    return this.page.getByRole('main').getByRole('link', { name: '新規登録' });
  }

  get forgotPasswordLink() {
    return this.page.getByRole('link', { name: /パスワードをお忘れ/ });
  }

  get emailError() {
    return this.page.locator('p').filter({ hasText: /メールアドレス/ });
  }

  get passwordError() {
    return this.page.locator('p').filter({ hasText: /パスワード/ });
  }

  // Actions
  async goto() {
    await this.page.goto('/login');
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  // Assertions
  async expectVisible() {
    await expect(this.page).toHaveURL('/login');
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async expectEmailError(message: string | RegExp) {
    await expect(this.emailError.filter({ hasText: message })).toBeVisible();
  }

  async expectPasswordError(message: string | RegExp) {
    await expect(this.passwordError.filter({ hasText: message })).toBeVisible();
  }

  async expectLoginSuccess() {
    await expect(this.page).toHaveURL('/');
    await this.expectAuthenticated();
  }

  async expectLoginError(message: string | RegExp = /メールアドレスまたはパスワードが正しくありません/) {
    await this.expectToast(message);
  }
}
