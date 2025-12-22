import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import {
  SumDownloadTable,
  type SumDownloadItem,
} from '@/components/features/sumdownload/SumDownloadTable';

// モックデータ
const mockTeamData: SumDownloadItem[] = [
  {
    id: 1,
    file_name: 'テストチーム1',
    upload_owner_name: 'オーナー1',
    created_at: '2024-01-01T10:00:00Z',
    file_comment: 'テストコメント1',
    downloadable_at: '2024-01-01T10:00:00Z',
    search_tag1: 'タグ1',
    search_tag2: 'タグ2',
    search_tag3: undefined,
    search_tag4: undefined,
  },
  {
    id: 2,
    file_name: 'テストチーム2',
    upload_owner_name: 'オーナー2',
    created_at: '2024-01-02T10:00:00Z',
    file_comment: 'テストコメント2\n複数行\nテスト',
    downloadable_at: '2024-01-02T10:00:00Z',
    search_tag1: 'タグA',
    search_tag2: undefined,
    search_tag3: undefined,
    search_tag4: undefined,
  },
];

const mockMatchData: SumDownloadItem[] = [
  {
    id: 3,
    file_name: 'テストマッチ1',
    upload_owner_name: 'オーナー3',
    created_at: '2024-01-03T10:00:00Z',
    file_comment: 'マッチコメント',
    downloadable_at: '2024-01-03T10:00:00Z',
  },
];

const mockDataWithEmptyDownloadableAt: SumDownloadItem[] = [
  {
    id: 4,
    file_name: 'テストファイル（即座DL可能）',
    upload_owner_name: 'オーナー4',
    created_at: '2024-01-04T10:00:00Z',
    file_comment: '即座にダウンロード可能なファイル',
    downloadable_at: '',
  },
];

describe('SumDownloadTable', () => {
  const mockOnSelectionChange = vi.fn();

  beforeEach(() => {
    mockOnSelectionChange.mockClear();
  });

  describe('Loading State', () => {
    it('displays loading spinner when loading', () => {
      render(
        <SumDownloadTable
          data={[]}
          selectedIds={[]}
          onSelectionChange={mockOnSelectionChange}
          loading={true}
          searchType="team"
        />
      );

      // ローディング中のUIを確認 - CSSアニメーションスピナーの存在確認
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('displays empty message for team search', () => {
      render(
        <SumDownloadTable
          data={[]}
          selectedIds={[]}
          onSelectionChange={mockOnSelectionChange}
          loading={false}
          searchType="team"
        />
      );

      expect(
        screen.getByText('チームデータが見つかりませんでした')
      ).toBeInTheDocument();
    });

    it('displays empty message for match search', () => {
      render(
        <SumDownloadTable
          data={[]}
          selectedIds={[]}
          onSelectionChange={mockOnSelectionChange}
          loading={false}
          searchType="match"
        />
      );

      expect(
        screen.getByText('マッチデータが見つかりませんでした')
      ).toBeInTheDocument();
    });
  });

  describe('Table Headers', () => {
    it('displays correct headers for team search', () => {
      render(
        <SumDownloadTable
          data={mockTeamData}
          selectedIds={[]}
          onSelectionChange={mockOnSelectionChange}
          loading={false}
          searchType="team"
        />
      );

      expect(screen.getByText('チーム名')).toBeInTheDocument();
      expect(screen.getByText('オーナー')).toBeInTheDocument();
      expect(screen.getByText('アップロード日')).toBeInTheDocument();
      expect(screen.getByText('ダウンロード可能日')).toBeInTheDocument();
      expect(screen.getByText('コメント・タグ')).toBeInTheDocument();
    });

    it('displays correct headers for match search', () => {
      render(
        <SumDownloadTable
          data={mockMatchData}
          selectedIds={[]}
          onSelectionChange={mockOnSelectionChange}
          loading={false}
          searchType="match"
        />
      );

      expect(screen.getByText('マッチ名')).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('displays team data correctly', () => {
      render(
        <SumDownloadTable
          data={mockTeamData}
          selectedIds={[]}
          onSelectionChange={mockOnSelectionChange}
          loading={false}
          searchType="team"
        />
      );

      expect(screen.getAllByText('テストチーム1').length).toBeGreaterThan(0);
      expect(screen.getAllByText('オーナー1').length).toBeGreaterThan(0);
      expect(screen.getAllByText('テストコメント1').length).toBeGreaterThan(0);
      // タグは#プレフィックス付きで表示される
      expect(screen.getAllByText('#タグ1').length).toBeGreaterThan(0);
      expect(screen.getAllByText('#タグ2').length).toBeGreaterThan(0);
    });

    it('handles multiline comments correctly', () => {
      render(
        <SumDownloadTable
          data={mockTeamData}
          selectedIds={[]}
          onSelectionChange={mockOnSelectionChange}
          loading={false}
          searchType="team"
        />
      );

      // 複数行コメントがwhitespace-pre-wrapで正しく表示されることを確認
      // 改行を含むコメント全体を含む要素が存在する (both desktop and mobile)
      expect(screen.getAllByText(/テストコメント2/).length).toBeGreaterThan(0);
    });

    it('displays only non-null tags', () => {
      render(
        <SumDownloadTable
          data={mockTeamData}
          selectedIds={[]}
          onSelectionChange={mockOnSelectionChange}
          loading={false}
          searchType="team"
        />
      );

      // 2番目のアイテムはsearch_tag1のみ（#プレフィックス付き）(both desktop and mobile)
      expect(screen.getAllByText('#タグA').length).toBeGreaterThan(0);
      // nullのタグは表示されない
      expect(screen.queryByText('null')).not.toBeInTheDocument();
    });

    it('displays "即座にダウンロード可能" when downloadable_at is null', () => {
      render(
        <SumDownloadTable
          data={mockDataWithEmptyDownloadableAt}
          selectedIds={[]}
          onSelectionChange={mockOnSelectionChange}
          loading={false}
          searchType="team"
        />
      );

      // Both desktop and mobile views exist, so multiple instances of the text
      expect(screen.getAllByText('即座にダウンロード可能').length).toBeGreaterThan(0);
    });
  });

  describe('Checkbox Selection', () => {
    it('renders checkboxes for all items', () => {
      render(
        <SumDownloadTable
          data={mockTeamData}
          selectedIds={[]}
          onSelectionChange={mockOnSelectionChange}
          loading={false}
          searchType="team"
        />
      );

      // 1 select-all + 2 data rows = 3
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(3);
    });

    it('calls onSelectionChange when individual item is selected', async () => {
      const user = userEvent.setup();

      render(
        <SumDownloadTable
          data={mockTeamData}
          selectedIds={[]}
          onSelectionChange={mockOnSelectionChange}
          loading={false}
          searchType="team"
        />
      );

      const checkboxes = screen.getAllByLabelText('テストチーム1を選択');
      await user.click(checkboxes[0]);

      expect(mockOnSelectionChange).toHaveBeenCalledWith([1]);
    });

    it('calls onSelectionChange when individual item is deselected', async () => {
      const user = userEvent.setup();

      render(
        <SumDownloadTable
          data={mockTeamData}
          selectedIds={[1, 2]}
          onSelectionChange={mockOnSelectionChange}
          loading={false}
          searchType="team"
        />
      );

      const checkboxes = screen.getAllByLabelText('テストチーム1を選択');
      await user.click(checkboxes[0]);

      expect(mockOnSelectionChange).toHaveBeenCalledWith([2]);
    });

    it('calls onSelectionChange when select all is clicked', async () => {
      const user = userEvent.setup();

      render(
        <SumDownloadTable
          data={mockTeamData}
          selectedIds={[]}
          onSelectionChange={mockOnSelectionChange}
          loading={false}
          searchType="team"
        />
      );

      const selectAllCheckboxes = screen.getAllByLabelText('すべて選択');
      await user.click(selectAllCheckboxes[0]);

      expect(mockOnSelectionChange).toHaveBeenCalledWith([1, 2]);
    });

    it('calls onSelectionChange when select all is unchecked', async () => {
      const user = userEvent.setup();

      render(
        <SumDownloadTable
          data={mockTeamData}
          selectedIds={[1, 2]}
          onSelectionChange={mockOnSelectionChange}
          loading={false}
          searchType="team"
        />
      );

      const selectAllCheckboxes = screen.getAllByLabelText('すべて選択');
      await user.click(selectAllCheckboxes[0]);

      expect(mockOnSelectionChange).toHaveBeenCalledWith([]);
    });

    it('shows correct selected state for individual items', () => {
      render(
        <SumDownloadTable
          data={mockTeamData}
          selectedIds={[1]}
          onSelectionChange={mockOnSelectionChange}
          loading={false}
          searchType="team"
        />
      );

      const checkbox1List = screen.getAllByLabelText('テストチーム1を選択');
      const checkbox2List = screen.getAllByLabelText('テストチーム2を選択');

      expect(checkbox1List[0]).toBeChecked();
      expect(checkbox2List[0]).not.toBeChecked();
    });

    it('shows correct select all state when all items are selected', () => {
      render(
        <SumDownloadTable
          data={mockTeamData}
          selectedIds={[1, 2]}
          onSelectionChange={mockOnSelectionChange}
          loading={false}
          searchType="team"
        />
      );

      // Both mobile and desktop "select all" checkboxes exist, get the first one
      const selectAllCheckboxes = screen.getAllByLabelText('すべて選択');
      expect(selectAllCheckboxes[0]).toBeChecked();
    });

    it('shows indeterminate state when some items are selected', () => {
      render(
        <SumDownloadTable
          data={mockTeamData}
          selectedIds={[1]}
          onSelectionChange={mockOnSelectionChange}
          loading={false}
          searchType="team"
        />
      );

      const selectAllCheckboxes = screen.getAllByLabelText(
        'すべて選択'
      ) as HTMLInputElement[];
      expect(selectAllCheckboxes[0].indeterminate).toBe(true);
    });

    it('disables checkboxes when loading', () => {
      render(
        <SumDownloadTable
          data={mockTeamData}
          selectedIds={[]}
          onSelectionChange={mockOnSelectionChange}
          loading={true}
          searchType="team"
        />
      );

      // ローディング中は表示されない（別のコンポーネントが表示される）
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });
  });

  describe('Row Styling', () => {
    it('highlights selected rows', () => {
      render(
        <SumDownloadTable
          data={mockTeamData}
          selectedIds={[1]}
          onSelectionChange={mockOnSelectionChange}
          loading={false}
          searchType="team"
        />
      );

      // 選択された行のスタイルを確認（Tailwind CSSクラスで適用）
      const rows = screen.getAllByRole('row');
      const dataRows = rows.slice(1); // ヘッダー行を除く

      // 1番目の行（選択済み）- Tailwind CSSクラスで確認
      expect(dataRows[0]).toHaveClass('bg-cyan-900/20');

      // 2番目の行（未選択）- transparentクラスを持つ
      expect(dataRows[1]).toHaveClass('bg-transparent');
    });
  });

  describe('Accessibility', () => {
    it('provides appropriate aria-labels for checkboxes', () => {
      render(
        <SumDownloadTable
          data={mockTeamData}
          selectedIds={[]}
          onSelectionChange={mockOnSelectionChange}
          loading={false}
          searchType="team"
        />
      );

      // Both mobile and desktop views exist, so getAllByLabelText is used
      expect(screen.getAllByLabelText('すべて選択').length).toBeGreaterThan(0);
      expect(screen.getAllByLabelText('テストチーム1を選択').length).toBeGreaterThan(0);
      expect(screen.getAllByLabelText('テストチーム2を選択').length).toBeGreaterThan(0);
    });
  });

  describe('Card View', () => {
    it('renders card layout with grid classes when viewMode is card', () => {
      const { container } = render(
        <SumDownloadTable
          data={mockTeamData}
          selectedIds={[]}
          onSelectionChange={mockOnSelectionChange}
          loading={false}
          searchType="team"
          viewMode="card"
        />
      );

      // Grid classes check
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1');
      expect(gridContainer).toHaveClass('sm:grid-cols-2');
      expect(gridContainer).toHaveClass('lg:grid-cols-3');

      // Card-specific labels
      expect(screen.getAllByText('オーナー:').length).toBeGreaterThan(0);
      expect(screen.getAllByText('アップロード:').length).toBeGreaterThan(0);
      expect(screen.getAllByText('DL可能:').length).toBeGreaterThan(0);
    });
  });
});
