import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Search Page Object (Team/Match Search)
 */
export class SearchPage extends BasePage {
  constructor(
    page: Page,
    protected searchType: 'team' | 'match' = 'team'
  ) {
    super(page);
  }

  // Locators
  get pageHeading() {
    const headingName = this.searchType === 'team' ? 'チームデータ検索' : 'マッチデータ検索';
    return this.page.getByRole('heading', { name: headingName });
  }

  get subTitle() {
    const subTitleText = this.searchType === 'team' ? 'TEAM DATA SEARCH' : 'MATCH DATA SEARCH';
    return this.page.getByText(subTitleText);
  }

  get keywordInput() {
    return this.page.getByLabel('検索キーワード');
  }

  get searchButton() {
    return this.page.getByRole('button', { name: '検索', exact: true });
  }

  get clearButton() {
    return this.page.getByLabel('検索をクリア');
  }

  get resultsTable() {
    // The table is a grid-based div layout with download buttons
    // We use the presence of download buttons as a marker for results
    return this.page.getByLabel(/をダウンロード/).first().locator('..');
  }

  get resultRows() {
    // Result rows contain download buttons - count them
    return this.page.getByLabel(/をダウンロード/);
  }

  get resultsContainer() {
    // Container for both table and card views
    return this.page.locator('.w-full.mt-8').first();
  }

  get pagination() {
    return this.page.getByRole('navigation', { name: /ページネーション/ });
  }

  get prevButton() {
    return this.page.getByRole('button', { name: '前へ' });
  }

  get nextButton() {
    return this.page.getByRole('button', { name: '次へ' });
  }

  get noResultsMessage() {
    return this.page.getByText(/検索結果が見つかりませんでした/);
  }

  get noResultsHint() {
    return this.page.getByText(/別のキーワードで検索してみてください/);
  }

  get loadingIndicator() {
    return this.page.getByRole('status');
  }

  get deletePasswordInput() {
    return this.page.getByPlaceholder('削除パスワード');
  }

  get deleteConfirmButton() {
    return this.page.getByRole('button', { name: '削除実行' });
  }

  get sortButton() {
    return this.page.getByRole('button', { name: /新しい順|古い順/ });
  }

  get sortButtonDesc() {
    return this.page.getByRole('button', { name: '新しい順' });
  }

  get sortButtonAsc() {
    return this.page.getByRole('button', { name: '古い順' });
  }

  get tableHeaderSortButton() {
    return this.page.getByRole('button', { name: /アップロード日時/ });
  }

  get viewToggleTableButton() {
    return this.page.getByRole('button', { name: 'テーブル表示' });
  }

  get viewToggleCardButton() {
    return this.page.getByRole('button', { name: 'カード表示' });
  }

  // Actions
  async goto() {
    await this.page.goto(`/search/${this.searchType}`);
  }

  async gotoWithParams(keyword: string, page: number = 1) {
    await this.page.goto(`/search/${this.searchType}?keyword=${encodeURIComponent(keyword)}&page=${page}`);
  }

  async fillKeyword(keyword: string) {
    await this.keywordInput.fill(keyword);
  }

  async submitSearch() {
    await this.searchButton.click();
  }

  async search(keyword: string) {
    await this.fillKeyword(keyword);
    await this.submitSearch();
  }

  async searchWithEnter(keyword: string) {
    await this.keywordInput.click();
    await this.keywordInput.fill(keyword);
    await this.keywordInput.press('Enter');
  }

  async clearSearch() {
    await this.clearButton.click();
  }

  async goToNextPage() {
    await this.nextButton.click();
  }

  async goToPrevPage() {
    await this.prevButton.click();
  }

  async clickResult(index: number) {
    await this.resultRows.nth(index).click();
  }

  async clickDownloadButton(fileName: string) {
    return this.page.getByLabel(`${fileName}をダウンロード`);
  }

  async clickDeleteButton(fileName: string) {
    return this.page.getByLabel(`${fileName}を削除`);
  }

  async confirmDelete(password: string) {
    await this.deletePasswordInput.fill(password);
    await this.deleteConfirmButton.click();
  }

  async clickSortButton() {
    await this.sortButton.first().click();
  }

  async clickTableHeaderSort() {
    await this.tableHeaderSortButton.click();
  }

  async switchToTableView() {
    await this.viewToggleTableButton.click();
  }

  async switchToCardView() {
    await this.viewToggleCardButton.click();
  }

  getPageButton(pageNumber: number) {
    return this.page.getByRole('button', { name: String(pageNumber), exact: true });
  }

  // Assertions
  async expectVisible() {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.subTitle).toBeVisible();
    await expect(this.keywordInput).toBeVisible();
    await expect(this.searchButton).toBeVisible();
  }

  async expectSearchButtonDisabled() {
    await expect(this.searchButton).toBeDisabled();
  }

  async expectSearchButtonEnabled() {
    await expect(this.searchButton).toBeEnabled();
  }

  async expectResults(minCount = 1) {
    // Wait for results to appear (check for download buttons)
    await expect(this.resultRows.first()).toBeVisible({ timeout: 10000 });
    // Verify we have at least the minimum count
    const count = await this.resultRows.count();
    expect(count).toBeGreaterThanOrEqual(minCount);
  }

  async expectResultsInfo(total: number, currentPage: number, totalPages: number) {
    await expect(this.page.getByText(`${total}件の結果 (ページ ${currentPage}/${totalPages})`)).toBeVisible();
  }

  async expectNoResults() {
    await expect(this.noResultsMessage).toBeVisible();
    await expect(this.noResultsHint).toBeVisible();
  }

  async expectLoading() {
    await expect(this.loadingIndicator).toBeVisible();
  }

  async expectUrlContainsKeyword(keyword?: string) {
    if (keyword) {
      // RegExpメタ文字をエスケープしてReDoS脆弱性を防止
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      await expect(this.page).toHaveURL(new RegExp(`keyword=${escaped}`));
    } else {
      await expect(this.page).toHaveURL(/keyword=/);
    }
  }

  async expectUrlContainsPage(page: number) {
    await expect(this.page).toHaveURL(new RegExp(`page=${page}`));
  }

  async expectKeywordValue(keyword: string) {
    await expect(this.keywordInput).toHaveValue(keyword);
  }

  async expectResultText(text: string) {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  async expectTag(tag: string) {
    await expect(this.page.getByText(tag)).toBeVisible();
  }

  async expectPaginationVisible() {
    await expect(this.prevButton).toBeVisible();
    await expect(this.nextButton).toBeVisible();
  }

  async expectPrevButtonDisabled() {
    await expect(this.prevButton).toBeDisabled();
  }

  async expectDeleteModal(fileName: string) {
    await expect(this.page.getByText(`${fileName}を本当に削除しますか？`)).toBeVisible();
  }

  async expectSearchError() {
    const errorMessage = this.searchType === 'team' ? 'チーム検索に失敗しました' : 'マッチ検索に失敗しました';
    await expect(this.page.getByText(errorMessage)).toBeVisible({ timeout: 10000 });
  }

  async expectSortButtonVisible() {
    await expect(this.sortButton.first()).toBeVisible();
  }

  async expectSortOrder(order: 'asc' | 'desc') {
    const buttonText = order === 'desc' ? '新しい順' : '古い順';
    await expect(this.page.getByRole('button', { name: buttonText }).first()).toBeVisible();
  }

  async expectUrlContainsSortOrder(order: 'asc' | 'desc') {
    await expect(this.page).toHaveURL(new RegExp(`sort=${order}`));
  }
}

/**
 * Team Search Page Object
 */
export class TeamSearchPage extends SearchPage {
  constructor(page: Page) {
    super(page, 'team');
  }
}

/**
 * Match Search Page Object
 */
export class MatchSearchPage extends SearchPage {
  constructor(page: Page) {
    super(page, 'match');
  }
}
