import React from 'react';
import { cn } from '@/lib/utils';
import type { SkeletonProps } from '@/types/ui';

/**
 * スケルトンローディングコンポーネント
 */
export function Skeleton({ width, height, className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded bg-gray-700/30',
        className
      )}
      style={{
        width: width || '100%',
        height: height || '1rem',
      }}
    />
  );
}

/**
 * テキストスケルトンコンポーネント
 */
export function TextSkeleton({ lines = 1, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 && lines > 1 ? 'w-4/5' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

/**
 * カードスケルトンコンポーネント
 */
export function CardSkeleton() {
  return (
    <div className="border border-gray-700 rounded-xl p-6 space-y-4">
      <Skeleton className="h-6 w-1/3" />
      <TextSkeleton lines={3} />
      <div className="flex justify-between items-center pt-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

/**
 * テーブル行スケルトンコンポーネント
 */
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center space-x-4 py-3">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === 0 ? 'w-1/6' : i === columns - 1 ? 'w-1/12' : 'w-1/4'
          )}
        />
      ))}
    </div>
  );
}
