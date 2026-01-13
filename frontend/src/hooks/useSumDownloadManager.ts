import { useCallback, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  useSumDownload,
  useSumDownloadMatchSearch,
  useSumDownloadTeamSearch,
} from '@/hooks/api/useSumDownload';
import type { SortOrder } from '@/types/search';

interface UseSumDownloadManagerProps {
  searchType: 'team' | 'match';
  initialQuery?: string;
}

export const useSumDownloadManager = ({
  searchType,
  initialQuery = '',
}: UseSumDownloadManagerProps) => {
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // URLパラメータから初期化
  useEffect(() => {
    const pageParam = urlSearchParams.get('page');
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    if (page > 0) {
      setCurrentPage(page);
    }

    const sortParam = urlSearchParams.get('sort');
    if (sortParam === 'asc' || sortParam === 'desc') {
      setSortOrder(sortParam);
    }

    const keywordParam = urlSearchParams.get('keyword');
    if (keywordParam) {
      setSearchQuery(keywordParam);
    }
  }, [urlSearchParams]);

  // 検索用のパラメータ
  const searchParams = {
    keyword: searchQuery,
    page: currentPage,
    sortOrder,
  };

  // 適切な検索フックを選択
  const teamSearchResult = useSumDownloadTeamSearch(searchParams);
  const matchSearchResult = useSumDownloadMatchSearch(searchParams);

  const searchResult =
    searchType === 'team' ? teamSearchResult : matchSearchResult;
  const downloadMutation = useSumDownload();

  // URLを更新するヘルパー関数
  const updateURL = useCallback((updates: { keyword?: string; page?: number; sort?: SortOrder }) => {
    const params = new URLSearchParams(urlSearchParams.toString());

    if (updates.keyword !== undefined) {
      if (updates.keyword) {
        params.set('keyword', updates.keyword);
      } else {
        params.delete('keyword');
      }
    }
    if (updates.page !== undefined) {
      params.set('page', updates.page.toString());
    }
    if (updates.sort !== undefined) {
      params.set('sort', updates.sort);
    }

    router.push(`?${params.toString()}`);
  }, [urlSearchParams, router]);

  // 検索実行
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setSelectedIds([]);
    updateURL({ keyword: query, page: 1 });
  }, [updateURL]);

  // ページ変更
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setSelectedIds([]); // ページ変更時に選択をクリア
    updateURL({ page });
  }, [updateURL]);

  // ソート順変更
  const handleSortChange = useCallback((order: SortOrder) => {
    setSortOrder(order);
    setSelectedIds([]); // ソート変更時に選択をクリア
    updateURL({ sort: order });
  }, [updateURL]);

  // 選択状態の管理
  const handleSelectionChange = useCallback((ids: number[]) => {
    setSelectedIds(ids);
  }, []);

  // ダウンロード実行
  const handleDownload = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.error('ダウンロードするアイテムを選択してください');
      return;
    }

    if (selectedIds.length > 50) {
      toast.error('一度に選択できるアイテムは50個までです');
      return;
    }

    downloadMutation.mutate(selectedIds, {
      onSuccess: () => {
        setSelectedIds([]);
      },
    });
  }, [selectedIds, downloadMutation]);

  // 統合された結果を返す
  return {
    // データ
    data: searchResult.data?.data || [],
    currentPage: searchResult.data?.current_page || 1,
    lastPage: searchResult.data?.last_page || 1,
    total: searchResult.data?.total || 0,

    // 選択状態
    selectedIds,
    selectedCount: selectedIds.length,

    // ローディング状態
    isSearchLoading: searchResult.isLoading,
    isDownloading: downloadMutation.isPending,

    // エラー状態
    searchError: searchResult.error,
    downloadError: downloadMutation.error,

    // ハンドラー
    handleSearch,
    handlePageChange,
    handleSelectionChange,
    handleDownload,
    handleSortChange,

    // その他の状態
    searchQuery,
    sortOrder,
  };
};
