'use client';

import Link from 'next/link';
import type React from 'react';
import { useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { authApi } from '@/lib/api/auth';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setIsSuccess(false);

    try {
      const result = await authApi.sendPasswordResetLink({ email });
      if (result.status) {
        setIsSuccess(true);
      } else {
        setError(
          result.error ||
            'メールの送信に失敗しました。メールアドレスを確認してください。'
        );
      }
    } catch (err) {
      setError(
        'メールの送信に失敗しました。メールアドレスを確認してください。'
      );
    } finally {
      setIsLoading(false);
    }
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

          {error && (
            <div
              style={{
                background: 'rgba(255, 0, 0, 0.1)',
                border: '1px solid rgba(255, 0, 0, 0.3)',
                borderRadius: '4px',
                padding: '10px',
                marginBottom: '20px',
                color: '#ff6b6b',
              }}
            >
              {error}
            </div>
          )}

          {isSuccess ? (
            <div
              style={{
                background: 'rgba(0, 200, 83, 0.1)',
                border: '1px solid rgba(0, 200, 83, 0.3)',
                borderRadius: '4px',
                padding: '16px',
                marginBottom: '20px',
                color: '#00c853',
              }}
            >
              <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                リセット用のメールを送信しました！
              </p>
              <p style={{ fontSize: '0.9rem' }}>
                {email}{' '}
                宛にパスワードリセット用のリンクを送信しました。メールをご確認ください。
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#b0c4d8',
                    fontSize: '0.9rem',
                  }}
                >
                  メールアドレス
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#111A2E',
                    border: '1px solid #1E3A5F',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  placeholder="example@europa.com"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#00c8ff',
                  color: '#020824',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  transition: 'all 0.2s',
                }}
              >
                {isLoading ? '送信中...' : 'リセットリンクを送信'}
              </button>
            </form>
          )}

          <div
            style={{
              marginTop: '24px',
              textAlign: 'center',
              color: '#b0c4d8',
              fontSize: '0.9rem',
            }}
          >
            <Link
              href="/login"
              style={{
                color: '#00c8ff',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              ログインページに戻る
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
