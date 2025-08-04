/**
 * イベント登録用のカスタムフック
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '@/lib/api/events';
import type { EventFormData } from '@/schemas/event';
import { useErrorHandler } from './useErrorHandler';

interface UseEventRegistrationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useEventRegistration = (options?: UseEventRegistrationOptions) => {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();

  return useMutation({
    mutationFn: (data: EventFormData) => eventsApi.registerEvent(data),
    onSuccess: (data) => {
      // イベント一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['my-events'] });
      
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      // カスタムエラーハンドラーがある場合はそれを優先
      if (options?.onError) {
        options.onError(error);
      } else {
        // デフォルトのエラーハンドリング
        handleError(error);
      }
    },
    // リトライ設定
    retry: (failureCount, error) => {
      // 認証エラーやクライアントエラーはリトライしない
      const apiError = error as any;
      if (apiError?.status && apiError.status >= 400 && apiError.status < 500) {
        return false;
      }
      // サーバーエラーは最大2回リトライ
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};