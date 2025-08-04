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


  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#0A1022',
          border: '1px solid #1E3A5F',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2
          style={{
            color: '#00c8ff',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          イベント登録内容の確認
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '12px' }}>
            <span
              style={{
                color: '#00c8ff',
                fontWeight: 'bold',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              イベント名:
            </span>
            <span style={{ color: '#ffffff' }}>{data.name}</span>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <span
              style={{
                color: '#00c8ff',
                fontWeight: 'bold',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              イベントタイプ:
            </span>
            <span style={{ color: '#ffffff' }}>
              {getEventTypeDisplay(data.type)}
            </span>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <span
              style={{
                color: '#00c8ff',
                fontWeight: 'bold',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              詳細:
            </span>
            <div
              style={{
                color: '#ffffff',
                whiteSpace: 'pre-wrap',
                maxHeight: '120px',
                overflow: 'auto',
                padding: '8px',
                backgroundColor: '#1E3A5F',
                borderRadius: '4px',
              }}
            >
              {data.details}
            </div>
          </div>

          {data.url && (
            <div style={{ marginBottom: '12px' }}>
              <span
                style={{
                  color: '#00c8ff',
                  fontWeight: 'bold',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                URL:
              </span>
              <span style={{ color: '#ffffff', wordBreak: 'break-all' }}>
                {data.url}
              </span>
            </div>
          )}

          <div style={{ marginBottom: '12px' }}>
            <span
              style={{
                color: '#00c8ff',
                fontWeight: 'bold',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              申込締切日:
            </span>
            <span style={{ color: '#ffffff' }}>{data.deadline}</span>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <span
              style={{
                color: '#00c8ff',
                fontWeight: 'bold',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              表示終了日:
            </span>
            <span style={{ color: '#ffffff' }}>{data.endDisplayDate}</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1E3A5F',
              color: '#ffffff',
              border: '1px solid #1E3A5F',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#00c8ff',
              color: '#0A1022',
              border: '1px solid #00c8ff',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              fontWeight: 'bold',
            }}
          >
            {isLoading ? '登録中...' : '登録する'}
          </button>
        </div>
      </div>
    </div>
  );
}
