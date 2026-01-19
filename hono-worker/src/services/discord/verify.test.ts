import { describe, it, expect, vi, beforeEach } from 'vitest';
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
            '1234567890',
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
            '1234567890',
            '{"type":1}'
        );

        expect(result).toBe(false);
    });

    it('不正なhex文字列でfalseを返す（奇数長）', async () => {
        const result = await verifyDiscordSignature(
            'abc', // 奇数長
            'abcd1234',
            '1234567890',
            '{"type":1}'
        );

        expect(result).toBe(false);
    });

    it('不正なhex文字列でfalseを返す（非hex文字）', async () => {
        const result = await verifyDiscordSignature(
            'ghij1234ghij1234ghij1234ghij1234', // 非hex文字を含む
            'abcd1234',
            '1234567890',
            '{"type":1}'
        );

        expect(result).toBe(false);
    });

    it('crypto.subtle.importKeyがエラーを投げた場合falseを返す', async () => {
        mockImportKey.mockRejectedValue(new Error('Import failed'));

        const result = await verifyDiscordSignature(
            'abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234',
            'abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234',
            '1234567890',
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
            '1234567890',
            '{"type":1}'
        );

        expect(result).toBe(false);
    });
});
