import { useRouter } from 'next/navigation';
import type React from 'react';

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/search/team?keyword=${encodeURIComponent(searchQuery.trim())}`
      );
    } else {
      router.push('/search/team');
    }
  };
  return (
    <section id="search" className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-b from-[#0a0818]/0 to-[#0a0818]/80">
      <div className="container mx-auto px-4 relative z-10 max-w-4xl text-center">

        {/* Header */}
        <div className="relative mb-12">
          <h2 className="text-cyan-400 font-extrabold text-sm tracking-[3px] uppercase animate-pulse shadow-cyan-500/50 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] mb-4">
            SEARCH TEAMS & MATCHES
          </h2>
          <h3 className="text-white font-black text-3xl md:text-5xl tracking-tight cyber-title drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            チームとマッチを<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">検索</span>
          </h3>
        </div>

        <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
          強力な検索ツールを使用して、条件に一致するチーム、マッチデータ、OKEを見つけましょう。
        </p>

        {/* Search Box */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row max-w-2xl mx-auto mb-8 shadow-2xl shadow-cyan-900/20"
        >
          <input
            type="text"
            placeholder="チーム、マッチ、OKEを検索..."
            className="flex-1 px-6 py-4 bg-[#0d0d1f] border border-r-0 border-cyan-500/20 text-white placeholder-slate-500 rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none focus:outline-none focus:border-cyan-500/50 transition-colors"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none transition-all flex items-center justify-center gap-2 group"
          >
            検索
            <span className="group-hover:translate-x-1 transition-transform">⟶</span>
          </button>
        </form>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/search/team"
            className="flex items-center gap-2 px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            チームデータ検索
          </a>
          <a
            href="/search/match"
            className="flex items-center gap-2 px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            マッチデータ検索
          </a>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
