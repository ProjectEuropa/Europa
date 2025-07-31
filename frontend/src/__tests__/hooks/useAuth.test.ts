import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';

// Zustand ストアをモック
vi.mock('@/stores/authStore');

const mockAuthStore = {
  user: null,
  token: null,
  loading: false,
  isAuthenticated: false,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  fetchUser: vi.fn(),
  setUser: vi.fn(),
};

describe('useAuth', () => {
  beforeEach(() => {
    vi.mocked(useAuthStore).mockReturnValue(mockAuthStore);
    vi.clearAllMocks();
  });

  it('should return auth state from store', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should return auth actions from store', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.login).toBe(mockAuthStore.login);
    expect(result.current.register).toBe(mockAuthStore.register);
    expect(result.current.logout).toBe(mockAuthStore.logout);
    expect(result.current.fetchUser).toBe(mockAuthStore.fetchUser);
    expect(result.current.setUser).toBe(mockAuthStore.setUser);
  });

  it('should fetch user when token exists but user is null', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      ...mockAuthStore,
      token: 'mock-token',
      user: null,
    });

    renderHook(() => useAuth());

    expect(mockAuthStore.fetchUser).toHaveBeenCalled();
  });

  it('should not fetch user when token is null', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      ...mockAuthStore,
      token: null,
      user: null,
    });

    renderHook(() => useAuth());

    expect(mockAuthStore.fetchUser).not.toHaveBeenCalled();
  });

  it('should not fetch user when user already exists', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      ...mockAuthStore,
      token: 'mock-token',
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: '2024-01-01',
      },
    });

    renderHook(() => useAuth());

    expect(mockAuthStore.fetchUser).not.toHaveBeenCalled();
  });

  it('should handle store state changes', () => {
    const { result, rerender } = renderHook(() => useAuth());

    // 初期状態
    expect(result.current.isAuthenticated).toBe(false);

    // ストアの状態を変更
    vi.mocked(useAuthStore).mockReturnValue({
      ...mockAuthStore,
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: '2024-01-01',
      },
      token: 'mock-token',
      isAuthenticated: true,
    });

    rerender();

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: '2024-01-01',
    });
  });

  it('should call login action', async () => {
    const { result } = renderHook(() => useAuth());
    const credentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    await act(async () => {
      await result.current.login(credentials);
    });

    expect(mockAuthStore.login).toHaveBeenCalledWith(credentials);
  });

  it('should call register action', async () => {
    const { result } = renderHook(() => useAuth());
    const credentials = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      passwordConfirmation: 'password123',
    };

    await act(async () => {
      await result.current.register(credentials);
    });

    expect(mockAuthStore.register).toHaveBeenCalledWith(credentials);
  });

  it('should call logout action', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logout();
    });

    expect(mockAuthStore.logout).toHaveBeenCalled();
  });

  it('should call setUser action', () => {
    const { result } = renderHook(() => useAuth());
    const user = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: '2024-01-01',
    };

    act(() => {
      result.current.setUser(user);
    });

    expect(mockAuthStore.setUser).toHaveBeenCalledWith(user);
  });
});
