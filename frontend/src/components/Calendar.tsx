'use client';

import React, { useState } from 'react';

interface CalendarProps {
  initialDate?: Date;
  onSelect?: (date: Date) => void;
  size?: 'small' | 'large';
}

const Calendar: React.FC<CalendarProps> = ({ initialDate = new Date(), onSelect, size = 'large' }) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // フォントサイズを計算
  const fontSize = {
    yearMonth: size === 'small' ? '1.5rem' : '2rem',
    weekday: size === 'small' ? '1.2rem' : '1.5rem',
    day: size === 'small' ? '1.2rem' : '1.5rem',
    button: size === 'small' ? '1rem' : '1.3rem'
  };
  
  // パディングを計算
  const padding = {
    container: size === 'small' ? '20px' : '30px',
    cell: size === 'small' ? '10px' : '15px',
    button: size === 'small' ? '10px 15px' : '12px 25px'
  };
  
  // 間隔を計算
  const gap = size === 'small' ? '10px' : '15px';
  
  // セルの高さを計算
  const cellHeight = size === 'small' ? '60px' : '80px';

  // 年月の表示用フォーマット
  const formatYearMonth = (date: Date): string => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  // 前月へ移動
  const goToPreviousMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // 次月へ移動
  const goToNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // 今日へ移動
  const goToToday = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    if (onSelect) {
      onSelect(today);
    }
  };

  // 日付選択処理
  const handleDateClick = (date: Date, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedDate(date);
    if (onSelect) {
      onSelect(date);
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
    
    // 来月の日を追加（6行 x 7列 = 42日分になるまで）
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
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
  
  const days = generateCalendarDays();
  
  // 曜日の表示
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  
  // カレンダー全体のクリックイベントを停止
  const handleCalendarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div 
      style={{
        background: '#050A14',
        border: '1px solid #1E3A5F',
        borderRadius: '12px',
        padding: padding.container,
        color: 'white',
        width: '100%',
        margin: '0 auto'
      }}
      onClick={handleCalendarClick}
    >
      {/* ヘッダー部分 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: padding.container
      }}>
        <button 
          onClick={goToPreviousMonth}
          style={{
            background: '#111A2E',
            border: '1px solid #1E3A5F',
            color: '#00c8ff',
            cursor: 'pointer',
            padding: size === 'small' ? '10px 15px' : '15px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg width={size === 'small' ? "24" : "30"} height={size === 'small' ? "24" : "30"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#00c8ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div style={{
          fontSize: fontSize.yearMonth,
          fontWeight: 'bold',
          color: '#00c8ff'
        }}>
          {formatYearMonth(currentDate)}
        </div>
        
        <button 
          onClick={goToNextMonth}
          style={{
            background: '#111A2E',
            border: '1px solid #1E3A5F',
            color: '#00c8ff',
            cursor: 'pointer',
            padding: size === 'small' ? '10px 15px' : '15px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg width={size === 'small' ? "24" : "30"} height={size === 'small' ? "24" : "30"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6L15 12L9 18" stroke="#00c8ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      {/* 今日ボタン */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: padding.container
      }}>
        <button 
          onClick={goToToday}
          style={{
            background: '#111A2E',
            border: '1px solid #1E3A5F',
            borderRadius: '8px',
            color: '#00c8ff',
            padding: padding.button,
            cursor: 'pointer',
            fontSize: fontSize.button,
            fontWeight: 'bold'
          }}
        >
          今日
        </button>
      </div>
      
      {/* 曜日表示 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: gap,
        marginBottom: gap,
        textAlign: 'center'
      }}>
        {weekdays.map((day, index) => (
          <div 
            key={index} 
            style={{
              padding: size === 'small' ? '10px' : '15px',
              fontWeight: 'bold',
              fontSize: fontSize.weekday,
              color: index === 0 ? '#ff6b6b' : index === 6 ? '#00c8ff' : '#b0c4d8'
            }}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* 日付表示 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: gap
      }}>
        {days.map((day, index) => (
          <div 
            key={index} 
            onClick={(e) => handleDateClick(day.date, e)}
            style={{
              padding: padding.cell,
              textAlign: 'center',
              cursor: 'pointer',
              position: 'relative',
              background: day.isSelected ? 'rgba(0, 200, 255, 0.15)' : 'transparent',
              borderRadius: '8px',
              color: !day.isCurrentMonth ? '#4A6FA5' : 
                     day.date.getDay() === 0 ? '#ff6b6b' : 
                     day.date.getDay() === 6 ? '#00c8ff' : '#fff',
              height: cellHeight,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div style={{
              fontSize: fontSize.day,
              fontWeight: day.isToday ? 'bold' : 'normal'
            }}>
              {day.date.getDate()}
            </div>
            
            {/* 今日の日付に青い丸を表示 */}
            {day.isToday && (
              <div style={{
                position: 'absolute',
                top: size === 'small' ? '8px' : '10px',
                right: size === 'small' ? '8px' : '10px',
                width: size === 'small' ? '8px' : '12px',
                height: size === 'small' ? '8px' : '12px',
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
                border: size === 'small' ? '2px solid #00c8ff' : '3px solid #00c8ff',
                borderRadius: '8px',
                pointerEvents: 'none'
              }}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
