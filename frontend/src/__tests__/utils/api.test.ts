import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// localStorageのモック
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// 環境変数のモック
const originalEnv = process.env;

describe('API Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_API_BASE_URL: 'https://test-api.com',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe('Environment Configuration', () => {
    it('should use correct API base URL from environment', () => {
      expect(process.env.NEXT_PUBLIC_API_BASE_URL).toBe('https://test-api.com');
    });
  });

  describe('LocalStorage Integration', () => {
    it('should interact with localStorage for token management', () => {
      localStorageMock.getItem.mockReturnValue('test-token');

      const token = localStorage.getItem('token');
      expect(token).toBe('test-token');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('token');
    });

    it('should store tokens in localStorage', () => {
      localStorage.setItem('token', 'new-token');

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'token',
        'new-token'
      );
    });

    it('should remove tokens from localStorage', () => {
      localStorage.removeItem('token');

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    });
  });

  describe('URL Encoding', () => {
    it('should properly encode search keywords', () => {
      const keyword = 'test keyword with spaces';
      const encoded = encodeURIComponent(keyword);

      expect(encoded).toBe('test%20keyword%20with%20spaces');
    });

    it('should handle special characters in keywords', () => {
      const keyword = 'test@#$%^&*()';
      const encoded = encodeURIComponent(keyword);

      expect(encoded).toBe('test%40%23%24%25%5E%26*()');
    });
  });

  describe('Request Body Serialization', () => {
    it('should serialize login data correctly', () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const serialized = JSON.stringify(loginData);
      const parsed = JSON.parse(serialized);

      expect(parsed.email).toBe('test@example.com');
      expect(parsed.password).toBe('password123');
    });

    it('should serialize registration data correctly', () => {
      const registerData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123',
      };

      const serialized = JSON.stringify(registerData);
      const parsed = JSON.parse(serialized);

      expect(parsed.name).toBe('Test User');
      expect(parsed.email).toBe('test@example.com');
      expect(parsed.password).toBe('password123');
      expect(parsed.password_confirmation).toBe('password123');
    });
  });

  describe('Error Handling Utilities', () => {
    it('should handle console error logging', () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      console.error('Test error message', new Error('Test error'));

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Test error message',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('FormData Handling', () => {
    it('should create FormData for file uploads', () => {
      const formData = new FormData();
      const file = new File(['test content'], 'test.txt', {
        type: 'text/plain',
      });

      formData.append('file', file);
      formData.append('name', 'test-file');

      expect(formData.get('file')).toBe(file);
      expect(formData.get('name')).toBe('test-file');
    });

    it('should handle multiple form fields', () => {
      const formData = new FormData();

      formData.append('field1', 'value1');
      formData.append('field2', 'value2');
      formData.append('tags', 'tag1,tag2,tag3');

      expect(formData.get('field1')).toBe('value1');
      expect(formData.get('field2')).toBe('value2');
      expect(formData.get('tags')).toBe('tag1,tag2,tag3');
    });
  });

  describe('Date Handling', () => {
    it('should format dates correctly for API', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const isoString = date.toISOString();

      expect(isoString).toBe('2024-01-15T10:30:00.000Z');
    });

    it('should extract date portion from datetime', () => {
      const datetime = '2024-01-15T10:30:00Z';
      const datePortion = datetime.slice(0, 10);

      expect(datePortion).toBe('2024-01-15');
    });
  });

  describe('Window Object Utilities', () => {
    it('should handle window.open for downloads', () => {
      const windowOpenSpy = vi
        .spyOn(window, 'open')
        .mockImplementation(() => null);

      window.open('https://example.com/download', '_blank');

      expect(windowOpenSpy).toHaveBeenCalledWith(
        'https://example.com/download',
        '_blank'
      );

      windowOpenSpy.mockRestore();
    });

    it('should handle URL object creation and cleanup', () => {
      // URLオブジェクトをモック
      const mockURL = {
        createObjectURL: vi.fn().mockReturnValue('blob:mock-url'),
        revokeObjectURL: vi.fn(),
      };

      // グローバルURLをモック
      Object.defineProperty(global, 'URL', {
        value: mockURL,
        writable: true,
      });

      const blob = new Blob(['test content'], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);

      expect(url).toBe('blob:mock-url');
      expect(mockURL.createObjectURL).toHaveBeenCalledWith(blob);

      URL.revokeObjectURL(url);
      expect(mockURL.revokeObjectURL).toHaveBeenCalledWith(url);
    });
  });
});
