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
    search_tag3: null,
    search_tag4: null,
  },
  {
    id: 2,
    file_name: 'テストチーム2',
    upload_owner_name: 'オーナー2',
    created_at: '2024-01-02T10:00:00Z',
    file_comment: 'テストコメント2\n複数行\nテスト',
    downloadable_at: '2024-01-02T10:00:00Z',
    search_tag1: 'タグA',
    search_tag2: null,
    search_tag3: null,
    search_tag4: null,
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

      // ローディング中のUIを確認 - SVGスピナーの存在確認
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
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

      expect(screen.getByText('テストチーム1')).toBeInTheDocument();
      expect(screen.getByText('オーナー1')).toBeInTheDocument();
      expect(screen.getByText('テストコメント1')).toBeInTheDocument();
      expect(screen.getByText('タグ1')).toBeInTheDocument();
      expect(screen.getByText('タグ2')).toBeInTheDocument();
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

      // 複数行コメントが正しく表示されることを確認
      expect(screen.getByText('テストコメント2')).toBeInTheDocument();
      expect(screen.getByText('複数行')).toBeInTheDocument();
      expect(screen.getByText('テスト')).toBeInTheDocument();
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

      // 2番目のアイテムはsearch_tag1のみ
      expect(screen.getByText('タグA')).toBeInTheDocument();
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

      expect(screen.getByText('即座にダウンロード可能')).toBeInTheDocument();
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

      // ヘッダーチェックボックス + 各行のチェックボックス
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(3); // 1個のヘッダー + 2個のデータ行
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

      const checkbox = screen.getByLabelText('テストチーム1を選択');
      await user.click(checkbox);

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

      const checkbox = screen.getByLabelText('テストチーム1を選択');
      await user.click(checkbox);

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

      const selectAllCheckbox = screen.getByLabelText('すべて選択');
      await user.click(selectAllCheckbox);

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

      const selectAllCheckbox = screen.getByLabelText('すべて選択');
      await user.click(selectAllCheckbox);

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

      const checkbox1 = screen.getByLabelText('テストチーム1を選択');
      const checkbox2 = screen.getByLabelText('テストチーム2を選択');

      expect(checkbox1).toBeChecked();
      expect(checkbox2).not.toBeChecked();
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

      const selectAllCheckbox = screen.getByLabelText('すべて選択');
      expect(selectAllCheckbox).toBeChecked();
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

      const selectAllCheckbox = screen.getByLabelText(
        'すべて選択'
      ) as HTMLInputElement;
      expect(selectAllCheckbox.indeterminate).toBe(true);
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

      // 選択された行のスタイルを確認
      const rows = screen.getAllByRole('row');
      const dataRows = rows.slice(1); // ヘッダー行を除く

      // 1番目の行（選択済み）
      expect(dataRows[0]).toHaveStyle({ background: '#0A1A2A' });

      // 2番目の行（未選択）
      expect(dataRows[1]).toHaveStyle({ background: 'transparent' });
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

      expect(screen.getByLabelText('すべて選択')).toBeInTheDocument();
      expect(screen.getByLabelText('テストチーム1を選択')).toBeInTheDocument();
      expect(screen.getByLabelText('テストチーム2を選択')).toBeInTheDocument();
    });
  });
});
