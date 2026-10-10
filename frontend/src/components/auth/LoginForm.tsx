'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Mail, RefreshCw, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { authApi } from '@/lib/api/auth';
import { processApiError } from '@/utils/apiErrorHandler';

// パスワードログインのバリデーションスキーマ
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
  onStepChange?: (step: 'credentials' | 'otp') => void;
}

export function LoginForm({
  onSuccess,
  redirectTo = '/mypage',
  onStepChange,
}: LoginFormProps) {
  // ステップ管理: 'credentials' | 'otp'
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // OTPステート
  const [sessionToken, setSessionToken] = useState<string>('');
  const [maskedEmail, setMaskedEmail] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [expiresInSeconds, setExpiresInSeconds] = useState<number>(600);

  const { login, verifyOtp } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const otpInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
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
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      setExpiresInSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [step]);

  // 1次認証: メール + パスワード送信
  const onCredentialsSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const result = await login(data);

      if ('requires2FA' in result && result.requires2FA) {
        setSessionToken(result.sessionToken);
        setMaskedEmail(result.maskedEmail);
        setRememberMe(!!data.remember);
        setExpiresInSeconds(result.expiresIn || 600);
        setStep('otp');

        toast({
          type: 'info',
          title: '認証コードを送信しました',
          message: `${result.maskedEmail} 宛に送信された6桁の認証コードをご確認ください。`,
        });
        return;
      }

      // 2FA不要で直接ログイン成功した場合
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
      const processedError = processApiError(error);

      if (processedError.isAuthError) {
        setError('email', { message: processedError.message });
        setError('password', { message: processedError.message });
      } else if (
        processedError.isValidationError &&
        Object.keys(processedError.fieldErrors).length > 0
      ) {
        Object.entries(processedError.fieldErrors).forEach(([field, message]) => {
          if (field === 'email' || field === 'password') {
            setError(field, { message });
          }
        });
      } else {
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
      await verifyOtp({
        sessionToken,
        code: cleanCode,
        remember: rememberMe,
      });

      toast({
        type: 'success',
        title: '認証完了',
        message: 'ログインに成功しました',
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo);
      }
    } catch (error: unknown) {
      console.error('OTP verification error:', error);
      const processedError = processApiError(error);
      setOtpError(processedError.message || '認証コードが正しくありません');
    } finally {
      setIsSubmitting(false);
    }
  };

  // OTP再送信
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setOtpError('');

    try {
      const response = await authApi.resendOtp(sessionToken);
      setResendCooldown(60);
      setExpiresInSeconds(response.expiresIn || 600);

      toast({
        type: 'success',
        title: 'コード再送信完了',
        message: '新しい認証コードをメールに送信しました。',
      });
    } catch (error: unknown) {
      console.error('OTP resend error:', error);
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

  // 戻る（資格情報入力に戻る）
  const handleBackToCredentials = () => {
    setStep('credentials');
    setOtpCode('');
    setOtpError('');
    setSessionToken('');
  };

  // 有効期限の分・秒フォーマット
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ==========================================
  // Step 2: 2段階認証（OTP）画面
  // ==========================================
  if (step === 'otp') {
    return (
      <form onSubmit={onOtpSubmit} className="flex flex-col gap-5">
        <div className="flex items-center gap-3 p-3.5 bg-[#111A2E] rounded-lg border border-[#1E3A5F]">
          <div className="w-10 h-10 rounded-full bg-[rgba(0,200,255,0.1)] border border-[#00c8ff]/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#00c8ff]" />
          </div>
          <div className="text-left text-xs text-[#b0c4d8] leading-relaxed">
            <span className="font-semibold text-white block text-sm">2段階認証</span>
            {maskedEmail} に届いた6桁の認証コードを入力してください
          </div>
        </div>

        {/* 認証コード入力欄 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="otp-code" className="text-[#b0c4d8] text-[0.9rem] flex items-center gap-1.5 font-medium">
              <KeyRound className="w-4 h-4 text-[#00c8ff]" />
              認証コード（6桁）
            </label>
            <span className="text-xs text-[#64748b]">
              有効期限: <strong className={expiresInSeconds < 60 ? 'text-red-400' : 'text-[#00c8ff]'}>{formatTime(expiresInSeconds)}</strong>
            </span>
          </div>

          <input
            id="otp-code"
            ref={otpInputRef}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            value={otpCode}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 6);
              setOtpCode(val);
              if (otpError) setOtpError('');
            }}
            disabled={isSubmitting}
            className={`w-full py-3.5 px-4 bg-[#111A2E] border rounded-md text-white text-center text-2xl font-mono tracking-[0.5em] outline-none transition-all placeholder:text-[#334155] ${
              otpError ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-[#1E3A5F] focus:border-[#00c8ff] focus:shadow-[0_0_12px_rgba(0,200,255,0.25)]'
            }`}
          />
          {otpError && <p className="text-red-400 text-[0.8rem] mt-1.5 text-center">{otpError}</p>}
        </div>

        {/* 認証ボタン */}
        <button
          type="submit"
          disabled={isSubmitting || otpCode.length !== 6}
          className={`w-full py-3.5 border-none rounded-md text-base font-bold transition-all shadow-md ${
            isSubmitting || otpCode.length !== 6
              ? 'bg-[#1e293b] text-[#64748b] cursor-not-allowed opacity-60'
              : 'bg-[#00c8ff] hover:bg-[#38bdf8] text-[#020824] cursor-pointer hover:shadow-[0_0_15px_rgba(0,200,255,0.4)]'
          }`}
        >
          {isSubmitting ? '認証中...' : '認証してログイン'}
        </button>

        {/* コード再送信 & 戻るリンク */}
        <div className="flex flex-col gap-3 pt-2 border-t border-[#1E3A5F]/60 text-center">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendCooldown > 0 || isResending}
            className={`text-xs inline-flex items-center justify-center gap-1.5 bg-transparent border-none py-1 transition-colors ${
              resendCooldown > 0 || isResending
                ? 'text-[#64748b] cursor-not-allowed'
                : 'text-[#00c8ff] hover:text-[#38bdf8] cursor-pointer hover:underline'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
            {resendCooldown > 0
              ? `コードを再送信（${resendCooldown}秒後に可能）`
              : '認証コードを再送信する'}
          </button>

          <button
            type="button"
            onClick={handleBackToCredentials}
            className="text-xs text-[#94a3b8] hover:text-white inline-flex items-center justify-center gap-1.5 bg-transparent border-none py-1 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            別のアカウントでログイン
          </button>
        </div>
      </form>
    );
  }

  // ==========================================
  // Step 1: メール & パスワード入力画面
  // ==========================================
  return (
    <form
      onSubmit={handleSubmit(onCredentialsSubmit)}
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
          className={`w-full py-3 px-4 bg-[#111A2E] border rounded-md text-white text-base outline-none transition-colors ${
            errors.email ? 'border-red-500' : 'border-[#1E3A5F] focus:border-[#00c8ff]'
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
            className={`w-full py-3 px-4 pr-12 bg-[#111A2E] border rounded-md text-white text-base outline-none transition-colors ${
              errors.password ? 'border-red-500' : 'border-[#1E3A5F] focus:border-[#00c8ff]'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#b0c4d8] hover:text-white cursor-pointer flex items-center justify-center p-1"
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
        className={`w-full py-3.5 border-none rounded-md text-base font-bold mt-1 transition-all ${
          isSubmitting
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-70'
            : 'bg-[#00c8ff] hover:bg-[#38bdf8] text-[#020824] cursor-pointer hover:shadow-[0_0_15px_rgba(0,200,255,0.4)]'
        }`}
      >
        {isSubmitting ? 'ログイン中...' : 'ログイン'}
      </button>
    </form>
  );
}

