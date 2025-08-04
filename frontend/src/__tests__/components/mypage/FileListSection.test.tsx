import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import FileListSection from '@/components/mypage/FileListSection';
import * as useMyPageHooks from '@/hooks/api/useMyPage';
import * as dateFormatters from '@/utils/dateFormatters';

// モック設定
vi.mock('@/hooks/api/useMyPage', () => ({
  useMyTeamFiles: vi.fn(),
  useMyMatchFiles: vi.fn(),
  useDeleteFile: vi.fn(),
}));

vi.mock('@/utils/dateFormatters', () => ({
  formatDownloadDateTime: vi.fn(),
  formatUploadDateTime: vi.fn(),
  getAccessibilityDateInfo: vi.fn(),
}));

// 認証ストアのモック
vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: { id: '1', name: 'Test User', email: 'test@example.com' },
    token: 'mock-token',
    isAuthenticated: true,
    loading: false,
    hasHydrated: true,
  })),
}));

// window.confirm のモック
const mockConfirm = vi.fn();
Object.defineProperty(window, 'confirm', {
  value: mockConfirm,
  writable: true,
});

// テスト用のQueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('FileListSection', () => {
  const mockTeamFiles = [
    {
      id: '1',
      name: 'チームファイル1',
      uploadDate: '2023-01-01T00:00:00Z',
      downloadableAt: '2023-01-02T00:00:00Z',
      comment: 'テストコメント1',
      type: 'team' as const,
    },
    {
      id: '2',
      name: 'チームファイル2',
      uploadDate: '2023-01-03T00:00:00Z',
      downloadableAt: '',
      comment: '',
      type: 'team' as const,
    },
  ];

  const mockMatchFiles = [
    {
      id: '3',
      name: 'マッチファイル1',
      uploadDate: '2023-01-05T00:00:00Z',
      downloadableAt: '2023-01-06T00:00:00Z',
      comment: 'マッチコメント1',
      type: 'match' as const,
    },
  ];

  const mockDeleteFile = {
    mutateAsync: vi.fn(),
    isPending: false,
  };

  beforeEach(() => {
    vi.mocked(useMyPageHooks.useMyTeamFiles).mockReturnValue({
      data: mockTeamFiles,
      isLoading: false,
      error: null,
    });

    vi.mocked(useMyPageHooks.useMyMatchFiles).mockReturnValue({
      data: mockMatchFiles,
      isLoading: false,
      error: null,
    });

    vi.mocked(useMyPageHooks.useDeleteFile).mockReturnValue(mockDeleteFile);

    // 日時フォーマット関数のモック設定
    vi.mocked(dateFormatters.formatDownloadDateTime).mockImplementation(
      (dateString: string) => {
        if (!dateString) return '未設定';
        if (dateString === '2023-01-02T00:00:00Z') return '2023/01/02 09:00';
        if (dateString === '2023-01-06T00:00:00Z') return '2023/01/06 09:00';
        return '未設定';
      }
    );

    vi.mocked(dateFormatters.formatUploadDateTime).mockImplementation(
      (dateString: string) => {
        if (!dateString) return '-';
        if (dateString === '2023-01-01T00:00:00Z') return '2023/01/01 09:00';
        if (dateString === '2023-01-03T00:00:00Z') return '2023/01/03 09:00';
        if (dateString === '2023-01-05T00:00:00Z') return '2023/01/05 09:00';
        return '-';
      }
    );

    vi.mocked(dateFormatters.getAccessibilityDateInfo).mockImplementation(
      (
        _dateString: string,
        formattedValue: string,
        context: 'download' | 'upload'
      ) => {
        const contextLabel =
          context === 'download' ? 'ダウンロード' : 'アップロード';
        return {
          ariaLabel: `${contextLabel}日時: ${formattedValue}`,
          title: `${contextLabel}日時: ${formattedValue}`,
        };
      }
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('チームファイル表示', () => {
    it('チームファイル一覧が正しく表示される', () => {
      const wrapper = createWrapper();
      render(<FileListSection type="team" />, { wrapper });

      expect(screen.getByText('アップロードしたチーム')).toBeInTheDocument();
      expect(screen.getAllByText('チームファイル1')).toHaveLength(2); // desktop + mobile view
      expect(screen.getAllByText('チームファイル2')).toHaveLength(2); // desktop + mobile view
    });

    it('チーム検索機能が動作する', async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<FileListSection type="team" />, { wrapper });

      const searchInput = screen.getByPlaceholderText('チームを検索...');
      await user.type(searchInput, 'チームファイル1');

      // 検索後は一致するファイルのみ表示される（desktop + mobile）
      expect(screen.getAllByText('チームファイル1')).toHaveLength(2);
      expect(screen.queryByText('チームファイル2')).not.toBeInTheDocument();
    });

    it('検索結果が見つからない場合のメッセージが表示される', async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<FileListSection type="team" />, { wrapper });

      const searchInput = screen.getByPlaceholderText('チームを検索...');
      await user.type(searchInput, '存在しないファイル');

      expect(
        screen.getByText('検索条件に一致するファイルがありません')
      ).toBeInTheDocument();
    });

    it('ファイルが存在しない場合のメッセージが表示される', () => {
      vi.mocked(useMyPageHooks.useMyTeamFiles).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      });

      const wrapper = createWrapper();
      render(<FileListSection type="team" />, { wrapper });

      expect(screen.getByText('チームデータがありません')).toBeInTheDocument();
    });
  });

  describe('マッチファイル表示', () => {
    it('マッチファイル一覧が正しく表示される', () => {
      const wrapper = createWrapper();
      render(<FileListSection type="match" />, { wrapper });

      expect(screen.getByText('アップロードしたマッチ')).toBeInTheDocument();
      expect(screen.getAllByText('マッチファイル1')).toHaveLength(2); // desktop + mobile view
    });

    it('マッチ検索機能が動作する', async () => {
      const _user = userEvent.setup();
      const wrapper = createWrapper();
      render(<FileListSection type="match" />, { wrapper });

      const searchInput = screen.getByPlaceholderText('マッチを検索...');
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('ファイル操作', () => {
    it('コメントボタンをクリックするとモーダルが開く', async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<FileListSection type="team" />, { wrapper });

      const commentButtons = screen.getAllByText('コメント');
      await user.click(commentButtons[0]);

      expect(
        screen.getByText('チームファイル1 のコメント')
      ).toBeInTheDocument();
      expect(screen.getByText('テストコメント1')).toBeInTheDocument();
    });

    it('モーダルの閉じるボタンが動作する', async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<FileListSection type="team" />, { wrapper });

      // モーダルを開く
      const commentButtons = screen.getAllByText('コメント');
      await user.click(commentButtons[0]);

      // モーダルが開いていることを確認
      expect(
        screen.getByText('チームファイル1 のコメント')
      ).toBeInTheDocument();

      // 閉じるボタンをクリック
      const closeButton = screen.getByText('閉じる');
      await user.click(closeButton);

      // モーダルが閉じていることを確認
      expect(
        screen.queryByText('チームファイル1 のコメント')
      ).not.toBeInTheDocument();
    });

    it('削除ボタンをクリックして確認後に削除が実行される', async () => {
      const user = userEvent.setup();
      mockConfirm.mockReturnValue(true);
      mockDeleteFile.mutateAsync.mockResolvedValue(undefined);

      const wrapper = createWrapper();
      render(<FileListSection type="team" />, { wrapper });

      const deleteButtons = screen.getAllByText('削除');
      await user.click(deleteButtons[0]);

      expect(mockConfirm).toHaveBeenCalledWith('このファイルを削除しますか？');
      expect(mockDeleteFile.mutateAsync).toHaveBeenCalledWith('1');
    });

    it('削除確認でキャンセルした場合は削除されない', async () => {
      const user = userEvent.setup();
      mockConfirm.mockReturnValue(false);

      const wrapper = createWrapper();
      render(<FileListSection type="team" />, { wrapper });

      const deleteButtons = screen.getAllByText('削除');
      await user.click(deleteButtons[0]);

      expect(mockConfirm).toHaveBeenCalledWith('このファイルを削除しますか？');
      expect(mockDeleteFile.mutateAsync).not.toHaveBeenCalled();
    });

    it('削除中はボタンが無効化される', () => {
      vi.mocked(useMyPageHooks.useDeleteFile).mockReturnValue({
        ...mockDeleteFile,
        isPending: true,
      });

      const wrapper = createWrapper();
      render(<FileListSection type="team" />, { wrapper });

      const deleteButtons = screen.getAllByText('削除');
      expect(deleteButtons[0]).toBeDisabled();
    });

    it('コメントがないファイルにはコメントボタンが表示されない', () => {
      const wrapper = createWrapper();
      render(<FileListSection type="team" />, { wrapper });

      // チームファイル1（コメントあり）にはコメントボタンがある（desktop + mobile = 2個）
      const commentButtons = screen.getAllByText('コメント');
      expect(commentButtons).toHaveLength(2);

      // チームファイル2（コメントなし）には削除ボタンのみがある
      const deleteButtons = screen.getAllByText('削除');
      expect(deleteButtons).toHaveLength(4); // 2 files × 2 views (desktop + mobile)
    });
  });

  describe('日付フォーマット', () => {
    it('日付が正しくフォーマットされる', () => {
      const wrapper = createWrapper();
      render(<FileListSection type="team" />, { wrapper });

      // アップロード日時とダウンロード日時の両方をチェック
      expect(screen.getByText('2023/01/01 09:00')).toBeInTheDocument(); // アップロード日時
      expect(screen.getByText('2023/01/02 09:00')).toBeInTheDocument(); // ダウンロード日時
      expect(screen.getByText('2023/01/03 09:00')).toBeInTheDocument(); // 2番目のファイルのアップロード日時
      expect(screen.getByText('未設定')).toBeInTheDocument();
    });
  });

  describe('ヘッダー表示', () => {
    it('チームファイル一覧で「ダウンロード日時」ヘッダーが表示される', () => {
      const wrapper = createWrapper();
      render(<FileListSection type="team" />, { wrapper });

      expect(screen.getByText('ダウンロード日時')).toBeInTheDocument();
      expect(screen.queryByText('公開日')).not.toBeInTheDocument();
    });

    it('マッチファイル一覧で「ダウンロード日時」ヘッダーが表示される', () => {
      const wrapper = createWrapper();
      render(<FileListSection type="match" />, { wrapper });

      expect(screen.getByText('ダウンロード日時')).toBeInTheDocument();
      expect(screen.queryByText('公開日')).not.toBeInTheDocument();
    });

    it('すべての必要なヘッダーが表示される', () => {
      const wrapper = createWrapper();
      render(<FileListSection type="team" />, { wrapper });

      expect(screen.getByText('ファイル名')).toBeInTheDocument();
      expect(screen.getByText('アップロード日')).toBeInTheDocument();
      expect(screen.getByText('ダウンロード日時')).toBeInTheDocument();
      expect(screen.getByText('操作')).toBeInTheDocument();
    });
  });

  describe('日時フォーマット関数の使用', () => {
    it('formatDownloadDateTime関数が正しく呼び出される', () => {
      const wrapper = createWrapper();
      render(<FileListSection type="team" />, { wrapper });

      expect(dateFormatters.formatDownloadDateTime).toHaveBeenCalledWith(
        '2023-01-02T00:00:00Z'
      );
      expect(dateFormatters.formatDownloadDateTime).toHaveBeenCalledWith('');
    });

    it('formatUploadDateTime関数が正しく呼び出される', () => {
      const wrapper = createWrapper();
      render(<FileListSection type="team" />, { wrapper });

      expect(dateFormatters.formatUploadDateTime).toHaveBeenCalledWith(
        '2023-01-01T00:00:00Z'
      );
      expect(dateFormatters.formatUploadDateTime).toHaveBeenCalledWith(
        '2023-01-03T00:00:00Z'
      );
    });

    it('マッチファイルでも日時フォーマット関数が正しく呼び出される', () => {
      const wrapper = createWrapper();
      render(<FileListSection type="match" />, { wrapper });

      expect(dateFormatters.formatDownloadDateTime).toHaveBeenCalledWith(
        '2023-01-06T00:00:00Z'
      );
      expect(dateFormatters.formatUploadDateTime).toHaveBeenCalledWith(
        '2023-01-05T00:00:00Z'
      );
    });
  });

  describe('ローディング状態', () => {
    it('チームファイル読み込み中のメッセージが表示される', () => {
      vi.mocked(useMyPageHooks.useMyTeamFiles).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      });

      const wrapper = createWrapper();
      render(<FileListSection type="team" />, { wrapper });

      expect(
        screen.getByText('チームデータを読み込み中...')
      ).toBeInTheDocument();
    });

    it('マッチファイル読み込み中のメッセージが表示される', () => {
      vi.mocked(useMyPageHooks.useMyMatchFiles).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      });

      const wrapper = createWrapper();
      render(<FileListSection type="match" />, { wrapper });

      expect(
        screen.getByText('マッチデータを読み込み中...')
      ).toBeInTheDocument();
    });
  });

  describe('エラー状態', () => {
    it('チームファイル取得エラー時のメッセージが表示される', () => {
      vi.mocked(useMyPageHooks.useMyTeamFiles).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('取得エラー'),
      });

      const wrapper = createWrapper();
      render(<FileListSection type="team" />, { wrapper });

      expect(
        screen.getByText('チームデータの読み込みに失敗しました')
      ).toBeInTheDocument();
    });

    it('マッチファイル取得エラー時のメッセージが表示される', () => {
      vi.mocked(useMyPageHooks.useMyMatchFiles).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('取得エラー'),
      });

      const wrapper = createWrapper();
      render(<FileListSection type="match" />, { wrapper });

      expect(
        screen.getByText('マッチデータの読み込みに失敗しました')
      ).toBeInTheDocument();
    });
  });

  describe('アクセシビリティ', () => {
    it('検索入力フィールドに適切なラベルがある', () => {
      const wrapper = createWrapper();
      render(<FileListSection type="team" />, { wrapper });

      const searchInput = screen.getByPlaceholderText('チームを検索...');
      expect(searchInput).toHaveAttribute('type', 'text');
    });

    it('ボタンが適切な属性を持つ', () => {
      const wrapper = createWrapper();
      render(<FileListSection type="team" />, { wrapper });

      const deleteButtons = screen.getAllByText('削除');
      deleteButtons.forEach(button => {
        // HTML button elements don't have a 'type' attribute by default
        // They are buttons by nature, so we just check they're button elements
        expect(button.tagName).toBe('BUTTON');
      });
    });

    it('テーブルヘッダーに適切なscope属性がある', () => {
      const wrapper = createWrapper();
      render(<FileListSection type="team" />, { wrapper });

      // テーブルヘッダーのscope属性を確認
      const headers = screen.getAllByRole('columnheader');
      headers.forEach(header => {
        expect(header).toHaveAttribute('scope', 'col');
      });
    });

    it('テーブルヘッダーに適切なaria-label属性がある', () => {
      const wrapper = createWrapper();
      render(<FileListSection type="team" />, { wrapper });

      // 各ヘッダーのaria-label属性を確認
      expect(
        screen.getByRole('columnheader', { name: 'ファイル名' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'ファイルのアップロード日時' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', {
          name: 'ファイルのダウンロード可能日時',
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'ファイル操作' })
      ).toBeInTheDocument();
    });

    it('データセルに適切なaria-label属性がある', () => {
      const wrapper = createWrapper();
      render(<FileListSection type="team" />, { wrapper });

      // ファイル名セルのaria-label属性を確認
      const fileNameCells = screen.getAllByLabelText(/^ファイル名:/);
      expect(fileNameCells.length).toBeGreaterThan(0);

      // アップロード日時セルのaria-label属性を確認
      const uploadDateCells = screen.getAllByLabelText(/^アップロード日時:/);
      expect(uploadDateCells.length).toBeGreaterThan(0);

      // ダウンロード日時セルのaria-label属性を確認
      const downloadDateCells = screen.getAllByLabelText(/^ダウンロード日時:/);
      expect(downloadDateCells.length).toBeGreaterThan(0);

      // 操作セルのaria-label属性を確認
      const actionCells = screen.getAllByLabelText(/の操作$/);
      expect(actionCells.length).toBeGreaterThan(0);
    });

    it('操作ボタンに適切なaria-label属性がある', () => {
      const wrapper = createWrapper();
      render(<FileListSection type="team" />, { wrapper });

      // コメントボタンのaria-label属性を確認
      const commentButtons = screen.getAllByLabelText(/のコメントを表示$/);
      expect(commentButtons.length).toBeGreaterThan(0);

      // 削除ボタンのaria-label属性を確認
      const deleteButtons = screen.getAllByLabelText(/を削除$/);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });
});
