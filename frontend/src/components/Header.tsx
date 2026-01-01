'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect, useState } from 'react';
import Icons from '@/components/Icons';
import { useBreakpoint } from '@/components/layout/responsive';
import { useAuth } from '@/hooks/useAuth';
import { Z_INDEX } from '@/lib/utils';
import SideMenu from './SideMenu';

interface HeaderProps {
  className?: string;
  showMenu?: boolean;
  variant?: 'default' | 'minimal';
}

const Header: React.FC<HeaderProps> = ({
  className = '',
  showMenu = true,
  variant = 'default',
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuButtonAnimated, setIsMenuButtonAnimated] = useState(false);
  const { isMobile } = useBreakpoint();
  const router = useRouter();

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

  const getMenuButtonClasses = () => {
    const base = 'cursor-pointer flex items-center justify-center rounded-lg transition-all duration-300';
    const padding = isMobile ? 'px-2 py-1.5 mr-2' : 'px-3 py-2 mr-4';
    const border = isMenuOpen
      ? 'border-2 border-[#00c8ff]'
      : 'border-2 border-[rgba(0,200,255,0.3)]';
    const background = isMenuOpen
      ? 'bg-[rgba(0,200,255,0.2)]'
      : 'bg-[rgba(0,200,255,0.05)]';
    const shadow = isMenuOpen
      ? 'shadow-[0_0_10px_rgba(0,200,255,0.3)]'
      : isMenuButtonAnimated
        ? 'shadow-[0_0_15px_rgba(0,200,255,0.5)]'
        : '';
    const scale = isMenuOpen
      ? 'scale-105'
      : isMenuButtonAnimated
        ? 'scale-[1.08]'
        : 'scale-100';
    const animation = isMenuButtonAnimated ? 'animate-pulse' : '';

    return `${base} ${padding} ${border} ${background} ${shadow} ${scale} ${animation}`;
  };

  return (
    <>
      <header
        className={`${variant === 'minimal' ? 'py-4' : 'py-5'} px-[5%] border-b border-[rgba(0,200,255,0.3)] relative bg-[#0a0818] ${className}`}
        style={{ zIndex: Z_INDEX.dropdown }}
        aria-label="サイトヘッダー"
      >
        <div
          className={`max-w-[1200px] mx-auto flex justify-between items-center ${isMobile ? 'flex-wrap' : 'flex-nowrap'}`}
        >
          {/* メニューボタンとロゴをグループ化 */}
          <div className="flex items-center">
            {/* ハンバーガーメニューボタン */}
            {showMenu && (
              <div
                onClick={toggleMenu}
                className={getMenuButtonClasses()}
                aria-label="メニューを開く"
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    toggleMenu();
                  }
                }}
              >
                <div className="flex items-center">
                  {isMenuOpen ? (
                    <Icons.Close size={24} color="#00c8ff" />
                  ) : (
                    <Icons.Menu size={24} color="#00c8ff" />
                  )}
                  <span
                    className={`${isMobile ? 'ml-1 hidden' : 'ml-2 inline'} text-sm font-semibold text-[#00c8ff] uppercase tracking-wide`}
                  >
                    {isMenuOpen ? '閉じる' : 'メニュー'}
                  </span>
                </div>
              </div>
            )}

            {/* EUROPAテキスト（ホームへのリンク） */}
            <Link
              href="/"
              className="no-underline"
              aria-label="ホームページに戻る"
            >
              <span
                className={`text-[#00c8ff] ${variant === 'minimal' ? 'text-lg' : 'text-xl'} font-bold tracking-wide`}
              >
                EUROPA
              </span>
            </Link>
          </div>

          {/* 右側のスペース */}
          <div className="flex-1"></div>

          {/* ナビゲーション */}
          <nav
            className={`flex ${isMobile ? 'gap-2 ml-4 flex-wrap' : 'gap-4 ml-8 flex-nowrap'} items-center`}
            aria-label="メインナビゲーション"
          >
            {/* 認証リンク or ユーザー名 */}
            {(() => {
              const { user, loading, logout } = useAuth();
              if (loading) return null;
              if (user) {
                return (
                  <div className="flex items-center gap-4">
                    <span className="text-[#00c8ff] font-semibold text-[15px] flex items-center">
                      <span className="mr-1">
                        <Icons.Register size={18} />
                      </span>
                      {user.name} さん
                    </span>
                    <Link
                      href="/mypage"
                      className="!text-[#8CB4FF] font-medium text-[15px] no-underline flex items-center gap-1"
                      aria-label="マイページに移動"
                    >
                      <Icons.Register size={18} color="#8CB4FF" /> マイページ
                    </Link>
                    <button
                      onClick={() => {
                        try {
                          logout(() => router.push('/'));
                        } catch (error) {
                          console.error('ログアウトエラー:', error);
                        }
                      }}
                      className="text-[#8CB4FF] bg-transparent border-none text-[15px] font-medium cursor-pointer flex items-center gap-1"
                      aria-label="ログアウト"
                    >
                      <Icons.Logout size={18} color="#8CB4FF" /> ログアウト
                    </button>
                  </div>
                );
              }
              return (
                <>
                  <Link
                    href="/login"
                    className="text-[#b0c4d8] no-underline text-[15px] font-medium flex items-center gap-1 transition-colors duration-200 hover:text-[#00c8ff]"
                    aria-label="ログインページに移動"
                  >
                    <Icons.Login size={18} /> ログイン
                  </Link>
                  <Link
                    href="/register"
                    className="text-[#00c8ff] border border-[#00c8ff] px-3 py-1.5 rounded no-underline text-[15px] font-semibold transition-colors duration-200 flex items-center gap-1 hover:bg-[rgba(0,200,255,0.1)]"
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
