import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast as sonnerToast } from '@/components/ui/toast';
import type { ToastType } from '@/types/ui';

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
      const id = uuidv4();
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
