import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Home Page Object
 */
export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators
  get heroSection() {
    return this.page.getByRole('region', { name: /hero/i }).or(this.page.locator('section').first());
  }

  get featuresSection() {
    return this.page.locator('#features');
  }

  get searchTeamLink() {
    // FeaturesSection内の「チームデータ検索」リンクを特定
    return this.featuresSection.getByRole('link', { name: /チームデータ検索/ }).first();
  }

  get searchMatchLink() {
    // FeaturesSection内の「マッチデータ検索」リンクを特定
    return this.featuresSection.getByRole('link', { name: /マッチデータ検索/ }).first();
  }

  get uploadLink() {
    // FeaturesSection内の「アップロード」リンクを特定
    return this.featuresSection.getByRole('link', { name: /アップロード/ }).first();
  }

  // Actions
  async goto() {
    await this.page.goto('/');
  }

  async navigateToTeamSearch() {
    await this.searchTeamLink.click();
    await expect(this.page).toHaveURL('/search/team');
  }

  async navigateToMatchSearch() {
    await this.searchMatchLink.click();
    await expect(this.page).toHaveURL('/search/match');
  }

  async navigateToUpload() {
    await this.uploadLink.click();
    await expect(this.page).toHaveURL('/upload');
  }

  // Assertions
  async expectVisible() {
    await expect(this.page).toHaveURL('/');
    await expect(this.homeLink).toBeVisible();
  }

  async expectAuthenticatedView() {
    await this.expectAuthenticated();
  }

  async expectUnauthenticatedView() {
    await this.expectUnauthenticated();
  }
}
