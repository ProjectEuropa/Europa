import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useToast } from '@/hooks/useToast';

// sonnerのモック
vi.mock('@/components/ui/toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    custom: vi.fn(),
  },
}));

// Math.randomは実際の値を使用

describe('useToast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return toast function', () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.toast).toBeDefined();
    expect(typeof result.current.toast).toBe('function');
  });

  it('should call success toast with message', async () => {
    const { result } = renderHook(() => useToast());
    const { toast: toastUtils } = await import('@/components/ui/toast');

    act(() => {
      result.current.toast({
        type: 'success',
        title: 'Success',
        message: 'Operation completed',
      });
    });

    expect(toastUtils.success).toHaveBeenCalledWith('Success', {
      description: 'Operation completed',
      duration: 5000,
    });
  });

  it('should call error toast with message', async () => {
    const { result } = renderHook(() => useToast());
    const { toast: toastUtils } = await import('@/components/ui/toast');

    act(() => {
      result.current.toast({
        type: 'error',
        title: 'Error',
        message: 'Something went wrong',
      });
    });

    expect(toastUtils.error).toHaveBeenCalledWith('Error', {
      description: 'Something went wrong',
      duration: 5000,
    });
  });

  it('should call warning toast with message', async () => {
    const { result } = renderHook(() => useToast());
    const { toast: toastUtils } = await import('@/components/ui/toast');

    act(() => {
      result.current.toast({
        type: 'warning',
        title: 'Warning',
        message: 'Please be careful',
      });
    });

    expect(toastUtils.warning).toHaveBeenCalledWith('Warning', {
      description: 'Please be careful',
      duration: 5000,
    });
  });

  it('should call info toast with message', async () => {
    const { result } = renderHook(() => useToast());
    const { toast: toastUtils } = await import('@/components/ui/toast');

    act(() => {
      result.current.toast({
        type: 'info',
        title: 'Info',
        message: 'Here is some information',
      });
    });

    expect(toastUtils.info).toHaveBeenCalledWith('Info', {
      description: 'Here is some information',
      duration: 5000,
    });
  });

  it('should call toast without message', async () => {
    const { result } = renderHook(() => useToast());
    const { toast: toastUtils } = await import('@/components/ui/toast');

    act(() => {
      result.current.toast({
        type: 'success',
        title: 'Success',
      });
    });

    expect(toastUtils.success).toHaveBeenCalledWith('Success', {
      duration: 5000,
    });
  });

  it('should use custom duration', async () => {
    const { result } = renderHook(() => useToast());
    const { toast: toastUtils } = await import('@/components/ui/toast');

    act(() => {
      result.current.toast({
        type: 'success',
        title: 'Success',
        message: 'Custom duration',
        duration: 3000,
      });
    });

    expect(toastUtils.success).toHaveBeenCalledWith('Success', {
      description: 'Custom duration',
      duration: 3000,
    });
  });

  it('should return generated id', () => {
    const { result } = renderHook(() => useToast());

    let id: string;
    act(() => {
      id = result.current.toast({
        type: 'success',
        title: 'Success',
      });
    });

    expect(id).toBeDefined();
    expect(typeof id).toBe('string');
    expect(id?.length).toBeGreaterThan(0);
  });

  it('should call custom toast for unknown type', async () => {
    const { result } = renderHook(() => useToast());
    const { toast: toastUtils } = await import('@/components/ui/toast');

    act(() => {
      result.current.toast({
        type: 'unknown' as 'success' | 'error' | 'warning' | 'info',
        title: 'Unknown',
        message: 'Unknown type',
      });
    });

    expect(toastUtils.custom).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        type: 'unknown',
        title: 'Unknown',
        message: 'Unknown type',
        duration: 5000,
      })
    );
  });
});
