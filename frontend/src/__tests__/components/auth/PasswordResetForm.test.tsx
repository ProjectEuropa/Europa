import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PasswordResetForm } from '@/components/auth/PasswordResetForm';
import { usePasswordReset } from '@/hooks/usePasswordReset';

// モック
vi.mock('@/hooks/usePasswordReset');
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockCheckToken = vi.fn();
const mockResetPassword = vi.fn();

describe('PasswordResetForm', () => {
  const defaultProps = {
    token: 'valid-token',
    email: 'test@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePasswordReset).mockReturnValue({
      isLoading: false,
      sendResetLink: vi.fn(),
      checkToken: mockCheckToken,
      resetPassword: mockResetPassword,
    });
    mockCheckToken.mockResolvedValue({ isValid: true });
  });

  describe('Token Validation', () => {
    it('should validate token on mount', async () => {
      render(<PasswordResetForm {...defaultProps} />);

      await waitFor(() => {
        expect(mockCheckToken).toHaveBeenCalledWith({
          token: 'valid-token',
          email: 'test@example.com',
        });
      });
    });

    it('should show error for invalid token', async () => {
      mockCheckToken.mockResolvedValue({
        isValid: false,
        message: 'Invalid token',
      });

      render(<PasswordResetForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Invalid token')).toBeInTheDocument();
        expect(
          screen.getByText('パスワードリセットを再リクエスト')
        ).toBeInTheDocument();
      });
    });

    it('should show form for valid token', async () => {
      render(<PasswordResetForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByLabelText('新しいパスワード*')).toBeInTheDocument();
        expect(screen.getByLabelText('パスワード再確認*')).toBeInTheDocument();
      });
    });
  });

  describe('Form Rendering', () => {
    it('should render password reset form with valid token', async () => {
      render(<PasswordResetForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByLabelText('新しいパスワード*')).toBeInTheDocument();
        expect(screen.getByLabelText('パスワード再確認*')).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'パスワードを変更' })
        ).toBeInTheDocument();
      });
    });

    it('should have password visibility toggles', async () => {
      render(<PasswordResetForm {...defaultProps} />);

      await waitFor(() => {
        const toggleButtons =
          screen.getAllByLabelText(/パスワードを表示|パスワードを隠す/);
        expect(toggleButtons).toHaveLength(2);
      });
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for empty fields', async () => {
      const user = userEvent.setup();
      render(<PasswordResetForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByLabelText('新しいパスワード*')).toBeInTheDocument();
      });

      const submitButton = screen.getByRole('button', {
        name: 'パスワードを変更',
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('パスワードを入力してください')
        ).toBeInTheDocument();
        expect(
          screen.getByText('パスワード（確認）を入力してください')
        ).toBeInTheDocument();
      });
    });

    it('should show validation error for short password', async () => {
      const user = userEvent.setup();
      render(<PasswordResetForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByLabelText('新しいパスワード*')).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText('新しいパスワード*');
      await user.type(passwordInput, '123');

      const submitButton = screen.getByRole('button', {
        name: 'パスワードを変更',
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('パスワードは8文字以上で入力してください')
        ).toBeInTheDocument();
      });
    });

    it('should show validation error for password mismatch', async () => {
      const user = userEvent.setup();
      render(<PasswordResetForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByLabelText('新しいパスワード*')).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText('新しいパスワード*');
      const confirmPasswordInput = screen.getByLabelText('パスワード再確認*');

      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'different123');

      const submitButton = screen.getByRole('button', {
        name: 'パスワードを変更',
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('パスワードが一致しません')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      const user = userEvent.setup();
      mockResetPassword.mockResolvedValue({ success: true });

      render(<PasswordResetForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByLabelText('新しいパスワード*')).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText('新しいパスワード*');
      const confirmPasswordInput = screen.getByLabelText('パスワード再確認*');

      await user.type(passwordInput, 'newpassword123');
      await user.type(confirmPasswordInput, 'newpassword123');

      const submitButton = screen.getByRole('button', {
        name: 'パスワードを変更',
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockResetPassword).toHaveBeenCalledWith({
          token: 'valid-token',
          email: 'test@example.com',
          password: 'newpassword123',
          passwordConfirmation: 'newpassword123',
        });
      });
    });

    it('should show success message after successful reset', async () => {
      const user = userEvent.setup();
      mockResetPassword.mockResolvedValue({ success: true });

      render(<PasswordResetForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByLabelText('新しいパスワード*')).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText('新しいパスワード*');
      const confirmPasswordInput = screen.getByLabelText('パスワード再確認*');

      await user.type(passwordInput, 'newpassword123');
      await user.type(confirmPasswordInput, 'newpassword123');

      const submitButton = screen.getByRole('button', {
        name: 'パスワードを変更',
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('パスワードが正常に変更されました！')
        ).toBeInTheDocument();
        expect(screen.getByText('ログインページへ')).toBeInTheDocument();
      });
    });

    it('should show loading state during submission', async () => {
      vi.mocked(usePasswordReset).mockReturnValue({
        isLoading: true,
        sendResetLink: vi.fn(),
        checkToken: mockCheckToken,
        resetPassword: mockResetPassword,
      });

      render(<PasswordResetForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('処理中...')).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: '処理中...' })
        ).toBeDisabled();
      });
    });

    it('should call onSuccess callback when provided', async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();
      mockResetPassword.mockResolvedValue({ success: true });

      render(<PasswordResetForm {...defaultProps} onSuccess={onSuccess} />);

      await waitFor(() => {
        expect(screen.getByLabelText('新しいパスワード*')).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText('新しいパスワード*');
      const confirmPasswordInput = screen.getByLabelText('パスワード再確認*');

      await user.type(passwordInput, 'newpassword123');
      await user.type(confirmPasswordInput, 'newpassword123');

      const submitButton = screen.getByRole('button', {
        name: 'パスワードを変更',
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility', async () => {
      const user = userEvent.setup();
      render(<PasswordResetForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByLabelText('新しいパスワード*')).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText('新しいパスワード*');
      const toggleButtons = screen.getAllByLabelText('パスワードを表示');
      const passwordToggleButton = toggleButtons[0]; // 最初のパスワードフィールドのトグルボタン

      expect(passwordInput).toHaveAttribute('type', 'password');

      await user.click(passwordToggleButton);

      expect(passwordInput).toHaveAttribute('type', 'text');
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', async () => {
      render(<PasswordResetForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByLabelText('新しいパスワード*')).toBeInTheDocument();
        expect(screen.getByLabelText('パスワード再確認*')).toBeInTheDocument();
      });
    });

    it('should have proper input types', async () => {
      render(<PasswordResetForm {...defaultProps} />);

      await waitFor(() => {
        const passwordInput = screen.getByLabelText('新しいパスワード*');
        const confirmPasswordInput = screen.getByLabelText('パスワード再確認*');

        expect(passwordInput).toHaveAttribute('type', 'password');
        expect(confirmPasswordInput).toHaveAttribute('type', 'password');
      });
    });
  });
});
