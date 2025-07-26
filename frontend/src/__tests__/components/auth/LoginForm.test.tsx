import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

// モック
vi.mock('@/hooks/useAuth');
vi.mock('@/hooks/useToast');
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockLogin = vi.fn();
const mockToast = vi.fn();

describe('LoginForm', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
      user: null,
      token: null,
      loading: false,
      isAuthenticated: false,
      register: vi.fn(),
      logout: vi.fn(),
      fetchUser: vi.fn(),
      setUser: vi.fn(),
    });

    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
    });

    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render login form', () => {
      render(<LoginForm />);

      expect(screen.getByLabelText(/メールアドレス/)).toBeInTheDocument();
      expect(screen.getByLabelText(/パスワード/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument();
    });

    it('should render required indicators', () => {
      render(<LoginForm />);

      const requiredIndicators = screen.getAllByText('*');
      expect(requiredIndicators).toHaveLength(2);
    });
  });

  describe('Form Validation', () => {
    it('should not call login with empty fields', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const submitButton = screen.getByRole('button', { name: 'ログイン' });
      await user.click(submitButton);

      // バリデーションエラーによりloginが呼ばれないことを確認
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('should not call login with invalid email', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/メールアドレス/);
      await user.type(emailInput, 'invalid-email');

      const submitButton = screen.getByRole('button', { name: 'ログイン' });
      await user.click(submitButton);

      // バリデーションエラーによりloginが呼ばれないことを確認
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('should not call login with short password', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const passwordInput = screen.getByLabelText(/パスワード/);
      await user.type(passwordInput, '123');

      const submitButton = screen.getByRole('button', { name: 'ログイン' });
      await user.click(submitButton);

      // バリデーションエラーによりloginが呼ばれないことを確認
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue(undefined);

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/メールアドレス/);
      const passwordInput = screen.getByLabelText(/パスワード/);
      const submitButton = screen.getByRole('button', { name: 'ログイン' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      let resolveLogin: () => void;
      const loginPromise = new Promise<void>((resolve) => {
        resolveLogin = resolve;
      });
      mockLogin.mockReturnValue(loginPromise);

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/メールアドレス/);
      const passwordInput = screen.getByLabelText(/パスワード/);
      const submitButton = screen.getByRole('button', { name: 'ログイン' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // ローディング状態を確認
      expect(screen.getByText('ログイン中...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      // ログインを完了
      resolveLogin!();
      await loginPromise;

      await waitFor(() => {
        expect(screen.getByText('ログイン')).toBeInTheDocument();
      });
    });

    it('should show success toast on successful login', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue(undefined);

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/メールアドレス/);
      const passwordInput = screen.getByLabelText(/パスワード/);
      const submitButton = screen.getByRole('button', { name: 'ログイン' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          type: 'success',
          title: 'ログイン成功',
          message: 'ログインしました',
        });
      });
    });

    it('should handle 401 error', async () => {
      const user = userEvent.setup();
      const error = { status: 401, message: 'Unauthorized' };
      mockLogin.mockRejectedValue(error);

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/メールアドレス/);
      const passwordInput = screen.getByLabelText(/パスワード/);
      const submitButton = screen.getByRole('button', { name: 'ログイン' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getAllByText('メールアドレスまたはパスワードが正しくありません')).toHaveLength(2);
      });
    });

    it('should handle validation errors from API', async () => {
      const user = userEvent.setup();
      const error = {
        status: 422,
        data: {
          errors: {
            email: ['メールアドレスの形式が正しくありません'],
            password: ['パスワードが短すぎます'],
          },
        },
      };
      mockLogin.mockRejectedValue(error);

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/メールアドレス/);
      const passwordInput = screen.getByLabelText(/パスワード/);
      const submitButton = screen.getByRole('button', { name: 'ログイン' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('有効なメールアドレスを入力してください。')).toBeInTheDocument();
        expect(screen.getByText('パスワードは6文字以上で入力してください。')).toBeInTheDocument();
      });
    });

    it('should handle generic errors', async () => {
      const user = userEvent.setup();
      const error = { message: 'Network error' };
      mockLogin.mockRejectedValue(error);

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/メールアドレス/);
      const passwordInput = screen.getByLabelText(/パスワード/);
      const submitButton = screen.getByRole('button', { name: 'ログイン' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          type: 'error',
          title: 'ログインエラー',
          message: '接続に問題があります。しばらくしてから再試行してください。',
        });
      });
    });
  });

  describe('Props', () => {
    it('should call onSuccess callback', async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();
      mockLogin.mockResolvedValue(undefined);

      render(<LoginForm onSuccess={onSuccess} />);

      const emailInput = screen.getByLabelText(/メールアドレス/);
      const passwordInput = screen.getByLabelText(/パスワード/);
      const submitButton = screen.getByRole('button', { name: 'ログイン' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      render(<LoginForm />);

      expect(screen.getByLabelText(/メールアドレス/)).toBeInTheDocument();
      expect(screen.getByLabelText(/パスワード/)).toBeInTheDocument();
    });

    it('should have proper input types', () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/メールアドレス/);
      const passwordInput = screen.getByLabelText(/パスワード/);

      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });
});
