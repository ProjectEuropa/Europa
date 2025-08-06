import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSumDownloadManager } from '@/hooks/useSumDownloadManager';

// window.URL.createObjectURLをモック
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: vi.fn(() => 'mock-blob-url'),
    revokeObjectURL: vi.fn(),
  },
});

// window.openをモック
Object.defineProperty(window, 'open', {
  value: vi.fn(),
});

describe('useSumDownloadManager', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(
      () => useSumDownloadManager({ searchType: 'team' }),
      { 
        wrapper: ({ children }) => {
          const queryClient = new QueryClient({
            defaultOptions: {
              queries: { retry: false, gcTime: Infinity },
              mutations: { retry: false },
            },
          });
          return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
        }
      }
    );

    expect(result.current.data).toEqual([]);
    expect(result.current.selectedIds).toEqual([]);
    expect(result.current.selectedCount).toBe(0);
    expect(result.current.isSearchLoading).toBe(true);
    expect(result.current.isDownloading).toBe(false);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.searchQuery).toBe('');
  });

  it('should handle selection changes', () => {
    const { result } = renderHook(
      () => useSumDownloadManager({ searchType: 'team' }),
      { 
        wrapper: ({ children }) => {
          const queryClient = new QueryClient({
            defaultOptions: {
              queries: { retry: false, gcTime: Infinity },
              mutations: { retry: false },
            },
          });
          return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
        }
      }
    );

    act(() => {
      result.current.handleSelectionChange([1, 2, 3]);
    });

    expect(result.current.selectedIds).toEqual([1, 2, 3]);
    expect(result.current.selectedCount).toBe(3);

    act(() => {
      result.current.handleSelectionChange([]);
    });

    expect(result.current.selectedIds).toEqual([]);
    expect(result.current.selectedCount).toBe(0);
  });
});