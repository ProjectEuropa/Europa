import { Download, Loader2 } from 'lucide-react';

interface SumDownloadActionsProps {
  selectedCount: number;
  onDownload: () => void;
  isDownloading?: boolean;
  maxSelectionCount?: number;
}

export const SumDownloadActions = ({
  selectedCount,
  onDownload,
  isDownloading = false,
  maxSelectionCount = 50,
}: SumDownloadActionsProps) => {
  const isDisabled = selectedCount === 0 || isDownloading;
  const isOverLimit = selectedCount > maxSelectionCount;

  return (
    <div className="flex items-center justify-between py-4">
      <div className="text-sm text-slate-400">
        {selectedCount > 0 && (
          <span>
            {selectedCount}件選択中
            {isOverLimit && (
              <span className="text-red-500 ml-2">
                (上限{maxSelectionCount}件を超えています)
              </span>
            )}
          </span>
        )}
      </div>

      <button
        onClick={onDownload}
        disabled={isDisabled || isOverLimit}
        className={`
          px-6 h-12
          rounded-full 
          text-base font-bold
          flex items-center gap-2
          transition-all
          ${isDisabled || isOverLimit
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-70'
            : 'bg-cyan-500 text-slate-900 hover:bg-cyan-400 hover:shadow-[0_0_10px_rgba(6,182,212,0.4)] cursor-pointer'
          }
        `}
      >
        {isDownloading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            ダウンロード中...
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            ダウンロード ({selectedCount})
          </>
        )}
      </button>
    </div>
  );
};
