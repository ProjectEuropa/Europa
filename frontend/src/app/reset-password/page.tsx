'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const ResetPasswordPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);

  useEffect(() => {
    // URLからトークンを取得
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      // 実際のアプリでは、ここでトークンの有効性を確認するAPIを呼び出す
      validateToken(tokenParam);
    } else {
      setIsTokenValid(false);
      setError('無効なリセットリンクです。パスワードリセットを再度リクエストしてください。');
    }
  }, [searchParams]);

  // トークン検証のモック関数
  const validateToken = async (token: string) => {
    // 実際のアプリではAPIを呼び出してトークンを検証
    // ここではモックとして常に有効とする
    setIsTokenValid(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // パスワード一致チェック
    if (password !== confirmPassword) {
      setError('パスワードが一致しません。');
      return;
    }
    
    // パスワード強度チェック
    if (password.length < 8) {
      setError('パスワードは8文字以上である必要があります。');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      // ここに実際のパスワードリセットロジックを実装
      console.log('パスワードリセット:', { token, password });
      
      // 仮の遅延（実際の処理に置き換え）
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 成功時の処理
      setIsSuccess(true);
    } catch (err) {
      setError('パスワードのリセットに失敗しました。もう一度お試しください。');
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
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            パスワードリセット
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
          
          {isSuccess ? (
            <div style={{
              background: 'rgba(0, 200, 83, 0.1)',
              border: '1px solid rgba(0, 200, 83, 0.3)',
              borderRadius: '4px',
              padding: '16px',
              marginBottom: '20px',
              color: '#00c853'
            }}>
              <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                パスワードが正常にリセットされました！
              </p>
              <p style={{ fontSize: '0.9rem', marginBottom: '16px' }}>
                新しいパスワードでログインできるようになりました。
              </p>
              <Link 
                href="/login" 
                style={{
                  display: 'inline-block',
                  padding: '10px 16px',
                  background: '#00c8ff',
                  color: '#020824',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              >
                ログインページへ
              </Link>
            </div>
          ) : isTokenValid ? (
            <form onSubmit={handleSubmit}>
              <p style={{
                color: '#b0c4d8',
                fontSize: '0.95rem',
                marginBottom: '24px',
                lineHeight: '1.5'
              }}>
                新しいパスワードを設定してください。
              </p>
              
              {/* 新しいパスワード */}
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
                  新しいパスワード
                </label>
                <input
                  id="password"
                  type="password"
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
                    transition: 'border-color 0.2s'
                  }}
                  placeholder="8文字以上"
                />
                <p style={{
                  color: '#8CB4FF',
                  fontSize: '0.8rem',
                  marginTop: '4px'
                }}>
                  ※ 8文字以上の英数字を含むパスワードを設定してください
                </p>
              </div>
              
              {/* パスワード確認 */}
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
                <input
                  id="confirmPassword"
                  type="password"
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
                    transition: 'border-color 0.2s'
                  }}
                  placeholder="パスワードを再入力"
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
                  transition: 'all 0.2s'
                }}
              >
                {isLoading ? '処理中...' : 'パスワードを変更'}
              </button>
            </form>
          ) : (
            <div style={{
              textAlign: 'center',
              color: '#b0c4d8',
              marginBottom: '20px'
            }}>
              <p style={{ marginBottom: '16px' }}>
                リンクが無効または期限切れです。
              </p>
              <Link 
                href="/forgot-password" 
                style={{
                  display: 'inline-block',
                  padding: '10px 16px',
                  background: '#00c8ff',
                  color: '#020824',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              >
                パスワードリセットを再リクエスト
              </Link>
            </div>
          )}
          
          {!isSuccess && (
            <div style={{
              marginTop: '24px',
              textAlign: 'center',
              color: '#b0c4d8',
              fontSize: '0.9rem'
            }}>
              <Link 
                href="/login" 
                style={{
                  color: '#00c8ff',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                ログインページに戻る
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
