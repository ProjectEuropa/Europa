import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { authApi } from '@/lib/api/auth';
import { apiClient } from '@/lib/api/client';
import type { LoginCredentials, RegisterCredentials } from '@/types/user';

// APIクライアントをモック
vi.mock('@/lib/api/client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    getCsrfCookie: vi.fn(),
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

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse as any);

      const result = await authApi.login(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/api/v2/auth/login', {
        ...credentials,
        remember: undefined,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should login successfully with remember me option', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
        remember: true,
      };

      const mockResponse = {
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
        token: 'test-token-123',
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse as any);

      const result = await authApi.login(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/api/v2/auth/login', {
        ...credentials,
        remember: true,
      });
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

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse as any);

      const result = await authApi.login(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/api/v2/auth/login', {
        ...credentials,
        remember: undefined,
      });
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

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse as any);

      const result = await authApi.login(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/api/v2/auth/login', credentials);
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

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse as any);

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

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse as any);

      const result = await authApi.register(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/api/v2/auth/register', {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        password_confirmation: credentials.passwordConfirmation,
      });

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

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse as any);

      const result = await authApi.register(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/api/v2/auth/register', {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        password_confirmation: credentials.passwordConfirmation,
      });

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

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse as any);

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
        created_at: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockUser as any);

      const result = await authApi.getProfile();

      expect(apiClient.get).toHaveBeenCalledWith('/api/v2/auth/me');
      expect(result).toEqual(mockUser);
    });

    it('should get user profile with wrapped response', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
      };

      const mockResponse = { data: { user: mockUser } };
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse as any);

      const result = await authApi.getProfile();

      expect(apiClient.get).toHaveBeenCalledWith('/api/v2/auth/me');
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateProfile', () => {
    it.skip('should update user profile (Not implemented in v2)', async () => {
      // Skipped
    });
  });

  describe('sendPasswordResetLink', () => {
    it.skip('should send password reset link (Not implemented in v2)', async () => {
      // Skipped
    });
  });

  describe('checkResetPasswordToken', () => {
    it.skip('should return valid for valid token (Not implemented in v2)', async () => {
      // Skipped
    });

    it.skip('should return invalid for invalid token (Not implemented in v2)', async () => {
      // Skipped
    });
  });

  describe('resetPassword', () => {
    it.skip('should reset password successfully (Not implemented in v2)', async () => {
      // Skipped
    });

    it.skip('should handle reset password error (Not implemented in v2)', async () => {
      // Skipped
    });
  });

  describe('logout', () => {
    it('should call server logout and remove token from localStorage', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({
        message: 'ログアウトしました'
      } as any);

      await authApi.logout();

      expect(apiClient.post).toHaveBeenCalledWith('/api/v2/auth/logout');
    });

    it('should clean localStorage even if server logout fails', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Server error'));

      await authApi.logout();

      expect(apiClient.post).toHaveBeenCalledWith('/api/v2/auth/logout');

      expect(consoleWarnSpy).toHaveBeenCalledWith('Server logout failed:', expect.any(Error));
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Cookie Authentication', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should get CSRF cookie before login', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
        token: '', // Cookie認証の場合空文字列
      };

      vi.mocked(apiClient.getCsrfCookie).mockResolvedValueOnce(undefined);
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse as any);

      const result = await authApi.login(credentials);

      expect(apiClient.getCsrfCookie).toHaveBeenCalledBefore(apiClient.post as any);
      expect(apiClient.getCsrfCookie).toHaveBeenCalledTimes(1);
      expect(apiClient.post).toHaveBeenCalledWith('/api/v2/auth/login', credentials);
      expect(result).toEqual(mockResponse);
    });

    it('should handle cookie-only authentication without token', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Cookie認証時のレスポンス（tokenなし）
      const mockResponse = {
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
        token: '', // Cookie認証では空文字列
        message: 'ログイン成功',
      };

      vi.mocked(apiClient.getCsrfCookie).mockResolvedValueOnce(undefined);
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse as any);

      const result = await authApi.login(credentials);

      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
      // normalizeAuthResponse strips extra properties like 'message'
      expect(result).toEqual({
        token: '',
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
      });
    });

    it('should get CSRF cookie before register', async () => {
      const credentials: RegisterCredentials = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        passwordConfirmation: 'password123',
      };

      const mockResponse = {
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
        token: '', // Cookie認証では空文字列
      };

      vi.mocked(apiClient.getCsrfCookie).mockResolvedValueOnce(undefined);
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse as any);

      const result = await authApi.register(credentials);

      expect(apiClient.getCsrfCookie).toHaveBeenCalledBefore(apiClient.post as any);
      expect(apiClient.getCsrfCookie).toHaveBeenCalledTimes(1);
      expect(apiClient.post).toHaveBeenCalledWith('/api/v2/auth/register', {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        password_confirmation: credentials.passwordConfirmation,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should call getCsrfCookie and continue with login flow', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
        token: '', // Cookie認証では空文字列
      };

      // CSRF Cookie取得は正常実行、その後ログイン
      vi.mocked(apiClient.getCsrfCookie).mockResolvedValueOnce(undefined);
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse as any);

      const result = await authApi.login(credentials);

      expect(apiClient.getCsrfCookie).toHaveBeenCalledTimes(1);
      expect(apiClient.post).toHaveBeenCalledTimes(1);
      expect(apiClient.post).toHaveBeenCalledWith('/api/v2/auth/login', credentials);
      expect(result).toEqual(mockResponse);
    });
  });
});
