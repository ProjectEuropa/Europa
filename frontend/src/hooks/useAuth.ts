import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

/**
 * 認証状態を管理するフック
 * Zustandストアを使用して状態管理を行う
 */
export function useAuth() {
  const {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
    setUser,
  } = useAuthStore();

  // 初回マウント時にユーザー情報を取得
  useEffect(() => {
    if (token && !user) {
      fetchUser();
    }
  }, [token, user, fetchUser]);

  return {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
    setUser,
  };
}
