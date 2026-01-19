import type React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { vi } from 'vitest';

// テスト用のQueryClientを作成する関数
const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity, // v5での新しい名前（旧cacheTime）
        staleTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

// React Query プロバイダーでラップしたRender関数
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
}

// Helper to create a mock UseQueryResult with all required properties
export function createMockQueryResult<TData, TError = Error>(
  overrides: Partial<UseQueryResult<TData, TError>> & { data?: TData } = {}
): UseQueryResult<TData, TError> {
  const isSuccess = overrides.data !== undefined && !overrides.error;
  const isError = !!overrides.error;
  const isPending = !isSuccess && !isError && overrides.isLoading !== false;

  return {
    data: undefined as TData | undefined,
    error: null as TError | null,
    isError: isError,
    isLoading: overrides.isLoading ?? isPending,
    isLoadingError: false,
    isPending: isPending,
    isRefetchError: false,
    isRefetching: false,
    isSuccess: isSuccess,
    isStale: false,
    dataUpdatedAt: isSuccess ? Date.now() : 0,
    errorUpdatedAt: isError ? Date.now() : 0,
    failureCount: 0,
    failureReason: null,
    errorUpdateCount: 0,
    fetchStatus: 'idle' as const,
    isFetched: isSuccess || isError,
    isFetchedAfterMount: isSuccess || isError,
    isFetching: false,
    isPaused: false,
    isPlaceholderData: false,
    refetch: vi.fn(),
    status: isSuccess ? 'success' : isError ? 'error' : 'pending',
    promise: Promise.resolve(overrides.data as TData),
    ...overrides,
  } as UseQueryResult<TData, TError>;
}

// Helper to create a mock UseMutationResult with all required properties
export function createMockMutationResult<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
>(
  overrides: Partial<UseMutationResult<TData, TError, TVariables, TContext>> = {}
): UseMutationResult<TData, TError, TVariables, TContext> {
  return {
    data: undefined,
    error: null,
    isError: false,
    isIdle: true,
    isPending: false,
    isSuccess: false,
    context: undefined,
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    reset: vi.fn(),
    status: 'idle' as const,
    submittedAt: 0,
    variables: undefined,
    ...overrides,
  } as UseMutationResult<TData, TError, TVariables, TContext>;
}

// re-export everything
export * from '@testing-library/react';
export { renderWithProviders as render };
