import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/types/user';

// authApiをモック
vi.mock('@/lib/api/auth', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    getProfile: vi.fn(),
    logout: vi.fn(),
  },
}));

const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  createdAt: '2024-01-01T00:00:00Z',
};

const mockToken = 'mock-jwt-token';

describe('authStore', () => {
  beforeEach(() => {
    // ストアをリセット
    useAuthStore.setState({
      user: null,
      token: null,
      loading: false,
      isAuthenticated: false,
    });
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('Login', () => {
    it('should login successfully', async () => {
      const mockResponse = { token: mockToken, user: mockUser };
      vi.mocked(authApi.login).mockResolvedValue(mockResponse);

      const { login } = useAuthStore.getState();

      await login({
        email: 'test@example.com',
        password: 'password123',
      });

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
      expect(state.isAuthenticated).toBe(true);
      expect(state.loading).toBe(false);
    });

    it('should handle login error', async () => {
      const mockError = new Error('Login failed');
      vi.mocked(authApi.login).mockRejectedValue(mockError);

      const { login } = useAuthStore.getState();

      await expect(
        login({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Login failed');

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.loading).toBe(false);
    });

    it('should set loading state during login', async () => {
      let resolveLogin: (value: unknown) => void;
      const loginPromise = new Promise(resolve => {
        resolveLogin = resolve;
      });
      vi.mocked(authApi.login).mockReturnValue(loginPromise);

      const { login } = useAuthStore.getState();

      const loginCall = login({
        email: 'test@example.com',
        password: 'password123',
      });

      // ローディング状態を確認
      expect(useAuthStore.getState().loading).toBe(true);

      // ログインを完了
      resolveLogin?.({ token: mockToken, user: mockUser });
      await loginCall;

      expect(useAuthStore.getState().loading).toBe(false);
    });
  });

  describe('Register', () => {
    it('should register successfully', async () => {
      const mockResponse = { token: mockToken, user: mockUser };
      vi.mocked(authApi.register).mockResolvedValue(mockResponse);

      const { register } = useAuthStore.getState();

      await register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        passwordConfirmation: 'password123',
      });

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
      expect(state.isAuthenticated).toBe(true);
      expect(state.loading).toBe(false);
    });

    it('should handle register error', async () => {
      const mockError = new Error('Registration failed');
      vi.mocked(authApi.register).mockRejectedValue(mockError);

      const { register } = useAuthStore.getState();

      await expect(
        register({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          passwordConfirmation: 'password123',
        })
      ).rejects.toThrow('Registration failed');

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.loading).toBe(false);
    });
  });

  describe('Logout', () => {
    it('should logout successfully', () => {
      // 初期状態を認証済みに設定
      useAuthStore.setState({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        loading: false,
      });

      const { logout } = useAuthStore.getState();
      logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.loading).toBe(false);
    });
  });

  describe('Fetch User', () => {
    it('should fetch user successfully', async () => {
      vi.mocked(authApi.getProfile).mockResolvedValue(mockUser);

      // トークンを設定
      useAuthStore.setState({ token: mockToken });

      const { fetchUser } = useAuthStore.getState();
      await fetchUser();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.loading).toBe(false);
    });

    it('should handle fetch user error', async () => {
      const mockError = new Error('Fetch failed');
      vi.mocked(authApi.getProfile).mockRejectedValue(mockError);

      // トークンを設定
      useAuthStore.setState({ token: mockToken });

      const { fetchUser } = useAuthStore.getState();
      await fetchUser();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.loading).toBe(false);
    });

    it('should not fetch user when no token', async () => {
      const { fetchUser } = useAuthStore.getState();
      await fetchUser();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.loading).toBe(false);
      expect(authApi.getProfile).not.toHaveBeenCalled();
    });
  });

  describe('Setters', () => {
    it('should set user', () => {
      const { setUser } = useAuthStore.getState();
      setUser(mockUser);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should set user to null', () => {
      // 初期状態を認証済みに設定
      useAuthStore.setState({ user: mockUser, isAuthenticated: true });

      const { setUser } = useAuthStore.getState();
      setUser(null);

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('should set token', () => {
      const { setToken } = useAuthStore.getState();
      setToken(mockToken);

      const state = useAuthStore.getState();
      expect(state.token).toBe(mockToken);
    });

    it('should set loading', () => {
      const { setLoading } = useAuthStore.getState();
      setLoading(true);

      const state = useAuthStore.getState();
      expect(state.loading).toBe(true);
    });
  });
});
