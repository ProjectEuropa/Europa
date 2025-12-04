import { describe, expect, it, vi } from 'vitest';
import {
  formatDownloadDateTime,
  formatUploadDateTime,
  getAccessibilityDateInfo,
} from '@/utils/dateFormatters';

describe('dateFormatters', () => {
  describe('formatDownloadDateTime', () => {
    it('正常な日時文字列を正しくフォーマットする（変換なし）', () => {
      const dateString = '2023-01-01T00:00:00.000Z';
      const result = formatDownloadDateTime(dateString);
      expect(result).toBe('2023-01-01 00:00:00');
    });

    it('別の正常な日時文字列を正しくフォーマットする（変換なし）', () => {
      const dateString = '2023-12-31T15:30:45.000Z';
      const result = formatDownloadDateTime(dateString);
      expect(result).toBe('2023-12-31 15:30:45');
    });

    it('空文字列の場合は「未設定」を返す', () => {
      const result = formatDownloadDateTime('');
      expect(result).toBe('未設定');
    });

    it('null値の場合は「未設定」を返す', () => {
      const result = formatDownloadDateTime(null as never);
      expect(result).toBe('未設定');
    });

    it('undefined値の場合は「未設定」を返す', () => {
      const result = formatDownloadDateTime(undefined as never);
      expect(result).toBe('未設定');
    });

    it('無効な日時文字列の場合は「日時解析エラー」を返し、警告をログに出力する', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = formatDownloadDateTime('invalid-date');

      expect(result).toBe('日時解析エラー');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          '[formatDownloadDateTime] Date format error: Failed to format date string'
        )
      );

      consoleSpy.mockRestore();
    });

    it('数値のみの無効な文字列の場合は「日時形式エラー」を返す', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = formatDownloadDateTime('12345');

      expect(result).toBe('日時形式エラー');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          '[formatDownloadDateTime] Date format error: Date string contains only numbers'
        )
      );

      consoleSpy.mockRestore();
    });

    it('正規表現でフォーマットできない日時文字列の場合は「日時解析エラー」を返す', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // 正規表現パターンにマッチしない形式（'-'は含むが正しいフォーマットではない）
      const result = formatDownloadDateTime('not-a-valid-date');

      expect(result).toBe('日時解析エラー');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          '[formatDownloadDateTime] Date format error: Failed to format date string'
        )
      );

      consoleSpy.mockRestore();
    });

    it('ISO 8601形式の様々な日時文字列を正しく処理する（変換なし）', () => {
      const testCases = [
        { input: '2025-12-21T23:59:00.000Z', expected: '2025-12-21 23:59:00' },
        { input: '2023-06-15T12:30:45.123Z', expected: '2023-06-15 12:30:45' },
        { input: '2023-01-01T00:00:00.000Z', expected: '2023-01-01 00:00:00' },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = formatDownloadDateTime(input);
        expect(result).toBe(expected);
      });
    });
  });

  describe('formatUploadDateTime', () => {
    it('正常な日時文字列を正しくフォーマットする（変換なし）', () => {
      const dateString = '2023-01-01T00:00:00.000Z';
      const result = formatUploadDateTime(dateString);
      expect(result).toBe('2023-01-01 00:00:00');
    });

    it('別の正常な日時文字列を正しくフォーマットする（変換なし）', () => {
      const dateString = '2023-12-31T15:30:45.000Z';
      const result = formatUploadDateTime(dateString);
      expect(result).toBe('2023-12-31 15:30:45');
    });

    it('空文字列の場合は「-」を返す', () => {
      const result = formatUploadDateTime('');
      expect(result).toBe('-');
    });

    it('null値の場合は「-」を返す', () => {
      const result = formatUploadDateTime(null as never);
      expect(result).toBe('-');
    });

    it('undefined値の場合は「-」を返す', () => {
      const result = formatUploadDateTime(undefined as never);
      expect(result).toBe('-');
    });

    it('無効な日時文字列の場合は「日時解析エラー」を返し、警告をログに出力する', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = formatUploadDateTime('invalid-date');

      expect(result).toBe('日時解析エラー');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          '[formatUploadDateTime] Date format error: Failed to format date string'
        )
      );

      consoleSpy.mockRestore();
    });

    it('数値のみの無効な文字列の場合は「日時形式エラー」を返す', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = formatUploadDateTime('12345');

      expect(result).toBe('日時形式エラー');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          '[formatUploadDateTime] Date format error: Date string contains only numbers'
        )
      );

      consoleSpy.mockRestore();
    });

    it('正規表現でフォーマットできない日時文字列の場合は「日時解析エラー」を返す', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // 正規表現パターンにマッチしない形式（'-'は含むが正しいフォーマットではない）
      const result = formatUploadDateTime('not-a-valid-date');

      expect(result).toBe('日時解析エラー');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          '[formatUploadDateTime] Date format error: Failed to format date string'
        )
      );

      consoleSpy.mockRestore();
    });

    it('ISO 8601形式の様々な日時文字列を正しく処理する（変換なし）', () => {
      const testCases = [
        { input: '2025-12-21T23:59:00.000Z', expected: '2025-12-21 23:59:00' },
        { input: '2023-06-15T12:30:45.123Z', expected: '2023-06-15 12:30:45' },
        { input: '2023-01-01T00:00:00.000Z', expected: '2023-01-01 00:00:00' },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = formatUploadDateTime(input);
        expect(result).toBe(expected);
      });
    });
  });

  describe('両関数の一貫性', () => {
    // ヘルパー関数：テスト入力に対する期待値をチェック
    const checkConsistency = (input: unknown) => {
      const downloadResult = formatDownloadDateTime(input as never);
      const uploadResult = formatUploadDateTime(input as never);

      if (input === '' || input === null || input === undefined) {
        // null/undefined の場合は異なる結果を期待
        expect(downloadResult).toBe('未設定');
        expect(uploadResult).toBe('-');
      } else if (input === 'invalid-date') {
        // 無効な日時の場合は両方とも「日時解析エラー」
        expect(downloadResult).toBe('日時解析エラー');
        expect(uploadResult).toBe('日時解析エラー');
      } else {
        // 有効な日時の場合は同じフォーマット結果
        expect(downloadResult).toBe(uploadResult);
      }
    };

    it('同じ入力に対して同じフォーマット結果を返す（空文字列以外）', () => {
      const testInputs = [
        '2023-01-01T00:00:00Z',
        '2023-12-31T15:30:45Z',
        'invalid-date',
        null,
        undefined,
      ];

      testInputs.forEach(checkConsistency);
    });
  });

  describe('エラーハンドリング強化', () => {
    it('無効な日時文字列に対して適切なエラーメッセージを返す', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = formatDownloadDateTime('invalid-date');

      expect(result).toBe('日時解析エラー');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          '[formatDownloadDateTime] Date format error: Failed to format date string'
        )
      );

      consoleSpy.mockRestore();
    });

    it('空文字列に対して適切なフォールバック値を返す', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

      const downloadResult = formatDownloadDateTime('');
      const uploadResult = formatUploadDateTime('');

      expect(downloadResult).toBe('未設定');
      expect(uploadResult).toBe('-');

      // 空文字列の場合はログ出力されない（正常な動作）
      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('異なるエラータイプに対して適切なログレベルを使用する', () => {
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      // 形式エラー（warn レベル）
      formatDownloadDateTime('12345');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Date string contains only numbers')
      );

      // フォーマットエラー（warn レベル）
      formatDownloadDateTime('invalid-date');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to format date string')
      );

      // 復元
      consoleWarnSpy.mockRestore();
    });

    it('エラーメッセージに元の値が含まれる', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      formatDownloadDateTime('invalid-input');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('(Original value: "invalid-input")')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('getAccessibilityDateInfo', () => {
    it('未設定の場合に適切なアクセシビリティ情報を返す', () => {
      const result = getAccessibilityDateInfo('', '未設定', 'download');

      expect(result.ariaLabel).toBe('ダウンロード日時は未設定です');
      expect(result.title).toBe('ダウンロード日時が設定されていません');
    });

    it('アップロード日時の未設定の場合に適切なアクセシビリティ情報を返す', () => {
      const result = getAccessibilityDateInfo('', '-', 'upload');

      expect(result.ariaLabel).toBe('アップロード日時は未設定です');
      expect(result.title).toBe('アップロード日時が設定されていません');
    });

    it('エラー状態の場合に適切なアクセシビリティ情報を返す', () => {
      const result = getAccessibilityDateInfo(
        'invalid',
        '日時形式エラー',
        'download'
      );

      expect(result.ariaLabel).toBe(
        'ダウンロード日時の表示でエラーが発生しました'
      );
      expect(result.title).toBe(
        'ダウンロード日時の処理中にエラーが発生しました'
      );
    });

    it('正常な日時の場合に適切なアクセシビリティ情報を返す', () => {
      const result = getAccessibilityDateInfo(
        '2023-01-01T00:00:00.000Z',
        '2023-01-01 00:00:00',
        'download'
      );

      expect(result.ariaLabel).toBe('ダウンロード日時: 2023-01-01 00:00:00');
      expect(result.title).toBe('ダウンロード日時: 2023-01-01 00:00:00');
    });

    it('アップロード日時の正常な場合に適切なアクセシビリティ情報を返す', () => {
      const result = getAccessibilityDateInfo(
        '2023-01-01T00:00:00.000Z',
        '2023-01-01 00:00:00',
        'upload'
      );

      expect(result.ariaLabel).toBe('アップロード日時: 2023-01-01 00:00:00');
      expect(result.title).toBe('アップロード日時: 2023-01-01 00:00:00');
    });
  });
});
