'use client';

import type React from 'react';
import { Icons } from '@/icons';

export interface UploadProgressProps {
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  fileName?: string;
  fileSize?: number;
  error?: string;
  className?: string;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  progress,
  status,
  fileName,
  fileSize,
  error,
  className,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return (
          <div className="animate-spin">
            <Icons.Loader2 size={20} color="#00c8ff" />
          </div>
        );
      case 'success':
        return <Icons.CheckCircle size={20} color="#10b981" />;
      case 'error':
        return <Icons.XCircle size={20} color="#ef4444" />;
      default:
        return <Icons.Upload size={20} color="#8CB4FF" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return `アップロード中... ${Math.round(progress)}%`;
      case 'success':
        return 'アップロード完了';
      case 'error':
        return 'アップロード失敗';
      default:
        return 'アップロード待機中';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      case 'uploading':
        return '#00c8ff';
      default:
        return '#8CB4FF';
    }
  };

  if (status === 'idle') {
    return null;
  }

  return (
    <div
      className={`w-full bg-[#0a0e1a] border border-[#1E3A5F] rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)] ${className || ''}`}
    >
      <div className="flex flex-col gap-3">
        {/* ファイル情報 */}
        {fileName && (
          <div className="flex items-center gap-3">
            <Icons.FileText size={16} color="#8CB4FF" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#b0c4d8] m-0 overflow-hidden text-ellipsis whitespace-nowrap">
                {fileName}
              </p>
              {fileSize && (
                <p className="text-xs text-[#8CB4FF] mt-0.5 mb-0">
                  {(fileSize / 1024).toFixed(2)} KB
                </p>
              )}
            </div>
            {getStatusIcon()}
          </div>
        )}

        {/* プログレスバー */}
        {status === 'uploading' && (
          <div className="flex flex-col gap-2">
            <div
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="w-full h-2 bg-[#1E3A5F] rounded overflow-hidden"
            >
              <div
                className="h-full bg-[#00c8ff] rounded transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[#8CB4FF]">
              <span>{Math.round(progress)}%</span>
              <span>進行中</span>
            </div>
          </div>
        )}

        {/* ステータス表示 */}
        <div
          className="flex items-center gap-2 text-sm"
          style={{ color: getStatusColor() }}
        >
          {getStatusIcon()}
          <span>{getStatusText()}</span>
        </div>

        {/* エラーメッセージ */}
        {status === 'error' && error && (
          <div className="p-3 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] rounded-lg">
            <p className="text-sm text-[#ef4444] m-0">
              {error}
            </p>
          </div>
        )}

        {/* 成功メッセージ */}
        {status === 'success' && (
          <div className="p-3 bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] rounded-lg">
            <p className="text-sm text-[#10b981] m-0">
              ファイルが正常にアップロードされました。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
