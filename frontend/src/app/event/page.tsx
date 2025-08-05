'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventRegistrationForm from '@/components/events/EventRegistrationForm';
import EventRegistrationNotice from '@/components/events/EventRegistrationNotice';

const EventPage: React.FC = () => {
  const { user, loading, hasHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ハイドレーション完了後かつローディングが終了した時のみ認証チェック
    if (hasHydrated && !loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, hasHydrated, router]);

  // ハイドレーション中またはローディング中は待機
  if (!hasHydrated || loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'rgb(var(--background-rgb))',
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  // ハイドレーション完了後にユーザーがいない場合は何も表示しない（useEffectでリダイレクトされる）
  if (!user) return null;

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
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <EventRegistrationForm />
          <EventRegistrationNotice />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventPage;
