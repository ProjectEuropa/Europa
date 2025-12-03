import { z } from 'zod';

// 認証関連のバリデーションスキーマ

export const registerSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    email: z.string().email('Invalid email format').max(255),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

// ファイル関連のバリデーションスキーマ

export const fileUploadSchema = z.object({
    comment: z.string().max(1000).optional(),
    tags: z.array(z.string().max(255)).max(10).optional(),
});

// イベント関連のバリデーションスキーマ

export const eventQuerySchema = z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export const eventRegistrationSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    details: z.string().min(1, 'Details are required').max(255),
    url: z.string().url('Invalid URL').max(255).optional().or(z.literal('')),
    type: z.enum(['1', '2']), // 1: 大会, 2: その他
    deadline: z.string().datetime(),
    endDisplayDate: z.string().datetime(),
}).refine(data => {
    const deadline = new Date(data.deadline);
    const endDisplayDate = new Date(data.endDisplayDate);
    return endDisplayDate >= deadline;
}, {
    message: "End display date must be after deadline",
    path: ["endDisplayDate"],
});

export const fileQuerySchema = z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    tag: z.string().max(255).optional(),
    upload_user_id: z.string().regex(/^\d+$/).transform(Number).optional(),
    mine: z.string().optional(),
    keyword: z.string().max(255).optional(), // ファイル名・コメント検索用
    data_type: z.string().regex(/^[12]$/).optional(), // チーム:1 or マッチ:2
});

// バリデーションヘルパー

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type EventQueryInput = z.infer<typeof eventQuerySchema>;
export type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>;

// パスワードリセット関連のバリデーションスキーマ

export const passwordResetRequestSchema = z.object({
    email: z.string().email('Invalid email format').max(255),
});

export const passwordResetUpdateSchema = z.object({
    token: z.string().min(32, 'Invalid token').max(32),
    password: z.string().min(8, 'Password must be at least 8 characters').max(255),
});

export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetUpdateInput = z.infer<typeof passwordResetUpdateSchema>;
export type FileQueryInput = z.infer<typeof fileQuerySchema>;
