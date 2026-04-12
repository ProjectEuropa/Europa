import { expect, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface EventRegistrationData {
  name: string;
  details: string;
  url?: string;
  deadline: string;
  endDisplayDate: string;
  type?: 'tournament' | 'announcement' | 'other';
}

/**
 * Event registration Page Object
 */
export class EventPage extends BasePage {
  get heading() {
    return this.page.getByRole('heading', {
      name: 'イベント登録',
      exact: true,
    });
  }

  get nameInput() {
    return this.page.getByLabel(/イベント名/);
  }

  get detailsInput() {
    return this.page.getByLabel(/イベント詳細情報/);
  }

  get urlInput() {
    return this.page.getByLabel(/イベント詳細URL/);
  }

  get deadlineInput() {
    return this.page.getByLabel(/イベント受付締切日/);
  }

  get endDisplayDateInput() {
    return this.page.getByLabel(/イベント表示最終日/);
  }

  get typeSelect() {
    return this.page.getByLabel(/イベント種別/);
  }

  get submitButton() {
    return this.page.getByRole('button', { name: /イベントを登録する/ });
  }

  get confirmDialog() {
    return this.page.getByRole('dialog', { name: 'イベント登録内容の確認' });
  }

  get confirmButton() {
    return this.confirmDialog.getByRole('button', {
      name: '登録する',
      exact: true,
    });
  }

  get cancelButton() {
    return this.confirmDialog.getByRole('button', { name: 'キャンセル' });
  }

  async goto() {
    await this.page.goto('/event');
  }

  async fillDate(input: Locator, value: string) {
    await input.evaluate(element => element.removeAttribute('readonly'));
    await input.fill(value);
  }

  async fillForm(data: EventRegistrationData) {
    await this.nameInput.fill(data.name);
    await this.detailsInput.fill(data.details);

    if (data.url) {
      await this.urlInput.fill(data.url);
    }

    await this.fillDate(this.deadlineInput, data.deadline);
    await this.fillDate(this.endDisplayDateInput, data.endDisplayDate);

    if (data.type) {
      await this.typeSelect.selectOption(data.type);
    }
  }

  async submit() {
    await this.submitButton.click();
  }

  async confirmRegistration() {
    await this.confirmButton.click();
  }

  async registerEvent(data: EventRegistrationData) {
    await this.fillForm(data);
    await this.submit();
    await this.expectConfirmDialogVisible();
    await this.confirmRegistration();
  }

  async expectVisible() {
    await expect(this.page).toHaveURL('/event');
    await expect(this.heading).toBeVisible({ timeout: 5000 });
    await expect(this.nameInput).toBeVisible();
    await expect(this.detailsInput).toBeVisible();
    await expect(this.deadlineInput).toBeVisible();
    await expect(this.endDisplayDateInput).toBeVisible();
    await expect(this.typeSelect).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async expectConfirmDialogVisible() {
    await expect(this.confirmDialog).toBeVisible({ timeout: 5000 });
  }

  async expectRegistrationSuccess() {
    await this.expectSuccessToast(/イベント情報が登録されました/);
  }

  async expectRegistrationError(
    message: string | RegExp = /Validation failed/
  ) {
    await this.expectErrorToast(message);
  }
}
