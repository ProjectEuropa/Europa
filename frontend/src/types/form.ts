/**
 * フォーム関連の型定義
 */

export interface FormState<T = any> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FileInputProps extends Omit<FormFieldProps, 'placeholder'> {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
}

export interface DateInputProps extends FormFieldProps {
  min?: string;
  max?: string;
}
