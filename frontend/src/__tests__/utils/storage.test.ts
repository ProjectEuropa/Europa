import { beforeEach, describe, expect, it, vi } from 'vitest';

// 仮想的なストレージユーティリティ
const storage = {
  // セッションストレージ操作
  session: {
    get: <T>(key: string, defaultValue?: T): T | null => {
      try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue || null;
      } catch {
        return defaultValue || null;
      }
    },

    set: <T>(key: string, value: T): void => {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Failed to set session storage:', error);
      }
    },

    remove: (key: string): void => {
      try {
        sessionStorage.removeItem(key);
      } catch (error) {
        console.error('Failed to remove from session storage:', error);
      }
    },

    clear: (): void => {
      try {
        sessionStorage.clear();
      } catch (error) {
        console.error('Failed to clear session storage:', error);
      }
    },
  },

  // ローカルストレージ操作
  local: {
    get: <T>(key: string, defaultValue?: T): T | null => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue || null;
      } catch {
        return defaultValue || null;
      }
    },

    set: <T>(key: string, value: T): void => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Failed to set local storage:', error);
      }
    },

    remove: (key: string): void => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Failed to remove from local storage:', error);
      }
    },

    clear: (): void => {
      try {
        localStorage.clear();
      } catch (error) {
        console.error('Failed to clear local storage:', error);
      }
    },
  },

  // 有効期限付きストレージ
  withExpiry: {
    set: <T>(key: string, value: T, expiryMinutes: number): void => {
      const now = new Date();
      const item = {
        value,
        expiry: now.getTime() + expiryMinutes * 60 * 1000,
      };
      try {
        localStorage.setItem(key, JSON.stringify(item));
      } catch (error) {
        console.error('Failed to set storage with expiry:', error);
      }
    },

    get: <T>(key: string, defaultValue?: T): T | null => {
      try {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return defaultValue || null;

        const item = JSON.parse(itemStr);
        const now = new Date();

        if (now.getTime() > item.expiry) {
          localStorage.removeItem(key);
          return defaultValue || null;
        }

        return item.value;
      } catch {
        return defaultValue || null;
      }
    },
  },

  // ストレージサイズ計算
  getSize: (storageType: 'local' | 'session' = 'local'): number => {
    const storage = storageType === 'local' ? localStorage : sessionStorage;
    let total = 0;

    for (const key in storage) {
      if (Object.hasOwn(storage, key)) {
        total += storage[key].length + key.length;
      }
    }

    return total;
  },

  // ストレージ使用量をMB単位で取得
  getSizeMB: (storageType: 'local' | 'session' = 'local'): number => {
    return storage.getSize(storageType) / (1024 * 1024);
  },
};

// ストレージのモック
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  hasOwnProperty: vi.fn(),
};

const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  hasOwnProperty: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true,
});

// console.error をモック
const mockConsoleError = vi
  .spyOn(console, 'error')
  .mockImplementation(() => {});

describe('storage utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockConsoleError.mockClear();
  });

  describe('session storage', () => {
    describe('get', () => {
      it('should get value from session storage', () => {
        mockSessionStorage.getItem.mockReturnValue(
          JSON.stringify('test value')
        );

        const result = storage.session.get('test-key');

        expect(mockSessionStorage.getItem).toHaveBeenCalledWith('test-key');
        expect(result).toBe('test value');
      });

      it('should return default value when key does not exist', () => {
        mockSessionStorage.getItem.mockReturnValue(null);

        const result = storage.session.get('non-existent', 'default');

        expect(result).toBe('default');
      });

      it('should return null when no default value provided', () => {
        mockSessionStorage.getItem.mockReturnValue(null);

        const result = storage.session.get('non-existent');

        expect(result).toBeNull();
      });

      it('should handle JSON parse errors', () => {
        mockSessionStorage.getItem.mockReturnValue('invalid json');

        const result = storage.session.get('test-key', 'default');

        expect(result).toBe('default');
      });
    });

    describe('set', () => {
      it('should set value in session storage', () => {
        storage.session.set('test-key', { id: 1, name: 'test' });

        expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
          'test-key',
          JSON.stringify({ id: 1, name: 'test' })
        );
      });

      it('should handle set errors', () => {
        mockSessionStorage.setItem.mockImplementation(() => {
          throw new Error('Storage quota exceeded');
        });

        storage.session.set('test-key', 'value');

        expect(mockConsoleError).toHaveBeenCalledWith(
          'Failed to set session storage:',
          expect.any(Error)
        );
      });
    });

    describe('remove', () => {
      it('should remove item from session storage', () => {
        storage.session.remove('test-key');

        expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('test-key');
      });

      it('should handle remove errors', () => {
        mockSessionStorage.removeItem.mockImplementation(() => {
          throw new Error('Remove failed');
        });

        storage.session.remove('test-key');

        expect(mockConsoleError).toHaveBeenCalledWith(
          'Failed to remove from session storage:',
          expect.any(Error)
        );
      });
    });

    describe('clear', () => {
      it('should clear session storage', () => {
        storage.session.clear();

        expect(mockSessionStorage.clear).toHaveBeenCalled();
      });

      it('should handle clear errors', () => {
        mockSessionStorage.clear.mockImplementation(() => {
          throw new Error('Clear failed');
        });

        storage.session.clear();

        expect(mockConsoleError).toHaveBeenCalledWith(
          'Failed to clear session storage:',
          expect.any(Error)
        );
      });
    });
  });

  describe('local storage', () => {
    describe('get', () => {
      it('should get value from local storage', () => {
        mockLocalStorage.getItem.mockReturnValue(JSON.stringify([1, 2, 3]));

        const result = storage.local.get('test-array');

        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-array');
        expect(result).toEqual([1, 2, 3]);
      });

      it('should return default value when key does not exist', () => {
        mockLocalStorage.getItem.mockReturnValue(null);

        const result = storage.local.get('non-existent', []);

        expect(result).toEqual([]);
      });
    });

    describe('set', () => {
      it('should set value in local storage', () => {
        storage.local.set('test-key', true);

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'test-key',
          JSON.stringify(true)
        );
      });
    });
  });

  describe('withExpiry', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    describe('set', () => {
      it('should set value with expiry time', () => {
        const now = new Date('2024-01-01T00:00:00Z');
        vi.setSystemTime(now);

        storage.withExpiry.set('test-key', 'test-value', 60);

        const expectedItem = {
          value: 'test-value',
          expiry: now.getTime() + 60 * 60 * 1000,
        };

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'test-key',
          JSON.stringify(expectedItem)
        );
      });

      it('should handle set errors', () => {
        mockLocalStorage.setItem.mockImplementation(() => {
          throw new Error('Storage error');
        });

        storage.withExpiry.set('test-key', 'value', 60);

        expect(mockConsoleError).toHaveBeenCalledWith(
          'Failed to set storage with expiry:',
          expect.any(Error)
        );
      });
    });

    describe('get', () => {
      it('should get non-expired value', () => {
        const now = new Date('2024-01-01T00:00:00Z');
        vi.setSystemTime(now);

        const item = {
          value: 'test-value',
          expiry: now.getTime() + 60 * 60 * 1000, // 1 hour from now
        };

        mockLocalStorage.getItem.mockReturnValue(JSON.stringify(item));

        const result = storage.withExpiry.get('test-key');

        expect(result).toBe('test-value');
      });

      it('should return default value for expired item', () => {
        const now = new Date('2024-01-01T00:00:00Z');
        vi.setSystemTime(now);

        const item = {
          value: 'test-value',
          expiry: now.getTime() - 60 * 60 * 1000, // 1 hour ago
        };

        mockLocalStorage.getItem.mockReturnValue(JSON.stringify(item));

        const result = storage.withExpiry.get('test-key', 'default');

        expect(result).toBe('default');
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test-key');
      });

      it('should return default value when item does not exist', () => {
        mockLocalStorage.getItem.mockReturnValue(null);

        const result = storage.withExpiry.get('non-existent', 'default');

        expect(result).toBe('default');
      });

      it('should handle JSON parse errors', () => {
        mockLocalStorage.getItem.mockReturnValue('invalid json');

        const result = storage.withExpiry.get('test-key', 'default');

        expect(result).toBe('default');
      });
    });
  });

  describe('getSize', () => {
    beforeEach(() => {
      // 各テスト前にストレージモックをクリア
      Object.keys(mockLocalStorage).forEach(key => {
        if (
          ![
            'getItem',
            'setItem',
            'removeItem',
            'clear',
            'hasOwnProperty',
          ].includes(key)
        ) {
          delete mockLocalStorage[key];
        }
      });
      Object.keys(mockSessionStorage).forEach(key => {
        if (
          ![
            'getItem',
            'setItem',
            'removeItem',
            'clear',
            'hasOwnProperty',
          ].includes(key)
        ) {
          delete mockSessionStorage[key];
        }
      });
    });

    it('should calculate local storage size', () => {
      // 新しいクリーンなモックストレージオブジェクトを作成
      const cleanLocalStorage = {
        'test-key': 'test-value',
      };
      Object.defineProperty(window, 'localStorage', {
        value: cleanLocalStorage,
        writable: true,
      });

      const result = storage.getSize('local');

      expect(result).toBe('test-key'.length + 'test-value'.length);

      // 元のモックを復元
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      });
    });

    it('should calculate session storage size', () => {
      // 新しいクリーンなモックストレージオブジェクトを作成
      const cleanSessionStorage = {
        'session-key': 'session-value',
      };
      Object.defineProperty(window, 'sessionStorage', {
        value: cleanSessionStorage,
        writable: true,
      });

      const result = storage.getSize('session');

      expect(result).toBe('session-key'.length + 'session-value'.length);

      // 元のモックを復元
      Object.defineProperty(window, 'sessionStorage', {
        value: mockSessionStorage,
        writable: true,
      });
    });

    it('should default to local storage', () => {
      // 空のストレージ
      const emptyStorage = {};
      Object.defineProperty(window, 'localStorage', {
        value: emptyStorage,
        writable: true,
      });

      const result = storage.getSize();

      expect(result).toBe(0);

      // 元のモックを復元
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      });
    });
  });

  describe('getSizeMB', () => {
    it('should return size in MB', () => {
      vi.spyOn(storage, 'getSize').mockReturnValue(1024 * 1024); // 1MB

      const result = storage.getSizeMB('local');

      expect(result).toBe(1);
    });
  });
});
