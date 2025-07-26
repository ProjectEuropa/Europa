import React from 'react';
import { cn } from '@/lib/utils';
import type { LoadingProps } from '@/types/ui';

/**
 * ローディングインジケーターコンポーネント
 */
export function Loading({ size = 'md', color = '#00c8ff', text }: LoadingProps) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex flex-col items-center justify-center" data-testid="loading">
      <div
        className={cn('animate-spin', sizeMap[size])}
        role="status"
        aria-label="読み込み中"
      >
        <svg
          className="size-full"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill={color}
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      {text && (
        <span className="mt-2 text-sm text-gray-300">{text}</span>
      )}
    </div>
  );
}

/**
 * ボタン内に表示するローディングインジケーター
 */
export function ButtonLoading({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin -ml-1 mr-2 h-4 w-4', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="img"
      aria-label="読み込み中"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

/**
 * ページ全体のローディングインジケーター
 */
export function PageLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <Loading size="lg" text="読み込み中..." />
    </div>
  );
}
