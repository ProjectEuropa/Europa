'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

/**
 * React Query プロバイダーコンポーネント
 * 検索機能とAPIデータ管理のためのクエリクライアントを提供
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 5分間のキャッシュ
            staleTime: 5 * 60 * 1000,
            // 10分間のガベージコレクション
            gcTime: 10 * 60 * 1000,
            // エラー時のリトライ設定
            retry: (failureCount, error: any) => {
              // 401, 403, 404エラーはリトライしない
              if (error?.status === 401 || error?.status === 403 || error?.status === 404) {
                return false;
              }
              // 最大3回まで
              return failureCount < 3;
            },
            // リトライ間隔（指数バックオフ）
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            // ミューテーション失敗時のリトライ設定
            retry: (failureCount, error: any) => {
              // 4xx エラーはリトライしない
              if (error?.status >= 400 && error?.status < 500) {
                return false;
              }
              return failureCount < 2;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
