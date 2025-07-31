import { useCallback } from 'react';
import { toast as sonnerToast } from '@/components/ui/toast';
import type { ToastType } from '@/types/ui';

// シンプルなID生成関数
const generateId = () => Math.random().toString(36).substring(2, 15);

/**
 * トースト通知を表示するためのフック
 * 既存のsonnerベースのtoastユーティリティを使用
 */
export const useToast = () => {
  // トースト通知を表示する
  const toast = useCallback(
    ({
      type = 'info',
      title,
      message,
      duration = 5000,
    }: Omit<ToastType, 'id'>) => {
      const id = generateId();
      const toastData: ToastType = {
        id,
        type,
        title,
        message,
        duration,
      };

      // 既存のtoastユーティリティを使用
      if (message) {
        switch (type) {
          case 'success':
            sonnerToast.success(title, { description: message, duration });
            break;
          case 'error':
            sonnerToast.error(title, { description: message, duration });
            break;
          case 'warning':
            sonnerToast.warning(title, { description: message, duration });
            break;
          case 'info':
            sonnerToast.info(title, { description: message, duration });
            break;
          default:
            sonnerToast.custom(toastData);
        }
      } else {
        switch (type) {
          case 'success':
            sonnerToast.success(title, { duration });
            break;
          case 'error':
            sonnerToast.error(title, { duration });
            break;
          case 'warning':
            sonnerToast.warning(title, { duration });
            break;
          case 'info':
            sonnerToast.info(title, { duration });
            break;
          default:
            sonnerToast.custom(toastData);
        }
      }

      return id;
    },
    []
  );

  return { toast };
};
