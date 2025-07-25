import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteModal } from '@/components/DeleteModal';

// lucide-reactのモック
vi.mock('lucide-react', () => ({
  Lock: ({ className, color }: { className: string; color: string }) => (
    <div data-testid="lock-icon" className={className} data-color={color}>
      Lock Icon
    </div>
  ),
}));

describe('DeleteModal', () => {
  const mockOnOpenChange = vi.fn();
  const mockOnDelete = vi.fn();
  const testFileName = 'test-file.txt';

  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    onDelete: mockOnDelete,
    fileName: testFileName,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render when open is true', () => {
      render(<DeleteModal {...defaultProps} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(`${testFileName}を本当に削除しますか？`)).toBeInTheDocument();
    });

    it('should not render when open is false', () => {
      render(<DeleteModal {...defaultProps} open={false} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should display the correct file name in title', () => {
      const customFileName = 'custom-file.pdf';
      render(<DeleteModal {...defaultProps} fileName={customFileName} />);

      expect(screen.getByText(`${customFileName}を本当に削除しますか？`)).toBeInTheDocument();
    });
  });

  describe('Form Elements', () => {
    beforeEach(() => {
      render(<DeleteModal {...defaultProps} />);
    });

    it('should render password input field', () => {
      const passwordInput = screen.getByPlaceholderText('削除パスワード');

      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('maxLength', '100');
      expect(passwordInput).toHaveAttribute('autoComplete', 'off');
    });

    it('should render lock icon', () => {
      const lockIcon = screen.getByTestId('lock-icon');

      expect(lockIcon).toBeInTheDocument();
      expect(lockIcon).toHaveAttribute('data-color', '#00c8ff');
    });

    it('should render password label', () => {
      expect(screen.getByText('削除パスワード')).toBeInTheDocument();
    });

    it('should render character counter', () => {
      expect(screen.getByText('0 / 100')).toBeInTheDocument();
    });

    it('should render cancel button', () => {
      const cancelButton = screen.getByText('キャンセル');

      expect(cancelButton).toBeInTheDocument();
      expect(cancelButton).toHaveAttribute('type', 'button');
    });

    it('should render delete button', () => {
      const deleteButton = screen.getByText('削除実行');

      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toHaveAttribute('type', 'submit');
    });
  });

  describe('User Interactions', () => {
    it('should update password input value', async () => {
      const user = userEvent.setup();
      render(<DeleteModal {...defaultProps} />);

      const passwordInput = screen.getByPlaceholderText('削除パスワード');
      await user.type(passwordInput, 'test123');

      expect(passwordInput).toHaveValue('test123');
    });

    it('should update character counter when typing', async () => {
      const user = userEvent.setup();
      render(<DeleteModal {...defaultProps} />);

      const passwordInput = screen.getByPlaceholderText('削除パスワード');
      await user.type(passwordInput, 'test123');

      expect(screen.getByText('7 / 100')).toBeInTheDocument();
    });

    it('should call onOpenChange with false when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<DeleteModal {...defaultProps} />);

      const cancelButton = screen.getByText('キャンセル');
      await user.click(cancelButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('should clear password when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<DeleteModal {...defaultProps} />);

      const passwordInput = screen.getByPlaceholderText('削除パスワード');
      await user.type(passwordInput, 'test123');

      const cancelButton = screen.getByText('キャンセル');
      await user.click(cancelButton);

      expect(passwordInput).toHaveValue('');
    });
  });

  describe('Form Submission', () => {
    it('should call onDelete with password when form is submitted', async () => {
      const user = userEvent.setup();
      render(<DeleteModal {...defaultProps} />);

      const passwordInput = screen.getByPlaceholderText('削除パスワード');
      const deleteButton = screen.getByText('削除実行');

      await user.type(passwordInput, 'mypassword');
      await user.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledWith('mypassword');
    });

    it('should call onOpenChange with false after successful submission', async () => {
      const user = userEvent.setup();
      render(<DeleteModal {...defaultProps} />);

      const passwordInput = screen.getByPlaceholderText('削除パスワード');
      const deleteButton = screen.getByText('削除実行');

      await user.type(passwordInput, 'mypassword');
      await user.click(deleteButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('should clear password after successful submission', async () => {
      const user = userEvent.setup();
      render(<DeleteModal {...defaultProps} />);

      const passwordInput = screen.getByPlaceholderText('削除パスワード');
      const deleteButton = screen.getByText('削除実行');

      await user.type(passwordInput, 'mypassword');
      await user.click(deleteButton);

      expect(passwordInput).toHaveValue('');
    });

    it('should handle form submission with Enter key', async () => {
      const user = userEvent.setup();
      render(<DeleteModal {...defaultProps} />);

      const passwordInput = screen.getByPlaceholderText('削除パスワード');

      await user.type(passwordInput, 'mypassword');
      await user.keyboard('{Enter}');

      expect(mockOnDelete).toHaveBeenCalledWith('mypassword');
    });

    it('should handle empty password submission', async () => {
      const user = userEvent.setup();
      render(<DeleteModal {...defaultProps} />);

      const deleteButton = screen.getByText('削除実行');
      await user.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledWith('');
    });
  });

  describe('Password Validation', () => {
    it('should respect maxLength attribute', async () => {
      const user = userEvent.setup();
      render(<DeleteModal {...defaultProps} />);

      const passwordInput = screen.getByPlaceholderText('削除パスワード');
      const longPassword = 'a'.repeat(150); // 100文字を超える

      await user.type(passwordInput, longPassword);

      // maxLength="100"により、100文字までしか入力されない
      expect(passwordInput.value.length).toBeLessThanOrEqual(100);
    });

    it('should show correct character count for long input', async () => {
      const user = userEvent.setup();
      render(<DeleteModal {...defaultProps} />);

      const passwordInput = screen.getByPlaceholderText('削除パスワード');
      const password = 'a'.repeat(50);

      await user.type(passwordInput, password);

      expect(screen.getByText('50 / 100')).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('should have proper dialog styling', () => {
      render(<DeleteModal {...defaultProps} />);

      const dialog = screen.getByRole('dialog');

      expect(dialog).toHaveClass('cyber-dialog');
      expect(dialog).toHaveStyle({
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: '10000',
      });
    });

    it('should have proper form structure', () => {
      render(<DeleteModal {...defaultProps} />);

      const form = screen.getByRole('dialog').querySelector('form');

      expect(form).toBeInTheDocument();
      expect(form).toHaveStyle({
        padding: '36px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper dialog role', () => {
      render(<DeleteModal {...defaultProps} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('open');
    });

    it('should have proper form structure', () => {
      render(<DeleteModal {...defaultProps} />);

      const form = screen.getByRole('dialog').querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('should have accessible password input', () => {
      render(<DeleteModal {...defaultProps} />);

      const passwordInput = screen.getByPlaceholderText('削除パスワード');
      expect(passwordInput).toBeVisible();
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should have accessible buttons', () => {
      render(<DeleteModal {...defaultProps} />);

      const cancelButton = screen.getByText('キャンセル');
      const deleteButton = screen.getByText('削除実行');

      expect(cancelButton).toBeVisible();
      expect(deleteButton).toBeVisible();
    });
  });

  describe('Event Handling', () => {
    it('should prevent default form submission', () => {
      render(<DeleteModal {...defaultProps} />);

      const form = screen.getByRole('dialog').querySelector('form');
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });

      fireEvent(form!, submitEvent);

      expect(submitEvent.defaultPrevented).toBe(true);
    });
  });
});
