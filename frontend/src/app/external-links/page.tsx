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
    <main
      style={{
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ width: '100%' }}>
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div
          style={{
            maxWidth: '1200px',
            margin: '40px auto',
            padding: '0 5%',
            color: '#b0c4d8',
          }}
        >
          <h1
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#00c8ff',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            外部リンク集
          </h1>

          <div
            style={{
              background: '#0a1022',
              borderRadius: '12px',
              padding: '32px',
              border: '1px solid #07324a',
              lineHeight: '1.8',
              fontSize: '16px',
            }}
          >
            <p
              style={{
                marginBottom: '32px',
                textAlign: 'center',
              }}
            >
              カルネージハートEXAに関連する公式・非公式の外部サイトへのリンク集です。
              <br />
              最新情報の確認・コミュニティへの参加にご活用ください。
            </p>

            <div style={{ display: 'grid', gap: '24px' }}>
              {links.map((link) => (
                <div
                  key={link.url}
                  role="article"
                  style={{
                    background: '#071527',
                    borderRadius: '8px',
                    padding: '24px',
                    border: '1px solid #07324a',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.border = '1px solid #00c8ff';
                    e.currentTarget.style.boxShadow =
                      '0 0 15px rgba(0, 200, 255, 0.2)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.border = '1px solid #07324a';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <h2
                    style={{
                      fontSize: '20px',
                      color: '#00c8ff',
                      fontWeight: '500',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{ marginRight: '8px', display: 'inline-flex' }}
                    >
                      <ExternalLink size={20} />
                    </span>
                    {link.title}
                  </h2>
                  <p
                    style={{
                      color: '#b0c4d8',
                      marginBottom: '16px',
                      fontSize: '14px',
                    }}
                  >
                    {link.description}
                  </p>
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      color: '#00c8ff',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = '#00c8ff';
                    }}
                  >
                    <span>サイトを訪問</span>
                    <svg
                      style={{
                        width: '16px',
                        height: '16px',
                        marginLeft: '4px',
                      }}
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

            <div
              style={{
                marginTop: '40px',
                textAlign: 'center',
              }}
            >
              <p style={{ marginBottom: '16px' }}>
                他にも役立つリンクがあれば、お気軽にお知らせください。
              </p>
              <Link
                href="https://hp.project-europa.work/contact"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  background: '#00c8ff',
                  color: '#020824',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#00a0ff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#00c8ff';
                }}
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
