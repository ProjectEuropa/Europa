import { beforeEach, describe, expect, it, vi } from 'vitest';
import { verifyDiscordSignature } from './verify';

// Web Crypto APIのモック
const mockVerify = vi.fn();
const mockImportKey = vi.fn();

vi.stubGlobal('crypto', {
    subtle: {
        importKey: mockImportKey,
        verify: mockVerify,
    },
});

// 現在時刻に近いタイムスタンプを生成するヘルパー
function getCurrentTimestamp(): string {
    return Math.floor(Date.now() / 1000).toString();
}

// 期限切れのタイムスタンプを生成するヘルパー（6分前）
function getExpiredTimestamp(): string {
    return Math.floor((Date.now() - 6 * 60 * 1000) / 1000).toString();
}

describe('verifyDiscordSignature', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('有効な署名を検証してtrueを返す', async () => {
        const mockCryptoKey = { type: 'public' };
        mockImportKey.mockResolvedValue(mockCryptoKey);
        mockVerify.mockResolvedValue(true);

        const result = await verifyDiscordSignature(
            'abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234',
            'abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234',
            getCurrentTimestamp(),
            '{"type":1}'
        );

        expect(result).toBe(true);
        expect(mockImportKey).toHaveBeenCalledWith(
            'raw',
            expect.any(ArrayBuffer),
            { name: 'Ed25519' },
            false,
            ['verify']
        );
        expect(mockVerify).toHaveBeenCalledWith(
            { name: 'Ed25519' },
            mockCryptoKey,
            expect.any(ArrayBuffer),
            expect.any(Uint8Array)
        );
    });

    it('無効な署名を検証してfalseを返す', async () => {
        const mockCryptoKey = { type: 'public' };
        mockImportKey.mockResolvedValue(mockCryptoKey);
        mockVerify.mockResolvedValue(false);

        const result = await verifyDiscordSignature(
            'abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234',
            'abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234',
            getCurrentTimestamp(),
            '{"type":1}'
        );

        expect(result).toBe(false);
    });

    it('期限切れのタイムスタンプでfalseを返す（リプレイ攻撃対策）', async () => {
        const mockCryptoKey = { type: 'public' };
        mockImportKey.mockResolvedValue(mockCryptoKey);
        mockVerify.mockResolvedValue(true);

        const result = await verifyDiscordSignature(
            'abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234',
            'abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234',
            getExpiredTimestamp(),
            '{"type":1}'
        );

        expect(result).toBe(false);
        // 署名検証まで到達しないことを確認
        expect(mockImportKey).not.toHaveBeenCalled();
    });

    it('無効なタイムスタンプ（NaN）でfalseを返す', async () => {
        const result = await verifyDiscordSignature(
            'abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234',
            'abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234',
            'invalid',
            '{"type":1}'
        );

        expect(result).toBe(false);
    });

    it('不正なhex文字列でfalseを返す（奇数長）', async () => {
        const result = await verifyDiscordSignature(
            'abc', // 奇数長
            'abcd1234',
            getCurrentTimestamp(),
            '{"type":1}'
        );

        expect(result).toBe(false);
    });

    it('不正なhex文字列でfalseを返す（非hex文字）', async () => {
        const result = await verifyDiscordSignature(
            'ghij1234ghij1234ghij1234ghij1234', // 非hex文字を含む
            'abcd1234',
            getCurrentTimestamp(),
            '{"type":1}'
        );

        expect(result).toBe(false);
    });

    it('crypto.subtle.importKeyがエラーを投げた場合falseを返す', async () => {
        mockImportKey.mockRejectedValue(new Error('Import failed'));

        const result = await verifyDiscordSignature(
            'abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234',
            'abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234',
            getCurrentTimestamp(),
            '{"type":1}'
        );

        expect(result).toBe(false);
    });

    it('crypto.subtle.verifyがエラーを投げた場合falseを返す', async () => {
        const mockCryptoKey = { type: 'public' };
        mockImportKey.mockResolvedValue(mockCryptoKey);
        mockVerify.mockRejectedValue(new Error('Verify failed'));

        const result = await verifyDiscordSignature(
            'abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234',
            'abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234',
            getCurrentTimestamp(),
            '{"type":1}'
        );

        expect(result).toBe(false);
    });
});
