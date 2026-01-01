'use client';

import type React from 'react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, X, ExternalLink } from 'lucide-react';

interface CalendarEvent {
  date: string; // ISO形式
  title?: string;
  details?: string;
  url?: string;
}

interface CalendarProps {
  initialDate?: Date;
  onSelect?: (date: Date, shouldClose: boolean) => void;
  size?: 'small' | 'large';
  showTimeSelect?: boolean;
  events?: CalendarEvent[];
}

const Calendar: React.FC<CalendarProps> = ({
  initialDate = new Date(),
  onSelect,
  size = 'large',
  showTimeSelect = false,
  events = [],
}) => {
  const [modalEvent, setModalEvent] = useState<CalendarEvent | null>(null);
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<number>(
    initialDate ? initialDate.getHours() : new Date().getHours()
  );
  const [selectedMinute, setSelectedMinute] = useState<number>(
    initialDate ? initialDate.getMinutes() : 0
  );

  const isSmall = size === 'small';

  // ESCキーでモーダルを閉じる
  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setModalEvent(null);
    }
  };

  // 年月の表示用フォーマット
  const formatYearMonth = (date: Date): string => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  // 前月へ移動
  const goToPreviousMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // 次月へ移動
  const goToNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // 今日へ移動
  const goToToday = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    if (onSelect) {
      if (showTimeSelect) {
        const newDate = new Date(today);
        newDate.setHours(selectedHour);
        newDate.setMinutes(selectedMinute);
        onSelect(newDate, false);
      } else {
        onSelect(today, false);
      }
    }
  };

  // 日付選択処理
  const handleDateClick = (date: Date, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedDate(date);

    const dayEvents = events.filter(ev => {
      const evDate = new Date(ev.date);
      return (
        evDate.getFullYear() === date.getFullYear() &&
        evDate.getMonth() === date.getMonth() &&
        evDate.getDate() === date.getDate()
      );
    });

    if (dayEvents.length > 0) {
      setModalEvent(dayEvents[0]);
    }

    if (onSelect) {
      if (showTimeSelect) {
        const newDate = new Date(date);
        newDate.setHours(selectedHour);
        newDate.setMinutes(selectedMinute);
        onSelect(newDate, true);
      } else {
        onSelect(date, true);
      }
    }
  };

  // 時間選択ハンドラー
  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const hour = parseInt(e.target.value, 10);
    setSelectedHour(hour);
    const baseDate = selectedDate || currentDate;
    const newDate = new Date(baseDate);
    newDate.setHours(hour);
    newDate.setMinutes(selectedMinute);
    if (onSelect) onSelect(newDate, false);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const minute = parseInt(e.target.value, 10);
    setSelectedMinute(minute);
    const baseDate = selectedDate || currentDate;
    const newDate = new Date(baseDate);
    newDate.setHours(selectedHour);
    newDate.setMinutes(minute);
    if (onSelect) onSelect(newDate, false);
  };

  // 時間設定ボタンハンドラー
  const handleTimeSet = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const baseDate = selectedDate || currentDate;
    const newDate = new Date(baseDate);
    newDate.setHours(selectedHour);
    newDate.setMinutes(selectedMinute);

    if (onSelect) {
      onSelect(newDate, true);
    }
  };

  // 日付が同じかどうかを判定
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // イベントマップを事前計算（パフォーマンス最適化）
  const eventDateMap = useMemo(() => {
    const map = new Map<string, CalendarEvent>();
    for (const ev of events) {
      const evDate = new Date(ev.date);
      const key = `${evDate.getFullYear()}-${evDate.getMonth()}-${evDate.getDate()}`;
      if (!map.has(key)) {
        map.set(key, ev);
      }
    }
    return map;
  }, [events]);

  // 日付にイベントがあるかチェック
  const hasEventOnDate = (date: Date): boolean => {
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return eventDateMap.has(key);
  };

  // カレンダーの日付を生成
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const lastDayOfLastMonth = new Date(year, month, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();

    const days = [];

    // 先月の日を追加
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month - 1, lastDayOfLastMonth.getDate() - i);
      days.push({
        date: day,
        isCurrentMonth: false,
        isToday: isSameDay(day, new Date()),
        isSelected: selectedDate ? isSameDay(day, selectedDate) : false,
      });
    }

    // 今月の日を追加
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const day = new Date(year, month, i);
      days.push({
        date: day,
        isCurrentMonth: true,
        isToday: isSameDay(day, new Date()),
        isSelected: selectedDate ? isSameDay(day, selectedDate) : false,
      });
    }

    // 来月の日を追加（6行 x 7列 = 42日分になるまで）
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const day = new Date(year, month + 1, i);
      days.push({
        date: day,
        isCurrentMonth: false,
        isToday: isSameDay(day, new Date()),
        isSelected: selectedDate ? isSameDay(day, selectedDate) : false,
      });
    }

    return days;
  };

  const days = generateCalendarDays();
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

  // カレンダー全体のクリックイベントを停止
  const handleCalendarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className={cn(
        'bg-[#050A14] border border-[#1E3A5F] text-white w-full max-w-full min-w-0 mx-auto overflow-hidden',
        isSmall ? 'rounded-lg p-2.5' : 'rounded-xl p-[30px]'
      )}
      onClick={handleCalendarClick}
    >
      {/* ヘッダー部分 */}
      <div className={cn(
        'flex justify-between items-center',
        isSmall ? 'mb-2.5' : 'mb-[30px]'
      )}>
        <button
          onClick={goToPreviousMonth}
          className={cn(
            'bg-[#111A2E] border border-[#1E3A5F] text-cyan-400 cursor-pointer rounded-lg flex items-center justify-center',
            'hover:bg-[#1a2540] transition-colors',
            isSmall ? 'p-2.5 px-4' : 'p-4 px-5'
          )}
        >
          <ChevronLeft className={isSmall ? 'w-6 h-6' : 'w-[30px] h-[30px]'} />
        </button>

        <div className={cn(
          'font-bold text-cyan-400',
          isSmall ? 'text-base' : 'text-2xl'
        )}>
          {formatYearMonth(currentDate)}
        </div>

        <button
          onClick={goToNextMonth}
          className={cn(
            'bg-[#111A2E] border border-[#1E3A5F] text-cyan-400 cursor-pointer rounded-lg flex items-center justify-center',
            'hover:bg-[#1a2540] transition-colors',
            isSmall ? 'p-2.5 px-4' : 'p-4 px-5'
          )}
        >
          <ChevronRight className={isSmall ? 'w-6 h-6' : 'w-[30px] h-[30px]'} />
        </button>
      </div>

      {/* 今日ボタン */}
      <div className={cn(
        'flex justify-center',
        isSmall ? 'mb-2.5' : 'mb-[30px]'
      )}>
        <button
          onClick={goToToday}
          className={cn(
            'bg-[#111A2E] border border-[#1E3A5F] rounded-lg text-cyan-400 cursor-pointer font-bold',
            'hover:bg-[#1a2540] transition-colors',
            isSmall ? 'py-1.5 px-2.5 text-xs' : 'py-3 px-6 text-lg'
          )}
        >
          今日
        </button>
      </div>

      {/* 時間選択 */}
      {showTimeSelect && (
        <div className={cn(
          'flex flex-col items-center gap-2.5 bg-cyan-500/5 rounded-lg border border-[#1E3A5F]',
          isSmall ? 'mb-2.5 p-1.5' : 'mb-[30px] p-2.5'
        )}>
          <div className="flex items-center gap-2.5 w-full justify-center">
            <div className={cn(
              'text-cyan-400',
              isSmall ? 'text-xs' : 'text-base'
            )}>
              時間:
            </div>
            <select
              value={selectedHour}
              onChange={handleHourChange}
              className={cn(
                'bg-slate-900 text-white border border-[#1E3A5F] rounded px-2 py-1 cursor-pointer',
                isSmall ? 'text-xs' : 'text-base'
              )}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={`hour-${i}`} value={i}>
                  {i.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
            <div className="text-cyan-400">:</div>
            <select
              value={selectedMinute}
              onChange={handleMinuteChange}
              className={cn(
                'bg-slate-900 text-white border border-[#1E3A5F] rounded px-2 py-1 cursor-pointer',
                isSmall ? 'text-xs' : 'text-base'
              )}
            >
              {Array.from({ length: 60 }, (_, i) => (
                <option key={`minute-${i}`} value={i}>
                  {i.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>

          {/* 設定ボタン */}
          <button
            onClick={handleTimeSet}
            className={cn(
              'bg-cyan-400 border-none rounded-lg text-[#020824] cursor-pointer font-bold mt-2.5 w-full max-w-[200px]',
              'hover:bg-cyan-300 transition-all',
              isSmall ? 'py-1.5 px-3 text-xs' : 'py-2 px-4 text-base'
            )}
          >
            時間を設定して閉じる
          </button>
        </div>
      )}

      {/* 曜日表示 */}
      <div className={cn(
        'grid grid-cols-7 text-center',
        isSmall ? 'gap-1 mb-1' : 'gap-4 mb-4'
      )}>
        {weekdays.map((day, index) => (
          <div
            key={index}
            className={cn(
              'font-bold',
              isSmall ? 'p-2.5 text-xs' : 'p-4 text-2xl',
              index === 0 && 'text-red-400',
              index === 6 && 'text-cyan-400',
              index !== 0 && index !== 6 && 'text-[#b0c4d8]'
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日付表示 */}
      <div className={cn(
        'grid grid-cols-7',
        isSmall ? 'gap-1' : 'gap-4'
      )}>
        {days.map((day, index) => {
          const hasEvent = hasEventOnDate(day.date);
          const dayOfWeek = day.date.getDay();

          return (
            <div
              key={index}
              onClick={e => handleDateClick(day.date, e)}
              className={cn(
                'text-center cursor-pointer relative rounded-lg flex flex-col justify-center items-center',
                'hover:bg-cyan-500/10 transition-colors',
                isSmall ? 'p-1 h-[45px]' : 'p-4 h-20',
                day.isSelected && 'bg-cyan-500/15',
                !day.isCurrentMonth && 'text-[#4A6FA5]',
                day.isCurrentMonth && dayOfWeek === 0 && 'text-red-400',
                day.isCurrentMonth && dayOfWeek === 6 && 'text-cyan-400',
                day.isCurrentMonth && dayOfWeek !== 0 && dayOfWeek !== 6 && 'text-white'
              )}
            >
              <div className={cn(
                isSmall ? 'text-sm' : 'text-2xl',
                day.isToday && 'font-bold'
              )}>
                {day.date.getDate()}
              </div>

              {/* イベントがある日に印を表示 */}
              {hasEvent && (
                <div className={cn(
                  'absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-0',
                  isSmall ? 'bottom-0.5' : 'bottom-1'
                )}>
                  <span className={isSmall ? 'text-[0.6em] leading-none' : 'text-base leading-none'}>
                    📅
                  </span>
                  <span className={cn(
                    'bg-gradient-to-r from-blue-500 to-blue-300 text-white font-semibold tracking-tight shadow-sm whitespace-nowrap',
                    isSmall ? 'text-[0.4em] px-0.5 rounded-sm' : 'text-[0.65em] px-1 py-px rounded'
                  )}>
                    EVENT
                  </span>
                </div>
              )}

              {/* 今日の日付に青い丸を表示 */}
              {day.isToday && (
                <div className={cn(
                  'absolute bg-cyan-400 rounded-full',
                  isSmall ? 'top-2 right-2 w-2 h-2' : 'top-2.5 right-2.5 w-3 h-3'
                )} />
              )}

              {/* 選択された日付に青い枠線を表示 */}
              {day.isSelected && (
                <div className={cn(
                  'absolute inset-0 border-cyan-400 rounded-lg pointer-events-none',
                  isSmall ? 'border-2' : 'border-[3px]'
                )} />
              )}
            </div>
          );
        })}
      </div>

      {/* イベント詳細モーダル */}
      {modalEvent && (
        <div
          role="dialog"
          aria-labelledby="event-modal-title"
          aria-describedby="event-modal-description"
          aria-modal="true"
          className="fixed inset-0 w-full h-full bg-black/70 backdrop-blur-sm z-[99999] flex items-center justify-center p-5"
          onClick={() => setModalEvent(null)}
          onKeyDown={handleModalKeyDown}
        >
          <div
            className="bg-gradient-to-br from-[#0A1022] to-[#0d1830] rounded-2xl p-8 min-w-[320px] max-w-[500px] w-full border-2 border-cyan-400 text-white shadow-[0_8px_32px_rgba(0,200,255,0.2),0_0_60px_rgba(0,200,255,0.1)] relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              aria-label="モーダルを閉じる"
              className="absolute top-3 right-3 bg-cyan-500/10 border border-cyan-500/30 rounded-full w-8 h-8 text-cyan-400 text-xl cursor-pointer flex items-center justify-center hover:bg-cyan-500/20 transition-all"
              onClick={() => setModalEvent(null)}
            >
              <X className="w-4 h-4" />
            </button>
            <h3 id="event-modal-title" className="text-cyan-400 text-xl font-bold mb-4 pr-10">
              {modalEvent.title || 'イベント詳細'}
            </h3>
            <div id="event-modal-description" className="mb-4 text-[#b0c4d8] leading-relaxed whitespace-pre-wrap">
              {modalEvent.details}
            </div>
            {modalEvent.url && (
              <div className="mt-4">
                <a
                  href={modalEvent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 no-underline inline-flex items-center gap-1.5 py-2 px-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  参考リンクを開く
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
