'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loading } from '@/components/ui/loading';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

/**
 * 認証ガードコンポーネント
 * 認証が必要なページで使用し、未認証の場合はリダイレクトする
 */
export function AuthGuard({
  children,
  redirectTo = '/login',
  requireAuth = true
}: AuthGuardProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        // 認証が必要だが未認証の場合
        router.replace(redirectTo);
      } else if (!requireAuth && isAuthenticated) {
        // 認証不要だが認証済みの場合（ログインページなど）
        router.replace('/mypage');
      }
    }
  }, [user, loading, isAuthenticated, requireAuth, redirectTo, router]);

  // ローディング中は Loading コンポーネントを表示
  if (loading) {
    return <Loading />;
  }

  // 認証が必要だが未認証の場合は何も表示しない（リダイレクト中）
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // 認証不要だが認証済みの場合は何も表示しない（リダイレクト中）
  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
