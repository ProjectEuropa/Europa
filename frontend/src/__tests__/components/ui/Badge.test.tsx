import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

// 仮想的なBadgeコンポーネント
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}: BadgeProps & React.HTMLAttributes<HTMLSpanElement>) => {
  const baseClasses = 'inline-flex items-center rounded-full font-medium';
  const variantClasses = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
    outline: 'border border-input bg-background text-foreground',
  };
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

describe('Badge', () => {
  it('should render badge with children', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('should apply default variant classes', () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText('Default Badge');
    expect(badge).toHaveClass('bg-primary', 'text-primary-foreground');
  });

  it('should apply secondary variant classes', () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>);
    const badge = screen.getByText('Secondary Badge');
    expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground');
  });

  it('should apply destructive variant classes', () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>);
    const badge = screen.getByText('Destructive Badge');
    expect(badge).toHaveClass('bg-destructive', 'text-destructive-foreground');
  });

  it('should apply outline variant classes', () => {
    render(<Badge variant="outline">Outline Badge</Badge>);
    const badge = screen.getByText('Outline Badge');
    expect(badge).toHaveClass(
      'border',
      'border-input',
      'bg-background',
      'text-foreground'
    );
  });

  it('should apply default size classes', () => {
    render(<Badge>Medium Badge</Badge>);
    const badge = screen.getByText('Medium Badge');
    expect(badge).toHaveClass('px-2.5', 'py-0.5', 'text-sm');
  });

  it('should apply small size classes', () => {
    render(<Badge size="sm">Small Badge</Badge>);
    const badge = screen.getByText('Small Badge');
    expect(badge).toHaveClass('px-2', 'py-0.5', 'text-xs');
  });

  it('should apply large size classes', () => {
    render(<Badge size="lg">Large Badge</Badge>);
    const badge = screen.getByText('Large Badge');
    expect(badge).toHaveClass('px-3', 'py-1', 'text-base');
  });

  it('should apply custom className', () => {
    render(<Badge className="custom-class">Custom Badge</Badge>);
    const badge = screen.getByText('Custom Badge');
    expect(badge).toHaveClass('custom-class');
  });

  it('should apply base classes', () => {
    render(<Badge>Base Badge</Badge>);
    const badge = screen.getByText('Base Badge');
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'rounded-full',
      'font-medium'
    );
  });

  it('should render with different content types', () => {
    render(
      <Badge>
        <span>Icon</span>
        Text Content
      </Badge>
    );
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text Content')).toBeInTheDocument();
  });

  it('should combine variant and size classes correctly', () => {
    render(
      <Badge variant="destructive" size="lg">
        Large Destructive
      </Badge>
    );
    const badge = screen.getByText('Large Destructive');
    expect(badge).toHaveClass(
      'bg-destructive',
      'text-destructive-foreground',
      'px-3',
      'py-1',
      'text-base'
    );
  });

  it('should handle empty children', () => {
    render(<Badge data-testid="empty-badge"></Badge>);
    const badge = screen.getByTestId('empty-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('inline-flex');
  });

  it('should render as span element', () => {
    render(<Badge>Span Badge</Badge>);
    const badge = screen.getByText('Span Badge');
    expect(badge.tagName).toBe('SPAN');
  });
});
