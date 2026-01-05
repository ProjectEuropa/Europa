/**
 * Page Object Model exports
 *
 * Usage:
 * ```typescript
 * import { LoginPage, RegisterPage, HomePage } from './pages';
 *
 * test('login flow', async ({ page }) => {
 *   const loginPage = new LoginPage(page);
 *   await loginPage.goto();
 *   await loginPage.login('test@example.com', 'password');
 * });
 * ```
 */

export { BasePage } from './BasePage';
export { LoginPage } from './LoginPage';
export { RegisterPage } from './RegisterPage';
export { HomePage } from './HomePage';
export { MyPage } from './MyPage';
export { SearchPage, TeamSearchPage, MatchSearchPage } from './SearchPage';
