import { test, expect } from '@playwright/test';
import {
  TeamUploadPage,
  MatchUploadPage,
  TeamSearchPage,
  MatchSearchPage,
} from './pages';
import { loginUser, testUsers } from './helpers/auth-helpers';
import {
  createTeamCheFile,
  createMatchCheFile,
  createOversizedTeamFile,
  createOversizedMatchFile,
  createInvalidFormatFile,
  loadSampleTeamFile,
  loadSampleMatchFile,
  mockUploadSuccess,
  mockUploadError,
  mockFetchTags,
  mockUploadSuccessWithData,
  mockSearchFiles,
  uploadTestData,
  waitForAuthHydration,
} from './helpers/upload-helpers';

test.describe('チームデータアップロード', () => {
  test.describe('ページ表示', () => {
    test.describe('未認証時', () => {
      let uploadPage: TeamUploadPage;

      test.beforeEach(async ({ page }) => {
        uploadPage = new TeamUploadPage(page);
        await uploadPage.goto();
        await uploadPage.clearStorage();
      });

      test('アップロードページが正しく表示される', async () => {
        await uploadPage.expectVisible();
      });

      test('削除パスワードフィールドが表示される', async () => {
        await uploadPage.expectDeletePasswordFieldVisible();
      });
    });

    test('認証時は削除パスワードフィールドが非表示', async ({ page }) => {
      await mockUploadSuccess(page);
      await mockFetchTags(page);
      await loginUser(page, testUsers.valid);

      const uploadPage = new TeamUploadPage(page);
      await uploadPage.goto();
      // Zustandストアの認証状態ハイドレーションを待機
      await waitForAuthHydration(page);
      await uploadPage.expectDeletePasswordFieldHidden();
    });
  });

  test.describe('フォームバリデーション（未認証）', () => {
    test.beforeEach(async ({ page }) => {
      await mockUploadSuccess(page);
      await mockFetchTags(page);
    });

    test('必須フィールドが空の場合エラーが表示される', async ({ page }) => {
      const uploadPage = new TeamUploadPage(page);
      await uploadPage.goto();
      await uploadPage.clearStorage();

      // HTMLのrequired属性を回避するため、必須フィールドを埋めてからコメントだけ空にする
      await uploadPage.fillOwnerName('テストオーナー');
      await uploadPage.fillDeletePassword('test123');
      await uploadPage.selectFileByBuffer('test.CHE', createTeamCheFile());

      // コメントは空のまま送信
      await uploadPage.expectSubmitButtonEnabled();
      await uploadPage.submit();

      // バリデーションエラートーストが表示される
      await uploadPage.expectValidationToast();
      // コメントエラーが表示される
      await uploadPage.expectCommentError();
    });

    test('ファイル未選択時は送信ボタンが無効', async ({ page }) => {
      const uploadPage = new TeamUploadPage(page);
      await uploadPage.goto();
      await uploadPage.clearStorage();

      await uploadPage.fillOwnerName(uploadTestData.validTeam.ownerName);
      await uploadPage.fillComment(uploadTestData.validTeam.comment);
      await uploadPage.fillDeletePassword(uploadTestData.validTeam.deletePassword);

      await uploadPage.expectSubmitButtonDisabled();
    });
  });

  test.describe('ファイル選択', () => {
    test('CHEファイルを選択できる', async ({ page }) => {
      const uploadPage = new TeamUploadPage(page);
      await uploadPage.goto();
      await uploadPage.clearStorage();

      await uploadPage.selectFileByBuffer(
        'test-team.CHE',
        createTeamCheFile()
      );

      await uploadPage.expectFileSelected('test-team.CHE');
    });

    test('選択したファイルを削除できる', async ({ page }) => {
      const uploadPage = new TeamUploadPage(page);
      await uploadPage.goto();
      await uploadPage.clearStorage();

      await uploadPage.selectFileByBuffer(
        'test-team.CHE',
        createTeamCheFile()
      );
      await uploadPage.expectFileSelected('test-team.CHE');

      await uploadPage.removeSelectedFile();
      await uploadPage.expectNoFileSelected();
    });

    test('不正なファイル形式は拒否される', async ({ page }) => {
      const uploadPage = new TeamUploadPage(page);
      await uploadPage.goto();
      await uploadPage.clearStorage();

      await uploadPage.selectFileByBuffer(
        'invalid.txt',
        createInvalidFormatFile()
      );

      await uploadPage.expectFileFormatError();
    });

    test('ファイルサイズ超過は拒否される（チーム: 25KB制限）', async ({ page }) => {
      const uploadPage = new TeamUploadPage(page);
      await uploadPage.goto();
      await uploadPage.clearStorage();

      await uploadPage.selectFileByBuffer(
        'oversized.CHE',
        createOversizedTeamFile()
      );

      await uploadPage.expectFileSizeError();
    });
  });

  test.describe('タグ機能', () => {
    test.beforeEach(async ({ page }) => {
      await mockFetchTags(page, ['人気タグ1', '人気タグ2', '人気タグ3']);
    });

    test('タグを追加できる', async ({ page }) => {
      const uploadPage = new TeamUploadPage(page);
      await uploadPage.goto();
      await uploadPage.clearStorage();

      await uploadPage.addTag('テストタグ');
      await uploadPage.expectTagAdded('テストタグ');
    });

    test('タグをEnterキーで追加できる（ダブルエンター）', async ({ page }) => {
      const uploadPage = new TeamUploadPage(page);
      await uploadPage.goto();
      await uploadPage.clearStorage();

      await uploadPage.addTagByEnter('エンタータグ');
      await uploadPage.expectTagAdded('エンタータグ');
    });

    test('最大4つまでタグを追加できる', async ({ page }) => {
      const uploadPage = new TeamUploadPage(page);
      await uploadPage.goto();
      await uploadPage.clearStorage();

      for (const tag of uploadTestData.maxTags) {
        await uploadPage.addTag(tag);
      }

      await uploadPage.expectTagCount(4);
    });

    test('5つ目のタグ追加時はエラーが表示される', async ({ page }) => {
      const uploadPage = new TeamUploadPage(page);
      await uploadPage.goto();
      await uploadPage.clearStorage();

      for (const tag of uploadTestData.maxTags) {
        await uploadPage.addTag(tag);
      }

      // 追加ボタンは4つ目以降disabled、ダブルエンターで追加を試みる
      await uploadPage.addTagByEnter('5つ目のタグ');
      await uploadPage.expectMaxTagsError();
    });
  });

  test.describe('アップロード実行（未認証）', () => {
    test('正常なアップロードが成功する', async ({ page }) => {
      await mockUploadSuccess(page, 'team');
      await mockFetchTags(page);

      const uploadPage = new TeamUploadPage(page);
      await uploadPage.goto();
      await uploadPage.clearStorage();

      await uploadPage.uploadAsGuest({
        ownerName: uploadTestData.validTeam.ownerName,
        comment: uploadTestData.validTeam.comment,
        deletePassword: uploadTestData.validTeam.deletePassword,
        fileName: uploadTestData.validTeam.fileName,
        fileContent: createTeamCheFile(),
        tags: uploadTestData.validTeam.tags,
      });

      await uploadPage.expectConfirmDialogVisible();
      await uploadPage.confirmUpload();

      await uploadPage.expectUploadSuccess();
    });

    test('確認ダイアログでキャンセルできる', async ({ page }) => {
      await mockUploadSuccess(page, 'team');
      await mockFetchTags(page);

      const uploadPage = new TeamUploadPage(page);
      await uploadPage.goto();
      await uploadPage.clearStorage();

      await uploadPage.uploadAsGuest({
        ownerName: uploadTestData.validTeam.ownerName,
        comment: uploadTestData.validTeam.comment,
        deletePassword: uploadTestData.validTeam.deletePassword,
        fileName: uploadTestData.validTeam.fileName,
        fileContent: createTeamCheFile(),
      });

      await uploadPage.expectConfirmDialogVisible();
      await uploadPage.cancelUpload();
      await uploadPage.expectConfirmDialogHidden();
    });
  });

  test.describe('アップロード実行（認証済み）', () => {
    test('認証ユーザーは削除パスワードなしでアップロードできる', async ({ page }) => {
      await mockUploadSuccess(page, 'team');
      await mockFetchTags(page);
      await loginUser(page, testUsers.valid);

      const uploadPage = new TeamUploadPage(page);
      await uploadPage.goto();
      // Zustandストアの認証状態ハイドレーションを待機
      await waitForAuthHydration(page);
      await uploadPage.expectDeletePasswordFieldHidden();

      // 認証ユーザーでもオーナー名フィールドに値を設定（テストの決定論的動作を保証）
      await uploadPage.fillOwnerName(testUsers.valid.name);

      await uploadPage.fillComment(uploadTestData.validTeam.comment);
      await uploadPage.selectFileByBuffer(
        uploadTestData.validTeam.fileName,
        createTeamCheFile()
      );

      await uploadPage.expectSubmitButtonEnabled();
      await uploadPage.submit();

      await uploadPage.expectConfirmDialogVisible();
      await uploadPage.confirmUpload();
      await uploadPage.expectUploadSuccess();
    });
  });

  test.describe('APIエラーハンドリング', () => {
    test('サーバーエラー時にエラーメッセージが表示される', async ({ page }) => {
      await mockUploadError(page, 500, 'サーバーエラーが発生しました');
      await mockFetchTags(page);

      const uploadPage = new TeamUploadPage(page);
      await uploadPage.goto();
      await uploadPage.clearStorage();

      await uploadPage.uploadAsGuest({
        ownerName: uploadTestData.validTeam.ownerName,
        comment: uploadTestData.validTeam.comment,
        deletePassword: uploadTestData.validTeam.deletePassword,
        fileName: uploadTestData.validTeam.fileName,
        fileContent: createTeamCheFile(),
      });

      await uploadPage.expectConfirmDialogVisible();
      await uploadPage.confirmUpload();

      await uploadPage.expectUploadError();
    });
  });
});

test.describe('マッチデータアップロード', () => {
  test.describe('ページ表示', () => {
    test('マッチアップロードページが正しく表示される', async ({ page }) => {
      const uploadPage = new MatchUploadPage(page);
      await uploadPage.goto();
      await uploadPage.clearStorage();
      await uploadPage.expectVisible();
    });
  });

  test.describe('ファイル選択', () => {
    test('ファイルサイズ超過は拒否される（マッチ: 260KB制限）', async ({ page }) => {
      const uploadPage = new MatchUploadPage(page);
      await uploadPage.goto();
      await uploadPage.clearStorage();

      await uploadPage.selectFileByBuffer(
        'oversized-match.CHE',
        createOversizedMatchFile()
      );

      await uploadPage.expectFileSizeError();
    });

    test('260KB以下のファイルは受け入れられる', async ({ page }) => {
      const uploadPage = new MatchUploadPage(page);
      await uploadPage.goto();
      await uploadPage.clearStorage();

      await uploadPage.selectFileByBuffer(
        'valid-match.CHE',
        createMatchCheFile(200)
      );

      await uploadPage.expectFileSelected('valid-match.CHE');
    });
  });

  test.describe('アップロード実行', () => {
    test('マッチデータの正常なアップロードが成功する', async ({ page }) => {
      await mockUploadSuccess(page, 'match');
      await mockFetchTags(page);

      const uploadPage = new MatchUploadPage(page);
      await uploadPage.goto();
      await uploadPage.clearStorage();

      await uploadPage.uploadAsGuest({
        ownerName: uploadTestData.validMatch.ownerName,
        comment: uploadTestData.validMatch.comment,
        deletePassword: uploadTestData.validMatch.deletePassword,
        fileName: uploadTestData.validMatch.fileName,
        fileContent: createMatchCheFile(),
        tags: uploadTestData.validMatch.tags,
      });

      await uploadPage.expectConfirmDialogVisible();
      await uploadPage.confirmUpload();

      await uploadPage.expectUploadSuccess();
    });
  });
});

test.describe('レスポンシブデザイン', () => {
  test('モバイルサイズで正しく表示される', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const uploadPage = new TeamUploadPage(page);
    await uploadPage.goto();
    await uploadPage.clearStorage();

    await expect(uploadPage.pageHeading).toBeVisible();
    await expect(uploadPage.submitButton).toBeVisible();
  });

  test('タブレットサイズで正しく表示される', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    const uploadPage = new TeamUploadPage(page);
    await uploadPage.goto();
    await uploadPage.clearStorage();

    await expect(uploadPage.pageHeading).toBeVisible();
    await expect(uploadPage.commentInput).toBeVisible();
  });
});

test.describe('キーボードナビゲーション', () => {
  test('Tabキーでフォーム要素を順番に移動できる', async ({ page }) => {
    const uploadPage = new TeamUploadPage(page);
    await uploadPage.goto();
    await uploadPage.clearStorage();

    // フォーカスを開始
    await uploadPage.ownerNameInput.click();
    await expect(uploadPage.ownerNameInput).toBeFocused();

    // Tab移動
    await page.keyboard.press('Tab');
    await expect(uploadPage.commentInput).toBeFocused();
  });
});

test.describe('アップロード後の一覧表示確認', () => {
  test('チームデータアップロード後、チーム一覧に表示される', async ({ page }) => {
    const uploadedFile = {
      id: 999,
      file_name: 'sample-team.CHE',
      file_comment: 'E2Eテスト用チームデータ',
      upload_owner_name: 'E2Eテストオーナー',
      tags: ['E2Eテスト', 'チーム'],
    };

    // アップロードAPIモック
    await mockUploadSuccessWithData(page, uploadedFile);
    await mockFetchTags(page);

    // アップロード実行
    const uploadPage = new TeamUploadPage(page);
    await uploadPage.goto();
    await uploadPage.clearStorage();

    // 実際のサンプルファイルを使用
    await uploadPage.uploadAsGuest({
      ownerName: uploadedFile.upload_owner_name,
      comment: uploadedFile.file_comment,
      deletePassword: 'test123',
      fileName: uploadedFile.file_name,
      fileContent: loadSampleTeamFile(),
      tags: uploadedFile.tags,
    });

    await uploadPage.expectConfirmDialogVisible();
    await uploadPage.confirmUpload();
    await uploadPage.expectUploadSuccess();

    // 検索APIモック（アップロードしたファイルが含まれる結果を返す）
    await mockSearchFiles(page, 'team', [uploadedFile]);

    // チーム一覧ページへ移動して確認
    const searchPage = new TeamSearchPage(page);
    await searchPage.goto();

    // アップロードしたファイルが一覧に表示されていることを確認
    await searchPage.expectResultText(uploadedFile.file_name);
    await searchPage.expectResultText(uploadedFile.upload_owner_name);
    await searchPage.expectResultText(uploadedFile.file_comment);
  });

  test('マッチデータアップロード後、マッチ一覧に表示される', async ({ page }) => {
    const uploadedFile = {
      id: 888,
      file_name: 'sample-match.CHE',
      file_comment: 'E2Eテスト用マッチデータ',
      upload_owner_name: 'E2Eマッチオーナー',
      tags: ['E2Eテスト', 'マッチ'],
    };

    // アップロードAPIモック
    await mockUploadSuccessWithData(page, uploadedFile);
    await mockFetchTags(page);

    // アップロード実行
    const uploadPage = new MatchUploadPage(page);
    await uploadPage.goto();
    await uploadPage.clearStorage();

    // 実際のサンプルファイルを使用
    await uploadPage.uploadAsGuest({
      ownerName: uploadedFile.upload_owner_name,
      comment: uploadedFile.file_comment,
      deletePassword: 'match456',
      fileName: uploadedFile.file_name,
      fileContent: loadSampleMatchFile(),
      tags: uploadedFile.tags,
    });

    await uploadPage.expectConfirmDialogVisible();
    await uploadPage.confirmUpload();
    await uploadPage.expectUploadSuccess();

    // 検索APIモック（アップロードしたファイルが含まれる結果を返す）
    await mockSearchFiles(page, 'match', [uploadedFile]);

    // マッチ一覧ページへ移動して確認
    const searchPage = new MatchSearchPage(page);
    await searchPage.goto();

    // アップロードしたファイルが一覧に表示されていることを確認
    await searchPage.expectResultText(uploadedFile.file_name);
    await searchPage.expectResultText(uploadedFile.upload_owner_name);
    await searchPage.expectResultText(uploadedFile.file_comment);
  });
});
