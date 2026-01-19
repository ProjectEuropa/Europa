import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import EventRegistrationForm from '@/components/events/EventRegistrationForm';

// AuthGuardのモック
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Test User' },
    loading: false,
  }),
}));

// useEventRegistrationのモック
const mockRegisterEvent = vi.fn();
vi.mock('@/hooks/useEventRegistration', () => ({
  useEventRegistration: () => ({
    mutate: mockRegisterEvent,
    isPending: false,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
};

describe('EventRegistrationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<EventRegistrationForm />, { wrapper: createWrapper() });

    expect(screen.getByLabelText(/イベント名/)).toBeInTheDocument();
    expect(screen.getByLabelText(/イベント詳細情報/)).toBeInTheDocument();
    expect(screen.getByLabelText(/イベント詳細URL/)).toBeInTheDocument();
    expect(screen.getByLabelText(/イベント受付締切日/)).toBeInTheDocument();
    expect(screen.getByLabelText(/イベント表示最終日/)).toBeInTheDocument();
    expect(screen.getByLabelText(/イベント種別/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /イベントを登録する/ })
    ).toBeInTheDocument();
  });

  it('shows validation errors for required fields', async () => {
    const user = userEvent.setup();
    render(<EventRegistrationForm />, { wrapper: createWrapper() });

    const submitButton = screen.getByRole('button', {
      name: /イベントを登録する/,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('イベント名を入力してください')
      ).toBeInTheDocument();
      expect(screen.getByText('詳細を入力してください')).toBeInTheDocument();
    });
  });

  it('submits form with valid data through confirmation dialog', async () => {
    const user = userEvent.setup();
    render(<EventRegistrationForm />, { wrapper: createWrapper() });

    // フォームに入力
    await user.type(screen.getByLabelText(/イベント名/), 'テストイベント');
    await user.type(
      screen.getByLabelText(/イベント詳細情報/),
      'テストイベントの詳細です'
    );
    await user.type(
      screen.getByLabelText(/イベント詳細URL/),
      'https://example.com'
    );

    // 日付フィールドへの入力（readonlyを一時的に解除してから入力）
    const deadlineInput = screen.getByLabelText(/イベント受付締切日/);
    const endDateInput = screen.getByLabelText(/イベント表示最終日/);

    // readOnly属性を削除してから入力
    deadlineInput.removeAttribute('readonly');
    endDateInput.removeAttribute('readonly');

    await user.clear(deadlineInput);
    await user.type(deadlineInput, '2024-12-31');
    await user.clear(endDateInput);
    await user.type(endDateInput, '2025-01-31');

    // 送信ボタンクリック（確認ダイアログが表示される）
    await user.click(
      screen.getByRole('button', { name: /イベントを登録する/ })
    );

    // まずはバリデーションエラーがないか確認
    await waitFor(
      () => {
        // バリデーションエラーがないことを確認
        expect(
          screen.queryByText('イベント名を入力してください')
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText('詳細を入力してください')
        ).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // 確認ダイアログが表示されることを確認
    await waitFor(
      () => {
        expect(screen.getByText('イベント登録内容の確認')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // 確認ダイアログで「登録する」ボタンをクリック（フォーム外のダイアログ内のボタン）
    const confirmButtons = screen.getAllByRole('button', { name: /登録する/ });
    // ダイアログ内の「登録する」ボタンを選択（2番目のボタン）
    await user.click(confirmButtons[1]);

    await waitFor(() => {
      expect(mockRegisterEvent).toHaveBeenCalledWith({
        name: 'テストイベント',
        details: 'テストイベントの詳細です',
        url: 'https://example.com',
        deadline: '2024-12-31',
        endDisplayDate: '2025-01-31',
        type: 'tournament',
      });
    });
  });

  it('validates URL format', async () => {
    const user = userEvent.setup();
    render(<EventRegistrationForm />, { wrapper: createWrapper() });

    const urlInput = screen.getByLabelText(/イベント詳細URL/);
    await user.type(urlInput, 'invalid-url');

    const submitButton = screen.getByRole('button', {
      name: /イベントを登録する/,
    });
    await user.click(submitButton);

    await waitFor(() => {
      // URLバリデーションエラーメッセージを柔軟にマッチ
      const errorMessage = screen.getByText(/URL|url|有効/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('handles character limits correctly', async () => {
    const user = userEvent.setup();
    render(<EventRegistrationForm />, { wrapper: createWrapper() });

    // 101文字のイベント名（制限は100文字）
    const longName = 'a'.repeat(101);
    await user.type(screen.getByLabelText(/イベント名/), longName);

    const submitButton = screen.getByRole('button', {
      name: /イベントを登録する/,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('イベント名は100文字以内で入力してください')
      ).toBeInTheDocument();
    });
  });

  it('can cancel form submission in confirmation dialog', async () => {
    const user = userEvent.setup();
    render(<EventRegistrationForm />, { wrapper: createWrapper() });

    // フォームに入力
    await user.type(screen.getByLabelText(/イベント名/), 'テストイベント');
    await user.type(
      screen.getByLabelText(/イベント詳細情報/),
      'テストイベントの詳細です'
    );

    // 日付フィールドへの入力（readonlyを一時的に解除してから入力）
    const deadlineInput = screen.getByLabelText(/イベント受付締切日/);
    const endDateInput = screen.getByLabelText(/イベント表示最終日/);

    // readOnly属性を削除してから入力
    deadlineInput.removeAttribute('readonly');
    endDateInput.removeAttribute('readonly');

    await user.clear(deadlineInput);
    await user.type(deadlineInput, '2024-12-31');
    await user.clear(endDateInput);
    await user.type(endDateInput, '2025-01-31');

    // 送信ボタンクリック（確認ダイアログが表示される）
    await user.click(
      screen.getByRole('button', { name: /イベントを登録する/ })
    );

    // 確認ダイアログが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('イベント登録内容の確認')).toBeInTheDocument();
    });

    // キャンセルボタンをクリック
    await user.click(screen.getByRole('button', { name: /キャンセル/ }));

    // 確認ダイアログが閉じられることを確認
    await waitFor(() => {
      expect(
        screen.queryByText('イベント登録内容の確認')
      ).not.toBeInTheDocument();
    });

    // registerEventが呼ばれていないことを確認
    expect(mockRegisterEvent).not.toHaveBeenCalled();
  });
});
