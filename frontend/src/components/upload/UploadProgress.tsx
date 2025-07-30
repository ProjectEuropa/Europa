'use client';

import React from 'react';
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
          <div style={{ animation: 'spin 1s linear infinite' }}>
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
      className={className}
      style={{
        width: '100%',
        background: '#0a0e1a',
        border: '1px solid #1E3A5F',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* ファイル情報 */}
        {fileName && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Icons.FileText size={16} color="#8CB4FF" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#b0c4d8',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {fileName}
              </p>
              {fileSize && (
                <p
                  style={{
                    fontSize: '12px',
                    color: '#8CB4FF',
                    margin: '2px 0 0 0',
                  }}
                >
                  {(fileSize / 1024).toFixed(2)} KB
                </p>
              )}
            </div>
            {getStatusIcon()}
          </div>
        )}

        {/* プログレスバー */}
        {status === 'uploading' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{
                width: '100%',
                height: '8px',
                background: '#1E3A5F',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: '#00c8ff',
                  borderRadius: '4px',
                  width: `${progress}%`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#8CB4FF',
              }}
            >
              <span>{Math.round(progress)}%</span>
              <span>進行中</span>
            </div>
          </div>
        )}

        {/* ステータス表示 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: getStatusColor(),
          }}
        >
          {getStatusIcon()}
          <span>{getStatusText()}</span>
        </div>

        {/* エラーメッセージ */}
        {status === 'error' && error && (
          <div
            style={{
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '8px',
            }}
          >
            <p style={{ fontSize: '14px', color: '#ef4444', margin: 0 }}>
              {error}
            </p>
          </div>
        )}

        {/* 成功メッセージ */}
        {status === 'success' && (
          <div
            style={{
              padding: '12px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '8px',
            }}
          >
            <p style={{ fontSize: '14px', color: '#10b981', margin: 0 }}>
              ファイルが正常にアップロードされました。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
