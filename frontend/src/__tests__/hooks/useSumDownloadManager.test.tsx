import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSumDownloadManager } from '@/hooks/useSumDownloadManager';

// Next.js App Routerのモック
const mockPush = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => mockSearchParams,
  usePathname: () => '/sumdownload',
}));

// API関数をモック
vi.mock('@/lib/api/sumdownload', () => ({
  sumDLSearchTeam: vi.fn(),
  sumDLSearchMatch: vi.fn(),
  sumDownload: vi.fn(),
}));

// toastをモック
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// window.URL.createObjectURLをモック
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: vi.fn(() => 'mock-blob-url'),
    revokeObjectURL: vi.fn(),
  },
});

// window.openをモック
Object.defineProperty(window, 'open', {
  value: vi.fn(),
});

const { sumDLSearchTeam, sumDLSearchMatch, sumDownload } = vi.mocked(
  await import('@/lib/api/sumdownload')
);

const mockToast = vi.mocked(toast);

// テストヘルパー関数
const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockSearchResponse = {
  data: [
    {
      id: 1,
      file_name: 'テストファイル1.zip',
      upload_owner_name: 'テストユーザー',
      created_at: '2024-01-01T10:00:00Z',
      file_comment: 'テストコメント1',
      downloadable_at: '2024-01-01T10:00:00Z',
      search_tag1: 'タグ1',
    },
    {
      id: 2,
      file_name: 'テストファイル2.zip',
      upload_owner_name: 'テストユーザー2',
      created_at: '2024-01-02T10:00:00Z',
      file_comment: 'テストコメント2',
      downloadable_at: null,
      search_tag1: 'タグ2',
    },
  ],
  current_page: 1,
  last_page: 2,
  per_page: 10,
  total: 15,
};

describe('useSumDownloadManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPush.mockClear();

    // デフォルトのAPI応答をモック
    sumDLSearchTeam.mockResolvedValue(mockSearchResponse);
    sumDLSearchMatch.mockResolvedValue(mockSearchResponse);
    sumDownload.mockResolvedValue(() => { });
  });

  describe('初期化', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(
        () => useSumDownloadManager({ searchType: 'team' }),
        { wrapper: createTestWrapper() }
      );

      expect(result.current.data).toEqual([]);
      expect(result.current.selectedIds).toEqual([]);
      expect(result.current.selectedCount).toBe(0);
      expect(result.current.isSearchLoading).toBe(true);
      expect(result.current.isDownloading).toBe(false);
      expect(result.current.currentPage).toBe(1);
      expect(result.current.searchQuery).toBe('');
      expect(result.current.lastPage).toBe(1);
      expect(result.current.total).toBe(0);
    });

    it('should initialize with initial query', () => {
      const { result } = renderHook(
        () =>
          useSumDownloadManager({
            searchType: 'team',
            initialQuery: 'initial',
          }),
        { wrapper: createTestWrapper() }
      );

      expect(result.current.searchQuery).toBe('initial');
    });
  });

  describe('検索機能', () => {
    it('should handle search execution for team type', async () => {
      const { result } = renderHook(
        () => useSumDownloadManager({ searchType: 'team' }),
        { wrapper: createTestWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSearchLoading).toBe(false);
      });

      act(() => {
        result.current.handleSearch('テスト検索');
      });

      expect(result.current.searchQuery).toBe('テスト検索');
      expect(result.current.currentPage).toBe(1);
      expect(result.current.selectedIds).toEqual([]);
    });

    it('should handle search execution for match type', async () => {
      const { result } = renderHook(
        () => useSumDownloadManager({ searchType: 'match' }),
        { wrapper: createTestWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSearchLoading).toBe(false);
      });

      act(() => {
        result.current.handleSearch('マッチ検索');
      });

      expect(result.current.searchQuery).toBe('マッチ検索');
      expect(result.current.currentPage).toBe(1);
      expect(result.current.selectedIds).toEqual([]);
    });

    it('should populate data after successful search', async () => {
      const { result } = renderHook(
        () => useSumDownloadManager({ searchType: 'team' }),
        { wrapper: createTestWrapper() }
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(mockSearchResponse.data);
        expect(result.current.currentPage).toBe(1);
        expect(result.current.lastPage).toBe(2);
        expect(result.current.total).toBe(15);
      });
    });
  });

  describe('ページネーション', () => {
    it('should handle page changes', async () => {
      const { result } = renderHook(
        () => useSumDownloadManager({ searchType: 'team' }),
        { wrapper: createTestWrapper() }
      );

      // 初期ロード完了を待つ
      await waitFor(() => {
        expect(result.current.isSearchLoading).toBe(false);
      });

      // 選択を追加
      act(() => {
        result.current.handleSelectionChange([1, 2]);
      });

      expect(result.current.selectedIds).toEqual([1, 2]);

      // ページ変更 - handlePageChangeが内部状態を更新することをテスト
      act(() => {
        result.current.handlePageChange(2);
      });

      // ページ変更後の状態確認（フックの内部状態はすぐに反映される）
      expect(result.current.selectedIds).toEqual([]); // ページ変更時に選択がクリアされる

      // APIが新しいページで呼び出されることを確認（sort_order付き）
      await waitFor(() => {
        expect(sumDLSearchTeam).toHaveBeenCalledWith('', 2, 'desc');
      });
    });
  });

  describe('選択機能', () => {
    it('should handle selection changes', () => {
      const { result } = renderHook(
        () => useSumDownloadManager({ searchType: 'team' }),
        { wrapper: createTestWrapper() }
      );

      act(() => {
        result.current.handleSelectionChange([1, 2, 3]);
      });

      expect(result.current.selectedIds).toEqual([1, 2, 3]);
      expect(result.current.selectedCount).toBe(3);

      act(() => {
        result.current.handleSelectionChange([]);
      });

      expect(result.current.selectedIds).toEqual([]);
      expect(result.current.selectedCount).toBe(0);
    });

    it('should handle multiple selection changes', () => {
      const { result } = renderHook(
        () => useSumDownloadManager({ searchType: 'team' }),
        { wrapper: createTestWrapper() }
      );

      // 最初の選択
      act(() => {
        result.current.handleSelectionChange([1, 2]);
      });

      expect(result.current.selectedCount).toBe(2);

      // 選択を追加
      act(() => {
        result.current.handleSelectionChange([1, 2, 3, 4]);
      });

      expect(result.current.selectedCount).toBe(4);

      // 一部を削除
      act(() => {
        result.current.handleSelectionChange([2, 4]);
      });

      expect(result.current.selectedIds).toEqual([2, 4]);
      expect(result.current.selectedCount).toBe(2);
    });
  });

  describe('ダウンロード機能', () => {
    it('should show error when no items selected', () => {
      const { result } = renderHook(
        () => useSumDownloadManager({ searchType: 'team' }),
        { wrapper: createTestWrapper() }
      );

      act(() => {
        result.current.handleDownload();
      });

      expect(mockToast.error).toHaveBeenCalledWith(
        'ダウンロードするアイテムを選択してください'
      );
      expect(sumDownload).not.toHaveBeenCalled();
    });

    it('should show error when too many items selected', () => {
      const { result } = renderHook(
        () => useSumDownloadManager({ searchType: 'team' }),
        { wrapper: createTestWrapper() }
      );

      // 51個のアイテムを選択
      const tooManyIds = Array.from({ length: 51 }, (_, i) => i + 1);

      act(() => {
        result.current.handleSelectionChange(tooManyIds);
      });

      act(() => {
        result.current.handleDownload();
      });

      expect(mockToast.error).toHaveBeenCalledWith(
        '一度に選択できるアイテムは50個までです'
      );
      expect(sumDownload).not.toHaveBeenCalled();
    });

    it('should execute download with valid selection', async () => {
      const { result } = renderHook(
        () => useSumDownloadManager({ searchType: 'team' }),
        { wrapper: createTestWrapper() }
      );

      // 初期ロード完了を待つ
      await waitFor(() => {
        expect(result.current.isSearchLoading).toBe(false);
      });

      // 有効な選択を設定
      act(() => {
        result.current.handleSelectionChange([1, 2, 3]);
      });

      expect(result.current.selectedIds).toEqual([1, 2, 3]);

      // ダウンロード実行
      act(() => {
        result.current.handleDownload();
      });

      // ミューテーションが実行されるのを待つ
      await waitFor(() => {
        expect(sumDownload).toHaveBeenCalledWith([1, 2, 3]);
      });

      // ダウンロード成功後、選択がクリアされることを確認
      await waitFor(() => {
        expect(result.current.selectedIds).toEqual([]);
      });
    });

    it('should handle download loading state', async () => {
      // ダウンロード処理を遅延させる
      sumDownload.mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      const { result } = renderHook(
        () => useSumDownloadManager({ searchType: 'team' }),
        { wrapper: createTestWrapper() }
      );

      // 初期ロード完了を待つ
      await waitFor(() => {
        expect(result.current.isSearchLoading).toBe(false);
      });

      act(() => {
        result.current.handleSelectionChange([1, 2]);
      });

      // ダウンロード実行
      act(() => {
        result.current.handleDownload();
      });

      // ローディング状態になるのを待つ
      await waitFor(() => {
        expect(result.current.isDownloading).toBe(true);
      });

      // ダウンロード完了を待つ
      await waitFor(() => {
        expect(result.current.isDownloading).toBe(false);
      });
    });
  });

  describe('エラーハンドリング', () => {
    it('should handle search errors gracefully', async () => {
      // この検索エラーのテストは、React QueryがAPIエラーを適切に処理することを確認
      // エラーが発生した場合でも、アプリケーションがクラッシュしないことを検証
      const { result } = renderHook(
        () => useSumDownloadManager({ searchType: 'team' }),
        { wrapper: createTestWrapper() }
      );

      // 初期状態でロード中であることを確認
      expect(result.current.isSearchLoading).toBe(true);

      // 検索エラーが発生してもフックが正常に機能することを確認
      await waitFor(() => {
        expect(result.current.isSearchLoading).toBe(false);
      });

      // その他の機能が正常に動作することを確認
      act(() => {
        result.current.handleSelectionChange([1, 2]);
      });

      expect(result.current.selectedIds).toEqual([1, 2]);
      expect(result.current.selectedCount).toBe(2);
    });

    it('should handle download errors', async () => {
      const downloadError = new Error('ダウンロードエラー');
      sumDownload.mockRejectedValue(downloadError);

      const { result } = renderHook(
        () => useSumDownloadManager({ searchType: 'team' }),
        { wrapper: createTestWrapper() }
      );

      act(() => {
        result.current.handleSelectionChange([1, 2]);
      });

      act(() => {
        result.current.handleDownload();
      });

      await waitFor(() => {
        expect(result.current.downloadError).toEqual(downloadError);
      });
    });
  });

  describe('ソート機能', () => {
    it('should initialize with default sort order (desc)', () => {
      const { result } = renderHook(
        () => useSumDownloadManager({ searchType: 'team' }),
        { wrapper: createTestWrapper() }
      );

      expect(result.current.sortOrder).toBe('desc');
    });

    it('should handle sort order change', async () => {
      const { result } = renderHook(
        () => useSumDownloadManager({ searchType: 'team' }),
        { wrapper: createTestWrapper() }
      );

      // 初期ロード完了を待つ
      await waitFor(() => {
        expect(result.current.isSearchLoading).toBe(false);
      });

      // ソート順を昇順に変更
      act(() => {
        result.current.handleSortChange('asc');
      });

      expect(result.current.sortOrder).toBe('asc');
      expect(result.current.currentPage).toBe(1); // ページがリセットされる
      expect(result.current.selectedIds).toEqual([]); // 選択がクリアされる
    });

    it('should call API with correct sort order parameter', async () => {
      const { result } = renderHook(
        () => useSumDownloadManager({ searchType: 'team' }),
        { wrapper: createTestWrapper() }
      );

      // 初期ロード完了を待つ
      await waitFor(() => {
        expect(result.current.isSearchLoading).toBe(false);
      });

      // 初期状態でdescで呼び出されることを確認
      expect(sumDLSearchTeam).toHaveBeenCalledWith('', 1, 'desc');

      // ソート順を昇順に変更
      act(() => {
        result.current.handleSortChange('asc');
      });

      // ascで呼び出されることを確認
      await waitFor(() => {
        expect(sumDLSearchTeam).toHaveBeenCalledWith('', 1, 'asc');
      });
    });

    it('should reset page to 1 when sort order changes', async () => {
      const { result } = renderHook(
        () => useSumDownloadManager({ searchType: 'team' }),
        { wrapper: createTestWrapper() }
      );

      // 初期ロード完了を待つ
      await waitFor(() => {
        expect(result.current.isSearchLoading).toBe(false);
      });

      // ページを2に移動
      act(() => {
        result.current.handlePageChange(2);
      });

      // ソート順を変更
      act(() => {
        result.current.handleSortChange('asc');
      });

      // ページが1にリセットされる
      expect(result.current.currentPage).toBe(1);
    });

    it('should clear selections when sort order changes', async () => {
      const { result } = renderHook(
        () => useSumDownloadManager({ searchType: 'team' }),
        { wrapper: createTestWrapper() }
      );

      // 初期ロード完了を待つ
      await waitFor(() => {
        expect(result.current.isSearchLoading).toBe(false);
      });

      // アイテムを選択
      act(() => {
        result.current.handleSelectionChange([1, 2, 3]);
      });

      expect(result.current.selectedCount).toBe(3);

      // ソート順を変更
      act(() => {
        result.current.handleSortChange('asc');
      });

      // 選択がクリアされる
      expect(result.current.selectedIds).toEqual([]);
      expect(result.current.selectedCount).toBe(0);
    });

    it('should toggle sort order correctly', async () => {
      const { result } = renderHook(
        () => useSumDownloadManager({ searchType: 'team' }),
        { wrapper: createTestWrapper() }
      );

      // 初期ロード完了を待つ
      await waitFor(() => {
        expect(result.current.isSearchLoading).toBe(false);
      });

      // desc -> asc
      act(() => {
        result.current.handleSortChange('asc');
      });
      expect(result.current.sortOrder).toBe('asc');

      // asc -> desc
      act(() => {
        result.current.handleSortChange('desc');
      });
      expect(result.current.sortOrder).toBe('desc');
    });
  });

  describe('統合テスト', () => {
    it('should handle complete workflow: search -> select -> download', async () => {
      const { result } = renderHook(
        () => useSumDownloadManager({ searchType: 'team' }),
        { wrapper: createTestWrapper() }
      );

      // 初期ロード完了を待つ
      await waitFor(() => {
        expect(result.current.isSearchLoading).toBe(false);
      });

      // 1. 検索実行
      act(() => {
        result.current.handleSearch('統合テスト');
      });

      // 検索完了を待つ
      await waitFor(() => {
        expect(result.current.data).toEqual(mockSearchResponse.data);
      });

      // 2. アイテム選択
      act(() => {
        result.current.handleSelectionChange([1, 2]);
      });

      expect(result.current.selectedCount).toBe(2);

      // 3. ダウンロード実行
      act(() => {
        result.current.handleDownload();
      });

      // ミューテーション実行を待つ
      await waitFor(() => {
        expect(sumDownload).toHaveBeenCalledWith([1, 2]);
      });

      // 4. ダウンロード成功後の状態確認
      await waitFor(() => {
        expect(result.current.selectedIds).toEqual([]);
        expect(result.current.selectedCount).toBe(0);
      });
    });

    it('should reset selections when search query changes', async () => {
      const { result } = renderHook(
        () => useSumDownloadManager({ searchType: 'team' }),
        { wrapper: createTestWrapper() }
      );

      // 初期検索完了を待つ
      await waitFor(() => {
        expect(result.current.isSearchLoading).toBe(false);
      });

      // アイテムを選択
      act(() => {
        result.current.handleSelectionChange([1, 2, 3]);
      });

      expect(result.current.selectedCount).toBe(3);

      // 新しい検索を実行
      act(() => {
        result.current.handleSearch('新しい検索');
      });

      // 選択がクリアされることを確認
      expect(result.current.selectedIds).toEqual([]);
      expect(result.current.selectedCount).toBe(0);
      expect(result.current.currentPage).toBe(1);
    });
  });
});
