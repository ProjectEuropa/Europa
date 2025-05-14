import React from 'react';
import { useRouter } from 'next/navigation';

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ searchQuery, setSearchQuery }) => {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search/team?keyword=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/search/team');
    }
  };
  return (
    <section id="search" style={{ 
      padding: "80px 0", 
      position: "relative", 
      overflow: "hidden",
      background: "linear-gradient(180deg, rgba(10, 8, 24, 0) 0%, rgba(10, 8, 24, 0.8) 100%)"
    }}>
      <div style={{ 
        maxWidth: "800px", 
        margin: "0 auto", 
        padding: "0 20px",
        textAlign: "center"
      }}>
        <h2 style={{
          color: "#fff",
          fontWeight: 800,
          fontSize: "2.5rem",
          marginBottom: "24px"
        }}>
          チームとマッチを検索
        </h2>
        <p style={{
          color: "#b0c4d8",
          fontSize: "1.1rem",
          lineHeight: 1.6,
          marginBottom: "40px",
          maxWidth: "600px",
          margin: "0 auto 40px"
        }}>
          強力な検索ツールを使用して、条件に一致するチーム、マッチデータ、OKEを見つけましょう。
        </p>
        
        {/* 検索ボックス */}
        <form onSubmit={handleSearch} style={{
          display: "flex",
          maxWidth: "600px",
          margin: "0 auto 32px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
        }}>
          <input 
            type="text" 
            placeholder="チーム、マッチ、OKEを検索..." 
            style={{
              flex: "1",
              padding: "16px 20px",
              fontSize: "16px",
              border: "none",
              background: "#0d0d1f",
              color: "#fff",
              borderRadius: "4px 0 0 4px",
              outline: "none"
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="submit"
            style={{
              padding: "0 24px",
              background: "#00c8ff",
              color: "#020824",
              border: "none",
              borderRadius: "0 4px 4px 0",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            検索 <span style={{ marginLeft: "8px" }}>⟶</span>
          </button>
        </form>
        
        {/* 検索オプションボタン */}
        <div style={{
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: "24px"
        }}>
          <a href="/search/team" style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            background: "rgba(0, 200, 255, 0.1)",
            border: "1px solid rgba(0, 200, 255, 0.3)",
            borderRadius: "4px",
            color: "#00c8ff",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: 500,
            transition: "all 0.2s ease"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00c8ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            チームデータ検索
          </a>
          <a href="/search/match" style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            background: "rgba(0, 200, 255, 0.1)",
            border: "1px solid rgba(0, 200, 255, 0.3)",
            borderRadius: "4px",
            color: "#00c8ff",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: 500,
            transition: "all 0.2s ease"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00c8ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            マッチデータ検索
          </a>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
