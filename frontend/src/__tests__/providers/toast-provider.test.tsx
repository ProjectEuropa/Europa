import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ToastProvider } from '@/providers/toast-provider';

describe('ToastProvider', () => {
  it('should render Toaster component', () => {
    const { container } = render(<ToastProvider />);

    // Toasterコンポーネントがレンダリングされることを確認
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    expect(() => render(<ToastProvider />)).not.toThrow();
  });
});
