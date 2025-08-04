import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// 仮想的なuseLocalStorageフック
const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue] as const;
};

// React をモック
const React = {
  useState: vi.fn(),
};

vi.mock('react', () => React);

// localStorage をモック
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// console.error をモック
const mockConsoleError = vi
  .spyOn(console, 'error')
  .mockImplementation(() => {});

describe('useLocalStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockConsoleError.mockClear();

    // useState のモック実装
    let state: unknown;
    React.useState.mockImplementation((initializer: unknown) => {
      if (typeof initializer === 'function') {
        if (state === undefined) state = initializer();
      } else {
        if (state === undefined) state = initializer;
      }
      return [
        state,
        (newState: unknown) => {
          state = typeof newState === 'function' ? newState(state) : newState;
        },
      ];
    });
  });

  it('should return initial value when localStorage is empty', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial-value')
    );

    expect(result.current[0]).toBe('initial-value');
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key');
  });

  it('should return stored value from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify('stored-value'));

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial-value')
    );

    expect(result.current[0]).toBe('stored-value');
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key');
  });

  it('should handle complex objects', () => {
    const storedObject = { name: 'John', age: 30 };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedObject));

    const { result } = renderHook(() =>
      useLocalStorage('user', { name: '', age: 0 })
    );

    expect(result.current[0]).toEqual(storedObject);
  });

  it('should handle arrays', () => {
    const storedArray = ['item1', 'item2', 'item3'];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedArray));

    const { result } = renderHook(() => useLocalStorage('items', []));

    expect(result.current[0]).toEqual(storedArray);
  });

  it('should set value and update localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'test-key',
      JSON.stringify('new-value')
    );
  });

  it('should handle function updates', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(5));

    const { result } = renderHook(() => useLocalStorage('counter', 0));

    act(() => {
      result.current[1]((prev: number) => prev + 1);
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'counter',
      JSON.stringify(6)
    );
  });

  it('should remove value from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify('stored-value'));

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[2](); // removeValue
    });

    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test-key');
  });

  it('should handle localStorage getItem errors', () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'fallback')
    );

    expect(result.current[0]).toBe('fallback');
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error reading localStorage key "test-key":',
      expect.any(Error)
    );
  });

  it('should handle localStorage setItem errors', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.setItem.mockImplementation(() => {
      throw new Error('localStorage setItem error');
    });

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error setting localStorage key "test-key":',
      expect.any(Error)
    );
  });

  it('should handle localStorage removeItem errors', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify('value'));
    mockLocalStorage.removeItem.mockImplementation(() => {
      throw new Error('localStorage removeItem error');
    });

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[2](); // removeValue
    });

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error removing localStorage key "test-key":',
      expect.any(Error)
    );
  });

  it('should handle malformed JSON in localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid-json');

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'fallback')
    );

    expect(result.current[0]).toBe('fallback');
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error reading localStorage key "test-key":',
      expect.any(Error)
    );
  });

  it('should work with boolean values', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(true));

    const { result } = renderHook(() => useLocalStorage('boolean-key', false));

    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1](false);
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'boolean-key',
      JSON.stringify(false)
    );
  });

  it('should work with number values', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(42));

    const { result } = renderHook(() => useLocalStorage('number-key', 0));

    expect(result.current[0]).toBe(42);

    act(() => {
      result.current[1](100);
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'number-key',
      JSON.stringify(100)
    );
  });

  it('should handle null values', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(null));

    const { result } = renderHook(() => useLocalStorage('null-key', 'default'));

    expect(result.current[0]).toBe(null);
  });
});
