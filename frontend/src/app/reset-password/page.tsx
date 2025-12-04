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
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          background: '#0A1022',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          border: '1px solid #1E3A5F',
          textAlign: 'center',
          color: '#00c8ff',
        }}
      >
        読み込み中...
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '400px',
        background: '#0A1022',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        border: '1px solid #1E3A5F',
      }}
    >
      <h1
        style={{
          color: '#00c8ff',
          fontSize: '1.8rem',
          fontWeight: 'bold',
          marginBottom: '16px',
          textAlign: 'center',
        }}
      >
        パスワードリセット
      </h1>

      <PasswordResetForm token={token} />
    </div>
  );
};

// メインページコンポーネント
const ResetPasswordPage: React.FC = () => {
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
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 20px',
        }}
      >
        <Suspense
          fallback={
            <div
              style={{
                width: '100%',
                maxWidth: '400px',
                background: '#0A1022',
                borderRadius: '12px',
                padding: '32px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                border: '1px solid #1E3A5F',
                textAlign: 'center',
                color: '#00c8ff',
              }}
            >
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
