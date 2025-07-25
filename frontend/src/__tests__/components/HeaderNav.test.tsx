import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HeaderNav from '@/components/HeaderNav';

// Iconsコンポーネントのモック
vi.mock('@/icons', () => ({
  Icons: {
    Login: ({ size, color }: { size: number; color: string }) => (
      <div data-testid="login-icon" data-size={size} data-color={color}>
        Login Icon
      </div>
    ),
    Register: ({ size, color }: { size: number; color: string }) => (
      <div data-testid="register-icon" data-size={size} data-color={color}>
        Register Icon
      </div>
    ),
  },
}));

describe('HeaderNav', () => {
  beforeEach(() => {
    render(<HeaderNav />);
  });

  it('should render navigation element', () => {
    const nav = screen.getByRole('navigation');

    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass('flex', 'gap-8');
  });

  describe('Login Link', () => {
    it('should render login link with icon', () => {
      const loginLink = screen.getByRole('link', { name: /ログイン/i });
      const loginIcon = screen.getByTestId('login-icon');

      expect(loginLink).toBeInTheDocument();
      expect(loginIcon).toBeInTheDocument();
      expect(loginIcon).toHaveAttribute('data-size', '22');
      expect(loginIcon).toHaveAttribute('data-color', '#00c8ff');
    });

    it('should have correct styling for login link', () => {
      const loginLink = screen.getByRole('link', { name: /ログイン/i });

      expect(loginLink).toHaveClass(
        'flex',
        'items-center',
        'gap-2',
        'text-lg',
        'text-[#00c8ff]',
        'font-normal',
        'no-underline',
        'hover-glow',
        'hover-scale'
      );
    });

    it('should display login text', () => {
      expect(screen.getByText('ログイン')).toBeInTheDocument();
    });
  });

  describe('Register Link', () => {
    it('should render register link with icon', () => {
      const registerLink = screen.getByRole('link', { name: /新規登録/i });
      const registerIcon = screen.getByTestId('register-icon');

      expect(registerLink).toBeInTheDocument();
      expect(registerIcon).toBeInTheDocument();
      expect(registerIcon).toHaveAttribute('data-size', '22');
      expect(registerIcon).toHaveAttribute('data-color', '#00c8ff');
    });

    it('should have correct styling for register link', () => {
      const registerLink = screen.getByRole('link', { name: /新規登録/i });

      expect(registerLink).toHaveClass(
        'flex',
        'items-center',
        'gap-2',
        'text-lg',
        'text-[#00c8ff]',
        'font-normal',
        'no-underline',
        'hover-glow',
        'hover-scale'
      );
    });

    it('should display register text', () => {
      expect(screen.getByText('新規登録')).toBeInTheDocument();
    });
  });

  describe('Navigation Structure', () => {
    it('should contain both login and register links', () => {
      const links = screen.getAllByRole('link');

      expect(links).toHaveLength(2);
      expect(links[0]).toHaveTextContent('ログイン');
      expect(links[1]).toHaveTextContent('新規登録');
    });

    it('should have proper link attributes', () => {
      const loginLink = screen.getByRole('link', { name: /ログイン/i });
      const registerLink = screen.getByRole('link', { name: /新規登録/i });

      expect(loginLink).toHaveAttribute('href', '#');
      expect(registerLink).toHaveAttribute('href', '#');
    });
  });

  describe('Icon Integration', () => {
    it('should render login icon with correct props', () => {
      const loginIcon = screen.getByTestId('login-icon');

      expect(loginIcon).toHaveAttribute('data-size', '22');
      expect(loginIcon).toHaveAttribute('data-color', '#00c8ff');
    });

    it('should render register icon with correct props', () => {
      const registerIcon = screen.getByTestId('register-icon');

      expect(registerIcon).toHaveAttribute('data-size', '22');
      expect(registerIcon).toHaveAttribute('data-color', '#00c8ff');
    });

    it('should have icons inside their respective links', () => {
      const loginLink = screen.getByRole('link', { name: /ログイン/i });
      const registerLink = screen.getByRole('link', { name: /新規登録/i });
      const loginIcon = screen.getByTestId('login-icon');
      const registerIcon = screen.getByTestId('register-icon');

      expect(loginLink).toContainElement(loginIcon);
      expect(registerLink).toContainElement(registerIcon);
    });
  });

  describe('Styling', () => {
    it('should apply correct CSS classes to navigation', () => {
      const nav = screen.getByRole('navigation');

      expect(nav).toHaveClass('flex', 'gap-8');
    });

    it('should have consistent styling for both links', () => {
      const links = screen.getAllByRole('link');

      links.forEach(link => {
        expect(link).toHaveClass(
          'flex',
          'items-center',
          'gap-2',
          'text-lg',
          'text-[#00c8ff]',
          'font-normal',
          'no-underline',
          'hover-glow',
          'hover-scale'
        );
      });
    });

    it('should use consistent color scheme', () => {
      const loginIcon = screen.getByTestId('login-icon');
      const registerIcon = screen.getByTestId('register-icon');
      const loginLink = screen.getByRole('link', { name: /ログイン/i });
      const registerLink = screen.getByRole('link', { name: /新規登録/i });

      // Icons should have the same color
      expect(loginIcon).toHaveAttribute('data-color', '#00c8ff');
      expect(registerIcon).toHaveAttribute('data-color', '#00c8ff');

      // Links should have the same text color class
      expect(loginLink).toHaveClass('text-[#00c8ff]');
      expect(registerLink).toHaveClass('text-[#00c8ff]');
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic navigation structure', () => {
      const nav = screen.getByRole('navigation');

      expect(nav.tagName).toBe('NAV');
    });

    it('should have accessible link text', () => {
      const loginLink = screen.getByRole('link', { name: /ログイン/i });
      const registerLink = screen.getByRole('link', { name: /新規登録/i });

      expect(loginLink).toBeVisible();
      expect(registerLink).toBeVisible();
    });

    it('should have proper link roles', () => {
      const links = screen.getAllByRole('link');

      expect(links).toHaveLength(2);
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      expect(() => render(<HeaderNav />)).not.toThrow();
    });

    it('should render all expected elements', () => {
      const nav = screen.getByRole('navigation');
      const loginLink = screen.getByRole('link', { name: /ログイン/i });
      const registerLink = screen.getByRole('link', { name: /新規登録/i });
      const loginIcon = screen.getByTestId('login-icon');
      const registerIcon = screen.getByTestId('register-icon');

      expect(nav).toBeInTheDocument();
      expect(loginLink).toBeInTheDocument();
      expect(registerLink).toBeInTheDocument();
      expect(loginIcon).toBeInTheDocument();
      expect(registerIcon).toBeInTheDocument();
    });
  });
});
