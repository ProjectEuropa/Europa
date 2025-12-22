import React from 'react';
import { formatDate } from '@/utils/dateFormatters';
import { formatDownloadableDate } from './SumDownloadTable';

interface CardViewProps {
    data: any[];
    selectedIds: number[];
    onSelectItem: (id: number, checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
    isAllSelected: boolean;
    isIndeterminate: boolean;
    loading: boolean;
    renderComment: (comment: string) => React.ReactNode;
    renderTags: (item: any) => React.ReactNode;
}

export const SumDownloadCardView = ({
    data,
    selectedIds,
    onSelectItem,
    onSelectAll,
    isAllSelected,
    isIndeterminate,
    loading,
    renderComment,
    renderTags,
}: CardViewProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 px-2">
            {/* すべて選択ボタン */}
            <div className="col-span-full flex items-center gap-3 px-4 py-3 bg-slate-900/50 rounded-lg border border-slate-800">
                <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={e => onSelectAll(e.target.checked)}
                    disabled={loading}
                    aria-label="すべて選択"
                    className="w-5 h-5 accent-cyan-500 bg-slate-800 border-slate-600 rounded cursor-pointer disabled:opacity-50"
                    ref={el => {
                        if (el && isIndeterminate) {
                            el.indeterminate = true;
                        }
                    }}
                />
                <span className="text-slate-300 font-medium">すべて選択</span>
            </div>

            {/* カードリスト */}
            {data.map(item => {
                const isSelected = selectedIds.includes(item.id);
                return (
                    <div
                        key={item.id}
                        className={`relative p-4 rounded-lg border transition-all duration-200 cursor-pointer ${isSelected
                                ? 'bg-cyan-900/20 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                            }`}
                        onClick={() => onSelectItem(item.id, !isSelected)}
                    >
                        {/* チェックボックス（右上） */}
                        <div className="absolute top-4 right-4" onClick={e => e.stopPropagation()}>
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={e => onSelectItem(item.id, e.target.checked)}
                                disabled={loading}
                                aria-label={`${item.file_name}を選択`}
                                className="w-5 h-5 accent-cyan-500 bg-slate-800 border-slate-600 rounded cursor-pointer disabled:opacity-50"
                            />
                        </div>

                        {/* ファイル名 */}
                        <div className="pr-10 mb-3">
                            <p className="text-cyan-400 font-medium text-base font-mono break-all">
                                {item.file_name}
                            </p>
                        </div>

                        {/* オーナー */}
                        <div className="mb-2">
                            <span className="text-slate-500 text-xs">オーナー: </span>
                            <span className="text-slate-300 text-sm">{item.upload_owner_name}</span>
                        </div>

                        {/* アップロード日 */}
                        <div className="mb-2">
                            <span className="text-slate-500 text-xs">アップロード: </span>
                            <span className="text-slate-400 text-xs font-mono">
                                {formatDate(item.created_at)}
                            </span>
                        </div>

                        {/* ダウンロード可能日 */}
                        <div className="mb-3">
                            <span className="text-slate-500 text-xs">DL可能: </span>
                            <span className="text-slate-400 text-xs font-mono">
                                {formatDownloadableDate(item.downloadable_at)}
                            </span>
                        </div>

                        {/* コメント */}
                        {item.file_comment && (
                            <div className="mb-2">{renderComment(item.file_comment)}</div>
                        )}

                        {/* タグ */}
                        {renderTags(item)}
                    </div>
                );
            })}
        </div>
    );
};
