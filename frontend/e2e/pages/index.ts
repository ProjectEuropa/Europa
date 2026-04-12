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
export { EventPage } from './EventPage';
export { HomePage } from './HomePage';
export { LoginPage } from './LoginPage';
export { MyPage } from './MyPage';
export { RegisterPage } from './RegisterPage';
export { MatchSearchPage, SearchPage, TeamSearchPage } from './SearchPage';
export { MatchUploadPage, TeamUploadPage, UploadPage } from './UploadPage';
