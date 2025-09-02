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
    try {
      console.log('🔒 Fetching CSRF cookie from:', `${this.baseURL}/sanctum/csrf-cookie`);
      // Sanctumの標準CSRFエンドポイントを使用
      const response = await fetch(`${this.baseURL}/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`CSRF endpoint returned ${response.status}`);
      }
      
      console.log('🔒 CSRF cookie response:', response.status);
      // レスポンスを完全に処理してからクッキーが設定されるのを待つ
      await response.text();
      
      // クッキー確認
      console.log('🍪 All cookies after CSRF call:', document.cookie);
    } catch (error) {
      console.warn('CSRF cookie取得に失敗:', error);
    }
  }

  private getCsrfTokenFromCookie(): string | null {
    if (typeof document === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'XSRF-TOKEN') {
        return decodeURIComponent(value);
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
    
    console.log('🌐 Request:', options.method || 'GET', endpoint);
    console.log('🔑 CSRF token:', csrfToken ? 'Found' : 'Not found');
    console.log('🏠 Current domain:', window.location.origin);
    console.log('🎯 API domain:', this.baseURL);
    
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

    if (
      this.baseURL.includes('stg.project-europa.work') &&
      basicAuthUser &&
      basicAuthPassword &&
      !endpoint.startsWith('/api/')
    ) {
      headers.Authorization = `Basic ${btoa(`${basicAuthUser}:${basicAuthPassword}`)}`;
    }
  }
}

// シングルトンインスタンス
export const apiClient = new ApiClient();
