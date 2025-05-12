const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://local.europa.com";
const BASIC_AUTH_USER = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const BASIC_AUTH_PASSWORD = process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD;

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
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
  };

  if (!headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // トークンベースの認証
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Basic認証（特定の環境のみ）
  if (
    API_BASE_URL.includes("stg.project-europa.work") &&
    BASIC_AUTH_USER && BASIC_AUTH_PASSWORD &&
    !endpoint.startsWith("/api/")
  ) {
    headers["Authorization"] = "Basic " + btoa(`${BASIC_AUTH_USER}:${BASIC_AUTH_PASSWORD}`);
  }

  try {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
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
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

// チーム検索API
export const searchTeams = async (keyword: string, page: number = 1) => {
  const res = await apiRequest(`/api/v1/search/team?keyword=${encodeURIComponent(keyword)}&page=${page}`);
  if (!res.ok) throw new Error('検索失敗');
  return res.json();
};

// チームファイルのダウンロード可否チェック＆実行
export const tryDownloadTeamFile = async (teamId: number): Promise<{ success: boolean; error?: string }> => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/download/${teamId}`;
  try {
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    });
    const contentType = res.headers.get('Content-Type') || "";
    if (!res.ok) {
      // 400, 404, 500 など
      if (contentType.includes('application/json')) {
        const data = await res.json();
        return { success: false, error: data.error || `ダウンロードできません (${res.status})` };
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
  } catch (e) {
    return { success: false, error: 'ダウンロード通信エラー' };
  }
};

/**
 * ファイル削除API
 * @param id 削除対象のファイルID
 * @param deletePassword 削除パスワード（設定されている場合）
 * @returns レスポンスデータ
 */
export const deleteSearchFile = async (id: number, deletePassword: string = ''): Promise<{ message: string }> => {
  try {
    const res = await apiRequest('/api/v1/delete/searchFile', {
      method: 'POST',
      body: JSON.stringify({
        id,
        deletePassword
      })
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
      body: JSON.stringify({ name })
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
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
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
  const endpoint = isAuthenticated ? '/api/v1/team/upload' : '/api/v1/team/simpleupload';
  const formData = new FormData();
  formData.append('teamFile', file);
  if (options?.ownerName) formData.append('teamOwnerName', options.ownerName);
  if (options?.comment) formData.append('teamComment', options.comment);
  if (options?.deletePassword) formData.append('teamDeletePassWord', options.deletePassword);
  if (options?.downloadDate) formData.append('teamDownloadableAt', options.downloadDate);
  if (options?.tags && Array.isArray(options.tags)) {
    formData.append('teamSearchTags', options.tags.join(','));
  }

  // FormDataの場合はContent-Typeを自動設定（multipart/form-data）
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  let headers: Record<string, string> = {};
  // トークン認証
  if (token) headers["Authorization"] = `Bearer ${token}`;
  // APIリクエストとして認識させる
  headers["Accept"] = "application/json";
  // Basic認証（特定環境のみ）
  if (
    API_BASE_URL.includes("stg.project-europa.work") &&
    BASIC_AUTH_USER && BASIC_AUTH_PASSWORD &&
    !endpoint.startsWith("/api/")
  ) {
    headers["Authorization"] = "Basic " + btoa(`${BASIC_AUTH_USER}:${BASIC_AUTH_PASSWORD}`);
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


