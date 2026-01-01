'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { FocusTrap } from '@/components/layout/focus-manager';
import { useBreakpoint } from '@/components/layout/responsive';
import { useAuth } from '@/hooks/useAuth';
import { Z_INDEX } from '@/lib/utils';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  onClose,
  className = '',
}) => {
  const { user, loading, logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const [animationClass, setAnimationClass] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, isTablet } = useBreakpoint();

  // 開閉状態に応じてアニメーションクラスを設定
  useEffect(() => {
    if (isOpen) {
      // メニューを開く時はすぐに表示してからアニメーション
      setAnimationClass('menu-open');
    } else if (animationClass === 'menu-open') {
      // メニューが開いている状態からの閉じる時のみアニメーション
      setAnimationClass('menu-close');
    }
  }, [isOpen, animationClass]);

  // 外側クリックでメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // ESCキーでメニューを閉じる
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // メニューが完全に閉じたときに非表示にする
  const handleTransitionEnd = () => {
    if (!isOpen && animationClass === 'menu-close') {
      setAnimationClass('');
    }
  };

  // isOpenがtrueの場合は常に表示
  if (!isOpen && animationClass === '') return null;

  // リンクのスタイルを生成する関数
  const getLinkClassName = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center px-4 py-3 mb-2 text-base rounded-md transition-all duration-200 no-underline w-full ${
      isActive
        ? 'text-[#00c8ff] bg-[rgba(0,200,255,0.1)]'
        : 'text-[#b0c4d8] bg-transparent'
    }`;
  };

  // カテゴリヘッダーのクラス
  const categoryClassName = 'text-[#00c8ff] text-sm font-bold mt-5 mb-2.5 pl-4 uppercase tracking-wide';

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-black/50 flex justify-start transition-opacity duration-300 ${
        animationClass === 'menu-open' ? 'opacity-100' : 'opacity-0'
      } ${animationClass ? 'visible' : 'invisible'} ${className}`}
      style={{ zIndex: Z_INDEX.modal }}
      role="dialog"
      aria-modal="true"
      aria-label="サイドメニュー"
    >
      <FocusTrap active={isOpen}>
        <div
          ref={menuRef}
          className={`h-full bg-[#020824] border-r border-[#1E3A5F] transition-transform duration-300 flex flex-col shadow-[2px_0_10px_rgba(0,0,0,0.5)] overflow-y-auto ${
            isMobile ? 'w-[280px] py-4' : 'w-[300px] py-5'
          } ${animationClass === 'menu-open' ? 'translate-x-0' : '-translate-x-full'}`}
          onTransitionEnd={handleTransitionEnd}
          role="navigation"
          aria-label="メインナビゲーション"
        >
          <div className="flex justify-between items-center px-5 pb-5 border-b border-[#1E3A5F]">
            <h2 className="text-[#00c8ff] text-xl m-0">メニュー</h2>
            <button
              onClick={onClose}
              className="bg-transparent border-none text-[#00c8ff] text-2xl cursor-pointer p-1 flex items-center justify-center"
              aria-label="メニューを閉じる"
            >
              ✕
            </button>
          </div>

          <div className={`flex-1 ${isMobile ? 'p-4' : 'p-5'}`}>
            {/* ホーム */}
            <Link href="/" className={getLinkClassName('/')} onClick={onClose}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3"
              >
                <path
                  d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
                  stroke={pathname === '/' ? '#00c8ff' : '#b0c4d8'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              ホーム
            </Link>

            {!loading && user && (
              <Link
                href="#"
                className={getLinkClassName('/logout')}
                onClick={() => {
                  try {
                    logout(() => router.push('/'));
                    onClose(); // メニューを閉じる
                  } catch (error) {
                    console.error('ログアウトエラー:', error);
                  }
                }}
                aria-label="ログアウト"
              >
                {/* 一般的なログアウトアイコン */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mr-3"
                >
                  <path
                    d="M16 17L21 12L16 7"
                    stroke={pathname === '/logout' ? '#00c8ff' : '#b0c4d8'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 12H9"
                    stroke={pathname === '/logout' ? '#00c8ff' : '#b0c4d8'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 19V5C5 3.89543 5.89543 3 7 3H12"
                    stroke={pathname === '/logout' ? '#00c8ff' : '#b0c4d8'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                ログアウト
              </Link>
            )}

            {/* 検索カテゴリ */}
            <div className={categoryClassName}>検索</div>

            <Link
              href="/search/team"
              className={getLinkClassName('/search/team')}
              onClick={onClose}
              aria-label="チームデータ検索"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3"
              >
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke={pathname === '/search/team' ? '#00c8ff' : '#b0c4d8'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              チームデータ検索
            </Link>

            <Link
              href="/search/match"
              className={getLinkClassName('/search/match')}
              onClick={onClose}
              aria-label="マッチデータ検索"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3"
              >
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke={pathname === '/search/match' ? '#00c8ff' : '#b0c4d8'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              マッチデータ検索
            </Link>

            {/* アップロードカテゴリ */}
            <div className={categoryClassName}>アップロード</div>

            <Link
              href="/upload"
              className={getLinkClassName('/upload')}
              onClick={onClose}
              aria-label="チームアップロード"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3"
              >
                <path
                  d="M12 16L12 8M12 8L8 12M12 8L16 12"
                  stroke={pathname === '/upload' ? '#00c8ff' : '#b0c4d8'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 15V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16V15"
                  stroke={pathname === '/upload' ? '#00c8ff' : '#b0c4d8'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              チームアップロード
            </Link>

            <Link
              href="/upload/match"
              className={getLinkClassName('/upload/match')}
              onClick={onClose}
              aria-label="マッチアップロード"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3"
              >
                <path
                  d="M12 16L12 8M12 8L8 12M12 8L16 12"
                  stroke={pathname === '/upload/match' ? '#00c8ff' : '#b0c4d8'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 15V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16V15"
                  stroke={pathname === '/upload/match' ? '#00c8ff' : '#b0c4d8'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              マッチアップロード
            </Link>

            {/* ダウンロードカテゴリ */}
            <div className={categoryClassName}>ダウンロード</div>

            <Link
              href="/sumdownload/team"
              className={getLinkClassName('/sumdownload/team')}
              onClick={onClose}
              aria-label="チームデータ一括ダウンロード"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3"
              >
                <path
                  d="M12 8L12 16M12 16L16 12M12 16L8 12"
                  stroke={
                    pathname === '/sumdownload/team' ? '#00c8ff' : '#b0c4d8'
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 15V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16V15"
                  stroke={
                    pathname === '/sumdownload/team' ? '#00c8ff' : '#b0c4d8'
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              チームデータ一括DL
            </Link>

            <Link
              href="/sumdownload/match"
              className={getLinkClassName('/sumdownload/match')}
              onClick={onClose}
              aria-label="マッチデータ一括ダウンロード"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3"
              >
                <path
                  d="M12 8L12 16M12 16L16 12M12 16L8 12"
                  stroke={
                    pathname === '/sumdownload/match' ? '#00c8ff' : '#b0c4d8'
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 15V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16V15"
                  stroke={
                    pathname === '/sumdownload/match' ? '#00c8ff' : '#b0c4d8'
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              マッチデータ一括DL
            </Link>

            {/* アカウントカテゴリ */}
            <div className={categoryClassName}>アカウント</div>

            <Link
              href="/login"
              className={getLinkClassName('/login')}
              onClick={onClose}
              aria-label="ログイン"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3"
              >
                <path
                  d="M11 16L7 12M7 12L11 8M7 12H21M16 16V17C16 18.6569 14.6569 20 13 20H6C4.34315 20 3 18.6569 3 17V7C3 5.34315 4.34315 4 6 4H13C14.6569 4 16 5.34315 16 7V8"
                  stroke={pathname === '/login' ? '#00c8ff' : '#b0c4d8'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              ログイン
            </Link>

            <Link
              href="/register"
              className={getLinkClassName('/register')}
              onClick={onClose}
              aria-label="新規登録"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3"
              >
                <path
                  d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                  stroke={pathname === '/register' ? '#00c8ff' : '#b0c4d8'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                  stroke={pathname === '/register' ? '#00c8ff' : '#b0c4d8'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              新規登録
            </Link>

            <Link
              href="/forgot-password"
              className={getLinkClassName('/forgot-password')}
              onClick={onClose}
              aria-label="パスワード再設定"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3"
              >
                <path
                  d="M15 7C16.1046 7 17 7.89543 17 9V15C17 16.1046 16.1046 17 15 17H9C7.89543 17 7 16.1046 7 15V9C7 7.89543 7.89543 7 9 7"
                  stroke={
                    pathname === '/forgot-password' ? '#00c8ff' : '#b0c4d8'
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 10V14"
                  stroke={
                    pathname === '/forgot-password' ? '#00c8ff' : '#b0c4d8'
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 7V7.01"
                  stroke={
                    pathname === '/forgot-password' ? '#00c8ff' : '#b0c4d8'
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              パスワード再設定
            </Link>

            {/* 情報カテゴリ */}
            <div className={categoryClassName}>情報</div>

            <Link
              href="/info"
              className={getLinkClassName('/info')}
              onClick={onClose}
              aria-label="Information"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke={pathname === '/info' ? '#00c8ff' : '#b0c4d8'}
                  strokeWidth="1.5"
                />
                <path
                  d="M12 8V12"
                  stroke={pathname === '/info' ? '#00c8ff' : '#b0c4d8'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle
                  cx="12"
                  cy="16"
                  r="1"
                  fill={pathname === '/info' ? '#00c8ff' : '#b0c4d8'}
                />
              </svg>
              Information
            </Link>

            <Link
              href="/event"
              className={getLinkClassName('/event')}
              onClick={onClose}
              aria-label="イベント登録"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="18"
                  rx="2"
                  ry="2"
                  stroke={pathname === '/event' ? '#00c8ff' : '#b0c4d8'}
                  strokeWidth="1.5"
                />
                <line
                  x1="16"
                  y1="2"
                  x2="16"
                  y2="6"
                  stroke={pathname === '/event' ? '#00c8ff' : '#b0c4d8'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="8"
                  y1="2"
                  x2="8"
                  y2="6"
                  stroke={pathname === '/event' ? '#00c8ff' : '#b0c4d8'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="3"
                  y1="10"
                  x2="21"
                  y2="10"
                  stroke={pathname === '/event' ? '#00c8ff' : '#b0c4d8'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              イベント登録
            </Link>

            <Link
              href="/mypage"
              className={getLinkClassName('/mypage')}
              onClick={onClose}
              aria-label="マイページ"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3"
              >
                <path
                  d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                  stroke={pathname === '/mypage' ? '#00c8ff' : '#b0c4d8'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                  stroke={pathname === '/mypage' ? '#00c8ff' : '#b0c4d8'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              マイページ
            </Link>

            <Link
              href="/external-links"
              className={getLinkClassName('/external-links')}
              onClick={onClose}
              aria-label="外部リンク集"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3"
              >
                <path
                  d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14"
                  stroke={
                    pathname === '/external-links' ? '#00c8ff' : '#b0c4d8'
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 4H20V10"
                  stroke={
                    pathname === '/external-links' ? '#00c8ff' : '#b0c4d8'
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 4L10 14"
                  stroke={
                    pathname === '/external-links' ? '#00c8ff' : '#b0c4d8'
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              外部リンク集
            </Link>
          </div>
        </div>
      </FocusTrap>
    </div>
  );
};

export default SideMenu;
