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
      <div className="bg-[rgba(0,200,83,0.1)] border border-[rgba(0,200,83,0.3)] rounded p-4 mb-5 text-[#00c853]">
        <p className="mb-2.5 font-bold">
          リセット用のメールを送信しました！
        </p>
        <p className="text-[0.9rem]">
          {successEmail}{' '}
          宛にパスワードリセット用のリンクを送信しました。メールをご確認ください。
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
    >
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
          disabled={isLoading}
          className={`w-full py-3 px-4 bg-[#111A2E] border ${errors.email ? 'border-red-500' : 'border-[#1E3A5F]'
            } rounded-md text-white text-base outline-none transition-colors`}
        />
        {errors.email && (
          <p className="text-red-500 text-[0.8rem] mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3.5 border-none rounded-md text-base font-bold transition-all ${isLoading
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-70'
            : 'bg-[#00c8ff] text-[#020824] cursor-pointer'
          }`}
      >
        {isLoading ? '送信中...' : 'リセットリンクを送信'}
      </button>

      <div className="text-center text-[#b0c4d8] text-[0.9rem]">
        <Link
          href="/login"
          className="text-[#00c8ff]! no-underline font-bold"
        >
          ログインページに戻る
        </Link>
      </div>
    </form>
  );
}
