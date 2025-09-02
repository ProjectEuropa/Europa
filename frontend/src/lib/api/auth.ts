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
  // パターン1: 直接データ構造 { user: {...}, token: "..." }
  if (
    response &&
    typeof response === 'object' &&
    'token' in response &&
    'user' in response
  ) {
    return response as T;
  }

  // パターン2: dataプロパティでラップ { data: { user: {...}, token: "..." } }
  if (response && typeof response === 'object' && 'data' in response) {
    const apiResponse = response as ApiResponse<T>;
    if (apiResponse.data) {
      return apiResponse.data;
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
    await apiClient.getCsrfCookie();
    
    const response = await apiClient.post<LoginResponse>(
      '/api/v1/login',
      credentials
    );

    // レスポンス構造の正規化
    const normalizedResponse = normalizeAuthResponse<LoginResponse>(response);

    // Tokenベース認証との後方互換性のため、tokenがある場合はlocalStorageに保存
    if (normalizedResponse.token) {
      localStorage.setItem('token', normalizedResponse.token);
    }

    return normalizedResponse;
  },

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    // CSRF Cookieを事前に取得
    await apiClient.getCsrfCookie();
    
    const response = await apiClient.post<RegisterResponse>(
      '/api/v1/register',
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

    // Tokenベース認証との後方互換性のため、tokenがある場合はlocalStorageに保存
    if (normalizedResponse.token) {
      localStorage.setItem('token', normalizedResponse.token);
    }

    return normalizedResponse;
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/api/v1/user/profile');

    // レスポンスが直接ユーザーデータを含む場合
    if (response && typeof response === 'object' && 'id' in response) {
      return response as unknown as User;
    }

    // レスポンスがdata プロパティを持つ場合
    if (response && typeof response === 'object' && 'data' in response) {
      const apiResponse = response as unknown as ApiResponse<User>;
      return apiResponse.data;
    }

    throw new Error('Invalid user profile response structure');
  },

  async updateProfile(data: UserUpdateData): Promise<void> {
    await apiClient.post('/api/v1/user/update', data);
  },

  async sendPasswordResetLink(
    request: PasswordResetRequest
  ): Promise<PasswordResetResponse> {
    const response = await apiClient.post<PasswordResetResponse>(
      '/api/v1/forgot-password',
      request
    );
    // Laravel APIは直接レスポンスオブジェクトを返すため、response.dataではなくresponse自体を返す
    return response as PasswordResetResponse;
  },

  async checkResetPasswordToken(
    check: PasswordResetTokenCheck
  ): Promise<PasswordResetTokenResponse> {
    const params = new URLSearchParams({
      token: check.token,
      email: check.email,
    });

    try {
      await apiClient.get(`/api/v1/reset-password?${params.toString()}`);
      return { valid: true };
    } catch (error: any) {
      return {
        valid: false,
        message: error.message || '無効なリセットリンクです',
      };
    }
  },

  async resetPassword(data: PasswordResetData): Promise<PasswordResetResult> {
    try {
      const response = await apiClient.post<{ message: string }>(
        '/api/v1/reset-password',
        {
          token: data.token,
          email: data.email,
          password: data.password,
          password_confirmation: data.passwordConfirmation,
        }
      );

      // Laravel APIは直接レスポンスオブジェクトを返すため、response.dataではなくresponse自体を使用
      return { message: (response as any).message };
    } catch (error: any) {
      return { error: error.message || 'リセットに失敗しました' };
    }
  },

  async logout(): Promise<void> {
    try {
      // Call server logout endpoint to invalidate session/token
      await apiClient.post('/api/v1/auth/logout');
    } catch (error) {
      console.warn('Server logout failed:', error);
    } finally {
      // Always clean up local storage regardless of server response
      localStorage.removeItem('token');
    }
  },
};
