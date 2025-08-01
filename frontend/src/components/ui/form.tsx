'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type {
  DateInputProps,
  FileInputProps,
  FormFieldProps,
  SelectOption,
} from '@/types/form';
import { Input } from './input';

/**
 * フォームフィールドコンポーネント
 */
export function FormField({
  name,
  label,
  placeholder,
  required,
  disabled,
  error,
  children,
  className,
}: FormFieldProps & { children: React.ReactNode; className?: string }) {
  const id = `field-${name}`;

  return (
    <div className={cn('mb-4', className)}>
      <label
        htmlFor={id}
        className={cn(
          'block text-sm font-medium mb-1',
          error ? 'text-red-400' : 'text-gray-200'
        )}
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {React.cloneElement(children as React.ReactElement<any>, {
        id,
        name,
        placeholder,
        required,
        disabled,
        'aria-invalid': error ? 'true' : 'false',
        'aria-describedby': error ? `${id}-error` : undefined,
      })}

      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * テキスト入力フィールド
 */
export function TextField(props: FormFieldProps) {
  return (
    <FormField {...props}>
      <Input
        type="text"
        className={cn(
          'w-full',
          props.error && 'border-red-500 focus:border-red-500'
        )}
      />
    </FormField>
  );
}

/**
 * パスワード入力フィールド
 */
export function PasswordField(props: FormFieldProps) {
  return (
    <FormField {...props}>
      <Input
        type="password"
        className={cn(
          'w-full',
          props.error && 'border-red-500 focus:border-red-500'
        )}
      />
    </FormField>
  );
}

/**
 * メール入力フィールド
 */
export function EmailField(props: FormFieldProps) {
  return (
    <FormField {...props}>
      <Input
        type="email"
        className={cn(
          'w-full',
          props.error && 'border-red-500 focus:border-red-500'
        )}
      />
    </FormField>
  );
}

/**
 * テキストエリアフィールド
 */
export function TextareaField(props: FormFieldProps) {
  const _id = `field-${props.name}`;

  return (
    <FormField {...props}>
      <textarea
        className={cn(
          'w-full min-h-[100px] rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm shadow-xs',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
          props.error && 'border-red-500 focus:border-red-500'
        )}
      />
    </FormField>
  );
}

/**
 * ファイル入力フィールド
 */
export function FileField({
  accept,
  multiple,
  maxSize,
  ...props
}: FileInputProps) {
  const _id = `field-${props.name}`;

  return (
    <FormField {...props}>
      <Input
        type="file"
        accept={accept}
        multiple={multiple}
        className={cn(
          'w-full',
          props.error && 'border-red-500 focus:border-red-500'
        )}
      />
    </FormField>
  );
}

/**
 * 日付入力フィールド
 */
export function DateField({ min, max, ...props }: DateInputProps) {
  const _id = `field-${props.name}`;

  return (
    <FormField {...props}>
      <Input
        type="date"
        min={min}
        max={max}
        className={cn(
          'w-full',
          props.error && 'border-red-500 focus:border-red-500'
        )}
      />
    </FormField>
  );
}

/**
 * セレクトフィールド
 */
export function SelectField({
  options,
  ...props
}: FormFieldProps & { options: SelectOption[] }) {
  const _id = `field-${props.name}`;

  return (
    <FormField {...props}>
      <select
        className={cn(
          'w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm shadow-xs',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
          props.error && 'border-red-500 focus:border-red-500'
        )}
      >
        <option value="">選択してください</option>
        {options.map(option => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}
