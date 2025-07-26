'use client';

import Link from 'next/link';
import type React from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { RegisterForm } from '@/components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  const handleRegistrationSuccess = () => {
    // 登録成功時にホームページにリダイレクト
    window.location.href = '/';
  };

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
            maxWidth: '450px',
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
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            新規登録
          </h1>

          <RegisterForm
            onSuccess={handleRegistrationSuccess}
            redirectTo="/"
          />

          {/* ログインへのリンク */}
          <div
            style={{
              marginTop: '24px',
              textAlign: 'center',
              color: '#b0c4d8',
              fontSize: '0.9rem',
            }}
          >
            すでにアカウントをお持ちですか？{' '}
            <Link
              href="/login"
              style={{
                color: '#00c8ff',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
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
