/**
 * イベント関連のバリデーションスキーマ
 */

import { z } from 'zod';

// 日付バリデーション用の正規表現（YYYY-MM-DD形式）
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// イベントタイプの定数定義（内部値は英語、表示用は日本語）
export const EVENT_TYPES = {
  tournament: '大会',
  announcement: '告知',
  other: 'その他',
} as const;

export type EventType = keyof typeof EVENT_TYPES;
export type EventTypeDisplay = (typeof EVENT_TYPES)[EventType];

// イベントタイプの選択肢（内部値）
export const EVENT_TYPE_OPTIONS = Object.keys(EVENT_TYPES) as EventType[];

// 表示用の選択肢を取得する関数
export const getEventTypeDisplay = (type: EventType): EventTypeDisplay =>
  EVENT_TYPES[type];

// 表示値から内部値を取得する関数
export const getEventTypeFromDisplay = (
  display: EventTypeDisplay
): EventType => {
  const entry = Object.entries(EVENT_TYPES).find(
    ([, value]) => value === display
  );
  return (entry?.[0] as EventType) || 'other';
};

export const eventSchema = z.object({
  name: z
    .string()
    .min(1, 'イベント名を入力してください')
    .max(100, 'イベント名は100文字以内で入力してください'),
  details: z
    .string()
    .min(1, '詳細を入力してください')
    .max(1000, '詳細は1000文字以内で入力してください'),
  url: z
    .string()
    .optional()
    .refine(val => !val || z.string().url().safeParse(val).success, {
      message: '有効なURLを入力してください',
    }),
  deadline: z
    .string()
    .regex(dateRegex, '日付はYYYY-MM-DD形式で入力してください'),
  endDisplayDate: z
    .string()
    .regex(dateRegex, '日付はYYYY-MM-DD形式で入力してください'),
  type: z.enum(['tournament', 'announcement', 'other'] as const),
});

// 型推論
export type EventFormData = z.infer<typeof eventSchema>;
