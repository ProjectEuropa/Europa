'use client';

import { useEffect, useState } from 'react';

// ブレークポイント定義
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * 現在の画面サイズを取得するフック
 */
export function useBreakpoint() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('lg');
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);

      if (width >= breakpoints['2xl']) {
        setCurrentBreakpoint('2xl');
      } else if (width >= breakpoints.xl) {
        setCurrentBreakpoint('xl');
      } else if (width >= breakpoints.lg) {
        setCurrentBreakpoint('lg');
      } else if (width >= breakpoints.md) {
        setCurrentBreakpoint('md');
      } else {
        setCurrentBreakpoint('sm');
      }
    };

    // 初期化
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    currentBreakpoint,
    windowWidth,
    isMobile: currentBreakpoint === 'sm',
    isTablet: currentBreakpoint === 'md',
    isDesktop: currentBreakpoint === 'lg' || currentBreakpoint === 'xl' || currentBreakpoint === '2xl',
  };
}

/**
 * 特定のブレークポイント以上かどうかを判定するフック
 */
export function useMediaQuery(breakpoint: Breakpoint) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoints[breakpoint]}px)`);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [breakpoint]);

  return matches;
}

/**
 * レスポンシブコンテナコンポーネント
 */
interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: Breakpoint;
  padding?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
}

export function ResponsiveContainer({
  children,
  className = '',
  maxWidth = 'xl',
  padding = {
    mobile: '16px',
    tablet: '24px',
    desktop: '32px',
  },
}: ResponsiveContainerProps) {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  const getPadding = () => {
    if (isMobile) return padding.mobile;
    if (isTablet) return padding.tablet;
    if (isDesktop) return padding.desktop;
    return padding.desktop;
  };

  const getMaxWidth = () => {
    return `${breakpoints[maxWidth]}px`;
  };

  return (
    <div
      className={className}
      style={{
        maxWidth: getMaxWidth(),
        margin: '0 auto',
        padding: getPadding(),
        width: '100%',
      }}
    >
      {children}
    </div>
  );
}

/**
 * レスポンシブグリッドコンポーネント
 */
interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
}

export function ResponsiveGrid({
  children,
  className = '',
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  },
  gap = {
    mobile: '16px',
    tablet: '24px',
    desktop: '32px',
  },
}: ResponsiveGridProps) {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  const getGridColumns = () => {
    if (isMobile) return columns.mobile;
    if (isTablet) return columns.tablet;
    if (isDesktop) return columns.desktop;
    return columns.desktop;
  };

  const getGap = () => {
    if (isMobile) return gap.mobile;
    if (isTablet) return gap.tablet;
    if (isDesktop) return gap.desktop;
    return gap.desktop;
  };

  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)`,
        gap: getGap(),
      }}
    >
      {children}
    </div>
  );
}

/**
 * 条件付きレンダリングコンポーネント
 */
interface ShowOnProps {
  children: React.ReactNode;
  breakpoint: Breakpoint;
  direction?: 'up' | 'down' | 'only';
}

export function ShowOn({ children, breakpoint, direction = 'up' }: ShowOnProps) {
  const { currentBreakpoint, windowWidth } = useBreakpoint();
  
  const shouldShow = () => {
    const currentWidth = windowWidth;
    const targetWidth = breakpoints[breakpoint];

    switch (direction) {
      case 'up':
        return currentWidth >= targetWidth;
      case 'down':
        return currentWidth < targetWidth;
      case 'only':
        return currentBreakpoint === breakpoint;
      default:
        return currentWidth >= targetWidth;
    }
  };

  if (!shouldShow()) return null;

  return <>{children}</>;
}