'use client';

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import React, { useState } from 'react';

const MyPageAuthGuard: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);
  if (loading) return <div>Loading...</div>;
  if (!user) return null; // 未認証時は描画しない
  return <>{children}</>;
};
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProfileSection from '../../components/mypage/ProfileSection';
import UploadedTeamsSection from '../../components/mypage/UploadedTeamsSection';
import UploadedMatchesSection from '../../components/mypage/UploadedMatchesSection';
import RegisteredEventsSection from '../../components/mypage/RegisteredEventsSection';

// タブの種類
type TabType = 'profile' | 'teams' | 'matches' | 'events';

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
  // 現在選択されているタブ
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const { user } = useAuth();
  if (!user) return <div>Loading...</div>;
  const profileData = {
    name: user.name,
    email: user.email,
    joinDate: user.created_at ? user.created_at.slice(0, 10).replace(/-/g, "/") : ""
  };

  const teamData = [
    {
      id: '1',
      name: 'Alpha Squad',
      uploadDate: '2025/05/01',
      downloadCount: 128,
      fileSize: '2.4 MB'
    },
    {
      id: '2',
      name: 'Beta Team',
      uploadDate: '2025/04/22',
      downloadCount: 95,
      fileSize: '1.8 MB'
    },
    {
      id: '3',
      name: 'Gamma Force',
      uploadDate: '2025/04/15',
      downloadCount: 76,
      fileSize: '3.1 MB'
    }
  ];

  const matchData = [
    {
      id: '1',
      name: 'Tournament Finals',
      teams: 'Alpha Squad vs Beta Team',
      uploadDate: '2025/05/01',
      downloadCount: 156,
      fileSize: '3.2 MB'
    },
    {
      id: '2',
      name: 'Semifinals Match 1',
      teams: 'Alpha Squad vs Gamma Force',
      uploadDate: '2025/04/28',
      downloadCount: 112,
      fileSize: '2.8 MB'
    },
    {
      id: '3',
      name: 'Quarterfinals Match 2',
      teams: 'Gamma Force vs Zeta Force',
      uploadDate: '2025/04/25',
      downloadCount: 54,
      fileSize: '2.6 MB'
    }
  ];

  const eventData = [
    {
      id: '1',
      name: '夏季大会2025',
      details: '夏季大会の詳細情報です。',
      url: 'https://example.com/event1',
      deadline: '2025/06/30',
      endDisplayDate: '2025/07/15',
      type: '大会' as const,
      status: '承認済' as const,
      registeredDate: '2025/05/01'
    },
    {
      id: '2',
      name: 'チームメンバー募集',
      details: 'チームメンバーを募集しています。',
      url: 'https://example.com/event2',
      deadline: '2025/06/15',
      endDisplayDate: '2025/06/30',
      type: '告知' as const,
      status: '審査中' as const,
      registeredDate: '2025/05/03'
    },
    {
      id: '3',
      name: 'トレーニングセッション',
      details: 'トレーニングセッションの案内です。',
      url: 'https://example.com/event3',
      deadline: '2025/05/25',
      endDisplayDate: '2025/06/10',
      type: 'その他' as const,
      status: '非公開' as const,
      registeredDate: '2025/05/05'
    }
  ];

  // タブ切り替え処理
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  // タブボタンのスタイルを生成する関数
  const getTabStyle = (tab: TabType) => {
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
      bottom: '-1px'
    };
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'rgb(var(--background-rgb))'
    }}>
      <Header />
      
      <main style={{
        flex: '1',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h1 style={{
            color: '#00c8ff',
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '8px'
          }}>
            マイページ
          </h1>
          <p style={{
            color: '#b0c4d8',
            fontSize: '1rem',
            marginBottom: '24px'
          }}>
            アカウント情報の管理、アップロードデータの確認ができます
          </p>
          
          {/* タブナビゲーション */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #1E3A5F',
            marginBottom: '24px'
          }}>
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
          <div style={{
            marginBottom: '24px'
          }}>
            {activeTab === 'profile' && (
              <ProfileSection initialProfile={profileData} />
            )}
            
            {activeTab === 'teams' && (
              <UploadedTeamsSection initialTeams={teamData} />
            )}
            
            {activeTab === 'matches' && (
              <UploadedMatchesSection initialMatches={matchData} />
            )}
            
            {activeTab === 'events' && (
              <RegisteredEventsSection initialEvents={eventData} />
            )}
          </div>
          
          {/* 注意事項 */}
          <div style={{
            background: '#0A1022',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #1E3A5F'
          }}>
            <h2 style={{
              color: '#00c8ff',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg
                style={{
                  width: '20px',
                  height: '20px'
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
            <ul style={{
              color: '#b0c4d8',
              fontSize: '0.9rem',
              lineHeight: '1.6',
              paddingLeft: '20px'
            }}>
              <li>プロフィール情報は他のユーザーにも表示されます。</li>
              <li>アップロードしたデータは管理者によって削除される場合があります。</li>
              <li>イベント情報は管理者の承認後に公開されます。</li>
              <li>アカウントに関するお問い合わせは管理者までご連絡ください。</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MyPage;
