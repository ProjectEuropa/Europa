'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// SVGアイコンコンポーネント
const Icons = {
  Logo: ({ size = 30, color = "#00c8ff", secondaryColor = "#0060a0" }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="36" height="36" rx="4" fill="url(#grad)" />
      <path d="M10 10H30M10 20H25M10 30H30" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 5V35" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 3" />
      <circle cx="30" cy="20" r="3" fill="white" />
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor={color} />
          <stop offset="1" stopColor={secondaryColor} />
        </linearGradient>
      </defs>
    </svg>
  ),
  TeamSearch: ({ size = 40, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="8" r="3.5" stroke={color} strokeWidth="1.5"/>
      <circle cx="17" cy="10" r="2.5" stroke={color} strokeWidth="1.5"/>
      <circle cx="7" cy="16" r="2.5" stroke={color} strokeWidth="1.5"/>
      <circle cx="16" cy="16" r="2.5" stroke={color} strokeWidth="1.5"/>
      <path d="M10 11.5C7.5 11.5 3 12.5 3 16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M17 12.5C18.5 12.5 21 13.2 21 15" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 18.5C5.8 18.5 4 19 4 20.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 18.5C17.2 18.5 19 19 19 20.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  MatchSearch: ({ size = 40, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 4L18 8L14 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 20L6 16L10 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 8H13C10.7909 8 9 9.79086 9 12V16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 16H11C13.2091 16 15 14.2091 15 12V8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Upload: ({ size = 40, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 16V4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 9L12 4L17 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 16V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  TeamDownload: ({ size = 40, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="7" r="3" stroke={color} strokeWidth="1.5"/>
      <path d="M19 20C19 16.134 15.866 13 12 13C8.13401 13 5 16.134 5 20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 13V20M12 20L15 17M12 20L9 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  MatchDownload: ({ size = 40, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6H20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 10H20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 14H12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 18H12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 14V20M16 20L19 17M16 20L13 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Information: ({ size = 40, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
      <path d="M12 8V16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="6.5" r="0.5" fill={color} stroke={color} strokeWidth="0.5"/>
    </svg>
  ),
  Register: ({ size = 20, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.5"/>
      <path d="M5 20C5 16.6863 8.13401 14 12 14C15.866 14 19 16.6863 19 20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M19 6L21 8L19 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Login: ({ size = 20, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 4L20 4L20 20L14 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 12L15 12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 7L15 12L10 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Guidelines: ({ size = 20, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 3H6C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V5C20 3.89543 19.1046 3 18 3H16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 3C10.8954 3 10 3.89543 10 5V7C10 8.10457 10.8954 9 12 9C13.1046 9 14 8.10457 14 7V5C14 3.89543 13.1046 3 12 3Z" stroke={color} strokeWidth="1.5"/>
      <path d="M8 13H16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 17H16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Arrow: ({ size = 20, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 12H20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 6L20 12L14 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Search: ({ size = 20, color = "#0a0818" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2"/>
      <path d="M16 16L20 20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
};

// ヘッダー（インライン実装）
function Header() {
  return (
    <header className="bg-[#010220] border-b border-[#03C6F9]/20">
      <div className="max-w-screen-lg mx-auto px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icons.Logo size={32} />
          <span className="text-cyberblue text-xl font-bold tracking-wide">Europa</span>
        </div>
        <nav className="flex gap-6 text-gray-300 text-sm font-medium items-center">
          <a href="#features" className="hover:text-cyberblue transition">特徴</a>
          <a href="#search" className="hover:text-cyberblue transition">検索</a>
          <a href="#upload" className="hover:text-cyberblue transition">アップロード</a>
          <a href="#download" className="hover:text-cyberblue transition">ダウンロード</a>
          <a href="#about" className="hover:text-cyberblue transition">ガイド</a>
        </nav>
        <div className="flex gap-4 items-center ml-8">
          <a href="/login" className="flex items-center gap-1 text-gray-300 hover:text-cyberblue transition text-sm font-medium">
            <Icons.Login size={18} /> ログイン
          </a>
          <a href="/register" className="flex items-center gap-1 text-cyberblue border border-cyberblue px-3 py-1.5 rounded hover:bg-cyberblue/10 transition text-sm font-semibold">
            <Icons.Register size={18} /> 新規登録
          </a>
        </div>
      </div>
    </header>
  );
}

// フッター（インライン実装）
function Footer() {
  return (
    <footer className="bg-[#010220] border-t border-[#03C6F9]/20 pt-12 pb-8 mt-16">
      <div className="max-w-screen-lg mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-400 text-sm">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Icons.Logo size={28} />
            <span className="text-cyberblue font-bold">Europa</span>
          </div>
          <span> 2024 Europa. All rights reserved.</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-gray-300 font-semibold mb-1">リンク</span>
          <a href="#features" className="hover:text-cyberblue transition">特徴</a>
          <a href="#search" className="hover:text-cyberblue transition">検索</a>
          <a href="#upload" className="hover:text-cyberblue transition">アップロード</a>
          <a href="#download" className="hover:text-cyberblue transition">ダウンロード</a>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-gray-300 font-semibold mb-1">ガイド</span>
          <a href="#about" className="hover:text-cyberblue transition">利用規約</a>
          <a href="#about" className="hover:text-cyberblue transition">プライバシー</a>
          <a href="#about" className="hover:text-cyberblue transition">お問い合わせ</a>
        </div>
      </div>
    </footer>
  );
}

const features = [
  {
    icon: <Icons.TeamSearch size={36} />,
    title: 'チームデータ検索',
    description: 'ランキングやパフォーマンス指標など、様々な条件でチームを検索、探索できます。',
  },
  {
    icon: <Icons.MatchSearch size={36} />,
    title: 'マッチデータ検索',
    description: '戦略や戦術を向上させるために、試合結果やパフォーマンスデータを分析します。',
  },
  {
    icon: <Icons.Upload size={36} />,
    title: 'シンプルアップロード',
    description: '合理化されたアップロードシステムでOKEファイルを簡単にアップロードできます。',
  },
  {
    icon: <Icons.TeamDownload size={36} />,
    title: 'チームデータ取得',
    description: 'オフライン分析や戦略開発のために包括的なチームデータをダウンロードします。',
  },
  {
    icon: <Icons.MatchDownload size={36} />,
    title: 'マッチデータ取得',
    description: '過去の戦闘から学ぶための詳細な試合統計とリプレイデータを取得します。',
  },
  {
    icon: <Icons.Information size={36} />,
    title: '情報',
    description: 'カルネージハートEXAの詳細なガイド、チュートリアル、コミュニティリソースにアクセス。',
  },
];

const stats = [
  { value: '100%', label: 'チームデータ' },
  { value: '500+', label: 'マッチデータ' },
  { value: '1000+', label: 'ユーザー' },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="europa-lp" style={{
      background: "#0a0818",
      minHeight: "100vh",
      color: "#fff",
      fontFamily: '"Rajdhani", "Noto Sans JP", sans-serif',
      lineHeight: 1.6,
      overflowX: "hidden"
    }}>
      {/* Header */}
      <header style={{
        padding: "20px 5%",
        borderBottom: "1px solid rgba(0, 200, 255, 0.3)",
        zIndex: 10,
        position: "relative"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Icons.Logo size={32} />
            <span style={{ color: "#00c8ff", fontSize: "20px", fontWeight: 700, letterSpacing: "0.5px" }}>EUROPA</span>
          </div>
          <div style={{ display: "flex", gap: "16px", alignItems: "center", marginLeft: "32px" }}>
            <a href="/login" style={{ color: "#b0c4d8", textDecoration: "none", fontSize: "15px", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px" }}>
              <Icons.Login size={18} /> ログイン
            </a>
            <a href="/register" style={{ color: "#00c8ff", border: "1px solid #00c8ff", padding: "6px 12px", borderRadius: "4px", textDecoration: "none", fontSize: "15px", fontWeight: 600, transition: "background-color 0.2s", display: "flex", alignItems: "center", gap: "4px" }}>
              <Icons.Register size={18} /> 新規登録
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
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
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#00c8ff", marginBottom: "4px" }}>2,500+</div>
                <div style={{ fontSize: "14px", color: "#b0c4d8" }}>登録済みOKE</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#00c8ff", marginBottom: "4px" }}>180+</div>
                <div style={{ fontSize: "14px", color: "#b0c4d8" }}>アクティブチーム</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#00c8ff", marginBottom: "4px" }}>15k+</div>
                <div style={{ fontSize: "14px", color: "#b0c4d8" }}>シミュレートバトル</div>
              </div>
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

       {/* 主な機能セクション */}
      <section id="features" style={{
        padding: "80px 0 60px 0",
        background: "transparent"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 5%" }}>
          <h2 style={{
            textAlign: "center",
            color: "#fff",
            fontWeight: 900,
            fontSize: "2.2rem",
            marginBottom: "10px",
            letterSpacing: "1px"
          }}>主な機能</h2>
          <div style={{
            textAlign: "center",
            color: "#b0c4d8",
            fontSize: "1.08rem",
            marginBottom: "38px"
          }}>
            EUROPAの機能を活用して、OKE管理をより効率的に行いましょう
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "32px",
            justifyContent: "center"
          }}>
            {features.map((feature, index) => (
              <div key={index} style={{background: "#0a0e1a", border: "1.5px solid #00c8ff33", borderRadius: "16px", padding: "32px 24px 28px 24px", boxShadow: "0 0 24px 0 #00c8ff22", display: "flex", flexDirection: "column", alignItems: "center", transition: "box-shadow 0.2s, border 0.2s", minHeight: "260px", cursor: "pointer"}}>
                <div style={{ marginBottom: "12px" }}>{feature.icon}</div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: "1.18rem", marginBottom: "4px" }}>{feature.title}</div>
                <div style={{ color: "#00c8ff", fontSize: "0.98rem", fontWeight: 600, marginBottom: "12px" }}>{feature.title.replace('データ', ' Data').replace('シンプル', 'Simple ').replace('情報', 'Information')}</div> {/* Simplified English title */}
                <div style={{ color: "#b0c4d8", fontSize: "0.98rem", marginBottom: "18px", textAlign: "center" }}>{feature.description}</div>
                <a href="#" style={{ color: "#00c8ff", fontWeight: 600, fontSize: "0.98rem", textDecoration: "none" }}>アクセスする →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 検索セクション */}
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
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginBottom: "60px" }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="検索..."
              style={{
                padding: "12px 16px",
                fontSize: "1.1rem",
                fontWeight: 500,
                borderRadius: "4px",
                border: "1px solid #00c8ff",
                width: "100%",
                maxWidth: "400px"
              }}
            />
            <button
              type="submit"
              style={{
                padding: "12px 24px",
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: "4px",
                border: "none",
                background: "#00c8ff",
                color: "#0a0818",
                cursor: "pointer"
              }}
            >
              検索
            </button>
          </div>
          {/* 検索オプションボタン */}
          <div style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "24px"
          }}>
            <a href="/team-search" style={{
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
            <a href="/match-search" style={{
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

      {/* アップロードセクション */}
      <section id="upload" style={{
        padding: "80px 0",
        position: "relative",
        overflow: "hidden",
        background: "#0a0818"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "40px"
        }}>
          {/* 左側：テキストとボタン */}
          <div style={{
            flex: "1 1 400px",
            minWidth: "300px",
            maxWidth: "500px"
          }}>
            <h2 style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: "2.5rem",
              marginBottom: "16px"
            }}>
              OKEをアップロード
            </h2>
            <div style={{
              color: "#00c8ff",
              fontSize: "16px",
              marginBottom: "24px"
            }}>
              Upload Your OKE
            </div>
            <p style={{
              color: "#b0c4d8",
              fontSize: "1.05rem",
              lineHeight: 1.6,
              marginBottom: "32px"
            }}>
              あなたのカルネージハートEXAアルゴリズムをコミュニティと共有しましょう。シンプルなアップロードシステムにより、簡単に投稿してフィードバックを得ることができます。
            </p>
            <div style={{
              display: "flex",
              gap: "16px"
            }}>
              <a href="/upload" style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                background: "#00c8ff",
                borderRadius: "4px",
                color: "#0a0818",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: 600,
                transition: "all 0.2s ease"
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 14V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6"></path>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                  <path d="M16 17l-4-4-4 4"></path>
                  <line x1="12" y1="13" x2="12" y2="21"></line>
                </svg>
                アップロードする
              </a>
              <a href="/guidelines" style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                background: "transparent",
                border: "1px solid #00c8ff",
                borderRadius: "4px",
                color: "#00c8ff",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: 500,
                transition: "all 0.2s ease"
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                ガイドラインを見る
              </a>
            </div>
          </div>

          {/* 右側：ドラッグ＆ドロップエリア */}
          <div style={{
            flex: "1 1 400px",
            minWidth: "300px"
          }}>
            <div style={{
              background: "#0d1124",
              borderRadius: "8px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)"
            }}>
              <div style={{
                color: "#fff",
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "24px",
                textAlign: "center"
              }}>
                OKEアップロード
              </div>
              <div style={{
                border: "2px dashed #00c8ff40",
                borderRadius: "8px",
                padding: "40px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00c8ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "16px" }}>
                  <path d="M21 14V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6"></path>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                  <path d="M16 17l-4-4-4 4"></path>
                  <line x1="12" y1="13" x2="12" y2="21"></line>
                </svg>
                <div style={{ color: "#00c8ff", fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>
                  OKEファイルをドラッグ＆ドロップ
                </div>
                <div style={{ color: "#b0c4d8", fontSize: "14px" }}>
                  またはクリックしてファイルを選択
                </div>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "16px",
                fontSize: "14px"
              }}>
                <div style={{ color: "#b0c4d8" }}>
                  対応形式: .CHX, .OKE
                </div>
                <div style={{ color: "#00c8ff" }}>
                  最大サイズ: 10MB
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ダウンロードセクション */}
      <section id="download" style={{
        padding: "80px 0",
        position: "relative",
        overflow: "hidden",
        background: "#0a0818"
      }}>
        <div style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "0 20px",
          textAlign: "center"
        }}>
          <h2 style={{
            color: "#fff",
            fontWeight: 800,
            fontSize: "2.5rem",
            marginBottom: "16px"
          }}>
            チーム＆マッチデータのダウンロード
          </h2>
          <div style={{
            color: "#00c8ff",
            fontSize: "16px",
            marginBottom: "24px"
          }}>
            Download Team & Match Data
          </div>
          <p style={{
            color: "#b0c4d8",
            fontSize: "1.05rem",
            lineHeight: 1.6,
            marginBottom: "48px",
            maxWidth: "800px",
            margin: "0 auto 48px"
          }}>
            分析と戦略開発のための包括的なデータにアクセスしましょう。詳細なチームおよび試合統計からの洞察を得てゲームプレイを向上させます。
          </p>
          {/* ダウンロードカード */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "32px",
            flexWrap: "wrap",
            marginBottom: "40px"
          }}>
            {/* チームデータカード */}
            <div style={{
              flex: "1 1 300px",
              maxWidth: "400px",
              background: "#0d1124",
              borderRadius: "8px",
              padding: "32px 24px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              border: "1px solid #00c8ff20",
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}>
              <div style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "#00c8ff10",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px"
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00c8ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 style={{
                color: "#fff",
                fontSize: "20px",
                fontWeight: 700,
                marginBottom: "16px"
              }}>
                チームデータ
              </h3>
              <p style={{
                color: "#b0c4d8",
                fontSize: "15px",
                lineHeight: 1.5,
                marginBottom: "24px",
                minHeight: "70px"
              }}>
                詳細なチーム統計とパフォーマンス指標をダウンロード
              </p>
              <a href="/team-data" style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "#00c8ff",
                fontSize: "15px",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.2s ease"
              }}>
                ダウンロード
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </a>
            </div>

            {/* マッチデータカード */}
            <div style={{
              flex: "1 1 300px",
              maxWidth: "400px",
              background: "#0d1124",
              borderRadius: "8px",
              padding: "32px 24px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              border: "1px solid #00c8ff20",
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}>
              <div style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "#00c8ff10",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px"
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00c8ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="17" y1="10" x2="3" y2="10"></line>
                  <line x1="21" y1="6" x2="3" y2="6"></line>
                  <line x1="21" y1="14" x2="3" y2="14"></line>
                  <line x1="17" y1="18" x2="3" y2="18"></line>
                </svg>
              </div>
              <h3 style={{
                color: "#fff",
                fontSize: "20px",
                fontWeight: 700,
                marginBottom: "16px"
              }}>
                マッチデータ
              </h3>
              <p style={{
                color: "#b0c4d8",
                fontSize: "15px",
                lineHeight: 1.5,
                marginBottom: "24px",
                minHeight: "70px"
              }}>
                戦略向上のためのバトルレポートとマッチ分析へアクセス
              </p>
              <a href="/match-data" style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "#00c8ff",
                fontSize: "15px",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.2s ease"
              }}>
                ダウンロード
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </a>
            </div>
          </div>
          <p style={{
            color: "#b0c4d8",
            fontSize: "15px"
          }}>
            詳細情報が必要ですか？<a href="/guide" style={{ color: "#00c8ff", textDecoration: "none" }}>統合ガイドとチュートリアル</a>をご確認ください。
          </p>
        </div>
      </section>

      {/* ネットワーク参加セクション */}
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
            ネットワークに参加しませんか？
          </h2>
          <p style={{
            color: "#b0c4d8",
            fontSize: "1.05rem",
            lineHeight: 1.6,
            marginBottom: "40px",
            maxWidth: "600px",
            margin: "0 auto 40px"
          }}>
            今日アカウントを作成して、グローバルなカルネージハートEXAコミュニティであなたのOKEの共有を始めましょう。
          </p>

          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap"
          }}>
            <a href="/register" style={{
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
              今すぐ登録
            </a>
            <a href="/login" style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 32px",
              background: "transparent",
              border: "1px solid #00c8ff",
              borderRadius: "4px",
              color: "#00c8ff",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: 500,
              transition: "all 0.2s ease"
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              ログイン
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: "#0a0e1a",
        borderTop: "1px solid #07324a",
        padding: "48px 0 32px 0",
        marginTop: "64px"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "48px",
          color: "#b0c4d8",
          fontSize: "15px",
          padding: "0 5%"
        }}>
          {/* 左カラム：ロゴ・説明 */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Icons.Logo size={28} />
              <span style={{ color: "#00c8ff", fontWeight: 700, fontSize: "20px" }}>EUROPA</span>
            </div>
            <div style={{ color: "#00c8ff", fontSize: "13px", marginBottom: "8px" }}>カルネージハート EXA</div>
            <div style={{ marginBottom: "16px", lineHeight: 1.7 }}>
              OKE共有とチームコラボレーションのための非公式カルネージハートEXAプラットフォーム。
            </div>
            <div style={{ fontSize: "12px", opacity: 0.7 }}> 2024 PROJECT EUROPA</div>
          </div>
          {/* 機能 */}
          <div>
            <div style={{ color: "#00c8ff", fontWeight: 600, marginBottom: "10px" }}>機能</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 2 }}>
              <li><a href="#features" style={{ color: "#b0c4d8", textDecoration: "none" }}>チームデータ検索</a></li>
              <li><a href="#features" style={{ color: "#b0c4d8", textDecoration: "none" }}>マッチデータ検索</a></li>
              <li><a href="#upload" style={{ color: "#b0c4d8", textDecoration: "none" }}>シンプルアップロード</a></li>
              <li><a href="#download" style={{ color: "#b0c4d8", textDecoration: "none" }}>チームデータ取得</a></li>
              <li><a href="#download" style={{ color: "#b0c4d8", textDecoration: "none" }}>マッチデータ取得</a></li>
              <li><a href="#features" style={{ color: "#b0c4d8", textDecoration: "none" }}>情報</a></li>
            </ul>
          </div>
          {/* アカウント */}
          <div>
            <div style={{ color: "#00c8ff", fontWeight: 600, marginBottom: "10px" }}>アカウント</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 2 }}>
              <li><a href="/login" style={{ color: "#b0c4d8", textDecoration: "none" }}>ログイン</a></li>
              <li><a href="/register" style={{ color: "#b0c4d8", textDecoration: "none" }}>新規登録</a></li>
              <li><a href="#" style={{ color: "#b0c4d8", textDecoration: "none" }}>プロフィール</a></li>
              <li><a href="#" style={{ color: "#b0c4d8", textDecoration: "none" }}>マイチーム</a></li>
              <li><a href="#" style={{ color: "#b0c4d8", textDecoration: "none" }}>マイOKE</a></li>
              <li><a href="#" style={{ color: "#b0c4d8", textDecoration: "none" }}>設定</a></li>
            </ul>
          </div>
          {/* 問い合わせ・法的情報 */}
          <div>
            <div style={{ color: "#00c8ff", fontWeight: 600, marginBottom: "10px" }}>お問い合わせ・法的情報</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 2 }}>
              <li><a href="#" style={{ color: "#b0c4d8", textDecoration: "none" }}>私たちについて</a></li>
              <li><a href="#" style={{ color: "#b0c4d8", textDecoration: "none" }}>お問い合わせ</a></li>
              <li><a href="#" style={{ color: "#b0c4d8", textDecoration: "none" }}>プライバシーポリシー</a></li>
              <li><a href="#" style={{ color: "#b0c4d8", textDecoration: "none" }}>利用規約</a></li>
              <li><a href="#" style={{ color: "#b0c4d8", textDecoration: "none" }}>よくある質問</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
