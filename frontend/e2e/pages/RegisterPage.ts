import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Register Page Object
 */
export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators (semantic priority: getByRole > getByLabel > getByText)
  get nameInput() {
    return this.page.getByLabel('名前*');
  }

  get emailInput() {
    return this.page.getByLabel('メールアドレス*');
  }

  get passwordInput() {
    return this.page.getByLabel('パスワード*', { exact: true });
  }

  get passwordConfirmationInput() {
    return this.page.getByLabel('パスワード確認*');
  }

  get submitButton() {
    return this.page.getByRole('button', { name: /アカウント作成/ });
  }

  override get loginLink() {
    // 登録ページのメインコンテンツ内のログインリンク
    return this.page.getByRole('main').getByRole('link', { name: 'ログイン' });
  }

  get nameError() {
    return this.page.locator('p').filter({ hasText: /名前/ });
  }

  get emailError() {
    return this.page.locator('p').filter({ hasText: /メールアドレス/ });
  }

  get passwordError() {
    return this.page.locator('p').filter({ hasText: /パスワード/ });
  }

  // Actions
  async goto() {
    await this.page.goto('/register');
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async fillPasswordConfirmation(password: string) {
    await this.passwordConfirmationInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    passwordConfirmation?: string;
  }) {
    await this.fillName(data.name);
    await this.fillEmail(data.email);
    await this.fillPassword(data.password);
    await this.fillPasswordConfirmation(data.passwordConfirmation || data.password);
    await this.submit();
  }

  // Assertions
  async expectVisible() {
    await expect(this.page).toHaveURL('/register');
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.passwordConfirmationInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async expectNameError(message: string | RegExp) {
    await expect(this.nameError.filter({ hasText: message })).toBeVisible();
  }

  async expectEmailError(message: string | RegExp) {
    await expect(this.emailError.filter({ hasText: message })).toBeVisible();
  }

  async expectPasswordError(message: string | RegExp) {
    await expect(this.passwordError.filter({ hasText: message })).toBeVisible();
  }

  async expectPasswordMismatchError() {
    await expect(this.page.getByText(/パスワードが一致しません/)).toBeVisible();
  }

  async expectRegisterSuccess() {
    await expect(this.page).toHaveURL('/');
    await this.expectAuthenticated();
  }

  async expectRegisterError(message: string | RegExp) {
    await this.expectToast(message);
  }

  async expectEmailExistsError() {
    await expect(this.page.getByText(/このメールアドレスは既に使用されています/)).toBeVisible({ timeout: 5000 });
  }
}
