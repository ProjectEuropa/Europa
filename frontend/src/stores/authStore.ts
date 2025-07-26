import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginCredentials, RegisterCredentials } from '@/types/user';
import { authApi } from '@/lib/api/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
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

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ loading: true });
        try {
          const response = await authApi.login(credentials);
          const { token, user } = response;

          set({
            user,
            token,
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
          const response = await authApi.register(credentials);
          const { token, user } = response;

          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      logout: () => {
        authApi.logout();

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
        });
      },

      fetchUser: async () => {
        const { token } = get();
        if (!token) {
          set({ user: null, isAuthenticated: false, loading: false });
          return;
        }

        set({ loading: true });
        try {
          const user = await authApi.getProfile();

          set({
            user,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          console.error('ユーザー情報取得エラー:', error);
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
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
