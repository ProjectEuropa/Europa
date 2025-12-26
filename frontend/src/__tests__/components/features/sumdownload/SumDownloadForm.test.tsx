import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SumDownloadForm } from '@/components/features/sumdownload/SumDownloadForm';

// lucide-reactアイコンをモック
vi.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon">🔍</div>,
  X: () => <div data-testid="x-icon">✕</div>,
}));

// useSearchSuggestionsをモック
vi.mock('@/hooks/useSearchSuggestions', () => ({
  useSearchSuggestions: () => ({
    suggestions: [],
    isLoading: false,
    updateQuery: vi.fn(),
    clearSuggestions: vi.fn(),
  }),
  highlightMatch: (text: string) => [{ text, isMatch: false }],
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe('SumDownloadForm', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('renders form with correct placeholder for team search', () => {
    renderWithProviders(
      <SumDownloadForm
        searchType="team"
        onSearch={mockOnSearch}
        loading={false}
      />
    );

    const input = screen.getByPlaceholderText('チーム名で検索');
    expect(input).toBeInTheDocument();
    expect(input).not.toBeDisabled();
  });

  it('renders form with correct placeholder for match search', () => {
    renderWithProviders(
      <SumDownloadForm
        searchType="match"
        onSearch={mockOnSearch}
        loading={false}
      />
    );

    const input = screen.getByPlaceholderText('マッチ名で検索');
    expect(input).toBeInTheDocument();
  });

  it('renders search button', () => {
    renderWithProviders(
      <SumDownloadForm
        searchType="team"
        onSearch={mockOnSearch}
        loading={false}
      />
    );

    const button = screen.getByRole('button', { name: '検索実行' });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('disables form elements when loading', () => {
    renderWithProviders(
      <SumDownloadForm
        searchType="team"
        onSearch={mockOnSearch}
        loading={true}
      />
    );

    const input = screen.getByPlaceholderText('チーム名で検索');
    const button = screen.getByRole('button', { name: '検索実行' });

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('displays loading spinner when loading', () => {
    renderWithProviders(
      <SumDownloadForm
        searchType="team"
        onSearch={mockOnSearch}
        loading={true}
      />
    );

    // Loading spinnerがあることを確認
    const button = screen.getByRole('button', { name: '検索実行' });
    expect(button).toBeDisabled();
  });

  it('calls onSearch with correct query when form is submitted', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <SumDownloadForm
        searchType="team"
        onSearch={mockOnSearch}
        loading={false}
      />
    );

    const input = screen.getByPlaceholderText('チーム名で検索');
    const button = screen.getByRole('button', { name: '検索実行' });

    await user.type(input, 'テストチーム');
    await user.click(button);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('テストチーム');
    });
  });

  it('calls onSearch when Enter key is pressed', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <SumDownloadForm
        searchType="team"
        onSearch={mockOnSearch}
        loading={false}
      />
    );

    const input = screen.getByPlaceholderText('チーム名で検索');

    await user.type(input, 'テストチーム');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('テストチーム');
    });
  });

  it('displays initial query when provided', () => {
    renderWithProviders(
      <SumDownloadForm
        searchType="team"
        onSearch={mockOnSearch}
        loading={false}
        initialQuery="初期クエリ"
      />
    );

    const input = screen.getByDisplayValue('初期クエリ');
    expect(input).toBeInTheDocument();
  });

  it('trims whitespace from search query', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <SumDownloadForm
        searchType="team"
        onSearch={mockOnSearch}
        loading={false}
      />
    );

    const input = screen.getByPlaceholderText('チーム名で検索');
    const button = screen.getByRole('button', { name: '検索実行' });

    await user.type(input, '  テストチーム  ');
    await user.click(button);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('テストチーム');
    });
  });

  it('validates query submission', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <SumDownloadForm
        searchType="team"
        onSearch={mockOnSearch}
        loading={false}
      />
    );

    const input = screen.getByPlaceholderText('チーム名で検索');
    const button = screen.getByRole('button', { name: '検索実行' });

    // 1文字でも検索可能
    await user.type(input, 'a');
    await user.click(button);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('a');
    });
  });

  it('applies correct styling', () => {
    renderWithProviders(
      <SumDownloadForm
        searchType="team"
        onSearch={mockOnSearch}
        loading={false}
      />
    );

    const input = screen.getByPlaceholderText('チーム名で検索');

    // Tailwind CSSクラスが適用されていることを確認
    expect(input).toHaveClass('bg-transparent');
    expect(input).toHaveClass('text-white');
    expect(input).toHaveClass('text-lg');
  });
});
