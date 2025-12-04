'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePasswordReset } from '@/hooks/usePasswordReset';
import type { PasswordResetFormData } from '@/schemas/auth';
import { passwordResetSchema } from '@/schemas/auth';

interface PasswordResetFormProps {
  token: string;
  onSuccess?: () => void;
}

export function PasswordResetForm({
  token,
  onSuccess,
}: PasswordResetFormProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [tokenError, setTokenError] = useState('');
  const [email, setEmail] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const { isLoading, checkToken, resetPassword } = usePasswordReset();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      token,
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  useEffect(() => {
    const validateToken = async () => {
      const result = await checkToken({ token });
      setIsTokenValid(result.isValid);
      if (!result.isValid) {
        setTokenError(result.message || '無効なリセットリンクです。');
      } else if (result.email) {
        // APIから取得したemailをフォームに設定
        setEmail(result.email);
        setValue('email', result.email);
      }
      setIsInitializing(false);
    };

    // パスワードリセット成功後は再検証をスキップ
    if (isSuccess) {
      return;
    }

    if (token) {
      validateToken();
    } else {
      setIsTokenValid(false);
      setTokenError(
        '無効なリセットリンクです。パスワードリセットを再度リクエストしてください。'
      );
      setIsInitializing(false);
    }
  }, [token, isSuccess, checkToken, setValue]);

  const onSubmit = async (data: PasswordResetFormData) => {
    const result = await resetPassword(data);

    if (result.success) {
      setIsSuccess(true);
      // トークンを無効化して再検証を防ぐ
      setIsTokenValid(false);

      if (onSuccess) {
        onSuccess();
      } else {
        // 3秒後にログインページにリダイレクト
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    }
  };

  if (isSuccess) {
    return (
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
        <p style={{ marginBottom: '16px' }}>
          新しいパスワードでログインできます。
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
            fontSize: '0.9rem',
          }}
        >
          ログインページへ
        </Link>
      </div>
    );
  }

  // 初期化中
  if (isInitializing) {
    return (
      <div style={{ textAlign: 'center', color: '#00c8ff', padding: '20px' }}>
        トークンを検証しています...
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div>
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
          {tokenError}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
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

        <div
          style={{
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
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      {/* 新しいパスワード */}
      <div>
        <label
          htmlFor="password"
          style={{
            display: 'block',
            marginBottom: '8px',
            color: '#b0c4d8',
            fontSize: '0.9rem',
          }}
        >
          新しいパスワード*
        </label>
        <div style={{ position: 'relative' }}>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="新しいパスワード"
            {...register('password')}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 16px',
              paddingRight: '48px',
              background: '#111A2E',
              border: errors.password
                ? '1px solid #ef4444'
                : '1px solid #1E3A5F',
              borderRadius: '6px',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
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
              color: '#b0c4d8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
            }}
            aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>
            {errors.password.message}
          </p>
        )}
        <p style={{ color: '#8CB4FF', fontSize: '0.8rem', marginTop: '4px' }}>
          ※ 8文字以上の英数字を含むパスワードを設定してください
        </p>
      </div>

      {/* パスワード確認 */}
      <div>
        <label
          htmlFor="passwordConfirmation"
          style={{
            display: 'block',
            marginBottom: '8px',
            color: '#b0c4d8',
            fontSize: '0.9rem',
          }}
        >
          パスワード再確認*
        </label>
        <div style={{ position: 'relative' }}>
          <input
            id="passwordConfirmation"
            type={showPasswordConfirmation ? 'text' : 'password'}
            placeholder="パスワードを再入力"
            {...register('passwordConfirmation')}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 16px',
              paddingRight: '48px',
              background: '#111A2E',
              border: errors.passwordConfirmation
                ? '1px solid #ef4444'
                : '1px solid #1E3A5F',
              borderRadius: '6px',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
          <button
            type="button"
            onClick={() =>
              setShowPasswordConfirmation(!showPasswordConfirmation)
            }
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: '#b0c4d8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
            }}
            aria-label={
              showPasswordConfirmation ? 'パスワードを隠す' : 'パスワードを表示'
            }
          >
            {showPasswordConfirmation ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        </div>
        {errors.passwordConfirmation && (
          <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>
            {errors.passwordConfirmation.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '14px',
          background: isLoading ? '#374151' : '#00c8ff',
          color: isLoading ? '#9ca3af' : '#020824',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.7 : 1,
          transition: 'all 0.2s',
          marginTop: '4px',
        }}
      >
        {isLoading ? '処理中...' : 'パスワードを変更'}
      </button>

      <div
        style={{
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
    </form>
  );
}
