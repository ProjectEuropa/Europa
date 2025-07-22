/**
 * API関連の型定義
 */

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}

export class ApiErrorClass extends Error {
  public status: number;
  public errors?: Record<string, string[]>;
  public data: any;

  constructor(status: number, data: any) {
    super(data.message || `API Error: ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.errors = data.errors;
    this.data = data;

    // エラーオブジェクトのスタックトレースを正しく設定
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiErrorClass);
    }
  }

  /**
   * エラーが特定のステータスコードかどうかを確認
   */
  is(status: number): boolean {
    return this.status === status;
  }

  /**
   * エラーが認証エラーかどうかを確認
   */
  isAuthError(): boolean {
    return this.status === 401;
  }

  /**
   * エラーが権限エラーかどうかを確認
   */
  isPermissionError(): boolean {
    return this.status === 403;
  }

  /**
   * エラーが見つからないエラーかどうかを確認
   */
  isNotFoundError(): boolean {
    return this.status === 404;
  }

  /**
   * エラーがバリデーションエラーかどうかを確認
   */
  isValidationError(): boolean {
    return this.status === 422 && !!this.errors;
  }

  /**
   * エラーがサーバーエラーかどうかを確認
   */
  isServerError(): boolean {
    return this.status >= 500;
  }
}

export interface RequestConfig extends RequestInit {
  endpoint: string;
}

export interface ApiClientConfig {
  baseURL: string;
  defaultHeaders: Record<string, string>;
}
