import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

describe('Card Components', () => {
  describe('Card', () => {
    it('should render card element', () => {
      render(<Card data-testid="card">Card content</Card>);
      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveTextContent('Card content');
    });

    it('should apply default classes', () => {
      render(<Card data-testid="card" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass(
        'bg-card',
        'text-card-foreground',
        'flex',
        'flex-col',
        'gap-6',
        'rounded-xl',
        'border',
        'py-6',
        'shadow-sm'
      );
    });

    it('should apply custom className', () => {
      render(<Card data-testid="card" className="custom-class" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('custom-class');
    });

    it('should have correct data-slot attribute', () => {
      render(<Card data-testid="card" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('data-slot', 'card');
    });
  });

  describe('CardHeader', () => {
    it('should render card header element', () => {
      render(<CardHeader data-testid="card-header">Header content</CardHeader>);
      const header = screen.getByTestId('card-header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent('Header content');
    });

    it('should apply default classes', () => {
      render(<CardHeader data-testid="card-header" />);
      const header = screen.getByTestId('card-header');
      expect(header).toHaveClass(
        '@container/card-header',
        'grid',
        'auto-rows-min'
      );
    });

    it('should have correct data-slot attribute', () => {
      render(<CardHeader data-testid="card-header" />);
      const header = screen.getByTestId('card-header');
      expect(header).toHaveAttribute('data-slot', 'card-header');
    });
  });

  describe('CardTitle', () => {
    it('should render card title element', () => {
      render(<CardTitle data-testid="card-title">Title content</CardTitle>);
      const title = screen.getByTestId('card-title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Title content');
    });

    it('should apply default classes', () => {
      render(<CardTitle data-testid="card-title" />);
      const title = screen.getByTestId('card-title');
      expect(title).toHaveClass('leading-none', 'font-semibold');
    });

    it('should have correct data-slot attribute', () => {
      render(<CardTitle data-testid="card-title" />);
      const title = screen.getByTestId('card-title');
      expect(title).toHaveAttribute('data-slot', 'card-title');
    });
  });

  describe('CardDescription', () => {
    it('should render card description element', () => {
      render(
        <CardDescription data-testid="card-description">
          Description content
        </CardDescription>
      );
      const description = screen.getByTestId('card-description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveTextContent('Description content');
    });

    it('should apply default classes', () => {
      render(<CardDescription data-testid="card-description" />);
      const description = screen.getByTestId('card-description');
      expect(description).toHaveClass('text-muted-foreground', 'text-sm');
    });

    it('should have correct data-slot attribute', () => {
      render(<CardDescription data-testid="card-description" />);
      const description = screen.getByTestId('card-description');
      expect(description).toHaveAttribute('data-slot', 'card-description');
    });
  });

  describe('CardAction', () => {
    it('should render card action element', () => {
      render(<CardAction data-testid="card-action">Action content</CardAction>);
      const action = screen.getByTestId('card-action');
      expect(action).toBeInTheDocument();
      expect(action).toHaveTextContent('Action content');
    });

    it('should apply default classes', () => {
      render(<CardAction data-testid="card-action" />);
      const action = screen.getByTestId('card-action');
      expect(action).toHaveClass(
        'col-start-2',
        'row-span-2',
        'row-start-1',
        'self-start',
        'justify-self-end'
      );
    });

    it('should have correct data-slot attribute', () => {
      render(<CardAction data-testid="card-action" />);
      const action = screen.getByTestId('card-action');
      expect(action).toHaveAttribute('data-slot', 'card-action');
    });
  });

  describe('CardContent', () => {
    it('should render card content element', () => {
      render(<CardContent data-testid="card-content">Content</CardContent>);
      const content = screen.getByTestId('card-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('Content');
    });

    it('should apply default classes', () => {
      render(<CardContent data-testid="card-content" />);
      const content = screen.getByTestId('card-content');
      expect(content).toHaveClass('px-6');
    });

    it('should have correct data-slot attribute', () => {
      render(<CardContent data-testid="card-content" />);
      const content = screen.getByTestId('card-content');
      expect(content).toHaveAttribute('data-slot', 'card-content');
    });
  });

  describe('CardFooter', () => {
    it('should render card footer element', () => {
      render(<CardFooter data-testid="card-footer">Footer content</CardFooter>);
      const footer = screen.getByTestId('card-footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveTextContent('Footer content');
    });

    it('should apply default classes', () => {
      render(<CardFooter data-testid="card-footer" />);
      const footer = screen.getByTestId('card-footer');
      expect(footer).toHaveClass('flex', 'items-center', 'px-6');
    });

    it('should have correct data-slot attribute', () => {
      render(<CardFooter data-testid="card-footer" />);
      const footer = screen.getByTestId('card-footer');
      expect(footer).toHaveAttribute('data-slot', 'card-footer');
    });
  });

  describe('Card composition', () => {
    it('should render complete card structure', () => {
      render(
        <Card data-testid="card">
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
            <CardAction>Action</CardAction>
          </CardHeader>
          <CardContent>Test Content</CardContent>
          <CardFooter>Test Footer</CardFooter>
        </Card>
      );

      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
      expect(screen.getByText('Test Footer')).toBeInTheDocument();
    });
  });
});
