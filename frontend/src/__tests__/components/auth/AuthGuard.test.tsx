import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/useAuth';

// モック
vi.mock('@/hooks/useAuth');
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

const mockReplace = vi.fn();

describe('AuthGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading when auth is loading', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        token: null,
        loading: true,
        isAuthenticated: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        fetchUser: vi.fn(),
        setUser: vi.fn(),
      });

      render(
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('Require Auth (default)', () => {
    it('should render children when authenticated', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'Test User', email: 'test@example.com', createdAt: '2024-01-01' },
        token: 'mock-token',
        loading: false,
        isAuthenticated: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        fetchUser: vi.fn(),
        setUser: vi.fn(),
      });

      render(
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('should redirect to login when not authenticated', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        token: null,
        loading: false,
        isAuthenticated: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        fetchUser: vi.fn(),
        setUser: vi.fn(),
      });

      render(
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(mockReplace).toHaveBeenCalledWith('/login');
    });

    it('should redirect to custom path when not authenticated', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        token: null,
        loading: false,
        isAuthenticated: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        fetchUser: vi.fn(),
        setUser: vi.fn(),
      });

      render(
        <AuthGuard redirectTo="/custom-login">
          <div>Protected Content</div>
        </AuthGuard>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(mockReplace).toHaveBeenCalledWith('/custom-login');
    });
  });

  describe('No Auth Required', () => {
    it('should render children when not authenticated', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        token: null,
        loading: false,
        isAuthenticated: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        fetchUser: vi.fn(),
        setUser: vi.fn(),
      });

      render(
        <AuthGuard requireAuth={false}>
          <div>Public Content</div>
        </AuthGuard>
      );

      expect(screen.getByText('Public Content')).toBeInTheDocument();
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('should redirect to mypage when authenticated', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'Test User', email: 'test@example.com', createdAt: '2024-01-01' },
        token: 'mock-token',
        loading: false,
        isAuthenticated: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        fetchUser: vi.fn(),
        setUser: vi.fn(),
      });

      render(
        <AuthGuard requireAuth={false}>
          <div>Public Content</div>
        </AuthGuard>
      );

      expect(screen.queryByText('Public Content')).not.toBeInTheDocument();
      expect(mockReplace).toHaveBeenCalledWith('/mypage');
    });
  });

  describe('Edge Cases', () => {
    it('should not redirect during loading', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        token: null,
        loading: true,
        isAuthenticated: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        fetchUser: vi.fn(),
        setUser: vi.fn(),
      });

      render(
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      );

      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('should handle auth state changes', () => {
      const { rerender } = render(
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      );

      // 最初は未認証
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        token: null,
        loading: false,
        isAuthenticated: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        fetchUser: vi.fn(),
        setUser: vi.fn(),
      });

      rerender(
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      );

      expect(mockReplace).toHaveBeenCalledWith('/login');

      // 認証状態に変更
      vi.mocked(useAuth).mockReturnValue({
        user: { id: '1', name: 'Test User', email: 'test@example.com', createdAt: '2024-01-01' },
        token: 'mock-token',
        loading: false,
        isAuthenticated: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        fetchUser: vi.fn(),
        setUser: vi.fn(),
      });

      rerender(
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });
});
