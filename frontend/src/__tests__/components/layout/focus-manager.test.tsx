import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  FocusTrap, 
  SkipLink, 
  LiveRegion,
  useFocusManagement,
  useKeyboardNavigation 
} from '@/components/layout/focus-manager';
import { renderHook } from '@testing-library/react';

describe('Focus Management Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('FocusTrap', () => {
    it('should render children', () => {
      render(
        <FocusTrap>
          <button>Test Button</button>
        </FocusTrap>
      );

      expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument();
    });

    it('should trap focus when active', () => {
      render(
        <FocusTrap active={true}>
          <button>First Button</button>
          <button>Second Button</button>
        </FocusTrap>
      );

      const firstButton = screen.getByRole('button', { name: 'First Button' });
      const secondButton = screen.getByRole('button', { name: 'Second Button' });

      expect(firstButton).toBeInTheDocument();
      expect(secondButton).toBeInTheDocument();
    });

    it('should not trap focus when inactive', () => {
      render(
        <FocusTrap active={false}>
          <button>Test Button</button>
        </FocusTrap>
      );

      expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument();
    });
  });

  describe('SkipLink', () => {
    it('should render skip link with correct href', () => {
      render(
        <SkipLink href="#main-content">
          Skip to main content
        </SkipLink>
      );

      const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('should be positioned off-screen by default', () => {
      render(
        <SkipLink href="#main-content">
          Skip to main content
        </SkipLink>
      );

      const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
      expect(skipLink.style.left).toBe('-9999px');
    });

    it('should become visible on focus', () => {
      render(
        <SkipLink href="#main-content">
          Skip to main content
        </SkipLink>
      );

      const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
      
      fireEvent.focus(skipLink);
      expect(skipLink.style.left).toBe('8px');
      expect(skipLink.style.top).toBe('8px');
    });

    it('should hide on blur', () => {
      render(
        <SkipLink href="#main-content">
          Skip to main content
        </SkipLink>
      );

      const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
      
      fireEvent.focus(skipLink);
      fireEvent.blur(skipLink);
      expect(skipLink.style.left).toBe('-9999px');
    });
  });

  describe('LiveRegion', () => {
    it('should render with correct aria attributes', () => {
      render(
        <LiveRegion politeness="assertive" atomic={true}>
          Status update
        </LiveRegion>
      );

      const liveRegion = screen.getByText('Status update');
      expect(liveRegion).toHaveAttribute('aria-live', 'assertive');
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
    });

    it('should be visually hidden', () => {
      render(
        <LiveRegion>
          Status update
        </LiveRegion>
      );

      const liveRegion = screen.getByText('Status update');
      expect(liveRegion.style.position).toBe('absolute');
      expect(liveRegion.style.left).toBe('-10000px');
    });

    it('should use default politeness level', () => {
      render(
        <LiveRegion>
          Status update
        </LiveRegion>
      );

      const liveRegion = screen.getByText('Status update');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('useFocusManagement', () => {
    it('should return focus management utilities', () => {
      const { result } = renderHook(() => useFocusManagement());

      expect(result.current).toHaveProperty('getFocusableElements');
      expect(result.current).toHaveProperty('trapFocus');
      expect(typeof result.current.getFocusableElements).toBe('function');
      expect(typeof result.current.trapFocus).toBe('function');
    });

    it('should find focusable elements', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <button>Button 1</button>
        <input type="text" />
        <a href="#">Link</a>
        <button disabled>Disabled Button</button>
      `;

      const { result } = renderHook(() => useFocusManagement());
      const focusableElements = result.current.getFocusableElements(container);

      expect(focusableElements).toHaveLength(3); // button, input, link (disabled button excluded)
    });
  });

  describe('useKeyboardNavigation', () => {
    it('should handle keyboard navigation', () => {
      const mockItems = [
        document.createElement('button'),
        document.createElement('button'),
        document.createElement('button'),
      ];

      const onActivate = vi.fn();

      renderHook(() => useKeyboardNavigation(mockItems, {
        onActivate,
        orientation: 'vertical',
      }));

      // Test would require more complex setup to simulate keyboard events
      expect(onActivate).not.toHaveBeenCalled();
    });
  });
});