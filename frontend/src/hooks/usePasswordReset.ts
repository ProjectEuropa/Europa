'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { authApi } from '@/lib/api/auth';
import type {
  PasswordResetData,
  PasswordResetRequest,
  PasswordResetTokenCheck,
} from '@/types/user';
import { processApiError } from '@/utils/apiErrorHandler';

export const usePasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendResetLink = async (data: PasswordResetRequest) => {
    setIsLoading(true);
    try {
      const result = await authApi.sendPasswordResetLink(data);

      // resultがnullまたはundefinedの場合の安全チェック
      if (!result) {
        throw new Error('APIレスポンスが無効です');
      }

      // エラーがない場合は成功とみなす
      if (!result.error) {
        toast({
          type: 'success',
          title: 'リセット用メール送信完了',
          message: `${data.email} 宛にパスワードリセット用のリンクを送信しました。`,
        });
        return { success: true };
      } else {
        const errorMessage =
          result.error ||
          'メールの送信に失敗しました。メールアドレスを確認してください。';
        toast({
          type: 'error',
          title: 'メール送信エラー',
          message: errorMessage,
        });
        return { success: false, error: errorMessage };
      }
    } catch (error: any) {
      console.error('Password reset link error:', error);
      const processedError = processApiError(error);
      toast({
        type: 'error',
        title: 'メール送信エラー',
        message: processedError.message,
      });
      return { success: false, error: processedError.message };
    } finally {
      setIsLoading(false);
    }
  };

  const checkToken = async (tokenCheck: PasswordResetTokenCheck) => {
    try {
      const result = await authApi.checkResetPasswordToken(tokenCheck);
      return {
        isValid: result.valid,
        message: result.message,
      };
    } catch (error: any) {
      const processedError = processApiError(error);
      return {
        isValid: false,
        message:
          processedError.message ||
          '無効なリセットリンクです。パスワードリセットを再度リクエストしてください。',
      };
    }
  };

  const resetPassword = async (data: PasswordResetData) => {
    setIsLoading(true);
    try {
      const result = await authApi.resetPassword(data);

      if (result.message) {
        toast({
          type: 'success',
          title: 'パスワード変更完了',
          message:
            'パスワードが正常に変更されました。新しいパスワードでログインできます。',
        });
        return { success: true };
      } else {
        const errorMessage =
          result.error ||
          'パスワードのリセットに失敗しました。もう一度お試しください。';
        toast({
          type: 'error',
          title: 'パスワードリセットエラー',
          message: errorMessage,
        });
        return { success: false, error: errorMessage };
      }
    } catch (error: any) {
      const processedError = processApiError(error);
      toast({
        type: 'error',
        title: 'パスワードリセットエラー',
        message: processedError.message,
      });
      return { success: false, error: processedError.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    sendResetLink,
    checkToken,
    resetPassword,
  };
};
