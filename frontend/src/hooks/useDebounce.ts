import { useEffect, useRef, useState } from 'react';

/**
 * 値の変更をデバウンスするカスタムフック
 * @param value デバウンスする値
 * @param delay デバウンス遅延時間（ミリ秒）
 * @returns デバウンスされた値
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 既存のタイマーをクリア
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 新しいタイマーを設定
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // クリーンアップ関数
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}
