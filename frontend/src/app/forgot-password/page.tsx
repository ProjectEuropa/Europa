'use client';

import type React from 'react';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[rgb(var(--background-rgb))]">
      <Header />

      <main className="flex-1 flex justify-center items-center px-5 py-10">
        <div className="w-full max-w-[400px] bg-[#0A1022] rounded-xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-[#1E3A5F]">
          <h1 className="text-[#00c8ff] text-3xl font-bold mb-4 text-center">
            パスワードをお忘れですか？
          </h1>

          <p className="text-[#b0c4d8] text-sm mb-6 text-center leading-relaxed">
            登録したメールアドレスを入力してください。
            <br />
            パスワードリセット用のリンクをお送りします。
          </p>

          <ForgotPasswordForm />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
