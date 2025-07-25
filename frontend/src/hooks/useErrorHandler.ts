import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ApiErrorClass } from '@/types/api';
import { useToast } from '@/hooks/useToast';

/**
 * グローバルエラーハンドリングフック
 *
 * アプリケーション全体で一貫したエラーハンドリングを提供する
 */
export const useErrorHandler = () => {
  const router = useRouter();
  const { toast } = useToast();

  const handleError = useCallback((error: unknown) => {
    if (error instanceof ApiErrorClass) {
      // APIエラーの処理
      if (error.isAuthError()) {
        // 認証エラー (401)
        toast({
          type: 'error',
          title: '認証エラー',
          message: 'ログインが必要です',
        });
        router.push('/login');
      } else if (error.isPermissionError()) {
        // 権限エラー (403)
        toast({
          type: 'error',
          title: 'アクセス拒否',
          message: 'このリソースにアクセスする権限がありません',
        });
      } else if (error.isNotFoundError()) {
        // リソースが見つからない (404)
        toast({
          type: 'error',
          title: 'リソースが見つかりません',
          message: '要求されたリソースは存在しません',
        });
      } else if (error.isValidationError()) {
        // バリデーションエラー (422)
        toast({
          type: 'error',
          title: '入力エラー',
          message: '入力内容を確認してください',
        });
      } else if (error.isServerError()) {
        // サーバーエラー (500+)
        toast({
          type: 'error',
          title: 'サーバーエラー',
          message: 'サーバーで問題が発生しました。しばらく経ってからもう一度お試しください',
        });
      } else {
        // その他のAPIエラー
        toast({
          type: 'error',
          title: 'エラー',
          message: error.message,
        });
      }
    } else if (error instanceof Error) {
      // 一般的なJavaScriptエラー
      console.error('Unexpected error:', error);
      toast({
        type: 'error',
        title: 'エラー',
        message: '予期しないエラーが発生しました',
      });
    } else {
      // 未知のエラー
      console.error('Unknown error:', error);
      toast({
        type: 'error',
        title: 'エラー',
        message: '予期しないエラーが発生しました',
      });
    }
  }, [router, toast]);

  return { handleError };
};
