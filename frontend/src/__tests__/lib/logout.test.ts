import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { logout } from '@/lib/logout';
import { authApi } from '@/lib/api/auth';

// Mock authApi
vi.mock('@/lib/api/auth', () => ({
  authApi: {
    logout: vi.fn(),
  },
}));

// localStorage のモック
const localStorageMock = {
  removeItem: vi.fn(),
};

// window.location のモック
const locationMock = {
  href: '',
};

describe('logout', () => {
  beforeEach(() => {
    // localStorage をモック
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    // window.location をモック
    Object.defineProperty(window, 'location', {
      value: locationMock,
      writable: true,
    });

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call authApi.logout and redirect to login page', async () => {
    await logout();

    expect(authApi.logout).toHaveBeenCalled();
    expect(locationMock.href).toBe('/login');
  });

  it('should redirect even if authApi.logout fails', async () => {
    vi.mocked(authApi.logout).mockRejectedValueOnce(new Error('Logout failed'));

    await logout();

    expect(authApi.logout).toHaveBeenCalled();
    expect(locationMock.href).toBe('/login');
  });
});
