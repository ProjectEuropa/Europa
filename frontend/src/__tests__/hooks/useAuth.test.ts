import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { User } from '@/types/user';

// 仮想的なuseAuthフックの実装
const useAuth = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // 仮想的なログイン処理
      const mockUser: User = {
        id: 1,
        name: 'Test User',
        email,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };
      setUser(mockUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const mockUser: User = {
        id: 2,
        name,
        email,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };
      setUser(mockUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };
};

// React をモック
const React = {
  useState: vi.fn(),
};

vi.mock('react', () => React);

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // useState のモック実装
    let state: any;
    React.useState.mockImplementation((initial: any) => {
      if (state === undefined) state = initial;
      return [state, (newState: any) => { state = newState; }];
    });
  });

  it('should initialize with default values', () => {
    React.useState
      .mockReturnValueOnce([null, vi.fn()]) // user
      .mockReturnValueOnce([false, vi.fn()]) // isLoading
      .mockReturnValueOnce([null, vi.fn()]); // error

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle login successfully', async () => {
    const mockSetUser = vi.fn();
    const mockSetIsLoading = vi.fn();
    const mockSetError = vi.fn();

    React.useState
      .mockReturnValueOnce([null, mockSetUser]) // user
      .mockReturnValueOnce([false, mockSetIsLoading]) // isLoading
      .mockReturnValueOnce([null, mockSetError]); // error

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockSetError).toHaveBeenCalledWith(null);
    expect(mockSetUser).toHaveBeenCalledWith(expect.objectContaining({
      email: 'test@example.com',
      name: 'Test User',
    }));
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });

  it('should handle logout', () => {
    const mockSetUser = vi.fn();
    const mockSetError = vi.fn();

    React.useState
      .mockReturnValueOnce([{ id: 1, name: 'Test' }, mockSetUser]) // user
      .mockReturnValueOnce([false, vi.fn()]) // isLoading
      .mockReturnValueOnce([null, mockSetError]); // error

    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logout();
    });

    expect(mockSetUser).toHaveBeenCalledWith(null);
    expect(mockSetError).toHaveBeenCalledWith(null);
  });

  it('should handle registration successfully', async () => {
    const mockSetUser = vi.fn();
    const mockSetIsLoading = vi.fn();
    const mockSetError = vi.fn();

    React.useState
      .mockReturnValueOnce([null, mockSetUser]) // user
      .mockReturnValueOnce([false, mockSetIsLoading]) // isLoading
      .mockReturnValueOnce([null, mockSetError]); // error

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.register('New User', 'new@example.com', 'password');
    });

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockSetError).toHaveBeenCalledWith(null);
    expect(mockSetUser).toHaveBeenCalledWith(expect.objectContaining({
      name: 'New User',
      email: 'new@example.com',
    }));
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });

  it('should return correct isAuthenticated value', () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };

    React.useState
      .mockReturnValueOnce([mockUser, vi.fn()]) // user (authenticated)
      .mockReturnValueOnce([false, vi.fn()]) // isLoading
      .mockReturnValueOnce([null, vi.fn()]); // error

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(true);
  });
});
