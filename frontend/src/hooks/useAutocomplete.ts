import { useCallback, useEffect, useRef, useState } from 'react';
import type { SearchSuggestion } from '@/hooks/useSearchSuggestions';

export interface UseAutocompleteOptions {
  /** サジェスションリスト */
  suggestions: SearchSuggestion[];
  /** オートコンプリート有効フラグ */
  enabled: boolean;
  /** IME入力中フラグ */
  isComposing: boolean;
  /** 検索実行コールバック */
  onExecuteSearch: (value: string) => void;
}

export interface UseAutocompleteReturn {
  /** フォーカス状態 */
  isFocused: boolean;
  /** 選択中のインデックス */
  selectedIndex: number;
  /** オートコンプリート表示フラグ */
  showAutocomplete: boolean;
  /** フォームのref */
  formRef: React.RefObject<HTMLDivElement | null>;
  /** 入力欄のref */
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** フォーカスハンドラ */
  handleFocus: () => void;
  /** キーボードナビゲーションハンドラ */
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** サジェスション選択ハンドラ */
  handleSuggestionSelect: (value: string) => void;
  /** サジェスションホバーハンドラ */
  handleSuggestionHover: (index: number) => void;
  /** 選択インデックスをリセット */
  resetSelectedIndex: () => void;
  /** フォーカスを閉じる */
  closeFocus: () => void;
}

/**
 * オートコンプリート機能の共通ロジックを提供するカスタムフック
 *
 * @description
 * SearchFormとSumDownloadFormで共通のオートコンプリートロジックを
 * 抽出したカスタムフック。状態管理、イベントハンドリング、
 * キーボードナビゲーションなどを提供します。
 *
 * @example
 * ```tsx
 * const {
 *   isFocused,
 *   showAutocomplete,
 *   formRef,
 *   inputRef,
 *   handleFocus,
 *   handleKeyDown,
 *   handleSuggestionSelect,
 * } = useAutocomplete({
 *   suggestions,
 *   enabled: true,
 *   isComposing,
 *   onExecuteSearch: (value) => { ... },
 * });
 * ```
 */
export function useAutocomplete({
  suggestions,
  enabled,
  isComposing,
  onExecuteSearch,
}: UseAutocompleteOptions): UseAutocompleteReturn {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const formRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // オートコンプリート表示判定
  const showAutocomplete = enabled && isFocused && !isComposing && suggestions.length > 0;

  // フォーカスを閉じる
  const closeFocus = useCallback(() => {
    setIsFocused(false);
    setSelectedIndex(-1);
  }, []);

  // 外側クリックでオートコンプリートを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        closeFocus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeFocus]);

  // フォーカス処理
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  // 選択インデックスをリセット
  const resetSelectedIndex = useCallback(() => {
    setSelectedIndex(-1);
  }, []);

  // キーボードナビゲーション
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showAutocomplete) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            e.preventDefault();
            const selected = suggestions[selectedIndex].value;
            onExecuteSearch(selected);
            closeFocus();
          }
          break;
        case 'Escape':
          e.preventDefault();
          closeFocus();
          inputRef.current?.blur();
          break;
        case 'Tab':
          // Tabキーでオートコンプリートを閉じる
          closeFocus();
          break;
      }
    },
    [showAutocomplete, suggestions, selectedIndex, onExecuteSearch, closeFocus]
  );

  // サジェスション選択
  const handleSuggestionSelect = useCallback(
    (value: string) => {
      onExecuteSearch(value);
      closeFocus();
    },
    [onExecuteSearch, closeFocus]
  );

  // サジェスションホバー
  const handleSuggestionHover = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  return {
    isFocused,
    selectedIndex,
    showAutocomplete,
    formRef,
    inputRef,
    handleFocus,
    handleKeyDown,
    handleSuggestionSelect,
    handleSuggestionHover,
    resetSelectedIndex,
    closeFocus,
  };
}
