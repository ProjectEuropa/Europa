import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

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

import { Toaster } from "sonner";

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
      </head>
      <body
        className={
          inter.className +
          " bg-[#0a0818] min-h-screen flex flex-col antialiased text-white selection:bg-[#00c8ff]/30 transition-colors duration-300"
        }
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
