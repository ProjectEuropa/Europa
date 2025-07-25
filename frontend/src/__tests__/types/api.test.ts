import { describe, it, expect } from 'vitest';
import { ApiErrorClass } from '@/types/api';

describe('ApiErrorClass', () => {
  it('should create error with status and message', () => {
    const error = new ApiErrorClass(404, { message: 'Not found' });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiErrorClass);
    expect(error.status).toBe(404);
    expect(error.message).toBe('Not found');
    expect(error.name).toBe('ApiError');
  });

  it('should create error with default message when not provided', () => {
    const error = new ApiErrorClass(500, {});

    expect(error.message).toBe('API Error: 500');
  });

  it('should store errors data', () => {
    const errorData = {
      message: 'Validation failed',
      errors: {
        email: ['Email is required'],
        password: ['Password must be at least 8 characters'],
      },
    };

    const error = new ApiErrorClass(422, errorData);

    expect(error.errors).toEqual(errorData.errors);
    expect(error.data).toEqual(errorData);
  });

  describe('status check methods', () => {
    it('should correctly identify status codes', () => {
      const error401 = new ApiErrorClass(401, { message: 'Unauthorized' });
      const error403 = new ApiErrorClass(403, { message: 'Forbidden' });
      const error404 = new ApiErrorClass(404, { message: 'Not found' });
      const error422 = new ApiErrorClass(422, {
        message: 'Validation error',
        errors: { field: ['error'] }
      });
      const error500 = new ApiErrorClass(500, { message: 'Server error' });

      expect(error401.is(401)).toBe(true);
      expect(error401.is(404)).toBe(false);

      expect(error401.isAuthError()).toBe(true);
      expect(error403.isAuthError()).toBe(false);

      expect(error403.isPermissionError()).toBe(true);
      expect(error401.isPermissionError()).toBe(false);

      expect(error404.isNotFoundError()).toBe(true);
      expect(error401.isNotFoundError()).toBe(false);

      expect(error422.isValidationError()).toBe(true);
      expect(error404.isValidationError()).toBe(false);

      expect(error500.isServerError()).toBe(true);
      expect(error404.isServerError()).toBe(false);
    });

    it('should handle validation error without errors field', () => {
      const error = new ApiErrorClass(422, { message: 'Validation error' });

      expect(error.isValidationError()).toBe(false);
    });

    it('should identify server errors correctly', () => {
      const error500 = new ApiErrorClass(500, { message: 'Internal server error' });
      const error502 = new ApiErrorClass(502, { message: 'Bad gateway' });
      const error503 = new ApiErrorClass(503, { message: 'Service unavailable' });

      expect(error500.isServerError()).toBe(true);
      expect(error502.isServerError()).toBe(true);
      expect(error503.isServerError()).toBe(true);
    });
  });

  it('should have proper error stack trace', () => {
    const error = new ApiErrorClass(404, { message: 'Not found' });

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('ApiError');
  });
});
