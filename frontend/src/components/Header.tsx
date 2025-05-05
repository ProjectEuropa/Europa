'use client';

import React from "react";
import Link from "next/link";
import Icons from "@/components/Icons";

const Header = () => {
  return (
    <header className="bg-[#010220]/95 backdrop-blur-md border-b border-[#03C6F9]/20 sticky top-0 z-50 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* ロゴ＋サブタイトル */}
        <Link href="/" className="flex items-center gap-3 group">
          <Icons.Logo size={36} />
          <div>
            <div className="text-white font-bold text-xl tracking-wide">EUROPA</div>
            <div className="text-xs text-[#03C6F9] opacity-80 leading-tight">カルネージハート EXA</div>
          </div>
        </Link>
        {/* ナビゲーション */}
        <nav className="flex items-center gap-6">
          <Link href="/login" className="flex items-center gap-2 text-white hover:text-[#03C6F9] transition font-medium">
            <Icons.Login size={18} />ログイン
          </Link>
          <Link href="/register" className="flex items-center gap-2 px-5 py-2 bg-[#03C6F9] text-[#010220] font-bold rounded hover:bg-[#00a0d0] shadow-md transition">
            <Icons.Register size={18} color="#010220" />新規登録
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
