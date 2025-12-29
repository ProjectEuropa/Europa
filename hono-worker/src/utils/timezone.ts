/**
 * タイムゾーン関連のユーティリティ関数
 *
 * アプリケーション全体でJST（日本標準時）を一貫して扱うためのヘルパー関数を提供します。
 */

/**
 * 現在時刻をJST（日本標準時）で取得
 *
 * toLocaleStringを使用してタイムゾーン変換を行うため、
 * システムのタイムゾーン設定に依存せず、常に正確なJST時刻を返します。
 *
 * @returns 現在時刻のJST表現
 *
 * @example
 * ```typescript
 * const nowJst = getCurrentJstTime();
 * console.log(nowJst); // 日本時間の現在時刻
 * ```
 *
 * @remarks
 * この関数は以下の手順でJST時刻を取得します：
 * 1. 現在のUTC時刻を取得
 * 2. toLocaleStringでAsia/Tokyoタイムゾーンに変換
 * 3. 変換された文字列からDateオブジェクトを再構築
 *
 * これにより、手動でのオフセット計算（+9時間）による潜在的なバグを回避し、
 * より堅牢で保守しやすいコードを実現します。
 */
export function getCurrentJstTime(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
}
