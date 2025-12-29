'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Search, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCallback, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';
import { useAutocomplete } from '@/hooks/useAutocomplete';
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
  const [isComposing, setIsComposing] = useState(false);

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

  // 検索実行
  const executeSearch = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      setValue('query', trimmed);
      onSearch(trimmed);
    },
    [onSearch, setValue]
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
    onExecuteSearch: executeSearch,
  });

  const onSubmit = (data: SumDownloadSearchFormData) => {
    executeSearch(data.query);
  };

  const handleClear = () => {
    setValue('query', '');
    onSearch('');
    resetSelectedIndex();
    inputRef.current?.focus();
  };

  // IME入力処理
  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(() => {
    setIsComposing(false);
  }, []);

  // 入力変更時に選択をリセット
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue('query', e.target.value);
      resetSelectedIndex();
    },
    [setValue, resetSelectedIndex]
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
            onKeyDown={handleAutocompleteKeyDown}
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
          onSelect={handleAutocompleteSelect}
          onHover={handleSuggestionHover}
          isLoading={suggestionsLoading}
        />
      )}
    </div>
  );
};
