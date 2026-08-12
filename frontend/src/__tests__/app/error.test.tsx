import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '@/app/error';
import { describe, it, expect, vi } from 'vitest';

describe('Error Boundary Page', () => {
  it('should render error message and reset button', () => {
    const error = new Error('Test error');
    const reset = vi.fn();

    render(<ErrorBoundary error={error} reset={reset} />);

    expect(screen.getByText('予期せぬエラーが発生しました')).toBeInTheDocument();

    const resetButton = screen.getByRole('button', { name: /再試行する/i });
    expect(resetButton).toBeInTheDocument();

    fireEvent.click(resetButton);
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it('should render link to home', () => {
    const error = new Error('Test error');
    const reset = vi.fn();

    render(<ErrorBoundary error={error} reset={reset} />);

    const homeLink = screen.getByRole('link', { name: /トップへ戻る/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
