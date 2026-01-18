'use client';

import type React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { SortOrder } from '@/types/search';

interface SortButtonProps {
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
  className?: string;
}

/**
 * ソート順切り替えボタンコンポーネント
 *
 * 検索結果や一括ダウンロード画面で共通利用される、
 * 昇順/降順を切り替えるためのボタンコンポーネント
 *
 * @param sortOrder - 現在のソート順 ('asc' | 'desc')
 * @param onSortChange - ソート順変更時のコールバック関数
 * @param className - 追加のCSSクラス（オプション）
 */
export const SortButton: React.FC<SortButtonProps> = ({
  sortOrder,
  onSortChange,
  className = '',
}) => {
  const handleClick = () => {
    onSortChange(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const isDescending = sortOrder === 'desc';

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all ${className}`}
      title={isDescending ? '古い順に変更' : '新しい順に変更'}
    >
      {isDescending ? (
        <>
          <ArrowDown size={14} data-testid="arrow-down-icon" />
          <span>新しい順</span>
        </>
      ) : (
        <>
          <ArrowUp size={14} data-testid="arrow-up-icon" />
          <span>古い順</span>
        </>
      )}
    </button>
  );
};
