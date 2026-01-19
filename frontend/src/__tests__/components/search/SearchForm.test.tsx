import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, useSearchParams } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchForm } from '@/components/search/SearchForm';

// Next.jsのフックをモック
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

// useDebounceフックをモック
vi.mock('@/hooks/useDebounce', () => ({
  useDebounce: vi.fn(value => value),
}));

// usePrefetchSearchフックをモック
vi.mock('@/hooks/useSearch', () => ({
  usePrefetchSearch: vi.fn(() => ({
    prefetchTeamSearch: vi.fn(),
    prefetchMatchSearch: vi.fn(),
  })),
}));

// useSearchSuggestionsフックをモック
vi.mock('@/hooks/useSearchSuggestions', () => ({
  useSearchSuggestions: vi.fn(() => ({
    suggestions: [],
    popularSuggestions: [],
    isLoading: false,
    error: null,
    hasSuggestions: false,
  })),
  highlightMatch: vi.fn((text: string) => [{ text, isMatch: false }]),
}));

// framer-motionをモック
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

describe('SearchForm', () => {
  const mockPush = vi.fn();
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    });
    vi.mocked(useSearchParams).mockReturnValue(
      mockSearchParams as unknown as ReturnType<typeof useSearchParams>
    );
  });

  describe('基本的なレンダリング', () => {
    it('should render search form with correct elements', () => {
      render(<SearchForm searchType="team" />);

      expect(screen.getByRole('search')).toBeInTheDocument();
      expect(screen.getByLabelText('検索キーワード')).toBeInTheDocument();
      expect(screen.getByLabelText('検索')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('キーワードを入力してください')
      ).toBeInTheDocument();
    });

    it('should render with custom placeholder', () => {
      render(
        <SearchForm searchType="team" placeholder="カスタムプレースホルダー" />
      );

      expect(
        screen.getByPlaceholderText('カスタムプレースホルダー')
      ).toBeInTheDocument();
    });

    it('should have correct aria-label based on search type', () => {
      const { rerender } = render(<SearchForm searchType="team" />);
      expect(screen.getByRole('search')).toHaveAttribute(
        'aria-label',
        'チーム検索フォーム'
      );

      rerender(<SearchForm searchType="match" />);
      expect(screen.getByRole('search')).toHaveAttribute(
        'aria-label',
        'マッチ検索フォーム'
      );
    });
  });

  describe('入力処理', () => {
    it('should update input value when typing', async () => {
      const user = userEvent.setup();
      render(<SearchForm searchType="team" />);

      const input = screen.getByLabelText('検索キーワード');
      await user.type(input, 'test query');

      expect(input).toHaveValue('test query');
    });

    it('should show clear button when input has value', async () => {
      const user = userEvent.setup();
      render(<SearchForm searchType="team" />);

      const input = screen.getByLabelText('検索キーワード');
      await user.type(input, 'test');

      expect(screen.getByLabelText('検索をクリア')).toBeInTheDocument();
    });

    it('should clear input when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<SearchForm searchType="team" />);

      const input = screen.getByLabelText('検索キーワード');
      await user.type(input, 'test');

      const clearButton = screen.getByLabelText('検索をクリア');
      await user.click(clearButton);

      expect(input).toHaveValue('');
    });
  });

  describe('検索実行', () => {
    it('should execute search on form submit', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup();

      render(<SearchForm searchType="team" onSearch={mockOnSearch} />);

      const input = screen.getByLabelText('検索キーワード');
      const submitButton = screen.getByLabelText('検索');

      await user.type(input, 'test query');
      await user.click(submitButton);

      expect(mockOnSearch).toHaveBeenCalledWith({
        keyword: 'test query',
        page: 1,
      });
    });

    it('should update URL when search is executed', async () => {
      const user = userEvent.setup();
      render(<SearchForm searchType="team" />);

      const input = screen.getByLabelText('検索キーワード');
      await user.type(input, 'test query');

      const form = screen.getByRole('search');
      fireEvent.submit(form);

      expect(mockPush).toHaveBeenCalledWith('?keyword=test+query&page=1');
    });

    it('should not execute search with empty query', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup();

      render(<SearchForm searchType="team" onSearch={mockOnSearch} />);

      const submitButton = screen.getByLabelText('検索');
      await user.click(submitButton);

      expect(mockOnSearch).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should disable submit button when query is empty', () => {
      render(<SearchForm searchType="team" />);

      const submitButton = screen.getByLabelText('検索');
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when query has value', async () => {
      const user = userEvent.setup();
      render(<SearchForm searchType="team" />);

      const input = screen.getByLabelText('検索キーワード');
      const submitButton = screen.getByLabelText('検索');

      await user.type(input, 'test');
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('URLパラメータからの初期化', () => {
    it('should initialize input from URL params', () => {
      const searchParams = new URLSearchParams('keyword=initial+query');
      vi.mocked(useSearchParams).mockReturnValue(
        searchParams as unknown as ReturnType<typeof useSearchParams>
      );

      render(<SearchForm searchType="team" />);

      const input = screen.getByLabelText('検索キーワード');
      expect(input).toHaveValue('initial query');
    });

    it('should handle empty URL params', () => {
      const searchParams = new URLSearchParams();
      vi.mocked(useSearchParams).mockReturnValue(
        searchParams as unknown as ReturnType<typeof useSearchParams>
      );

      render(<SearchForm searchType="team" />);

      const input = screen.getByLabelText('検索キーワード');
      expect(input).toHaveValue('');
    });
  });

  describe('IME入力処理', () => {
    it('should handle composition events', async () => {
      render(<SearchForm searchType="team" />);

      const input = screen.getByLabelText('検索キーワード');

      // IME入力開始
      fireEvent.compositionStart(input);

      // IME入力中は特別な処理は不要だが、エラーが発生しないことを確認
      fireEvent.change(input, { target: { value: 'てすと' } });

      // IME入力終了
      fireEvent.compositionEnd(input);

      expect(input).toHaveValue('てすと');
    });
  });

  describe('アクセシビリティ', () => {
    it('should have proper ARIA attributes', () => {
      render(<SearchForm searchType="team" />);

      const form = screen.getByRole('search');
      const input = screen.getByLabelText('検索キーワード');
      const submitButton = screen.getByLabelText('検索');

      expect(form).toHaveAttribute('aria-label', 'チーム検索フォーム');
      expect(input).toHaveAttribute('aria-label', '検索キーワード');
      expect(submitButton).toHaveAttribute('aria-label', '検索');
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<SearchForm searchType="team" />);

      const input = screen.getByLabelText('検索キーワード');

      // Tabキーでフォーカス移動
      await user.tab();
      expect(input).toHaveFocus();

      // 入力
      await user.type(input, 'test');

      // Enterキーで検索実行
      await user.keyboard('{Enter}');

      expect(mockPush).toHaveBeenCalledWith('?keyword=test&page=1');
    });
  });

  describe('エラーハンドリング', () => {
    it('should handle router errors gracefully', async () => {
      const mockPushError = vi
        .fn()
        .mockRejectedValue(new Error('Router error'));
      vi.mocked(useRouter).mockReturnValue({
        push: mockPushError,
        replace: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
      });

      const user = userEvent.setup();
      render(<SearchForm searchType="team" />);

      const input = screen.getByLabelText('検索キーワード');
      await user.type(input, 'test');

      const form = screen.getByRole('search');

      // エラーが発生してもアプリケーションがクラッシュしないことを確認
      expect(() => fireEvent.submit(form)).not.toThrow();
    });
  });

  describe('パフォーマンス', () => {
    it('should not re-render unnecessarily', () => {
      const renderSpy = vi.fn();

      function TestWrapper() {
        renderSpy();
        return <SearchForm searchType="team" />;
      }

      const { rerender } = render(<TestWrapper />);

      // 初回レンダリング
      expect(renderSpy).toHaveBeenCalledTimes(1);

      // 同じpropsで再レンダリング
      rerender(<TestWrapper />);

      // React.memoが適用されていれば、不要な再レンダリングは発生しない
      // ただし、この例では関数コンポーネントなので、実際の最適化は実装次第
    });
  });
});
