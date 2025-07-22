import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled button</Button>);
    const button = screen.getByRole('button', { name: 'Disabled button' });
    expect(button).toBeDisabled();
  });

  it('should apply variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toHaveClass('bg-destructive');
  });

  it('should apply size classes correctly', () => {
    render(<Button size="lg">Large button</Button>);
    const button = screen.getByRole('button', { name: 'Large button' });
    expect(button).toHaveClass('h-10');
  });
});
