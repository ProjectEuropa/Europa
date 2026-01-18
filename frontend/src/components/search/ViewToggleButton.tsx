'use client';

import type { ReactNode } from 'react';

interface ViewToggleButtonProps {
  /** ボタンのラベルテキスト */
  label: string;
  /** ボタンのアイコン */
  icon: ReactNode;
  /** アクティブ状態 */
  isActive: boolean;
  /** クリックハンドラー */
  onClick: () => void;
  /** ツールチップテキスト */
  title: string;
}

/**
 * ビュー切り替えボタンコンポーネント
 * テーブル表示/カード表示の切り替えに使用
 */
export const ViewToggleButton = ({
  label,
  icon,
  isActive,
  onClick,
  title,
}: ViewToggleButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
        ${
          isActive
            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
            : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800'
        }
      `}
      aria-label={title}
      title={title}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};
