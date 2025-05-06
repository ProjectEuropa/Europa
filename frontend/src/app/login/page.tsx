'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // ここに実際の認証ロジックを実装
      console.log('ログイン試行:', { email, password });
      
      // 仮の遅延（実際の認証処理に置き換え）
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 成功時の処理
      window.location.href = '/';
    } catch (err) {
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'rgb(var(--background-rgb))'
    }}>
      <Header />
      
      <main style={{
        flex: '1',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          background: '#0A1022',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          border: '1px solid #1E3A5F'
        }}>
          <h1 style={{
            color: '#00c8ff',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            ログイン
          </h1>
          
          {error && (
            <div style={{
              background: 'rgba(255, 0, 0, 0.1)',
              border: '1px solid rgba(255, 0, 0, 0.3)',
              borderRadius: '4px',
              padding: '10px',
              marginBottom: '20px',
              color: '#ff6b6b'
            }}>
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
                  fontSize: '0.9rem'
                }}
              >
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  transition: 'border-color 0.2s'
                }}
                placeholder="example@europa.com"
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <label 
                  htmlFor="password" 
                  style={{
                    color: '#b0c4d8',
                    fontSize: '0.9rem'
                  }}
                >
                  パスワード
                </label>
                <Link 
                  href="/forgot-password" 
                  style={{
                    color: '#00c8ff',
                    fontSize: '0.8rem',
                    textDecoration: 'none'
                  }}
                >
                  パスワードをお忘れですか？
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  transition: 'border-color 0.2s'
                }}
                placeholder="••••••••"
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
                marginTop: '20px'
              }}
            >
              {isLoading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>
          
          <div style={{
            marginTop: '24px',
            textAlign: 'center',
            color: '#b0c4d8',
            fontSize: '0.9rem'
          }}>
            アカウントをお持ちでないですか？{' '}
            <Link 
              href="/register" 
              style={{
                color: '#00c8ff',
                textDecoration: 'none',
                fontWeight: 'bold'
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
