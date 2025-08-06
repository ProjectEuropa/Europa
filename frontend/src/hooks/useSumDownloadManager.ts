import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import {
  useSumDownload,
  useSumDownloadMatchSearch,
  useSumDownloadTeamSearch,
} from '@/hooks/api/useSumDownload';

interface UseSumDownloadManagerProps {
  searchType: 'team' | 'match';
  initialQuery?: string;
}

export const useSumDownloadManager = ({
  searchType,
  initialQuery = '',
}: UseSumDownloadManagerProps) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // 検索用のパラメータ
  const searchParams = {
    keyword: searchQuery,
    page: currentPage,
  };

  // 適切な検索フックを選択
  const teamSearchResult = useSumDownloadTeamSearch(searchParams);
  const matchSearchResult = useSumDownloadMatchSearch(searchParams);

  const searchResult =
    searchType === 'team' ? teamSearchResult : matchSearchResult;
  const downloadMutation = useSumDownload();

  // 検索実行
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setSelectedIds([]);
  }, []);

  // ページ変更
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setSelectedIds([]); // ページ変更時に選択をクリア
  }, []);

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

    // その他の状態
    searchQuery,
  };
};
