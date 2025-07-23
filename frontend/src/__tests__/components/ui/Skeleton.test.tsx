import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton, TextSkeleton, CardSkeleton, TableRowSkeleton } from '@/components/ui/skeleton';

describe('Skeleton Components', () => {
  describe('Skeleton', () => {
    it('should render skeleton element', () => {
      render(<Skeleton data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toBeInTheDocument();
    });

    it('should apply default classes', () => {
      render(<Skeleton data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('animate-pulse', 'rounded', 'bg-gray-700/30');
    });

    it('should apply custom className', () => {
      render(<Skeleton data-testid="skeleton" className="custom-class" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('custom-class');
    });

    it('should apply default width and height styles', () => {
      render(<Skeleton data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveStyle({ width: '100%', height: '1rem' });
    });

    it('should apply custom width and height', () => {
      render(<Skeleton data-testid="skeleton" width="200px" height="50px" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveStyle({ width: '200px', height: '50px' });
    });
  });

  describe('TextSkeleton', () => {
    it('should render single line by default', () => {
      render(<TextSkeleton data-testid="text-skeleton" />);
      const container = screen.getByTestId('text-skeleton');
      expect(container).toBeInTheDocument();
      expect(container.children).toHaveLength(1);
    });

    it('should render multiple lines', () => {
      render(<TextSkeleton data-testid="text-skeleton" lines={3} />);
      const container = screen.getByTestId('text-skeleton');
      expect(container.children).toHaveLength(3);
    });

    it('should apply space-y-2 class', () => {
      render(<TextSkeleton data-testid="text-skeleton" />);
      const container = screen.getByTestId('text-skeleton');
      expect(container).toHaveClass('space-y-2');
    });

    it('should apply custom className', () => {
      render(<TextSkeleton data-testid="text-skeleton" className="custom-class" />);
      const container = screen.getByTestId('text-skeleton');
      expect(container).toHaveClass('custom-class');
    });

    it('should make last line shorter when multiple lines', () => {
      render(<TextSkeleton data-testid="text-skeleton" lines={2} />);
      const container = screen.getByTestId('text-skeleton');
      const lastChild = container.children[1];
      expect(lastChild).toHaveClass('w-4/5');
    });
  });

  describe('CardSkeleton', () => {
    it('should render card skeleton structure', () => {
      render(<CardSkeleton data-testid="card-skeleton" />);
      const cardContainer = screen.getByTestId('card-skeleton');
      expect(cardContainer).toHaveClass('border', 'border-gray-700', 'rounded-xl', 'p-6', 'space-y-4');
    });

    it('should contain header, content, and footer skeletons', () => {
      const { container } = render(<CardSkeleton />);
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('TableRowSkeleton', () => {
    it('should render default number of columns', () => {
      const { container } = render(<TableRowSkeleton />);
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons).toHaveLength(4); // default columns
    });

    it('should render custom number of columns', () => {
      const { container } = render(<TableRowSkeleton columns={6} />);
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons).toHaveLength(6);
    });

    it('should apply flex layout classes', () => {
      const { container } = render(<TableRowSkeleton />);
      const rowContainer = container.firstChild;
      expect(rowContainer).toHaveClass('flex', 'items-center', 'space-x-4', 'py-3');
    });

    it('should apply different widths to columns', () => {
      const { container } = render(<TableRowSkeleton columns={3} />);
      const skeletons = container.querySelectorAll('.animate-pulse');

      expect(skeletons[0]).toHaveClass('w-1/6'); // first column
      expect(skeletons[1]).toHaveClass('w-1/4'); // middle column
      expect(skeletons[2]).toHaveClass('w-1/12'); // last column
    });
  });
});
