/**
 * 型安全なAPIクライアント
 */

import type { ApiClientConfig, ApiResponse } from '@/types/api';
import { ApiErrorClass } from '@/types/api';

export interface DownloadResult {
  blob: Blob;
  filename?: string;
  headers: Headers;
}

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
   * CSRF Cookieを取得（Sanctum Token認証では不要だが互換性のため残す）
   */
  async getCsrfCookie(): Promise<void> {
    // Sanctum Token + HttpOnly Cookie方式ではCSRF不要
    // 互換性のため空実装を残す
    return Promise.resolve();
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers = {
      ...this.defaultHeaders,
      ...this.processHeaders(options.headers),
    };

    // Basic認証の処理
    this.addBasicAuthIfNeeded(headers, endpoint);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include', // HttpOnly Cookieの送受信に必須
      });

      if (!response.ok) {
        let errorData: any = {};
        try {
          const rawError = await response.json();
          console.log('[API Client] Raw error response:', rawError);
          
          // バックエンドのエラー形式を正規化
          // { error: { message: "..." } } → { message: "..." }
          if (rawError.error?.message) {
            errorData = {
              message: rawError.error.message,
              code: rawError.error.code,
              errors: rawError.error.details || rawError.errors,
            };
          } else if (rawError.message) {
            // 既に正しい形式の場合
            errorData = rawError;
          } else {
            // 予期しない形式の場合
            errorData = {
              message: `HTTP ${response.status}: ${response.statusText}`,
              rawError,
            };
          }
          
          console.log('[API Client] Normalized error data:', errorData);
        } catch (parseError) {
          console.error('[API Client] Failed to parse error response:', parseError);
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
    options?: RequestInit & { body?: string }
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { 
      ...options, 
      method: 'DELETE',
      body: options?.body 
    });
  }

  async upload<T>(
    endpoint: string,
    formData: FormData,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
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
        credentials: 'include', // HttpOnly Cookieの送受信に必須
      });

      if (!response.ok) {
        let errorData: any = {};
        try {
          const rawError = await response.json();
          console.log('[API Client] Raw error response:', rawError);
          
          // バックエンドのエラー形式を正規化
          // { error: { message: "..." } } → { message: "..." }
          if (rawError.error?.message) {
            errorData = {
              message: rawError.error.message,
              code: rawError.error.code,
              errors: rawError.error.details || rawError.errors,
            };
          } else if (rawError.message) {
            // 既に正しい形式の場合
            errorData = rawError;
          } else {
            // 予期しない形式の場合
            errorData = {
              message: `HTTP ${response.status}: ${response.statusText}`,
              rawError,
            };
          }
          
          console.log('[API Client] Normalized error data:', errorData);
        } catch (parseError) {
          console.error('[API Client] Failed to parse error response:', parseError);
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

  async download(endpoint: string, data?: any): Promise<DownloadResult> {
    const headers = {
      ...this.defaultHeaders,
    };

    this.addBasicAuthIfNeeded(headers, endpoint);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: data ? JSON.stringify(data) : undefined,
        credentials: 'include', // HttpOnly Cookieの送受信に必須
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();

      // Content-Dispositionヘッダーからファイル名を抽出
      const disposition = response.headers.get('content-disposition');
      let filename: string | undefined;

      if (disposition) {
        const filenameMatch = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
          try {
            filename = decodeURIComponent(filename);
          } catch {
            // デコード失敗時はそのまま使用
          }
        }
      }

      return { blob, filename, headers: response.headers };
    } catch (error) {
      console.error(`Download from ${endpoint} failed:`, error);
      throw error;
    }
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

    // ステージング環境の場合、APIエンドポイント以外にBasic認証を追加
    // APIエンドポイントはSanctumのCookieベース認証を使用
    if (
      this.baseURL.includes('stg.project-europa.work') &&
      basicAuthUser &&
      basicAuthPassword &&
      !endpoint.startsWith('/api/') // APIエンドポイントは除外
    ) {
      headers.Authorization = `Basic ${btoa(`${basicAuthUser}:${basicAuthPassword}`)}`;
    }
  }
}

// シングルトンインスタンス
export const apiClient = new ApiClient();
