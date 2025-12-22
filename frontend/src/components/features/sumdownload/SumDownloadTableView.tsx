import React from 'react';
import { formatDate } from '@/utils/dateFormatters';
import { formatDownloadableDate } from './SumDownloadTable';

interface TableViewProps {
    data: any[];
    selectedIds: number[];
    onSelectItem: (id: number, checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
    isAllSelected: boolean;
    isIndeterminate: boolean;
    loading: boolean;
    searchType: 'team' | 'match';
    renderComment: (comment: string) => React.ReactNode;
    renderTags: (item: any) => React.ReactNode;
}

export const SumDownloadTableView = ({
    data,
    selectedIds,
    onSelectItem,
    onSelectAll,
    isAllSelected,
    isIndeterminate,
    loading,
    searchType,
    renderComment,
    renderTags,
}: TableViewProps) => {
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
                                    onChange={e => onSelectAll(e.target.checked)}
                                    disabled={loading}
                                    aria-label="すべて選択"
                                    className="w-4 h-4 accent-cyan-500 bg-slate-800 border-slate-600 rounded cursor-pointer disabled:opacity-50"
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
                                className={`transition-colors duration-150 items-center text-sm ${isSelected ? 'bg-cyan-900/20' : 'bg-transparent hover:bg-slate-800/50'
                                    }`}
                                onClick={() => onSelectItem(item.id, !isSelected)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td className="p-3" onClick={e => e.stopPropagation()}>
                                    <div className="flex items-center justify-center h-full">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={e => onSelectItem(item.id, e.target.checked)}
                                            disabled={loading}
                                            aria-label={`${item.file_name}を選択`}
                                            className="w-4 h-4 accent-cyan-500 bg-slate-800 border-slate-600 rounded cursor-pointer disabled:opacity-50"
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
