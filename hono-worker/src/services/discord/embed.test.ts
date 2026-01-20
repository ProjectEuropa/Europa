import { describe, expect, it } from 'vitest';
import {
    createErrorMessage,
    createEventEmbed,
    createEventMessage,
    createSuccessMessage,
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

describe('Discordマークダウンインジェクション防止', () => {
    describe('createEventEmbed', () => {
        it('タイトル内の太字マークダウン(**text**)をエスケープする', () => {
            const embed = createEventEmbed({
                eventName: '**悪意のある太字**',
                eventDetails: '詳細',
                eventDeadline: '2025-12-31',
                eventDisplayEnd: '2026-01-15',
                registeredBy: 'User',
            });

            // **がエスケープされて\*\*になることを確認
            expect(embed.title).not.toContain('**悪意');
            expect(embed.title).toContain('\\*\\*悪意のある太字\\*\\*');
        });

        it('説明文内のイタリックマークダウン(*text*)をエスケープする', () => {
            const embed = createEventEmbed({
                eventName: 'テスト',
                eventDetails: '*イタリック攻撃*',
                eventDeadline: '2025-12-31',
                eventDisplayEnd: '2026-01-15',
                registeredBy: 'User',
            });

            // エスケープ後は \*イタリック攻撃\* となる
            // 未エスケープの単独 * がないことを確認（\*は許容）
            expect(embed.description).toContain('\\*イタリック攻撃\\*');
            // 元のマークダウンパターン *text* が残っていないことを確認
            expect(embed.description).not.toMatch(/(?<!\\)\*[^*]+(?<!\\)\*/);
        });

        it('アンダースコア(_text_)をエスケープする', () => {
            const embed = createEventEmbed({
                eventName: '_アンダースコア_',
                eventDetails: '詳細',
                eventDeadline: '2025-12-31',
                eventDisplayEnd: '2026-01-15',
                registeredBy: 'User',
            });

            expect(embed.title).toContain('\\_アンダースコア\\_');
        });

        it('コードブロック(`)をエスケープする', () => {
            const embed = createEventEmbed({
                eventName: '`コード`インジェクション',
                eventDetails: '詳細',
                eventDeadline: '2025-12-31',
                eventDisplayEnd: '2026-01-15',
                registeredBy: 'User',
            });

            expect(embed.title).toContain('\\`コード\\`');
        });

        it('取り消し線(~~text~~)をエスケープする', () => {
            const embed = createEventEmbed({
                eventName: '~~取り消し~~',
                eventDetails: '詳細',
                eventDeadline: '2025-12-31',
                eventDisplayEnd: '2026-01-15',
                registeredBy: 'User',
            });

            expect(embed.title).toContain('\\~\\~取り消し\\~\\~');
        });

        it('スポイラー(||text||)をエスケープする', () => {
            const embed = createEventEmbed({
                eventName: '||スポイラー||',
                eventDetails: '詳細',
                eventDeadline: '2025-12-31',
                eventDisplayEnd: '2026-01-15',
                registeredBy: 'User',
            });

            expect(embed.title).toContain('\\|\\|スポイラー\\|\\|');
        });

        it('バックスラッシュ(\\)をエスケープする', () => {
            const embed = createEventEmbed({
                eventName: 'パス\\パス',
                eventDetails: '詳細',
                eventDeadline: '2025-12-31',
                eventDisplayEnd: '2026-01-15',
                registeredBy: 'User',
            });

            expect(embed.title).toContain('パス\\\\パス');
        });

        it('複合的なマークダウン攻撃をエスケープする', () => {
            const maliciousInput = '**太字**_イタリック_`コード`~~取り消し~~||スポイラー||';
            const embed = createEventEmbed({
                eventName: maliciousInput,
                eventDetails: maliciousInput,
                eventDeadline: '2025-12-31',
                eventDisplayEnd: '2026-01-15',
                registeredBy: maliciousInput,
            });

            // 元のマークダウン文字がそのまま残っていないことを確認
            expect(embed.title).not.toMatch(/(?<!\\)\*\*/);
            expect(embed.description).not.toMatch(/(?<!\\)`/);
            expect(embed.footer?.text).not.toMatch(/(?<!\\)\|\|/);
        });

        it('フィールド値（締切日・表示最終日）もエスケープされる', () => {
            const embed = createEventEmbed({
                eventName: 'テスト',
                eventDetails: '詳細',
                eventDeadline: '**2025-12-31**',
                eventDisplayEnd: '*2026-01-15*',
                registeredBy: 'User',
            });

            const deadlineField = embed.fields?.find(f => f.name.includes('締切'));
            const displayEndField = embed.fields?.find(f => f.name.includes('表示'));

            expect(deadlineField?.value).toContain('\\*\\*2025-12-31\\*\\*');
            expect(displayEndField?.value).toContain('\\*2026-01-15\\*');
        });

        it('登録者名（フッター）もエスケープされる', () => {
            const embed = createEventEmbed({
                eventName: 'テスト',
                eventDetails: '詳細',
                eventDeadline: '2025-12-31',
                eventDisplayEnd: '2026-01-15',
                registeredBy: '**Admin** `sudo`',
            });

            expect(embed.footer?.text).toContain('\\*\\*Admin\\*\\*');
            expect(embed.footer?.text).toContain('\\`sudo\\`');
        });
    });

    describe('createSuccessMessage', () => {
        it('マークダウン文字をエスケープする', () => {
            const message = createSuccessMessage('**太字大会**');
            expect(message).toContain('\\*\\*太字大会\\*\\*');
            expect(message).not.toMatch(/(?<!\\)\*\*太字/);
        });
    });
});
