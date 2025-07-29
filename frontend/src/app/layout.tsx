import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider, QueryProvider } from "@/providers";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EUROPA",
  description: "カルネージハートEXAのためのOKE共有・分析・コラボレーションプラットフォーム",
  openGraph: {
    title: "EUROPA",
    description: "カルネージハートEXAのためのOKE共有・分析・コラボレーションプラットフォーム",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "EUROPA",
    description: "カルネージハートEXAのためのOKE共有・分析・コラボレーションプラットフォーム",
  },
  metadataBase: new URL("https://project-europa.work"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="scroll-smooth">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#010220" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        {/* OGP & Twitter meta tags */}
        <meta property="og:title" content="EUROPA" />
        <meta property="og:description" content="カルネージハートEXAのためのOKE共有・分析・コラボレーションプラットフォーム" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://project-europa.work/icon.png" />
        <meta property="og:url" content="https://project-europa.work" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="EUROPA" />
        <meta name="twitter:description" content="カルネージハートEXAのためのOKE共有・分析・コラボレーションプラットフォーム" />
        <meta name="twitter:image" content="https://project-europa.work/icon.png" />
      </head>
      <body
        className={
          inter.className +
          " bg-[#0a0818] min-h-screen flex flex-col antialiased text-white selection:bg-[#00c8ff]/30 transition-colors duration-300"
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
