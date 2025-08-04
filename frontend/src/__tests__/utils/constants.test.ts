import { describe, expect, it } from 'vitest';

// 仮想的な定数ファイル
const CONSTANTS = {
  // API関連
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  API_TIMEOUT: 30000,

  // ファイル関連
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],

  // ページネーション
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // バリデーション
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 20,

  // UI関連
  TOAST_DURATION: 5000,
  DEBOUNCE_DELAY: 300,

  // ローカルストレージキー
  STORAGE_KEYS: {
    AUTH_TOKEN: 'auth_token',
    USER_PREFERENCES: 'user_preferences',
    THEME: 'theme',
    LANGUAGE: 'language',
  },

  // テーマ
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
  } as const,

  // 言語
  LANGUAGES: {
    JA: 'ja',
    EN: 'en',
  } as const,

  // ステータス
  FILE_STATUS: {
    UPLOADING: 'uploading',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
  } as const,

  // エラーコード
  ERROR_CODES: {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    VALIDATION_ERROR: 422,
    SERVER_ERROR: 500,
  } as const,

  // 正規表現
  REGEX: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_JP: /^(\+81|0)[0-9]{1,4}-?[0-9]{1,4}-?[0-9]{3,4}$/,
    USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  },

  // 日付フォーマット
  DATE_FORMATS: {
    DISPLAY: 'YYYY/MM/DD',
    DISPLAY_WITH_TIME: 'YYYY/MM/DD HH:mm',
    ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
    API: 'YYYY-MM-DD',
  },
};

// ヘルパー関数
const helpers = {
  isValidFileType: (fileType: string): boolean => {
    return CONSTANTS.ALLOWED_FILE_TYPES.includes(fileType);
  },

  isValidFileSize: (fileSize: number): boolean => {
    return fileSize <= CONSTANTS.MAX_FILE_SIZE;
  },

  getFileTypeCategory: (fileType: string): string => {
    if (fileType.startsWith('image/')) return 'image';
    if (fileType.startsWith('video/')) return 'video';
    if (fileType.startsWith('audio/')) return 'audio';
    if (fileType === 'application/pdf') return 'pdf';
    if (fileType.includes('spreadsheet') || fileType.includes('excel'))
      return 'spreadsheet';
    if (fileType.includes('document') || fileType.includes('word'))
      return 'document';
    return 'other';
  },

  isValidEmail: (email: string): boolean => {
    return CONSTANTS.REGEX.EMAIL.test(email);
  },

  isValidPassword: (password: string): boolean => {
    return (
      password.length >= CONSTANTS.MIN_PASSWORD_LENGTH &&
      password.length <= CONSTANTS.MAX_PASSWORD_LENGTH &&
      CONSTANTS.REGEX.PASSWORD.test(password)
    );
  },

  isValidUsername: (username: string): boolean => {
    return CONSTANTS.REGEX.USERNAME.test(username);
  },
};

describe('CONSTANTS', () => {
  describe('API関連', () => {
    it('should have correct API configuration', () => {
      expect(CONSTANTS.API_TIMEOUT).toBe(30000);
      expect(typeof CONSTANTS.API_BASE_URL).toBe('string');
    });
  });

  describe('ファイル関連', () => {
    it('should have correct file size limit', () => {
      expect(CONSTANTS.MAX_FILE_SIZE).toBe(10 * 1024 * 1024); // 10MB
    });

    it('should have allowed file types array', () => {
      expect(Array.isArray(CONSTANTS.ALLOWED_FILE_TYPES)).toBe(true);
      expect(CONSTANTS.ALLOWED_FILE_TYPES).toContain('image/jpeg');
      expect(CONSTANTS.ALLOWED_FILE_TYPES).toContain('application/pdf');
    });
  });

  describe('ページネーション', () => {
    it('should have correct pagination defaults', () => {
      expect(CONSTANTS.DEFAULT_PAGE_SIZE).toBe(20);
      expect(CONSTANTS.MAX_PAGE_SIZE).toBe(100);
    });
  });

  describe('バリデーション', () => {
    it('should have correct password length constraints', () => {
      expect(CONSTANTS.MIN_PASSWORD_LENGTH).toBe(8);
      expect(CONSTANTS.MAX_PASSWORD_LENGTH).toBe(128);
    });

    it('should have correct username length constraints', () => {
      expect(CONSTANTS.MIN_USERNAME_LENGTH).toBe(3);
      expect(CONSTANTS.MAX_USERNAME_LENGTH).toBe(20);
    });
  });

  describe('UI関連', () => {
    it('should have correct UI timing values', () => {
      expect(CONSTANTS.TOAST_DURATION).toBe(5000);
      expect(CONSTANTS.DEBOUNCE_DELAY).toBe(300);
    });
  });

  describe('ストレージキー', () => {
    it('should have all required storage keys', () => {
      expect(CONSTANTS.STORAGE_KEYS.AUTH_TOKEN).toBe('auth_token');
      expect(CONSTANTS.STORAGE_KEYS.USER_PREFERENCES).toBe('user_preferences');
      expect(CONSTANTS.STORAGE_KEYS.THEME).toBe('theme');
      expect(CONSTANTS.STORAGE_KEYS.LANGUAGE).toBe('language');
    });
  });

  describe('テーマ', () => {
    it('should have all theme options', () => {
      expect(CONSTANTS.THEMES.LIGHT).toBe('light');
      expect(CONSTANTS.THEMES.DARK).toBe('dark');
      expect(CONSTANTS.THEMES.SYSTEM).toBe('system');
    });
  });

  describe('言語', () => {
    it('should have supported languages', () => {
      expect(CONSTANTS.LANGUAGES.JA).toBe('ja');
      expect(CONSTANTS.LANGUAGES.EN).toBe('en');
    });
  });

  describe('ファイルステータス', () => {
    it('should have all file status options', () => {
      expect(CONSTANTS.FILE_STATUS.UPLOADING).toBe('uploading');
      expect(CONSTANTS.FILE_STATUS.PROCESSING).toBe('processing');
      expect(CONSTANTS.FILE_STATUS.COMPLETED).toBe('completed');
      expect(CONSTANTS.FILE_STATUS.FAILED).toBe('failed');
    });
  });

  describe('エラーコード', () => {
    it('should have correct HTTP error codes', () => {
      expect(CONSTANTS.ERROR_CODES.UNAUTHORIZED).toBe(401);
      expect(CONSTANTS.ERROR_CODES.FORBIDDEN).toBe(403);
      expect(CONSTANTS.ERROR_CODES.NOT_FOUND).toBe(404);
      expect(CONSTANTS.ERROR_CODES.VALIDATION_ERROR).toBe(422);
      expect(CONSTANTS.ERROR_CODES.SERVER_ERROR).toBe(500);
    });
  });

  describe('正規表現', () => {
    it('should have valid regex patterns', () => {
      expect(CONSTANTS.REGEX.EMAIL).toBeInstanceOf(RegExp);
      expect(CONSTANTS.REGEX.PHONE_JP).toBeInstanceOf(RegExp);
      expect(CONSTANTS.REGEX.USERNAME).toBeInstanceOf(RegExp);
      expect(CONSTANTS.REGEX.PASSWORD).toBeInstanceOf(RegExp);
    });
  });

  describe('日付フォーマット', () => {
    it('should have all date format strings', () => {
      expect(CONSTANTS.DATE_FORMATS.DISPLAY).toBe('YYYY/MM/DD');
      expect(CONSTANTS.DATE_FORMATS.DISPLAY_WITH_TIME).toBe('YYYY/MM/DD HH:mm');
      expect(CONSTANTS.DATE_FORMATS.ISO).toBe('YYYY-MM-DDTHH:mm:ss.SSSZ');
      expect(CONSTANTS.DATE_FORMATS.API).toBe('YYYY-MM-DD');
    });
  });
});

describe('helpers', () => {
  describe('isValidFileType', () => {
    it('should validate allowed file types', () => {
      expect(helpers.isValidFileType('image/jpeg')).toBe(true);
      expect(helpers.isValidFileType('application/pdf')).toBe(true);
      expect(helpers.isValidFileType('text/plain')).toBe(true);
    });

    it('should reject disallowed file types', () => {
      expect(helpers.isValidFileType('application/exe')).toBe(false);
      expect(helpers.isValidFileType('video/mp4')).toBe(false);
      expect(helpers.isValidFileType('unknown/type')).toBe(false);
    });
  });

  describe('isValidFileSize', () => {
    it('should validate file sizes within limit', () => {
      expect(helpers.isValidFileSize(1024)).toBe(true); // 1KB
      expect(helpers.isValidFileSize(5 * 1024 * 1024)).toBe(true); // 5MB
      expect(helpers.isValidFileSize(CONSTANTS.MAX_FILE_SIZE)).toBe(true); // exactly 10MB
    });

    it('should reject file sizes over limit', () => {
      expect(helpers.isValidFileSize(CONSTANTS.MAX_FILE_SIZE + 1)).toBe(false);
      expect(helpers.isValidFileSize(20 * 1024 * 1024)).toBe(false); // 20MB
    });
  });

  describe('getFileTypeCategory', () => {
    it('should categorize image files', () => {
      expect(helpers.getFileTypeCategory('image/jpeg')).toBe('image');
      expect(helpers.getFileTypeCategory('image/png')).toBe('image');
      expect(helpers.getFileTypeCategory('image/gif')).toBe('image');
    });

    it('should categorize video files', () => {
      expect(helpers.getFileTypeCategory('video/mp4')).toBe('video');
      expect(helpers.getFileTypeCategory('video/avi')).toBe('video');
    });

    it('should categorize audio files', () => {
      expect(helpers.getFileTypeCategory('audio/mp3')).toBe('audio');
      expect(helpers.getFileTypeCategory('audio/wav')).toBe('audio');
    });

    it('should categorize PDF files', () => {
      expect(helpers.getFileTypeCategory('application/pdf')).toBe('pdf');
    });

    it('should categorize document files', () => {
      expect(helpers.getFileTypeCategory('application/msword')).toBe(
        'document'
      );
      expect(
        helpers.getFileTypeCategory(
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
      ).toBe('document');
    });

    it('should categorize spreadsheet files', () => {
      expect(helpers.getFileTypeCategory('application/vnd.ms-excel')).toBe(
        'spreadsheet'
      );
      expect(
        helpers.getFileTypeCategory(
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
      ).toBe('spreadsheet');
    });

    it('should categorize unknown files as other', () => {
      expect(helpers.getFileTypeCategory('text/plain')).toBe('other');
      expect(helpers.getFileTypeCategory('application/zip')).toBe('other');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(helpers.isValidEmail('test@example.com')).toBe(true);
      expect(helpers.isValidEmail('user.name@domain.co.jp')).toBe(true);
      expect(helpers.isValidEmail('test+tag@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(helpers.isValidEmail('invalid-email')).toBe(false);
      expect(helpers.isValidEmail('test@')).toBe(false);
      expect(helpers.isValidEmail('@example.com')).toBe(false);
      expect(helpers.isValidEmail('')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should validate strong passwords', () => {
      expect(helpers.isValidPassword('Password123')).toBe(true);
      expect(helpers.isValidPassword('MySecure1Pass')).toBe(true);
      expect(helpers.isValidPassword('Complex9Password')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(helpers.isValidPassword('password')).toBe(false); // no uppercase, no number
      expect(helpers.isValidPassword('PASSWORD')).toBe(false); // no lowercase, no number
      expect(helpers.isValidPassword('Password')).toBe(false); // no number
      expect(helpers.isValidPassword('Pass1')).toBe(false); // too short
      expect(helpers.isValidPassword('12345678')).toBe(false); // no letters
      expect(helpers.isValidPassword('')).toBe(false); // empty
    });

    it('should reject passwords that are too long', () => {
      const longPassword = `A1${'a'.repeat(127)}`; // 129 characters
      expect(helpers.isValidPassword(longPassword)).toBe(false);
    });
  });

  describe('isValidUsername', () => {
    it('should validate correct usernames', () => {
      expect(helpers.isValidUsername('user123')).toBe(true);
      expect(helpers.isValidUsername('test_user')).toBe(true);
      expect(helpers.isValidUsername('Username')).toBe(true);
      expect(helpers.isValidUsername('a1b2c3d4e5f6g7h8i9j0')).toBe(true); // 20 chars
    });

    it('should reject invalid usernames', () => {
      expect(helpers.isValidUsername('ab')).toBe(false); // too short
      expect(helpers.isValidUsername('a'.repeat(21))).toBe(false); // too long
      expect(helpers.isValidUsername('user-name')).toBe(false); // hyphen not allowed
      expect(helpers.isValidUsername('user name')).toBe(false); // space not allowed
      expect(helpers.isValidUsername('user@name')).toBe(false); // @ not allowed
      expect(helpers.isValidUsername('')).toBe(false); // empty
    });
  });
});
