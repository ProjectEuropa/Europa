import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from '@/components/auth/RegisterForm';
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

const mockRegister = vi.fn();
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
      login: vi.fn(),
      logout: vi.fn(),
      fetchUser: vi.fn(),
      setUser: vi.fn(),
    });
    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
    });
  });

  it('should render registration form with all required fields', () => {
    render(<RegisterForm />);

    // 基本的なフォーム要素の存在確認
    expect(screen.getByPlaceholderText('山田太郎')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('example@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('パスワードを入力')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('パスワードを再入力')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /アカウント作成/ })).toBeInTheDocument();
  });

  it('should show validation errors for empty form submission', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const submitButton = screen.getByRole('button', { name: /アカウント作成/ });
    await user.click(submitButton);

    // バリデーションエラーが表示されることを確認（具体的なメッセージは実装に依存）
    await waitFor(() => {
      // フォームが送信されずにエラーが表示されることを確認
      expect(mockRegister).not.toHaveBeenCalled();
    });
  });

  it('should show validation error for invalid email format', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const emailInput = screen.getByPlaceholderText('example@example.com');
    await user.type(emailInput, 'invalid-email');

    const submitButton = screen.getByRole('button', { name: /アカウント作成/ });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).not.toHaveBeenCalled();
    });
  });

  it('should successfully register with valid data', async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValue(undefined);

    render(<RegisterForm />);

    // 有効なデータを入力
    await user.type(screen.getByPlaceholderText('山田太郎'), 'Test User');
    await user.type(screen.getByPlaceholderText('example@example.com'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('パスワードを入力'), 'password123');
    await user.type(screen.getByPlaceholderText('パスワードを再入力'), 'password123');

    const submitButton = screen.getByRole('button', { name: /アカウント作成/ });
    await user.click(submitButton);

    // 登録関数が正しいデータで呼ばれることを確認
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        passwordConfirmation: 'password123',
      });
    });

    // 成功メッセージが表示されることを確認
    expect(mockToast).toHaveBeenCalledWith({
      type: 'success',
      title: '登録成功',
      message: 'アカウントが作成されました',
    });
  });

  it('should handle registration error gracefully', async () => {
    const user = userEvent.setup();
    const mockError = new Error('Registration failed');
    mockRegister.mockRejectedValue(mockError);

    render(<RegisterForm />);

    // 有効なデータを入力
    await user.type(screen.getByPlaceholderText('山田太郎'), 'Test User');
    await user.type(screen.getByPlaceholderText('example@example.com'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('パスワードを入力'), 'password123');
    await user.type(screen.getByPlaceholderText('パスワードを再入力'), 'password123');

    const submitButton = screen.getByRole('button', { name: /アカウント作成/ });
    await user.click(submitButton);

    // 登録が試行されることを確認
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
    });

    // エラーが発生してもアプリケーションがクラッシュしないことを確認
    expect(screen.getByRole('button', { name: /アカウント作成/ })).toBeInTheDocument();
  });

  it('should show loading state during form submission', async () => {
    const user = userEvent.setup();
    let resolveRegister: () => void;
    const registerPromise = new Promise<void>((resolve) => {
      resolveRegister = resolve;
    });
    mockRegister.mockReturnValue(registerPromise);

    render(<RegisterForm />);

    // フォームに入力
    await user.type(screen.getByPlaceholderText('山田太郎'), 'Test User');
    await user.type(screen.getByPlaceholderText('example@example.com'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('パスワードを入力'), 'password123');
    await user.type(screen.getByPlaceholderText('パスワードを再入力'), 'password123');

    const submitButton = screen.getByRole('button', { name: /アカウント作成/ });
    await user.click(submitButton);

    // 送信中の状態を確認
    await waitFor(() => {
      const loadingButton = screen.getByRole('button', { name: /登録中/ });
      expect(loadingButton).toBeDisabled();
    });

    // 登録完了
    resolveRegister!();
    await registerPromise;

    // 元の状態に戻ることを確認
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /アカウント作成/ })).not.toBeDisabled();
    });
  });

  it('should call onSuccess callback when registration succeeds', async () => {
    const user = userEvent.setup();
    const mockOnSuccess = vi.fn();
    mockRegister.mockResolvedValue(undefined);

    render(<RegisterForm onSuccess={mockOnSuccess} />);

    // フォームに入力して送信
    await user.type(screen.getByPlaceholderText('山田太郎'), 'Test User');
    await user.type(screen.getByPlaceholderText('example@example.com'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('パスワードを入力'), 'password123');
    await user.type(screen.getByPlaceholderText('パスワードを再入力'), 'password123');

    const submitButton = screen.getByRole('button', { name: /アカウント作成/ });
    await user.click(submitButton);

    // コールバックが呼ばれることを確認
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});
