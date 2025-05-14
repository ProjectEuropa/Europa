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
  // Hooksは必ず関数の先頭で宣言
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [teamData, setTeamData] = useState<any[]>([]);
  const [matchData, setMatchData] = useState<any[]>([]);
  const [eventData, setEventData] = useState<any[]>([]);
  const [loading, setLoading] = useState({teams: false, matches: false, events: false});
  const { user } = useAuth();

  // 各タブごとにuseEffectを分離し、Hooksの順序を固定
  useEffect(() => {
    if (activeTab !== 'teams') return;
    setLoading(l => ({...l, teams: true}));
    import('@/utils/api').then(api => api.fetchMyTeamFiles())
      .then(setTeamData)
      .catch(() => setTeamData([]))
      .finally(() => setLoading(l => ({...l, teams: false})));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'matches') return;
    setLoading(l => ({...l, matches: true}));
    import('@/utils/api').then(api => api.fetchMyMatchFiles())
      .then(setMatchData)
      .catch(() => setMatchData([]))
      .finally(() => setLoading(l => ({...l, matches: false})));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'events') return;
    setLoading(l => ({...l, events: true}));
    import('@/utils/api').then(api => api.fetchMyEvents())
      .then(setEventData)
      .catch(() => setEventData([]))
      .finally(() => setLoading(l => ({...l, events: false})));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  if (!user) return <div>Loading...</div>;
  const profileData = {
    name: user.name,
    email: user.email,
    joinDate: user.created_at ? user.created_at.slice(0, 10).replace(/-/g, "/") : ""
  };

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
              loading.teams ? <div>Loading...</div> : <UploadedTeamsSection initialTeams={teamData} />
            )}

            {activeTab === 'matches' && (
              loading.matches ? <div>Loading...</div> : <UploadedMatchesSection initialMatches={matchData} />
            )}

            {activeTab === 'events' && (
              loading.events ? <div>Loading...</div> : <RegisteredEventsSection initialEvents={eventData} />
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
