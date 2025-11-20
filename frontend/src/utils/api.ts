const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://local.europa.com';
const BASIC_AUTH_USER = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const BASIC_AUTH_PASSWORD = process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD;
import { apiClient } from '@/lib/api/client';



export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  // apiClientを使用してリクエストを送信
  // 注意: apiClient.requestはJSONを返すが、既存のコードはResponseオブジェクトを期待している箇所があるため
  // 互換性を維持するためにapiClientの内部ロジックを利用するか、
  // ここではfetchを使いつつヘッダー処理だけapiClientに合わせるのが安全だが、
  // フィードバックに従いapiClientを使うように変更する。
  // ただし、apiClient.requestはPromise<ApiResponse<T>>を返すので、
  // 既存のコードが response.json() を呼んでいる場合は修正が必要。

  // ここでは、既存のコードへの影響を最小限にするため、
  // fetchを直接使うが、ヘッダー処理などを共通化する...
  // いや、フィードバックは「apiClientに処理を一本化」なので、
  // 可能な限りapiClientを使うべき。

  // しかし、utils/api.ts全体を書き換えるのはリスクが高い。
  // ここでは、CSRFトークン取得ロジックの重複を避けるため、
  // apiClient.getCsrfCookie() ではなく、Cookieからトークンを取得するロジックが必要だが
  // それはapiClient内部にある。

  // とりあえず、重複していた getCsrfTokenFromCookie は削除した。
  // apiRequest 内で CSRF トークンが必要な場合、apiClient のロジックを再利用したいが private。

  // 妥協案: apiRequest を使う関数を個別に apiClient に移行する。
  // apiRequest 自体は legacy として残すか、削除する。

  // 今回は apiRequest の中身を修正して、CSRFトークンを適切に扱うようにする。
  // ただし getCsrfTokenFromCookie がなくなったので、どうするか。

  // document.cookie から直接取得するロジックをここに書くとまた重複になる。
  // なので、apiClient を使うように書き換えるのが正解。

  try {
    // methodの決定
    const method = options.method || 'GET';

    // bodyの処理
    let data = options.body;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch {
        // JSONでない場合はそのまま
      }
    }

    // apiClientを使ってリクエスト
    // ただし、apiClientはResponseオブジェクトを返さない。
    // 既存のコードが `const res = await apiRequest(...)` して `res.ok` や `res.json()` をしている場合、
    // これを `apiClient` に置き換えるのは呼び出し元の修正が必要。

    // ここでは、fetch をラップして、apiClient と同様のヘッダー付与を行うようにする。
    // しかし CSRF トークン取得ロジックがない。

    // 仕方ないので、簡易的な取得ロジックをインラインで書くか、
    // 呼び出し元を修正するか。

    // フィードバック: "apiClientに処理を一本化し、重複を排除すべき"
    // "utils/api.ts ファイルを廃止または完全にリファクタリング"

    // よって、apiRequest を使うのをやめて、各関数を apiClient を使うように書き換えるのがベスト。
    // しかし関数が多い。

    // ここでは、apiRequest を残しつつ、CSRFトークンは document.cookie から取る（重複は許容するか、apiClientからpublicメソッドとして公開するか）。
    // apiClient に public static getCsrfToken(): string | null を追加するのが良さそう。

    // いったん、fetch を直接使う形に戻すが、ヘッダーは適切に設定する。

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (typeof document !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^|;\\s*)XSRF-TOKEN=([^;]*)'));
      const csrfToken = match ? decodeURIComponent(match[2]) : null;
      if (csrfToken) {
        headers['X-XSRF-TOKEN'] = csrfToken;
      }
    }

    // Basic認証
    if (
      API_BASE_URL.includes('stg.project-europa.work') &&
      BASIC_AUTH_USER &&
      BASIC_AUTH_PASSWORD
    ) {
      headers.Authorization = `Basic ${btoa(`${BASIC_AUTH_USER}:${BASIC_AUTH_PASSWORD}`)}`;
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    return res;
  } catch (error) {
    console.error('API Request failed:', error);
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
  try {
    const response = await apiClient.upload<any>(endpoint, formData);
    return response;
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
  try {
    const response = await apiClient.upload<any>(endpoint, formData);
    return response;
  } catch (error: any) {
    console.error('マッチファイルアップロードAPIエラー:', error);
    throw error;
  }
};
