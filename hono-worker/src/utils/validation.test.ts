import { describe, expect, it } from 'vitest';
import {
    eventQuerySchema,
    eventRegistrationSchema,
    fileQuerySchema,
    fileUploadSchema,
    loginSchema,
    passwordResetRequestSchema,
    passwordResetUpdateSchema,
    registerSchema,
} from './validation';

describe('validation schemas', () => {
    describe('registerSchema', () => {
        it('正常なユーザー登録データを検証する', () => {
            const validData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
            };

            const result = registerSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('名前が空の場合はエラーを返す', () => {
            const invalidData = {
                name: '',
                email: 'test@example.com',
                password: 'password123',
            };

            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Name is required');
            }
        });

        it('メールアドレスが無効な形式の場合はエラーを返す', () => {
            const invalidData = {
                name: 'Test User',
                email: 'invalid-email',
                password: 'password123',
            };

            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid email format');
            }
        });

        it('パスワードが8文字未満の場合はエラーを返す', () => {
            const invalidData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'short',
            };

            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(
                    'Password must be at least 8 characters'
                );
            }
        });

        it('名前が255文字を超える場合はエラーを返す', () => {
            const invalidData = {
                name: 'a'.repeat(256),
                email: 'test@example.com',
                password: 'password123',
            };

            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    describe('loginSchema', () => {
        it('正常なログインデータを検証する', () => {
            const validData = {
                email: 'test@example.com',
                password: 'password',
            };

            const result = loginSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('メールアドレスが無効な形式の場合はエラーを返す', () => {
            const invalidData = {
                email: 'invalid-email',
                password: 'password',
            };

            const result = loginSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid email format');
            }
        });

        it('パスワードが空の場合はエラーを返す', () => {
            const invalidData = {
                email: 'test@example.com',
                password: '',
            };

            const result = loginSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Password is required');
            }
        });
    });

    describe('fileUploadSchema', () => {
        it('正常なファイルアップロードデータを検証する', () => {
            const validData = {
                comment: 'Test comment',
                tags: ['tag1', 'tag2'],
            };

            const result = fileUploadSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('コメントとタグがない場合も有効', () => {
            const validData = {};

            const result = fileUploadSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('コメントが1000文字を超える場合はエラーを返す', () => {
            const invalidData = {
                comment: 'a'.repeat(1001),
            };

            const result = fileUploadSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('タグが10個を超える場合はエラーを返す', () => {
            const invalidData = {
                tags: Array(11).fill('tag'),
            };

            const result = fileUploadSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('タグの要素が255文字を超える場合はエラーを返す', () => {
            const invalidData = {
                tags: ['a'.repeat(256)],
            };

            const result = fileUploadSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    describe('eventQuerySchema', () => {
        it('正常なクエリパラメータを検証する', () => {
            const validData = {
                page: '1',
                limit: '20',
            };

            const result = eventQuerySchema.safeParse(validData);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.page).toBe(1);
                expect(result.data.limit).toBe(20);
            }
        });

        it('ページとリミットがない場合も有効', () => {
            const validData = {};

            const result = eventQuerySchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('ページが数値形式でない場合はエラーを返す', () => {
            const invalidData = {
                page: 'abc',
            };

            const result = eventQuerySchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('リミットが数値形式でない場合はエラーを返す', () => {
            const invalidData = {
                limit: 'xyz',
            };

            const result = eventQuerySchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    describe('eventRegistrationSchema', () => {
        it('正常なイベント登録データを検証する', () => {
            const validData = {
                name: 'Test Event',
                details: 'Event details',
                url: 'https://example.com',
                type: '1',
                deadline: '2025-12-31T23:59:59.000Z',
                endDisplayDate: '2026-01-31T23:59:59.000Z',
            };

            const result = eventRegistrationSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('URLが空文字列の場合も有効', () => {
            const validData = {
                name: 'Test Event',
                details: 'Event details',
                url: '',
                type: '1',
                deadline: '2025-12-31T23:59:59.000Z',
                endDisplayDate: '2026-01-31T23:59:59.000Z',
            };

            const result = eventRegistrationSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('URLがない場合も有効', () => {
            const validData = {
                name: 'Test Event',
                details: 'Event details',
                type: '1',
                deadline: '2025-12-31T23:59:59.000Z',
                endDisplayDate: '2026-01-31T23:59:59.000Z',
            };

            const result = eventRegistrationSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('名前が空の場合はエラーを返す', () => {
            const invalidData = {
                name: '',
                details: 'Event details',
                type: '1',
                deadline: '2025-12-31T23:59:59.000Z',
                endDisplayDate: '2026-01-31T23:59:59.000Z',
            };

            const result = eventRegistrationSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('詳細が空の場合はエラーを返す', () => {
            const invalidData = {
                name: 'Test Event',
                details: '',
                type: '1',
                deadline: '2025-12-31T23:59:59.000Z',
                endDisplayDate: '2026-01-31T23:59:59.000Z',
            };

            const result = eventRegistrationSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('URLが無効な形式の場合はエラーを返す', () => {
            const invalidData = {
                name: 'Test Event',
                details: 'Event details',
                url: 'invalid-url',
                type: '1',
                deadline: '2025-12-31T23:59:59.000Z',
                endDisplayDate: '2026-01-31T23:59:59.000Z',
            };

            const result = eventRegistrationSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('イベントタイプが1または2でない場合はエラーを返す', () => {
            const invalidData = {
                name: 'Test Event',
                details: 'Event details',
                type: '3',
                deadline: '2025-12-31T23:59:59.000Z',
                endDisplayDate: '2026-01-31T23:59:59.000Z',
            };

            const result = eventRegistrationSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('締切日時が無効な形式の場合はエラーを返す', () => {
            const invalidData = {
                name: 'Test Event',
                details: 'Event details',
                type: '1',
                deadline: '2025-12-31',
                endDisplayDate: '2026-01-31T23:59:59.000Z',
            };

            const result = eventRegistrationSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('表示終了日時が締切日時より前の場合はエラーを返す', () => {
            const invalidData = {
                name: 'Test Event',
                details: 'Event details',
                type: '1',
                deadline: '2026-12-31T23:59:59.000Z',
                endDisplayDate: '2025-01-31T23:59:59.000Z',
            };

            const result = eventRegistrationSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(
                    'End display date must be after deadline'
                );
            }
        });

        it('表示終了日時と締切日時が同じ場合は有効', () => {
            const validData = {
                name: 'Test Event',
                details: 'Event details',
                type: '1',
                deadline: '2025-12-31T23:59:59.000Z',
                endDisplayDate: '2025-12-31T23:59:59.000Z',
            };

            const result = eventRegistrationSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });
    });

    describe('fileQuerySchema', () => {
        it('正常なファイルクエリパラメータを検証する', () => {
            const validData = {
                page: '1',
                limit: '10',
                tag: 'test-tag',
                upload_user_id: '123',
                mine: 'true',
                keyword: 'search term',
                data_type: '1',
            };

            const result = fileQuerySchema.safeParse(validData);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.page).toBe(1);
                expect(result.data.limit).toBe(10);
                expect(result.data.upload_user_id).toBe(123);
            }
        });

        it('すべてのパラメータがオプショナル', () => {
            const validData = {};

            const result = fileQuerySchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('data_typeが1または2でない場合はエラーを返す', () => {
            const invalidData = {
                data_type: '3',
            };

            const result = fileQuerySchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('upload_user_idが数値形式でない場合はエラーを返す', () => {
            const invalidData = {
                upload_user_id: 'abc',
            };

            const result = fileQuerySchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('キーワードが255文字を超える場合はエラーを返す', () => {
            const invalidData = {
                keyword: 'a'.repeat(256),
            };

            const result = fileQuerySchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    describe('passwordResetRequestSchema', () => {
        it('正常なパスワードリセット要求データを検証する', () => {
            const validData = {
                email: 'test@example.com',
            };

            const result = passwordResetRequestSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('メールアドレスが無効な形式の場合はエラーを返す', () => {
            const invalidData = {
                email: 'invalid-email',
            };

            const result = passwordResetRequestSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid email format');
            }
        });

        it('メールアドレスが255文字を超える場合はエラーを返す', () => {
            const invalidData = {
                email: 'a'.repeat(250) + '@test.com',
            };

            const result = passwordResetRequestSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    describe('passwordResetUpdateSchema', () => {
        it('正常なパスワードリセット更新データを検証する', () => {
            const validData = {
                token: 'a'.repeat(32),
                password: 'newpassword123',
            };

            const result = passwordResetUpdateSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('トークンが32文字未満の場合はエラーを返す', () => {
            const invalidData = {
                token: 'short',
                password: 'newpassword123',
            };

            const result = passwordResetUpdateSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid token');
            }
        });

        it('トークンが32文字を超える場合はエラーを返す', () => {
            const invalidData = {
                token: 'a'.repeat(33),
                password: 'newpassword123',
            };

            const result = passwordResetUpdateSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('パスワードが8文字未満の場合はエラーを返す', () => {
            const invalidData = {
                token: 'a'.repeat(32),
                password: 'short',
            };

            const result = passwordResetUpdateSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(
                    'Password must be at least 8 characters'
                );
            }
        });

        it('パスワードが255文字を超える場合はエラーを返す', () => {
            const invalidData = {
                token: 'a'.repeat(32),
                password: 'a'.repeat(256),
            };

            const result = passwordResetUpdateSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });
});
