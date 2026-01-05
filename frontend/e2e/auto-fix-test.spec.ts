import { test, expect } from '@playwright/test';

/**
 * 自動修復ワークフローのテスト用
 * このテストは意図的に失敗するように設計されています
 *
 * 目的: e2e-auto-fix.yml ワークフローが正しく動作するか確認
 *
 * 期待される修正:
 * - 存在しないボタン名 "存在しないボタン" → 実際のボタン名に修正
 */
test.describe('Auto Fix Test', () => {
  test('should fail with wrong locator for auto-fix workflow test', async ({ page }) => {
    await page.goto('/login');

    // このロケータは存在しないため、確実に失敗する
    const nonExistentButton = page.getByRole('button', { name: '存在しないボタン', exact: true });

    // 5秒でタイムアウト（即座に失敗）
    await expect(nonExistentButton).toBeVisible({ timeout: 5000 });
  });
});
