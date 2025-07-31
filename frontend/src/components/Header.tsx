'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Icons from '@/components/Icons';
import { useAuth } from '@/hooks/useAuth';
import SideMenu from './SideMenu';
import { useBreakpoint } from '@/components/layout/responsive';

interface HeaderProps {
  className?: string;
  showMenu?: boolean;
  variant?: 'default' | 'minimal';
}

const Header: React.FC<HeaderProps> = ({ 
  className = '', 
  showMenu = true, 
  variant = 'default' 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuButtonAnimated, setIsMenuButtonAnimated] = useState(false);
  const { isMobile, isTablet } = useBreakpoint();

  // ページ読み込み時にボタンをハイライトするアニメーション
  useEffect(() => {
    // ページ読み込み後にアニメーションを開始
    const timer1 = setTimeout(() => {
      setIsMenuButtonAnimated(true);
    }, 1000);

    // アニメーションを停止
    const timer2 = setTimeout(() => {
      setIsMenuButtonAnimated(false);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header
        className={className}
        style={{
          padding: variant === 'minimal' ? '16px 5%' : '20px 5%',
          borderBottom: '1px solid rgba(0, 200, 255, 0.3)',
          zIndex: 10,
          position: 'relative',
          background: '#0a0818',
        }}
        role="banner"
        aria-label="サイトヘッダー"
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
          }}
        >
          {/* メニューボタンとロゴをグループ化 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* ハンバーガーメニューボタン */}
            {showMenu && (
            <div
              onClick={toggleMenu}
              style={{
                cursor: 'pointer',
                marginRight: isMobile ? '8px' : '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: isMobile ? '6px 8px' : '8px 12px',
                borderRadius: '8px',
                background: isMenuOpen
                  ? 'rgba(0, 200, 255, 0.2)'
                  : 'rgba(0, 200, 255, 0.05)',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                border: isMenuOpen
                  ? '2px solid #00c8ff'
                  : '2px solid rgba(0, 200, 255, 0.3)',
                boxShadow: isMenuOpen
                  ? '0 0 10px rgba(0, 200, 255, 0.3)'
                  : isMenuButtonAnimated
                    ? '0 0 15px rgba(0, 200, 255, 0.5)'
                    : 'none',
                transform: isMenuOpen
                  ? 'scale(1.05)'
                  : isMenuButtonAnimated
                    ? 'scale(1.08)'
                    : 'scale(1)',
                animation: isMenuButtonAnimated
                  ? 'pulse 1.5s infinite'
                  : 'none',
              }}
              aria-label="メニューを開く"
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleMenu();
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {isMenuOpen ? (
                  <Icons.Close size={24} color="#00c8ff" />
                ) : (
                  <Icons.Menu size={24} color="#00c8ff" />
                )}
                <span
                  style={{
                    marginLeft: isMobile ? '4px' : '8px',
                    fontSize: isMobile ? '12px' : '14px',
                    fontWeight: 600,
                    color: '#00c8ff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: isMobile ? 'none' : 'inline',
                  }}
                >
                  {isMenuOpen ? '閉じる' : 'メニュー'}
                </span>
              </div>
            </div>
            )}

            {/* EUROPAテキスト（ホームへのリンク） */}
            <Link
              href="/"
              style={{
                textDecoration: 'none',
              }}
              aria-label="ホームページに戻る"
            >
              <span
                style={{
                  color: '#00c8ff',
                  fontSize: variant === 'minimal' ? '18px' : '20px',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                }}
              >
                EUROPA
              </span>
            </Link>
          </div>

          {/* 右側のスペース */}
          <div style={{ flex: 1 }}></div>

          {/* ナビゲーション */}
          <nav
            style={{
              display: 'flex',
              gap: isMobile ? '8px' : '16px',
              alignItems: 'center',
              marginLeft: isMobile ? '16px' : '32px',
              flexWrap: isMobile ? 'wrap' : 'nowrap',
            }}
            role="navigation"
            aria-label="メインナビゲーション"
          >
            {/* 認証リンク or ユーザー名 */}
            {(() => {
              const { user, loading, logout } = useAuth();
              if (loading) return null;
              if (user) {
                return (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    }}
                  >
                    <span
                      style={{
                        color: '#00c8ff',
                        fontWeight: 600,
                        fontSize: '15px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ marginRight: '4px' }}>
                        <Icons.Register size={18} />
                      </span>
                      {user.name} さん
                    </span>
                    <Link
                      href="/mypage"
                      style={{
                        color: '#8CB4FF',
                        fontWeight: 500,
                        fontSize: '15px',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      aria-label="マイページに移動"
                    >
                      <Icons.Register size={18} /> マイページ
                    </Link>
                    <button
                      onClick={() => {
                        try {
                          logout();
                        } catch (error) {
                          console.error('ログアウトエラー:', error);
                        }
                      }}
                      style={{
                        color: '#8CB4FF',
                        background: 'none',
                        border: 'none',
                        fontSize: '15px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      aria-label="ログアウト"
                    >
                      <Icons.Logout size={18} /> ログアウト
                    </button>
                  </div>
                );
              }
              return (
                <>
                  <Link
                    href="/login"
                    style={{
                      color: '#b0c4d8',
                      textDecoration: 'none',
                      fontSize: '15px',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'color 0.2s',
                    }}
                    aria-label="ログインページに移動"
                  >
                    <Icons.Login size={18} /> ログイン
                  </Link>
                  <Link
                    href="/register"
                    style={{
                      color: '#00c8ff',
                      border: '1px solid #00c8ff',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '15px',
                      fontWeight: 600,
                      transition: 'background-color 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                    aria-label="新規登録ページに移動"
                  >
                    <Icons.Register size={18} /> 新規登録
                  </Link>
                </>
              );
            })()}
          </nav>
        </div>
      </header>

      {/* サイドメニュー */}
      {showMenu && (
        <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      )}
    </>
  );
};

export default Header;
