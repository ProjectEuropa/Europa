import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '@/components/ui/pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render pagination with page numbers', () => {
    render(<Pagination {...defaultProps} />);

    // ページ番号が表示されることを確認
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should highlight current page', () => {
    render(<Pagination {...defaultProps} currentPage={3} />);

    const currentPageButton = screen.getByRole('button', { name: '3ページへ' });
    expect(currentPageButton).toHaveClass('bg-blue-600');
  });

  it('should call onPageChange when page is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

    const page2Button = screen.getByRole('button', { name: '2ページへ' });
    fireEvent.click(page2Button);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('should disable previous button on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);

    const prevButton = screen.getByRole('button', { name: '前のページへ' });
    expect(prevButton).toBeDisabled();
  });

  it('should disable next button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />);

    const nextButton = screen.getByRole('button', { name: '次のページへ' });
    expect(nextButton).toBeDisabled();
  });

  it('should show ellipsis for large page counts', () => {
    render(<Pagination {...defaultProps} totalPages={20} currentPage={10} />);

    const ellipsis = screen.getAllByText('...');
    expect(ellipsis.length).toBeGreaterThan(0);
  });
});
