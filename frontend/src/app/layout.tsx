import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EUROPA Platform",
  description: "カルネージハートEXAのためのOKE共有・分析・コラボレーションプラットフォーム",
  openGraph: {
    title: "EUROPA Platform",
    description: "カルネージハートEXAのためのOKE共有・分析・コラボレーションプラットフォーム",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "EUROPA Platform",
    description: "カルネージハートEXAのためのOKE共有・分析・コラボレーションプラットフォーム",
  },
  metadataBase: new URL("https://europa.example.com"),
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
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={
          inter.className +
          " bg-[#0a0818] min-h-screen flex flex-col antialiased text-white selection:bg-[#00c8ff]/30 transition-colors duration-300"
        }
      >
        {children}
      </body>
    </html>
  );
}
