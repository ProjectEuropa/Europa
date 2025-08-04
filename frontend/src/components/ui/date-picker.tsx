'use client';

import { forwardRef, useState } from 'react';
import { Calendar, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const DateTimePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    { value, onChange, placeholder = 'YYYY-MM-DD', className, disabled },
    ref
  ) => {
    const [showCalendar, setShowCalendar] = useState(false);

    // 日付をYYYY-MM-DD形式に変換
    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // 文字列からDateオブジェクトに変換
    const parseDate = (dateString: string): Date | null => {
      if (!dateString) return null;
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    const handleCalendarClick = () => {
      if (disabled) return;

      // HTML5 date inputのネイティブピッカーを開く
      const input = ref as React.RefObject<HTMLInputElement>;
      if (input?.current) {
        input.current.focus();
        if (typeof input.current.showPicker === 'function') {
          input.current.showPicker();
        }
      }
    };

    return (
      <div className={cn('relative', className)}>
        <Input
          ref={ref}
          type="date"
          value={value}
          onChange={handleDateChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'pr-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400',
            className
          )}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={handleCalendarClick}
          disabled={disabled}
          tabIndex={-1}
        >
          <CalendarIcon className="h-4 w-4 text-slate-400" />
          <span className="sr-only">カレンダーを開く</span>
        </Button>
      </div>
    );
  }
);

DateTimePicker.displayName = 'DateTimePicker';
