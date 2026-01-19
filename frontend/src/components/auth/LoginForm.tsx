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
  remember: z.boolean().optional(),
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
    } catch (error: unknown) {
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
        Object.entries(processedError.fieldErrors).forEach(
          ([field, message]) => {
            if (field === 'email' || field === 'password') {
              setError(field, { message });
            }
          }
        );
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
      className="flex flex-col gap-5"
    >
      {/* メールアドレスフィールド */}
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-[#b0c4d8] text-[0.9rem]"
        >
          メールアドレス*
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@europa.work"
          {...register('email')}
          disabled={isSubmitting}
          className={`w-full py-3 px-4 bg-[#111A2E] border rounded-md text-white text-base outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-[#1E3A5F]'}`}
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
          className="block mb-2 text-[#b0c4d8] text-[0.9rem]"
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
            className={`w-full py-3 px-4 pr-12 bg-[#111A2E] border rounded-md text-white text-base outline-none transition-colors ${errors.password ? 'border-red-500' : 'border-[#1E3A5F]'}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#b0c4d8] cursor-pointer flex items-center justify-center p-1"
            aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
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

      {/* ログインしたままにするチェックボックス */}
      <div className="flex items-center">
        <input
          id="remember"
          type="checkbox"
          {...register('remember')}
          className="w-4 h-4 mr-2 cursor-pointer accent-[#00c8ff]"
        />
        <label
          htmlFor="remember"
          className="text-[#b0c4d8] text-[0.9rem] cursor-pointer select-none"
        >
          ログインしたままにする
        </label>
      </div>

      {/* 送信ボタン */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3.5 border-none rounded-md text-base font-bold mt-1 transition-all ${isSubmitting ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-70' : 'bg-[#00c8ff] text-[#020824] cursor-pointer'}`}
      >
        {isSubmitting ? 'ログイン中...' : 'ログイン'}
      </button>
    </form>
  );
}
