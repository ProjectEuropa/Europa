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
const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, '名前を入力してください')
      .min(2, '名前は2文字以上で入力してください')
      .max(50, '名前は50文字以内で入力してください'),
    email: z
      .string()
      .min(1, 'メールアドレスを入力してください')
      .email('有効なメールアドレスを入力してください'),
    password: z
      .string()
      .min(1, 'パスワードを入力してください')
      .min(6, 'パスワードは6文字以上で入力してください')
      .max(100, 'パスワードは100文字以内で入力してください'),
    passwordConfirmation: z.string().min(1, 'パスワード確認を入力してください'),
  })
  .refine(data => data.password === data.passwordConfirmation, {
    message: 'パスワードが一致しません',
    path: ['passwordConfirmation'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function RegisterForm({
  onSuccess,
  redirectTo = '/mypage',
}: RegisterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const { register: registerUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      await registerUser(data);

      toast({
        type: 'success',
        title: '登録成功',
        message: 'アカウントが作成されました',
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo);
      }
    } catch (error: any) {
      console.error('Registration error:', error);

      // 統一されたエラーハンドリングを使用
      const processedError = processApiError(error);

      if (
        processedError.isValidationError &&
        Object.keys(processedError.fieldErrors).length > 0
      ) {
        // バリデーションエラーの場合、フィールドごとにエラーを設定
        Object.entries(processedError.fieldErrors).forEach(([field, message]) => {
          if (field === 'name' || field === 'email' || field === 'password' || field === 'password_confirmation') {
            setError(field as keyof RegisterFormData, { message });
          }
        });
      } else {
        // その他のエラーの場合、トーストでエラーメッセージを表示
        toast({
          type: 'error',
          title: '登録エラー',
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
      style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      {/* 名前フィールド */}
      <div>
        <label
          htmlFor="name"
          style={{
            display: 'block',
            color: '#b0c4d8',
            fontSize: '0.9rem',
            marginBottom: '6px',
          }}
        >
          名前*
        </label>
        <input
          id="name"
          type="text"
          placeholder="山田太郎"
          {...register('name')}
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: errors.name ? '1px solid #ef4444' : '1px solid #374151',
            backgroundColor: '#1f2937',
            color: '#f9fafb',
            fontSize: '1rem',
            outline: 'none',
          }}
        />
        {errors.name && (
          <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>
            {errors.name.message}
          </p>
        )}
      </div>

      {/* メールアドレスフィールド */}
      <div>
        <label
          htmlFor="email"
          style={{
            display: 'block',
            color: '#b0c4d8',
            fontSize: '0.9rem',
            marginBottom: '6px',
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
            padding: '12px',
            borderRadius: '6px',
            border: errors.email ? '1px solid #ef4444' : '1px solid #374151',
            backgroundColor: '#1f2937',
            color: '#f9fafb',
            fontSize: '1rem',
            outline: 'none',
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
            color: '#b0c4d8',
            fontSize: '0.9rem',
            marginBottom: '6px',
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
              padding: '12px',
              paddingRight: '48px',
              borderRadius: '6px',
              border: errors.password
                ? '1px solid #ef4444'
                : '1px solid #374151',
              backgroundColor: '#1f2937',
              color: '#f9fafb',
              fontSize: '1rem',
              outline: 'none',
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
              background: 'none',
              border: 'none',
              color: '#b0c4d8',
              cursor: 'pointer',
              fontSize: '1rem',
              padding: '4px',
            }}
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

      {/* パスワード確認フィールド */}
      <div>
        <label
          htmlFor="passwordConfirmation"
          style={{
            display: 'block',
            color: '#b0c4d8',
            fontSize: '0.9rem',
            marginBottom: '6px',
          }}
        >
          パスワード確認*
        </label>
        <div style={{ position: 'relative' }}>
          <input
            id="passwordConfirmation"
            type={showPasswordConfirmation ? 'text' : 'password'}
            placeholder="パスワードを再入力"
            {...register('passwordConfirmation')}
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '12px',
              paddingRight: '48px',
              borderRadius: '6px',
              border: errors.passwordConfirmation
                ? '1px solid #ef4444'
                : '1px solid #374151',
              backgroundColor: '#1f2937',
              color: '#f9fafb',
              fontSize: '1rem',
              outline: 'none',
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
              background: 'none',
              border: 'none',
              color: '#b0c4d8',
              cursor: 'pointer',
              fontSize: '1rem',
              padding: '4px',
            }}
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

      {/* 送信ボタン */}
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: isSubmitting ? '#374151' : '#00c8ff',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          marginTop: '8px',
          opacity: isSubmitting ? 0.6 : 1,
        }}
      >
        {isSubmitting ? '登録中...' : 'アカウント作成'}
      </button>
    </form>
  );
}
