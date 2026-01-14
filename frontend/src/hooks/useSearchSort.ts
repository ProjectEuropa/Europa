'use client';

import { useCallback, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DEFAULT_SORT_ORDER, type SortOrder } from '@/types/search';

/**
 * URLパラメータからソート順を安全にパースする
 * 無効な値の場合はデフォルト値を返し、警告をログ出力
 */
const parseSortOrder = (value: string | null): SortOrder => {
  if (value === 'asc' || value === 'desc') {
    return value;
  }
  if (value !== null) {
    console.warn(`Invalid sort order in URL: "${value}". Using default: "${DEFAULT_SORT_ORDER}"`);
  }
  return DEFAULT_SORT_ORDER;
};

/**
 * 検索画面で使用するソート順とページネーションを管理するカスタムフック
 *
 * URLパラメータとの同期、ソート順変更時のページリセット、
 * エッジケース処理を提供する
 */
export const useSearchSort = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // レースコンディション対策: URL更新中フラグ
  const isUpdatingRef = useRef(false);

  // URLパラメータから初期値を取得
  const initialPage = (() => {
    const pageParam = searchParams.get('page');
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    return page > 0 ? page : 1;
  })();

  const initialSortOrder = parseSortOrder(searchParams.get('sort'));

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);

  /**
   * ソート順変更処理
   * ページを1にリセットし、URLを更新
   */
  const handleSortChange = useCallback(
    (order: SortOrder) => {
      if (isUpdatingRef.current) return;
      isUpdatingRef.current = true;

      setSortOrder(order);
      setCurrentPage(1);

      const urlParams = new URLSearchParams(searchParams.toString());
      urlParams.set('sort', order);
      urlParams.set('page', '1');
      router.push(`?${urlParams.toString()}`);

      // 次のティックで更新フラグをリセット
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    },
    [searchParams, router]
  );

  /**
   * ページ変更処理
   */
  const handlePageChange = useCallback(
    (page: number) => {
      if (isUpdatingRef.current) return;
      isUpdatingRef.current = true;

      setCurrentPage(page);

      const urlParams = new URLSearchParams(searchParams.toString());
      urlParams.set('page', page.toString());
      router.push(`?${urlParams.toString()}`);

      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    },
    [searchParams, router]
  );

  /**
   * ページを1にリセット（検索実行時などに使用）
   */
  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    sortOrder,
    handleSortChange,
    handlePageChange,
    resetPage,
    setCurrentPage,
    setSortOrder,
  };
};
