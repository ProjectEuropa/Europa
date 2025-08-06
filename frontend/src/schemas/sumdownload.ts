import { z } from 'zod';

/**
 * 一括ダウンロード検索フォームのバリデーションスキーマ
 */
export const sumDownloadSearchSchema = z.object({
  query: z
    .string()
    .max(100, '検索クエリは100文字以内で入力してください')
    .optional()
    .default(''),
});

/**
 * 一括ダウンロード実行のバリデーションスキーマ
 */
export const sumDownloadExecuteSchema = z.object({
  checkedId: z
    .array(z.number().int().positive())
    .min(1, '少なくとも1つのファイルを選択してください')
    .max(50, '一度に選択できるファイルは50個までです'),
});

/**
 * ページネーションのバリデーションスキーマ
 */
export const sumDownloadPaginationSchema = z.object({
  page: z
    .number()
    .int()
    .min(1, 'ページ番号は1以上である必要があります')
    .default(1),
  keyword: z
    .string()
    .max(100, '検索キーワードは100文字以内で入力してください')
    .default(''),
});

// 型推論
export type SumDownloadSearchFormData = z.infer<typeof sumDownloadSearchSchema>;
export type SumDownloadExecuteFormData = z.infer<
  typeof sumDownloadExecuteSchema
>;
export type SumDownloadPaginationData = z.infer<
  typeof sumDownloadPaginationSchema
>;
