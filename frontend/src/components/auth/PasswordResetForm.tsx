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
  }, [token, isSuccess, checkToken, setValue]); // checkTokenはuseCallbackでメモ化されているので安全

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
      <div className="bg-[rgba(0,200,83,0.1)] border border-[rgba(0,200,83,0.3)] rounded p-4 mb-5 text-[#00c853]">
        <p className="mb-2.5 font-bold">
          パスワードが正常に変更されました！
        </p>
        <p className="mb-4">
          新しいパスワードでログインできます。
        </p>

        <Link
          href="/login"
          className="inline-block py-2.5 px-4 bg-[#00c8ff] text-[#020824] rounded-md no-underline font-bold text-[0.9rem]"
        >
          ログインページへ
        </Link>
      </div>
    );
  }

  // 初期化中
  if (isInitializing) {
    return (
      <div className="text-center text-[#00c8ff] p-5">
        トークンを検証しています...
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div>
        <div className="bg-[rgba(255,0,0,0.1)] border border-[rgba(255,0,0,0.3)] rounded p-2.5 mb-5 text-[#ff6b6b]">
          {tokenError}
        </div>

        <div className="text-center mb-5">
          <Link
            href="/forgot-password"
            className="inline-block py-2.5 px-4 bg-[#00c8ff] text-[#020824] rounded-md no-underline font-bold text-[0.9rem]"
          >
            パスワードリセットを再リクエスト
          </Link>
        </div>

        <div className="text-center text-[#b0c4d8] text-[0.9rem]">
          <Link
            href="/login"
            className="text-[#00c8ff] no-underline font-bold"
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
      className="flex flex-col gap-5"
    >
      {/* 新しいパスワード */}
      <div>
        <label
          htmlFor="password"
          className="block mb-2 text-[#b0c4d8] text-[0.9rem]"
        >
          新しいパスワード*
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="新しいパスワード"
            {...register('password')}
            disabled={isLoading}
            className={`w-full py-3 px-4 pr-12 bg-[#111A2E] border ${
              errors.password ? 'border-red-500' : 'border-[#1E3A5F]'
            } rounded-md text-white text-base outline-none transition-colors`}
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
        <p className="text-[#8CB4FF] text-[0.8rem] mt-1">
          ※ 8文字以上の英数字を含むパスワードを設定してください
        </p>
      </div>

      {/* パスワード確認 */}
      <div>
        <label
          htmlFor="passwordConfirmation"
          className="block mb-2 text-[#b0c4d8] text-[0.9rem]"
        >
          パスワード再確認*
        </label>
        <div className="relative">
          <input
            id="passwordConfirmation"
            type={showPasswordConfirmation ? 'text' : 'password'}
            placeholder="パスワードを再入力"
            {...register('passwordConfirmation')}
            disabled={isLoading}
            className={`w-full py-3 px-4 pr-12 bg-[#111A2E] border ${
              errors.passwordConfirmation ? 'border-red-500' : 'border-[#1E3A5F]'
            } rounded-md text-white text-base outline-none transition-colors`}
          />
          <button
            type="button"
            onClick={() =>
              setShowPasswordConfirmation(!showPasswordConfirmation)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#b0c4d8] cursor-pointer flex items-center justify-center p-1"
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
          <p className="text-red-500 text-[0.8rem] mt-1">
            {errors.passwordConfirmation.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3.5 border-none rounded-md text-base font-bold mt-1 transition-all ${
          isLoading
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-70'
            : 'bg-[#00c8ff] text-[#020824] cursor-pointer'
        }`}
      >
        {isLoading ? '処理中...' : 'パスワードを変更'}
      </button>

      <div className="text-center text-[#b0c4d8] text-[0.9rem]">
        <Link
          href="/login"
          className="text-[#00c8ff] no-underline font-bold"
        >
          ログインページに戻る
        </Link>
      </div>
    </form>
  );
}
