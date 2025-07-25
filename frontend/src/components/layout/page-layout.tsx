'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  fullWidth?: boolean;
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
}: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {showHeader && <Header />}

      <main
        className={cn(
          'flex-1',
          !fullWidth && 'container mx-auto px-4 py-8',
          className
        )}
      >
        {children}
      </main>

      {showFooter && <Footer />}
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
    <section
      id={id}
      className={cn('py-12', className)}
    >
      <div className="container mx-auto px-4">
        {children}
      </div>
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
        {description && (
          <p className="mt-1 text-gray-400">{description}</p>
        )}
      </div>
      {action && <div className="mt-4 sm:mt-0">{action}</div>}
    </div>
  );
}
