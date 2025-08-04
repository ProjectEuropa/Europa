'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePasswordReset } from '@/hooks/usePasswordReset';
import type { PasswordResetRequestFormData } from '@/schemas/auth';
import { passwordResetRequestSchema } from '@/schemas/auth';

interface ForgotPasswordFormProps {
  onSuccess?: (email: string) => void;
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [successEmail, setSuccessEmail] = useState('');
  const { isLoading, sendResetLink } = usePasswordReset();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<PasswordResetRequestFormData>({
    resolver: zodResolver(passwordResetRequestSchema),
  });

  const onSubmit = async (data: PasswordResetRequestFormData) => {
    const result = await sendResetLink(data);

    if (result.success) {
      setIsSuccess(true);
      setSuccessEmail(data.email);
      if (onSuccess) {
        onSuccess(data.email);
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
          リセット用のメールを送信しました！
        </p>
        <p style={{ fontSize: '0.9rem' }}>
          {successEmail}{' '}
          宛にパスワードリセット用のリンクを送信しました。メールをご確認ください。
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      <div>
        <label
          htmlFor="email"
          style={{
            display: 'block',
            marginBottom: '8px',
            color: '#b0c4d8',
            fontSize: '0.9rem',
          }}
        >
          メールアドレス*
        </label>
        <input
          id="email"
          type="email"
          placeholder="example@europa.com"
          {...register('email')}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: '#111A2E',
            border: errors.email ? '1px solid #ef4444' : '1px solid #1E3A5F',
            borderRadius: '6px',
            color: 'white',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
        />
        {errors.email && (
          <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>
            {errors.email.message}
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
        }}
      >
        {isLoading ? '送信中...' : 'リセットリンクを送信'}
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
