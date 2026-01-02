import type React from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

interface StaticPageLayoutProps {
    children: React.ReactNode;
    titleEn: string; // 英語タイトル（例: "ABOUT"）
    titleJa: string; // 日本語タイトル（例: "私たちについて"）
    description?: string; // オプションの説明
}

/**
 * 静的ページ用の統一レイアウトコンポーネント
 * /info ページと同様の Cybernetic Void テーマを提供
 */
export default function StaticPageLayout({
    children,
    titleEn,
    titleJa,
    description,
}: StaticPageLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen bg-[#0a0818] text-white selection:bg-cyan-500/30">
            <Header />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 md:py-20 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8 md:mb-12">
                        <p className="text-cyan-400 font-extrabold text-xs md:text-sm tracking-[2px] md:tracking-[3px] uppercase animate-pulse shadow-cyan-500/50 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] mb-2 md:mb-4">
                            {titleEn}
                        </p>
                        <h1 className="text-white font-black text-3xl md:text-5xl tracking-tight cyber-title drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] mb-4 md:mb-6">
                            {titleJa}
                        </h1>
                        {description && (
                            <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-lg px-4">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="bg-[#0d1124]/80 backdrop-blur-md border border-cyan-500/20 rounded-xl md:rounded-2xl p-4 md:p-8 shadow-[0_0_30px_-5px_rgba(0,0,0,0.3)]">
                        {children}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
