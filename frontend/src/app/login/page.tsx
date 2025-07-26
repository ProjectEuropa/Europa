'use client';

import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { useState } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { processApiError } from '@/utils/apiErrorHandler';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login({ email, password });

      toast({
        type: 'success',
        title: 'ログイン成功',
        message: 'ログインしました',
      });

      window.location.href = '/';
    } catch (error: any) {
      console.error('ログインエラー:', error);

      // 統一されたエラーハンドリングを使用
      const processedError = processApiError(error);

      if (processedError.isAuthError) {
        setError('メールアドレスまたはパスワードが正しくありません。');
      } else if (processedError.isNetworkError) {
        setError('接続に問題があります。しばらくしてから再試行してください。');
      } else if (processedError.isServerError) {
        setError('サーバーで問題が発生しました。しばらくしてから再試行してください。');
      } else {
        setError(processedError.message);
      }
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
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            ログイン
          </h1>

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

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
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

            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <label
                  htmlFor="password"
                  style={{
                    color: '#b0c4d8',
                    fontSize: '0.9rem',
                  }}
                >
                  パスワード
                </label>
                <Link
                  href="/forgot-password"
                  style={{
                    color: '#00c8ff',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                  }}
                >
                  パスワードをお忘れですか？
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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
                    paddingRight: '40px', // アイコンのスペースを確保
                  }}
                  placeholder={showPassword ? 'パスワードを入力' : '••••••••'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#b0c4d8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                  }}
                  aria-label={
                    showPassword ? 'パスワードを隠す' : 'パスワードを表示'
                  }
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
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
                marginTop: '20px',
              }}
            >
              {isLoading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          <div
            style={{
              marginTop: '24px',
              textAlign: 'center',
              color: '#b0c4d8',
              fontSize: '0.9rem',
            }}
          >
            アカウントをお持ちでないですか？{' '}
            <Link
              href="/register"
              style={{
                color: '#00c8ff',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
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