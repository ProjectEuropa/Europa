import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMessageLink } from './api';

// fetchのモック
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('createMessageLink', () => {
    it('正しいDiscordメッセージリンクを生成する', () => {
        const result = createMessageLink('123456789', '987654321', '111222333');
        expect(result).toBe('https://discord.com/channels/123456789/987654321/111222333');
    });

    it('異なるIDでも正しいリンクを生成する', () => {
        const result = createMessageLink('guild123', 'channel456', 'message789');
        expect(result).toBe('https://discord.com/channels/guild123/channel456/message789');
    });
});

describe('postMessage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Discord APIに正しいリクエストを送信する', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ id: '123', content: 'test' }),
        });

        const { postMessage } = await import('./api');
        const message = { content: 'Hello Discord!' };
        const result = await postMessage('bot-token', 'channel-id', message);

        expect(mockFetch).toHaveBeenCalledWith(
            'https://discord.com/api/v10/channels/channel-id/messages',
            expect.objectContaining({
                method: 'POST',
                headers: {
                    Authorization: 'Bot bot-token',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            })
        );
        // signal（タイムアウト用）が含まれていることを確認
        expect(mockFetch.mock.calls[0][1]).toHaveProperty('signal');
        expect(result).toEqual({ id: '123', content: 'test' });
    });

    it('APIエラー時に例外を投げる', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 401,
            text: () => Promise.resolve('Unauthorized'),
        });

        const { postMessage } = await import('./api');
        await expect(
            postMessage('invalid-token', 'channel-id', { content: 'test' })
        ).rejects.toThrow('Discord API error: 401 - Unauthorized');
    });
});

describe('deleteMessage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Discord APIに正しいDELETEリクエストを送信する', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
        });

        const { deleteMessage } = await import('./api');
        await deleteMessage('bot-token', 'channel-id', 'message-id');

        expect(mockFetch).toHaveBeenCalledWith(
            'https://discord.com/api/v10/channels/channel-id/messages/message-id',
            expect.objectContaining({
                method: 'DELETE',
                headers: {
                    Authorization: 'Bot bot-token',
                },
            })
        );
        // signal（タイムアウト用）が含まれていることを確認
        expect(mockFetch.mock.calls[0][1]).toHaveProperty('signal');
    });

    it('404エラーは無視する（既に削除済み）', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 404,
            text: () => Promise.resolve('Not Found'),
        });

        const { deleteMessage } = await import('./api');
        // エラーを投げないことを確認
        await expect(
            deleteMessage('bot-token', 'channel-id', 'message-id')
        ).resolves.toBeUndefined();
    });

    it('404以外のエラーはエラーを投げる', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 500,
            text: () => Promise.resolve('Internal Server Error'),
        });

        const { deleteMessage } = await import('./api');
        await expect(deleteMessage('bot-token', 'channel-id', 'message-id')).rejects.toThrow(
            'Failed to delete Discord message: 500 - Internal Server Error'
        );
    });
});

describe('registerGuildCommands', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Discord APIにPUTリクエストを送信する', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve([]),
        });

        const { registerGuildCommands } = await import('./api');
        await registerGuildCommands('bot-token', 'app-id', 'guild-id');

        expect(mockFetch).toHaveBeenCalledWith(
            'https://discord.com/api/v10/applications/app-id/guilds/guild-id/commands',
            expect.objectContaining({
                method: 'PUT',
                headers: {
                    Authorization: 'Bot bot-token',
                    'Content-Type': 'application/json',
                },
            })
        );
    });

    it('コマンド登録に失敗した場合エラーを投げる', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 403,
            text: () => Promise.resolve('Forbidden'),
        });

        const { registerGuildCommands } = await import('./api');
        await expect(registerGuildCommands('bot-token', 'app-id', 'guild-id')).rejects.toThrow(
            'Failed to register commands: 403 - Forbidden'
        );
    });
});
