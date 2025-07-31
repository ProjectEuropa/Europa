'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const MyPageAuthGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading, hasHydrated } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (hasHydrated && !loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, hasHydrated, router]);
  
  // Zustand初期化完了まで待機
  if (!hasHydrated || loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        color: '#b0c4d8'
      }}>
        Loading...
      </div>
    );
  }
  
  if (!user) return null; // 未認証時は描画しない
  return <>{children}</>;
};

import { useMyPageStore } from '@/stores/myPageStore';
import type { MyPageTab } from '@/types/user';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import FileListSection from '../../components/mypage/FileListSection';
import ProfileSection from '../../components/mypage/ProfileSection';
import RegisteredEventsSection from '../../components/mypage/RegisteredEventsSection';

const MyPage: React.FC = () => {
  // 認証ガードで囲む
  return (
    <MyPageAuthGuard>
      {/* 以下、元のマイページ内容 */}
      <MyPageContent />
    </MyPageAuthGuard>
  );
};

// 元の内容をMyPageContentとして分離
const MyPageContent: React.FC = () => {
  const { activeTab, setActiveTab } = useMyPageStore();
  const { user } = useAuth();

  if (!user) return <div>Loading...</div>;

  // タブ切り替え処理
  const handleTabChange = (tab: MyPageTab) => {
    setActiveTab(tab);
  };

  // タブボタンのスタイルを生成する関数
  const getTabStyle = (tab: MyPageTab) => {
    const isActive = activeTab === tab;
    return {
      padding: '12px 20px',
      background: isActive ? '#0F1A2E' : 'transparent',
      border: isActive ? '1px solid #1E3A5F' : '1px solid transparent',
      borderBottom: isActive ? '1px solid #0F1A2E' : '1px solid #1E3A5F',
      borderRadius: isActive ? '8px 8px 0 0' : '0',
      color: isActive ? '#00c8ff' : '#b0c4d8',
      fontWeight: isActive ? 'bold' : 'normal',
      cursor: 'pointer',
      marginRight: '4px',
      position: 'relative' as const,
      bottom: '-1px',
    };
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'rgb(var(--background-rgb))',
      }}
    >
      <Header />

      <main
        style={{
          flex: '1',
          padding: '20px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <h1
            style={{
              color: '#00c8ff',
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}
          >
            マイページ
          </h1>
          <p
            style={{
              color: '#b0c4d8',
              fontSize: '1rem',
              marginBottom: '24px',
            }}
          >
            アカウント情報の管理、アップロードデータの確認ができます
          </p>

          {/* タブナビゲーション */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid #1E3A5F',
              marginBottom: '24px',
            }}
          >
            <button
              onClick={() => handleTabChange('profile')}
              style={getTabStyle('profile')}
            >
              プロフィール
            </button>
            <button
              onClick={() => handleTabChange('teams')}
              style={getTabStyle('teams')}
            >
              チームデータ
            </button>
            <button
              onClick={() => handleTabChange('matches')}
              style={getTabStyle('matches')}
            >
              マッチデータ
            </button>
            <button
              onClick={() => handleTabChange('events')}
              style={getTabStyle('events')}
            >
              イベント
            </button>
          </div>

          {/* タブコンテンツ */}
          <div
            style={{
              marginBottom: '24px',
            }}
          >
            {activeTab === 'profile' && <ProfileSection />}
            {activeTab === 'teams' && <FileListSection type="team" />}
            {activeTab === 'matches' && <FileListSection type="match" />}
            {activeTab === 'events' && <RegisteredEventsSection />}
          </div>

          {/* 注意事項 */}
          <div
            style={{
              background: '#0A1022',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #1E3A5F',
            }}
          >
            <h2
              style={{
                color: '#00c8ff',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <svg
                style={{
                  width: '20px',
                  height: '20px',
                }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              アカウント情報に関する注意事項
            </h2>
            <ul
              style={{
                color: '#b0c4d8',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                paddingLeft: '20px',
              }}
            >
              <li>プロフィール情報は他のユーザーにも表示されます。</li>
              <li>
                アップロードしたデータは管理者によって削除される場合があります。
              </li>
              <li>
                アカウントに関するお問い合わせは管理者までご連絡ください。
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyPage;
