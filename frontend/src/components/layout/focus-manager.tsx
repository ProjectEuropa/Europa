'use client';

import { useEffect, useRef } from 'react';
import { Z_INDEX } from '@/lib/utils';

/**
 * フォーカス管理のためのユーティリティフック
 */
export function useFocusManagement() {
  const focusableElementsSelector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ');

  const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
    return Array.from(container.querySelectorAll(focusableElementsSelector));
  };

  const trapFocus = (container: HTMLElement) => {
    const focusableElements = getFocusableElements(container);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    // 最初の要素にフォーカス
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  };

  return {
    getFocusableElements,
    trapFocus,
  };
}

/**
 * フォーカストラップコンポーネント
 */
interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
  restoreFocus?: boolean;
  className?: string;
}

export function FocusTrap({
  children,
  active = true,
  restoreFocus = true,
  className = '',
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const { trapFocus } = useFocusManagement();

  useEffect(() => {
    if (!active || !containerRef.current) return;

    // 現在のアクティブ要素を保存
    if (restoreFocus) {
      previousActiveElementRef.current = document.activeElement as HTMLElement;
    }

    // フォーカストラップを設定
    const cleanup = trapFocus(containerRef.current);

    return () => {
      cleanup();

      // フォーカスを元の要素に戻す
      if (restoreFocus && previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [active, restoreFocus, trapFocus]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

/**
 * スキップリンクコンポーネント
 */
interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function SkipLink({ href, children, className = '' }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={className}
      style={{
        position: 'absolute',
        left: '-9999px',
        zIndex: Z_INDEX.focus,
        padding: '8px 16px',
        background: '#000',
        color: '#fff',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: 'bold',
        borderRadius: '4px',
        border: '2px solid #00c8ff',
        transition: 'left 0.3s',
      }}
      onFocus={e => {
        e.currentTarget.style.left = '8px';
        e.currentTarget.style.top = '8px';
      }}
      onBlur={e => {
        e.currentTarget.style.left = '-9999px';
      }}
    >
      {children}
    </a>
  );
}

/**
 * ライブリージョンコンポーネント（スクリーンリーダー用）
 */
interface LiveRegionProps {
  children: React.ReactNode;
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  className?: string;
}

export function LiveRegion({
  children,
  politeness = 'polite',
  atomic = false,
  className = '',
}: LiveRegionProps) {
  return (
    <div
      className={className}
      aria-live={politeness}
      aria-atomic={atomic}
      style={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

/**
 * フォーカス可視化の改善
 */
export function useFocusVisible() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .focus-visible {
        outline: 2px solid #00c8ff;
        outline-offset: 2px;
      }
      
      .focus-visible:not(.focus-visible-force-shown):not(:focus-within) {
        outline: none;
      }
      
      *:focus {
        outline: 2px solid #00c8ff;
        outline-offset: 2px;
      }
      
      *:focus:not(.focus-visible) {
        outline: none;
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
}

/**
 * キーボードナビゲーション用のフック
 */
export function useKeyboardNavigation(
  items: HTMLElement[],
  options: {
    loop?: boolean;
    orientation?: 'horizontal' | 'vertical';
    onActivate?: (index: number) => void;
  } = {}
) {
  const { loop = true, orientation = 'vertical', onActivate } = options;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const currentIndex = items.findIndex(
        item => item === document.activeElement
      );
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      switch (event.key) {
        case orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp':
          event.preventDefault();
          nextIndex =
            currentIndex > 0 ? currentIndex - 1 : loop ? items.length - 1 : 0;
          break;
        case orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown':
          event.preventDefault();
          nextIndex =
            currentIndex < items.length - 1
              ? currentIndex + 1
              : loop
                ? 0
                : items.length - 1;
          break;
        case 'Home':
          event.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          nextIndex = items.length - 1;
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          onActivate?.(currentIndex);
          return;
      }

      if (nextIndex !== currentIndex && items[nextIndex]) {
        items[nextIndex].focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [items, loop, orientation, onActivate]);
}
