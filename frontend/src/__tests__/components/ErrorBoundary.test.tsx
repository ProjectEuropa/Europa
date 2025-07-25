import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary, ErrorFallback } from '@/components/ErrorBoundary';

// エラーを投げるコンポーネント
const ErrorThrowingComponent = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('テストエラー');
  }
  return <div>正常なコンポーネント</div>;
};

// コンソールエラーを抑制（テスト中のエラーログを防ぐため）
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
  return () => {
    console.error = originalConsoleError;
  };
});

describe('ErrorBoundary', () => {
  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>正常なコンテンツ</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('正常なコンテンツ')).toBeInTheDocument();
  });

  it('should render default error UI when error occurs', () => {
    // Reactのエラー境界をテストするには、エラーを抑制する必要がある
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    expect(screen.getByText('テストエラー')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '再試行' })).toBeInTheDocument();
  });

  it('should render custom fallback when provided', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<div>カスタムエラー表示</div>}>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('カスタムエラー表示')).toBeInTheDocument();
  });
});

describe('ErrorFallback', () => {
  it('should render error message', () => {
    const error = new Error('テストエラーメッセージ');
    render(<ErrorFallback error={error} />);

    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    expect(screen.getByText('テストエラーメッセージ')).toBeInTheDocument();
  });

  it('should call onReset when reset button is clicked', () => {
    const onReset = vi.fn();
    render(<ErrorFallback error={new Error('エラー')} onReset={onReset} />);

    const resetButton = screen.getByRole('button', { name: '再試行' });
    resetButton.click();

    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
