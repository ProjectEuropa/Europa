import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/lib/api/auth';
import type { LoginCredentials, RegisterCredentials, User } from '@/types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasHydrated: boolean;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: (redirectCallback?: () => void) => void;
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
      login: async (credentials: LoginCredentials) => {
        set({ loading: true });
        try {
          const data = await authApi.login(credentials);
          const { token, user } = data;

          // Tokenベースの後方互換性のためTokenがある場合は保存
          if (typeof window !== 'undefined' && token) {
            localStorage.setItem('token', token);
          }

          set({
            user,
            token: token || null, // Cookie認証の場合tokenはnull
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ loading: true });
        try {
          const data = await authApi.register(credentials);
          const { token, user } = data;

          // Tokenベースの後方互換性のためTokenがある場合は保存
          if (typeof window !== 'undefined' && token) {
            localStorage.setItem('token', token);
          }

          set({
            user,
            token: token || null, // Cookie認証の場合tokenはnull
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      logout: (redirectCallback?: () => void) => {
        // APIのlogout関数を呼び出してlocalStorageからトークンを削除
        authApi.logout();

        // 念のため、直接localStorageからも削除
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }

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
          // Cookie認証の場合、ログアウト処理
          authApi.logout();
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
        token: state.token,
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
          if (typeof window !== 'undefined' && state.token) {
            localStorage.setItem('token', state.token);
          }
          // ハイドレーション完了をマーク
          state.hasHydrated = true;
        }
      },
    }
  )
);
