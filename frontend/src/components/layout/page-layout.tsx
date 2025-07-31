'use client';

import type React from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { cn } from '@/lib/utils';
import { SkipLink, useFocusVisible } from './focus-manager';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  fullWidth?: boolean;
  headerProps?: {
    showMenu?: boolean;
    variant?: 'default' | 'minimal';
  };
  footerProps?: {
    variant?: 'default' | 'minimal';
  };
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * ページレイアウトコンポーネント
 */
export function PageLayout({
  children,
  className,
  showHeader = true,
  showFooter = true,
  fullWidth = false,
  headerProps = {},
  footerProps = {},
  maxWidth = 'xl',
  padding = 'md',
}: PageLayoutProps) {
  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      case '2xl':
        return 'max-w-2xl';
      case 'full':
        return 'max-w-full';
      default:
        return 'max-w-xl';
    }
  };

  const getPaddingClass = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'sm':
        return 'px-2 py-4';
      case 'md':
        return 'px-4 py-8';
      case 'lg':
        return 'px-6 py-12';
      default:
        return 'px-4 py-8';
    }
  };
  // フォーカス可視化の改善
  useFocusVisible();

  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink href="#main-content">メインコンテンツにスキップ</SkipLink>

      {showHeader && <Header {...headerProps} />}

      <main
        id="main-content"
        className={cn(
          'flex-1',
          !fullWidth &&
            `container mx-auto ${getMaxWidthClass()} ${getPaddingClass()}`,
          className
        )}
        aria-label="メインコンテンツ"
      >
        {children}
      </main>

      {showFooter && <Footer {...footerProps} />}
    </div>
  );
}

/**
 * セクションコンポーネント
 */
export function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn('py-12', className)}>
      <div className="container mx-auto px-4">{children}</div>
    </section>
  );
}

/**
 * ページヘッダーコンポーネント
 */
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {description && <p className="mt-1 text-gray-400">{description}</p>}
      </div>
      {action && <div className="mt-4 sm:mt-0">{action}</div>}
    </div>
  );
}
