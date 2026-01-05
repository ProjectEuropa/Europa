import { test, expect } from '@playwright/test';

/**
 * 自動修復ワークフローのテスト用
 * このテストは意図的に失敗するように設計されています
 *
 * 目的: e2e-auto-fix.yml ワークフローが正しく動作するか確認
 *
 * 期待される修正:
 * - "間違ったボタン" → "ログイン" に修正
 */
test.describe('Auto Fix Test', () => {
  test('should fail with wrong button name', async ({ page }) => {
    await page.goto('/login');

    // 修正: "間違ったボタン" → "ログイン"
    const button = page.getByRole('button', { name: 'ログイン' });
    await expect(button).toBeVisible({ timeout: 1000 });
  });
});
