'use client';

import Link from 'next/link';
import StaticPageLayout from '@/components/layout/StaticPageLayout';
import { ActionButton, Paragraph } from '@/components/layout/StaticPageContent';
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
    <StaticPageLayout
      titleEn="EXTERNAL LINKS"
      titleJa="外部リンク集"
      description="カルネージハートEXAに関連する公式・非公式の外部サイトへのリンク集です"
    >
      <Paragraph>
        最新情報の確認・コミュニティへの参加にご活用ください。
      </Paragraph>

      <div className="grid gap-4 mt-6">
        {links.map(link => (
          <div
            key={link.url}
            role="article"
            className="bg-slate-900/50 rounded-xl p-5 md:p-6 border border-cyan-500/20 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] group"
          >
            <h2 className="text-lg md:text-xl text-cyan-400 font-bold mb-2 flex items-center gap-2">
              <ExternalLink size={20} />
              {link.title}
            </h2>
            <p className="text-slate-400 mb-4 text-sm">
              {link.description}
            </p>
            <Link
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-cyan-400 transition-colors duration-200 hover:text-cyan-300 text-sm font-medium"
            >
              <span>サイトを訪問</span>
              <svg
                className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
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
        <Paragraph>
          他にも役立つリンクがあれば、お気軽にお知らせください。
        </Paragraph>
        <ActionButton href="https://hp.project-europa.work/contact">
          お問い合わせ
        </ActionButton>
      </div>
    </StaticPageLayout>
  );
}
