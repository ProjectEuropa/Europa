import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Toaster, toast } from '@/components/ui/toast';

// sonnerのモック
vi.mock('sonner', () => ({
  Toaster: ({ children, ...props }: any) => (
    <div data-testid="toaster" {...props}>
      {children}
    </div>
  ),
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    custom: vi.fn(),
  },
}));

describe('Toaster', () => {
  it('should render toaster component', () => {
    render(<Toaster />);
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
  });

  it('should apply correct toast options', () => {
    render(<Toaster />);
    const toaster = screen.getByTestId('toaster');

    expect(toaster).toHaveAttribute('position', 'top-right');
  });
});

describe('toast utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should call success toast', async () => {
    const mockToast = await import('sonner');

    await act(async () => {
      toast.success('Success message');
    });

    expect(mockToast.toast.success).toHaveBeenCalledWith('Success message', undefined);
  });

  it('should call error toast', async () => {
    const mockToast = await import('sonner');

    await act(async () => {
      toast.error('Error message');
    });

    expect(mockToast.toast.error).toHaveBeenCalledWith('Error message', undefined);
  });

  it('should call warning toast', async () => {
    const mockToast = await import('sonner');

    await act(async () => {
      toast.warning('Warning message');
    });

    expect(mockToast.toast.warning).toHaveBeenCalledWith('Warning message', undefined);
  });

  it('should call info toast', async () => {
    const mockToast = await import('sonner');

    await act(async () => {
      toast.info('Info message');
    });

    expect(mockToast.toast.info).toHaveBeenCalledWith('Info message', undefined);
  });

  it('should call custom toast with options', async () => {
    const mockToast = await import('sonner');
    const customOptions = { duration: 3000 };

    await act(async () => {
      toast.success('Success message', customOptions);
    });

    expect(mockToast.toast.success).toHaveBeenCalledWith('Success message', customOptions);
  });
});
