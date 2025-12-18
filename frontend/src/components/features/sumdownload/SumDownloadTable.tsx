import React from 'react';
import { formatDate } from '@/utils/dateFormatters';
import { Check } from 'lucide-react';

// 一括ダウンロード用の日付フォーマット関数
const formatDownloadableDate = (dateString?: string | null): string => {
  if (!dateString || dateString.trim() === '') {
    return '即座にダウンロード可能';
  }
  return formatDate(dateString);
};

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
}

export const SumDownloadTable = ({
  data,
  selectedIds,
  onSelectionChange,
  loading = false,
  searchType,
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

  return (
    <div className="w-full overflow-x-auto mt-6 rounded-lg border border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-xl">
      <table className="w-full min-w-[1000px] border-collapse bg-slate-900 table-fixed">
        <thead>
          <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-sm font-semibold text-left">
            <th className="p-3 w-[50px]">
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={e => handleSelectAll(e.target.checked)}
                  disabled={loading}
                  aria-label="すべて選択"
                  className="
                    w-4 h-4 
                    accent-cyan-500 
                    bg-slate-800 border-slate-600 
                    rounded 
                    cursor-pointer
                    disabled:opacity-50
                  "
                  ref={el => {
                    if (el && isIndeterminate) {
                      el.indeterminate = true;
                    }
                  }}
                />
              </div>
            </th>
            <th className="p-3 font-semibold text-white">
              {searchType === 'team' ? 'チーム名' : 'マッチ名'}
            </th>
            <th className="p-3 font-semibold text-white">オーナー</th>
            <th className="p-3 font-semibold text-white">アップロード日</th>
            <th className="p-3 font-semibold text-white">ダウンロード可能日</th>
            <th className="p-3 font-semibold text-white w-[350px]">コメント・タグ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {data.map(item => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <tr
                key={item.id}
                className={`
                  transition-colors duration-150 items-center text-sm
                  ${isSelected ? 'bg-cyan-900/20' : 'bg-transparent hover:bg-slate-800/50'}
                `}
                onClick={() => handleSelectItem(item.id, !isSelected)}
                style={{ cursor: 'pointer' }}
              >
                <td className="p-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center h-full">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={e => handleSelectItem(item.id, e.target.checked)}
                      disabled={loading}
                      aria-label={`${item.file_name}を選択`}
                      className="
                        w-4 h-4 
                        accent-cyan-500 
                        bg-slate-800 border-slate-600 
                        rounded 
                        cursor-pointer
                        disabled:opacity-50
                      "
                    />
                  </div>
                </td>
                <td className="p-3 text-cyan-400 font-medium break-all font-mono">
                  {item.file_name}
                </td>
                <td className="p-3 text-slate-300 break-words">
                  {item.upload_owner_name}
                </td>
                <td className="p-3 text-slate-400 font-mono text-xs">
                  {formatDate(item.created_at)}
                </td>
                <td className="p-3 text-slate-400 font-mono text-xs">
                  {formatDownloadableDate(item.downloadable_at)}
                </td>
                <td className="p-3">
                  {renderComment(item.file_comment)}
                  {renderTags(item)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
