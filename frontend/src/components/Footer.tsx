'use client';

import Link from 'next/link';
import type React from 'react';
import Icons from '@/components/Icons';

interface FooterProps {
  className?: string;
  variant?: 'default' | 'minimal';
}

const Footer: React.FC<FooterProps> = ({
  className = '',
  variant = 'default',
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`bg-[#0a0e1a] border-t border-[#07324a] ${variant === 'minimal' ? 'py-8 pb-6' : 'py-12 pb-8'} ${className}`}
      role="contentinfo"
      aria-label="サイトフッター"
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-12 text-[#b0c4d8] text-[15px] px-[5%]">
        {/* 左カラム：ロゴ・説明 */}
        <div role="region" aria-label="サイト情報">
          <div className="flex items-center gap-2 mb-2">
            <Icons.Logo size={28} />
            <span className="text-[#00c8ff] font-bold text-xl">EUROPA</span>
          </div>
          <div className="text-[#00c8ff] text-[13px] mb-2">
            カルネージハート エクサ
          </div>
          <div className="mb-4 leading-relaxed">
            OKE共有とチームコラボレーションのための非公式カルネージハート エクサプラットフォーム。
          </div>
          <div className="text-xs opacity-70">
            Team Project Europa 2016-{currentYear}
          </div>
        </div>

        {/* 機能 */}
        <nav aria-label="機能メニュー">
          <div className="text-[#00c8ff] font-semibold mb-2.5">機能</div>
          <ul className="list-none p-0 m-0 leading-8">
            <li>
              <Link href="/search/team" className="text-[#b0c4d8] no-underline">
                チームデータ検索
              </Link>
            </li>
            <li>
              <Link href="/search/match" className="text-[#b0c4d8] no-underline">
                マッチデータ検索
              </Link>
            </li>
            <li>
              <Link href="/sumdownload/team" className="text-[#b0c4d8] no-underline">
                チームデータ一括DL
              </Link>
            </li>
            <li>
              <Link href="/sumdownload/match" className="text-[#b0c4d8] no-underline">
                マッチデータ一括DL
              </Link>
            </li>
            <li>
              <Link href="/info" className="text-[#b0c4d8] no-underline">
                お知らせ
              </Link>
            </li>
          </ul>
        </nav>

        {/* アカウント */}
        <nav aria-label="アカウントメニュー">
          <div className="text-[#00c8ff] font-semibold mb-2.5">アカウント</div>
          <ul className="list-none p-0 m-0 leading-8">
            <li>
              <Link href="/login" className="text-[#b0c4d8] no-underline">
                ログイン
              </Link>
            </li>
            <li>
              <Link href="/register" className="text-[#b0c4d8] no-underline">
                新規登録
              </Link>
            </li>
          </ul>
        </nav>

        {/* 問い合わせ・法的情報 */}
        <nav aria-label="サポートメニュー">
          <div className="text-[#00c8ff] font-semibold mb-2.5">
            お問い合わせ・法的情報
          </div>
          <ul className="list-none p-0 m-0 leading-8">
            <li>
              <Link href="/about" className="text-[#b0c4d8] no-underline">
                私たちについて
              </Link>
            </li>
            <li>
              <a
                href="https://hp.project-europa.work/contact"
                target="_blank"
                className="text-[#b0c4d8] no-underline"
                rel="noopener"
              >
                お問い合わせ
              </a>
            </li>
            <li>
              <Link href="/privacy-policy" className="text-[#b0c4d8] no-underline">
                プライバシーポリシー
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service" className="text-[#b0c4d8] no-underline">
                利用規約
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-[#b0c4d8] no-underline">
                よくある質問
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
