'use client';

import { memo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, TrendingUp, Search } from 'lucide-react';
import { highlightMatch } from '@/hooks/useSearchSuggestions';

interface Suggestion {
  value: string;
  type: 'tag' | 'history' | 'popular';
  score: number;
}

interface SearchAutocompleteProps {
  /** サジェスション一覧 */
  suggestions: Suggestion[];
  /** 現在の検索クエリ（ハイライト用） */
  query: string;
  /** 表示フラグ */
  isOpen: boolean;
  /** 選択中のインデックス */
  selectedIndex: number;
  /** サジェスション選択時のコールバック */
  onSelect: (value: string) => void;
  /** マウスホバー時のコールバック */
  onHover: (index: number) => void;
  /** ローディング状態 */
  isLoading?: boolean;
}

/**
 * オートコンプリートドロップダウンコンポーネント
 */
export const SearchAutocomplete = memo(function SearchAutocomplete({
  suggestions,
  query,
  isOpen,
  selectedIndex,
  onSelect,
  onHover,
  isLoading = false,
}: SearchAutocompleteProps) {
  const listRef = useRef<HTMLUListElement>(null);

  // 選択中のアイテムをスクロールして表示
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedItem = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedItem) {
        selectedItem.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [selectedIndex]);

  const handleItemClick = useCallback(
    (value: string) => {
      onSelect(value);
    },
    [onSelect]
  );

  const handleItemMouseEnter = useCallback(
    (index: number) => {
      onHover(index);
    },
    [onHover]
  );

  // アイコンを取得
  const getIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'tag':
        return <Tag size={10} className="text-slate-500" />;
      case 'popular':
        return <TrendingUp size={10} className="text-slate-500" />;
      case 'history':
        return <Search size={10} className="text-slate-500" />;
      default:
        return <Tag size={10} className="text-slate-500" />;
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.1 }}
          className="
            absolute top-full left-0 right-0 mt-1 z-50
            bg-slate-900/90 backdrop-blur-sm
            border border-slate-700/50 rounded-lg
            shadow-lg
            overflow-hidden
          "
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-4 px-6">
              <div className="w-5 h-5 border-2 border-transparent border-t-cyan-400 rounded-full animate-spin" />
              <span className="ml-2 text-slate-400 text-sm">検索中...</span>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="py-4 px-6 text-slate-400 text-sm text-center">
              候補が見つかりませんでした
            </div>
          ) : (
            <>

              {/* サジェスションリスト */}
              <ul
                ref={listRef}
                className="max-h-36 overflow-y-auto"
                role="listbox"
                aria-label="検索サジェスション"
              >
                {suggestions.map((suggestion, index) => {
                  const isSelected = index === selectedIndex;
                  const highlightedParts = highlightMatch(suggestion.value, query);

                  return (
                    <li
                      key={`${suggestion.type}-${suggestion.value}`}
                      role="option"
                      aria-selected={isSelected}
                      className={`
                        flex items-center gap-1.5 px-2 py-1 cursor-pointer
                        ${isSelected
                          ? 'bg-slate-700/50 text-white'
                          : 'text-slate-300 hover:bg-slate-800/30'
                        }
                      `}
                      onClick={() => handleItemClick(suggestion.value)}
                      onMouseEnter={() => handleItemMouseEnter(index)}
                    >
                      {/* アイコン */}
                      <span className="flex-shrink-0">
                        {getIcon(suggestion.type)}
                      </span>

                      {/* テキスト（ハイライト付き） */}
                      <span className="flex-1 text-xs truncate">
                        {highlightedParts.map((part, i) => (
                          <span
                            key={i}
                            className={part.isMatch ? 'text-cyan-400 font-semibold' : ''}
                          >
                            {part.text}
                          </span>
                        ))}
                      </span>

                    </li>
                  );
                })}
              </ul>

            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
});
