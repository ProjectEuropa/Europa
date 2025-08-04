/**
 * イベント関連のバリデーションスキーマ
 */

import { z } from 'zod';

// 日付バリデーション用の正規表現（YYYY-MM-DD形式）
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

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
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: '有効なURLを入力してください',
    }),
  deadline: z
    .string()
    .regex(dateRegex, '日付はYYYY-MM-DD形式で入力してください'),
  endDisplayDate: z
    .string()
    .regex(dateRegex, '日付はYYYY-MM-DD形式で入力してください'),
  type: z.enum(['大会', '告知', 'その他'] as const),
});

// 型推論
export type EventFormData = z.infer<typeof eventSchema>;
