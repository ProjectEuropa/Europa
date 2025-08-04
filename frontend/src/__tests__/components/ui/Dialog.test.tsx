import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

describe('Dialog Components', () => {
  describe('Dialog', () => {
    it('should render dialog trigger and content', async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Test Dialog</DialogTitle>
              <DialogDescription>This is a test dialog</DialogDescription>
            </DialogHeader>
            <div>Dialog content</div>
            <DialogFooter>
              <DialogClose>Close</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      // Initially, dialog content should not be visible
      expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();

      // Click trigger to open dialog
      const trigger = screen.getByText('Open Dialog');
      await user.click(trigger);

      // Dialog content should now be visible
      expect(screen.getByText('Test Dialog')).toBeInTheDocument();
      expect(screen.getByText('This is a test dialog')).toBeInTheDocument();
      expect(screen.getByText('Dialog content')).toBeInTheDocument();
    });

    it('should close dialog when close button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Test Dialog</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <DialogClose>Close</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      // Open dialog
      await user.click(screen.getByText('Open Dialog'));
      expect(screen.getByText('Test Dialog')).toBeInTheDocument();

      // Close dialog (click the footer close button, not the X button)
      const closeButtons = screen.getAllByRole('button', { name: 'Close' });
      await user.click(closeButtons[0]); // First one is the footer button

      // Wait for dialog to close
      await vi.waitFor(() => {
        expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
      });
    });

    it('should close dialog when X button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Test Dialog</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );

      // Open dialog
      await user.click(screen.getByText('Open Dialog'));
      expect(screen.getByText('Test Dialog')).toBeInTheDocument();

      // Close dialog using X button
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      // Wait for dialog to close
      await vi.waitFor(() => {
        expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
      });
    });

    it('should close dialog when escape key is pressed', async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Test Dialog</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );

      // Open dialog
      await user.click(screen.getByText('Open Dialog'));
      expect(screen.getByText('Test Dialog')).toBeInTheDocument();

      // Press escape to close
      await user.keyboard('{Escape}');

      // Wait for dialog to close
      await vi.waitFor(() => {
        expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('DialogContent', () => {
    it('should apply default classes', async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent data-testid="dialog-content">Content</DialogContent>
        </Dialog>
      );

      await user.click(screen.getByText('Open'));

      const content = screen.getByTestId('dialog-content');
      expect(content).toHaveClass(
        'fixed',
        'left-1/2',
        'top-1/2',
        'z-50',
        'grid',
        'w-full',
        'max-w-lg'
      );
    });

    it('should apply custom className', async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent data-testid="dialog-content" className="custom-class">
            Content
          </DialogContent>
        </Dialog>
      );

      await user.click(screen.getByText('Open'));

      const content = screen.getByTestId('dialog-content');
      expect(content).toHaveClass('custom-class');
    });
  });

  describe('DialogHeader', () => {
    it('should render header with correct classes', () => {
      render(<DialogHeader data-testid="dialog-header">Header</DialogHeader>);
      const header = screen.getByTestId('dialog-header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass(
        'flex',
        'flex-col',
        'space-y-1.5',
        'text-center',
        'sm:text-left'
      );
    });

    it('should apply custom className', () => {
      render(
        <DialogHeader data-testid="dialog-header" className="custom-class">
          Header
        </DialogHeader>
      );
      const header = screen.getByTestId('dialog-header');
      expect(header).toHaveClass('custom-class');
    });
  });

  describe('DialogTitle', () => {
    it('should render title with correct classes', async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle data-testid="dialog-title">Test Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      await user.click(screen.getByText('Open'));

      const title = screen.getByTestId('dialog-title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass(
        'text-lg',
        'font-semibold',
        'leading-none',
        'tracking-tight'
      );
      expect(title).toHaveTextContent('Test Title');
    });
  });

  describe('DialogDescription', () => {
    it('should render description with correct classes', async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogDescription data-testid="dialog-description">
              Test Description
            </DialogDescription>
          </DialogContent>
        </Dialog>
      );

      await user.click(screen.getByText('Open'));

      const description = screen.getByTestId('dialog-description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass('text-sm', 'text-muted-foreground');
      expect(description).toHaveTextContent('Test Description');
    });
  });

  describe('DialogFooter', () => {
    it('should render footer with correct classes', () => {
      render(<DialogFooter data-testid="dialog-footer">Footer</DialogFooter>);
      const footer = screen.getByTestId('dialog-footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass(
        'flex',
        'flex-col-reverse',
        'sm:flex-row',
        'sm:justify-end',
        'sm:space-x-2'
      );
    });

    it('should apply custom className', () => {
      render(
        <DialogFooter data-testid="dialog-footer" className="custom-class">
          Footer
        </DialogFooter>
      );
      const footer = screen.getByTestId('dialog-footer');
      expect(footer).toHaveClass('custom-class');
    });
  });
});
