/**
 * 認証関連のAPI関数
 */

import type { ApiResponse } from '@/types/api';
import type {
  Login2FAResponse,
  LoginCredentials,
  LoginResponse,
  LoginResult,
  PasswordResetData,
  PasswordResetRequest,
  PasswordResetResponse,
  PasswordResetResult,
  PasswordResetTokenCheck,
  PasswordResetTokenResponse,
  RegisterCredentials,
  RegisterResponse,
  ResendOtpResponse,
  User,
  UserUpdateData,
  VerifyOtpCredentials,
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
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    // CSRF Cookieを事前に取得
    try {
      await apiClient.getCsrfCookie();
    } catch (error) {
      throw new Error(`CSRF cookie取得に失敗しました。ネットワーク接続を確認してください: ${error}`);
    }

    const response = await apiClient.post<any>(
      '/api/v2/auth/login',
      {
        email: credentials.email,
        password: credentials.password,
        remember: credentials.remember,
      }
    );

    // 2FA（ワンタイムパスコード）要求レスポンスの判定
    const responseData = response?.data || response;
    if (responseData && responseData.requires2FA) {
      return {
        requires2FA: true,
        sessionToken: responseData.sessionToken,
        maskedEmail: responseData.maskedEmail,
        expiresIn: responseData.expiresIn || 600,
      } as Login2FAResponse;
    }

    // レスポンス構造の正規化（従来の直接ログイン形式）
    const normalizedResponse = normalizeAuthResponse<LoginResponse>(response);
    return normalizedResponse;
  },

  /**
   * 2段階認証コードの検証
   */
  async verifyOtp(credentials: VerifyOtpCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<any>(
      '/api/v2/auth/verify-otp',
      {
        sessionToken: credentials.sessionToken,
        code: credentials.code,
        remember: credentials.remember,
      }
    );

    return normalizeAuthResponse<LoginResponse>(response);
  },

  /**
   * 認証コードの再送信
   */
  async resendOtp(sessionToken: string): Promise<ResendOtpResponse> {
    const response = await apiClient.post<any>(
      '/api/v2/auth/resend-otp',
      {
        sessionToken,
      }
    );

    const data = response?.data || response;
    return {
      message: response?.message || '認証コードを再送信しました',
      expiresIn: data?.expiresIn || 600,
    };
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
