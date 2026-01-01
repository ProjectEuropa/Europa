'use client';

import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { ExternalLink } from '@/icons';

export default function ExternalLinksPage() {
  // リンク情報を配列として定義
  const links = [
    {
      title: 'カルネージハートEXA 公式HP',
      url: 'https://www.artdink.co.jp/japanese/title/che/',
      description:
        'アートディンク社が提供する公式サイト。ゲームの基本情報や最新情報を確認できます。',
    },
    {
      title: 'Carnage Heart EXA 2chまとめwiki',
      url: 'https://w.atwiki.jp/chex/',
      description:
        'コミュニティによって運営されているwiki。戦術やテクニックなど、詳細な情報が集約されています。',
    },
    {
      title: 'Discord コミュニティ',
      url: 'https://discord.gg/aXT3DNU8A4',
      description:
        'リアルタイムでプレイヤー同士が交流できるDiscordサーバー。質問や情報交換に最適です。',
    },
    {
      title: 'mixi コミュニティ',
      url: 'https://mixi.jp/view_community.pl?id=5138413',
      description:
        'mixiで運営されているコミュニティページ。長年の歴史を持つ交流の場です。',
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="max-w-[1200px] mx-auto my-10 px-[5%] text-[#b0c4d8]">
          <h1 className="text-4xl font-bold text-[#00c8ff] mb-6 text-center">
            外部リンク集
          </h1>

          <div className="bg-[#0a1022] rounded-xl p-8 border border-[#07324a] leading-relaxed text-base">
            <p className="mb-8 text-center">
              カルネージハートEXAに関連する公式・非公式の外部サイトへのリンク集です。
              <br />
              最新情報の確認・コミュニティへの参加にご活用ください。
            </p>

            <div className="grid gap-6">
              {links.map(link => (
                <div
                  key={link.url}
                  role="article"
                  className="bg-[#071527] rounded-lg p-6 border border-[#07324a] transition-all duration-300 hover:border-[#00c8ff] hover:shadow-[0_0_15px_rgba(0,200,255,0.2)]"
                >
                  <h2 className="text-xl text-[#00c8ff] font-medium mb-2 flex items-center">
                    <span className="mr-2 inline-flex">
                      <ExternalLink size={20} />
                    </span>
                    {link.title}
                  </h2>
                  <p className="text-[#b0c4d8] mb-4 text-sm">
                    {link.description}
                  </p>
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#00c8ff] transition-colors duration-200 hover:text-white"
                  >
                    <span>サイトを訪問</span>
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      aria-label="外部リンクアイコン"
                    >
                      <title>外部リンクアイコン</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="mb-4">
                他にも役立つリンクがあれば、お気軽にお知らせください。
              </p>
              <Link
                href="https://hp.project-europa.work/contact"
                target="_blank"
                rel="noopener noreferrer"
className="inline-block px-6 py-3 bg-[#00c8ff] text-[#020824] rounded-md font-bold no-underline transition-all duration-200 hover:bg-[#00a0ff]"
              >
                お問い合わせ
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
