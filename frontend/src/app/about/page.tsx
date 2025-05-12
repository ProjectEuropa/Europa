"use client";

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div style={{
          maxWidth: "1200px",
          margin: "40px auto",
          padding: "0 5%",
          color: "#b0c4d8",
        }}>
          <h1 style={{ 
            fontSize: "36px", 
            fontWeight: "bold", 
            color: "#00c8ff", 
            marginBottom: "24px",
            textAlign: "center" 
          }}>
            私たちについて
          </h1>
          
          <div style={{ 
            background: "#0a1022", 
            borderRadius: "12px", 
            padding: "32px", 
            border: "1px solid #07324a",
            lineHeight: "1.8",
            fontSize: "16px"
          }}>
            <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px" }}>Project Europaとは</h2>
            <p style={{ marginBottom: "24px" }}>
              Project Europaは、カルネージハート EXAのコミュニティをサポートするために2016年に設立された非公式プロジェクトです。
              プレイヤーの皆様がゲーム体験を最大限に楽しめるよう、チームデータの共有やマッチデータの分析などのサービスを提供しています。
            </p>

            <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px", marginTop: "32px" }}>ミッション</h2>
            <p style={{ marginBottom: "24px" }}>
              私たちのミッションは、カルネージハート EXAのプレイヤーコミュニティを活性化し、
              プレイヤー同士の交流を促進することです。データの共有と分析を通じて、
              より戦略的で楽しいゲームプレイを支援します。
            </p>

            <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px", marginTop: "32px" }}>チーム</h2>
            <p style={{ marginBottom: "24px" }}>
              Project Europaは、カルネージハート EXAを愛する有志のプレイヤーによって運営されています。
              開発、デザイン、コミュニティマネジメントなど、様々な分野の専門家がボランティアとして参加しています。
            </p>

            <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px", marginTop: "32px" }}>歴史</h2>
            <p style={{ marginBottom: "24px" }}>
              2016年の設立以来、Project Europaは継続的にサービスを拡充し、コミュニティのニーズに応えてきました。
              最初はシンプルなデータ共有サイトとして始まりましたが、現在では検索機能、分析ツール、
              コミュニティフォーラムなど、多様な機能を提供しています。
            </p>

            <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px", marginTop: "32px" }}>今後の展望</h2>
            <p>
              私たちは今後も新機能の開発や既存機能の改善を続け、より使いやすく価値のあるプラットフォームを
              目指しています。コミュニティからのフィードバックを大切にし、プレイヤーの皆様と共に成長していきたいと考えています。
            </p>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
