'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/authStore';
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
  onStepChange?: (step: 'register' | 'otp') => void;
}

export function RegisterForm({
  onSuccess,
  redirectTo = '/mypage',
  onStepChange,
}: RegisterFormProps) {
  // ステップ管理: 'register' | 'otp'
  const [step, setStep] = useState<'register' | 'otp'>('register');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  // OTPステート
  const [sessionToken, setSessionToken] = useState<string>('');
  const [maskedEmail, setMaskedEmail] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [expiresInSeconds, setExpiresInSeconds] = useState<number>(600);

  const { register: registerUser } = useAuth();
  const verifyOtp = useAuthStore(state => state.verifyOtp);
  const { toast } = useToast();
  const router = useRouter();
  const otpInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // ステップ変更を親コンポーネントに通知
  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  // OTP画面移行時に自動フォーカス & 再送クールダウン初期化
  useEffect(() => {
    if (step === 'otp') {
      otpInputRef.current?.focus();
      setResendCooldown(60);
    }
  }, [step]);

  // クールダウンおよび有効期限のタイマー
  useEffect(() => {
    if (step !== 'otp') return;

    const timer = setInterval(() => {
      setResendCooldown(prev => (prev > 0 ? prev - 1 : 0));
      setExpiresInSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [step]);

  // 1次登録: アカウント情報送信
  const onRegisterSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      const result = await registerUser(data);

      if (result && 'requires2FA' in result && result.requires2FA) {
        setSessionToken(result.sessionToken);
        setMaskedEmail(result.maskedEmail);
        setExpiresInSeconds(result.expiresIn || 600);
        setStep('otp');

        toast({
          type: 'info',
          title: '確認コードを送信しました',
          message: `${result.maskedEmail} 宛に送信された6桁の確認コードをご確認ください。`,
        });
        return;
      }

      // 2FA不要で直接登録成功した場合（後方互換）
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
      const processedError = processApiError(error);

      if (
        processedError.isValidationError &&
        Object.keys(processedError.fieldErrors).length > 0
      ) {
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

  // 2次認証: OTPコード送信
  const onOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = otpCode.trim();

    if (cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
      setOtpError('6桁の半角数字を入力してください');
      return;
    }

    setIsSubmitting(true);
    setOtpError('');

    try {
      if (verifyOtp) {
        await verifyOtp({
          sessionToken,
          code: cleanCode,
          remember: true,
        });
      } else {
        await authApi.verifyOtp({
          sessionToken,
          code: cleanCode,
          remember: true,
        });
      }

      toast({
        type: 'success',
        title: '登録完了',
        message: 'アカウント登録とログインが完了しました',
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo);
      }
    } catch (error: unknown) {
      console.error('OTP Verification error:', error);
      const processedError = processApiError(error);
      setOtpError(
        processedError.message ||
          '認証コードが正しくないか、有効期限が切れています'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 認証コードの再送信
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setOtpError('');

    try {
      const res = await authApi.resendOtp(sessionToken);
      setResendCooldown(60);
      setExpiresInSeconds(res.expiresIn || 600);
      toast({
        type: 'success',
        title: 'コード再送信完了',
        message: '新しい認証コードをメールで送信しました。',
      });
    } catch (error: unknown) {
      console.error('Resend OTP error:', error);
      const processedError = processApiError(error);
      toast({
        type: 'error',
        title: '再送信エラー',
        message: processedError.message || '認証コードの再送信に失敗しました',
      });
    } finally {
      setIsResending(false);
    }
  };

  // 有効期限の残り時間表示フォーマット
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // ─────────────────────────────────────────────
  // 認証コード入力ステップ（OTP）
  // ─────────────────────────────────────────────
  if (step === 'otp') {
    return (
      <form onSubmit={onOtpSubmit} className="flex flex-col gap-5">
        {/* ヘッダー情報バナー */}
        <div className="flex items-center gap-3 p-3.5 bg-[#111A2E] border border-[#1E3A5F] rounded-lg">
          <div className="w-10 h-10 rounded-full bg-[#00c8ff]/10 border border-[#00c8ff]/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#00c8ff]" />
          </div>
          <div className="text-left text-xs text-[#b0c4d8] leading-relaxed">
            <span className="font-semibold text-white block text-sm">
              メールアドレス確認
            </span>
            {maskedEmail} に届いた6桁の確認コードを入力してください
          </div>
        </div>

        {/* 認証コード入力欄 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="otp-code"
              className="text-[#b0c4d8] text-[0.9rem] flex items-center gap-1.5 font-medium"
            >
              <KeyRound className="w-4 h-4 text-[#00c8ff]" />
              確認コード（6桁）
            </label>
            <span className="text-xs text-[#64748b]">
              有効期限:{' '}
              <strong
                className={
                  expiresInSeconds < 60 ? 'text-red-400' : 'text-[#00c8ff]'
                }
              >
                {formatTime(expiresInSeconds)}
              </strong>
            </span>
          </div>

          <input
            ref={otpInputRef}
            id="otp-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            value={otpCode}
            onChange={e => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 6);
              setOtpCode(val);
              if (otpError) setOtpError('');
            }}
            disabled={isSubmitting}
            className={`w-full py-3.5 px-4 bg-[#111A2E] border rounded-md text-white text-center text-2xl font-mono tracking-[0.5em] outline-none transition-all placeholder:text-[#334155] ${
              otpError
                ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                : 'border-[#1E3A5F] focus:border-[#00c8ff] focus:shadow-[0_0_12px_rgba(0,200,255,0.25)]'
            }`}
          />
          {otpError && (
            <p className="text-red-400 text-[0.8rem] mt-1.5 text-center">
              {otpError}
            </p>
          )}
        </div>

        {/* 認証ボタン */}
        <button
          type="submit"
          disabled={isSubmitting || otpCode.length !== 6}
          className={`w-full py-3.5 px-4 rounded-md font-semibold text-base transition-all flex items-center justify-center gap-2 ${
            isSubmitting || otpCode.length !== 6
              ? 'bg-[#1E3A5F]/50 text-[#64748b] cursor-not-allowed border border-[#1E3A5F]'
              : 'bg-[#00c8ff] text-[#0A1022] hover:bg-[#38bdf8] hover:shadow-[0_0_15px_rgba(0,200,255,0.4)] cursor-pointer'
          }`}
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              確認中...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              登録を完了してログイン
            </>
          )}
        </button>

        {/* 再送信リンク & 戻るボタン */}
        <div className="flex flex-col items-center gap-3 pt-2 text-xs text-[#64748b]">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendCooldown > 0 || isResending}
            className={`flex items-center gap-1.5 transition-colors ${
              resendCooldown > 0 || isResending
                ? 'text-[#64748b] cursor-not-allowed'
                : 'text-[#00c8ff] hover:text-[#38bdf8] cursor-pointer hover:underline'
            }`}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`}
            />
            {resendCooldown > 0
              ? `コードを再送信（${resendCooldown}秒後に可能）`
              : '確認コードを再送信する'}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep('register');
              setOtpCode('');
              setOtpError('');
            }}
            className="flex items-center gap-1 text-[#b0c4d8] hover:text-white transition-colors cursor-pointer mt-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            登録情報の入力に戻る
          </button>
        </div>
      </form>
    );
  }

  // ─────────────────────────────────────────────
  // 新規登録入力ステップ（Register）
  // ─────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit(onRegisterSubmit)}
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
          className={`w-full p-3 rounded-md border bg-gray-800 text-gray-50 text-base outline-none ${
            errors.name ? 'border-red-500' : 'border-gray-700'
          }`}
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
          placeholder="メールアドレスを入力"
          {...register('email')}
          disabled={isSubmitting}
          className={`w-full p-3 rounded-md border bg-gray-800 text-gray-50 text-base outline-none ${
            errors.email ? 'border-red-500' : 'border-gray-700'
          }`}
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
            placeholder="6文字以上のパスワード"
            {...register('password')}
            disabled={isSubmitting}
            className={`w-full p-3 pr-12 rounded-md border bg-gray-800 text-gray-50 text-base outline-none ${
              errors.password ? 'border-red-500' : 'border-gray-700'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
            aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
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
            className={`w-full p-3 pr-12 rounded-md border bg-gray-800 text-gray-50 text-base outline-none ${
              errors.passwordConfirmation
                ? 'border-red-500'
                : 'border-gray-700'
            }`}
          />
          <button
            type="button"
            onClick={() =>
              setShowPasswordConfirmation(!showPasswordConfirmation)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
            aria-label={
              showPasswordConfirmation
                ? 'パスワードを隠す'
                : 'パスワードを表示'
            }
          >
            {showPasswordConfirmation ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
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
        className={`w-full py-3.5 px-4 rounded-md font-semibold text-base transition-all mt-2 ${
          isSubmitting
            ? 'bg-[#1E3A5F] text-[#64748b] cursor-not-allowed'
            : 'bg-[#00c8ff] text-[#0A1022] hover:bg-[#38bdf8] hover:shadow-[0_0_15px_rgba(0,200,255,0.4)] cursor-pointer'
        }`}
      >
        {isSubmitting ? '登録処理中...' : '登録する'}
      </button>
    </form>
  );
}
