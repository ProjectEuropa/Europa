/**
 * ファイル関連のバリデーションスキーマ
 */

import { z } from 'zod';

// 日付バリデーション用の正規表現（YYYY-MM-DD形式）
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// ファイルアップロードの共通スキーマ
const baseFileUploadSchema = z.object({
  ownerName: z
    .string()
    .min(1, 'オーナー名を入力してください')
    .max(50, 'オーナー名は50文字以内で入力してください'),
  comment: z
    .string()
    .max(500, 'コメントは500文字以内で入力してください')
    .optional(),
  tags: z.array(z.string()).max(5, '検索タグは5つまで設定できます').optional(),
  deletePassword: z
    .string()
    .max(50, '削除パスワードは50文字以内で入力してください')
    .optional(),
  downloadDate: z
    .string()
    .regex(dateRegex, '日付はYYYY-MM-DD形式で入力してください')
    .optional(),
});

// チームファイルアップロードスキーマ
export const teamFileUploadSchema = baseFileUploadSchema.extend({
  file: z
    .instanceof(File)
    .refine(file => file.size <= 10 * 1024 * 1024, {
      message: 'ファイルサイズは10MB以下にしてください',
    })
    .refine(
      file => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        return ['oke', 'zip'].includes(extension || '');
      },
      {
        message: 'OKEファイルまたはZIPファイルのみアップロード可能です',
      }
    ),
});

// マッチファイルアップロードスキーマ
export const matchFileUploadSchema = baseFileUploadSchema.extend({
  file: z
    .instanceof(File)
    .refine(file => file.size <= 10 * 1024 * 1024, {
      message: 'ファイルサイズは10MB以下にしてください',
    })
    .refine(
      file => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        return ['oke', 'zip'].includes(extension || '');
      },
      {
        message: 'OKEファイルまたはZIPファイルのみアップロード可能です',
      }
    ),
});

// ファイル削除スキーマ
export const fileDeleteSchema = z.object({
  id: z.number(),
  deletePassword: z.string().optional(),
});

// 一括ダウンロードスキーマ
export const sumDownloadSchema = z.object({
  checkedId: z
    .array(z.number())
    .min(1, '少なくとも1つのファイルを選択してください'),
});

// 型推論
export type TeamFileUploadFormData = z.infer<typeof teamFileUploadSchema>;
export type MatchFileUploadFormData = z.infer<typeof matchFileUploadSchema>;
export type FileDeleteFormData = z.infer<typeof fileDeleteSchema>;
export type SumDownloadFormData = z.infer<typeof sumDownloadSchema>;
