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
  openGraph: {
    title: 'EUROPA',
    description:
      'カルネージハートEXAのためのOKE共有・分析・コラボレーションプラットフォーム',
    type: 'website',
    locale: 'ja_JP',
    url: 'https://project-europa.work',
    siteName: 'EUROPA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EUROPA',
    description:
      'カルネージハートEXAのためのOKE共有・分析・コラボレーションプラットフォーム',
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
