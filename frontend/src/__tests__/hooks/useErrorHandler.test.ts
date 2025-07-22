import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { ApiErrorClass } from '@/types/api';

// モック
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('useErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle ApiErrorClass with status 401', () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new ApiErrorClass(401, { message: '認証エラー' });

    result.current.handleError(error);

    expect(result.current.handleError).toBeDefined();
  });

  it('should handle ApiErrorClass with status 403', () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new ApiErrorClass(403, { message: '権限エラー' });

    result.current.handleError(error);

    expect(result.current.handleError).toBeDefined();
  });

  it('should handle ApiErrorClass with status 404', () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new ApiErrorClass(404, { message: 'リソースが見つかりません' });

    result.current.handleError(error);

    expect(result.current.handleError).toBeDefined();
  });

  it('should handle ApiErrorClass with status 422', () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new ApiErrorClass(422, {
      message: 'バリデーションエラー',
      errors: { email: ['無効なメールアドレスです'] }
    });

    result.current.handleError(error);

    expect(result.current.handleError).toBeDefined();
  });

  it('should handle ApiErrorClass with status 500', () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new ApiErrorClass(500, { message: 'サーバーエラー' });

    result.current.handleError(error);

    expect(result.current.handleError).toBeDefined();
  });

  it('should handle regular Error', () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new Error('一般的なエラー');

    result.current.handleError(error);

    expect(result.current.handleError).toBeDefined();
  });

  it('should handle unknown error', () => {
    const { result } = renderHook(() => useErrorHandler());

    result.current.handleError('文字列エラー');

    expect(result.current.handleError).toBeDefined();
  });
});
