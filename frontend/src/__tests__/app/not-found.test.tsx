import { render, screen } from '@testing-library/react';
import NotFound from '@/app/not-found';
import { describe, it, expect } from 'vitest';

describe('NotFound Page', () => {
  it('should render 404 heading and message', () => {
    render(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('ページが見つかりません')).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    render(<NotFound />);

    const homeLink = screen.getByRole('link', { name: /トップへ戻る/i });
    expect(homeLink).toHaveAttribute('href', '/');

    const searchLink = screen.getByRole('link', { name: /データ検索/i });
    expect(searchLink).toHaveAttribute('href', '/search/team');
  });
});
