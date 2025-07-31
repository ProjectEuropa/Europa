import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  ResponsiveContainer, 
  ResponsiveGrid, 
  ShowOn,
  useBreakpoint,
  useMediaQuery 
} from '@/components/layout/responsive';
import { renderHook, act } from '@testing-library/react';

// モックのwindowオブジェクト
const mockWindow = {
  innerWidth: 1024,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  matchMedia: vi.fn(),
};

// グローバルwindowのモック
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('Responsive Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ResponsiveContainer', () => {
    it('should render children with default props', () => {
      render(
        <ResponsiveContainer>
          <div>Test Content</div>
        </ResponsiveContainer>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <ResponsiveContainer className="custom-class">
          <div>Test Content</div>
        </ResponsiveContainer>
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should set max width based on breakpoint', () => {
      const { container } = render(
        <ResponsiveContainer maxWidth="md">
          <div>Test Content</div>
        </ResponsiveContainer>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.maxWidth).toBe('768px');
    });
  });

  describe('ResponsiveGrid', () => {
    it('should render children in grid layout', () => {
      render(
        <ResponsiveGrid>
          <div>Item 1</div>
          <div>Item 2</div>
        </ResponsiveGrid>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('should apply grid styles', () => {
      const { container } = render(
        <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
          <div>Item 1</div>
        </ResponsiveGrid>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.display).toBe('grid');
    });
  });

  describe('ShowOn', () => {
    it('should render children when condition is met', () => {
      // デスクトップサイズをモック
      Object.defineProperty(window, 'innerWidth', {
        value: 1024,
        writable: true,
      });

      render(
        <ShowOn breakpoint="lg" direction="up">
          <div>Desktop Content</div>
        </ShowOn>
      );

      expect(screen.getByText('Desktop Content')).toBeInTheDocument();
    });
  });

  describe('useBreakpoint', () => {
    it('should return current breakpoint information', () => {
      const { result } = renderHook(() => useBreakpoint());

      expect(result.current).toHaveProperty('currentBreakpoint');
      expect(result.current).toHaveProperty('windowWidth');
      expect(result.current).toHaveProperty('isMobile');
      expect(result.current).toHaveProperty('isTablet');
      expect(result.current).toHaveProperty('isDesktop');
    });
  });

  describe('useMediaQuery', () => {
    it('should return media query match status', () => {
      const mockMediaQuery = {
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      window.matchMedia = vi.fn().mockReturnValue(mockMediaQuery);

      const { result } = renderHook(() => useMediaQuery('lg'));

      expect(result.current).toBe(true);
      expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 1024px)');
    });
  });
});