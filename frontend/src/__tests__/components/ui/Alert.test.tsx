import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

// 仮想的なAlertコンポーネント
interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'warning' | 'success';
  className?: string;
  onClose?: () => void;
}

const Alert = ({
  children,
  variant = 'default',
  className = '',
  onClose,
}: AlertProps) => {
  const baseClasses = 'relative w-full rounded-lg border p-4';
  const variantClasses = {
    default: 'bg-background text-foreground border-border',
    destructive:
      'border-destructive/50 text-destructive dark:border-destructive',
    warning: 'border-yellow-500/50 text-yellow-600 dark:border-yellow-500',
    success: 'border-green-500/50 text-green-600 dark:border-green-500',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div className={classes} role="alert">
      {children}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-sm opacity-70 hover:opacity-100"
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
};

const AlertTitle = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`}>
    {children}
  </h5>
);

const AlertDescription = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`text-sm [&_p]:leading-relaxed ${className}`}>{children}</div>
);

describe('Alert Components', () => {
  describe('Alert', () => {
    it('should render alert with children', () => {
      render(<Alert>Test alert message</Alert>);
      expect(screen.getByText('Test alert message')).toBeInTheDocument();
    });

    it('should have alert role', () => {
      render(<Alert>Alert message</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should apply default variant classes', () => {
      render(<Alert>Default alert</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass(
        'bg-background',
        'text-foreground',
        'border-border'
      );
    });

    it('should apply destructive variant classes', () => {
      render(<Alert variant="destructive">Destructive alert</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('border-destructive/50', 'text-destructive');
    });

    it('should apply warning variant classes', () => {
      render(<Alert variant="warning">Warning alert</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('border-yellow-500/50', 'text-yellow-600');
    });

    it('should apply success variant classes', () => {
      render(<Alert variant="success">Success alert</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('border-green-500/50', 'text-green-600');
    });

    it('should apply custom className', () => {
      render(<Alert className="custom-class">Custom alert</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('custom-class');
    });

    it('should render close button when onClose is provided', () => {
      const onClose = vi.fn();
      render(<Alert onClose={onClose}>Closable alert</Alert>);

      const closeButton = screen.getByRole('button', { name: 'Close alert' });
      expect(closeButton).toBeInTheDocument();
    });

    it('should not render close button when onClose is not provided', () => {
      render(<Alert>Non-closable alert</Alert>);

      const closeButton = screen.queryByRole('button', { name: 'Close alert' });
      expect(closeButton).not.toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(<Alert onClose={onClose}>Closable alert</Alert>);

      const closeButton = screen.getByRole('button', { name: 'Close alert' });
      await user.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should apply base classes', () => {
      render(<Alert>Base alert</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass(
        'relative',
        'w-full',
        'rounded-lg',
        'border',
        'p-4'
      );
    });
  });

  describe('AlertTitle', () => {
    it('should render title with correct classes', () => {
      render(<AlertTitle>Alert Title</AlertTitle>);
      const title = screen.getByText('Alert Title');
      expect(title).toHaveClass(
        'mb-1',
        'font-medium',
        'leading-none',
        'tracking-tight'
      );
    });

    it('should apply custom className', () => {
      render(<AlertTitle className="custom-title">Custom Title</AlertTitle>);
      const title = screen.getByText('Custom Title');
      expect(title).toHaveClass('custom-title');
    });

    it('should render as h5 element', () => {
      render(<AlertTitle>Title</AlertTitle>);
      const title = screen.getByText('Title');
      expect(title.tagName).toBe('H5');
    });
  });

  describe('AlertDescription', () => {
    it('should render description with correct classes', () => {
      render(<AlertDescription>Alert description</AlertDescription>);
      const description = screen.getByText('Alert description');
      expect(description).toHaveClass('text-sm', '[&_p]:leading-relaxed');
    });

    it('should apply custom className', () => {
      render(
        <AlertDescription className="custom-desc">
          Custom Description
        </AlertDescription>
      );
      const description = screen.getByText('Custom Description');
      expect(description).toHaveClass('custom-desc');
    });

    it('should render as div element', () => {
      render(<AlertDescription>Description</AlertDescription>);
      const description = screen.getByText('Description');
      expect(description.tagName).toBe('DIV');
    });

    it('should render complex content', () => {
      render(
        <AlertDescription>
          <p>Paragraph content</p>
          <span>Span content</span>
        </AlertDescription>
      );

      expect(screen.getByText('Paragraph content')).toBeInTheDocument();
      expect(screen.getByText('Span content')).toBeInTheDocument();
    });
  });

  describe('Alert with Title and Description', () => {
    it('should render complete alert structure', () => {
      render(
        <Alert variant="warning">
          <AlertTitle>Warning Title</AlertTitle>
          <AlertDescription>
            This is a warning message with details.
          </AlertDescription>
        </Alert>
      );

      expect(screen.getByText('Warning Title')).toBeInTheDocument();
      expect(
        screen.getByText('This is a warning message with details.')
      ).toBeInTheDocument();

      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('border-yellow-500/50', 'text-yellow-600');
    });

    it('should render closable alert with title and description', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <Alert variant="success" onClose={onClose}>
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>Operation completed successfully.</AlertDescription>
        </Alert>
      );

      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(
        screen.getByText('Operation completed successfully.')
      ).toBeInTheDocument();

      const closeButton = screen.getByRole('button', { name: 'Close alert' });
      await user.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
