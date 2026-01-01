import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider, ToastProvider } from '@/providers';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'EUROPA',
  description:
    'カルネージハートEXAのためのOKE共有・分析・コラボレーションプラットフォーム',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://project-europa.work'),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: '/apple-touch-icon.svg',
  },
  openGraph: {
    title: 'EUROPA',
    description:
      'カルネージハートEXAのためのOKE共有・分析・コラボレーションプラットフォーム',
    type: 'website',
    locale: 'ja_JP',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://project-europa.work',
    siteName: 'EUROPA',
    images: [
      {
        url: '/og-image.jpg?v=2026',
        width: 1200,
        height: 630,
        alt: 'PROJECT EUROPA - OKE Sharing Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EUROPA',
    description:
      'カルネージハートEXAのためのOKE共有・分析・コラボレーションプラットフォーム',
    images: ['/og-image.jpg?v=2026'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="scroll-smooth">
      <body
        className={
          inter.className +
          ' bg-[#0a0818] min-h-screen flex flex-col antialiased text-white selection:bg-[#00c8ff]/30 transition-colors duration-300'
        }
      >
        <QueryProvider>
          {children}
          <ToastProvider />
        </QueryProvider>
      </body>
    </html>
  );
}
