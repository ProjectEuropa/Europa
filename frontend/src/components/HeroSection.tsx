import type React from 'react';
import { cn } from '@/lib/utils';

const stats = [
  { value: '800+', label: '登録済みOKE', subLabel: 'Registered OKEs' },
  { value: '100+', label: 'アクティブチーム', subLabel: 'Active Teams' },
  { value: '250+', label: 'シミュレートバトル', subLabel: 'Battle Sims' },
];

const HeroSection: React.FC = () => {
  return (
    <section aria-label="ヒーローセクション" className="relative pt-24 pb-32 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_-20%,rgba(14,165,233,0.15),transparent_50%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

          {/* Left Column: Text Content */}
          <div className="flex-1 min-w-[300px] max-w-2xl relative">
            {/* Decorative accent */}
            <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 hidden lg:block" />

            <div className="inline-flex items-center gap-3 mb-6 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-400 font-bold text-sm tracking-wider uppercase">
                カルネージハート エクサ | CARNAGE HEART EXA
              </span>
            </div>

            <h1 className="text-white font-black text-5xl lg:text-7xl leading-tight mb-8 drop-shadow-2xl">
              <span className="block text-2xl lg:text-3xl font-bold text-cyan-500 mb-4 tracking-widest uppercase">
                Unofficial OKE Platform
              </span>
              非公式 OKE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300 animate-gradient-x">
                共有データベース
              </span>
            </h1>

            <p className="text-slate-300 text-lg lg:text-xl leading-loose mb-10 max-w-xl border-l-2 border-slate-700 pl-6">
              あなたの戦略アルゴリズムをアップロードし、戦術的思考を共有。<br className="hidden sm:block" />
              世界中のOKE開発者とつながるための、次世代プラットフォーム。
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <a
                href="/register"
                className="group relative px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-lg rounded overflow-hidden transition-all shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)]"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12" />
                <span className="relative flex items-center gap-2">
                  無料で始める
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </a>
              <a
                href="/about"
                className="group px-8 py-4 bg-transparent border border-cyan-500/50 text-cyan-400 hover:text-cyan-300 font-bold text-lg rounded hover:bg-cyan-950/30 transition-all hover:border-cyan-400"
              >
                詳細を見る
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-800">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col">
                  <div className="text-3xl lg:text-4xl font-black text-white mb-1 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-sm text-cyan-400 font-bold mb-0.5">
                    {stat.label}
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">
                    {stat.subLabel}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Cyber Graphic (Jupiter) */}
          <div className="flex-1 flex justify-center items-center relative lg:justify-end perspective-1000">
            {/* Background Glow behind planet */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative w-[320px] h-[320px] lg:w-[450px] lg:h-[450px] animate-float">
              {/* Orbital Rings - Decorative CSS only rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-cyan-500/20 rounded-full animate-spin-slow pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-dashed border-cyan-500/30 rounded-full animate-reverse-spin pointer-events-none" />

              <svg width="100%" height="100%" viewBox="0 0 320 320" fill="none" className="drop-shadow-[0_0_50px_rgba(0,200,255,0.3)]">
                {/* Background Dark Circle */}
                <circle cx="160" cy="160" r="140" fill="#050B1F" />

                {/* Main Planet Body */}
                <circle cx="160" cy="160" r="120" fill="#0A1535" />
                <circle cx="160" cy="160" r="120" fill="url(#jupiterGradient)" />

                {/* Stripes */}
                <path
                  d="M40 160C40 160 80 145 160 145C240 145 280 160 280 160C280 160 240 175 160 175C80 175 40 160 40 160Z"
                  fill="#00A3D3"
                  fillOpacity="0.3"
                />
                <path
                  d="M50 120C50 120 90 110 160 110C230 110 270 120 270 120C270 120 230 130 160 130C90 130 50 120 50 120Z"
                  fill="#00A3D3"
                  fillOpacity="0.2"
                />
                <path
                  d="M60 200C60 200 100 190 160 190C220 190 260 200 260 200C260 200 220 210 160 210C100 210 60 200 60 200Z"
                  fill="#00A3D3"
                  fillOpacity="0.2"
                />

                {/* Great Red Spot (Abstract) */}
                <ellipse
                  cx="200"
                  cy="145"
                  rx="25"
                  ry="15"
                  fill="#00C8FF"
                  fillOpacity="0.3"
                />

                {/* Highlight */}
                <circle cx="120" cy="120" r="60" fill="url(#jupiterHighlight)" />

                {/* Inner Scanning Grid (New) */}
                <path d="M60 160 H260 M160 60 V260" stroke="#00c8ff" strokeWidth="0.5" strokeOpacity="0.3" />

                <defs>
                  <radialGradient
                    id="jupiterGradient"
                    cx="0.5"
                    cy="0.5"
                    r="0.5"
                    gradientUnits="objectBoundingBox"
                  >
                    <stop offset="0%" stopColor="#0D1E45" />
                    <stop offset="70%" stopColor="#071224" />
                    <stop offset="100%" stopColor="#050B1F" />
                  </radialGradient>
                  <radialGradient
                    id="jupiterHighlight"
                    cx="0.5"
                    cy="0.5"
                    r="0.5"
                    gradientUnits="objectBoundingBox"
                  >
                    <stop offset="0%" stopColor="#00C8FF" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#00C8FF" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>

              {/* Floating UI Elements around planet */}
              <div className="absolute top-10 right-0 bg-black/60 backdrop-blur-md border border-cyan-500/30 p-2 rounded text-xs text-cyan-300 font-mono shadow-lg animate-pulse">
                SYS: ONLINE
              </div>
              <div className="absolute bottom-20 left-0 bg-black/60 backdrop-blur-md border border-cyan-500/30 p-2 rounded text-xs text-cyan-300 font-mono shadow-lg">
                TARGET: EUROPA
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
