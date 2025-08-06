/**
 * グローバルエラーハンドリング用のカスタムフック
 */

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';

interface ApiError extends Error {
  status?: number;
  code?: string;
}

export const useErrorHandler = () => {
  const router = useRouter();

  const handleError = useCallback(
    (error: unknown) => {
      console.error('Error caught:', error);

      if (error instanceof Error) {
        const apiError = error as ApiError;

        // 認証エラー
        if (apiError.status === 401) {
          toast.error('ログインが必要です');
          router.push('/login');
          return;
        }

        // 権限エラー
        if (apiError.status === 403) {
          toast.error('アクセス権限がありません');
          return;
        }

        // バリデーションエラー
        if (apiError.status === 422) {
          toast.error('入力内容に不備があります');
          return;
        }

        // サーバーエラー
        if (apiError.status && apiError.status >= 500) {
          toast.error(
            'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。'
          );
          return;
        }

        // その他のAPIエラー
        if (apiError.status && apiError.status >= 400) {
          toast.error(apiError.message || 'エラーが発生しました');
          return;
        }

        // ネットワークエラー
        if (apiError.message.includes('fetch')) {
          toast.error(
            'ネットワークエラーが発生しました。接続を確認してください。'
          );
          return;
        }

        // その他のエラー
        toast.error(apiError.message || '予期しないエラーが発生しました');
      } else {
        // 不明なエラー
        toast.error('予期しないエラーが発生しました');
      }
    },
    [router]
  );

  return { handleError };
};
