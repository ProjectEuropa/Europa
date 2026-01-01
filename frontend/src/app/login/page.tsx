'use client';

import Link from 'next/link';
import type React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const LoginPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[rgb(var(--background-rgb))]">
      <Header />

      <main className="flex-1 flex justify-center items-center px-5 py-10">
        <div className="w-full max-w-[400px] bg-[#0A1022] rounded-xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-[#1E3A5F]">
          <h1 className="text-[#00c8ff] text-3xl font-bold mb-6 text-center">
            ログイン
          </h1>

          <LoginForm
            onSuccess={() => {
              window.location.href = '/';
            }}
          />

          <div className="flex justify-center mt-4">
            <Link
              href="/forgot-password"
              className="text-[#00c8ff]! text-sm no-underline hover:underline"
            >
              パスワードをお忘れですか？
            </Link>
          </div>

          <div className="mt-6 text-center text-[#b0c4d8] text-sm">
            アカウントをお持ちでないですか？{' '}
            <Link
              href="/register"
              className="text-[#00c8ff]! no-underline font-bold hover:underline"
            >
              新規登録
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
