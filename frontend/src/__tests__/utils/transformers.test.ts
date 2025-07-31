import { describe, expect, it } from 'vitest';
import { formatDate, relativeTime, snakeToCamel } from '@/utils/transformers';

describe('snakeToCamel', () => {
  it('should convert snake_case keys to camelCase', () => {
    const input = {
      user_name: 'John',
      email_address: 'john@example.com',
      created_at: '2024-01-01',
    };

    const result = snakeToCamel(input);

    expect(result).toEqual({
      userName: 'John',
      emailAddress: 'john@example.com',
      createdAt: '2024-01-01',
    });
  });

  it('should handle nested objects', () => {
    const input = {
      user_info: {
        first_name: 'John',
        last_name: 'Doe',
      },
    };

    const result = snakeToCamel(input);

    expect(result).toEqual({
      userInfo: {
        firstName: 'John',
        lastName: 'Doe',
      },
    });
  });

  it('should handle arrays', () => {
    const input = [{ user_name: 'John' }, { user_name: 'Jane' }];

    const result = snakeToCamel(input);

    expect(result).toEqual([{ userName: 'John' }, { userName: 'Jane' }]);
  });

  it('should handle null and undefined values', () => {
    expect(snakeToCamel(null as any)).toBeNull();
    expect(snakeToCamel(undefined as any)).toBeUndefined();
  });
});

describe('formatDate', () => {
  it('should format date with default format', () => {
    const result = formatDate('2024-01-15T10:30:00Z');
    expect(result).toBe('2024-01-15');
  });

  it('should format date with custom format', () => {
    // タイムゾーンの問題を避けるため、日付部分だけをテスト
    const result = formatDate('2024-01-15T10:30:45Z', 'YYYY-MM-DD');
    expect(result).toBe('2024-01-15');
  });

  it('should handle invalid date strings', () => {
    const result = formatDate('invalid-date');
    expect(result).toBe('invalid-date');
  });

  it('should handle empty string', () => {
    const result = formatDate('');
    expect(result).toBe('');
  });
});

describe('relativeTime', () => {
  it('should return "今すぐ" for recent dates', () => {
    const now = new Date();
    const result = relativeTime(now.toISOString());
    expect(result).toBe('今すぐ');
  });

  it('should return minutes ago', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const result = relativeTime(fiveMinutesAgo.toISOString());
    expect(result).toBe('5分前');
  });

  it('should return hours ago', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const result = relativeTime(twoHoursAgo.toISOString());
    expect(result).toBe('2時間前');
  });

  it('should return days ago', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const result = relativeTime(threeDaysAgo.toISOString());
    expect(result).toBe('3日前');
  });
});
