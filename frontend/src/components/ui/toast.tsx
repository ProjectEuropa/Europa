'use client';

import { Toaster as SonnerToaster } from 'sonner';
import type { ToastType } from '@/types/ui';

/**
 * トースト通知コンポーネント
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#0a1022',
          color: '#ffffff',
          border: '1px solid #07324a',
        },
        classNames: {
          success: 'bg-green-900 border-green-700',
          error: 'bg-red-900 border-red-700',
          warning: 'bg-yellow-900 border-yellow-700',
          info: 'bg-blue-900 border-blue-700',
        },
      }}
    />
  );
}

/**
 * トースト通知を表示するためのユーティリティ関数
 */
export const toast = {
  success: (message: string, options?: any) => {
    import('sonner').then(({ toast }) => {
      toast.success(message, options);
    });
  },
  error: (message: string, options?: any) => {
    import('sonner').then(({ toast }) => {
      toast.error(message, options);
    });
  },
  warning: (message: string, options?: any) => {
    import('sonner').then(({ toast }) => {
      toast.warning(message, options);
    });
  },
  info: (message: string, options?: any) => {
    import('sonner').then(({ toast }) => {
      toast.info(message, options);
    });
  },
  custom: (data: ToastType) => {
    import('sonner').then(({ toast }) => {
      toast.custom(_t => (
        <div
          className={`${
            data.type === 'success'
              ? 'bg-green-900 border-green-700'
              : data.type === 'error'
                ? 'bg-red-900 border-red-700'
                : data.type === 'warning'
                  ? 'bg-yellow-900 border-yellow-700'
                  : 'bg-blue-900 border-blue-700'
          } p-4 rounded-md border shadow-lg`}
        >
          <div className="flex items-center gap-2">
            {data.type === 'success' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {data.type === 'error' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {data.type === 'warning' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {data.type === 'info' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <div className="ml-1">
              <h3 className="font-medium">{data.title}</h3>
              {data.message && <p className="text-sm mt-1">{data.message}</p>}
            </div>
          </div>
        </div>
      ));
    });
  },
};
