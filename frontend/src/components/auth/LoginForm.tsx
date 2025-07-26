'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form';
import { processApiError, setFormErrors } from '@/utils/apiErrorHandler';

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

export function LoginForm({ onSuccess, redirectTo = '/mypage' }: LoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      console.error('ログインエラー:', error);

      // 統一されたエラーハンドリングを使用
      const processedError = processApiError(error);

      if (processedError.isAuthError) {
        // 認証エラーの場合、両方のフィールドにエラーを設定
        setError('email', { message: processedError.message });
        setError('password', { message: processedError.message });
      } else if (processedError.isValidationError && Object.keys(processedError.fieldErrors).length > 0) {
        // バリデーションエラーの場合、フィールドごとにエラーを設定
        setFormErrors(setError, processedError.fieldErrors);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        name="email"
        label="メールアドレス"
        required
        error={errors.email?.message}
      >
        <Input
          type="email"
          placeholder="example@example.com"
          {...register('email')}
          disabled={isSubmitting}
        />
      </FormField>

      <FormField
        name="password"
        label="パスワード"
        required
        error={errors.password?.message}
      >
        <Input
          type="password"
          placeholder="パスワードを入力"
          {...register('password')}
          disabled={isSubmitting}
        />
      </FormField>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'ログイン中...' : 'ログイン'}
      </Button>
    </form>
  );
}
