import { describe, it, expect } from 'vitest';
import {
    isValidDateFormat,
    validateEventFormData,
    extractModalValues,
    type EventRegistrationFormData,
} from './modals';
import { ComponentType } from '../../types/discord';

describe('isValidDateFormat', () => {
    describe('有効な日付形式', () => {
        it('正常なYYYY-MM-DD形式を受け入れる', () => {
            expect(isValidDateFormat('2025-01-15')).toBe(true);
            expect(isValidDateFormat('2025-12-31')).toBe(true);
            expect(isValidDateFormat('2024-02-29')).toBe(true); // うるう年
        });

        it('月初・月末の日付を受け入れる', () => {
            expect(isValidDateFormat('2025-01-01')).toBe(true);
            expect(isValidDateFormat('2025-01-31')).toBe(true);
            expect(isValidDateFormat('2025-04-30')).toBe(true);
        });
    });

    describe('無効な日付形式', () => {
        it('不正な形式を拒否する', () => {
            expect(isValidDateFormat('2025/01/15')).toBe(false);
            expect(isValidDateFormat('15-01-2025')).toBe(false);
            expect(isValidDateFormat('2025-1-15')).toBe(false);
            expect(isValidDateFormat('2025-01-5')).toBe(false);
        });

        it('存在しない日付を拒否する（ロールオーバー防止）', () => {
            expect(isValidDateFormat('2025-02-30')).toBe(false); // 2月30日
            expect(isValidDateFormat('2025-02-31')).toBe(false); // 2月31日
            expect(isValidDateFormat('2025-04-31')).toBe(false); // 4月31日
            expect(isValidDateFormat('2025-13-01')).toBe(false); // 13月
            expect(isValidDateFormat('2025-00-15')).toBe(false); // 0月
        });

        it('非うるう年の2月29日を拒否する', () => {
            expect(isValidDateFormat('2025-02-29')).toBe(false);
            expect(isValidDateFormat('2023-02-29')).toBe(false);
        });

        it('空文字や不正な入力を拒否する', () => {
            expect(isValidDateFormat('')).toBe(false);
            expect(isValidDateFormat('invalid')).toBe(false);
            expect(isValidDateFormat('2025-01-15extra')).toBe(false);
        });
    });
});

describe('validateEventFormData', () => {
    const validData: EventRegistrationFormData = {
        eventName: '第10回 Europa杯',
        eventDetails: '大会の詳細情報です。',
        eventDeadline: '2025-12-31',
        eventDisplayEnd: '2026-01-15',
    };

    describe('正常なデータ', () => {
        it('有効なフォームデータを検証する', () => {
            const result = validateEventFormData(validData);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('締切日と表示最終日が同じ場合も有効', () => {
            const data = { ...validData, eventDisplayEnd: '2025-12-31' };
            const result = validateEventFormData(data);
            expect(result.valid).toBe(true);
        });
    });

    describe('大会名のバリデーション', () => {
        it('空の大会名を拒否する', () => {
            const data = { ...validData, eventName: '' };
            const result = validateEventFormData(data);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('大会名は必須です');
        });

        it('100文字を超える大会名を拒否する', () => {
            const data = { ...validData, eventName: 'a'.repeat(101) };
            const result = validateEventFormData(data);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('大会名は100文字以内で入力してください');
        });

        it('100文字ちょうどの大会名を受け入れる', () => {
            const data = { ...validData, eventName: 'a'.repeat(100) };
            const result = validateEventFormData(data);
            expect(result.valid).toBe(true);
        });
    });

    describe('詳細のバリデーション', () => {
        it('空の詳細を拒否する', () => {
            const data = { ...validData, eventDetails: '' };
            const result = validateEventFormData(data);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('詳細は必須です');
        });

        it('1000文字を超える詳細を拒否する', () => {
            const data = { ...validData, eventDetails: 'a'.repeat(1001) };
            const result = validateEventFormData(data);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('詳細は1000文字以内で入力してください');
        });

        it('1000文字ちょうどの詳細を受け入れる', () => {
            const data = { ...validData, eventDetails: 'a'.repeat(1000) };
            const result = validateEventFormData(data);
            expect(result.valid).toBe(true);
        });
    });

    describe('日付のバリデーション', () => {
        it('不正な締切日形式を拒否する', () => {
            const data = { ...validData, eventDeadline: 'invalid' };
            const result = validateEventFormData(data);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('締切日はYYYY-MM-DD形式で入力してください');
        });

        it('不正な表示最終日形式を拒否する', () => {
            const data = { ...validData, eventDisplayEnd: '2026/01/15' };
            const result = validateEventFormData(data);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('表示最終日はYYYY-MM-DD形式で入力してください');
        });

        it('表示最終日が締切日より前の場合を拒否する', () => {
            const data = { ...validData, eventDeadline: '2025-12-31', eventDisplayEnd: '2025-12-15' };
            const result = validateEventFormData(data);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('表示最終日は締切日以降の日付を指定してください');
        });
    });

    describe('複数エラー', () => {
        it('複数のエラーを同時に返す', () => {
            const data: EventRegistrationFormData = {
                eventName: '',
                eventDetails: '',
                eventDeadline: 'invalid',
                eventDisplayEnd: 'invalid',
            };
            const result = validateEventFormData(data);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThanOrEqual(4);
        });
    });
});

describe('extractModalValues', () => {
    it('Modalコンポーネントから正しく値を抽出する', () => {
        const components = [
            {
                type: ComponentType.ACTION_ROW,
                components: [{ type: ComponentType.TEXT_INPUT, custom_id: 'event_name', value: 'テスト大会' }],
            },
            {
                type: ComponentType.ACTION_ROW,
                components: [{ type: ComponentType.TEXT_INPUT, custom_id: 'event_details', value: '詳細情報' }],
            },
            {
                type: ComponentType.ACTION_ROW,
                components: [{ type: ComponentType.TEXT_INPUT, custom_id: 'event_deadline', value: '2025-12-31' }],
            },
            {
                type: ComponentType.ACTION_ROW,
                components: [{ type: ComponentType.TEXT_INPUT, custom_id: 'event_display_end', value: '2026-01-15' }],
            },
        ];

        const result = extractModalValues(components);
        expect(result).toEqual({
            eventName: 'テスト大会',
            eventDetails: '詳細情報',
            eventDeadline: '2025-12-31',
            eventDisplayEnd: '2026-01-15',
        });
    });

    it('存在しないフィールドは空文字を返す', () => {
        const components = [
            {
                type: ComponentType.ACTION_ROW,
                components: [{ type: ComponentType.TEXT_INPUT, custom_id: 'event_name', value: 'テスト' }],
            },
        ];

        const result = extractModalValues(components);
        expect(result.eventName).toBe('テスト');
        expect(result.eventDetails).toBe('');
        expect(result.eventDeadline).toBe('');
        expect(result.eventDisplayEnd).toBe('');
    });

    it('空の配列を処理できる', () => {
        const result = extractModalValues([]);
        expect(result).toEqual({
            eventName: '',
            eventDetails: '',
            eventDeadline: '',
            eventDisplayEnd: '',
        });
    });
});
