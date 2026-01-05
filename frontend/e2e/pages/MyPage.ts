import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * MyPage Page Object
 */
export class MyPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators
  get heading() {
    return this.page.getByRole('heading', { name: /マイページ/ });
  }

  // Actions
  async goto() {
    await this.page.goto('/mypage');
  }

  // Assertions
  async expectVisible() {
    await expect(this.page).toHaveURL('/mypage');
    await expect(this.heading).toBeVisible({ timeout: 5000 });
  }
}
