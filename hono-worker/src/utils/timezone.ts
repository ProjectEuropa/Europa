/**
 * タイムゾーン関連のユーティリティ関数
 *
 * アプリケーション全体でJST（日本標準時）を一貫して扱うためのヘルパー関数を提供します。
 */

/**
 * 現在時刻をJST（日本標準時）で取得
 *
 * Intl.DateTimeFormatを使用してタイムゾーン変換を行うため、
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
 * 2. Intl.DateTimeFormatでAsia/Tokyoタイムゾーンに変換
 * 3. formatToPartsで各時刻要素を取得し、ISO形式の文字列を構築
 * 4. 構築された文字列からDateオブジェクトを生成
 *
 * hourCycle: 'h23'により、時刻は常に00-23の範囲でフォーマットされ、
 * 深夜0時が'24'になることによるInvalid Dateエラーを防ぎます。
 */
export function getCurrentJstTime(): Date {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    hourCycle: 'h23'
  });

  const parts = formatter.formatToParts(new Date());
  const values = Object.fromEntries(
    parts
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value }) => [type, value])
  );

  return new Date(`${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}`);
}
