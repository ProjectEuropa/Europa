'use client';

import type React from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

const ForgotPasswordPage: React.FC = () => {

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
            パスワードをお忘れですか？
          </h1>

          <p
            style={{
              color: '#b0c4d8',
              fontSize: '0.95rem',
              marginBottom: '24px',
              textAlign: 'center',
              lineHeight: '1.5',
            }}
          >
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
