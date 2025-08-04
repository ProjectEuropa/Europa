import { describe, expect, it } from 'vitest';

describe('Providers Index', () => {
  it('should export ToastProvider', async () => {
    const providersModule = await import('@/providers/index');

    expect(providersModule).toHaveProperty('ToastProvider');
    expect(typeof providersModule.ToastProvider).toBe('function');
  });

  it('should re-export all toast-provider exports', async () => {
    const indexModule = await import('@/providers/index');
    const toastProviderModule = await import('@/providers/toast-provider');

    // ToastProviderがre-exportされていることを確認
    expect(indexModule.ToastProvider).toBe(toastProviderModule.ToastProvider);
  });

  it('should have proper module structure', async () => {
    const providersModule = await import('@/providers/index');

    // エクスポートされたオブジェクトが存在することを確認
    expect(providersModule).toBeDefined();
    expect(typeof providersModule).toBe('object');
  });
});
