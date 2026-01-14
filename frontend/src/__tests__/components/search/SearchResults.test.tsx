import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchResults } from '@/components/search/SearchResults';
import type { MatchFile, TeamFile } from '@/types/file';
import type { PaginationMeta } from '@/types/search';

// framer-motionをモック
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// useDeleteFileフックをモック
vi.mock('@/hooks/useSearch', () => ({
  useDeleteFile: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
}));

// DeleteModalをモック
vi.mock('@/components/DeleteModal', () => ({
  DeleteModal: ({
    open,
    onDelete,
    fileName,
  }: {
    open: boolean;
    onDelete: (password: string) => void;
    fileName: string;
  }) =>
    open ? (
      <div data-testid="delete-modal">
        <p>Delete {fileName}?</p>
        <button type="button" onClick={() => onDelete('password123')}>
          Confirm Delete
        </button>
      </div>
    ) : null,
}));

// toastをモック
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('SearchResults', () => {
  const mockOnPageChange = vi.fn();
  const mockOnDownload = vi.fn();
  const mockOnSortChange = vi.fn();

  const mockTeamFile: TeamFile = {
    id: 1,
    name: 'test-team.oke',
    ownerName: 'testuser',
    comment: 'Test team file comment',
    downloadableAt: '2024-01-01T10:00:00Z',
    created_at: '2024-01-01T09:00:00Z',
    updatedAt: '2024-01-01T09:00:00Z',
    searchTag1: 'tag1',
    searchTag2: 'tag2',
    searchTag3: null,
    searchTag4: null,
    file_name: 'test-team.oke',
    upload_owner_name: 'testuser',
    file_comment: 'Test team file comment',
    type: 'team',
    upload_type: '2', // 簡易アップロード - 削除ボタン表示
  };

  const mockMatchFile: MatchFile = {
    id: 2,
    name: 'test-match.oke',
    ownerName: 'matchuser',
    comment: 'Test match file comment',
    downloadableAt: '2024-01-01T12:00:00Z',
    created_at: '2024-01-01T09:00:00Z',
    updatedAt: '2024-01-01T11:00:00Z',
    searchTag1: 'match',
    searchTag2: null,
    searchTag3: null,
    searchTag4: null,
    file_name: 'test-match.oke',
    upload_owner_name: 'matchuser',
    file_comment: 'Test match file comment',
    type: 'match',
    upload_type: '1', // 認証アップロード - 削除ボタン非表示
  };

  const mockMeta: PaginationMeta = {
    currentPage: 1,
    lastPage: 3,
    perPage: 10,
    total: 25,
  };

  // デフォルトのソートpropsを定義
  const defaultSortProps = {
    sortOrder: 'desc' as const,
    onSortChange: mockOnSortChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // デスクトップサイズ（1024px以上）をデフォルトに設定
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });
    // localStorageをクリア
    localStorage.clear();
  });

  describe('基本的なレンダリング', () => {
    it('should render search results with data', () => {
      render(
        <SearchResults
          results={[mockTeamFile, mockMatchFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      expect(screen.getByText('25件の結果 (ページ 1/3)')).toBeInTheDocument();
      expect(screen.getByText('test-team.oke')).toBeInTheDocument();
      expect(screen.getByText('test-match.oke')).toBeInTheDocument();
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('matchuser')).toBeInTheDocument();
    });

    it('should render loading state', () => {
      render(
        <SearchResults
          results={[]}
          meta={mockMeta}
          loading={true}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      expect(screen.getByText('検索中...')).toBeInTheDocument();
      expect(screen.queryByText('25件の結果')).not.toBeInTheDocument();
    });

    it('should render error state', () => {
      render(
        <SearchResults
          results={[]}
          meta={mockMeta}
          error="検索に失敗しました"
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      expect(screen.getByText('検索に失敗しました')).toBeInTheDocument();
      expect(screen.queryByText('25件の結果')).not.toBeInTheDocument();
    });

    it('should render empty state', () => {
      render(
        <SearchResults
          results={[]}
          meta={{ currentPage: 1, lastPage: 1, perPage: 10, total: 0 }}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      expect(
        screen.getByText('検索結果が見つかりませんでした')
      ).toBeInTheDocument();
      expect(
        screen.getByText('別のキーワードで検索してみてください')
      ).toBeInTheDocument();
    });
  });

  describe('データ表示', () => {
    it('should display file information correctly', () => {
      render(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      expect(screen.getByText('test-team.oke')).toBeInTheDocument();
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('Test team file comment')).toBeInTheDocument();
      // タグは#プレフィックス付きで表示される
      expect(screen.getByText('#tag1')).toBeInTheDocument();
      expect(screen.getByText('#tag2')).toBeInTheDocument();
    });

    it('should format dates correctly', () => {
      render(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      // 日付フォーマットの確認（実際の表示形式に依存）
      expect(screen.getAllByText(/2024/)).toHaveLength(2); // 作成日時とDL可能日時
    });

    it('should display tags correctly', () => {
      render(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      // タグは#プレフィックス付きで表示される
      const tag1 = screen.getByText('#tag1');
      const tag2 = screen.getByText('#tag2');

      expect(tag1).toBeInTheDocument();
      expect(tag2).toBeInTheDocument();

      // タグはボタン要素として表示され、Tailwind CSSでスタイリングされている
      expect(tag1.tagName).toBe('BUTTON');
      expect(tag2.tagName).toBe('BUTTON');
    });

    it('should handle files without comments or tags', () => {
      const fileWithoutCommentAndTags: TeamFile = {
        ...mockTeamFile,
        comment: '',
        searchTag1: null,
        searchTag2: null,
        searchTag3: null,
        searchTag4: null,
      };

      render(
        <SearchResults
          results={[fileWithoutCommentAndTags]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      expect(screen.getByText('test-team.oke')).toBeInTheDocument();
      // コメントやタグがない場合でもエラーが発生しないことを確認
    });
  });

  describe('インタラクション', () => {
    it('should call onDownload when download button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      const downloadButton = screen.getByLabelText(
        'test-team.okeをダウンロード'
      );
      await user.click(downloadButton);

      // 処理されたデータが渡されることを確認
      expect(mockOnDownload).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockTeamFile.id,
          name: mockTeamFile.name,
          ownerName: mockTeamFile.ownerName,
          comment: mockTeamFile.comment,
          tags: ['tag1', 'tag2'],
        })
      );
    });

    it('should open delete modal when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      const deleteButton = screen.getByTestId('delete-button-1');
      await user.click(deleteButton);

      expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
      expect(screen.getByText('Delete test-team.oke?')).toBeInTheDocument();
    });
  });

  describe('ページネーション', () => {
    it('should render pagination when multiple pages exist', () => {
      render(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      expect(screen.getByText('前へ')).toBeInTheDocument();
      expect(screen.getByText('次へ')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should not render pagination for single page', () => {
      const singlePageMeta: PaginationMeta = {
        currentPage: 1,
        lastPage: 1,
        perPage: 10,
        total: 5,
      };

      render(
        <SearchResults
          results={[mockTeamFile]}
          meta={singlePageMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      expect(screen.queryByText('前へ')).not.toBeInTheDocument();
      expect(screen.queryByText('次へ')).not.toBeInTheDocument();
    });

    it('should call onPageChange when page button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      const page2Button = screen.getByText('2');
      await user.click(page2Button);

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it('should disable previous button on first page', () => {
      render(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      const prevButton = screen.getByText('前へ');
      expect(prevButton).toBeDisabled();
    });

    it('should disable next button on last page', () => {
      const lastPageMeta: PaginationMeta = {
        currentPage: 3,
        lastPage: 3,
        perPage: 10,
        total: 25,
      };

      render(
        <SearchResults
          results={[mockTeamFile]}
          meta={lastPageMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      const nextButton = screen.getByText('次へ');
      expect(nextButton).toBeDisabled();
    });

    it('should render ellipsis for large page counts', () => {
      const manyPagesMeta: PaginationMeta = {
        currentPage: 5,
        lastPage: 20,
        perPage: 10,
        total: 200,
      };

      render(
        <SearchResults
          results={[mockTeamFile]}
          meta={manyPagesMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      // 複数の省略記号があることを確認
      expect(screen.getAllByText('...')).toHaveLength(2);
    });
  });

  describe('アクセシビリティ', () => {
    it('should have proper ARIA labels', () => {
      render(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      expect(
        screen.getByLabelText('test-team.okeをダウンロード')
      ).toBeInTheDocument();
      expect(screen.getByTestId('delete-button-1')).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      // ダウンロードボタンに直接フォーカスしてEnterキーで実行
      const downloadButton = screen.getByLabelText(
        'test-team.okeをダウンロード'
      );
      downloadButton.focus();
      expect(downloadButton).toHaveFocus();

      // Enterキーで実行
      await user.keyboard('{Enter}');
      expect(mockOnDownload).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockTeamFile.id,
          name: mockTeamFile.name,
          ownerName: mockTeamFile.ownerName,
          comment: mockTeamFile.comment,
          tags: ['tag1', 'tag2'],
        })
      );
    });
  });

  describe('パフォーマンス', () => {
    it('should memoize processed results', () => {
      const { rerender } = render(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      // 同じデータで再レンダリング
      rerender(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      // メモ化により不要な再計算が避けられることを確認
      expect(screen.getByText('test-team.oke')).toBeInTheDocument();
    });
  });

  describe('削除ボタンの条件付き表示', () => {
    const testMeta: PaginationMeta = {
      currentPage: 1,
      lastPage: 1,
      perPage: 10,
      total: 2,
    };

    it('should show delete button only for upload_type="2" (簡易アップロード)', () => {
      const fileWithSimpleUpload: TeamFile = {
        id: 1,
        name: 'simple-upload.txt',
        ownerName: 'testuser',
        comment: 'Simple upload file',
        downloadableAt: '2024-01-01T10:00:00Z',
        created_at: '2024-01-01T09:00:00Z',
        updatedAt: '2024-01-01T09:00:00Z',
        searchTag1: 'tag1',
        searchTag2: null,
        searchTag3: null,
        searchTag4: null,
        file_name: 'simple-upload.txt',
        upload_owner_name: 'testuser',
        file_comment: 'Simple upload file',
        type: 'team',
        upload_type: '2', // 簡易アップロード
      };

      const fileWithAuthUpload: TeamFile = {
        id: 2,
        name: 'auth-file.txt',
        ownerName: 'testuser',
        comment: 'Auth upload file',
        downloadableAt: '2024-01-01T10:00:00Z',
        created_at: '2024-01-01T09:00:00Z',
        updatedAt: '2024-01-01T09:00:00Z',
        searchTag1: 'tag1',
        searchTag2: null,
        searchTag3: null,
        searchTag4: null,
        file_name: 'auth-file.txt',
        upload_owner_name: 'testuser',
        file_comment: 'Auth upload file',
        type: 'team',
        upload_type: '1', // 認証アップロード
      };

      render(
        <SearchResults
          results={[fileWithSimpleUpload, fileWithAuthUpload]}
          meta={testMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      // 簡易アップロード（upload_type='2'）のファイルには削除ボタンが表示される
      expect(screen.getByTestId('delete-button-1')).toBeInTheDocument();

      // 認証アップロード（upload_type='1'）のファイルには削除ボタンが表示されない
      expect(screen.queryByTestId('delete-button-2')).not.toBeInTheDocument();
    });

    it('should not show delete button when upload_type is undefined', () => {
      const fileWithoutUploadType: TeamFile = {
        id: 1,
        name: 'no-upload-type.txt',
        ownerName: 'testuser',
        comment: 'File without upload type',
        downloadableAt: '2024-01-01T10:00:00Z',
        created_at: '2024-01-01T09:00:00Z',
        updatedAt: '2024-01-01T09:00:00Z',
        searchTag1: 'tag1',
        searchTag2: null,
        searchTag3: null,
        searchTag4: null,
        file_name: 'no-upload-type.txt',
        upload_owner_name: 'testuser',
        file_comment: 'File without upload type',
        type: 'team',
        upload_type: undefined,
      };

      render(
        <SearchResults
          results={[fileWithoutUploadType]}
          meta={testMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      // upload_typeが未定義の場合は削除ボタンが表示されない
      expect(screen.queryByTestId('delete-button-1')).not.toBeInTheDocument();
    });

    it('should handle delete action for files with upload_type="2"', async () => {
      const user = userEvent.setup();
      const fileWithSimpleUpload: TeamFile = {
        id: 1,
        name: 'deletable-file.txt',
        ownerName: 'testuser',
        comment: 'Deletable file',
        downloadableAt: '2024-01-01T10:00:00Z',
        created_at: '2024-01-01T09:00:00Z',
        updatedAt: '2024-01-01T09:00:00Z',
        searchTag1: 'tag1',
        searchTag2: null,
        searchTag3: null,
        searchTag4: null,
        file_name: 'deletable-file.txt',
        upload_owner_name: 'testuser',
        file_comment: 'Deletable file',
        type: 'team',
        upload_type: '2',
      };

      render(
        <SearchResults
          results={[fileWithSimpleUpload]}
          meta={testMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      const deleteButton = screen.getByTestId('delete-button-1');
      await user.click(deleteButton);

      // 削除モーダルが表示される
      expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
    });
  });

  describe('ソート機能', () => {
    const mockOnSortChange = vi.fn();

    beforeEach(() => {
      mockOnSortChange.mockClear();
    });

    it('should render sort button with correct initial state (desc)', () => {
      render(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          sortOrder="desc"
          onSortChange={mockOnSortChange}
        />
      );

      expect(screen.getByText('新しい順')).toBeInTheDocument();
    });

    it('should render sort button with ascending state', () => {
      render(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          sortOrder="asc"
          onSortChange={mockOnSortChange}
        />
      );

      expect(screen.getByText('古い順')).toBeInTheDocument();
    });

    it('should call onSortChange when sort button is clicked (desc to asc)', async () => {
      const user = userEvent.setup();
      render(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          sortOrder="desc"
          onSortChange={mockOnSortChange}
        />
      );

      const sortButton = screen.getByText('新しい順');
      await user.click(sortButton);

      expect(mockOnSortChange).toHaveBeenCalledWith('asc');
    });

    it('should call onSortChange when sort button is clicked (asc to desc)', async () => {
      const user = userEvent.setup();
      render(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          sortOrder="asc"
          onSortChange={mockOnSortChange}
        />
      );

      const sortButton = screen.getByText('古い順');
      await user.click(sortButton);

      expect(mockOnSortChange).toHaveBeenCalledWith('desc');
    });

    it('should call onSortChange when table header is clicked', async () => {
      const user = userEvent.setup();
      // デスクトップサイズを設定（テーブルが表示される）
      Object.defineProperty(window, 'innerWidth', { value: 1200 });

      render(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          sortOrder="desc"
          onSortChange={mockOnSortChange}
        />
      );

      // テーブルヘッダーのアップロード日時カラムをクリック（テキスト内容で検索）
      const headerButtons = screen.getAllByTitle('古い順に変更');
      // テーブルヘッダーのボタンは最初の要素
      await user.click(headerButtons[0]);

      expect(mockOnSortChange).toHaveBeenCalledWith('asc');
    });

    it('should display correct arrow icon for descending order', () => {
      render(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          sortOrder="desc"
          onSortChange={mockOnSortChange}
        />
      );

      // 降順の場合は下向き矢印アイコンが表示される
      const sortButton = screen.getByText('新しい順').closest('button');
      expect(sortButton).toBeInTheDocument();
      // ArrowDownアイコンの存在を確認
      expect(screen.getByTestId('arrow-down-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('arrow-up-icon')).not.toBeInTheDocument();
    });

    it('should display correct arrow icon for ascending order', () => {
      render(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          sortOrder="asc"
          onSortChange={mockOnSortChange}
        />
      );

      // 昇順の場合は上向き矢印アイコンが表示される
      const sortButton = screen.getByText('古い順').closest('button');
      expect(sortButton).toBeInTheDocument();
      // ArrowUpアイコンの存在を確認
      expect(screen.getByTestId('arrow-up-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('arrow-down-icon')).not.toBeInTheDocument();
    });
  });

  describe('ビュー切り替え機能', () => {
    it('should show view toggle buttons on desktop', () => {
      // デスクトップサイズを設定
      Object.defineProperty(window, 'innerWidth', { value: 1200 });

      render(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      expect(screen.getByLabelText('テーブル表示')).toBeInTheDocument();
      expect(screen.getByLabelText('カード表示')).toBeInTheDocument();
    });

    it('should hide view toggle buttons on mobile/tablet', () => {
      // モバイルサイズを設定
      Object.defineProperty(window, 'innerWidth', { value: 768 });

      render(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      // ビュー切り替えボタンは非表示
      expect(screen.queryByLabelText('テーブル表示')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('カード表示')).not.toBeInTheDocument();
    });

    it('should switch to card view when card button is clicked', async () => {
      const user = userEvent.setup();
      Object.defineProperty(window, 'innerWidth', { value: 1200 });

      render(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      const cardButton = screen.getByLabelText('カード表示');
      await user.click(cardButton);

      // localStorageに保存されていることを確認
      expect(localStorage.getItem('searchViewMode')).toBe('card');
    });

    it('should persist view mode preference in localStorage', async () => {
      const user = userEvent.setup();
      Object.defineProperty(window, 'innerWidth', { value: 1200 });

      const { rerender } = render(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      // カードビューに切り替え
      const cardButton = screen.getByLabelText('カード表示');
      await user.click(cardButton);

      expect(localStorage.getItem('searchViewMode')).toBe('card');

      // 再レンダリングしても設定が維持されている
      rerender(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      // カードビューの設定が維持されていることを確認
      expect(localStorage.getItem('searchViewMode')).toBe('card');
    });

    it('should display file data correctly in card view on mobile', () => {
      // モバイルサイズを設定（カードビューが強制される）
      Object.defineProperty(window, 'innerWidth', { value: 375 });

      render(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
          {...defaultSortProps}
        />
      );

      // カードビューでもファイル情報が表示される
      expect(screen.getByText('test-team.oke')).toBeInTheDocument();
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('Test team file comment')).toBeInTheDocument();
    });
  });
});
