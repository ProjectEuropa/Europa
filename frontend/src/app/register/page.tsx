'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Eye, EyeOff } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // パスワード一致チェック
    if (password !== confirmPassword) {
      setError('パスワードが一致しません。');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // utils/api.tsのregister関数を利用
      const res = await import('@/utils/api').then(mod => mod.register(name, email, password, confirmPassword));
      if (res.token) {
        // 成功時の処理
        window.location.href = '/';
      } else {
        setError(res.message || '登録に失敗しました。入力内容を確認してください。');
      }
    } catch (err) {
      setError('登録に失敗しました。入力内容を確認してください。');
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
          maxWidth: '450px',
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
            新規登録
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
            {/* 名前フィールド */}
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="name"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#b0c4d8',
                  fontSize: '0.9rem'
                }}
              >
                名前
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                placeholder="山田 太郎"
              />
            </div>

            {/* メールアドレスフィールド */}
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

            {/* パスワードフィールド */}
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="password"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#b0c4d8',
                  fontSize: '0.9rem'
                }}
              >
                パスワード
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
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
                    paddingRight: '40px' // アイコンのスペースを確保
                  }}
                  placeholder="8文字以上"
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
                    padding: '4px'
                  }}
                  aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              <p style={{
                color: '#8CB4FF',
                fontSize: '0.8rem',
                marginTop: '4px'
              }}>
                ※ 8文字以上の英数字を含むパスワードを設定してください
              </p>
            </div>

            {/* パスワード再確認フィールド */}
            <div style={{ marginBottom: '24px' }}>
              <label
                htmlFor="confirmPassword"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#b0c4d8',
                  fontSize: '0.9rem'
                }}
              >
                パスワード再確認
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                    paddingRight: '40px' // アイコンのスペースを確保
                  }}
                  placeholder="パスワードを再入力"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    padding: '4px'
                  }}
                  aria-label={showConfirmPassword ? "パスワードを隠す" : "パスワードを表示"}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* 登録ボタン */}
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
                marginTop: '10px'
              }}
            >
              {isLoading ? '登録中...' : 'アカウント作成'}
            </button>
          </form>

          {/* ログインへのリンク */}
          <div style={{
            marginTop: '24px',
            textAlign: 'center',
            color: '#b0c4d8',
            fontSize: '0.9rem'
          }}>
            すでにアカウントをお持ちですか？{' '}
            <Link
              href="/login"
              style={{
                color: '#00c8ff',
                textDecoration: 'none',
                fontWeight: 'bold'
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
