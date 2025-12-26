'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Search, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';
import { SearchAutocomplete } from '@/components/search/SearchAutocomplete';

const sumDownloadSearchSchema = z.object({
  query: z.string().max(100, '検索クエリは100文字以内で入力してください'),
});

type SumDownloadSearchFormData = z.infer<typeof sumDownloadSearchSchema>;

interface SumDownloadFormProps {
  searchType: 'team' | 'match';
  onSearch: (query: string) => void;
  loading?: boolean;
  initialQuery?: string;
  enableAutocomplete?: boolean;
}

export const SumDownloadForm = ({
  searchType,
  onSearch,
  loading = false,
  initialQuery = '',
  enableAutocomplete = true,
}: SumDownloadFormProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const formRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SumDownloadSearchFormData>({
    resolver: zodResolver(sumDownloadSearchSchema),
    defaultValues: {
      query: initialQuery,
    },
  });

  const queryValue = watch('query');
  const debouncedQuery = useDebounce(queryValue, 200);

  // オートコンプリートサジェスション
  const { suggestions, isLoading: suggestionsLoading } = useSearchSuggestions({
    query: debouncedQuery,
    enabled: enableAutocomplete && isFocused,
    limit: 8,
  });

  // オートコンプリート表示判定
  const showAutocomplete = enableAutocomplete && isFocused && !isComposing && suggestions.length > 0;

  // 外側クリックでオートコンプリートを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 検索実行
  const executeSearch = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      setValue('query', trimmed);
      onSearch(trimmed);
      setIsFocused(false);
      setSelectedIndex(-1);
    },
    [onSearch, setValue]
  );

  const onSubmit = (data: SumDownloadSearchFormData) => {
    executeSearch(data.query);
  };

  const handleClear = () => {
    setValue('query', '');
    onSearch('');
    inputRef.current?.focus();
  };

  // フォーカス処理
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  // IME入力処理
  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(() => {
    setIsComposing(false);
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
            executeSearch(suggestions[selectedIndex].value);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsFocused(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
        case 'Tab':
          setIsFocused(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [showAutocomplete, suggestions, selectedIndex, executeSearch]
  );

  // サジェスション選択
  const handleSuggestionSelect = useCallback(
    (value: string) => {
      executeSearch(value);
    },
    [executeSearch]
  );

  // サジェスションホバー
  const handleSuggestionHover = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  // 入力変更時に選択をリセット
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue('query', e.target.value);
      setSelectedIndex(-1);
    },
    [setValue]
  );

  const placeholderText =
    searchType === 'team' ? 'チーム名で検索' : 'マッチ名で検索';

  // register を使いつつ ref を保持
  const { ref: registerRef, ...registerRest } = register('query');

  return (
    <div ref={formRef} className="w-full max-w-3xl relative">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative flex items-center w-full"
      >
        <div className="
          w-full flex items-center
          bg-slate-900
          border border-slate-700
          rounded-full
          overflow-hidden
          shadow-[0_0_10px_rgba(0,0,0,0.3)]
          focus-within:border-cyan-500
          focus-within:shadow-[0_0_15px_rgba(6,182,212,0.3)]
          transition-all duration-300
        ">
          <input
            {...registerRest}
            ref={(e) => {
              registerRef(e);
              inputRef.current = e;
            }}
            type="text"
            placeholder={placeholderText}
            disabled={loading}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            className="
              w-full px-6 py-3.5
              bg-transparent
              text-white text-lg
              placeholder-slate-400
              border-none outline-none
              appearance-none
            "
            aria-label="検索ワード"
            aria-autocomplete="list"
            aria-controls="sumdownload-suggestions"
            aria-expanded={showAutocomplete}
            autoComplete="off"
          />

          {/* クリアボタン */}
          {queryValue && (
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
            disabled={loading}
            className={`
              flex items-center justify-center
              w-12 h-12 m-1.5 rounded-full
              border-none
              bg-gradient-to-r from-blue-600 to-cyan-500
              text-white
              transition-all duration-300
              ${loading
                ? 'opacity-60 cursor-not-allowed'
                : 'opacity-100 hover:shadow-[0_0_10px_rgba(6,182,212,0.6)] cursor-pointer'
              }
            `}
            aria-label="検索実行"
          >
            <Search size={22} strokeWidth={2.5} />
          </button>
        </div>

        {errors.query && (
          <p className="absolute top-full left-6 mt-1 text-red-400 text-sm whitespace-nowrap">
            {errors.query.message}
          </p>
        )}
      </form>

      {/* オートコンプリートドロップダウン */}
      {enableAutocomplete && (
        <SearchAutocomplete
          id="sumdownload-suggestions"
          suggestions={suggestions}
          query={queryValue}
          isOpen={showAutocomplete}
          selectedIndex={selectedIndex}
          onSelect={handleSuggestionSelect}
          onHover={handleSuggestionHover}
          isLoading={suggestionsLoading}
        />
      )}
    </div>
  );
};
