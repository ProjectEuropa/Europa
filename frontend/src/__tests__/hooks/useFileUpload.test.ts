import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useFileUpload } from '@/hooks/useFileUpload';

// モック
vi.mock('@/lib/api/files', () => ({
  filesApi: {
    uploadTeamFile: vi.fn(),
    uploadMatchFile: vi.fn(),
  },
}));

// モック関数の参照を取得
import { filesApi } from '@/lib/api/files';

const mockUploadTeamFile = vi.mocked(filesApi.uploadTeamFile);
const mockUploadMatchFile = vi.mocked(filesApi.uploadMatchFile);

describe('useFileUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with idle status', () => {
    const { result } = renderHook(() => useFileUpload());

    expect(result.current.uploadProgress).toEqual({
      progress: 0,
      status: 'idle',
    });
    expect(result.current.isUploading).toBe(false);
  });

  it('should handle successful team file upload', async () => {
    const mockOnSuccess = vi.fn();

    mockUploadTeamFile.mockResolvedValue({ success: true });

    const { result } = renderHook(() =>
      useFileUpload({ onSuccess: mockOnSuccess })
    );

    const file = new File(['test'], 'test.che');
    const options = { ownerName: 'test', comment: '', tags: [] };

    await act(async () => {
      await result.current.uploadTeamFile(file, false, options);
    });

    expect(result.current.uploadProgress.status).toBe('success');
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(mockUploadTeamFile).toHaveBeenCalledWith(file, false, options);
  });

  it('should handle successful match file upload', async () => {
    const mockOnSuccess = vi.fn();

    mockUploadMatchFile.mockResolvedValue({ success: true });

    const { result } = renderHook(() =>
      useFileUpload({ onSuccess: mockOnSuccess })
    );

    const file = new File(['test'], 'test.che');
    const options = { ownerName: 'test', comment: '', tags: [] };

    await act(async () => {
      await result.current.uploadMatchFile(file, true, options);
    });

    expect(result.current.uploadProgress.status).toBe('success');
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(mockUploadMatchFile).toHaveBeenCalledWith(file, true, options);
  });

  it('should handle upload error', async () => {
    const mockOnError = vi.fn();
    const error = new Error('Upload failed');

    mockUploadTeamFile.mockRejectedValue(error);

    const { result } = renderHook(() =>
      useFileUpload({ onError: mockOnError })
    );

    const file = new File(['test'], 'test.che');
    const options = { ownerName: 'test', comment: '', tags: [] };

    await act(async () => {
      try {
        await result.current.uploadTeamFile(file, false, options);
      } catch (e) {
        // エラーは期待される
      }
    });

    expect(result.current.uploadProgress.status).toBe('error');
    expect(result.current.uploadProgress.error).toBe('Upload failed');
    expect(mockOnError).toHaveBeenCalledWith(error);
  });

  it('should reset upload state', () => {
    const { result } = renderHook(() => useFileUpload());

    // リセット
    act(() => {
      result.current.resetUpload();
    });

    expect(result.current.uploadProgress).toEqual({
      progress: 0,
      status: 'idle',
    });
    expect(result.current.isUploading).toBe(false);
  });

  it('should not call callbacks when not provided', async () => {
    mockUploadTeamFile.mockResolvedValue({ success: true });

    const { result } = renderHook(() => useFileUpload());

    const file = new File(['test'], 'test.che');
    const options = { ownerName: 'test', comment: '', tags: [] };

    // コールバックが提供されていなくてもエラーにならない
    await act(async () => {
      await result.current.uploadTeamFile(file, false, options);
    });

    expect(result.current.uploadProgress.status).toBe('success');
  });
});
