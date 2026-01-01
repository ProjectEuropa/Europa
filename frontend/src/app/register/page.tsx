'use client';

import Link from 'next/link';
import type React from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const RegisterPage: React.FC = () => {
  const handleRegistrationSuccess = () => {
    // 登録成功時にホームページにリダイレクト
    window.location.href = '/';
  };

  return (
    <div className="flex flex-col min-h-screen bg-[rgb(var(--background-rgb))]">
      <Header />

      <main className="flex-1 flex justify-center items-center px-5 py-10">
        <div className="w-full max-w-[450px] bg-[#0A1022] rounded-xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-[#1E3A5F]">
          <h1 className="text-[#00c8ff] text-3xl font-bold mb-6 text-center">
            新規登録
          </h1>

          <RegisterForm onSuccess={handleRegistrationSuccess} redirectTo="/" />

          {/* ログインへのリンク */}
          <div className="mt-6 text-center text-[#b0c4d8] text-sm">
            すでにアカウントをお持ちですか？{' '}
            <Link
              href="/login"
              className="text-[#00c8ff]! no-underline font-bold hover:underline"
            >
              ログイン
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPage;
