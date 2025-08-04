'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { ModalProps } from '@/types/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';

/**
 * モーダルコンポーネント
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
}: ModalProps) {
  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // サイズに応じたクラス
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeOnOverlayClick ? onClose : undefined}
    >
      <DialogContent
        className={cn('bg-[#0a1022] border border-gray-700', sizeClasses[size])}
        onInteractOutside={closeOnOverlayClick ? onClose : undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * 確認モーダルコンポーネント
 */
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '確認',
  cancelText = 'キャンセル',
  variant = 'primary',
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'danger';
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="mb-6">{message}</div>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          {cancelText}
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={cn(
            'px-4 py-2 rounded-md text-white',
            variant === 'danger'
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-blue-600 hover:bg-blue-700'
          )}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
