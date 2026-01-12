import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Upload Page Object (Team/Match Upload)
 */
export class UploadPage extends BasePage {
  constructor(
    page: Page,
    protected uploadType: 'team' | 'match' = 'team'
  ) {
    super(page);
  }

  // ===================
  // Locators (セマンティック優先)
  // ===================

  get pageHeading() {
    const headingName = this.uploadType === 'team'
      ? 'チームデータアップロード'
      : 'マッチデータアップロード';
    return this.page.getByRole('heading', { name: headingName });
  }

  get subTitle() {
    const subTitleText = this.uploadType === 'team'
      ? 'TEAM DATA UPLOAD'
      : 'MATCH DATA UPLOAD';
    return this.page.getByText(subTitleText);
  }

  // フォーム要素
  get ownerNameInput() {
    return this.page.getByLabel('オーナー名');
  }

  get commentInput() {
    return this.page.getByLabel('コメント');
  }

  get tagInput() {
    return this.page.getByPlaceholder('タグを入力（Enter2回で追加）');
  }

  get addTagButton() {
    return this.page.getByRole('button', { name: '追加' });
  }

  get deletePasswordInput() {
    return this.page.getByLabel('削除パスワード');
  }

  get downloadDateInput() {
    return this.page.getByLabel('ダウンロード可能日時');
  }

  // ファイルドロップゾーン
  get fileDropZone() {
    return this.page.getByText('CHEファイルをドラッグ&ドロップ').locator('..');
  }

  get fileInput() {
    return this.page.locator('input[type="file"]');
  }

  get removeFileButton() {
    return this.page.getByRole('button', { name: 'ファイルを削除' });
  }

  // 送信ボタン
  get submitButton() {
    return this.page.getByRole('button', { name: 'アップロード', exact: true });
  }

  // 確認ダイアログ
  get confirmDialogHeading() {
    return this.page.getByRole('heading', { name: 'アップロード確認' });
  }

  get confirmButton() {
    // 確認ダイアログ内のアップロードボタン
    return this.confirmDialogHeading.locator('..').getByRole('button', { name: 'アップロード' });
  }

  get cancelButton() {
    return this.page.getByRole('button', { name: 'キャンセル' });
  }

  // タグ関連
  getTagBadge(tagName: string) {
    const escapedTagName = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.page.locator('div.rounded-full').filter({ hasText: new RegExp(`^${escapedTagName}$`) }).getByRole('button');
  }

  // エラー表示
  get ownerNameError() {
    return this.page.getByText('オーナー名を入力してください');
  }

  get commentError() {
    return this.page.getByText('コメントを入力してください');
  }

  get deletePasswordError() {
    return this.page.getByText('削除パスワードを入力してください');
  }

  get fileError() {
    return this.page.getByText('ファイルを選択してください');
  }

  // ===================
  // Actions
  // ===================

  async goto() {
    const path = this.uploadType === 'team' ? '/upload' : '/upload/match';
    await this.page.goto(path);
  }

  async fillOwnerName(name: string) {
    await this.ownerNameInput.fill(name);
  }

  async fillComment(comment: string) {
    await this.commentInput.fill(comment);
  }

  async addTag(tag: string) {
    await this.tagInput.fill(tag);
    await this.addTagButton.click();
  }

  async addTagByEnter(tag: string) {
    await this.tagInput.fill(tag);
    await this.tagInput.press('Enter');
    await this.tagInput.press('Enter');
  }

  async removeTag(tagName: string) {
    await this.getTagBadge(tagName).click();
  }

  async fillDeletePassword(password: string) {
    await this.deletePasswordInput.fill(password);
  }

  async fillDownloadDate(dateTime: string) {
    await this.downloadDateInput.fill(dateTime);
  }

  async selectFileByBuffer(fileName: string, content: Buffer) {
    await this.fileInput.setInputFiles({
      name: fileName,
      mimeType: 'application/octet-stream',
      buffer: content,
    });
  }

  async removeSelectedFile() {
    await this.removeFileButton.click();
  }

  async submit() {
    await this.submitButton.click();
  }

  async confirmUpload() {
    await this.confirmButton.click();
  }

  async cancelUpload() {
    await this.cancelButton.click();
  }

  /**
   * 完全なアップロードフロー（未認証ユーザー）
   */
  async uploadAsGuest(options: {
    ownerName: string;
    comment: string;
    deletePassword: string;
    fileName: string;
    fileContent: Buffer;
    tags?: string[];
    downloadDate?: string;
  }) {
    await this.fillOwnerName(options.ownerName);
    await this.fillComment(options.comment);
    await this.fillDeletePassword(options.deletePassword);

    if (options.tags) {
      for (const tag of options.tags) {
        await this.addTag(tag);
      }
    }

    if (options.downloadDate) {
      await this.fillDownloadDate(options.downloadDate);
    }

    await this.selectFileByBuffer(options.fileName, options.fileContent);
    await this.submit();
  }

  /**
   * 完全なアップロードフロー（認証ユーザー）
   */
  async uploadAsAuthenticated(options: {
    comment: string;
    fileName: string;
    fileContent: Buffer;
    tags?: string[];
    downloadDate?: string;
    deletePassword?: string;
  }) {
    await this.fillComment(options.comment);

    if (options.deletePassword) {
      await this.fillDeletePassword(options.deletePassword);
    }

    if (options.tags) {
      for (const tag of options.tags) {
        await this.addTag(tag);
      }
    }

    if (options.downloadDate) {
      await this.fillDownloadDate(options.downloadDate);
    }

    await this.selectFileByBuffer(options.fileName, options.fileContent);
    await this.submit();
  }

  // ===================
  // Assertions
  // ===================

  async expectVisible() {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.subTitle).toBeVisible();
    await expect(this.ownerNameInput).toBeVisible();
    await expect(this.commentInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async expectSubmitButtonDisabled() {
    await expect(this.submitButton).toBeDisabled();
  }

  async expectSubmitButtonEnabled() {
    await expect(this.submitButton).toBeEnabled();
  }

  async expectConfirmDialogVisible() {
    await expect(this.confirmDialogHeading).toBeVisible();
  }

  async expectConfirmDialogHidden() {
    await expect(this.confirmDialogHeading).not.toBeVisible();
  }

  async expectFileSelected(fileName: string) {
    await expect(this.page.getByText(fileName)).toBeVisible();
  }

  async expectNoFileSelected() {
    await expect(this.page.getByText('CHEファイルをドラッグ&ドロップ')).toBeVisible();
  }

  async expectTagAdded(tagName: string) {
    await expect(this.page.getByText(tagName)).toBeVisible();
  }

  async expectTagCount(count: number) {
    const tags = this.page.locator('.rounded-full').filter({ hasText: /\S+/ });
    await expect(tags).toHaveCount(count);
  }

  async expectOwnerNameError() {
    await expect(this.ownerNameError).toBeVisible();
  }

  async expectCommentError() {
    await expect(this.commentError).toBeVisible();
  }

  async expectDeletePasswordError() {
    await expect(this.deletePasswordError).toBeVisible();
  }

  async expectFileError() {
    await expect(this.fileError).toBeVisible();
  }

  async expectUploadSuccess() {
    const fileType = this.uploadType === 'team' ? 'チーム' : 'マッチ';
    await this.expectSuccessToast(`${fileType}データがアップロードされました`);
  }

  async expectUploadError(message?: string | RegExp) {
    const errorText = message || /アップロード中にエラーが発生しました|入力内容に不備があります/;
    await this.expectErrorToast(errorText);
  }

  async expectValidationToast() {
    await this.expectErrorToast('入力内容に不備があります。赤枠の項目を確認してください。');
  }

  async expectFileSizeError() {
    await this.expectErrorToast(/ファイルサイズが制限.*を超えています/);
  }

  async expectFileFormatError() {
    await this.expectErrorToast('対応形式（.CHE）のファイルをアップロードしてください');
  }

  async expectMaxTagsError() {
    await this.expectErrorToast('タグは最大4つまでです');
  }

  async expectDeletePasswordFieldVisible() {
    await expect(this.deletePasswordInput).toBeVisible();
  }

  async expectDeletePasswordFieldHidden() {
    await expect(this.deletePasswordInput).not.toBeVisible();
  }
}

/**
 * Team Upload Page Object
 */
export class TeamUploadPage extends UploadPage {
  constructor(page: Page) {
    super(page, 'team');
  }
}

/**
 * Match Upload Page Object
 */
export class MatchUploadPage extends UploadPage {
  constructor(page: Page) {
    super(page, 'match');
  }
}
