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
    return this.page.getByRole('region', { name: /ヒーローセクション/i });
  }

  get featuresSection() {
    // セマンティックロケータでFeaturesSectionを取得（aria-label="主な機能"）
    return this.page.getByRole('region', { name: /主な機能/i });
  }

  get searchTeamLink() {
    // FeaturesSection内の「チームデータ検索」リンク（セクション内でユニーク）
    return this.featuresSection.getByRole('link', { name: /チームデータ検索/ });
  }

  get searchMatchLink() {
    // FeaturesSection内の「マッチデータ検索」リンク（セクション内でユニーク）
    return this.featuresSection.getByRole('link', { name: /マッチデータ検索/ });
  }

  get uploadLink() {
    // FeaturesSection内の「アップロード」リンク（セクション内でユニーク）
    return this.featuresSection.getByRole('link', { name: /アップロード/ });
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
