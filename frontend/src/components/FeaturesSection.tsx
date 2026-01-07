import type React from 'react';
import { cn } from '@/lib/utils';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  subTitle: string;
  description: string;
  href: string;
  actionLabel: string;
}

const FeaturesSection: React.FC = () => {
  const features: FeatureItem[] = [
    {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
          <circle cx="10" cy="8" r="3.5" strokeWidth="1.5" />
          <circle cx="17" cy="10" r="2.5" strokeWidth="1.5" />
          <circle cx="7" cy="16" r="2.5" strokeWidth="1.5" />
          <circle cx="16" cy="16" r="2.5" strokeWidth="1.5" />
          <path d="M10 11.5C7.5 11.5 3 12.5 3 16" strokeLinecap="round" strokeWidth="1.5" />
          <path d="M17 12.5C18.5 12.5 21 13.2 21 15" strokeLinecap="round" strokeWidth="1.5" />
          <path d="M7 18.5C5.8 18.5 4 19 4 20.5" strokeLinecap="round" strokeWidth="1.5" />
          <path d="M16 18.5C17.2 18.5 19 19 19 20.5" strokeLinecap="round" strokeWidth="1.5" />
        </svg>
      ),
      title: 'チームデータ検索',
      subTitle: 'TEAM SEARCH',
      description:
        'ランキングやパフォーマンス指標など、様々な条件でチームを検索、探索できます。',
      href: '/search/team',
      actionLabel: '検索する',
    },
    {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
          <path d="M14 4L18 8L14 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 20L6 16L10 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 8H13C10.7909 8 9 9.79086 9 12V16" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M6 16H11C13.2091 16 15 14.2091 15 12V8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      title: 'マッチデータ検索',
      subTitle: 'MATCH SEARCH',
      description:
        '戦略や戦術を向上させるために、試合結果やパフォーマンスデータを分析します。',
      href: '/search/match',
      actionLabel: '検索する',
    },
    {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
          <path d="M12 16V4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 9L12 4L17 9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 16V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'アップロード',
      subTitle: 'UPLOAD DATA',
      description: 'コメントでアピール',
      href: '/upload',
      actionLabel: 'アップロードする',
    },
    {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
          <circle cx="12" cy="7" r="3" strokeWidth="1.5" />
          <path d="M19 20C19 16.134 15.866 13 12 13C8.13401 13 5 16.134 5 20" strokeWidth="1.5" />
          <path d="M12 13V20M12 20L15 17M12 20L9 17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'チームデータ取得',
      subTitle: 'DOWNLOAD TEAM',
      description:
        'オフライン分析や戦略開発のために包括的なチームデータをダウンロードします。',
      href: '/sumdownload/team',
      actionLabel: 'ダウンロード',
    },
    {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
          <path d="M4 6H20" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M4 10H20" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M4 14H12" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M4 18H12" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M16 14V20M16 20L19 17M16 20L13 17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'マッチデータ取得',
      subTitle: 'DOWNLOAD MATCH',
      description: '過去の戦闘から学ぶための詳細な試合統計を取得します。',
      href: '/sumdownload/match',
      actionLabel: 'ダウンロード',
    },
    {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
          <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
          <path d="M12 8V16" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="6.5" r="0.5" fill="currentColor" />
        </svg>
      ),
      title: 'お知らせ',
      subTitle: 'INFORMATION',
      description:
        'カルネージハート エクサの大会イベントなどの情報にアクセスできます。',
      href: '/info',
      actionLabel: '確認する',
    },
  ];

  return (
    <section id="features" aria-label="主な機能" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Decor - Subtle Grid */}
      <div
        className="absolute inset-0 pointer-events-none bg-[length:40px_40px] bg-[linear-gradient(rgba(0,200,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,255,0.03)_1px,transparent_1px)]"
      />

      {/* Radial glow in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-cyan-400 font-extrabold text-sm tracking-[3px] uppercase animate-pulse shadow-cyan-500/50 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
            FEATURES
          </h2>
          <h3 className="text-white font-black text-4xl md:text-6xl tracking-tight cyber-title drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            主な機能
          </h3>
          <p className="text-slate-400 text-lg md:text-xl leading-8 md:leading-loose max-w-2xl mx-auto border-t border-white/5 pt-8 mt-8">
            カルネージハート エクサのOKE開発を<span className="text-cyan-400 font-bold">加速</span>させる包括的なツールセット。<br className="hidden md:block" />
            戦略の作成から共有、分析まで、すべてのニーズに対応します。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <a
              key={index}
              href={feature.href}
              className={cn(
                "group relative bg-[#0a0e1a]/80 backdrop-blur-md rounded-2xl p-8",
                "border border-cyan-500/10",
                "flex flex-col items-center text-center",
                "transition-all duration-300 ease-out",
                "hover:border-cyan-400/50 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)] hover:-translate-y-1",
                "overflow-hidden"
              )}
            >
              {/* Card internal glow on hover */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              <div className="relative mb-6 p-4 rounded-full bg-[#0d1626] border border-cyan-500/20 text-cyan-400 group-hover:text-cyan-300 group-hover:scale-110 group-hover:border-cyan-400/60 transition-all duration-300 shadow-[0_0_15px_-5px_rgba(34,211,238,0.2)] group-hover:shadow-[0_0_20px_-3px_rgba(34,211,238,0.5)]">
                {feature.icon}
              </div>

              <div className="flex flex-col items-center mb-3">
                <h4 className="relative text-white font-bold text-xl group-hover:text-cyan-100 transition-colors tracking-wide">
                  {feature.title}
                </h4>
                <span className="text-[10px] text-cyan-500/70 uppercase tracking-[2px] font-bold mt-1 group-hover:text-cyan-400 transition-colors">
                  {feature.subTitle}
                </span>
              </div>

              {/* Divider Line */}
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent my-3 opacity-30 group-hover:opacity-100 transition-opacity duration-300" />

              <p className="relative text-slate-400 text-sm leading-7 mb-8 group-hover:text-slate-300 transition-colors line-clamp-3">
                {feature.description}
              </p>

              <div className="relative mt-auto">
                <span className="inline-flex items-center text-cyan-500 font-bold text-sm tracking-wider uppercase group-hover:text-cyan-300 transition-colors">
                  <span className="mr-2">{feature.actionLabel}</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>

              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/30 group-hover:border-cyan-400 transition-colors rounded-tl-sm opacity-50" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/30 group-hover:border-cyan-400 transition-colors rounded-br-sm opacity-50" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
