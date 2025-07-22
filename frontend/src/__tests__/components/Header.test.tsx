import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';

// useAuthフックをモック
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
  }),
}));

describe('Header', () => {
  it('should render EUROPA logo', () => {
    render(<Header />);
    expect(screen.getByText('EUROPA')).toBeInTheDocument();
  });

  it('should render login and register links when user is not logged in', () => {
    render(<Header />);
    expect(screen.getByText('ログイン')).toBeInTheDocument();
    expect(screen.getByText('新規登録')).toBeInTheDocument();
  });
});
