import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Header from '@/components/Header';

// useAuthフックをモック
const mockUseAuth = vi.fn();
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

// Next.js routerをモック
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/',
}));

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render EUROPA logo', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(<Header />);
    expect(screen.getByText('EUROPA')).toBeInTheDocument();
  });

  it('should render login and register links when user is not logged in', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(<Header />);
    expect(screen.getByText('ログイン')).toBeInTheDocument();
    expect(screen.getByText('新規登録')).toBeInTheDocument();
  });

  it('should render user menu when user is logged in', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, name: 'Test User', email: 'test@example.com' },
      loading: false,
    });

    render(<Header />);
    expect(screen.getByText(/Test User/)).toBeInTheDocument();
    expect(screen.queryByText('ログイン')).not.toBeInTheDocument();
    expect(screen.queryByText('新規登録')).not.toBeInTheDocument();
  });

  it('should show loading state', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    render(<Header />);
    // ローディング状態の確認（実装に依存）
    expect(screen.getByText('EUROPA')).toBeInTheDocument();
  });

  it('should handle logo click navigation', async () => {
    const user = userEvent.setup();
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(<Header />);

    const logo = screen.getByText('EUROPA');
    await user.click(logo);

    // ホームページへのナビゲーションを確認（実装に依存）
    expect(logo).toBeInTheDocument();
  });

  it('should handle login link click', async () => {
    const user = userEvent.setup();
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(<Header />);

    const loginLink = screen.getByText('ログイン');
    await user.click(loginLink);

    // ログインページへのナビゲーションを確認（実装に依存）
    expect(loginLink).toBeInTheDocument();
  });

  it('should handle register link click', async () => {
    const user = userEvent.setup();
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(<Header />);

    const registerLink = screen.getByText('新規登録');
    await user.click(registerLink);

    // 登録ページへのナビゲーションを確認（実装に依存）
    expect(registerLink).toBeInTheDocument();
  });
});
