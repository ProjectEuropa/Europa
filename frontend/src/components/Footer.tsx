'use client';

import Link from 'next/link';
import React from 'react';
import Icons from '@/components/Icons';

interface FooterProps {
  className?: string;
  variant?: 'default' | 'minimal';
}

const Footer: React.FC<FooterProps> = ({ 
  className = '', 
  variant = 'default' 
}) => {
  return (
    <footer
      className={className}
      style={{
        background: '#0a0e1a',
        borderTop: '1px solid #07324a',
        padding: variant === 'minimal' ? '32px 0 24px 0' : '48px 0 32px 0',
      }}
      role="contentinfo"
      aria-label="サイトフッター"
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '48px',
          color: '#b0c4d8',
          fontSize: '15px',
          padding: '0 5%',
        }}
      >
        {/* 左カラム：ロゴ・説明 */}
        <div role="region" aria-label="サイト情報">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
            }}
          >
            <Icons.Logo size={28} />
            <span
              style={{ color: '#00c8ff', fontWeight: 700, fontSize: '20px' }}
            >
              EUROPA
            </span>
          </div>
          <div
            style={{ color: '#00c8ff', fontSize: '13px', marginBottom: '8px' }}
          >
            カルネージハート EXA
          </div>
          <div style={{ marginBottom: '16px', lineHeight: 1.7 }}>
            OKE共有とチームコラボレーションのための非公式カルネージハートEXAプラットフォーム。
          </div>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>
            {' '}
            Team Project Europa 2016-{new Date().getFullYear()}
          </div>
        </div>

        {/* 機能 */}
        <nav role="navigation" aria-label="機能メニュー">
          <div
            style={{ color: '#00c8ff', fontWeight: 600, marginBottom: '10px' }}
          >
            機能
          </div>
          <ul
            style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 2 }}
          >
            <li>
              <Link
                href="/search/team"
                style={{ 
                  color: '#b0c4d8', 
                  textDecoration: 'none'
                }}
              >
                チームデータ検索
              </Link>
            </li>
            <li>
              <Link
                href="/search/match"
                style={{ 
                  color: '#b0c4d8', 
                  textDecoration: 'none'
                }}
              >
                マッチデータ検索
              </Link>
            </li>
            <li>
              <Link
                href="/sumdownload/team"
                style={{ 
                  color: '#b0c4d8', 
                  textDecoration: 'none'
                }}
              >
                チームデータ一括DL
              </Link>
            </li>
            <li>
              <Link
                href="/sumdownload/match"
                style={{ 
                  color: '#b0c4d8', 
                  textDecoration: 'none'
                }}
              >
                マッチデータ一括DL
              </Link>
            </li>
            <li>
              <Link
                href="/info"
                style={{ 
                  color: '#b0c4d8', 
                  textDecoration: 'none'
                }}
              >
                Information
              </Link>
            </li>
          </ul>
        </nav>

        {/* アカウント */}
        <nav role="navigation" aria-label="アカウントメニュー">
          <div
            style={{ color: '#00c8ff', fontWeight: 600, marginBottom: '10px' }}
          >
            アカウント
          </div>
          <ul
            style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 2 }}
          >
            <li>
              <Link
                href="/login"
                style={{ 
                  color: '#b0c4d8', 
                  textDecoration: 'none'
                }}
              >
                ログイン
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                style={{ 
                  color: '#b0c4d8', 
                  textDecoration: 'none'
                }}
              >
                新規登録
              </Link>
            </li>
          </ul>
        </nav>

        {/* 問い合わせ・法的情報 */}
        <nav role="navigation" aria-label="サポートメニュー">
          <div
            style={{ color: '#00c8ff', fontWeight: 600, marginBottom: '10px' }}
          >
            お問い合わせ・法的情報
          </div>
          <ul
            style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 2 }}
          >
            <li>
              <Link
                href="/about"
                style={{ 
                  color: '#b0c4d8', 
                  textDecoration: 'none'
                }}
              >
                私たちについて
              </Link>
            </li>
            <li>
              <a
                href="https://hp.project-europa.work/contact"
                target="_blank"
                style={{ color: '#b0c4d8', textDecoration: 'none' }}
                rel="noopener"
              >
                お問い合わせ
              </a>
            </li>
            <li>
              <Link
                href="/privacy-policy"
                style={{ 
                  color: '#b0c4d8', 
                  textDecoration: 'none'
                }}
              >
                プライバシーポリシー
              </Link>
            </li>
            <li>
              <Link
                href="/terms-of-service"
                style={{ 
                  color: '#b0c4d8', 
                  textDecoration: 'none'
                }}
              >
                利用規約
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                style={{ 
                  color: '#b0c4d8', 
                  textDecoration: 'none'
                }}
              >
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
