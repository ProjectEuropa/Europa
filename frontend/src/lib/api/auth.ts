/**
 * 認証関連のAPI関数
 */

import type { ApiResponse } from '@/types/api';
import type {
  LoginCredentials,
  LoginResponse,
  PasswordResetData,
  PasswordResetRequest,
  PasswordResetResponse,
  PasswordResetResult,
  PasswordResetTokenCheck,
  PasswordResetTokenResponse,
  RegisterCredentials,
  RegisterResponse,
  User,
  UserUpdateData,
} from '@/types/user';
import { apiClient } from './client';

/**
 * 認証レスポンスを正規化する関数
 * 異なるレスポンス形式を統一された形式に変換
 */
function normalizeAuthResponse<T extends LoginResponse | RegisterResponse>(
  response: any
): T {
  // パターン1: HttpOnly Cookie認証 { message: "...", user: {...} }
  // token はCookieに保存されているため、レスポンスに含まれない
  if (
    response &&
    typeof response === 'object' &&
    'user' in response &&
    typeof response.user === 'object'
  ) {
    // tokenがない場合は空文字列を設定（後方互換性のため）
    // messageなどの余計なプロパティは除外して、必要なものだけを返す
    return {
      token: response.token || '',
      user: response.user,
    } as T;
  }

  // パターン2: dataプロパティでラップ { data: { user: {...}, token: "..." } }
  if (response && typeof response === 'object' && 'data' in response) {
    const apiResponse = response as ApiResponse<any>;
    if (apiResponse.data && typeof apiResponse.data === 'object' && 'user' in apiResponse.data) {
      return {
        token: apiResponse.data.token || '',
        user: apiResponse.data.user,
      } as T;
    }
  }

  // 予期しない構造の場合
  console.warn('Unexpected auth response structure:', response);
  throw new Error(
    `Invalid authentication response structure. Expected either direct data or wrapped in 'data' property.`
  );
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // CSRF Cookieを事前に取得
    try {
      await apiClient.getCsrfCookie();
    } catch (error) {
      throw new Error(`CSRF cookie取得に失敗しました。ネットワーク接続を確認してください: ${error}`);
    }

    const response = await apiClient.post<LoginResponse>(
      '/api/v2/auth/login',
      {
        email: credentials.email,
        password: credentials.password,
        remember: credentials.remember,
      }
    );

    // レスポンス構造の正規化
    const normalizedResponse = normalizeAuthResponse<LoginResponse>(response);

    return normalizedResponse;
  },

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    // CSRF Cookieを事前に取得
    try {
      await apiClient.getCsrfCookie();
    } catch (error) {
      throw new Error(`CSRF cookie取得に失敗しました。ネットワーク接続を確認してください: ${error}`);
    }

    const response = await apiClient.post<RegisterResponse>(
      '/api/v2/auth/register',
      {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        password_confirmation: credentials.passwordConfirmation,
      }
    );

    // レスポンス構造の正規化
    const normalizedResponse =
      normalizeAuthResponse<RegisterResponse>(response);

    return normalizedResponse;
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/api/v2/auth/me');

    // レスポンスが直接ユーザーデータを含む場合
    if (response && typeof response === 'object' && 'id' in response) {
      return response as unknown as User;
    }

    // レスポンスがdata プロパティを持つ場合
    if (response && typeof response === 'object' && 'data' in response) {
      const apiResponse = response as unknown as ApiResponse<User>;
      return (apiResponse.data as any).user || apiResponse.data;
    }

    throw new Error('Invalid user profile response structure');
  },

  async updateProfile(data: UserUpdateData): Promise<void> {
    await apiClient.put('/api/v2/auth/me', data);
  },

  async sendPasswordResetLink(
    request: PasswordResetRequest
  ): Promise<PasswordResetResponse> {
    const response = await apiClient.post<{ message: string }>(
      '/api/v2/auth/password/reset',
      { email: request.email }
    );
    return { status: 'success', message: response.message };
  },

  async resetPassword(data: PasswordResetData): Promise<PasswordResetResult> {
    try {
      const response = await apiClient.post<{ message: string }>(
        '/api/v2/auth/password/update',
        {
          token: data.token,
          password: data.password,
        }
      );

      return { message: response.message };
    } catch (error: any) {
      return { error: error.message || 'リセットに失敗しました' };
    }
  },

  async checkResetPasswordToken(
    data: { token: string; email?: string }
  ): Promise<PasswordResetTokenResponse> {
    const response = await apiClient.post<PasswordResetTokenResponse>(
      '/api/v2/auth/password/check',
      {
        token: data.token,
      }
    );
    
    // レスポンスがdataプロパティでラップされている場合を処理
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as any).data;
    }
    
    return response;
  },

  async logout(): Promise<void> {
    try {
      // Call server logout endpoint to invalidate session/token
      await apiClient.post('/api/v2/auth/logout');
    } catch (error) {
      console.warn('Server logout failed:', error);
    } finally {
      // Always clean up local storage regardless of server response
      // localStorage.removeItem('token');
    }
  },
};
