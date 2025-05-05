'use client';

import React from "react";
import Link from "next/link";
import Icons from "@/components/Icons";

const Header = () => {
  return (
    <header style={{
      padding: "20px 5%",
      borderBottom: "1px solid rgba(0, 200, 255, 0.3)",
      zIndex: 10,
      position: "relative",
      background: "#0a0818"
    }}>
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center" 
      }}>
        {/* ロゴ＋サブタイトル */}
        <Link href="/" style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "8px",
          textDecoration: "none"
        }}>
          <Icons.Logo size={32} />
          <span style={{ 
            color: "#00c8ff", 
            fontSize: "20px", 
            fontWeight: 700, 
            letterSpacing: "0.5px" 
          }}>EUROPA</span>
        </Link>
        
        {/* ナビゲーション */}
        <nav style={{ 
          display: "flex", 
          gap: "16px", 
          alignItems: "center", 
          marginLeft: "32px" 
        }}>
          <Link href="/login" style={{ 
            color: "#b0c4d8", 
            textDecoration: "none", 
            fontSize: "15px", 
            fontWeight: 500, 
            display: "flex", 
            alignItems: "center", 
            gap: "4px",
            transition: "color 0.2s"
          }}>
            <Icons.Login size={18} /> ログイン
          </Link>
          <Link href="/register" style={{ 
            color: "#00c8ff", 
            border: "1px solid #00c8ff", 
            padding: "6px 12px", 
            borderRadius: "4px", 
            textDecoration: "none", 
            fontSize: "15px", 
            fontWeight: 600, 
            transition: "background-color 0.2s", 
            display: "flex", 
            alignItems: "center", 
            gap: "4px" 
          }}>
            <Icons.Register size={18} /> 新規登録
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
