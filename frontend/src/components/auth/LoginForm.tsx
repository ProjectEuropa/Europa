'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { processApiError } from '@/utils/apiErrorHandler';

// バリデーションスキーマ
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください'),
  password: z
    .string()
    .min(1, 'パスワードを入力してください')
    .min(6, 'パスワードは6文字以上で入力してください'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function LoginForm({
  onSuccess,
  redirectTo = '/mypage',
}: LoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await login(data);

      toast({
        type: 'success',
        title: 'ログイン成功',
        message: 'ログインしました',
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo);
      }
    } catch (error: any) {
      console.error('Login error:', error);

      // 統一されたエラーハンドリングを使用
      const processedError = processApiError(error);

      if (processedError.isAuthError) {
        // 認証エラーの場合、両方のフィールドにエラーを設定
        setError('email', { message: processedError.message });
        setError('password', { message: processedError.message });
      } else if (
        processedError.isValidationError &&
        Object.keys(processedError.fieldErrors).length > 0
      ) {
        // バリデーションエラーの場合、フィールドごとにエラーを設定
        Object.entries(processedError.fieldErrors).forEach(([field, message]) => {
          if (field === 'email' || field === 'password') {
            setError(field, { message });
          }
        });
      } else {
        // その他のエラーの場合、トーストでエラーメッセージを表示
        toast({
          type: 'error',
          title: 'ログインエラー',
          message: processedError.message,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      {/* メールアドレスフィールド */}
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
          placeholder="example@example.com"
          {...register('email')}
          disabled={isSubmitting}
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

      {/* パスワードフィールド */}
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
          パスワード*
        </label>
        <div style={{ position: 'relative' }}>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="パスワードを入力"
            {...register('password')}
            disabled={isSubmitting}
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
      </div>

      {/* 送信ボタン */}
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: '100%',
          padding: '14px',
          background: isSubmitting ? '#374151' : '#00c8ff',
          color: isSubmitting ? '#9ca3af' : '#020824',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          opacity: isSubmitting ? 0.7 : 1,
          transition: 'all 0.2s',
          marginTop: '4px',
        }}
      >
        {isSubmitting ? 'ログイン中...' : 'ログイン'}
      </button>
    </form>
  );
}
