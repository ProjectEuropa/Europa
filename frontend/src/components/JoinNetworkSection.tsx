import React from 'react';

const JoinNetworkSection: React.FC = () => {
  return (
    <section id="join" style={{
      padding: "80px 0",
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(180deg, #0a0818 0%, #050510 100%)"
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
          Discordに参加しませんか？
        </h2>
        <p style={{
          color: "#b0c4d8",
          fontSize: "1.05rem",
          lineHeight: 1.6,
          marginBottom: "40px",
          maxWidth: "600px",
          margin: "0 auto 40px"
        }}>
          Discordに参加して、グローバルなカルネージハートEXAコミュニティで盛り上げましょう！
        </p>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          flexWrap: "wrap"
        }}>
          <a href="https://discord.gg/aXT3DNU8A4" target="_blank" rel="noopener noreferrer" style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 32px",
            background: "#00c8ff",
            borderRadius: "4px",
            color: "#0a0818",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: 600,
            transition: "all 0.2s ease"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            Discordに参加
          </a>

        </div>
      </div>
    </section>
  );
};

export default JoinNetworkSection;
