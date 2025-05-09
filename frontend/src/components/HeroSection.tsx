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
              {/* 背景の暗い円形 */}
              <circle cx="160" cy="160" r="140" fill="#050B1F" />
              
              {/* 木星の本体 */}
              <circle cx="160" cy="160" r="120" fill="#0A1535" />
              <circle cx="160" cy="160" r="120" fill="url(#jupiterGradient)" />
              
              {/* 木星の縞模様 */}
              <path d="M40 160C40 160 80 145 160 145C240 145 280 160 280 160C280 160 240 175 160 175C80 175 40 160 40 160Z" fill="#00A3D3" fillOpacity="0.3" />
              <path d="M50 120C50 120 90 110 160 110C230 110 270 120 270 120C270 120 230 130 160 130C90 130 50 120 50 120Z" fill="#00A3D3" fillOpacity="0.2" />
              <path d="M60 200C60 200 100 190 160 190C220 190 260 200 260 200C260 200 220 210 160 210C100 210 60 200 60 200Z" fill="#00A3D3" fillOpacity="0.2" />
              
              {/* 大赤斑風の楕円 */}
              <ellipse cx="200" cy="145" rx="25" ry="15" fill="#00C8FF" fillOpacity="0.3" />
              
              {/* 光沢効果 */}
              <circle cx="120" cy="120" r="60" fill="url(#jupiterHighlight)" />
              
              {/* 外側のリング */}
              <circle cx="160" cy="160" r="135" stroke="#00c8ff" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="160" cy="160" r="140" stroke="#00c8ff" strokeWidth="0.5" />
              
              {/* グラデーション定義 */}
              <defs>
                <radialGradient id="jupiterGradient" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
                  <stop offset="0%" stopColor="#0D1E45" />
                  <stop offset="70%" stopColor="#071224" />
                  <stop offset="100%" stopColor="#050B1F" />
                </radialGradient>
                <radialGradient id="jupiterHighlight" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
                  <stop offset="0%" stopColor="#00C8FF" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#00C8FF" stopOpacity="0" />
                </radialGradient>
              </defs>
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
