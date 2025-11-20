const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://local.europa.com';
const BASIC_AUTH_USER = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const BASIC_AUTH_PASSWORD = process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD;

// Helper to get CSRF token from cookie
const getCsrfTokenFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, ...valueParts] = cookie.trim().split('=');
    if (name === 'XSRF-TOKEN') {
      try {
        return decodeURIComponent(valueParts.join('='));
      } catch (e) {
        return valueParts.join('=');
      }
    }
  }
  return null;
};

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  let token = null;

  // if (typeof window !== 'undefined') {
  //   // まずlocalStorageの'token'キーを確認
  //   token = localStorage.getItem('token');

  //   // なければZustandのpersistストレージを確認
  //   if (!token) {
  //     const authStorage = localStorage.getItem('auth-storage');
  //     if (authStorage) {
  //       try {
  //         const parsed = JSON.parse(authStorage);
  //         token = parsed.state?.token || null;
  //       } catch (e) {
  //         console.warn('Failed to parse auth-storage:', e);
  //       }
  //     }
  //   }
  // }

  let baseHeaders: Record<string, string> = {};

  // 既存のヘッダーを処理
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        baseHeaders[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        baseHeaders[key] = value;
      });
    } else {
      baseHeaders = { ...options.headers } as Record<string, string>;
    }
  }

  // デフォルトのヘッダー（Content-Typeがすでに設定されていなければ設定）
  const headers: Record<string, string> = {
    ...baseHeaders,
    'X-Requested-With': 'XMLHttpRequest',
  };

  // Add CSRF token if available
  const csrfToken = getCsrfTokenFromCookie();
  if (csrfToken) {
    headers['X-XSRF-TOKEN'] = csrfToken;
  }

  if (!headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  // 認証ヘッダーの設定
  if (
    API_BASE_URL.includes('stg.project-europa.work') &&
    BASIC_AUTH_USER &&
    BASIC_AUTH_PASSWORD
  ) {
    // ステージング環境の認証処理
    if (endpoint.startsWith('/api/')) {
      // if (token) {
      //   // APIエンドポイント + トークンありの場合：Bearerトークンのみを使用
      //   headers.Authorization = `Bearer ${token}`;
      //   // X-Requested-With is already set above
      // } else {
      // APIエンドポイント + トークンなしの場合：Basic認証を使用
      headers.Authorization = `Basic ${btoa(`${BASIC_AUTH_USER}:${BASIC_AUTH_PASSWORD}`)}`;
      // }
    } else {
      // 非APIエンドポイントの場合：Basic認証を使用
      headers.Authorization = `Basic ${btoa(`${BASIC_AUTH_USER}:${BASIC_AUTH_PASSWORD}`)}`;
    }
  }
  // else if (token) {
  //   // 通常環境でトークンベースの認証
  //   headers.Authorization = `Bearer ${token}`;
  // }

  try {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });
  } catch (error) {
    console.error(`API Request to ${endpoint} failed:`, error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/api/v1/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  // if (data.token) {
  //   localStorage.setItem('token', data.token);
  // }
  return data;
};

// チーム検索API
export const searchTeams = async (keyword: string, page: number = 1) => {
  const res = await apiRequest(
    `/api/v1/search/team?keyword=${encodeURIComponent(keyword)}&page=${page}`
  );
  if (!res.ok) throw new Error('検索失敗');
  return res.json();
};

// マッチ検索API
export const searchMatch = async (keyword: string, page: number = 1) => {
  const res = await apiRequest(
    `/api/v1/search/match?keyword=${encodeURIComponent(keyword)}&page=${page}`
  );
  if (!res.ok) throw new Error('検索失敗');
  return res.json();
};

// チームファイルのダウンロード可否チェック＆実行
export const tryDownloadTeamFile = async (
  teamId: number
): Promise<{ success: boolean; error?: string }> => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/download/${teamId}`;
  try {
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
    const contentType = res.headers.get('Content-Type') || '';
    if (!res.ok) {
      // 400, 404, 500 など
      if (contentType.includes('application/json')) {
        const data = await res.json();
        return {
          success: false,
          error: data.error || `ダウンロードできません (${res.status})`,
        };
      } else {
        return { success: false, error: `ダウンロード失敗 (${res.status})` };
      }
    }
    if (contentType.includes('application/json')) {
      // サーバーが200でもエラーJSON返す場合
      const data = await res.json();
      return { success: false, error: data.error || 'ダウンロードできません' };
    }
    window.open(url, '_blank');
    return { success: true };
  } catch (_e) {
    return { success: false, error: 'ダウンロード通信エラー' };
  }
};

/**
 * ファイル削除API
 * @param id 削除対象のファイルID
 * @param deletePassword 削除パスワード（設定されている場合）
 * @returns レスポンスデータ
 */
export const deleteSearchFile = async (
  id: number,
  deletePassword: string = ''
): Promise<{ message: string }> => {
  try {
    const res = await apiRequest('/api/v1/delete/searchFile', {
      method: 'POST',
      body: JSON.stringify({
        id,
        deletePassword,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `削除失敗 (${res.status})`);
    }

    return res.json();
  } catch (error: any) {
    console.error('ファイル削除APIエラー:', error);
    throw error;
  }
};

// ユーザー名更新API
export const updateUserName = async (name: string) => {
  try {
    const res = await apiRequest('/api/v1/user/update', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      throw new Error(`更新失敗 (${res.status}): ${res.statusText}...`);
    }
  } catch (error) {
    console.error('API呼び出しエラー:', error);
    throw error;
  }
};
export const register = async (
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
) => {
  const res = await fetch(`${API_BASE_URL}/api/v1/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });
  const data = await res.json();
  // if (data.token) {
  //   localStorage.setItem('token', data.token);
  // }
  return data;
};

/**
 * チームファイルアップロードAPI
 * @param file アップロードするファイル
 * @param isAuthenticated 認証状態
 * @returns レスポンスデータ
 */
export const uploadTeamFile = async (
  file: File,
  isAuthenticated: boolean,
  options?: {
    ownerName?: string;
    comment?: string;
    tags?: string[];
    deletePassword?: string;
    downloadDate?: string;
  }
) => {
  const endpoint = isAuthenticated
    ? '/api/v1/team/upload'
    : '/api/v1/team/simpleupload';
  const formData = new FormData();
  formData.append('teamFile', file);
  if (options?.ownerName) formData.append('teamOwnerName', options.ownerName);
  if (options?.comment) formData.append('teamComment', options.comment);
  if (options?.deletePassword)
    formData.append('teamDeletePassWord', options.deletePassword);
  if (options?.downloadDate)
    formData.append('teamDownloadableAt', options.downloadDate);
  if (options?.tags && Array.isArray(options.tags)) {
    formData.append('teamSearchTags', options.tags.join(','));
  }

  // FormDataの場合はContent-Typeを自動設定（multipart/form-data）
  // const token =
  //   typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = {};
  // トークン認証
  // if (token) headers.Authorization = `Bearer ${token}`;
  // APIリクエストとして認識させる
  headers.Accept = 'application/json';
  // Basic認証（特定環境のみ）
  if (
    API_BASE_URL.includes('stg.project-europa.work') &&
    BASIC_AUTH_USER &&
    BASIC_AUTH_PASSWORD &&
    !endpoint.startsWith('/api/')
  ) {
    headers.Authorization = `Basic ${btoa(`${BASIC_AUTH_USER}:${BASIC_AUTH_PASSWORD}`)}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers, // Content-TypeはFormData時は自動
      body: formData,
      credentials: 'include',
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw errorData;
    }
    return res.json();
  } catch (error: any) {
    console.error('ファイルアップロードAPIエラー:', error);
    throw error;
  }
};

/**
 * マッチファイルアップロードAPI
 * @param file アップロードするファイル
 * @param isAuthenticated 認証状態
 * @returns レスポンスデータ
 */
// チーム一括DL用 検索API（ページネーション対応）
export const sumDLSearchTeam = async (
  keyword: string = '',
  page: number = 1
) => {
  const res = await apiRequest(
    `/api/v1/sumDLSearch/team?keyword=${encodeURIComponent(keyword)}&page=${page}`
  );
  if (!res.ok) throw new Error('検索失敗');
  return res.json();
};

// マッチ一括DL用 検索API（ページネーション対応）
export const sumDLSearchMatch = async (
  keyword: string = '',
  page: number = 1
) => {
  const res = await apiRequest(
    `/api/v1/sumDLSearch/match?keyword=${encodeURIComponent(keyword)}&page=${page}`
  );
  if (!res.ok) throw new Error('検索失敗');
  return res.json();
};

// チーム一括DL用 ZIPダウンロードAPI
export const sumDownload = async (checkedId: number[]) => {
  const res = await apiRequest('/api/v1/sumDownload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ checkedId }),
  });
  if (!res.ok) throw new Error('ダウンロード失敗');
  // ZIPファイル取得
  const blob = await res.blob();
  // ダウンロード処理
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sum.zip';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 100);
};

export const registerEvent = async (formData: {
  name: string;
  details: string;
  url?: string;
  deadline: string;
  endDisplayDate: string;
  type: string;
}) => {
  const res = await apiRequest('/api/v1/eventNotice', {
    method: 'POST',
    body: JSON.stringify({
      eventName: formData.name,
      eventDetails: formData.details,
      eventReferenceUrl: formData.url,
      eventClosingDay: formData.deadline,
      eventDisplayingDay: formData.endDisplayDate,
      eventType: formData.type,
    }),
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('登録に失敗しました');
  return await res.json();
};

// イベント一覧取得API
export const fetchEvents = async () => {
  const res = await apiRequest('/api/v1/event', { method: 'GET' });
  if (!res.ok) throw new Error('取得に失敗しました');
  const response = await res.json();
  // スネークケース→キャメルケース変換
  return {
    data: (response.data ?? []).map((event: any) => ({
      id: String(event.id),
      name: event.event_name ?? '',
      details: event.event_details ?? '',
      url: event.event_reference_url ?? '',
      deadline: event.event_closing_day ?? '',
      endDisplayDate: event.event_displaying_day ?? '',
      type: event.event_type ?? '',
      created_at: event.created_at,
      updatedAt: event.updated_at,
      isActive: event.is_active,
    })),
  };
};

// マイページ：チームファイル取得API
export const fetchMyTeamFiles = async () => {
  const res = await apiRequest('/api/v1/mypage/team', { method: 'GET' });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`チームデータ取得失敗 (${res.status}): ${errorText}`);
  }
  const data = await res.json();
  return data.files || [];
};

// マイページ：マッチファイル取得API
export const fetchMyMatchFiles = async () => {
  const res = await apiRequest('/api/v1/mypage/match', { method: 'GET' });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`マッチデータ取得失敗 (${res.status}): ${errorText}`);
  }
  const data = await res.json();
  return data.files || [];
};

// マイページ：イベント削除API
export const deleteMyEvent = async (id: string | number) => {
  const res = await apiRequest('/api/v1/delete/usersRegisteredCloumn', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  const data = await res.json();
  if (!res.ok || !data.deleted)
    throw new Error(data.error || '削除に失敗しました');
  return data;
};

// マイページ：ファイル削除API
export const deleteMyFile = async (id: string | number) => {
  const res = await apiRequest('/api/v1/delete/myFile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'ファイル削除に失敗しました');
  return data;
};

// マイページ：イベント取得API
export const sendPasswordResetLink = async (
  email: string
): Promise<{ status?: string; error?: string }> => {
  const res = await apiRequest('/api/v1/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (res.ok && data.status) return { status: data.status };
  return { error: data.error || '送信に失敗しました' };
};

// パスワードリセットトークン検証API
export const checkResetPasswordToken = async (
  token: string,
  email: string
): Promise<{ valid: boolean; message?: string }> => {
  const params = new URLSearchParams({ token, email });
  const res = await apiRequest(`/api/v1/reset-password?${params.toString()}`, {
    method: 'GET',
  });
  if (res.ok) {
    return { valid: true };
  } else {
    const data = await res.json().catch(() => ({}));
    return {
      valid: false,
      message: data.message || '無効なリセットリンクです',
    };
  }
};

// パスワードリセットAPI
export const resetPassword = async (
  token: string,
  email: string,
  password: string,
  passwordConfirmation: string
): Promise<{ message?: string; error?: string }> => {
  const res = await apiRequest('/api/v1/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });
  const data = await res.json();
  if (res.ok && data.message) return { message: data.message };
  return { error: data.error || 'リセットに失敗しました' };
};

export const fetchMyEvents = async () => {
  const res = await apiRequest('/api/v1/mypage/events', { method: 'GET' });
  if (!res.ok) throw new Error('イベント取得失敗');
  const data = await res.json();
  // スネークケース→キャメルケース変換
  return (data.events ?? []).map((event: any) => ({
    id: String(event.id),
    name: event.event_name ?? '',
    details: event.event_details ?? '',
    url: event.event_reference_url ?? '',
    deadline: event.event_closing_day ?? '',
    endDisplayDate: event.event_displaying_day ?? '',
    type: event.event_type ?? '',
    registeredDate: event.created_at ? event.created_at.slice(0, 10) : '',
  }));
};

export const uploadMatchFile = async (
  file: File,
  isAuthenticated: boolean,
  options?: {
    ownerName?: string;
    comment?: string;
    tags?: string[];
    deletePassword?: string;
    downloadDate?: string;
  }
) => {
  const endpoint = isAuthenticated
    ? '/api/v1/match/upload'
    : '/api/v1/match/simpleupload';
  const formData = new FormData();
  formData.append('matchFile', file);
  if (options?.ownerName) formData.append('matchOwnerName', options.ownerName);
  if (options?.comment) formData.append('matchComment', options.comment);
  if (options?.deletePassword)
    formData.append('matchDeletePassWord', options.deletePassword);
  if (options?.downloadDate)
    formData.append('matchDownloadableAt', options.downloadDate);
  if (options?.tags && Array.isArray(options.tags)) {
    formData.append('matchSearchTags', options.tags.join(','));
  }

  // FormDataの場合はContent-Typeを自動設定（multipart/form-data）
  // const token =
  //   typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = {};
  // if (token) headers.Authorization = `Bearer ${token}`;
  headers.Accept = 'application/json';
  if (
    API_BASE_URL.includes('stg.project-europa.work') &&
    BASIC_AUTH_USER &&
    BASIC_AUTH_PASSWORD &&
    !endpoint.startsWith('/api/')
  ) {
    headers.Authorization = `Basic ${btoa(`${BASIC_AUTH_USER}:${BASIC_AUTH_PASSWORD}`)}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include',
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw errorData;
    }
    return res.json();
  } catch (error: any) {
    console.error('マッチファイルアップロードAPIエラー:', error);
    throw error;
  }
};
