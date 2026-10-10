import { describe, expect, it } from 'vitest';
import {
    generateOtpCode,
    generateSessionToken,
    hashOtpCode,
    maskEmail,
    OTP_CONFIG,
    verifyOtpCode,
} from './otp';

describe('OTP Utilities', () => {
    describe('generateOtpCode', () => {
        it('6桁の数字コードを生成する', () => {
            const code = generateOtpCode();
            expect(code).toMatch(/^\d{6}$/);
            expect(code.length).toBe(6);
        });

        it('連続して生成されたコードはランダムである', () => {
            const codes = new Set<string>();
            for (let i = 0; i < 20; i++) {
                codes.add(generateOtpCode());
            }
            // 20回生成して大半がユニークであることを確認
            expect(codes.size).toBeGreaterThan(15);
        });
    });

    describe('generateSessionToken', () => {
        it('空でない一意なセッショントークンを生成する', () => {
            const token1 = generateSessionToken();
            const token2 = generateSessionToken();
            expect(token1.length).toBeGreaterThan(10);
            expect(token1).not.toBe(token2);
        });
    });

    describe('hashOtpCode and verifyOtpCode', () => {
        it('正しいコードで照合が成功する', async () => {
            const code = '123456';
            const hash = await hashOtpCode(code);
            expect(hash).toHaveLength(64); // SHA-256 hex string

            const isValid = await verifyOtpCode(code, hash);
            expect(isValid).toBe(true);
        });

        it('誤ったコードで照合が失敗する', async () => {
            const code = '123456';
            const hash = await hashOtpCode(code);

            const isValid = await verifyOtpCode('654321', hash);
            expect(isValid).toBe(false);
        });
    });

    describe('maskEmail', () => {
        it('通常のアドレスを正しくマスクする', () => {
            expect(maskEmail('user@example.com')).toBe('u***r@example.com');
            expect(maskEmail('john.doe@test.co.jp')).toBe('j***e@test.co.jp');
        });

        it('短いアカウント名も適切にマスクする', () => {
            expect(maskEmail('me@domain.com')).toBe('m***@domain.com');
            expect(maskEmail('a@domain.com')).toBe('a***@domain.com');
        });
    });

    describe('OTP_CONFIG', () => {
        it('セキュリティ設定が要件を満たしている', () => {
            expect(OTP_CONFIG.EXPIRES_IN_SECONDS).toBe(600); // 10分
            expect(OTP_CONFIG.MAX_ATTEMPTS).toBe(5); // 5回
            expect(OTP_CONFIG.RESEND_COOLDOWN_SECONDS).toBe(60); // 60秒
        });
    });
});
