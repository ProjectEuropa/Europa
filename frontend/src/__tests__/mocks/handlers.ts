import { HttpResponse, http } from 'msw';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://local.europa.com';

export const handlers = [
  // ユーザープロフィール取得
  http.get(`${API_BASE_URL}/api/v1/user/profile`, () => {
    return HttpResponse.json({
      id: 1,
      name: 'テストユーザー',
      email: 'test@example.com',
      created_at: '2024-01-01T00:00:00Z',
    });
  }),

  // ログイン
  http.post(`${API_BASE_URL}/api/v1/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        token: 'mock-jwt-token',
        user: {
          id: 1,
          name: 'テストユーザー',
          email: 'test@example.com',
        },
      });
    }

    return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }),

  // チーム検索
  http.get(`${API_BASE_URL}/api/v1/search/team`, ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword') || '';
    const page = parseInt(url.searchParams.get('page') || '1');

    return HttpResponse.json({
      data: [
        {
          id: 1,
          name: `チーム${keyword}`,
          owner_name: 'テストオーナー',
          comment: 'テストコメント',
          tags: ['tag1', 'tag2'],
          created_at: '2024-01-01T00:00:00Z',
        },
      ],
      meta: {
        current_page: page,
        last_page: 1,
        per_page: 10,
        total: 1,
      },
    });
  }),
];
