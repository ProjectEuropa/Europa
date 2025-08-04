import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { logout } from '@/lib/logout';

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

  it('should remove token from localStorage', () => {
    logout();

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
  });

  it('should redirect to login page', () => {
    logout();

    expect(locationMock.href).toBe('/login');
  });

  it('should perform both actions when called', () => {
    logout();

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(locationMock.href).toBe('/login');
  });
});
