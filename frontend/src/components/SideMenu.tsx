'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/lib/logout';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
  const { user, loading } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const [animationClass, setAnimationClass] = useState('');
  const pathname = usePathname();

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
  const getLinkStyle = (path: string) => {
    const isActive = pathname === path;
    return {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      color: isActive ? '#00c8ff' : '#b0c4d8',
      textDecoration: 'none',
      marginBottom: '8px',
      fontSize: '1rem',
      borderRadius: '6px',
      backgroundColor: isActive ? 'rgba(0, 200, 255, 0.1)' : 'transparent',
      transition: 'all 0.2s ease',
    };
  };

  // カテゴリヘッダーのスタイル
  const categoryStyle = {
    color: '#00c8ff',
    fontSize: '0.9rem',
    fontWeight: 'bold' as const,
    marginTop: '20px',
    marginBottom: '10px',
    paddingLeft: '16px',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-start',
      opacity: animationClass === 'menu-open' ? 1 : animationClass === 'menu-close' ? 0 : 0,
      transition: 'opacity 0.3s ease',
      visibility: animationClass ? 'visible' : 'hidden',
    }}>
      <div
        ref={menuRef}
        style={{
          width: '300px',
          height: '100%',
          backgroundColor: '#020824',
          borderRight: '1px solid #1E3A5F',
          transition: 'transform 0.3s ease',
          transform: animationClass === 'menu-open' ? 'translateX(0)' : 'translateX(-100%)',
          padding: '20px 0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.5)',
          overflowY: 'auto',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px 20px',
          borderBottom: '1px solid #1E3A5F',
        }}>
          <h2 style={{
            color: '#00c8ff',
            fontSize: '1.2rem',
            margin: 0,
          }}>
            メニュー
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#00c8ff',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1, padding: '20px' }}>
          {/* ホーム */}
          <Link href="/" style={getLinkStyle('/')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
              <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke={pathname === '/' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            ホーム
          </Link>

          {!loading && user && (
          <Link href="#" style={getLinkStyle('/logout')} onClick={() => { logout(); }} >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
              <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke={pathname === '/mypage' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke={pathname === '/mypage' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            ログアウト
          </Link>
          )}

          {/* 検索カテゴリ */}
          <div style={categoryStyle}>検索</div>

          <Link href="/search/team" style={getLinkStyle('/search/team')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke={pathname === '/search/team' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            チームデータ検索
          </Link>

          <Link href="/search/match" style={getLinkStyle('/search/match')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke={pathname === '/search/match' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            マッチデータ検索
          </Link>

          {/* アップロードカテゴリ */}
          <div style={categoryStyle}>アップロード</div>

          <Link href="/upload" style={getLinkStyle('/upload')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
              <path d="M12 16L12 8M12 8L8 12M12 8L16 12" stroke={pathname === '/upload' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 15V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16V15" stroke={pathname === '/upload' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            チームアップロード
          </Link>

          <Link href="/upload/match" style={getLinkStyle('/upload/match')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
              <path d="M12 16L12 8M12 8L8 12M12 8L16 12" stroke={pathname === '/upload/match' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 15V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16V15" stroke={pathname === '/upload/match' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            マッチアップロード
          </Link>

          {/* ダウンロードカテゴリ */}
          <div style={categoryStyle}>ダウンロード</div>

          <Link href="/sumdownload/team" style={getLinkStyle('/sumdownload/team')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
              <path d="M12 8L12 16M12 16L16 12M12 16L8 12" stroke={pathname === '/sumdownload/team' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 15V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16V15" stroke={pathname === '/sumdownload/team' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            チームデータ一括DL
          </Link>

          <Link href="/sumdownload/match" style={getLinkStyle('/sumdownload/match')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
              <path d="M12 8L12 16M12 16L16 12M12 16L8 12" stroke={pathname === '/sumdownload/match' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 15V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16V15" stroke={pathname === '/sumdownload/match' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            マッチデータ一括DL
          </Link>

          {/* アカウントカテゴリ */}
          <div style={categoryStyle}>アカウント</div>

          <Link href="/login" style={getLinkStyle('/login')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
              <path d="M11 16L7 12M7 12L11 8M7 12H21M16 16V17C16 18.6569 14.6569 20 13 20H6C4.34315 20 3 18.6569 3 17V7C3 5.34315 4.34315 4 6 4H13C14.6569 4 16 5.34315 16 7V8" stroke={pathname === '/login' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            ログイン
          </Link>

          <Link href="/register" style={getLinkStyle('/register')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
              <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke={pathname === '/register' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke={pathname === '/register' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            新規登録
          </Link>

          <Link href="/forgot-password" style={getLinkStyle('/forgot-password')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
              <path d="M15 7C16.1046 7 17 7.89543 17 9V15C17 16.1046 16.1046 17 15 17H9C7.89543 17 7 16.1046 7 15V9C7 7.89543 7.89543 7 9 7" stroke={pathname === '/forgot-password' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 10V14" stroke={pathname === '/forgot-password' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 7V7.01" stroke={pathname === '/forgot-password' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            パスワード再設定
          </Link>

          {/* 情報カテゴリ */}
          <div style={categoryStyle}>情報</div>

          <Link href="/info" style={getLinkStyle('/info')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
              <circle cx="12" cy="12" r="9" stroke={pathname === '/info' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5"/>
              <path d="M12 8V12" stroke={pathname === '/info' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1" fill={pathname === '/info' ? '#00c8ff' : '#b0c4d8'}/>
            </svg>
            Information
          </Link>

          <Link href="/event" style={getLinkStyle('/event')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={pathname === '/event' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke={pathname === '/event' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke={pathname === '/event' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke={pathname === '/event' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            イベント登録
          </Link>

          <Link href="/mypage" style={getLinkStyle('/mypage')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
              <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke={pathname === '/mypage' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke={pathname === '/mypage' ? '#00c8ff' : '#b0c4d8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            マイページ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
