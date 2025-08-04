import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ButtonLoading, Loading, PageLoading } from '@/components/ui/loading';

describe('Loading', () => {
  it('should render loading spinner', () => {
    render(<Loading />);
    const spinner = screen.getByRole('status', { name: '読み込み中' });
    expect(spinner).toBeInTheDocument();
  });

  it('should render with text when provided', () => {
    render(<Loading text="データを読み込み中..." />);
    expect(screen.getByText('データを読み込み中...')).toBeInTheDocument();
  });

  it('should apply size classes correctly', () => {
    render(<Loading size="lg" />);
    const spinner = screen.getByRole('status');
    // Loadingコンポーネントの実装では、sizeMapのクラスがdivに適用されている
    expect(spinner).toHaveClass('w-8');
    expect(spinner).toHaveClass('h-8');
  });
});

describe('ButtonLoading', () => {
  it('should render button loading spinner', () => {
    render(<ButtonLoading />);
    const spinner = screen.getByRole('img', { hidden: true });
    expect(spinner).toBeInTheDocument();
  });
});

describe('PageLoading', () => {
  it('should render page loading overlay', () => {
    render(<PageLoading />);
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });
});
