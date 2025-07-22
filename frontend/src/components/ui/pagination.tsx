'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { PaginationProps } from '@/types/ui';

/**
 * ページネーションコンポーネント
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
}: PaginationProps) {
  // 表示するページ番号の範囲を計算
  const getPageNumbers = () => {
    const delta = 2; // 現在のページの前後に表示するページ数
    const range = [];
    const rangeWithDots = [];
    let l;

    // 総ページ数が7以下の場合はすべてのページを表示
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      // 現在のページの前後にdelta個のページを表示
      for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
        range.push(i);
      }

      // 省略記号を追加
      for (let i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push('...');
          }
        }
        rangeWithDots.push(i);
        l = i;
      }

      // 最初と最後のページを追加
      if (range[0] !== 1) {
        rangeWithDots.unshift('...');
        rangeWithDots.unshift(1);
      }
      if (range[range.length - 1] !== totalPages) {
        rangeWithDots.push('...');
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    }

    return range;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex justify-center items-center space-x-1 mt-4" aria-label="ページネーション">
      {/* 最初のページへのリンク */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={cn(
            'px-3 py-1 rounded-md',
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-blue-400 hover:bg-blue-900/20'
          )}
          aria-label="最初のページへ"
        >
          <span aria-hidden="true">«</span>
        </button>
      )}

      {/* 前のページへのリンク */}
      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'px-3 py-1 rounded-md',
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-blue-400 hover:bg-blue-900/20'
          )}
          aria-label="前のページへ"
        >
          <span aria-hidden="true">‹</span>
        </button>
      )}

      {/* ページ番号 */}
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-1 text-gray-400"
            >
              ...
            </span>
          );
        }
        return (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(Number(page))}
            className={cn(
              'px-3 py-1 rounded-md',
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'text-blue-400 hover:bg-blue-900/20'
            )}
            aria-label={`${page}ページへ`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* 次のページへのリンク */}
      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'px-3 py-1 rounded-md',
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-blue-400 hover:bg-blue-900/20'
          )}
          aria-label="次のページへ"
        >
          <span aria-hidden="true">›</span>
        </button>
      )}

      {/* 最後のページへのリンク */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={cn(
            'px-3 py-1 rounded-md',
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-blue-400 hover:bg-blue-900/20'
          )}
          aria-label="最後のページへ"
        >
          <span aria-hidden="true">»</span>
        </button>
      )}
    </nav>
  );
}
