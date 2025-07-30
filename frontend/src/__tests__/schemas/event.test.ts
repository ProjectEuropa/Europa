import { describe, expect, it } from 'vitest';
import { type EventFormData, eventSchema } from '@/schemas/event';

describe('eventSchema', () => {
  const validEventData: EventFormData = {
    name: 'テストイベント',
    details: 'これはテストイベントの詳細です。',
    url: 'https://example.com',
    deadline: '2024-12-31',
    endDisplayDate: '2025-01-15',
    type: 'tournament',
  };

  describe('name validation', () => {
    it('should accept valid name', () => {
      const result = eventSchema.safeParse(validEventData);
      expect(result.success).toBe(true);
    });

    it('should reject empty name', () => {
      const data = { ...validEventData, name: '' };
      const result = eventSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'イベント名を入力してください'
        );
      }
    });

    it('should reject name longer than 100 characters', () => {
      const data = { ...validEventData, name: 'a'.repeat(101) };
      const result = eventSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'イベント名は100文字以内で入力してください'
        );
      }
    });
  });

  describe('details validation', () => {
    it('should accept valid details', () => {
      const result = eventSchema.safeParse(validEventData);
      expect(result.success).toBe(true);
    });

    it('should reject empty details', () => {
      const data = { ...validEventData, details: '' };
      const result = eventSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('詳細を入力してください');
      }
    });

    it('should reject details longer than 1000 characters', () => {
      const data = { ...validEventData, details: 'a'.repeat(1001) };
      const result = eventSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          '詳細は1000文字以内で入力してください'
        );
      }
    });
  });

  describe('url validation', () => {
    it('should accept valid URL', () => {
      const data = { ...validEventData, url: 'https://example.com' };
      const result = eventSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should accept empty string URL', () => {
      const data = { ...validEventData, url: '' };
      const result = eventSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should accept undefined URL', () => {
      const { url, ...dataWithoutUrl } = validEventData;
      const result = eventSchema.safeParse(dataWithoutUrl);
      expect(result.success).toBe(true);
    });

    it('should reject invalid URL', () => {
      const data = { ...validEventData, url: 'invalid-url' };
      const result = eventSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        // Zodのデフォルトメッセージまたはカスタムメッセージを確認
        const urlError = result.error.issues.find(issue =>
          issue.path.includes('url')
        );
        expect(urlError).toBeDefined();
        expect(urlError?.message).toMatch(/Invalid|有効なURL/);
      }
    });
  });

  describe('deadline validation', () => {
    it('should accept valid date format', () => {
      const data = { ...validEventData, deadline: '2024-12-31' };
      const result = eventSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject invalid date format', () => {
      const data = { ...validEventData, deadline: '31/12/2024' };
      const result = eventSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          '日付はYYYY-MM-DD形式で入力してください'
        );
      }
    });

    it('should reject incomplete date', () => {
      const data = { ...validEventData, deadline: '2024-12' };
      const result = eventSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('endDisplayDate validation', () => {
    it('should accept valid date format', () => {
      const data = { ...validEventData, endDisplayDate: '2025-01-15' };
      const result = eventSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject invalid date format', () => {
      const data = { ...validEventData, endDisplayDate: '15/01/2025' };
      const result = eventSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          '日付はYYYY-MM-DD形式で入力してください'
        );
      }
    });
  });

  describe('type validation', () => {
    it('should accept valid event types', () => {
      const types = ['tournament', 'community', 'update', 'other'] as const;

      types.forEach(type => {
        const data = { ...validEventData, type };
        const result = eventSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid event type', () => {
      const data = { ...validEventData, type: 'invalid' as any };
      const result = eventSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('complete validation', () => {
    it('should validate complete valid event data', () => {
      const result = eventSchema.safeParse(validEventData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validEventData);
      }
    });

    it('should handle multiple validation errors', () => {
      const invalidData = {
        name: '',
        details: '',
        url: 'invalid-url',
        deadline: 'invalid-date',
        endDisplayDate: 'invalid-date',
        type: 'invalid' as any,
      };

      const result = eventSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(1);
      }
    });
  });
});
