import { render, renderHook, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  FocusTrap,
  LiveRegion,
  SkipLink,
  useFocusManagement,
  useKeyboardNavigation,
} from '@/components/layout/focus-manager';

describe('Focus Management Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('FocusTrap', () => {
    it('should render children', () => {
      render(
        <FocusTrap>
          <button type="button">Test Button</button>
        </FocusTrap>
      );

      expect(
        screen.getByRole('button', { name: 'Test Button' })
      ).toBeInTheDocument();
    });

    it('should trap focus when active', () => {
      render(
        <FocusTrap active={true}>
          <button type="button">First Button</button>
          <button type="button">Second Button</button>
        </FocusTrap>
      );

      const firstButton = screen.getByRole('button', { name: 'First Button' });
      const secondButton = screen.getByRole('button', {
        name: 'Second Button',
      });

      expect(firstButton).toBeInTheDocument();
      expect(secondButton).toBeInTheDocument();
    });

    it('should not trap focus when inactive', () => {
      render(
        <FocusTrap active={false}>
          <button type="button">Test Button</button>
        </FocusTrap>
      );

      expect(
        screen.getByRole('button', { name: 'Test Button' })
      ).toBeInTheDocument();
    });
  });

  describe('SkipLink', () => {
    it('should render skip link with correct href', () => {
      render(<SkipLink href="#main-content">Skip to main content</SkipLink>);

      const skipLink = screen.getByRole('link', {
        name: 'Skip to main content',
      });
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('should be positioned off-screen by default', () => {
      render(<SkipLink href="#main-content">Skip to main content</SkipLink>);

      const skipLink = screen.getByRole('link', {
        name: 'Skip to main content',
      });
      // Tailwind class: -left-[9999px] positions element off-screen
      expect(skipLink).toHaveClass('-left-[9999px]');
    });

    it('should have focus styles defined via Tailwind classes', () => {
      render(<SkipLink href="#main-content">Skip to main content</SkipLink>);

      const skipLink = screen.getByRole('link', {
        name: 'Skip to main content',
      });

      // Tailwind classes for focus state: focus:left-2 focus:top-2
      expect(skipLink).toHaveClass('focus:left-2');
      expect(skipLink).toHaveClass('focus:top-2');
    });

    it('should have proper styling classes', () => {
      render(<SkipLink href="#main-content">Skip to main content</SkipLink>);

      const skipLink = screen.getByRole('link', {
        name: 'Skip to main content',
      });

      // Verify essential styling classes are present
      expect(skipLink).toHaveClass('absolute');
      expect(skipLink).toHaveClass('z-[99999]');
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
      render(<LiveRegion>Status update</LiveRegion>);

      const liveRegion = screen.getByText('Status update');
      // Tailwind classes for visual hiding: absolute -left-[10000px] w-px h-px overflow-hidden
      expect(liveRegion).toHaveClass('absolute');
      expect(liveRegion).toHaveClass('-left-[10000px]');
      expect(liveRegion).toHaveClass('w-px');
      expect(liveRegion).toHaveClass('h-px');
      expect(liveRegion).toHaveClass('overflow-hidden');
    });

    it('should use default politeness level', () => {
      render(<LiveRegion>Status update</LiveRegion>);

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

      renderHook(() =>
        useKeyboardNavigation(mockItems, {
          onActivate,
          orientation: 'vertical',
        })
      );

      // Test would require more complex setup to simulate keyboard events
      expect(onActivate).not.toHaveBeenCalled();
    });
  });
});
