import { expect, test } from '@playwright/test';
import { loginUser, testUsers } from './helpers/auth-helpers';
import { EventPage } from './pages';

const validEvent = {
  name: 'E2Eイベント登録テスト',
  details: 'E2Eからイベント登録できることを確認します。',
  url: 'https://example.com/e2e-event',
  deadline: '2026-05-01',
  endDisplayDate: '2026-05-10',
  type: 'tournament' as const,
};

test.describe('イベント登録', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, testUsers.valid);
  });

  test('認証済みユーザーがイベントを登録できる', async ({ page }) => {
    let requestBody: Record<string, unknown> | null = null;

    await page.route('**/api/v2/events', async route => {
      const request = route.request();
      if (request.method() !== 'POST') {
        await route.continue();
        return;
      }

      const body = request.postDataJSON() as Record<string, unknown>;
      requestBody = body;
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Event created successfully',
          data: {
            event: {
              id: 1001,
              register_user_id: '1',
              event_name: validEvent.name,
              event_details: validEvent.details,
              event_reference_url: validEvent.url,
              event_type: '1',
              event_closing_day: body.deadline,
              event_displaying_day: body.endDisplayDate,
              created_at: '2026-04-12T00:00:00.000Z',
              updated_at: '2026-04-12T00:00:00.000Z',
            },
          },
        }),
      });
    });

    const eventPage = new EventPage(page);
    await eventPage.goto();
    await eventPage.expectVisible();

    await eventPage.registerEvent(validEvent);
    await eventPage.expectRegistrationSuccess();

    expect(requestBody).toMatchObject({
      name: validEvent.name,
      details: validEvent.details,
      url: validEvent.url,
      type: '1',
      deadline: new Date(`${validEvent.deadline}T23:59:59`).toISOString(),
      endDisplayDate: new Date(
        `${validEvent.endDisplayDate}T23:59:59`
      ).toISOString(),
    });
  });

  test('APIのバリデーションエラーを成功扱いにしない', async ({ page }) => {
    await page.route('**/api/v2/events', async route => {
      const request = route.request();
      if (request.method() !== 'POST') {
        await route.continue();
        return;
      }

      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            message: 'Validation failed',
            code: 'HTTP_400',
            details: {
              endDisplayDate: ['End display date must be after deadline'],
            },
          },
        }),
      });
    });

    const eventPage = new EventPage(page);
    await eventPage.goto();
    await eventPage.expectVisible();

    await eventPage.registerEvent(validEvent);
    await eventPage.expectRegistrationError();
    await expect(
      page.getByText('イベント情報が登録されました')
    ).not.toBeVisible();
  });
});
