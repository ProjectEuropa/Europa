import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/lib/api/auth';
import type {
  LoginCredentials,
  LoginResponse,
  LoginResult,
  RegisterCredentials,
  RegisterResponse,
  RegisterResult,
  User,
  VerifyOtpCredentials,
} from '@/types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasHydrated: boolean;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  verifyOtp?: (credentials: VerifyOtpCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<RegisterResult>;
  logout: (redirectCallback?: () => void) => Promise<void>;
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      loading: false,
      isAuthenticated: false,
      hasHydrated: false,

      // Actions
      login: async (credentials: LoginCredentials): Promise<LoginResult> => {
        set({ loading: true });
        try {
          const result = await authApi.login(credentials);

          // 2FAが必要な場合はまだログイン完了状態にしない
          if ('requires2FA' in result && result.requires2FA) {
            set({ loading: false });
            return result;
          }

          const loginResponse = result as LoginResponse;
          const { token, user } = loginResponse;

          set({
            user,
            token: token || null,
            isAuthenticated: true,
            loading: false,
          });

          return result;
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      verifyOtp: async (credentials: VerifyOtpCredentials): Promise<void> => {
        set({ loading: true });
        try {
          const data = await authApi.verifyOtp(credentials);
          const { token, user } = data;

          set({
            user,
            token: token || null,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      register: async (credentials: RegisterCredentials): Promise<RegisterResult> => {
        set({ loading: true });
        try {
          const result = await authApi.register(credentials);

          // 2FAが必要な場合はまだログイン完了状態にしない
          if ('requires2FA' in result && result.requires2FA) {
            set({ loading: false });
            return result;
          }

          const registerResponse = result as RegisterResponse;
          const { token, user } = registerResponse;

          set({
            user,
            token: token || null,
            isAuthenticated: true,
            loading: false,
          });

          return result;
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      logout: async (redirectCallback?: () => void) => {
        try {
          // APIのlogout関数を呼び出してサーバー側でセッション/トークンを無効化
          await authApi.logout();
        } catch (error) {
          console.warn('Server logout failed:', error);
        } finally {
          // 常にクライアント側のステートをクリア
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
          });

          // リダイレクトコールバックが提供されていれば実行、そうでなければfallback
          if (redirectCallback) {
            redirectCallback();
          } else if (typeof window !== 'undefined') {
            // fallback: 直接リダイレクト
            window.location.href = '/';
          }
        }
      },

      fetchUser: async () => {
        set({ loading: true });
        try {
          const data = await authApi.getProfile();

          set({
            user: data,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          console.error('User profile fetch error:', error);
          // プロファイル取得失敗時はサーバー側ログアウトを呼び出し
          try {
            await authApi.logout();
          } catch (logoutError) {
            console.warn(
              'Logout after profile fetch failure failed:',
              logoutError
            );
          }
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      setToken: (token: string | null) => {
        set({ token });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      setHasHydrated: (hasHydrated: boolean) => {
        set({ hasHydrated });
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        // token: state.token, // Tokenは永続化しない
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => state => {
        if (state) {
          // トークンとユーザー情報がある場合は認証済みに設定
          if (state.token && state.user && !state.isAuthenticated) {
            state.isAuthenticated = true;
          }
          // localStorageにもトークンを同期（api.tsとの互換性のため）
          // if (typeof window !== 'undefined' && state.token) {
          //   localStorage.setItem('token', state.token);
          // }
          // ハイドレーション完了をマーク
          state.hasHydrated = true;
        }
      },
    }
  )
);
