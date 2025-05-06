'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Icons from './Icons';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [animationClass, setAnimationClass] = useState('');

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
          <Link 
            href="/search/team" 
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              color: '#b0c4d8',
              textDecoration: 'none',
              marginBottom: '12px',
              fontSize: '1rem',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
              <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#b0c4d8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            チームデータ検索
          </Link>

          <Link 
            href="/search/match" 
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              color: '#b0c4d8',
              textDecoration: 'none',
              marginBottom: '12px',
              fontSize: '1rem',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
              <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#b0c4d8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            マッチデータ検索
          </Link>

          <Link 
            href="/upload" 
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              color: '#b0c4d8',
              textDecoration: 'none',
              marginBottom: '12px',
              fontSize: '1rem',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
              <path d="M12 16L12 8M12 8L8 12M12 8L16 12" stroke="#b0c4d8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 15V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16V15" stroke="#b0c4d8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            シンプルアップロード
          </Link>

          <Link 
            href="/download/team" 
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              color: '#b0c4d8',
              textDecoration: 'none',
              marginBottom: '12px',
              fontSize: '1rem',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
              <path d="M12 8L12 16M12 16L16 12M12 16L8 12" stroke="#b0c4d8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 15V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16V15" stroke="#b0c4d8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            チームデータ取得
          </Link>

          <Link 
            href="/download/match" 
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              color: '#b0c4d8',
              textDecoration: 'none',
              marginBottom: '12px',
              fontSize: '1rem',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
              <path d="M12 8L12 16M12 16L16 12M12 16L8 12" stroke="#b0c4d8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 15V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16V15" stroke="#b0c4d8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            マッチデータ取得
          </Link>

          <Link 
            href="/sumdownload/team" 
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              color: '#b0c4d8',
              textDecoration: 'none',
              marginBottom: '12px',
              fontSize: '1rem',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
              <path d="M12 8L12 16M12 16L16 12M12 16L8 12" stroke="#b0c4d8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 15V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16V15" stroke="#b0c4d8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            チームデータ一括DL
          </Link>

          <Link 
            href="/info" 
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              color: '#b0c4d8',
              textDecoration: 'none',
              marginBottom: '12px',
              fontSize: '1rem',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
              <circle cx="12" cy="12" r="9" stroke="#b0c4d8" strokeWidth="1.5"/>
              <path d="M12 8V12" stroke="#b0c4d8" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1" fill="#b0c4d8"/>
            </svg>
            Information
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
