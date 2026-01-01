import type React from 'react';

const DownloadSection: React.FC = () => {
  return (
    <section id="download" className="py-20 md:py-32 relative overflow-hidden bg-[#0a0818]">
      <div className="container mx-auto px-4 relative z-10 max-w-5xl text-center">

        {/* Header */}
        <div className="relative mb-12">
          <h2 className="text-cyan-400 font-extrabold text-sm tracking-[3px] uppercase animate-pulse shadow-cyan-500/50 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] mb-4">
            DOWNLOAD TEAM & MATCH DATA
          </h2>
          <h3 className="text-white font-black text-3xl md:text-5xl tracking-tight cyber-title drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            チーム＆マッチデータの<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">ダウンロード</span>
          </h3>
        </div>

        <p className="text-slate-400 text-lg leading-relaxed mb-16 max-w-3xl mx-auto">
          分析と戦略開発のための包括的なデータにアクセスしましょう。詳細なチームおよび試合統計からの洞察を得てゲームプレイを向上させます。
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Team Data Card */}
          <div className="group bg-[#0d1124] rounded-2xl p-8 border border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)] transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" strokeWidth={1.5} />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-bold mb-4">チームデータ</h3>
            <p className="text-slate-400 text-sm mb-8 min-h-[40px]">
              詳細なチーム統計とパフォーマンス指標をダウンロード
            </p>
            <a href="/sumdownload/team" className="inline-flex items-center gap-2 text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
              ダウンロード
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              </svg>
            </a>
          </div>

          {/* Match Data Card */}
          <div className="group bg-[#0d1124] rounded-2xl p-8 border border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)] transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <line x1="17" y1="10" x2="3" y2="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
                <line x1="21" y1="6" x2="3" y2="6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
                <line x1="21" y1="14" x2="3" y2="14" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
                <line x1="17" y1="18" x2="3" y2="18" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
              </svg>
            </div>
            <h3 className="text-white text-xl font-bold mb-4">マッチデータ</h3>
            <p className="text-slate-400 text-sm mb-8 min-h-[40px]">
              戦略向上のためのバトルレポートとマッチ分析へアクセス
            </p>
            <a href="/sumdownload/match" className="inline-flex items-center gap-2 text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
              ダウンロード
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              </svg>
            </a>
          </div>
        </div>

        <p className="text-slate-400 text-sm">
          詳細情報が必要ですか？
          <a href="/guide" className="text-cyan-400 hover:text-cyan-300 ml-1 transition-colors">
            統合ガイドとチュートリアル
          </a>
          をご確認ください。
        </p>
      </div>
    </section>
  );
};

export default DownloadSection;
