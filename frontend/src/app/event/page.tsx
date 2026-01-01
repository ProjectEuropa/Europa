'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import EventRegistrationForm from '@/components/events/EventRegistrationForm';
import EventRegistrationNotice from '@/components/events/EventRegistrationNotice';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';

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
      <div className="flex items-center justify-center min-h-screen bg-[rgb(var(--background-rgb))]">
        <div>Loading...</div>
      </div>
    );
  }

  // ハイドレーション完了後にユーザーがいない場合は何も表示しない（useEffectでリダイレクトされる）
  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[rgb(var(--background-rgb))]">
      <Header />

      <main className="flex-1 p-5">
        <div className="max-w-[800px] mx-auto">
          <EventRegistrationForm />
          <EventRegistrationNotice />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventPage;
