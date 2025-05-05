import React from 'react';

const stats = [
  { value: '2,500+', label: '登録済みOKE' },
  { value: '180+', label: 'アクティブチーム' },
  { value: '15k+', label: 'シミュレートバトル' },
];

const HeroSection: React.FC = () => {
  return (
    <section style={{ 
      padding: "80px 0", 
      position: "relative", 
      overflow: "hidden" 
    }}>
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto", 
        padding: "0 20px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "40px",
        flexWrap: "wrap"
      }}>
        {/* 左カラム：テキストコンテンツ */}
        <div style={{ 
          flex: "1 1 500px", 
          minWidth: "300px", 
          maxWidth: "600px" 
        }}>
          <div style={{
            color: "#00c8ff",
            fontWeight: 700,
            fontSize: "15px",
            letterSpacing: "1.2px",
            marginBottom: "18px"
          }}>
            CARNAGE HEART EXA | カルネージハート EXA
          </div>
          <h1 style={{
            color: "#fff",
            fontWeight: 900,
            fontSize: "3.5rem",
            lineHeight: 1.2,
            marginBottom: "20px"
          }}>
            非公式 OKE<br />
            アップロード&共有プラットフォーム
          </h1>
          <p style={{
            color: "#b0c4d8",
            fontSize: "1.15rem",
            lineHeight: 1.6,
            marginBottom: "40px"
          }}>
            あなたの戦略アルゴリズムをアップロードし、戦術的思考を<br />
            共有し、世界中のOKE開発者とつながりましょう。
          </p>
          <div style={{ display: "flex", gap: "20px", marginBottom: "60px" }}>
            <a href="/register" style={{
              background: "#00c8ff",
              color: "#0a0818",
              fontWeight: 700,
              padding: "12px 24px",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "1.1rem",
              transition: "background-color 0.2s"
            }}>
              無料で始める
            </a>
            <a href="#about" style={{
              border: "2px solid #00c8ff",
              color: "#00c8ff",
              fontWeight: 700,
              padding: "12px 24px",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "1.1rem",
              transition: "background-color 0.2s"
            }}>
              詳細を見る →
            </a>
          </div>
          
          {/* Stats */}
          <div style={{ 
            display: "flex", 
            gap: "40px", 
            marginTop: "20px" 
          }}>
            {stats.map((stat, index) => (
              <div key={index} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#00c8ff", marginBottom: "4px" }}>{stat.value}</div>
                <div style={{ fontSize: "14px", color: "#b0c4d8" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 右カラム：サイバー装飾 */}
        <div style={{ 
          flex: "0 1 400px", 
          minWidth: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{
            position: "relative",
            width: "320px",
            height: "320px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <svg width="100%" height="100%" viewBox="0 0 320 320" fill="none">
              <rect x="30" y="30" width="260" height="260" rx="16" stroke="#00c8ff" strokeWidth="2.5"/>
              <circle cx="160" cy="160" r="85" stroke="#00c8ff" strokeWidth="2"/>
              <circle cx="160" cy="160" r="42" stroke="#00c8ff" strokeWidth="1.5"/>
              <circle cx="160" cy="160" r="130" stroke="#00c8ff" strokeWidth="1" strokeDasharray="6 6"/>
              <path d="M160 30V290M30 160H290" stroke="#00c8ff" strokeWidth="1.5"/>
              <circle cx="160" cy="160" r="8" fill="#00c8ff" fillOpacity="0.18"/>
            </svg>
            <div style={{
              position: "absolute",
              inset: 0,
              borderRadius: "24px",
              boxShadow: "0 0 80px 8px #00c8ff33, 0 0 0 1px #00c8ff22"
            }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
