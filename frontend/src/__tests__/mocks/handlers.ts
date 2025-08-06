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

  // 一括ダウンロード検索 - チーム
  http.get(`${API_BASE_URL}/api/v1/sumdownload/team/search`, ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword') || '';
    const page = parseInt(url.searchParams.get('page') || '1');

    const mockData = [
      {
        id: 1,
        file_name: `テストチーム${keyword}1`,
        upload_owner_name: 'テストオーナー1',
        created_at: '2024-01-01T10:00:00Z',
        file_comment: 'テストコメント1',
        downloadable_at: '2024-01-01T10:00:00Z',
        search_tag1: 'タグ1',
        search_tag2: 'タグ2',
        search_tag3: null,
        search_tag4: null,
      },
      {
        id: 2,
        file_name: `テストチーム${keyword}2`,
        upload_owner_name: 'テストオーナー2',
        created_at: '2024-01-02T10:00:00Z',
        file_comment: 'テストコメント2',
        downloadable_at: '2024-01-02T10:00:00Z',
        search_tag1: 'タグA',
        search_tag2: null,
        search_tag3: null,
        search_tag4: null,
      },
    ];

    return HttpResponse.json({
      data: mockData,
      current_page: page,
      last_page: 2,
      per_page: 10,
      total: 15,
    });
  }),

  // 一括ダウンロード検索 - マッチ
  http.get(`${API_BASE_URL}/api/v1/sumdownload/match/search`, ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword') || '';
    const page = parseInt(url.searchParams.get('page') || '1');

    const mockData = [
      {
        id: 3,
        file_name: `テストマッチ${keyword}1`,
        upload_owner_name: 'テストオーナー3',
        created_at: '2024-01-03T10:00:00Z',
        file_comment: 'マッチコメント1',
        downloadable_at: '2024-01-03T10:00:00Z',
      },
    ];

    return HttpResponse.json({
      data: mockData,
      current_page: page,
      last_page: 1,
      per_page: 10,
      total: 1,
    });
  }),

  // 一括ダウンロード実行
  http.post(`${API_BASE_URL}/api/v1/sumdownload`, async ({ request }) => {
    const body = (await request.json()) as { file_ids: number[] };
    
    if (body.file_ids.length === 0) {
      return HttpResponse.json({ error: 'ファイルが選択されていません' }, { status: 400 });
    }

    if (body.file_ids.length > 50) {
      return HttpResponse.json({ error: '選択できるファイル数は最大50件です' }, { status: 400 });
    }

    // ダウンロード成功をシミュレート
    return new HttpResponse(null, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="bulk_download.zip"',
      },
    });
  }),

  // チーム検索（既存のAPI）
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
