/**
 * APIエラーハンドラーのテスト
 */

import { describe, expect, it } from 'vitest';
import { ApiErrorClass } from '@/types/api';
import { processApiError, setFormErrors } from '@/utils/apiErrorHandler';

describe('processApiError', () => {
  it('should handle validation errors (422)', () => {
    const error = new ApiErrorClass(422, {
      message: 'The given data was invalid.',
      errors: {
        email: ['The email has already been taken.'],
        password: ['The password must be at least 8 characters.'],
      },
    });

    const result = processApiError(error);

    expect(result.isValidationError).toBe(true);
    expect(result.message).toBe('入力されたデータが無効です。');
    expect(result.fieldErrors).toEqual({
      email: 'このメールアドレスは既に使用されています。',
      password: 'パスワードは8文字以上で入力してください。',
    });
  });

  it('should handle authentication errors (401)', () => {
    const error = new ApiErrorClass(401, {
      message: 'Unauthorized',
    });

    const result = processApiError(error);

    expect(result.isAuthError).toBe(true);
    expect(result.message).toBe(
      'メールアドレスまたはパスワードが正しくありません。'
    );
    expect(result.fieldErrors).toEqual({});
  });

  it('should handle server errors (500)', () => {
    const error = new ApiErrorClass(500, {
      message: 'Internal Server Error',
    });

    const result = processApiError(error);

    expect(result.isServerError).toBe(true);
    expect(result.message).toBe(
      'サーバーで問題が発生しました。しばらくしてから再試行してください。'
    );
  });

  it('should handle network errors', () => {
    const error = null;

    const result = processApiError(error);

    expect(result.isNetworkError).toBe(true);
    expect(result.message).toBe(
      '接続に問題があります。しばらくしてから再試行してください。'
    );
  });

  it('should translate Hono backend error messages correctly', () => {
    const error = new ApiErrorClass(422, {
      message: 'The given data was invalid.',
      errors: {
        email: ['Email already exists'],
      },
    });

    const result = processApiError(error);

    expect(result.fieldErrors.email).toBe(
      'このメールアドレスは既に使用されています。'
    );
  });
});

describe('setFormErrors', () => {
  it('should set form errors correctly', () => {
    const mockSetError = vi.fn();
    const fieldErrors = {
      email: 'このメールアドレスは既に使用されています。',
      password: 'パスワードは8文字以上で入力してください。',
    };

    setFormErrors(mockSetError, fieldErrors);

    expect(mockSetError).toHaveBeenCalledWith('email', {
      message: 'このメールアドレスは既に使用されています。',
    });
    expect(mockSetError).toHaveBeenCalledWith('password', {
      message: 'パスワードは8文字以上で入力してください。',
    });
    expect(mockSetError).toHaveBeenCalledTimes(2);
  });
});
