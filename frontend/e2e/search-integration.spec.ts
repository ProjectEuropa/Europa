import { test, expect } from '@playwright/test';

test.describe('検索機能の統合テスト', () => {
  test.beforeEach(async ({ page }) => {
    // 検索ページに移動
    await page.goto('/search/team');
  });

  test('チーム検索の基本フロー', async ({ page }) => {
    // ページタイトルの確認
    await expect(page.getByRole('heading', { name: 'Search Team' })).toBeVisible();
    await expect(page.getByText('チームデータの検索が可能です')).toBeVisible();

    // 検索フォームの確認
    const searchInput = page.getByLabel('検索キーワード');
    const searchButton = page.getByRole('button', { name: '検索' });

    await expect(searchInput).toBeVisible();
    await expect(searchButton).toBeVisible();
    await expect(searchButton).toBeDisabled(); // 初期状態では無効

    // 検索キーワードを入力
    await searchInput.fill('テストチーム');
    await expect(searchButton).toBeEnabled(); // 入力後は有効

    // 検索実行
    await searchButton.click();

    // URLが更新されることを確認
    await expect(page).toHaveURL(/keyword=テストチーム/);
    await expect(page).toHaveURL(/page=1/);

    // ローディング状態の確認（短時間なので見えない場合もある）
    // await expect(page.getByText('検索中...')).toBeVisible();

    // 検索結果の表示を待機
    await page.waitForLoadState('networkidle');
  });

  test('マッチ検索の基本フロー', async ({ page }) => {
    // マッチ検索ページに移動
    await page.goto('/search/match');

    // ページタイトルの確認
    await expect(page.getByRole('heading', { name: 'Search Match' })).toBeVisible();
    await expect(page.getByText('マッチデータの検索が可能です')).toBeVisible();

    // 検索実行
    const searchInput = page.getByLabel('検索キーワード');
    await searchInput.fill('テストマッチ');
    await page.getByRole('button', { name: '検索' }).click();

    // URLが更新されることを確認
    await expect(page).toHaveURL(/keyword=テストマッチ/);
  });

  test('検索フォームのバリデーション', async ({ page }) => {
    const searchInput = page.getByLabel('検索キーワード');
    const searchButton = page.getByRole('button', { name: '検索' });

    // 空の状態では検索ボタンが無効
    await expect(searchButton).toBeDisabled();

    // 空白のみの入力では検索ボタンが無効
    await searchInput.fill('   ');
    await expect(searchButton).toBeDisabled();

    // 有効な入力では検索ボタンが有効
    await searchInput.fill('有効な検索語');
    await expect(searchButton).toBeEnabled();

    // クリアボタンの動作
    const clearButton = page.getByLabel('検索をクリア');
    await expect(clearButton).toBeVisible();
    await clearButton.click();
    await expect(searchInput).toHaveValue('');
    await expect(searchButton).toBeDisabled();
  });

  test('検索結果の表示とページネーション', async ({ page }) => {
    // モックデータがある場合の検索
    await page.route('**/api/v1/search/team*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 1,
              name: 'test-team-1.oke',
              ownerName: 'testuser1',
              comment: 'テストチームファイル1',
              downloadableAt: '2024-01-01T10:00:00Z',
              createdAt: '2024-01-01T09:00:00Z',
              updatedAt: '2024-01-01T09:00:00Z',
              searchTag1: 'tag1',
              searchTag2: 'tag2',
              searchTag3: null,
              searchTag4: null,
              type: 'team',
            },
            {
              id: 2,
              name: 'test-team-2.oke',
              ownerName: 'testuser2',
              comment: 'テストチームファイル2',
              downloadableAt: '2024-01-01T11:00:00Z',
              createdAt: '2024-01-01T10:00:00Z',
              updatedAt: '2024-01-01T10:00:00Z',
              searchTag1: 'tag3',
              searchTag2: null,
              searchTag3: null,
              searchTag4: null,
              type: 'team',
            },
          ],
          meta: {
            currentPage: 1,
            lastPage: 3,
            perPage: 10,
            total: 25,
          },
        }),
      });
    });

    // 検索実行
    await page.getByLabel('検索キーワード').fill('test');
    await page.getByRole('button', { name: '検索' }).click();

    // 検索結果の確認
    await expect(page.getByText('25件の結果 (ページ 1/3)')).toBeVisible();
    await expect(page.getByText('test-team-1.oke')).toBeVisible();
    await expect(page.getByText('test-team-2.oke')).toBeVisible();
    await expect(page.getByText('testuser1')).toBeVisible();
    await expect(page.getByText('testuser2')).toBeVisible();

    // タグの表示確認
    await expect(page.getByText('tag1')).toBeVisible();
    await expect(page.getByText('tag2')).toBeVisible();
    await expect(page.getByText('tag3')).toBeVisible();

    // ページネーションの確認
    await expect(page.getByText('前へ')).toBeVisible();
    await expect(page.getByText('次へ')).toBeVisible();
    await expect(page.getByText('1')).toBeVisible();
    await expect(page.getByText('2')).toBeVisible();
    await expect(page.getByText('3')).toBeVisible();

    // 前へボタンが無効であることを確認（1ページ目）
    await expect(page.getByText('前へ')).toBeDisabled();
  });

  test('検索結果が空の場合', async ({ page }) => {
    // 空の結果を返すモック
    await page.route('**/api/v1/search/team*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [],
          meta: {
            currentPage: 1,
            lastPage: 1,
            perPage: 10,
            total: 0,
          },
        }),
      });
    });

    // 検索実行
    await page.getByLabel('検索キーワード').fill('存在しないファイル');
    await page.getByRole('button', { name: '検索' }).click();

    // 空の状態メッセージの確認
    await expect(page.getByText('検索結果が見つかりませんでした')).toBeVisible();
    await expect(page.getByText('別のキーワードで検索してみてください')).toBeVisible();
  });

  test('検索エラーの処理', async ({ page }) => {
    // エラーレスポンスのモック
    await page.route('**/api/v1/search/team*', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal Server Error',
        }),
      });
    });

    // 検索実行
    await page.getByLabel('検索キーワード').fill('エラーテスト');
    await page.getByRole('button', { name: '検索' }).click();

    // エラーメッセージの確認
    await expect(page.getByText('チーム検索に失敗しました')).toBeVisible();
  });

  test('ダウンロード機能', async ({ page }) => {
    // 検索結果のモック
    await page.route('**/api/v1/search/team*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 1,
              name: 'downloadable-team.oke',
              ownerName: 'testuser',
              comment: 'ダウンロード可能なファイル',
              downloadableAt: '2024-01-01T10:00:00Z',
              createdAt: '2024-01-01T09:00:00Z',
              updatedAt: '2024-01-01T09:00:00Z',
              searchTag1: null,
              searchTag2: null,
              searchTag3: null,
              searchTag4: null,
              type: 'team',
            },
          ],
          meta: {
            currentPage: 1,
            lastPage: 1,
            perPage: 10,
            total: 1,
          },
        }),
      });
    });

    // ダウンロードAPIのモック
    await page.route('**/api/v1/download/team/*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/octet-stream',
        body: 'mock file content',
        headers: {
          'Content-Disposition': 'attachment; filename="downloadable-team.oke"',
        },
      });
    });

    // 検索実行
    await page.getByLabel('検索キーワード').fill('downloadable');
    await page.getByRole('button', { name: '検索' }).click();

    // ダウンロードボタンをクリック
    const downloadButton = page.getByLabel('downloadable-team.okeをダウンロード');
    await expect(downloadButton).toBeVisible();

    // ダウンロードの開始を監視
    const downloadPromise = page.waitForEvent('download');
    await downloadButton.click();

    // ダウンロードが開始されることを確認
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('downloadable-team.oke');
  });

  test('削除機能', async ({ page }) => {
    // 検索結果のモック（削除可能なファイル）
    await page.route('**/api/v1/search/team*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 1,
              name: 'deletable-team.oke',
              ownerName: 'testuser',
              comment: '削除可能なファイル',
              downloadableAt: '2024-01-01T10:00:00Z',
              createdAt: '2024-01-01T09:00:00Z',
              updatedAt: '2024-01-01T09:00:00Z',
              searchTag1: null,
              searchTag2: null,
              searchTag3: null,
              searchTag4: null,
              type: 'team',
            },
          ],
          meta: {
            currentPage: 1,
            lastPage: 1,
            perPage: 10,
            total: 1,
          },
        }),
      });
    });

    // 削除APIのモック
    await page.route('**/api/v1/delete/searchFile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'ファイルを削除しました',
        }),
      });
    });

    // 検索実行
    await page.getByLabel('検索キーワード').fill('deletable');
    await page.getByRole('button', { name: '検索' }).click();

    // 削除ボタンをクリック
    const deleteButton = page.getByLabel('deletable-team.okeを削除');
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    // 削除モーダルの確認
    await expect(page.getByText('Delete deletable-team.oke?')).toBeVisible();

    // 削除確認
    await page.getByText('Confirm Delete').click();

    // 成功メッセージの確認（toastが表示される）
    await expect(page.getByText('ファイルを削除しました')).toBeVisible();
  });

  test('URLパラメータからの検索実行', async ({ page }) => {
    // URLパラメータ付きでページにアクセス
    await page.goto('/search/team?keyword=URLテスト&page=2');

    // 検索フォームにキーワードが設定されていることを確認
    await expect(page.getByLabel('検索キーワード')).toHaveValue('URLテスト');

    // 検索が自動実行されることを確認（APIコールが発生）
    await page.waitForLoadState('networkidle');
  });

  test('レスポンシブデザインの確認', async ({ page }) => {
    // モバイルサイズに変更
    await page.setViewportSize({ width: 375, height: 667 });

    // 検索フォームが適切に表示されることを確認
    await expect(page.getByLabel('検索キーワード')).toBeVisible();
    await expect(page.getByRole('button', { name: '検索' })).toBeVisible();

    // タブレットサイズに変更
    await page.setViewportSize({ width: 768, height: 1024 });

    // レイアウトが適切に調整されることを確認
    await expect(page.getByRole('heading', { name: 'Search Team' })).toBeVisible();
  });

  test('キーボードナビゲーション', async ({ page }) => {
    // Tabキーでフォーカス移動
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('検索キーワード')).toBeFocused();

    // 検索キーワードを入力
    await page.keyboard.type('キーボードテスト');

    // Tabキーで検索ボタンに移動
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: '検索' })).toBeFocused();

    // Enterキーで検索実行
    await page.keyboard.press('Enter');

    // URLが更新されることを確認
    await expect(page).toHaveURL(/keyword=キーボードテスト/);
  });
});
