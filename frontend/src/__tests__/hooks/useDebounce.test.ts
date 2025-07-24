import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // 値を変更
    rerender({ value: 'updated', delay: 500 });

    // まだ遅延時間が経過していないので、古い値のまま
    expect(result.current).toBe('initial');

    // 時間を進める
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // 遅延時間が経過したので、新しい値になる
    expect(result.current).toBe('updated');
  });

  it('should reset timer on rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // 最初の変更
    rerender({ value: 'first', delay: 500 });

    // 250ms経過
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // まだ変更されていない
    expect(result.current).toBe('initial');

    // 2回目の変更（タイマーがリセットされる）
    rerender({ value: 'second', delay: 500 });

    // さらに250ms経過（合計500ms）
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // まだ最初の値（タイマーがリセットされたため）
    expect(result.current).toBe('initial');

    // さらに250ms経過（2回目の変更から500ms）
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // 最後の値に更新される
    expect(result.current).toBe('second');
  });

  it('should handle different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 1000 } }
    );

    rerender({ value: 'updated', delay: 1000 });

    // 500ms経過では変更されない
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe('initial');

    // 1000ms経過で変更される
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe('updated');
  });

  it('should handle zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 0 } }
    );

    rerender({ value: 'immediate', delay: 0 });

    // 遅延なしで即座に更新される
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(result.current).toBe('immediate');
  });

  it('should work with different data types', () => {
    // 数値
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 100 } }
    );

    numberRerender({ value: 42, delay: 100 });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(numberResult.current).toBe(42);

    // オブジェクト
    const { result: objectResult, rerender: objectRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: { id: 1 }, delay: 100 } }
    );

    const newObject = { id: 2, name: 'test' };
    objectRerender({ value: newObject, delay: 100 });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(objectResult.current).toEqual(newObject);

    // 配列
    const { result: arrayResult, rerender: arrayRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: [1, 2], delay: 100 } }
    );

    const newArray = [3, 4, 5];
    arrayRerender({ value: newArray, delay: 100 });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(arrayResult.current).toEqual(newArray);
  });

  it('should cleanup timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { unmount } = renderHook(() => useDebounce('test', 500));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
