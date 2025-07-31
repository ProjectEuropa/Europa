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
  logout: () => void;
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

          // localStorageにもトークンを保存（api.tsとの互換性のため）
          if (typeof window !== 'undefined' && token) {
            localStorage.setItem('token', token);
          }

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
          const data = await authApi.register(credentials);
          const { token, user } = data;

          // localStorageにもトークンを保存（api.tsとの互換性のため）
          if (typeof window !== 'undefined' && token) {
            localStorage.setItem('token', token);
          }

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
          const data = await authApi.getProfile();

          set({
            user: data,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          console.error('User profile fetch error:', error);
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
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.token && state.user && !state.isAuthenticated) {
            state.isAuthenticated = true;
          }
          state.hasHydrated = true;
        }
      },
    }
  )
);
