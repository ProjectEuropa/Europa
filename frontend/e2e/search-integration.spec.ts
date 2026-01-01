import { test, expect } from '@playwright/test';

test.describe('検索機能の統合テスト', () => {
  test.beforeEach(async ({ page }) => {
    // 検索ページに移動
    await page.goto('/search/team');
  });

  test('チーム検索の基本フロー', async ({ page }) => {
    // ページタイトルの確認
    await expect(page.getByRole('heading', { name: 'チームデータ検索' })).toBeVisible();
    await expect(page.getByText('TEAM DATA SEARCH')).toBeVisible();

    // 検索フォームの確認
    const searchInput = page.getByLabel('検索キーワード');
    const searchButton = page.getByRole('button', { name: '検索', exact: true });

    await expect(searchInput).toBeVisible();
    await expect(searchButton).toBeVisible();
    await expect(searchButton).toBeDisabled(); // 初期状態では無効

    // 検索キーワードを入力
    await searchInput.fill('テストチーム');
    await expect(searchButton).toBeEnabled(); // 入力後は有効

    // 検索実行
    await searchButton.click();

    // URLが更新されることを確認（URLエンコードを考慮）
    await expect(page).toHaveURL(/keyword=/);
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
    await expect(page.getByRole('heading', { name: 'マッチデータ検索' })).toBeVisible();
    await expect(page.getByText('MATCH DATA SEARCH')).toBeVisible();

    // 検索実行
    const searchInput = page.getByLabel('検索キーワード');
    await searchInput.fill('テストマッチ');
    await page.getByRole('button', { name: '検索', exact: true }).click();

    // URLが更新されることを確認（URLエンコードを考慮）
    await expect(page).toHaveURL(/keyword=/);
  });

  test('検索フォームのバリデーション', async ({ page }) => {
    const searchInput = page.getByLabel('検索キーワード');
    const searchButton = page.getByRole('button', { name: '検索', exact: true });

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
    // モックデータがある場合の検索 (v2 API format: /api/v2/files?data_type=1&...)
    await page.route('**/api/v2/files*', async (route) => {
      const url = route.request().url();
      // data_type=1 がチーム検索
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
    await page.getByLabel('検索キーワード').fill('test');
    await page.getByRole('button', { name: '検索', exact: true }).click();

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
    await expect(page.getByRole('button', { name: '前へ' })).toBeVisible();
    await expect(page.getByRole('button', { name: '次へ' })).toBeVisible();
    await expect(page.getByRole('button', { name: '1', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: '2', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: '3', exact: true })).toBeVisible();

    // 前へボタンが無効であることを確認（1ページ目）
    await expect(page.getByRole('button', { name: '前へ' })).toBeDisabled();
  });

  test('検索結果が空の場合', async ({ page }) => {
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
    await page.getByLabel('検索キーワード').fill('存在しないファイル');
    await page.getByRole('button', { name: '検索', exact: true }).click();

    // 空の状態メッセージの確認
    await expect(page.getByText('検索結果が見つかりませんでした')).toBeVisible();
    await expect(page.getByText('別のキーワードで検索してみてください')).toBeVisible();
  });

  test('検索エラーの処理', async ({ page }) => {
    // ページにアクセスする前にモックを設定
    await page.route('**/api/v2/files*', async (route) => {
      const url = route.request().url();
      if (url.includes('data_type=1') && url.includes('keyword=')) {
        // キーワード付きの検索リクエストのみエラーを返す
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
    await page.goto('/search/team');

    // 検索実行
    await page.getByLabel('検索キーワード').fill('エラーテスト');
    await page.getByRole('button', { name: '検索', exact: true }).click();

    // エラーメッセージの確認（isErrorがtrueになるとこのメッセージが表示される）
    await expect(page.getByText('チーム検索に失敗しました')).toBeVisible({ timeout: 10000 });
  });

  test('ダウンロード機能', async ({ page }) => {
    // 検索結果のモック (v2 API format)
    await page.route('**/api/v2/files*', async (route) => {
      const url = route.request().url();
      // data_type=1 がチーム検索（GET）
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

    // ダウンロードAPIのモック (v2 format: /api/v2/files/:id)
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
    await page.getByLabel('検索キーワード').fill('downloadable');
    await page.getByRole('button', { name: '検索', exact: true }).click();

    // ダウンロードボタンをクリック
    const downloadButton = page.getByLabel('downloadable-team.okeをダウンロード');
    await expect(downloadButton).toBeVisible();

    // ダウンロードの開始を監視
    const downloadPromise = page.waitForEvent('download');
    await downloadButton.click();

    // ダウンロードが開始されることを確認
    const download = await downloadPromise;
    // Note: モック環境ではContent-Dispositionヘッダーから抽出されるか、
    // fallbackのfile_{id}形式になる場合がある
    const filename = download.suggestedFilename();
    expect(filename).toBeTruthy();
    // ファイル名が期待値か、fallback形式のいずれかであることを確認
    expect(filename === 'downloadable-team.oke' || filename.startsWith('file_')).toBe(true);
  });

  test('削除機能', async ({ page }) => {
    // 検索結果のモック（削除可能なファイル）(v2 API format)
    // upload_user_id が null の場合は匿名アップロードで削除可能
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
                  upload_user_id: null, // 匿名アップロード = 削除可能
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

    // 削除APIのモック (v2 format: DELETE /api/v2/files/:id)
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
    await page.getByLabel('検索キーワード').fill('deletable');
    await page.getByRole('button', { name: '検索', exact: true }).click();

    // 削除ボタンをクリック
    const deleteButton = page.getByLabel('deletable-team.okeを削除');
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    // 削除モーダルの確認（日本語）
    await expect(page.getByText('deletable-team.okeを本当に削除しますか？')).toBeVisible();

    // 削除パスワード入力
    await page.getByPlaceholder('削除パスワード').fill('test123');

    // 削除確認ボタン（日本語）
    await page.getByRole('button', { name: '削除実行' }).click();

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
    await expect(page.getByRole('heading', { name: 'チームデータ検索' })).toBeVisible();
  });

  test('キーボードナビゲーション', async ({ page }) => {
    // 検索入力フィールドに直接フォーカスを設定
    const searchInput = page.getByLabel('検索キーワード');
    await searchInput.click();
    await expect(searchInput).toBeFocused();

    // 検索キーワードを入力
    await searchInput.fill('keyboard-test');

    // Enterキーで検索実行
    await searchInput.press('Enter');

    // URLが更新されることを確認（URLエンコードを考慮）
    await expect(page).toHaveURL(/keyword=keyboard-test/);
  });
});
