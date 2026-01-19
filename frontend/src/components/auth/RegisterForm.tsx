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
    } catch (error: unknown) {
      console.error('Registration error:', error);

      // 統一されたエラーハンドリングを使用
      const processedError = processApiError(error);

      if (
        processedError.isValidationError &&
        Object.keys(processedError.fieldErrors).length > 0
      ) {
        // バリデーションエラーの場合、フィールドごとにエラーを設定
        Object.entries(processedError.fieldErrors).forEach(
          ([field, message]) => {
            if (
              field === 'name' ||
              field === 'email' ||
              field === 'password' ||
              field === 'password_confirmation'
            ) {
              setError(field as keyof RegisterFormData, { message });
            }
          }
        );
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
      className="flex flex-col gap-4"
    >
      {/* 名前フィールド */}
      <div>
        <label
          htmlFor="name"
          className="block text-[#b0c4d8] text-[0.9rem] mb-1.5"
        >
          名前*
        </label>
        <input
          id="name"
          type="text"
          placeholder="ユーザー名を入力"
          {...register('name')}
          disabled={isSubmitting}
          className={`w-full p-3 rounded-md border bg-gray-800 text-gray-50 text-base outline-none ${errors.name ? 'border-red-500' : 'border-gray-700'}`}
        />
        {errors.name && (
          <p className="text-red-500 text-[0.8rem] mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* メールアドレスフィールド */}
      <div>
        <label
          htmlFor="email"
          className="block text-[#b0c4d8] text-[0.9rem] mb-1.5"
        >
          メールアドレス*
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@europa.work"
          {...register('email')}
          disabled={isSubmitting}
          className={`w-full p-3 rounded-md border bg-gray-800 text-gray-50 text-base outline-none ${errors.email ? 'border-red-500' : 'border-gray-700'}`}
        />
        {errors.email && (
          <p className="text-red-500 text-[0.8rem] mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* パスワードフィールド */}
      <div>
        <label
          htmlFor="password"
          className="block text-[#b0c4d8] text-[0.9rem] mb-1.5"
        >
          パスワード*
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="パスワードを入力"
            {...register('password')}
            disabled={isSubmitting}
            className={`w-full p-3 pr-12 rounded-md border bg-gray-800 text-gray-50 text-base outline-none ${errors.password ? 'border-red-500' : 'border-gray-700'}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#b0c4d8] cursor-pointer text-base p-1"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-[0.8rem] mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* パスワード確認フィールド */}
      <div>
        <label
          htmlFor="passwordConfirmation"
          className="block text-[#b0c4d8] text-[0.9rem] mb-1.5"
        >
          パスワード確認*
        </label>
        <div className="relative">
          <input
            id="passwordConfirmation"
            type={showPasswordConfirmation ? 'text' : 'password'}
            placeholder="パスワードを再入力"
            {...register('passwordConfirmation')}
            disabled={isSubmitting}
            className={`w-full p-3 pr-12 rounded-md border bg-gray-800 text-gray-50 text-base outline-none ${errors.passwordConfirmation ? 'border-red-500' : 'border-gray-700'}`}
          />
          <button
            type="button"
            onClick={() =>
              setShowPasswordConfirmation(!showPasswordConfirmation)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#b0c4d8] cursor-pointer text-base p-1"
          >
            {showPasswordConfirmation ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        </div>
        {errors.passwordConfirmation && (
          <p className="text-red-500 text-[0.8rem] mt-1">
            {errors.passwordConfirmation.message}
          </p>
        )}
      </div>

      {/* 送信ボタン */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full p-3 border-none rounded-md text-base font-bold mt-2 ${isSubmitting ? 'bg-gray-700 text-white cursor-not-allowed opacity-60' : 'bg-[#00c8ff] text-white cursor-pointer'}`}
      >
        {isSubmitting ? '登録中...' : 'アカウント作成'}
      </button>
    </form>
  );
}
