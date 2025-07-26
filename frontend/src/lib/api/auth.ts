/**
 * 認証関連のAPI関数
 */

import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';
import type {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
  PasswordResetRequest,
  PasswordResetResponse,
  PasswordResetTokenCheck,
  PasswordResetTokenResponse,
  PasswordResetData,
  PasswordResetResult,
  User,
  UserUpdateData,
} from '@/types/user';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/api/v1/login', credentials);

    // レスポンスの構造をログで確認
    console.log('Login response:', response);

    // レスポンスが直接データを含む場合（token と user プロパティがある）
    if (response && typeof response === 'object' && 'token' in response && 'user' in response) {
      const loginResponse = response as unknown as LoginResponse;
      if (loginResponse.token) {
        localStorage.setItem('token', loginResponse.token);
      }
      return loginResponse;
    }

    // レスポンスがdata プロパティを持つ場合
    if (response && typeof response === 'object' && 'data' in response) {
      const apiResponse = response as unknown as ApiResponse<LoginResponse>;
      if (apiResponse.data && apiResponse.data.token) {
        localStorage.setItem('token', apiResponse.data.token);
      }
      return apiResponse.data;
    }

    throw new Error('Invalid login response structure');
  },

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/api/v1/register', {
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
      password_confirmation: credentials.passwordConfirmation,
    });

    // レスポンスの構造をログで確認
    console.log('Register response:', response);

    // レスポンスが直接データを含む場合（token と user プロパティがある）
    if (response && typeof response === 'object' && 'token' in response && 'user' in response) {
      const registerResponse = response as unknown as RegisterResponse;
      if (registerResponse.token) {
        localStorage.setItem('token', registerResponse.token);
      }
      return registerResponse;
    }

    // レスポンスがdata プロパティを持つ場合
    if (response && typeof response === 'object' && 'data' in response) {
      const apiResponse = response as unknown as ApiResponse<RegisterResponse>;
      if (apiResponse.data && apiResponse.data.token) {
        localStorage.setItem('token', apiResponse.data.token);
      }
      return apiResponse.data;
    }

    throw new Error('Invalid register response structure');
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/api/v1/user/profile');
    return response.data;
  },

  async updateProfile(data: UserUpdateData): Promise<void> {
    await apiClient.post('/api/v1/user/update', data);
  },

  async sendPasswordResetLink(request: PasswordResetRequest): Promise<PasswordResetResponse> {
    const response = await apiClient.post<PasswordResetResponse>('/api/v1/forgot-password', request);
    return response.data;
  },

  async checkResetPasswordToken(check: PasswordResetTokenCheck): Promise<PasswordResetTokenResponse> {
    const params = new URLSearchParams({
      token: check.token,
      email: check.email
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
      const response = await apiClient.post<{ message: string }>('/api/v1/reset-password', {
        token: data.token,
        email: data.email,
        password: data.password,
        password_confirmation: data.passwordConfirmation,
      });

      return { message: response.data.message };
    } catch (error: any) {
      return { error: error.message || 'リセットに失敗しました' };
    }
  },

  logout(): void {
    localStorage.removeItem('token');
  },
};
