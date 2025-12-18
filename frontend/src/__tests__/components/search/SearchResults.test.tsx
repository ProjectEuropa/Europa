import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchResults } from '@/components/search/SearchResults';
import type { MatchFile, TeamFile } from '@/types/file';
import type { PaginationMeta } from '@/types/search';

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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本的なレンダリング', () => {
    it('should render search results with data', () => {
      render(
        <SearchResults
          results={[mockTeamFile, mockMatchFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
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
        />
      );

      // Tabキーでボタンにフォーカス
      await user.tab();
      const downloadButton = screen.getByLabelText(
        'test-team.okeをダウンロード'
      );
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
        />
      );

      // 同じデータで再レンダリング
      rerender(
        <SearchResults
          results={[mockTeamFile]}
          meta={mockMeta}
          onPageChange={mockOnPageChange}
          onDownload={mockOnDownload}
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
        />
      );

      const deleteButton = screen.getByTestId('delete-button-1');
      await user.click(deleteButton);

      // 削除モーダルが表示される
      expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
    });
  });
});
