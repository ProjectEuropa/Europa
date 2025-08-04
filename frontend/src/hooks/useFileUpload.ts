import { useCallback, useState } from 'react';
import { filesApi } from '@/lib/api/files';
import type { FileUploadOptions } from '@/types/file';

export interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface UseFileUploadOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
  onProgress?: (progress: number) => void;
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    status: 'idle',
  });

  const _updateProgress = useCallback(
    (progress: number) => {
      setUploadProgress(prev => ({
        ...prev,
        progress,
        status: 'uploading',
      }));
      options.onProgress?.(progress);
    },
    [options]
  );

  const uploadTeamFile = useCallback(
    async (
      file: File,
      isAuthenticated: boolean,
      uploadOptions: FileUploadOptions
    ) => {
      try {
        setUploadProgress({ progress: 0, status: 'uploading' });

        // プログレス更新のシミュレーション
        // 実際のAPIでプログレス情報が取得できる場合は、そちらを使用
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev.progress >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return { ...prev, progress: prev.progress + 10 };
          });
        }, 200);

        const result = await filesApi.uploadTeamFile(
          file,
          isAuthenticated,
          uploadOptions
        );

        clearInterval(progressInterval);
        setUploadProgress({ progress: 100, status: 'success' });
        options.onSuccess?.();

        return result;
      } catch (error) {
        setUploadProgress({
          progress: 0,
          status: 'error',
          error:
            error instanceof Error
              ? error.message
              : 'アップロードに失敗しました',
        });
        options.onError?.(error);
        throw error;
      }
    },
    [options]
  );

  const uploadMatchFile = useCallback(
    async (
      file: File,
      isAuthenticated: boolean,
      uploadOptions: FileUploadOptions
    ) => {
      try {
        setUploadProgress({ progress: 0, status: 'uploading' });

        // プログレス更新のシミュレーション
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev.progress >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return { ...prev, progress: prev.progress + 10 };
          });
        }, 200);

        const result = await filesApi.uploadMatchFile(
          file,
          isAuthenticated,
          uploadOptions
        );

        clearInterval(progressInterval);
        setUploadProgress({ progress: 100, status: 'success' });
        options.onSuccess?.();

        return result;
      } catch (error) {
        setUploadProgress({
          progress: 0,
          status: 'error',
          error:
            error instanceof Error
              ? error.message
              : 'アップロードに失敗しました',
        });
        options.onError?.(error);
        throw error;
      }
    },
    [options]
  );

  const resetUpload = useCallback(() => {
    setUploadProgress({ progress: 0, status: 'idle' });
  }, []);

  return {
    uploadProgress,
    uploadTeamFile,
    uploadMatchFile,
    resetUpload,
    isUploading: uploadProgress.status === 'uploading',
  };
};
