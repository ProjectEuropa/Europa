'use client';

import React from "react";
import Icons from "@/components/Icons";

const Footer = () => {
  return (
    <footer className="bg-[#010220]/95 backdrop-blur-md border-t border-[#03C6F9]/20 pt-12 pb-8">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:justify-between gap-12">
          {/* ブランド */}
          <div className="flex-1 min-w-[220px]">
            <div className="flex items-center gap-2 mb-2">
              <Icons.Logo size={28} />
              <span className="text-xl font-bold text-white">EUROPA</span>
            </div>
            <div className="text-xs text-[#03C6F9] mb-2 opacity-80">カルネージハート EXA</div>
            <p className="text-gray-400 text-sm mb-4 max-w-xs">
              OKE共有とチームコラボレーションのための非公式カルネージハートEXAプラットフォーム。
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-[#03C6F9] hover:text-white transition" aria-label="Twitter"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg></a>
              <a href="#" className="text-[#03C6F9] hover:text-white transition" aria-label="GitHub"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg></a>
              <a href="#" className="text-[#03C6F9] hover:text-white transition" aria-label="Discord"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M18.93 5.34a16.89 16.89 0 00-4.07-1.23c-.03 0-.05.01-.07.03-.17.3-.37.7-.5 1.01a15.72 15.72 0 00-4.57 0c-.14-.32-.34-.71-.51-1.01-.02-.02-.04-.03-.07-.03a16.89 16.89 0 00-4.07 1.23c-.01 0-.03.01-.04.02-2.59 3.77-3.3 7.46-2.95 11.09 0 .02.01.04.03.05a16.95 16.95 0 005.04 2.52c.03 0 .06-.01.07-.03.39-.52.74-1.07 1.03-1.65.02-.04 0-.08-.04-.09-.54-.2-1.06-.44-1.56-.72-.04-.02-.04-.08-.01-.11.1-.08.21-.16.31-.24.02-.01.04-.01.06-.01 3.04 1.36 6.34 1.36 9.34 0 .02 0 .04 0 .06.01.1.08.21.16.32.24.04.03.03.09-.01.11-.5.28-1.02.52-1.56.72-.04.01-.05.06-.04.09.3.58.65 1.13 1.03 1.65.01.02.04.03.07.03a16.9 16.9 0 005.04-2.52c.02-.01.03-.03.03-.05.42-4.27-.7-7.93-2.96-11.09-.01-.01-.02-.02-.04-.02zM8.56 14.49c-.99 0-1.81-.9-1.81-2 0-1.11.8-2 1.81-2 1.01 0 1.82.9 1.81 2 0 1.11-.8 2-1.81 2zm6.7 0c-.99 0-1.81-.9-1.81-2 0-1.11.8-2 1.81-2 1.01 0 1.82.9 1.81 2 0 1.11-.8 2-1.81 2z" clipRule="evenodd" /></svg></a>
            </div>
          </div>
          {/* 機能カラム */}
          <div className="flex-1 min-w-[180px]">
            <h3 className="text-[#03C6F9] font-bold mb-4 text-base">機能</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "チームデータ検索", icon: <Icons.TeamSearch size={16} /> },
                { label: "マッチデータ検索", icon: <Icons.MatchSearch size={16} /> },
                { label: "シンプルアップロード", icon: <Icons.Upload size={16} /> },
                { label: "チームデータ取得", icon: <Icons.TeamDownload size={16} /> },
                { label: "マッチデータ取得", icon: <Icons.MatchDownload size={16} /> },
                { label: "情報", icon: <Icons.Information size={16} /> },
              ].map((item) => (
                <li key={item.label}>
                  <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-[#03C6F9] transition">
                    {item.icon}
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* アカウントカラム */}
          <div className="flex-1 min-w-[180px]">
            <h3 className="text-[#03C6F9] font-bold mb-4 text-base">アカウント</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "ログイン", icon: <Icons.Login size={16} /> },
                { label: "新規登録", icon: <Icons.Register size={16} /> },
                { label: "プロフィール", icon: <Icons.Information size={16} /> },
                { label: "マイチーム", icon: <Icons.TeamSearch size={16} /> },
                { label: "マイOKE", icon: <Icons.Upload size={16} /> },
                { label: "設定", icon: <Icons.Guidelines size={16} /> },
              ].map((item) => (
                <li key={item.label}>
                  <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-[#03C6F9] transition">
                    {item.icon}
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-[#03C6F9]/20 mt-10 pt-6 text-center text-gray-400 text-xs">
          <p>&copy; {new Date().getFullYear()} PROJECT EUROPA</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
