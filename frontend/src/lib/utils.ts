import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Z-index階層定数
 * アプリケーション全体で一貫したz-indexを使用するための定数
 *
 * 階層構造:
 * - base (1): 基本的な重なり
 * - dropdown (10): ドロップダウンメニュー
 * - sticky (50): スティッキー要素（ヘッダー等）
 * - overlay (100): オーバーレイ（カレンダーピッカー等）
 * - modal (1000): モーダルダイアログ
 * - toast (9000): トースト通知
 * - tooltip (9500): ツールチップ
 * - focus (99999): フォーカスマネージャー等の最上位要素
 */
export const Z_INDEX = {
  /** 基本的な重なり */
  base: 1,
  /** ドロップダウンメニュー、ポップオーバー */
  dropdown: 10,
  /** スティッキー要素（ヘッダー等） */
  sticky: 50,
  /** オーバーレイ（カレンダーピッカー、サイドメニュー等） */
  overlay: 100,
  /** モーダルダイアログ */
  modal: 1000,
  /** トースト通知 */
  toast: 9000,
  /** ツールチップ */
  tooltip: 9500,
  /** フォーカスマネージャー等の最上位要素 */
  focus: 99999,
} as const;

export type ZIndexLevel = keyof typeof Z_INDEX;
