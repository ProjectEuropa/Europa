'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect } from 'react';
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
      <div className="flex justify-center items-center min-h-screen text-[#b0c4d8]">
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
  const getTabClassName = (tab: MyPageTab) => {
    const isActive = activeTab === tab;
    return `px-5 py-3 cursor-pointer mr-1 relative -bottom-px ${
      isActive
        ? 'bg-[#0F1A2E] border border-[#1E3A5F] border-b-[#0F1A2E] rounded-t-lg text-[#00c8ff] font-bold'
        : 'bg-transparent border border-transparent border-b-[#1E3A5F] text-[#b0c4d8] font-normal'
    }`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[rgb(var(--background-rgb))]">
      <Header />

      <main className="flex-1 p-5">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-[#00c8ff] text-3xl font-bold mb-2">
            マイページ
          </h1>
          <p className="text-[#b0c4d8] text-base mb-6">
            アカウント情報の管理、アップロードデータの確認ができます
          </p>

          {/* タブナビゲーション */}
          <div className="flex border-b border-[#1E3A5F] mb-6">
            <button
              onClick={() => handleTabChange('profile')}
              className={getTabClassName('profile')}
            >
              プロフィール
            </button>
            <button
              onClick={() => handleTabChange('teams')}
              className={getTabClassName('teams')}
            >
              チームデータ
            </button>
            <button
              onClick={() => handleTabChange('matches')}
              className={getTabClassName('matches')}
            >
              マッチデータ
            </button>
            <button
              onClick={() => handleTabChange('events')}
              className={getTabClassName('events')}
            >
              イベント
            </button>
          </div>

          {/* タブコンテンツ */}
          <div className="mb-6">
            {activeTab === 'profile' && <ProfileSection />}
            {activeTab === 'teams' && <FileListSection type="team" />}
            {activeTab === 'matches' && <FileListSection type="match" />}
            {activeTab === 'events' && <RegisteredEventsSection />}
          </div>

          {/* 注意事項 */}
          <div className="bg-[#0A1022] rounded-xl p-5 border border-[#1E3A5F]">
            <h2 className="text-[#00c8ff] text-xl font-bold mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5"
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
            <ul className="text-[#b0c4d8] text-sm leading-relaxed pl-5 list-disc">
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
