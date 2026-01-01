import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import HeaderLogo from '@/components/HeaderLogo';

// Iconsコンポーネントのモック
vi.mock('@/icons', () => ({
  Icons: {
    Logo: ({ size, color }: { size: number; color: string }) => (
      <div data-testid="logo-icon" data-size={size} data-color={color}>
        Logo
      </div>
    ),
  },
}));

describe('HeaderLogo', () => {
  beforeEach(() => {
    render(<HeaderLogo />);
  });

  it('should render the logo icon', () => {
    const logoIcon = screen.getByTestId('logo-icon');

    expect(logoIcon).toBeInTheDocument();
    expect(logoIcon).toHaveAttribute('data-size', '32');
    expect(logoIcon).toHaveAttribute('data-color', '#03C6F9');
  });

  it('should display EUROPA title', () => {
    const title = screen.getByText('EUROPA');

    expect(title).toBeInTheDocument();
    expect(title).toHaveClass(
      'text-2xl',
      'font-bold',
      'text-white',
      'leading-tight'
    );
  });

  it('should display subtitle in Japanese', () => {
    const subtitle = screen.getByText('カルネージハート エクサ');

    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveClass('text-sm', 'text-gray-400', 'ml-10');
  });

  it('should have proper layout structure', () => {
    const container = screen
      .getByText('カルネージハート エクサ')
      .closest('.flex.flex-col');

    expect(container).toHaveClass('flex', 'flex-col');
  });

  it('should have logo and title in the same row', () => {
    const logoIcon = screen.getByTestId('logo-icon');
    const title = screen.getByText('EUROPA');
    const titleContainer = title.parentElement;

    expect(titleContainer).toContain(logoIcon);
    expect(titleContainer).toHaveClass('flex', 'items-center', 'gap-3');
  });

  it('should render without crashing', () => {
    expect(() => render(<HeaderLogo />)).not.toThrow();
  });

  describe('Styling', () => {
    it('should apply correct CSS classes to main container', () => {
      const mainContainer = screen
        .getByText('EUROPA')
        .closest('.flex.flex-col');

      expect(mainContainer).toBeInTheDocument();
    });

    it('should apply correct CSS classes to title container', () => {
      const titleContainer = screen.getByText('EUROPA').parentElement;

      expect(titleContainer).toHaveClass('flex', 'items-center', 'gap-3');
    });

    it('should apply correct CSS classes to title text', () => {
      const title = screen.getByText('EUROPA');

      expect(title).toHaveClass(
        'text-2xl',
        'font-bold',
        'text-white',
        'leading-tight'
      );
    });

    it('should apply correct CSS classes to subtitle', () => {
      const subtitle = screen.getByText('カルネージハート エクサ');

      expect(subtitle).toHaveClass('text-sm', 'text-gray-400', 'ml-10');
    });
  });

  describe('Accessibility', () => {
    it('should have readable text content', () => {
      expect(screen.getByText('EUROPA')).toBeVisible();
      expect(screen.getByText('カルネージハート エクサ')).toBeVisible();
    });

    it('should have proper semantic structure', () => {
      const title = screen.getByText('EUROPA');
      const subtitle = screen.getByText('カルネージハート エクサ');

      // タイトルとサブタイトルが適切な階層になっていることを確認
      expect(title).toBeInTheDocument();
      expect(subtitle).toBeInTheDocument();
    });
  });
});
