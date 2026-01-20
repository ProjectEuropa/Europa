import { Hono } from 'hono';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FIELD_IDS, MODAL_IDS } from '../services/discord/modals';
import {
    ComponentType,
    InteractionResponseType,
    InteractionType,
    MESSAGE_FLAGS,
} from '../types/discord';

// モック
const mockVerifyDiscordSignature = vi.fn();
const mockPostMessage = vi.fn();
const mockDeleteMessage = vi.fn();
const mockNeon = vi.fn();

vi.mock('../services/discord/verify', () => ({
    verifyDiscordSignature: (...args: unknown[]) => mockVerifyDiscordSignature(...args),
}));

vi.mock('../services/discord/api', () => ({
    postMessage: (...args: unknown[]) => mockPostMessage(...args),
    deleteMessage: (...args: unknown[]) => mockDeleteMessage(...args),
    createMessageLink: (guildId: string, channelId: string, messageId: string) =>
        `https://discord.com/channels/${guildId}/${channelId}/${messageId}`,
}));

vi.mock('@neondatabase/serverless', () => ({
    neon: () => mockNeon,
}));

// テスト環境変数
const testEnv = {
    DISCORD_PUBLIC_KEY: 'test-public-key',
    DISCORD_BOT_TOKEN: 'test-bot-token',
    DISCORD_CHANNEL_ID: 'test-channel-id',
    DISCORD_GUILD_ID: 'test-guild-id',
    DISCORD_APPLICATION_ID: 'test-app-id',
    DATABASE_URL: 'postgres://test',
};

// 有効なタイムスタンプを生成
function getCurrentTimestamp(): string {
    return Math.floor(Date.now() / 1000).toString();
}

// テストヘルパー: PINGリクエストを作成
function createPingInteraction() {
    return {
        id: 'test-interaction-id',
        application_id: 'test-app-id',
        type: InteractionType.PING,
        token: 'test-token',
        version: 1,
    };
}

// テストヘルパー: スラッシュコマンドリクエストを作成
function createCommandInteraction(commandName: string) {
    return {
        id: 'test-interaction-id',
        application_id: 'test-app-id',
        type: InteractionType.APPLICATION_COMMAND,
        data: { name: commandName },
        guild_id: 'test-guild-id',
        channel_id: 'test-channel-id',
        member: {
            user: {
                id: 'user-123',
                username: 'testuser',
                discriminator: '0001',
                avatar: null,
                global_name: 'Test User',
            },
            roles: [],
            joined_at: '2024-01-01T00:00:00Z',
        },
        token: 'test-token',
        version: 1,
    };
}

// テストヘルパー: Modal送信リクエストを作成
function createModalSubmitInteraction(formData: {
    eventName: string;
    eventDetails: string;
    eventDeadline: string;
    eventDisplayEnd: string;
}) {
    return {
        id: 'test-interaction-id',
        application_id: 'test-app-id',
        type: InteractionType.MODAL_SUBMIT,
        data: {
            custom_id: MODAL_IDS.EVENT_REGISTRATION,
            components: [
                {
                    type: ComponentType.ACTION_ROW,
                    components: [
                        { type: ComponentType.TEXT_INPUT, custom_id: FIELD_IDS.EVENT_NAME, value: formData.eventName },
                    ],
                },
                {
                    type: ComponentType.ACTION_ROW,
                    components: [
                        { type: ComponentType.TEXT_INPUT, custom_id: FIELD_IDS.EVENT_DETAILS, value: formData.eventDetails },
                    ],
                },
                {
                    type: ComponentType.ACTION_ROW,
                    components: [
                        { type: ComponentType.TEXT_INPUT, custom_id: FIELD_IDS.EVENT_DEADLINE, value: formData.eventDeadline },
                    ],
                },
                {
                    type: ComponentType.ACTION_ROW,
                    components: [
                        { type: ComponentType.TEXT_INPUT, custom_id: FIELD_IDS.EVENT_DISPLAY_END, value: formData.eventDisplayEnd },
                    ],
                },
            ],
        },
        guild_id: 'test-guild-id',
        channel_id: 'test-channel-id',
        member: {
            user: {
                id: 'user-123',
                username: 'testuser',
                discriminator: '0001',
                avatar: null,
                global_name: 'Test User',
            },
            roles: [],
            joined_at: '2024-01-01T00:00:00Z',
        },
        token: 'test-token',
        version: 1,
    };
}

describe('Discord Interactions Endpoint', () => {
    let app: Hono;

    beforeEach(async () => {
        vi.clearAllMocks();
        // デフォルトで署名検証を成功させる
        mockVerifyDiscordSignature.mockResolvedValue(true);
        // モジュールを動的にインポート（モックがリセットされた後）
        vi.resetModules();
        const discordModule = await import('./discord');
        app = new Hono();
        app.route('/api/v2/discord', discordModule.default);
    });

    describe('署名検証', () => {
        it('署名ヘッダーがない場合は401を返す', async () => {
            const res = await app.request('/api/v2/discord/interactions', {
                method: 'POST',
                body: JSON.stringify(createPingInteraction()),
            }, testEnv);

            expect(res.status).toBe(401);
            const text = await res.text();
            expect(text).toContain('Missing signature headers');
        });

        it('署名が無効な場合は401を返す', async () => {
            mockVerifyDiscordSignature.mockResolvedValue(false);

            const res = await app.request('/api/v2/discord/interactions', {
                method: 'POST',
                headers: {
                    'X-Signature-Ed25519': 'invalid-signature',
                    'X-Signature-Timestamp': getCurrentTimestamp(),
                },
                body: JSON.stringify(createPingInteraction()),
            }, testEnv);

            expect(res.status).toBe(401);
            const text = await res.text();
            expect(text).toContain('Invalid signature');
        });

        it('有効な署名の場合は処理を継続する', async () => {
            mockVerifyDiscordSignature.mockResolvedValue(true);

            const res = await app.request('/api/v2/discord/interactions', {
                method: 'POST',
                headers: {
                    'X-Signature-Ed25519': 'valid-signature',
                    'X-Signature-Timestamp': getCurrentTimestamp(),
                },
                body: JSON.stringify(createPingInteraction()),
            }, testEnv);

            expect(res.status).toBe(200);
        });
    });

    describe('PING応答', () => {
        it('PINGに対してPONGを返す', async () => {
            const res = await app.request('/api/v2/discord/interactions', {
                method: 'POST',
                headers: {
                    'X-Signature-Ed25519': 'valid-signature',
                    'X-Signature-Timestamp': getCurrentTimestamp(),
                },
                body: JSON.stringify(createPingInteraction()),
            }, testEnv);

            expect(res.status).toBe(200);
            const json = await res.json();
            expect(json).toEqual({ type: InteractionResponseType.PONG });
        });
    });

    describe('スラッシュコマンド処理', () => {
        it('/大会登録 コマンドでModalを返す', async () => {
            const res = await app.request('/api/v2/discord/interactions', {
                method: 'POST',
                headers: {
                    'X-Signature-Ed25519': 'valid-signature',
                    'X-Signature-Timestamp': getCurrentTimestamp(),
                },
                body: JSON.stringify(createCommandInteraction('大会登録')),
            }, testEnv);

            expect(res.status).toBe(200);
            const json = await res.json();
            expect(json.type).toBe(InteractionResponseType.MODAL);
            expect(json.data.custom_id).toBe(MODAL_IDS.EVENT_REGISTRATION);
            expect(json.data.title).toBe('大会登録');
        });

        it('未知のコマンドではエラーメッセージを返す', async () => {
            const res = await app.request('/api/v2/discord/interactions', {
                method: 'POST',
                headers: {
                    'X-Signature-Ed25519': 'valid-signature',
                    'X-Signature-Timestamp': getCurrentTimestamp(),
                },
                body: JSON.stringify(createCommandInteraction('unknown_command')),
            }, testEnv);

            expect(res.status).toBe(200);
            const json = await res.json();
            expect(json.type).toBe(InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE);
            expect(json.data.content).toContain('不明なコマンド');
            expect(json.data.flags).toBe(MESSAGE_FLAGS.EPHEMERAL);
        });
    });

    describe('Modal送信処理', () => {
        it('有効なフォームデータでイベント登録が成功する', async () => {
            mockPostMessage.mockResolvedValue({ id: 'message-123' });
            mockNeon.mockResolvedValue([]);

            const formData = {
                eventName: 'テスト大会',
                eventDetails: 'テスト大会の詳細です',
                eventDeadline: '2026-02-01',
                eventDisplayEnd: '2026-02-15',
            };

            const res = await app.request('/api/v2/discord/interactions', {
                method: 'POST',
                headers: {
                    'X-Signature-Ed25519': 'valid-signature',
                    'X-Signature-Timestamp': getCurrentTimestamp(),
                },
                body: JSON.stringify(createModalSubmitInteraction(formData)),
            }, testEnv);

            expect(res.status).toBe(200);
            const json = await res.json();
            expect(json.type).toBe(InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE);
            expect(json.data.content).toContain('テスト大会');
            expect(json.data.content).toContain('登録しました');
            expect(json.data.flags).toBe(MESSAGE_FLAGS.EPHEMERAL);

            // Discord APIが呼ばれたことを確認
            expect(mockPostMessage).toHaveBeenCalledWith(
                'test-bot-token',
                'test-channel-id',
                expect.objectContaining({
                    content: expect.any(String),
                    embeds: expect.any(Array),
                })
            );

            // DB挿入が呼ばれたことを確認
            expect(mockNeon).toHaveBeenCalled();
        });

        it('無効な日付形式でバリデーションエラーを返す', async () => {
            const formData = {
                eventName: 'テスト大会',
                eventDetails: 'テスト大会の詳細です',
                eventDeadline: 'invalid-date',
                eventDisplayEnd: '2026-02-15',
            };

            const res = await app.request('/api/v2/discord/interactions', {
                method: 'POST',
                headers: {
                    'X-Signature-Ed25519': 'valid-signature',
                    'X-Signature-Timestamp': getCurrentTimestamp(),
                },
                body: JSON.stringify(createModalSubmitInteraction(formData)),
            }, testEnv);

            expect(res.status).toBe(200);
            const json = await res.json();
            expect(json.type).toBe(InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE);
            expect(json.data.content).toContain('YYYY-MM-DD形式');
            expect(json.data.flags).toBe(MESSAGE_FLAGS.EPHEMERAL);

            // Discord APIが呼ばれていないことを確認
            expect(mockPostMessage).not.toHaveBeenCalled();
        });

        it('表示最終日が締切日より前の場合バリデーションエラーを返す', async () => {
            const formData = {
                eventName: 'テスト大会',
                eventDetails: 'テスト大会の詳細です',
                eventDeadline: '2026-02-15',
                eventDisplayEnd: '2026-02-01', // 締切日より前
            };

            const res = await app.request('/api/v2/discord/interactions', {
                method: 'POST',
                headers: {
                    'X-Signature-Ed25519': 'valid-signature',
                    'X-Signature-Timestamp': getCurrentTimestamp(),
                },
                body: JSON.stringify(createModalSubmitInteraction(formData)),
            }, testEnv);

            expect(res.status).toBe(200);
            const json = await res.json();
            expect(json.type).toBe(InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE);
            expect(json.data.content).toContain('表示最終日は締切日以降');
            expect(json.data.flags).toBe(MESSAGE_FLAGS.EPHEMERAL);
        });

        it('DB挿入失敗時にロールバック（Discord投稿削除）を試みる', async () => {
            mockPostMessage.mockResolvedValue({ id: 'message-123' });
            mockNeon.mockRejectedValue(new Error('DB connection failed'));
            mockDeleteMessage.mockResolvedValue(undefined);

            const formData = {
                eventName: 'テスト大会',
                eventDetails: 'テスト大会の詳細です',
                eventDeadline: '2026-02-01',
                eventDisplayEnd: '2026-02-15',
            };

            const res = await app.request('/api/v2/discord/interactions', {
                method: 'POST',
                headers: {
                    'X-Signature-Ed25519': 'valid-signature',
                    'X-Signature-Timestamp': getCurrentTimestamp(),
                },
                body: JSON.stringify(createModalSubmitInteraction(formData)),
            }, testEnv);

            expect(res.status).toBe(200);
            const json = await res.json();
            expect(json.data.content).toContain('サーバーエラー');

            // ロールバックとしてメッセージ削除が呼ばれたことを確認
            expect(mockDeleteMessage).toHaveBeenCalledWith(
                'test-bot-token',
                'test-channel-id',
                'message-123'
            );
        });

        it('Discord投稿失敗時はエラーメッセージを返す', async () => {
            mockPostMessage.mockRejectedValue(new Error('Discord API error'));

            const formData = {
                eventName: 'テスト大会',
                eventDetails: 'テスト大会の詳細です',
                eventDeadline: '2026-02-01',
                eventDisplayEnd: '2026-02-15',
            };

            const res = await app.request('/api/v2/discord/interactions', {
                method: 'POST',
                headers: {
                    'X-Signature-Ed25519': 'valid-signature',
                    'X-Signature-Timestamp': getCurrentTimestamp(),
                },
                body: JSON.stringify(createModalSubmitInteraction(formData)),
            }, testEnv);

            expect(res.status).toBe(200);
            const json = await res.json();
            expect(json.data.content).toContain('サーバーエラー');
            expect(json.data.flags).toBe(MESSAGE_FLAGS.EPHEMERAL);
        });
    });

    describe('環境変数検証', () => {
        it('必須環境変数が不足している場合は500を返す', async () => {
            const incompleteEnv = {
                ...testEnv,
                DISCORD_PUBLIC_KEY: '', // 空
            };

            const res = await app.request('/api/v2/discord/interactions', {
                method: 'POST',
                headers: {
                    'X-Signature-Ed25519': 'valid-signature',
                    'X-Signature-Timestamp': getCurrentTimestamp(),
                },
                body: JSON.stringify(createPingInteraction()),
            }, incompleteEnv);

            expect(res.status).toBe(500);
            const text = await res.text();
            expect(text).toContain('Server configuration error');
        });
    });

    describe('未対応のInteractionタイプ', () => {
        it('未対応のタイプに対してエラーメッセージを返す', async () => {
            const unknownInteraction = {
                id: 'test-interaction-id',
                application_id: 'test-app-id',
                type: InteractionType.MESSAGE_COMPONENT, // 未対応のタイプ
                data: {},
                token: 'test-token',
                version: 1,
            };

            const res = await app.request('/api/v2/discord/interactions', {
                method: 'POST',
                headers: {
                    'X-Signature-Ed25519': 'valid-signature',
                    'X-Signature-Timestamp': getCurrentTimestamp(),
                },
                body: JSON.stringify(unknownInteraction),
            }, testEnv);

            expect(res.status).toBe(200);
            const json = await res.json();
            expect(json.type).toBe(InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE);
            expect(json.data.content).toContain('対応していません');
            expect(json.data.flags).toBe(MESSAGE_FLAGS.EPHEMERAL);
        });
    });
});

describe('Discord Register Commands Endpoint', () => {
    let app: Hono;

    beforeEach(async () => {
        vi.clearAllMocks();
        vi.resetModules();
        const discordModule = await import('./discord');
        app = new Hono();
        app.route('/api/v2/discord', discordModule.default);
    });

    it('INTERNAL_API_SECRETなしでは403を返す', async () => {
        const res = await app.request('/api/v2/discord/register-commands', {
            method: 'POST',
        }, { ...testEnv, INTERNAL_API_SECRET: 'secret123' });

        expect(res.status).toBe(403);
    });

    it('不正なシークレットでは403を返す', async () => {
        const res = await app.request('/api/v2/discord/register-commands', {
            method: 'POST',
            headers: {
                'X-Internal-Secret': 'wrong-secret',
            },
        }, { ...testEnv, INTERNAL_API_SECRET: 'secret123' });

        expect(res.status).toBe(403);
    });
});
