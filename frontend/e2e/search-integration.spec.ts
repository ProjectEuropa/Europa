import { test, expect } from '@playwright/test';
import { TeamSearchPage, MatchSearchPage } from './pages/SearchPage';

test.describe('検索機能の統合テスト', () => {
  test.beforeEach(async ({ page }) => {
    const teamSearchPage = new TeamSearchPage(page);
    await teamSearchPage.goto();
  });

  test('チーム検索の基本フロー', async ({ page }) => {
    const teamSearchPage = new TeamSearchPage(page);

    // ページ要素の確認
    await teamSearchPage.expectVisible();

    // 初期状態では検索ボタンが無効
    await teamSearchPage.expectSearchButtonDisabled();

    // 検索キーワードを入力
    await teamSearchPage.fillKeyword('テストチーム');
    await teamSearchPage.expectSearchButtonEnabled();

    // 検索実行
    await teamSearchPage.submitSearch();

    // URLが更新されることを確認
    await teamSearchPage.expectUrlContainsKeyword();
    await teamSearchPage.expectUrlContainsPage(1);

    // 検索結果の表示を待機
    await page.waitForLoadState('networkidle');
  });

  test('マッチ検索の基本フロー', async ({ page }) => {
    const matchSearchPage = new MatchSearchPage(page);

    await matchSearchPage.goto();

    // ページ要素の確認
    await matchSearchPage.expectVisible();

    // 検索実行
    await matchSearchPage.search('テストマッチ');

    // URLが更新されることを確認
    await matchSearchPage.expectUrlContainsKeyword();
  });

  test('検索フォームのバリデーション', async ({ page }) => {
    const teamSearchPage = new TeamSearchPage(page);

    // 空の状態では検索ボタンが無効
    await teamSearchPage.expectSearchButtonDisabled();

    // 空白のみの入力では検索ボタンが無効
    await teamSearchPage.fillKeyword('   ');
    await teamSearchPage.expectSearchButtonDisabled();

    // 有効な入力では検索ボタンが有効
    await teamSearchPage.fillKeyword('有効な検索語');
    await teamSearchPage.expectSearchButtonEnabled();

    // クリアボタンの動作
    await expect(teamSearchPage.clearButton).toBeVisible();
    await teamSearchPage.clearSearch();
    await teamSearchPage.expectKeywordValue('');
    await teamSearchPage.expectSearchButtonDisabled();
  });

  test('検索結果の表示とページネーション', async ({ page }) => {
    const teamSearchPage = new TeamSearchPage(page);

    // モックデータがある場合の検索 (v2 API format)
    await page.route('**/api/v2/files*', async (route) => {
      const url = route.request().url();
      if (url.includes('data_type=1')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              files: [
                {
                  id: 1,
                  file_name: 'test-team-1.oke',
                  upload_owner_name: 'testuser1',
                  file_comment: 'テストチームファイル1',
                  downloadable_at: '2024-01-01T10:00:00Z',
                  created_at: '2024-01-01T09:00:00Z',
                  updated_at: '2024-01-01T09:00:00Z',
                  tags: ['tag1', 'tag2'],
                },
                {
                  id: 2,
                  file_name: 'test-team-2.oke',
                  upload_owner_name: 'testuser2',
                  file_comment: 'テストチームファイル2',
                  downloadable_at: '2024-01-01T11:00:00Z',
                  created_at: '2024-01-01T10:00:00Z',
                  updated_at: '2024-01-01T10:00:00Z',
                  tags: ['tag3'],
                },
              ],
              pagination: {
                page: 1,
                limit: 10,
                total: 25,
              },
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    // 検索実行
    await teamSearchPage.search('test');

    // 検索結果の確認
    await teamSearchPage.expectResultsInfo(25, 1, 3);
    await teamSearchPage.expectResultText('test-team-1.oke');
    await teamSearchPage.expectResultText('test-team-2.oke');
    await teamSearchPage.expectResultText('testuser1');
    await teamSearchPage.expectResultText('testuser2');

    // タグの表示確認
    await teamSearchPage.expectTag('tag1');
    await teamSearchPage.expectTag('tag2');
    await teamSearchPage.expectTag('tag3');

    // ページネーションの確認
    await teamSearchPage.expectPaginationVisible();
    await expect(teamSearchPage.getPageButton(1)).toBeVisible();
    await expect(teamSearchPage.getPageButton(2)).toBeVisible();
    await expect(teamSearchPage.getPageButton(3)).toBeVisible();

    // 前へボタンが無効であることを確認（1ページ目）
    await teamSearchPage.expectPrevButtonDisabled();
  });

  test('検索結果が空の場合', async ({ page }) => {
    const teamSearchPage = new TeamSearchPage(page);

    // 空の結果を返すモック (v2 API format)
    await page.route('**/api/v2/files*', async (route) => {
      const url = route.request().url();
      if (url.includes('data_type=1')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              files: [],
              pagination: {
                page: 1,
                limit: 10,
                total: 0,
              },
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    // 検索実行
    await teamSearchPage.search('存在しないファイル');

    // 空の状態メッセージの確認
    await teamSearchPage.expectNoResults();
  });

  test('検索エラーの処理', async ({ page }) => {
    const teamSearchPage = new TeamSearchPage(page);

    // ページにアクセスする前にモックを設定
    await page.route('**/api/v2/files*', async (route) => {
      const url = route.request().url();
      if (url.includes('data_type=1') && url.includes('keyword=')) {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Internal Server Error',
          }),
        });
      } else {
        await route.continue();
      }
    });

    // 検索ページに移動
    await teamSearchPage.goto();

    // 検索実行
    await teamSearchPage.search('エラーテスト');

    // エラーメッセージの確認
    await teamSearchPage.expectSearchError();
  });

  test('ダウンロード機能', async ({ page }) => {
    const teamSearchPage = new TeamSearchPage(page);

    // 検索結果のモック (v2 API format)
    await page.route('**/api/v2/files*', async (route) => {
      const url = route.request().url();
      if (url.includes('data_type=1') && route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              files: [
                {
                  id: 1,
                  file_name: 'downloadable-team.oke',
                  upload_owner_name: 'testuser',
                  file_comment: 'ダウンロード可能なファイル',
                  downloadable_at: '2024-01-01T10:00:00Z',
                  created_at: '2024-01-01T09:00:00Z',
                  updated_at: '2024-01-01T09:00:00Z',
                  tags: [],
                },
              ],
              pagination: {
                page: 1,
                limit: 10,
                total: 1,
              },
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    // ダウンロードAPIのモック (v2 format)
    await page.route('**/api/v2/files/1', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/octet-stream',
          body: 'mock file content',
          headers: {
            'Content-Disposition': 'attachment; filename="downloadable-team.oke"',
          },
        });
      } else {
        await route.continue();
      }
    });

    // 検索実行
    await teamSearchPage.search('downloadable');

    // ダウンロードボタンをクリック
    const downloadButton = await teamSearchPage.clickDownloadButton('downloadable-team.oke');
    await expect(downloadButton).toBeVisible();

    // ダウンロードの開始を監視
    const downloadPromise = page.waitForEvent('download');
    await downloadButton.click();

    // ダウンロードが開始されることを確認
    const download = await downloadPromise;
    const filename = download.suggestedFilename();
    expect(filename).toBeTruthy();
    expect(filename === 'downloadable-team.oke' || filename.startsWith('file_')).toBe(true);
  });

  test('削除機能', async ({ page }) => {
    const teamSearchPage = new TeamSearchPage(page);

    // 検索結果のモック（削除可能なファイル）(v2 API format)
    await page.route('**/api/v2/files*', async (route) => {
      const url = route.request().url();
      if (url.includes('data_type=1') && route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              files: [
                {
                  id: 1,
                  file_name: 'deletable-team.oke',
                  upload_owner_name: 'testuser',
                  file_comment: '削除可能なファイル',
                  downloadable_at: '2024-01-01T10:00:00Z',
                  created_at: '2024-01-01T09:00:00Z',
                  updated_at: '2024-01-01T09:00:00Z',
                  tags: [],
                  upload_user_id: null,
                },
              ],
              pagination: {
                page: 1,
                limit: 10,
                total: 1,
              },
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    // 削除APIのモック (v2 format)
    await page.route('**/api/v2/files/1', async (route) => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'ファイルを削除しました',
          }),
        });
      } else {
        await route.continue();
      }
    });

    // 検索実行
    await teamSearchPage.search('deletable');

    // 削除ボタンをクリック
    const deleteButton = await teamSearchPage.clickDeleteButton('deletable-team.oke');
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    // 削除モーダルの確認
    await teamSearchPage.expectDeleteModal('deletable-team.oke');

    // 削除確認
    await teamSearchPage.confirmDelete('test123');

    // 成功メッセージの確認（toastが表示される）
    await teamSearchPage.expectToast(/ファイルを削除しました/);
  });

  test('URLパラメータからの検索実行', async ({ page }) => {
    const teamSearchPage = new TeamSearchPage(page);

    // URLパラメータ付きでページにアクセス
    await teamSearchPage.gotoWithParams('URLテスト', 2);

    // 検索フォームにキーワードが設定されていることを確認
    await teamSearchPage.expectKeywordValue('URLテスト');

    // 検索が自動実行されることを確認（APIコールが発生）
    await page.waitForLoadState('networkidle');
  });

  test('レスポンシブデザインの確認', async ({ page }) => {
    const teamSearchPage = new TeamSearchPage(page);

    // モバイルサイズに変更
    await page.setViewportSize({ width: 375, height: 667 });

    // 検索フォームが適切に表示されることを確認
    await expect(teamSearchPage.keywordInput).toBeVisible();
    await expect(teamSearchPage.searchButton).toBeVisible();

    // タブレットサイズに変更
    await page.setViewportSize({ width: 768, height: 1024 });

    // レイアウトが適切に調整されることを確認
    await expect(teamSearchPage.pageHeading).toBeVisible();
  });

  test('キーボードナビゲーション', async ({ page }) => {
    const teamSearchPage = new TeamSearchPage(page);

    // 検索入力フィールドに直接フォーカスを設定
    await teamSearchPage.keywordInput.click();
    await expect(teamSearchPage.keywordInput).toBeFocused();

    // Enterキーで検索実行
    await teamSearchPage.searchWithEnter('keyboard-test');

    // URLが更新されることを確認
    await teamSearchPage.expectUrlContainsKeyword('keyboard-test');
  });
});
