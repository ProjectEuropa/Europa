import { describe, expect, it, vi } from 'vitest';
import { formatDownloadDateTime, formatUploadDateTime } from '@/utils/dateFormatters';

describe('dateFormatters', () => {
  describe('formatDownloadDateTime', () => {
    it('正常な日時文字列を正しくフォーマットする', () => {
      const dateString = '2023-01-01T00:00:00Z';
      const result = formatDownloadDateTime(dateString);
      expect(result).toBe('2023/01/01 09:00');
    });

    it('別の正常な日時文字列を正しくフォーマットする', () => {
      const dateString = '2023-12-31T15:30:45Z';
      const result = formatDownloadDateTime(dateString);
      expect(result).toBe('2024/01/01 00:30');
    });

    it('空文字列の場合は「未設定」を返す', () => {
      const result = formatDownloadDateTime('');
      expect(result).toBe('未設定');
    });

    it('null値の場合は「未設定」を返す', () => {
      const result = formatDownloadDateTime(null as any);
      expect(result).toBe('未設定');
    });

    it('undefined値の場合は「未設定」を返す', () => {
      const result = formatDownloadDateTime(undefined as any);
      expect(result).toBe('未設定');
    });

    it('無効な日時文字列の場合は「-」を返し、警告をログに出力する', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = formatDownloadDateTime('invalid-date');

      expect(result).toBe('-');
      expect(consoleSpy).toHaveBeenCalledWith('Invalid date string:', 'invalid-date');

      consoleSpy.mockRestore();
    });

    it('数値のみの無効な文字列の場合は「-」を返す', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = formatDownloadDateTime('12345');

      expect(result).toBe('-');
      expect(consoleSpy).toHaveBeenCalledWith('Invalid date string:', '12345');

      consoleSpy.mockRestore();
    });

    it('Date()コンストラクタでエラーが発生した場合は「-」を返し、エラーをログに出力する', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Dateコンストラクタをモックしてエラーを投げる
      const originalDate = global.Date;
      global.Date = vi.fn(() => {
        throw new Error('Date constructor error');
      }) as any;

      const result = formatDownloadDateTime('2023-01-01T00:00:00Z');

      expect(result).toBe('-');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Date formatting error:', expect.any(Error));

      // 元のDateを復元
      global.Date = originalDate;
      consoleErrorSpy.mockRestore();
    });

    it('ISO 8601形式の様々な日時文字列を正しく処理する', () => {
      const testCases = [
        { input: '2023-06-15T12:30:00Z', expected: '2023/06/15 21:30' },
        { input: '2023-01-01T23:59:59Z', expected: '2023/01/02 08:59' },
        { input: '2023-12-31T00:00:00Z', expected: '2023/12/31 09:00' },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = formatDownloadDateTime(input);
        expect(result).toBe(expected);
      });
    });
  });

  describe('formatUploadDateTime', () => {
    it('正常な日時文字列を正しくフォーマットする', () => {
      const dateString = '2023-01-01T00:00:00Z';
      const result = formatUploadDateTime(dateString);
      expect(result).toBe('2023/01/01 09:00');
    });

    it('別の正常な日時文字列を正しくフォーマットする', () => {
      const dateString = '2023-12-31T15:30:45Z';
      const result = formatUploadDateTime(dateString);
      expect(result).toBe('2024/01/01 00:30');
    });

    it('空文字列の場合は「-」を返す', () => {
      const result = formatUploadDateTime('');
      expect(result).toBe('-');
    });

    it('null値の場合は「-」を返す', () => {
      const result = formatUploadDateTime(null as any);
      expect(result).toBe('-');
    });

    it('undefined値の場合は「-」を返す', () => {
      const result = formatUploadDateTime(undefined as any);
      expect(result).toBe('-');
    });

    it('無効な日時文字列の場合は「-」を返し、警告をログに出力する', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = formatUploadDateTime('invalid-date');

      expect(result).toBe('-');
      expect(consoleSpy).toHaveBeenCalledWith('Invalid date string:', 'invalid-date');

      consoleSpy.mockRestore();
    });

    it('数値のみの無効な文字列の場合は「-」を返す', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = formatUploadDateTime('12345');

      expect(result).toBe('-');
      expect(consoleSpy).toHaveBeenCalledWith('Invalid date string:', '12345');

      consoleSpy.mockRestore();
    });

    it('Date()コンストラクタでエラーが発生した場合は「-」を返し、エラーをログに出力する', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Dateコンストラクタをモックしてエラーを投げる
      const originalDate = global.Date;
      global.Date = vi.fn(() => {
        throw new Error('Date constructor error');
      }) as any;

      const result = formatUploadDateTime('2023-01-01T00:00:00Z');

      expect(result).toBe('-');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Date formatting error:', expect.any(Error));

      // 元のDateを復元
      global.Date = originalDate;
      consoleErrorSpy.mockRestore();
    });

    it('ISO 8601形式の様々な日時文字列を正しく処理する', () => {
      const testCases = [
        { input: '2023-06-15T12:30:00Z', expected: '2023/06/15 21:30' },
        { input: '2023-01-01T23:59:59Z', expected: '2023/01/02 08:59' },
        { input: '2023-12-31T00:00:00Z', expected: '2023/12/31 09:00' },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = formatUploadDateTime(input);
        expect(result).toBe(expected);
      });
    });
  });

  describe('両関数の一貫性', () => {
    it('同じ入力に対して同じフォーマット結果を返す（空文字列以外）', () => {
      const testInputs = [
        '2023-01-01T00:00:00Z',
        '2023-12-31T15:30:45Z',
        'invalid-date',
        null,
        undefined,
      ];

      testInputs.forEach(input => {
        const downloadResult = formatDownloadDateTime(input as any);
        const uploadResult = formatUploadDateTime(input as any);

        if (input === '' || input === null || input === undefined) {
          // 空文字列の場合のみ異なる結果を期待
          if (input === '' || input === null || input === undefined) {
            expect(downloadResult).toBe('未設定');
            expect(uploadResult).toBe('-');
          }
        } else if (input === 'invalid-date') {
          // 無効な日時の場合は両方とも「-」
          expect(downloadResult).toBe('-');
          expect(uploadResult).toBe('-');
        } else {
          // 有効な日時の場合は同じフォーマット結果
          expect(downloadResult).toBe(uploadResult);
        }
      });
    });
  });
});
