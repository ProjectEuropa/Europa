import type React from 'react';
import type { EventFormData } from '@/schemas/event';
import { getEventTypeDisplay } from '@/schemas/event';

interface EventConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: EventFormData;
  isLoading?: boolean;
}

export default function EventConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  data,
  isLoading = false,
}: EventConfirmDialogProps) {
  if (!isOpen) return null;

  // ESCキーでモーダルを閉じる
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isLoading) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-content"
      aria-modal="true"
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
      onClick={isLoading ? undefined : onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className="bg-[#0A1022] border border-[#1E3A5F] rounded-lg p-6 max-w-[500px] w-[90%] max-h-[80vh] overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        <h2
          id="confirm-modal-title"
          className="text-[#00c8ff] text-xl font-bold mb-4 text-center"
        >
          イベント登録内容の確認
        </h2>

        <div id="confirm-modal-content" className="mb-5">
          <div className="mb-3">
            <span className="text-[#00c8ff] font-bold block mb-1">
              イベント名:
            </span>
            <span className="text-white">{data.name}</span>
          </div>

          <div className="mb-3">
            <span className="text-[#00c8ff] font-bold block mb-1">
              イベントタイプ:
            </span>
            <span className="text-white">
              {getEventTypeDisplay(data.type)}
            </span>
          </div>

          <div className="mb-3">
            <span className="text-[#00c8ff] font-bold block mb-1">
              詳細:
            </span>
            <div className="text-white whitespace-pre-wrap max-h-[120px] overflow-auto p-2 bg-[#1E3A5F] rounded">
              {data.details}
            </div>
          </div>

          {data.url && (
            <div className="mb-3">
              <span className="text-[#00c8ff] font-bold block mb-1">
                URL:
              </span>
              <span className="text-white break-all">
                {data.url}
              </span>
            </div>
          )}

          <div className="mb-3">
            <span className="text-[#00c8ff] font-bold block mb-1">
              申込締切日:
            </span>
            <span className="text-white">{data.deadline}</span>
          </div>

          <div className="mb-3">
            <span className="text-[#00c8ff] font-bold block mb-1">
              表示終了日:
            </span>
            <span className="text-white">{data.endDisplayDate}</span>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className={`py-2.5 px-5 bg-[#1E3A5F] text-white border border-[#1E3A5F] rounded ${
              isLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
            }`}
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`py-2.5 px-5 bg-[#00c8ff] text-[#0A1022] border border-[#00c8ff] rounded font-bold ${
              isLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
            }`}
          >
            {isLoading ? '登録中...' : '登録する'}
          </button>
        </div>
      </div>
    </div>
  );
}
