'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { usePrefetchSearch } from '@/hooks/useSearch';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';
import { useAutocomplete } from '@/hooks/useAutocomplete';
import { SearchAutocomplete } from '@/components/search/SearchAutocomplete';
import type { SearchParams } from '@/types/search';
import { Search, X } from 'lucide-react';

interface SearchFormProps {
  /** 検索タイプ（team または match） */
  searchType: 'team' | 'match';
  /** プレースホルダーテキスト */
  placeholder?: string;
  /** 検索実行時のコールバック */
  onSearch?: (params: SearchParams) => void;
  /** デバウンス遅延時間（ミリ秒） */
  debounceDelay?: number;
  /** オートコンプリートを有効にするか */
  enableAutocomplete?: boolean;
}

/**
 * 改善された検索フォームコンポーネント
 * - デバウンス機能付き
 * - プリフェッチ対応
 * - オートコンプリート対応
 * - アクセシビリティ対応
 * - Tailwind CSSによるスタイリング
 */
export function SearchForm({
  searchType,
  placeholder = 'キーワードを入力してください',
  onSearch,
  debounceDelay = 300,
  enableAutocomplete = true,
}: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  // デバウンス処理
  const debouncedQuery = useDebounce(query, debounceDelay);

  // プリフェッチ機能
  const { prefetchTeamSearch, prefetchMatchSearch } = usePrefetchSearch();

  // 検索実行
  const executeSearch = useCallback(
    (keyword: string) => {
      if (!keyword.trim()) return;

      const params: SearchParams = {
        keyword: keyword.trim(),
        page: 1,
      };

      // URLを更新
      const urlParams = new URLSearchParams(searchParams.toString());
      urlParams.set('keyword', params.keyword);
      urlParams.set('page', '1');
      router.push(`?${urlParams.toString()}`);

      // コールバック実行
      onSearch?.(params);
    },
    [searchParams, router, onSearch]
  );

  // オートコンプリートサジェスション
  const { suggestions, isLoading: suggestionsLoading } = useSearchSuggestions({
    query: debouncedQuery,
    enabled: enableAutocomplete,
    limit: 8,
  });

  // オートコンプリート機能
  const {
    isFocused,
    selectedIndex,
    showAutocomplete,
    formRef,
    inputRef,
    handleFocus,
    handleKeyDown: handleAutocompleteKeyDown,
    handleSuggestionSelect: handleAutocompleteSelect,
    handleSuggestionHover,
    resetSelectedIndex,
  } = useAutocomplete({
    suggestions,
    enabled: enableAutocomplete,
    isComposing,
    onExecuteSearch: (value) => {
      setQuery(value);
      executeSearch(value);
    },
  });

  // URLパラメータから初期値を設定
  useEffect(() => {
    const keyword = searchParams.get('keyword') || '';
    setQuery(keyword);
  }, [searchParams]);

  // デバウンス後のプリフェッチ処理
  useEffect(() => {
    if (!debouncedQuery.trim() || isComposing) return;

    const params: SearchParams = {
      keyword: debouncedQuery,
      page: 1,
    };

    // 検索タイプに応じてプリフェッチ
    if (searchType === 'team') {
      prefetchTeamSearch(params);
    } else {
      prefetchMatchSearch(params);
    }
  }, [
    debouncedQuery,
    searchType,
    prefetchTeamSearch,
    prefetchMatchSearch,
    isComposing,
  ]);

  // フォーム送信
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      executeSearch(query);
    },
    [query, executeSearch]
  );

  // 入力変更処理
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      resetSelectedIndex(); // 選択をリセット
    },
    [resetSelectedIndex]
  );

  // IME入力処理
  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(() => {
    setIsComposing(false);
  }, []);

  // クリア処理
  const handleClear = useCallback(() => {
    setQuery('');
    resetSelectedIndex();
    const urlParams = new URLSearchParams(searchParams.toString());
    urlParams.delete('keyword');
    urlParams.delete('page');
    router.push(`?${urlParams.toString()}`);
    inputRef.current?.focus();
  }, [searchParams, router, resetSelectedIndex, inputRef]);

  return (
    <div ref={formRef} className="w-full max-w-3xl relative">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center w-full"
        role="search"
        aria-label={`${searchType === 'team' ? 'チーム' : 'マッチ'}検索フォーム`}
      >
        <div className="
          w-full flex items-center
          bg-[#0a0818]
          border border-slate-700
          rounded-full
          overflow-hidden
          shadow-[0_0_10px_rgba(0,0,0,0.3)]
          focus-within:border-cyan-500
          focus-within:shadow-[0_0_15px_rgba(6,182,212,0.3)]
          transition-all duration-300
        ">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onKeyDown={handleAutocompleteKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder={placeholder}
            className="
              w-full px-6 py-3.5
              bg-transparent
              text-white text-lg
              placeholder-slate-400
              border-none outline-none
              appearance-none
            "
            aria-label="検索キーワード"
            aria-autocomplete="list"
            aria-controls="search-suggestions"
            aria-expanded={showAutocomplete}
            autoComplete="off"
            spellCheck="false"
          />

          {/* クリアボタン */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="
                p-2 mr-1
                text-slate-400
                hover:text-white
                transition-colors duration-200
                focus:outline-none focus:text-white
              "
              aria-label="検索をクリア"
            >
              <X size={20} />
            </button>
          )}

          <button
            type="submit"
            aria-label="検索"
            disabled={!query.trim()}
            className={`
              flex items-center justify-center
              w-12 h-12 m-1.5 rounded-full
              border-none
              bg-gradient-to-r from-blue-600 to-cyan-500
              text-white
              transition-all duration-300
              ${!query.trim()
                ? 'opacity-60 cursor-not-allowed'
                : 'opacity-100 hover:shadow-[0_0_10px_rgba(6,182,212,0.6)] cursor-pointer'
              }
            `}
          >
            <Search size={22} strokeWidth={2.5} />
          </button>
        </div>
      </form>

      {/* オートコンプリートドロップダウン */}
      {enableAutocomplete && (
        <SearchAutocomplete
          id="search-suggestions"
          suggestions={suggestions}
          query={query}
          isOpen={showAutocomplete}
          selectedIndex={selectedIndex}
          onSelect={handleAutocompleteSelect}
          onHover={handleSuggestionHover}
          isLoading={suggestionsLoading}
        />
      )}
    </div>
  );
}
