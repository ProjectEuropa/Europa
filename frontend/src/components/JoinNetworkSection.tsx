import type React from 'react';

const JoinNetworkSection: React.FC = () => {
  return (
    <section id="join" className="py-20 relative overflow-hidden bg-gradient-to-b from-[#0a0818] to-[#050510]">
      <div className="container mx-auto px-4 relative z-10 max-w-4xl text-center">

        {/* Header */}
        <div className="relative mb-8">
          <h2 className="text-cyan-400 font-extrabold text-sm tracking-[3px] uppercase animate-pulse shadow-cyan-500/50 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] mb-4">
            JOIN OUR COMMUNITY
          </h2>
          <h3 className="text-white font-black text-3xl md:text-5xl tracking-tight cyber-title drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            Discordに<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">参加</span>しませんか？
          </h3>
        </div>

        <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
          Discordに参加して、グローバルなカルネージハート エクサコミュニティで盛り上げましょう！
        </p>

        <a
          href="https://discord.gg/aXT3DNU8A4"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:-translate-y-1 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" strokeWidth={2} />
            <line x1="20" y1="8" x2="20" y2="14" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            <line x1="23" y1="11" x2="17" y2="11" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
          Discordに参加
        </a>
      </div>
    </section>
  );
};

export default JoinNetworkSection;
