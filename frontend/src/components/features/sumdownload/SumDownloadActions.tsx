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
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 0',
      }}
    >
      <div style={{ fontSize: '0.875rem', color: '#b0c4d8' }}>
        {selectedCount > 0 && (
          <span>
            {selectedCount}件選択中
            {isOverLimit && (
              <span style={{ color: '#ef4444', marginLeft: '8px' }}>
                (上限{maxSelectionCount}件を超えています)
              </span>
            )}
          </span>
        )}
      </div>

      <button
        onClick={onDownload}
        disabled={isDisabled || isOverLimit}
        style={{
          padding: '0 24px',
          background: isDownloading ? '#6b7280' : '#00c8ff',
          color: isDownloading ? '#fff' : '#020824',
          border: 'none',
          borderRadius: '24px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: isDisabled || isOverLimit ? 'not-allowed' : 'pointer',
          opacity: isDisabled || isOverLimit ? 0.7 : 1,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          height: 48,
        }}
      >
        {isDownloading ? (
          <>
            <Loader2
              style={{ width: '20px', height: '20px' }}
              className="animate-spin"
            />
            ダウンロード中...
          </>
        ) : (
          <>
            <Download style={{ width: '20px', height: '20px' }} />
            ダウンロード ({selectedCount})
          </>
        )}
      </button>
    </div>
  );
};
