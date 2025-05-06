'use client';

import React, { useState } from 'react';

interface CalendarProps {
  initialDate?: Date;
}

const Calendar: React.FC<CalendarProps> = ({ initialDate = new Date() }) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 年月の表示用フォーマット
  const formatYearMonth = (date: Date): string => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  // 前月へ移動
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // 次月へ移動
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // 今日へ移動
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // カレンダーの日付を生成
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 月の最初の日
    const firstDayOfMonth = new Date(year, month, 1);
    // 月の最後の日
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // 先月の最後の日
    const lastDayOfLastMonth = new Date(year, month, 0);
    
    // 月の最初の日の曜日（0: 日曜日, 1: 月曜日, ..., 6: 土曜日）
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    const days = [];
    
    // 先月の日を追加
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month - 1, lastDayOfLastMonth.getDate() - i);
      days.push({
        date: day,
        isCurrentMonth: false,
        isToday: isSameDay(day, new Date()),
        isSelected: selectedDate ? isSameDay(day, selectedDate) : false
      });
    }
    
    // 今月の日を追加
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const day = new Date(year, month, i);
      days.push({
        date: day,
        isCurrentMonth: true,
        isToday: isSameDay(day, new Date()),
        isSelected: selectedDate ? isSameDay(day, selectedDate) : false
      });
    }
    
    // 来月の日を追加（6週間分になるように）
    const daysNeeded = 42 - days.length;
    for (let i = 1; i <= daysNeeded; i++) {
      const day = new Date(year, month + 1, i);
      days.push({
        date: day,
        isCurrentMonth: false,
        isToday: isSameDay(day, new Date()),
        isSelected: selectedDate ? isSameDay(day, selectedDate) : false
      });
    }
    
    return days;
  };

  // 同じ日かどうかを判定
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // 日付クリック時の処理
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    // ここに日付クリック時の処理を追加（例: イベント表示など）
    console.log('Selected date:', date);
  };

  // 曜日の配列
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

  // カレンダーの日付配列
  const calendarDays = generateCalendarDays();

  return (
    <div style={{
      width: '100%',
      maxWidth: '1000px',
      background: '#0A1022',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      border: '1px solid #1E3A5F'
    }}>
      {/* カレンダーヘッダー */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <button
            onClick={goToToday}
            style={{
              background: '#111A2E',
              border: '1px solid #1E3A5F',
              color: '#00c8ff',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            TODAY
          </button>
          <button
            onClick={goToPreviousMonth}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#00c8ff',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '4px 8px'
            }}
          >
            &lt;
          </button>
          <button
            onClick={goToNextMonth}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#00c8ff',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '4px 8px'
            }}
          >
            &gt;
          </button>
          <h2 style={{
            color: '#fff',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            {formatYearMonth(currentDate)}
          </h2>
        </div>
        <div>
          <select
            style={{
              background: '#111A2E',
              border: '1px solid #1E3A5F',
              color: '#00c8ff',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            <option>MONTH</option>
            <option>WEEK</option>
            <option>DAY</option>
          </select>
        </div>
      </div>
      
      {/* 曜日ヘッダー */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        textAlign: 'center',
        borderBottom: '1px solid #1E3A5F',
        paddingBottom: '8px',
        marginBottom: '8px'
      }}>
        {weekdays.map((day, index) => (
          <div 
            key={index}
            style={{
              color: index === 0 ? '#ff6b6b' : index === 6 ? '#00c8ff' : '#b0c4d8',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* カレンダー本体 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '1px',
        background: '#0A1022'
      }}>
        {calendarDays.map((day, index) => (
          <div
            key={index}
            onClick={() => handleDateClick(day.date)}
            style={{
              height: '80px',
              padding: '8px',
              background: day.isSelected ? 'rgba(0, 200, 255, 0.1)' : day.isToday ? 'rgba(0, 200, 255, 0.05)' : 'transparent',
              border: '1px solid #1E3A5F',
              cursor: 'pointer',
              position: 'relative',
              color: !day.isCurrentMonth ? '#4A6FA5' : 
                     day.date.getDay() === 0 ? '#ff6b6b' : 
                     day.date.getDay() === 6 ? '#00c8ff' : '#fff'
            }}
          >
            <div style={{
              fontSize: '0.9rem',
              fontWeight: day.isToday ? 'bold' : 'normal'
            }}>
              {day.date.getDate()}
            </div>
            
            {/* 今日の日付に青い丸を表示 */}
            {day.isToday && (
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#00c8ff'
              }}></div>
            )}
            
            {/* 選択された日付に青い枠線を表示 */}
            {day.isSelected && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                border: '2px solid #00c8ff',
                pointerEvents: 'none'
              }}></div>
            )}
            
            {/* ここにイベントを表示する場合は追加 */}
            {day.isCurrentMonth && day.date.getDate() === 6 && (
              <div style={{
                background: '#2563EB',
                color: 'white',
                fontSize: '0.8rem',
                padding: '2px 4px',
                borderRadius: '4px',
                marginTop: '4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                今日の予定
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
