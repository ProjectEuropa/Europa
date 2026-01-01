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
    <div className="flex flex-col min-h-screen bg-[#0a0818] text-white selection:bg-cyan-500/30">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 md:py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-cyan-400 font-extrabold text-xs md:text-sm tracking-[2px] md:tracking-[3px] uppercase animate-pulse shadow-cyan-500/50 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] mb-2 md:mb-4">
              EVENT REGISTRATION
            </h2>
            <h1 className="text-white font-black text-3xl md:text-5xl tracking-tight cyber-title drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] mb-4 md:mb-6">
              イベント登録
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-lg px-4">
              新しいイベント情報を登録することができます
            </p>
          </div>

          {/* Form Area */}
          <div className="bg-[#0d1124]/80 backdrop-blur-md border border-cyan-500/20 rounded-xl md:rounded-2xl p-4 md:p-8 shadow-[0_0_30px_-5px_rgba(0,0,0,0.3)]">
            <EventRegistrationForm />
          </div>

          {/* Notice Area */}
          <div className="mt-6">
            <EventRegistrationNotice />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventPage;
