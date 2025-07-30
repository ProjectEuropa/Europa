import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { authApi } from '@/lib/api/auth';
import { apiClient } from '@/lib/api/client';
import type { LoginCredentials, RegisterCredentials } from '@/types/user';

// APIクライアントをモック
vi.mock('@/lib/api/client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

// localStorageのモック
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('login', () => {
    it('should login successfully with direct response structure', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      // 直接データを含むレスポンス構造
      const mockResponse = {
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
        token: 'test-token-123',
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await authApi.login(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/login', credentials);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'token',
        'test-token-123'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should login successfully with wrapped response structure', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      // dataプロパティでラップされたレスポンス構造
      const mockResponse = {
        data: {
          user: { id: 1, name: 'Test User', email: 'test@example.com' },
          token: 'test-token-123',
        },
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await authApi.login(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/login', credentials);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'token',
        'test-token-123'
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle login without token storage when token is not provided', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      // tokenがない場合のレスポンス
      const mockResponse = {
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
        token: '', // 空のtoken
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await authApi.login(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/login', credentials);
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it('should handle unexpected response structure gracefully', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      // 予期しないレスポンス構造
      const mockResponse = {
        unexpected: 'structure',
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      // エラーが適切に処理されることを確認
      await expect(authApi.login(credentials)).rejects.toThrow();
    });
  });

  describe('register', () => {
    it('should register successfully with direct response structure', async () => {
      const credentials: RegisterCredentials = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        passwordConfirmation: 'password123',
      };

      // 直接データを含むレスポンス構造
      const mockResponse = {
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
        token: 'test-token-123',
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await authApi.register(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/register', {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        password_confirmation: credentials.passwordConfirmation,
      });
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'token',
        'test-token-123'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should register successfully with wrapped response structure', async () => {
      const credentials: RegisterCredentials = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        passwordConfirmation: 'password123',
      };

      // dataプロパティでラップされたレスポンス構造
      const mockResponse = {
        data: {
          user: { id: 1, name: 'Test User', email: 'test@example.com' },
          token: 'test-token-123',
        },
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await authApi.register(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/register', {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        password_confirmation: credentials.passwordConfirmation,
      });
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'token',
        'test-token-123'
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle unexpected register response structure gracefully', async () => {
      const credentials: RegisterCredentials = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        passwordConfirmation: 'password123',
      };

      // 予期しないレスポンス構造
      const mockResponse = {
        unexpected: 'structure',
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      // エラーが適切に処理されることを確認
      await expect(authApi.register(credentials)).rejects.toThrow();
    });
  });

  describe('getProfile', () => {
    it('should get user profile with direct response', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockUser);

      const result = await authApi.getProfile();

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/user/profile');
      expect(result).toEqual(mockUser);
    });

    it('should get user profile with wrapped response', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        createdAt: '2024-01-01T00:00:00Z',
      };

      const mockResponse = { data: mockUser };
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await authApi.getProfile();

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/user/profile');
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce({ data: {} });

      await authApi.updateProfile(updateData);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/v1/user/update',
        updateData
      );
    });
  });

  describe('sendPasswordResetLink', () => {
    it('should send password reset link', async () => {
      const request = { email: 'test@example.com' };
      const mockResponse = {
        data: { message: 'Password reset link sent' },
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await authApi.sendPasswordResetLink(request);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/v1/forgot-password',
        request
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('checkResetPasswordToken', () => {
    it('should return valid for valid token', async () => {
      const check = { token: 'valid-token', email: 'test@example.com' };

      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: {} });

      const result = await authApi.checkResetPasswordToken(check);

      expect(apiClient.get).toHaveBeenCalledWith(
        '/api/v1/reset-password?token=valid-token&email=test%40example.com'
      );
      expect(result).toEqual({ valid: true });
    });

    it('should return invalid for invalid token', async () => {
      const check = { token: 'invalid-token', email: 'test@example.com' };

      vi.mocked(apiClient.get).mockRejectedValueOnce(
        new Error('Invalid token')
      );

      const result = await authApi.checkResetPasswordToken(check);

      expect(result).toEqual({
        valid: false,
        message: 'Invalid token',
      });
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const data = {
        token: 'reset-token',
        email: 'test@example.com',
        password: 'newpassword123',
        passwordConfirmation: 'newpassword123',
      };

      const mockResponse = {
        message: 'Password reset successfully',
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await authApi.resetPassword(data);

      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/reset-password', {
        token: data.token,
        email: data.email,
        password: data.password,
        password_confirmation: data.passwordConfirmation,
      });
      expect(result).toEqual({ message: 'Password reset successfully' });
    });

    it('should handle reset password error', async () => {
      const data = {
        token: 'invalid-token',
        email: 'test@example.com',
        password: 'newpassword123',
        passwordConfirmation: 'newpassword123',
      };

      vi.mocked(apiClient.post).mockRejectedValueOnce(
        new Error('Reset failed')
      );

      const result = await authApi.resetPassword(data);

      expect(result).toEqual({ error: 'Reset failed' });
    });
  });

  describe('logout', () => {
    it('should remove token from localStorage', () => {
      authApi.logout();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
    });
  });
});
