'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { usePrefetchSearch } from '@/hooks/useSearch';
import type { SearchParams } from '@/types/search';

interface SearchFormProps {
  /** 検索タイプ（team または match） */
  searchType: 'team' | 'match';
  /** プレースホルダーテキスト */
  placeholder?: string;
  /** 検索実行時のコールバック */
  onSearch?: (params: SearchParams) => void;
  /** デバウンス遅延時間（ミリ秒） */
  debounceDelay?: number;
}

/**
 * 改善された検索フォームコンポーネント
 * - デバウンス機能付き
 * - プリフェッチ対応
 * - アクセシビリティ対応
 */
export function SearchForm({
  searchType,
  placeholder = 'キーワードを入力してください',
  onSearch,
  debounceDelay = 300,
}: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  // デバウンス処理
  const debouncedQuery = useDebounce(query, debounceDelay);

  // プリフェッチ機能
  const { prefetchTeamSearch, prefetchMatchSearch } = usePrefetchSearch();

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

  // 検索実行
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!query.trim()) return;

      const params: SearchParams = {
        keyword: query.trim(),
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
    [query, searchParams, router, onSearch]
  );

  // 入力変更処理
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    },
    []
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
    const urlParams = new URLSearchParams(searchParams.toString());
    urlParams.delete('keyword');
    urlParams.delete('page');
    router.push(`?${urlParams.toString()}`);
  }, [searchParams, router]);

  return (
    <form
      onSubmit={handleSubmit}
      style={{ width: '100%', maxWidth: '800px', position: 'relative' }}
      role="search"
      aria-label={`${searchType === 'team' ? 'チーム' : 'マッチ'}検索フォーム`}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#111A2E',
          borderRadius: '9999px',
          border: '1px solid #1E3A5F',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <input
          type="search"
          value={query}
          onChange={handleInputChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '14px 24px',
            background: 'transparent',
            color: '#fff',
            border: 'none',
            outline: 'none',
            fontSize: '1.1rem',
            // ブラウザのデフォルトクリアボタンを非表示
            WebkitAppearance: 'none',
            appearance: 'none',
          }}
          aria-label="検索キーワード"
          autoComplete="off"
          spellCheck="false"
        />

        {/* クリアボタン */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              padding: '8px',
              color: '#4A6FA5',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
            aria-label="検索をクリア"
            onMouseOver={e => {
              e.currentTarget.style.color = '#fff';
            }}
            onMouseOut={e => {
              e.currentTarget.style.color = '#4A6FA5';
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        <button
          type="submit"
          aria-label="検索"
          disabled={!query.trim()}
          style={{
            background: 'linear-gradient(90deg, #3B82F6, #00c8ff)',
            border: 'none',
            borderRadius: '50%',
            width: 44,
            height: 44,
            marginLeft: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: !query.trim() ? 'not-allowed' : 'pointer',
            opacity: query.trim() ? 1 : 0.6,
            transition: 'box-shadow .2s, opacity .2s',
            boxShadow: query.trim() ? '0 0 0 2px #00c8ff33' : 'none',
          }}
          onMouseOver={e => {
            if (query.trim())
              e.currentTarget.style.boxShadow = '0 0 8px 2px #00c8ff88';
          }}
          onMouseOut={e => {
            if (query.trim())
              e.currentTarget.style.boxShadow = '0 0 0 2px #00c8ff33';
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10" cy="10" r="7" stroke="#fff" strokeWidth="2" />
            <line
              x1="16"
              y1="16"
              x2="20"
              y2="20"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}
