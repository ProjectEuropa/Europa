/**
 * 型安全なAPIクライアント
 */

import type { ApiClientConfig, ApiResponse } from '@/types/api';
import { ApiErrorClass } from '@/types/api';

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(config?: Partial<ApiClientConfig>) {
    this.baseURL =
      config?.baseURL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'https://local.europa.com';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest', // Laravel SPAモードで必要
      ...config?.defaultHeaders,
    };
  }

  /**
   * CSRF Cookieを取得してSPA認証を初期化
   */
  async getCsrfCookie(): Promise<void> {
    const headers: Record<string, string> = {};

    headers['X-Requested-With'] = 'XMLHttpRequest';

    // Sanctumの標準CSRFエンドポイントを使用
    const response = await fetch(`${this.baseURL}/sanctum/csrf-cookie`, {
      method: 'GET',
      credentials: 'include',
      headers,
    });

    if (!response.ok) {
      throw new Error(`CSRF endpoint returned ${response.status}`);
    }

    // レスポンスを完全に処理してからクッキーが設定されるのを待つ
    await response.text();
  }

  private getCsrfTokenFromCookie(): string | null {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, ...valueParts] = cookie.trim().split('=');
      const value = valueParts.join('='); // 値に=が含まれている場合も正しく処理

      if (name === 'XSRF-TOKEN') {
        // LaravelのXSRF-TOKENはURLエンコードされているのでデコード
        try {
          return decodeURIComponent(value);
        } catch (e) {
          console.warn('Failed to decode XSRF-TOKEN:', e);
          return value; // デコードに失敗した場合は生の値を返す
        }
      }
    }
    return null;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const csrfToken = this.getCsrfTokenFromCookie();

    const headers = {
      ...this.defaultHeaders,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(csrfToken && { 'X-XSRF-TOKEN': csrfToken }),
      ...this.processHeaders(options.headers),
    };

    // Basic認証の処理
    this.addBasicAuthIfNeeded(headers, endpoint);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          // JSONパースに失敗した場合のフォールバック
          errorData = {
            message: `HTTP ${response.status}: ${response.statusText}`,
            status: response.status,
          };
        }
        throw new ApiErrorClass(response.status, errorData);
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiErrorClass) {
        throw error;
      }
      console.error(`API Request to ${endpoint} failed:`, error);
      throw new ApiErrorClass(500, { message: 'Network error' });
    }
  }

  async get<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  async upload<T>(
    endpoint: string,
    formData: FormData,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...this.processHeaders(options?.headers),
    };

    // FormDataの場合はContent-Typeを設定しない（自動設定される）
    delete headers['Content-Type'];

    this.addBasicAuthIfNeeded(headers, endpoint);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          // JSONパースに失敗した場合のフォールバック
          errorData = {
            message: `HTTP ${response.status}: ${response.statusText}`,
            status: response.status,
          };
        }
        throw new ApiErrorClass(response.status, errorData);
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiErrorClass) {
        throw error;
      }
      console.error(`Upload to ${endpoint} failed:`, error);
      throw new ApiErrorClass(500, { message: 'Upload failed' });
    }
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;

    // まずlocalStorageの'token'キーを確認
    let token = localStorage.getItem('token');

    // なければZustandのpersistストレージを確認
    if (!token) {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        try {
          const parsed = JSON.parse(authStorage);
          token = parsed.state?.token || null;
        } catch (e) {
          console.warn('Failed to parse auth-storage:', e);
        }
      }
    }

    return token;
  }

  private processHeaders(headers?: HeadersInit): Record<string, string> {
    if (!headers) return {};

    if (headers instanceof Headers) {
      const result: Record<string, string> = {};
      headers.forEach((value, key) => {
        result[key] = value;
      });
      return result;
    }

    if (Array.isArray(headers)) {
      const result: Record<string, string> = {};
      headers.forEach(([key, value]) => {
        result[key] = value;
      });
      return result;
    }

    return headers as Record<string, string>;
  }

  private addBasicAuthIfNeeded(
    headers: Record<string, string>,
    endpoint: string
  ): void {
    const basicAuthUser = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
    const basicAuthPassword = process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD;

    // ステージング環境の場合、すべてのエンドポイントにBasic認証を追加
    if (
      this.baseURL.includes('stg.project-europa.work') &&
      basicAuthUser &&
      basicAuthPassword
    ) {
      headers.Authorization = `Basic ${btoa(`${basicAuthUser}:${basicAuthPassword}`)}`;
    }
  }
}

// シングルトンインスタンス
export const apiClient = new ApiClient();
