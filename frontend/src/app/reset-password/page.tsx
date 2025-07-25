'use client';

import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type React from 'react';
import { Suspense, useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { checkResetPasswordToken, resetPassword } from '@/utils/api';

// クライアントコンポーネントを分離
const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // URLからトークンとメールを取得
    const tokenParam = searchParams.get('token');
    const emailParam = searchParams.get('email');
    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
      // APIでトークン検証
      checkResetPasswordToken(tokenParam, emailParam).then(res => {
        setIsTokenValid(res.valid);
        if (!res.valid)
          setError(
            res.message ||
              '無効なリセットリンクです。パスワードリセットを再度リクエストしてください。'
          );
      });
    } else {
      setIsTokenValid(false);
      setError(
        '無効なリセットリンクです。パスワードリセットを再度リクエストしてください。'
      );
    }
  }, [searchParams]);

  useEffect(() => {
    if (isTokenValid) {
      setError('');
    }
  }, [isTokenValid]);

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
      const result = await resetPassword(
        token,
        email,
        password,
        confirmPassword
      );
      if (result.message) {
        setIsSuccess(true);
      } else {
        setError(
          result.error ||
            'パスワードのリセットに失敗しました。もう一度お試しください。'
        );
      }
    } catch (err) {
      setError('パスワードのリセットに失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

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
            パスワードが正常に変更されました！
          </p>
          <p>新しいパスワードでログインできます。</p>

          <Link
            href="/login"
            style={{
              display: 'inline-block',
              marginTop: '16px',
              padding: '10px 16px',
              background: '#00c8ff',
              color: '#020824',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '0.9rem',
            }}
          >
            ログインページへ
          </Link>
        </div>
      ) : isTokenValid ? (
        <form onSubmit={handleSubmit}>
          {/* 新しいパスワード */}
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#b0c4d8',
                fontSize: '0.9rem',
              }}
            >
              新しいパスワード
            </label>
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
                placeholder="新しいパスワード"
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
            <p
              style={{
                color: '#8CB4FF',
                fontSize: '0.8rem',
                marginTop: '4px',
              }}
            >
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
                fontSize: '0.9rem',
              }}
            >
              パスワード再確認
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
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
                  padding: '4px',
                }}
                aria-label={
                  showConfirmPassword ? 'パスワードを隠す' : 'パスワードを表示'
                }
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
            }}
          >
            {isLoading ? '処理中...' : 'パスワードを変更'}
          </button>
        </form>
      ) : (
        <div
          style={{
            textAlign: 'center',
            color: '#b0c4d8',
            marginBottom: '20px',
          }}
        >
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
              fontSize: '0.9rem',
            }}
          >
            パスワードリセットを再リクエスト
          </Link>
        </div>
      )}

      {!isSuccess && (
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
      )}
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
          <ResetPasswordForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
