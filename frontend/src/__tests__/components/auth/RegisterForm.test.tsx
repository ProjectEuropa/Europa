import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

// モック
vi.mock('@/hooks/useAuth');
vi.mock('@/hooks/useToast');
vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(selector => {
    const store = { verifyOtp: mockVerifyOtp };
    return selector ? selector(store) : store;
  }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockRegister = vi.fn();
const mockVerifyOtp = vi.fn();
const mockToast = vi.fn();

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      register: mockRegister,
      user: null,
      token: null,
      loading: false,
      isAuthenticated: false,
      hasHydrated: true,
      login: vi.fn(),
      logout: vi.fn(),
      fetchUser: vi.fn(),
      setUser: vi.fn(),
    });
    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
    });
  });

  describe('Rendering', () => {
    it('should render registration form with all required fields', () => {
      render(<RegisterForm />);

      // 基本的なフォーム要素の存在確認
      expect(screen.getByPlaceholderText('ユーザー名を入力')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('メールアドレスを入力')
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText('6文字以上のパスワード')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('パスワードを再入力')
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: '登録する' })
      ).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('should show validation errors for empty form submission', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      const submitButton = screen.getByRole('button', { name: '登録する' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).not.toHaveBeenCalled();
      });
    });

    it('should show validation error for invalid email format', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      const emailInput = screen.getByPlaceholderText('メールアドレスを入力');
      await user.type(emailInput, 'invalid-email');

      const submitButton = screen.getByRole('button', { name: '登録する' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).not.toHaveBeenCalled();
      });
    });
  });

  describe('Registration & 2FA Flow', () => {
    it('should switch to OTP step when backend requires 2FA', async () => {
      const user = userEvent.setup();
      mockRegister.mockResolvedValue({
        requires2FA: true,
        sessionToken: 'test-session-token',
        maskedEmail: 't***@example.com',
        expiresIn: 600,
      });

      render(<RegisterForm />);

      // 有効なデータを入力
      await user.type(screen.getByPlaceholderText('ユーザー名を入力'), 'Test User');
      await user.type(
        screen.getByPlaceholderText('メールアドレスを入力'),
        'test@example.com'
      );
      await user.type(
        screen.getByPlaceholderText('6文字以上のパスワード'),
        'password123'
      );
      await user.type(
        screen.getByPlaceholderText('パスワードを再入力'),
        'password123'
      );

      const submitButton = screen.getByRole('button', { name: '登録する' });
      await user.click(submitButton);

      // OTP画面に切り替わることを確認
      await waitFor(() => {
        expect(screen.getByLabelText(/確認コード/)).toBeInTheDocument();
        expect(screen.getByText(/メールアドレス確認/)).toBeInTheDocument();
        expect(screen.getByText(/t\*\*\*@example\.com/)).toBeInTheDocument();
      });

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'info',
          title: '確認コードを送信しました',
        })
      );
    });

    it('should complete registration and login when OTP code is verified', async () => {
      const user = userEvent.setup();
      const mockOnSuccess = vi.fn();
      mockRegister.mockResolvedValue({
        requires2FA: true,
        sessionToken: 'test-session-token',
        maskedEmail: 't***@example.com',
        expiresIn: 600,
      });
      mockVerifyOtp.mockResolvedValue(undefined);

      render(<RegisterForm onSuccess={mockOnSuccess} />);

      // フォーム入力
      await user.type(screen.getByPlaceholderText('ユーザー名を入力'), 'Test User');
      await user.type(
        screen.getByPlaceholderText('メールアドレスを入力'),
        'test@example.com'
      );
      await user.type(
        screen.getByPlaceholderText('6文字以上のパスワード'),
        'password123'
      );
      await user.type(
        screen.getByPlaceholderText('パスワードを再入力'),
        'password123'
      );

      await user.click(screen.getByRole('button', { name: '登録する' }));

      // OTP画面が表示されるのを待機
      await waitFor(() => {
        expect(screen.getByLabelText(/確認コード/)).toBeInTheDocument();
      });

      // 6桁コードを入力
      const otpInput = screen.getByLabelText(/確認コード/);
      await user.type(otpInput, '123456');

      // 「登録を完了してログイン」ボタンをクリック
      const verifyButton = screen.getByRole('button', {
        name: '登録を完了してログイン',
      });
      await user.click(verifyButton);

      await waitFor(() => {
        expect(mockVerifyOtp).toHaveBeenCalledWith({
          sessionToken: 'test-session-token',
          code: '123456',
          remember: true,
          trustDevice: true,
        });
        expect(mockOnSuccess).toHaveBeenCalled();
      });

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
          title: '登録完了',
        })
      );
    });

    it('should notify onStepChange callback when step changes', async () => {
      const user = userEvent.setup();
      const mockStepChange = vi.fn();
      mockRegister.mockResolvedValue({
        requires2FA: true,
        sessionToken: 'test-session-token',
        maskedEmail: 't***@example.com',
        expiresIn: 600,
      });

      render(<RegisterForm onStepChange={mockStepChange} />);

      expect(mockStepChange).toHaveBeenCalledWith('register');

      // フォーム送信
      await user.type(screen.getByPlaceholderText('ユーザー名を入力'), 'Test User');
      await user.type(
        screen.getByPlaceholderText('メールアドレスを入力'),
        'test@example.com'
      );
      await user.type(
        screen.getByPlaceholderText('6文字以上のパスワード'),
        'password123'
      );
      await user.type(
        screen.getByPlaceholderText('パスワードを再入力'),
        'password123'
      );

      await user.click(screen.getByRole('button', { name: '登録する' }));

      await waitFor(() => {
        expect(mockStepChange).toHaveBeenCalledWith('otp');
      });
    });

    it('should return to register input when clicking back button in OTP step', async () => {
      const user = userEvent.setup();
      mockRegister.mockResolvedValue({
        requires2FA: true,
        sessionToken: 'test-session-token',
        maskedEmail: 't***@example.com',
        expiresIn: 600,
      });

      render(<RegisterForm />);

      // 入力して送信
      await user.type(screen.getByPlaceholderText('ユーザー名を入力'), 'Test User');
      await user.type(
        screen.getByPlaceholderText('メールアドレスを入力'),
        'test@example.com'
      );
      await user.type(
        screen.getByPlaceholderText('6文字以上のパスワード'),
        'password123'
      );
      await user.type(
        screen.getByPlaceholderText('パスワードを再入力'),
        'password123'
      );
      await user.click(screen.getByRole('button', { name: '登録する' }));

      await waitFor(() => {
        expect(screen.getByLabelText(/確認コード/)).toBeInTheDocument();
      });

      // 戻るボタンをクリック
      const backButton = screen.getByRole('button', {
        name: /登録情報の入力に戻る/,
      });
      await user.click(backButton);

      // 登録入力フォームに戻ることを確認
      await waitFor(() => {
        expect(screen.getByPlaceholderText('ユーザー名を入力')).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: '登録する' })
        ).toBeInTheDocument();
      });
    });
  });
});
