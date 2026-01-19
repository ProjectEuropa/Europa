import { describe, it, expect } from 'vitest';
import {
    createEventEmbed,
    createEventMessage,
    createSuccessMessage,
    createErrorMessage,
} from './embed';

describe('createEventEmbed', () => {
    it('正しいEmbed構造を生成する', () => {
        const embed = createEventEmbed({
            eventName: 'テスト大会',
            eventDetails: '詳細情報です',
            eventDeadline: '2025-12-31',
            eventDisplayEnd: '2026-01-15',
            registeredBy: 'TestUser',
        });

        expect(embed.title).toContain('テスト大会');
        expect(embed.description).toBe('詳細情報です');
        expect(embed.color).toBeDefined();
        expect(embed.fields).toBeDefined();
        expect(embed.fields?.length).toBeGreaterThan(0);
    });

    it('締切日と表示最終日のフィールドを含む', () => {
        const embed = createEventEmbed({
            eventName: 'テスト',
            eventDetails: '詳細',
            eventDeadline: '2025-12-31',
            eventDisplayEnd: '2026-01-15',
            registeredBy: 'User',
        });

        const deadlineField = embed.fields?.find(f => f.name.includes('締切'));
        const displayEndField = embed.fields?.find(f => f.name.includes('表示'));

        expect(deadlineField).toBeDefined();
        expect(deadlineField?.value).toContain('2025-12-31');
        expect(displayEndField).toBeDefined();
        expect(displayEndField?.value).toContain('2026-01-15');
    });

    it('登録者名をフッターに含む', () => {
        const embed = createEventEmbed({
            eventName: 'テスト',
            eventDetails: '詳細',
            eventDeadline: '2025-12-31',
            eventDisplayEnd: '2026-01-15',
            registeredBy: 'SpecialUser',
        });

        expect(embed.footer?.text).toContain('SpecialUser');
    });
});

describe('createEventMessage', () => {
    it('embedsを含むメッセージオブジェクトを生成する', () => {
        const message = createEventMessage({
            eventName: 'テスト大会',
            eventDetails: '詳細情報',
            eventDeadline: '2025-12-31',
            eventDisplayEnd: '2026-01-15',
            registeredBy: 'TestUser',
        });

        expect(message.embeds).toBeDefined();
        expect(message.embeds?.length).toBe(1);
        expect(message.embeds?.[0].title).toContain('テスト大会');
    });
});

describe('createSuccessMessage', () => {
    it('大会名を含む成功メッセージを生成する', () => {
        const message = createSuccessMessage('Europa杯');
        expect(message).toContain('Europa杯');
        expect(message).toMatch(/✅|成功|登録/);
    });
});

describe('createErrorMessage', () => {
    it('単一のエラーメッセージを生成する', () => {
        const message = createErrorMessage(['エラーが発生しました']);
        expect(message).toContain('エラーが発生しました');
        expect(message).toMatch(/❌|エラー/);
    });

    it('複数のエラーメッセージを生成する', () => {
        const errors = ['エラー1', 'エラー2', 'エラー3'];
        const message = createErrorMessage(errors);

        errors.forEach(error => {
            expect(message).toContain(error);
        });
    });

    it('空の配列でも処理できる', () => {
        const message = createErrorMessage([]);
        expect(typeof message).toBe('string');
    });
});
