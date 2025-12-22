import React from 'react';
import { formatDate } from '@/utils/dateFormatters';
import { Check } from 'lucide-react';

// 一括ダウンロード用の日付フォーマット関数
export const formatDownloadableDate = (dateString?: string | null): string => {
  if (!dateString || dateString.trim() === '') {
    return '即座にダウンロード可能';
  }
  return formatDate(dateString);
};

import { SumDownloadTableView } from './SumDownloadTableView';
import { SumDownloadCardView } from './SumDownloadCardView';

export interface SumDownloadItem {
  id: number;
  file_name: string;
  upload_owner_name: string;
  created_at: string;
  file_comment: string;
  downloadable_at?: string | null;
  search_tag1?: string;
  search_tag2?: string;
  search_tag3?: string;
  search_tag4?: string;
}

interface SumDownloadTableProps {
  data: SumDownloadItem[];
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  loading?: boolean;
  searchType: 'team' | 'match';
  viewMode?: 'table' | 'card';
}

export const SumDownloadTable = ({
  data,
  selectedIds,
  onSelectionChange,
  loading = false,
  searchType,
  viewMode = 'table',
}: SumDownloadTableProps) => {
  const handleSelectAll = (checked: boolean) => {
    onSelectionChange(checked ? data.map(item => item.id) : []);
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const isAllSelected = selectedIds.length === data.length && data.length > 0;
  const isIndeterminate =
    selectedIds.length > 0 && selectedIds.length < data.length;

  const renderTags = (item: SumDownloadItem) => {
    const tags = [
      item.search_tag1,
      item.search_tag2,
      item.search_tag3,
      item.search_tag4,
    ].filter((tag): tag is string => !!tag);

    return (
      <div className="flex flex-wrap gap-1.5 mt-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="
              px-2 py-0.5 
              bg-slate-800/80 
              border border-slate-700 
              text-cyan-400/90 
              text-xs 
              rounded 
            "
          >
            #{tag}
          </span>
        ))}
      </div>
    );
  };

  const renderComment = (comment: string) => {
    if (!comment) return '';

    return (
      <div className="whitespace-pre-wrap break-words text-slate-400">
        {comment}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-2 border-transparent border-t-cyan-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        {searchType === 'team' ? 'チームデータ' : 'マッチデータ'}
        が見つかりませんでした
      </div>
    );
  }

  const commonProps = {
    data,
    selectedIds,
    onSelectItem: handleSelectItem,
    onSelectAll: handleSelectAll,
    isAllSelected,
    isIndeterminate,
    loading,
    renderComment,
    renderTags,
  };

  return (
    <>
      {viewMode === 'table' ? (
        <SumDownloadTableView {...commonProps} searchType={searchType} />
      ) : (
        <SumDownloadCardView {...commonProps} />
      )}
    </>
  );
};

