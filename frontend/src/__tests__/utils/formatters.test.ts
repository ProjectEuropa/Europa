import { describe, expect, it } from 'vitest';

// 仮想的なフォーマッター関数
const formatters = {
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / k ** i).toFixed(2)) + ' ' + sizes[i];
  },

  formatDate: (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  },

  formatDateTime: (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  formatRelativeTime: (date: string | Date): string => {
    const now = new Date();
    const target = new Date(date);
    const diffMs = now.getTime() - target.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'たった今';
    if (diffMinutes < 60) return `${diffMinutes}分前`;
    if (diffHours < 24) return `${diffHours}時間前`;
    if (diffDays < 7) return `${diffDays}日前`;

    return formatters.formatDate(date);
  },

  formatCurrency: (amount: number, currency = 'JPY'): string => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency,
    }).format(amount);
  },

  formatNumber: (num: number): string => {
    return new Intl.NumberFormat('ja-JP').format(num);
  },

  formatPercentage: (value: number, decimals = 1): string => {
    return `${(value * 100).toFixed(decimals)}%`;
  },

  truncateText: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  },

  capitalizeFirst: (text: string): string => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  formatPhoneNumber: (phone: string): string => {
    // 日本の電話番号フォーマット
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('0')) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
    }
    if (cleaned.length === 10 && cleaned.startsWith('0')) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  },
};

describe('formatters', () => {
  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatters.formatFileSize(0)).toBe('0 Bytes');
      expect(formatters.formatFileSize(1024)).toBe('1 KB');
      expect(formatters.formatFileSize(1048576)).toBe('1 MB');
      expect(formatters.formatFileSize(1073741824)).toBe('1 GB');
      expect(formatters.formatFileSize(1536)).toBe('1.5 KB');
    });

    it('should handle large file sizes', () => {
      expect(formatters.formatFileSize(1099511627776)).toBe('1 TB');
      expect(formatters.formatFileSize(2199023255552)).toBe('2 TB');
    });

    it('should handle decimal values', () => {
      expect(formatters.formatFileSize(1536)).toBe('1.5 KB');
      expect(formatters.formatFileSize(2621440)).toBe('2.5 MB');
    });
  });

  describe('formatDate', () => {
    it('should format date strings correctly', () => {
      const result = formatters.formatDate('2024-01-15T10:30:00Z');
      expect(result).toMatch(/2024\/01\/15/);
    });

    it('should format Date objects correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = formatters.formatDate(date);
      expect(result).toMatch(/2024\/01\/15/);
    });
  });

  describe('formatDateTime', () => {
    it('should format datetime strings correctly', () => {
      const result = formatters.formatDateTime('2024-01-15T10:30:00Z');
      expect(result).toMatch(/2024\/01\/15/);
      expect(result).toMatch(/:/); // Should include time
    });

    it('should format Date objects correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = formatters.formatDateTime(date);
      expect(result).toMatch(/2024\/01\/15/);
      expect(result).toMatch(/:/); // Should include time
    });
  });

  describe('formatRelativeTime', () => {
    it('should return "たった今" for very recent times', () => {
      const now = new Date();
      const result = formatters.formatRelativeTime(now);
      expect(result).toBe('たった今');
    });

    it('should format minutes ago', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const result = formatters.formatRelativeTime(fiveMinutesAgo);
      expect(result).toBe('5分前');
    });

    it('should format hours ago', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      const result = formatters.formatRelativeTime(twoHoursAgo);
      expect(result).toBe('2時間前');
    });

    it('should format days ago', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const result = formatters.formatRelativeTime(threeDaysAgo);
      expect(result).toBe('3日前');
    });
  });

  describe('formatCurrency', () => {
    it('should format JPY currency correctly', () => {
      const result = formatters.formatCurrency(1000);
      expect(result).toMatch(/￥1,000/);
    });

    it('should format USD currency correctly', () => {
      const result = formatters.formatCurrency(1000, 'USD');
      expect(result).toMatch(/\$1,000/);
    });

    it('should handle decimal amounts', () => {
      const result = formatters.formatCurrency(1234.56);
      expect(result).toMatch(/￥1,235/); // JPY doesn't use decimals
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with thousand separators', () => {
      expect(formatters.formatNumber(1000)).toBe('1,000');
      expect(formatters.formatNumber(1234567)).toBe('1,234,567');
    });

    it('should handle negative numbers', () => {
      expect(formatters.formatNumber(-1000)).toBe('-1,000');
    });

    it('should handle zero', () => {
      expect(formatters.formatNumber(0)).toBe('0');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentages with default decimals', () => {
      expect(formatters.formatPercentage(0.1234)).toBe('12.3%');
      expect(formatters.formatPercentage(0.5)).toBe('50.0%');
    });

    it('should format percentages with custom decimals', () => {
      expect(formatters.formatPercentage(0.1234, 2)).toBe('12.34%');
      expect(formatters.formatPercentage(0.1234, 0)).toBe('12%');
    });

    it('should handle edge cases', () => {
      expect(formatters.formatPercentage(0)).toBe('0.0%');
      expect(formatters.formatPercentage(1)).toBe('100.0%');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const longText = 'This is a very long text that should be truncated';
      expect(formatters.truncateText(longText, 20)).toBe(
        'This is a very long ...'
      );
    });

    it('should not truncate short text', () => {
      const shortText = 'Short text';
      expect(formatters.truncateText(shortText, 20)).toBe('Short text');
    });

    it('should handle exact length', () => {
      const text = 'Exactly twenty chars';
      expect(formatters.truncateText(text, 20)).toBe('Exactly twenty chars');
    });

    it('should handle empty string', () => {
      expect(formatters.truncateText('', 10)).toBe('');
    });
  });

  describe('capitalizeFirst', () => {
    it('should capitalize first letter', () => {
      expect(formatters.capitalizeFirst('hello world')).toBe('Hello world');
      expect(formatters.capitalizeFirst('HELLO WORLD')).toBe('Hello world');
    });

    it('should handle single character', () => {
      expect(formatters.capitalizeFirst('a')).toBe('A');
    });

    it('should handle empty string', () => {
      expect(formatters.capitalizeFirst('')).toBe('');
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format 11-digit mobile numbers', () => {
      expect(formatters.formatPhoneNumber('09012345678')).toBe('090-1234-5678');
    });

    it('should format 10-digit landline numbers', () => {
      expect(formatters.formatPhoneNumber('0312345678')).toBe('03-1234-5678');
    });

    it('should handle already formatted numbers', () => {
      expect(formatters.formatPhoneNumber('090-1234-5678')).toBe(
        '090-1234-5678'
      );
    });

    it('should handle invalid formats', () => {
      expect(formatters.formatPhoneNumber('123')).toBe('123');
      expect(formatters.formatPhoneNumber('abc-def-ghij')).toBe('abc-def-ghij');
    });
  });
});
