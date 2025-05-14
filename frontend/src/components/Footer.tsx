'use client';

import React from "react";
import Icons from "@/components/Icons";

const Footer = () => {
  return (
    <footer style={{
      background: "#0a0e1a",
      borderTop: "1px solid #07324a",
      padding: "48px 0 32px 0",
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
          <div style={{ fontSize: "12px", opacity: 0.7 }}> Team Project Europa 2016-{new Date().getFullYear()}</div>
        </div>

        {/* 機能 */}
        <div>
          <div style={{ color: "#00c8ff", fontWeight: 600, marginBottom: "10px" }}>機能</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 2 }}>
            <li><a href="/search/team" style={{ color: "#b0c4d8", textDecoration: "none" }}>チームデータ検索</a></li>
            <li><a href="/search/match" style={{ color: "#b0c4d8", textDecoration: "none" }}>マッチデータ検索</a></li>
            <li><a href="/sumdownload/team" style={{ color: "#b0c4d8", textDecoration: "none" }}>チームデータ一括DL</a></li>
            <li><a href="/sumdownload/match" style={{ color: "#b0c4d8", textDecoration: "none" }}>マッチデータ一括DL</a></li>
            <li><a href="/info" style={{ color: "#b0c4d8", textDecoration: "none" }}>Information</a></li>
          </ul>
        </div>

        {/* アカウント */}
        <div>
          <div style={{ color: "#00c8ff", fontWeight: 600, marginBottom: "10px" }}>アカウント</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 2 }}>
            <li><a href="/login" style={{ color: "#b0c4d8", textDecoration: "none" }}>ログイン</a></li>
            <li><a href="/register" style={{ color: "#b0c4d8", textDecoration: "none" }}>新規登録</a></li>

          </ul>
        </div>

        {/* 問い合わせ・法的情報 */}
        <div>
          <div style={{ color: "#00c8ff", fontWeight: 600, marginBottom: "10px" }}>お問い合わせ・法的情報</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 2 }}>
            <li><a href="/about" style={{ color: "#b0c4d8", textDecoration: "none" }}>私たちについて</a></li>
            <li><a href="https://hp.project-europa.work/contact" target="_blank" style={{ color: "#b0c4d8", textDecoration: "none" }}>お問い合わせ</a></li>
            <li><a href="/privacy-policy" style={{ color: "#b0c4d8", textDecoration: "none" }}>プライバシーポリシー</a></li>
            <li><a href="/terms-of-service" style={{ color: "#b0c4d8", textDecoration: "none" }}>利用規約</a></li>
            <li><a href="/faq" style={{ color: "#b0c4d8", textDecoration: "none" }}>よくある質問</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
