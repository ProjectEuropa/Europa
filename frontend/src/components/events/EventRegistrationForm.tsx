'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { eventSchema, type EventFormData } from '@/schemas/event';
import { useEventRegistration } from '@/hooks/useEventRegistration';
import Calendar from '@/components/Calendar';
import EventConfirmDialog from './EventConfirmDialog';

interface EventRegistrationFormProps {
  onSuccess?: () => void;
}

export default function EventRegistrationForm({
  onSuccess,
}: EventRegistrationFormProps) {
  const [showDeadlineCalendar, setShowDeadlineCalendar] = useState(false);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState<EventFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: '',
      details: '',
      url: '',
      deadline: '',
      endDisplayDate: '',
      type: '大会',
    },
  });

  const { mutate: registerEvent, isPending } = useEventRegistration({
    onSuccess: () => {
      toast.success('イベント情報が登録されました');
      reset();
      setShowDeadlineCalendar(false);
      setShowEndDateCalendar(false);
      onSuccess?.();
    },
    onError: error => {
      toast.error(error.message || '登録に失敗しました');
    },
  });

  const onSubmit = (data: EventFormData) => {
    setFormData(data);
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    if (formData) {
      registerEvent(formData);
      setShowConfirmDialog(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    setFormData(null);
  };

  // 日付をYYYY-MM-DD形式に変換する関数
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 締切日選択ハンドラー
  const handleDeadlineSelect = (date: Date) => {
    setValue('deadline', formatDate(date));
    setShowDeadlineCalendar(false);
  };

  // 表示最終日選択ハンドラー
  const handleEndDateSelect = (date: Date) => {
    setValue('endDisplayDate', formatDate(date));
    setShowEndDateCalendar(false);
  };

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <h1
        style={{
          color: '#00c8ff',
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '8px',
        }}
      >
        イベント登録
      </h1>
      <p
        style={{
          color: '#b0c4d8',
          fontSize: '1rem',
          marginBottom: '24px',
        }}
      >
        新しいイベント情報を登録することができます
      </p>

      {/* イベント登録フォーム */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          style={{
            background: '#0A1022',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #1E3A5F',
            marginBottom: '24px',
          }}
        >
          {/* イベント名 */}
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="event-name"
              style={{
                display: 'block',
                color: '#00c8ff',
                fontSize: '1rem',
                marginBottom: '8px',
              }}
            >
              イベント名 <span style={{ color: '#ff4d4d' }}>*</span>
            </label>
            <input
              id="event-name"
              type="text"
              {...register('name')}
              placeholder="イベント名を入力してください"
              style={{
                width: '100%',
                padding: '12px',
                background: '#0F1A2E',
                border: '1px solid #1E3A5F',
                borderRadius: '6px',
                color: 'white',
                fontSize: '1rem',
              }}
            />
            {errors.name && (
              <p
                style={{
                  color: '#ff4d4d',
                  fontSize: '0.875rem',
                  marginTop: '4px',
                }}
              >
                {errors.name.message}
              </p>
            )}
          </div>

          {/* イベント詳細情報 */}
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="event-details"
              style={{
                display: 'block',
                color: '#00c8ff',
                fontSize: '1rem',
                marginBottom: '8px',
              }}
            >
              イベント詳細情報 <span style={{ color: '#ff4d4d' }}>*</span>
            </label>
            <textarea
              id="event-details"
              {...register('details')}
              placeholder="イベントの詳細情報を入力してください"
              style={{
                width: '100%',
                padding: '12px',
                background: '#0F1A2E',
                border: '1px solid #1E3A5F',
                borderRadius: '6px',
                color: 'white',
                fontSize: '1rem',
                minHeight: '150px',
                resize: 'vertical',
              }}
            />
            {errors.details && (
              <p
                style={{
                  color: '#ff4d4d',
                  fontSize: '0.875rem',
                  marginTop: '4px',
                }}
              >
                {errors.details.message}
              </p>
            )}
          </div>

          {/* イベント詳細URL */}
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="event-url"
              style={{
                display: 'block',
                color: '#00c8ff',
                fontSize: '1rem',
                marginBottom: '8px',
              }}
            >
              イベント詳細URL
            </label>
            <input
              id="event-url"
              type="url"
              {...register('url')}
              placeholder="https://example.com"
              style={{
                width: '100%',
                padding: '12px',
                background: '#0F1A2E',
                border: '1px solid #1E3A5F',
                borderRadius: '6px',
                color: 'white',
                fontSize: '1rem',
              }}
            />
            {errors.url && (
              <p
                style={{
                  color: '#ff4d4d',
                  fontSize: '0.875rem',
                  marginTop: '4px',
                }}
              >
                {errors.url.message}
              </p>
            )}
          </div>

          {/* イベント受付締切日 */}
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="event-deadline"
              style={{
                display: 'block',
                color: '#00c8ff',
                fontSize: '1rem',
                marginBottom: '8px',
              }}
            >
              イベント受付締切日 <span style={{ color: '#ff4d4d' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  id="event-deadline"
                  type="text"
                  {...register('deadline')}
                  placeholder="YYYY-MM-DD"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0F1A2E',
                    border: '1px solid #1E3A5F',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => setShowDeadlineCalendar(!showDeadlineCalendar)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#00c8ff',
                    marginLeft: '-40px',
                    cursor: 'pointer',
                    zIndex: 1,
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </button>
              </div>

              {showDeadlineCalendar && (
                <div
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1000,
                    background: '#0A1022',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                    border: '1px solid #1E3A5F',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <h3 style={{ color: '#00c8ff', margin: 0 }}>日付を選択</h3>
                    <button
                      type="button"
                      onClick={() => setShowDeadlineCalendar(false)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#00c8ff',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30px',
                        height: '30px',
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <Calendar onSelect={handleDeadlineSelect} size="small" />
                </div>
              )}
            </div>
            {errors.deadline && (
              <p
                style={{
                  color: '#ff4d4d',
                  fontSize: '0.875rem',
                  marginTop: '4px',
                }}
              >
                {errors.deadline.message}
              </p>
            )}
          </div>

          {/* イベント表示最終日 */}
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="event-end-date"
              style={{
                display: 'block',
                color: '#00c8ff',
                fontSize: '1rem',
                marginBottom: '8px',
              }}
            >
              イベント表示最終日 <span style={{ color: '#ff4d4d' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  id="event-end-date"
                  type="text"
                  {...register('endDisplayDate')}
                  placeholder="YYYY-MM-DD"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0F1A2E',
                    border: '1px solid #1E3A5F',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => setShowEndDateCalendar(!showEndDateCalendar)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#00c8ff',
                    marginLeft: '-40px',
                    cursor: 'pointer',
                    zIndex: 1,
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </button>
              </div>

              {showEndDateCalendar && (
                <div
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1000,
                    background: '#0A1022',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                    border: '1px solid #1E3A5F',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <h3 style={{ color: '#00c8ff', margin: 0 }}>日付を選択</h3>
                    <button
                      type="button"
                      onClick={() => setShowEndDateCalendar(false)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#00c8ff',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30px',
                        height: '30px',
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <Calendar onSelect={handleEndDateSelect} size="small" />
                </div>
              )}
            </div>
            {errors.endDisplayDate && (
              <p
                style={{
                  color: '#ff4d4d',
                  fontSize: '0.875rem',
                  marginTop: '4px',
                }}
              >
                {errors.endDisplayDate.message}
              </p>
            )}
          </div>

          {/* イベント種別 */}
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="event-type"
              style={{
                display: 'block',
                color: '#00c8ff',
                fontSize: '1rem',
                marginBottom: '8px',
              }}
            >
              イベント種別 <span style={{ color: '#ff4d4d' }}>*</span>
            </label>
            <select
              id="event-type"
              {...register('type')}
              style={{
                width: '100%',
                padding: '12px',
                background: '#0F1A2E',
                border: '1px solid #1E3A5F',
                borderRadius: '6px',
                color: 'white',
                fontSize: '1rem',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300c8ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px',
              }}
            >
              <option value="大会">大会</option>
              <option value="告知">告知</option>
              <option value="その他">その他</option>
            </select>
            {errors.type && (
              <p
                style={{
                  color: '#ff4d4d',
                  fontSize: '0.875rem',
                  marginTop: '4px',
                }}
              >
                {errors.type.message}
              </p>
            )}
          </div>
        </div>

        {/* 送信ボタン */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '24px',
          }}
        >
          <button
            type="submit"
            disabled={isPending}
            style={{
              padding: '16px 40px',
              background: '#00c8ff',
              color: '#020824',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: isPending ? 'not-allowed' : 'pointer',
              opacity: isPending ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {isPending ? (
              <>
                <svg
                  style={{
                    width: '20px',
                    height: '20px',
                    animation: 'spin 1s linear infinite',
                  }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="2" x2="12" y2="6"></line>
                  <line x1="12" y1="18" x2="12" y2="22"></line>
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                  <line x1="2" y1="12" x2="6" y2="12"></line>
                  <line x1="18" y1="12" x2="22" y2="12"></line>
                  <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                  <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                </svg>
                送信中...
              </>
            ) : (
              <>
                <svg
                  style={{
                    width: '20px',
                    height: '20px',
                  }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 2L11 13"></path>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                </svg>
                イベントを登録する
              </>
            )}
          </button>
        </div>
      </form>

      {/* スタイル定義 */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      {formData && (
        <EventConfirmDialog
          isOpen={showConfirmDialog}
          onClose={handleCancel}
          onConfirm={handleConfirm}
          data={formData}
          isLoading={isPending}
        />
      )}
    </div>
  );
}
