import { test, expect } from '@playwright/test';

/**
 * 自動修復ワークフローをテストするための意図的に失敗するテスト
 * このテストは間違ったボタン名を使用しているため失敗します
 * Claude Codeが正しいボタン名「ログイン」に修正することを期待
 */
test('should fail with wrong button name', async ({ page }) => {
  await page.goto('/login');

  // 正しいボタン名でテスト
  const button = page.getByRole('button', { name: 'ログイン' });
  await expect(button).toBeVisible({ timeout: 1000 });
});
