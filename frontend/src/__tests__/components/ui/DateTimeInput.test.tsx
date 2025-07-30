import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DateTimeInput } from '@/components/ui/datetime-input';

describe('DateTimeInput', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('基本的なレンダリングが正しく行われる', () => {
    render(<DateTimeInput {...defaultProps} />);

    const input = screen.getByDisplayValue('');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'datetime-local');
  });

  it('カレンダーアイコンが表示される', () => {
    render(<DateTimeInput {...defaultProps} />);

    const calendarIcon = screen.getByTestId('calendar-icon');
    expect(calendarIcon).toBeInTheDocument();
  });

  it('値の変更が正しく処理される', () => {
    const onChange = vi.fn();
    render(<DateTimeInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByDisplayValue('');
    fireEvent.change(input, { target: { value: '2024-01-01T12:00' } });

    expect(onChange).toHaveBeenCalledWith('2024-01-01T12:00');
  });

  it('disabled状態が正しく反映される', () => {
    render(<DateTimeInput {...defaultProps} disabled />);

    const input = screen.getByDisplayValue('');
    expect(input).toBeDisabled();
  });

  it('エラー状態でクラスが適用される', () => {
    render(<DateTimeInput {...defaultProps} error />);

    const input = screen.getByDisplayValue('');
    expect(input).toHaveClass('error');
  });

  it('aria属性が正しく設定される', () => {
    render(
      <DateTimeInput
        {...defaultProps}
        id="test-datetime"
        aria-label="テスト日時"
        aria-describedby="test-help"
      />
    );

    const input = screen.getByDisplayValue('');
    expect(input).toHaveAttribute('id', 'test-datetime');
    expect(input).toHaveAttribute('aria-label', 'テスト日時');
    expect(input).toHaveAttribute('aria-describedby', 'test-help');
  });

  it('デフォルトのaria-labelが設定される', () => {
    render(<DateTimeInput {...defaultProps} />);

    const input = screen.getByDisplayValue('');
    expect(input).toHaveAttribute('aria-label', 'ダウンロード可能日時');
  });

  it('カスタムクラス名が適用される', () => {
    render(<DateTimeInput {...defaultProps} className="custom-class" />);

    const container = screen.getByDisplayValue('').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('値が設定されている場合に正しく表示される', () => {
    render(<DateTimeInput {...defaultProps} value="2024-01-01T12:00" />);

    const input = screen.getByDisplayValue('2024-01-01T12:00');
    expect(input).toBeInTheDocument();
  });
});
