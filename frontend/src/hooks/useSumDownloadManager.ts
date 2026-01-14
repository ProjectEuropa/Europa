import { useCallback, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  useSumDownload,
  useSumDownloadMatchSearch,
  useSumDownloadTeamSearch,
} from '@/hooks/api/useSumDownload';
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

  // レースコンディション対策: URL更新中フラグ
  const isUpdatingRef = useRef(false);

  // URLパラメータから初期値を取得（useEffectではなく初期化時に読み取り）
  const initialPage = (() => {
    const pageParam = urlSearchParams.get('page');
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    return page > 0 ? page : 1;
  })();

  const initialSortOrder = parseSortOrder(urlSearchParams.get('sort'));
  const initialKeyword = urlSearchParams.get('keyword') || initialQuery;

  const [searchQuery, setSearchQuery] = useState(initialKeyword);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);

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
    if (isUpdatingRef.current) return;
    isUpdatingRef.current = true;

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

    // 次のティックで更新フラグをリセット
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 0);
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
    setCurrentPage(1); // ソート変更時はページを1にリセット
    setSelectedIds([]); // ソート変更時に選択をクリア
    updateURL({ sort: order, page: 1 });
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
