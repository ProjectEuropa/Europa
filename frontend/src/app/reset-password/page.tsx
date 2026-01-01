'use client';

import { useSearchParams } from 'next/navigation';
import type React from 'react';
import { Suspense, useEffect, useState } from 'react';
import { PasswordResetForm } from '@/components/auth/PasswordResetForm';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

// クライアントコンポーネントを分離
const ResetPasswordFormWrapper = () => {
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');

  useEffect(() => {
    // URLからトークンを取得
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);

  if (!token) {
    return (
      <div className="w-full max-w-[400px] bg-[#0A1022] rounded-xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-[#1E3A5F] text-center text-[#00c8ff]">
        読み込み中...
      </div>
    );
  }

  return (
    <div className="w-full max-w-[400px] bg-[#0A1022] rounded-xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-[#1E3A5F]">
      <h1 className="text-[#00c8ff] text-3xl font-bold mb-4 text-center">
        パスワードリセット
      </h1>

      <PasswordResetForm token={token} />
    </div>
  );
};

// メインページコンポーネント
const ResetPasswordPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[rgb(var(--background-rgb))]">
      <Header />

      <main className="flex-1 flex justify-center items-center px-5 py-10">
        <Suspense
          fallback={
            <div className="w-full max-w-[400px] bg-[#0A1022] rounded-xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-[#1E3A5F] text-center text-[#00c8ff]">
              読み込み中...
            </div>
          }
        >
          <ResetPasswordFormWrapper />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
