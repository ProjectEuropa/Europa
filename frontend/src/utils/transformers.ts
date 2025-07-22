/**
 * APIレスポンスの型変換ユーティリティ
 */

import type { SnakeToCamelObject } from '@/types/utils';

/**
 * スネークケースのオブジェクトをキャメルケースに変換
 */
export function snakeToCamel<T extends object>(obj: T): SnakeToCamelObject<T> {
  if (obj === null || typeof obj !== 'object') {
    return obj as any;
  }

  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel) as any;
  }

  return Object.entries(obj).reduce((result, [key, value]) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

    result[camelKey as keyof typeof result] =
      value !== null && typeof value === 'object'
        ? snakeToCamel(value as object)
        : value;

    return result;
  }, {} as SnakeToCamelObject<T>);
}

/**
 * 日付文字列をフォーマット
 */
export function formatDate(dateString: string, format: string = 'YYYY-MM-DD'): string {
  if (!dateString) return '';

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return dateString;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 日付を相対表示（〜日前など）に変換
 */
export function relativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffYear > 0) return `${diffYear}年前`;
  if (diffMonth > 0) return `${diffMonth}ヶ月前`;
  if (diffDay > 0) return `${diffDay}日前`;
  if (diffHour > 0) return `${diffHour}時間前`;
  if (diffMin > 0) return `${diffMin}分前`;
  return '今すぐ';
}
