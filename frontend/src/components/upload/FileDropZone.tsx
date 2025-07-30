'use client';

import React, { useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/icons';
import { cn } from '@/lib/utils';

export interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
  onError?: (error: string) => void;
  accept?: string;
  maxSize?: number; // bytes
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFileSelect,
  onError,
  accept = '.che',
  maxSize = 25 * 1024, // 25KB default
  multiple = false,
  disabled = false,
  className,
  children,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragReject, setIsDragReject] = useState(false);

  const validateFile = useCallback((file: File): string | null => {
    // ファイルサイズチェック
    if (file.size > maxSize) {
      return `ファイルサイズが制限（${(maxSize / 1024).toFixed(0)}KB）を超えています`;
    }

    // ファイル拡張子チェック
    if (accept) {
      const acceptedExtensions = accept.split(',').map(ext => ext.trim().toLowerCase());
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

      if (!acceptedExtensions.includes(fileExtension)) {
        return `対応形式（${accept}）のファイルをアップロードしてください`;
      }
    }

    return null;
  }, [accept, maxSize]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    setIsDragActive(true);

    // ドラッグされているファイルをチェック
    const items = Array.from(e.dataTransfer.items);
    const hasValidFile = items.some(item => {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        return file && validateFile(file) === null;
      }
      return false;
    });

    setIsDragReject(!hasValidFile);
  }, [disabled, validateFile]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // ドロップゾーンから完全に出た場合のみリセット
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragActive(false);
      setIsDragReject(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragActive(false);
    setIsDragReject(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);

    if (files.length === 0) return;

    const file = files[0]; // 最初のファイルのみ処理
    const error = validateFile(file);

    if (error) {
      // エラーを親コンポーネントに通知
      if (onError) {
        onError(error);
      } else {
        console.error('File validation error:', error);
      }
      return;
    }

    onFileSelect(file);
  }, [disabled, validateFile, onFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const error = validateFile(file);

    if (error) {
      console.error('File validation error:', error);
      return;
    }

    onFileSelect(file);
  }, [validateFile, onFileSelect]);

  const openFileDialog = useCallback(() => {
    if (disabled) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.multiple = multiple;
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const syntheticEvent = {
        target,
        currentTarget: target,
        nativeEvent: e,
        isDefaultPrevented: () => false,
        isPropagationStopped: () => false,
        persist: () => {},
        preventDefault: () => e.preventDefault(),
        stopPropagation: () => e.stopPropagation(),
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileInputChange(syntheticEvent);
    };
    input.click();
  }, [disabled, accept, multiple, handleFileInputChange]);

  return (
    <Card
      className={cn(
        "border-2 border-dashed transition-all duration-200 cursor-pointer",
        "hover:border-primary/50 hover:bg-accent/50",
        isDragActive && !isDragReject && "border-primary bg-accent/50 scale-[1.02]",
        isDragReject && "border-destructive bg-destructive/10",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={openFileDialog}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <CardContent className="p-8">
        {children || (
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 flex items-center justify-center">
              {isDragActive ? (
                isDragReject ? (
                  <Icons.XCircle size={48} color="#ef4444" />
                ) : (
                  <Icons.Download size={48} color="#00c8ff" />
                )
              ) : (
                <Icons.Upload size={48} color="#8CB4FF" />
              )}
            </div>

            <div className="space-y-2">
              <p className={cn(
                "font-medium",
                isDragActive && !isDragReject && "text-primary",
                isDragReject && "text-destructive"
              )}>
                {isDragActive
                  ? isDragReject
                    ? "対応していないファイル形式です"
                    : "ファイルをドロップしてください"
                  : "ファイルをドラッグ&ドロップ"
                }
              </p>

              {!isDragActive && (
                <p className="text-sm text-muted-foreground">
                  またはクリックしてファイルを選択
                </p>
              )}
            </div>

            {!isDragActive && (
              <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                <span>対応形式: {accept}</span>
                <span>最大サイズ: {(maxSize / 1024).toFixed(0)}KB</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
