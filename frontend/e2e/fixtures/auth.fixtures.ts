import { test as base, Page } from '@playwright/test';
import { loginUser, testUsers } from '../helpers/auth-helpers';

/**
 * Extended test fixtures with authentication states
 *
 * Usage:
 * ```typescript
 * import { test, expect } from './fixtures/auth.fixtures';
 *
 * test('authenticated user can access mypage', async ({ authenticatedPage }) => {
 *   await authenticatedPage.goto('/mypage');
 *   await expect(authenticatedPage).toHaveURL('/mypage');
 * });
 * ```
 */
export const test = base.extend<{
  /**
   * Page with authenticated user (valid test user)
   */
  authenticatedPage: Page;
}>({
  authenticatedPage: async ({ page }, use) => {
    // Clear storage before setting up auth state
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Set up authenticated state
    await loginUser(page, testUsers.valid);

    // Use the page in tests
    await use(page);

    // Cleanup after test (optional)
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  },
});

// Re-export expect for convenience
export { expect } from '@playwright/test';

// Re-export Page Objects for convenience
export { LoginPage } from '../pages/LoginPage';
export { RegisterPage } from '../pages/RegisterPage';
export { HomePage } from '../pages/HomePage';
export { SearchPage, TeamSearchPage, MatchSearchPage } from '../pages/SearchPage';
export { BasePage } from '../pages/BasePage';
