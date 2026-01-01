'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Calendar from '@/components/Calendar';
import { useEventRegistration } from '@/hooks/useEventRegistration';
import { Z_INDEX } from '@/lib/utils';
import {
  EVENT_TYPE_OPTIONS,
  EVENT_TYPES,
  type EventFormData,
  eventSchema,
  getEventTypeDisplay,
} from '@/schemas/event';
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
      type: 'tournament',
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
    <div className="max-w-[800px] mx-auto">
      <h1 className="text-[#00c8ff] text-3xl font-bold mb-2">イベント登録</h1>
      <p className="text-[#b0c4d8] text-base mb-6">
        新しいイベント情報を登録することができます
      </p>

      {/* イベント登録フォーム */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-[#0A1022] rounded-xl p-6 border border-[#1E3A5F] mb-6">
          {/* イベント名 */}
          <div className="mb-5">
            <label
              htmlFor="event-name"
              className="block text-[#00c8ff] text-base mb-2"
            >
              イベント名 <span className="text-red-500">*</span>
            </label>
            <input
              id="event-name"
              type="text"
              {...register('name')}
              placeholder="イベント名を入力してください"
              className="w-full p-3 bg-[#0F1A2E] border border-[#1E3A5F] rounded-md text-white text-base"
            />
            {errors.name && (
              <p
                className="text-red-500 text-sm mt-1"
              >
                {errors.name.message}
              </p>
            )}
          </div>

          {/* イベント詳細情報 */}
          <div className="mb-5">
            <label
              htmlFor="event-details"
              className="block text-[#00c8ff] text-base mb-2"
            >
              イベント詳細情報 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="event-details"
              {...register('details')}
              placeholder="イベントの詳細情報を入力してください"
              className="w-full p-3 bg-[#0F1A2E] border border-[#1E3A5F] rounded-md text-white text-base min-h-[150px] resize-y"
            />
            {errors.details && (
              <p
                className="text-red-500 text-sm mt-1"
              >
                {errors.details.message}
              </p>
            )}
          </div>

          {/* イベント詳細URL */}
          <div className="mb-5">
            <label
              htmlFor="event-url"
              className="block text-[#00c8ff] text-base mb-2"
            >
              イベント詳細URL
            </label>
            <input
              id="event-url"
              type="url"
              {...register('url')}
              placeholder="https://example.com"
              className="w-full p-3 bg-[#0F1A2E] border border-[#1E3A5F] rounded-md text-white text-base"
            />
            {errors.url && (
              <p
                className="text-red-500 text-sm mt-1"
              >
                {errors.url.message}
              </p>
            )}
          </div>

          {/* イベント受付締切日 */}
          <div className="mb-5">
            <label
              htmlFor="event-deadline"
              className="block text-[#00c8ff] text-base mb-2"
            >
              イベント受付締切日 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="flex items-center">
                <input
                  id="event-deadline"
                  type="text"
                  {...register('deadline')}
                  placeholder="YYYY-MM-DD"
                  className="w-full p-3 bg-[#0F1A2E] border border-[#1E3A5F] rounded-md text-white text-base"
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => setShowDeadlineCalendar(!showDeadlineCalendar)}
                  className="bg-transparent border-none text-[#00c8ff] -ml-10 cursor-pointer"
                  style={{ zIndex: Z_INDEX.base }}
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
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0A1022] p-5 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-[#1E3A5F]"
                  style={{ zIndex: Z_INDEX.modal }}
                >
                  <div
                    className="flex justify-between items-center mb-4"
                  >
                    <h3 className="text-[#00c8ff] m-0">日付を選択</h3>
                    <button
                      type="button"
                      onClick={() => setShowDeadlineCalendar(false)}
                      className="bg-transparent border-none text-[#00c8ff] text-2xl cursor-pointer flex items-center justify-center w-[30px] h-[30px]"
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
                className="text-red-500 text-sm mt-1"
              >
                {errors.deadline.message}
              </p>
            )}
          </div>

          {/* イベント表示最終日 */}
          <div className="mb-5">
            <label
              htmlFor="event-end-date"
              className="block text-[#00c8ff] text-base mb-2"
            >
              イベント表示最終日 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="flex items-center">
                <input
                  id="event-end-date"
                  type="text"
                  {...register('endDisplayDate')}
                  placeholder="YYYY-MM-DD"
                  className="w-full p-3 bg-[#0F1A2E] border border-[#1E3A5F] rounded-md text-white text-base"
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => setShowEndDateCalendar(!showEndDateCalendar)}
                  className="bg-transparent border-none text-[#00c8ff] -ml-10 cursor-pointer"
                  style={{ zIndex: Z_INDEX.base }}
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
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0A1022] p-5 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-[#1E3A5F]"
                  style={{ zIndex: Z_INDEX.modal }}
                >
                  <div
                    className="flex justify-between items-center mb-4"
                  >
                    <h3 className="text-[#00c8ff] m-0">日付を選択</h3>
                    <button
                      type="button"
                      onClick={() => setShowEndDateCalendar(false)}
                      className="bg-transparent border-none text-[#00c8ff] text-2xl cursor-pointer flex items-center justify-center w-[30px] h-[30px]"
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
                className="text-red-500 text-sm mt-1"
              >
                {errors.endDisplayDate.message}
              </p>
            )}
          </div>

          {/* イベント種別 */}
          <div className="mb-5">
            <label
              htmlFor="event-type"
              className="block text-[#00c8ff] text-base mb-2"
            >
              イベント種別 <span className="text-red-500">*</span>
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
              {EVENT_TYPE_OPTIONS.map(type => (
                <option key={type} value={type}>
                  {getEventTypeDisplay(type)}
                </option>
              ))}
            </select>
            {errors.type && (
              <p
                className="text-red-500 text-sm mt-1"
              >
                {errors.type.message}
              </p>
            )}
          </div>
        </div>

        {/* 送信ボタン */}
        <div className="flex justify-center mb-6">
          <button
            type="submit"
            disabled={isPending}
            className={`px-10 py-4 bg-[#00c8ff] text-[#020824] border-none rounded-md text-base font-bold flex items-center gap-2 ${
              isPending ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
            }`}
          >
            {isPending ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
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
                  className="w-5 h-5"
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
