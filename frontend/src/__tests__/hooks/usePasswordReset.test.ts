import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePasswordReset } from '@/hooks/usePasswordReset';
import { authApi } from '@/lib/api/auth';
import { useToast } from '@/hooks/useToast';

// モック
vi.mock('@/lib/api/auth');
vi.mock('@/hooks/useToast');
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockToast = vi.fn();

describe('usePasswordReset', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
    });
  });

  describe('sendResetLink', () => {
    it('should send reset link successfully', async () => {
      const mockResponse = { status: 'success' }; // errorプロパティがない場合は成功
      vi.mocked(authApi.sendPasswordResetLink).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => usePasswordReset());

      let response: any;
      await act(async () => {
        response = await result.current.sendResetLink({ email: 'test@example.com' });
      });

      expect(authApi.sendPasswordResetLink).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockToast).toHaveBeenCalledWith({
        type: 'success',
        title: 'リセット用メール送信完了',
        message: 'test@example.com 宛にパスワードリセット用のリンクを送信しました。',
      });
      expect(response).toEqual({ success: true });
    });

    it('should handle send reset link error', async () => {
      const mockResponse = { error: 'User not found' };
      vi.mocked(authApi.sendPasswordResetLink).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => usePasswordReset());

      let response: any;
      await act(async () => {
        response = await result.current.sendResetLink({ email: 'test@example.com' });
      });

      expect(mockToast).toHaveBeenCalledWith({
        type: 'error',
        title: 'メール送信エラー',
        message: 'User not found',
      });
      expect(response).toEqual({ success: false, error: 'User not found' });
    });
  });

  describe('checkToken', () => {
    it('should return valid token result', async () => {
      const mockResponse = { valid: true };
      vi.mocked(authApi.checkResetPasswordToken).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => usePasswordReset());

      let response: any;
      await act(async () => {
        response = await result.current.checkToken({ token: 'valid-token', email: 'test@example.com' });
      });

      expect(authApi.checkResetPasswordToken).toHaveBeenCalledWith({
        token: 'valid-token',
        email: 'test@example.com'
      });
      expect(response).toEqual({ isValid: true, message: undefined });
    });

    it('should handle invalid token', async () => {
      const mockResponse = { valid: false, message: 'Invalid token' };
      vi.mocked(authApi.checkResetPasswordToken).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => usePasswordReset());

      let response: any;
      await act(async () => {
        response = await result.current.checkToken({ token: 'invalid-token', email: 'test@example.com' });
      });

      expect(response).toEqual({ isValid: false, message: 'Invalid token' });
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const mockResponse = { message: 'Password reset successfully' };
      vi.mocked(authApi.resetPassword).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => usePasswordReset());

      const resetData = {
        token: 'reset-token',
        email: 'test@example.com',
        password: 'newpassword123',
        passwordConfirmation: 'newpassword123',
      };

      let response: any;
      await act(async () => {
        response = await result.current.resetPassword(resetData);
      });

      expect(authApi.resetPassword).toHaveBeenCalledWith(resetData);
      expect(mockToast).toHaveBeenCalledWith({
        type: 'success',
        title: 'パスワード変更完了',
        message: 'パスワードが正常に変更されました。新しいパスワードでログインできます。',
      });
      expect(response).toEqual({ success: true });
    });

    it('should handle reset password error', async () => {
      const mockResponse = { error: 'Reset failed' };
      vi.mocked(authApi.resetPassword).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => usePasswordReset());

      const resetData = {
        token: 'invalid-token',
        email: 'test@example.com',
        password: 'newpassword123',
        passwordConfirmation: 'newpassword123',
      };

      let response: any;
      await act(async () => {
        response = await result.current.resetPassword(resetData);
      });

      expect(mockToast).toHaveBeenCalledWith({
        type: 'error',
        title: 'パスワードリセットエラー',
        message: 'Reset failed',
      });
      expect(response).toEqual({ success: false, error: 'Reset failed' });
    });
  });

  describe('loading state', () => {
    it('should manage loading state correctly', async () => {
      let resolvePromise: (value: any) => void;
      const mockPromise = new Promise(resolve => {
        resolvePromise = resolve;
      });

      vi.mocked(authApi.sendPasswordResetLink).mockReturnValue(mockPromise);

      const { result } = renderHook(() => usePasswordReset());

      expect(result.current.isLoading).toBe(false);

      act(() => {
        result.current.sendResetLink({ email: 'test@example.com' });
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolvePromise!({ status: 'success' }); // errorプロパティがない場合は成功
        await mockPromise;
      });

      expect(result.current.isLoading).toBe(false);
    });
  });
});
