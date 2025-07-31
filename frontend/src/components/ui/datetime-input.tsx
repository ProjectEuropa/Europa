'use client';

import type React from 'react';
import { forwardRef, useRef } from 'react';
import { Icons } from '@/icons';

export interface DateTimeInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  'aria-describedby'?: string;
  'aria-label'?: string;
  className?: string;
}

export const DateTimeInput = forwardRef<HTMLInputElement, DateTimeInputProps>(
  (
    {
      id,
      value,
      onChange,
      placeholder,
      disabled = false,
      error = false,
      'aria-describedby': ariaDescribedBy,
      'aria-label': ariaLabel,
      className = '',
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const actualRef = ref || inputRef;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    const handleIconClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // アイコンクリック時にネイティブピッカーを開く
      const input = actualRef as React.RefObject<HTMLInputElement>;
      if (input?.current && !disabled) {
        try {
          // まずフォーカスを当てる
          input.current.focus();

          // showPicker()が利用可能な場合は使用
          if (typeof input.current.showPicker === 'function') {
            // 少し遅延を入れてshowPickerを呼び出す
            setTimeout(() => {
              try {
                input.current?.showPicker();
              } catch (error) {
                console.warn('showPicker failed:', error);
                // フォールバック: clickイベントを発火
                input.current?.click();
              }
            }, 10);
          } else {
            // showPickerが利用できない場合はclickイベントを発火
            input.current.click();
          }
        } catch (error) {
          console.warn('Calendar picker interaction failed:', error);
          // 最終フォールバック: フォーカスのみ
          input.current.focus();
        }
      }
    };

    return (
      <>
        <style>
          {`
            .datetime-input-wrapper {
              position: relative;
              width: 100%;
            }

            .datetime-input-field {
              width: 100%;
              padding: 12px 48px 12px 16px;
              background: #020824;
              border: 1px solid #1E3A5F;
              border-radius: 8px;
              color: #fff;
              font-size: 14px;
              outline: none;
              transition: border-color 0.2s;
              color-scheme: dark;
            }

            .datetime-input-field.error {
              border: 2px solid #ef4444;
            }

            .datetime-input-field:focus {
              border-color: #00c8ff;
            }

            /* ネイティブのカレンダーピッカーアイコンをカスタマイズ */
            .datetime-input-field::-webkit-calendar-picker-indicator {
              position: absolute;
              right: 12px;
              width: 24px;
              height: 24px;
              cursor: pointer;
              background: none;
              color: #b0c4d8;
              opacity: 0;
              z-index: 3;
            }

            /* カスタムアイコンのスタイル */
            .custom-calendar-icon {
              position: absolute;
              right: 12px;
              top: 50%;
              transform: translateY(-50%);
              background: none;
              border: none;
              color: #b0c4d8;
              cursor: pointer;
              padding: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: color 0.2s;
              z-index: 2;
              min-width: 24px;
              min-height: 24px;
              border-radius: 4px;
              pointer-events: none;
            }

            .datetime-input-field:hover + .custom-calendar-icon,
            .datetime-input-field:focus + .custom-calendar-icon {
              color: #00c8ff;
            }

            .datetime-input-field:disabled + .custom-calendar-icon {
              opacity: 0.5;
              cursor: not-allowed;
            }
          `}
        </style>

        <div className={`datetime-input-wrapper ${className}`}>
          <input
            ref={actualRef}
            id={id}
            type="datetime-local"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            aria-describedby={ariaDescribedBy}
            aria-label={ariaLabel || 'ダウンロード可能日時'}
            className={`datetime-input-field ${error ? 'error' : ''}`}
            {...props}
          />

          {/* カスタムカレンダーアイコン（視覚的表示のみ） */}
          <div className="custom-calendar-icon" data-testid="calendar-icon">
            <Icons.Calendar size={16} color="currentColor" />
          </div>
        </div>
      </>
    );
  }
);

DateTimeInput.displayName = 'DateTimeInput';
