'use client';

import { memo, useMemo, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { DeleteModal } from '@/components/DeleteModal';
import { useDeleteFile } from '@/hooks/useSearch';
import type { MatchFile, TeamFile } from '@/types/file';
import type { PaginationMeta } from '@/types/search';
import { Download, Trash2, AlertCircle, SearchX, ChevronLeft, ChevronRight, LayoutGrid, LayoutList, User, Calendar, FileText, Tag } from 'lucide-react';

interface SearchResultsProps {
  /** 検索結果データ */
  results: (TeamFile | MatchFile)[];
  /** ページネーション情報 */
  meta: PaginationMeta;
  /** ローディング状態 */
  loading?: boolean;
  /** エラー状態 */
  error?: string | null;
  /** ページ変更ハンドラー */
  onPageChange: (page: number) => void;
  /** ダウンロードハンドラー */
  onDownload: (file: TeamFile | MatchFile) => void;
  /** タグクリックハンドラー */
  onTagClick?: (tag: string) => void;
}

/**
 * 最適化された検索結果表示コンポーネント
 * - メモ化による再レンダリング最適化
 * - 仮想化対応（大量データ用）
 * - アクセシビリティ対応
 * - Tailwind CSSスタイリング
 */
export const SearchResults = memo<SearchResultsProps>(
  ({
    results,
    meta,
    loading = false,
    error = null,
    onPageChange,
    onDownload,
    onTagClick,
  }) => {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{
      id: number;
      name: string;
    } | null>(null);

    // レスポンシブ判定（タブレット以下: 1024px未満）
    const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

    // ユーザーが手動で選択したビューモード（localStorageで永続化）
    const [userPreference, setUserPreference] = useState<'table' | 'card' | null>(null);

    // クライアントサイドマウント後にlocalStorageを読み込み、画面サイズを監視
    useEffect(() => {
      // localStorageから設定を復元
      const saved = localStorage.getItem('searchViewMode');
      if (saved === 'card' || saved === 'table') {
        setUserPreference(saved);
      }

      // 画面サイズチェック
      const checkScreenSize = () => {
        setIsMobileOrTablet(window.innerWidth < 1024);
      };

      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);
      return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // 実際のビューモード（モバイル/タブレットでは強制カード、それ以外はユーザー設定優先）
    const viewMode = isMobileOrTablet ? 'card' : (userPreference ?? 'table');

    // ビューモード手動変更（デスクトップのみ有効）
    const setViewMode = (mode: 'table' | 'card') => {
      setUserPreference(mode);
      localStorage.setItem('searchViewMode', mode);
    };

    const deleteFileMutation = useDeleteFile();

    // 安全な日付フォーマット関数
    const formatDate = (
      dateValue: string | null | undefined,
      isDownloadableAt = false
    ): string => {
      if (!dateValue) {
        return isDownloadableAt ? '即座にダウンロード可能' : '未設定';
      }

      const date = new Date(dateValue);
      if (Number.isNaN(date.getTime())) return '無効な日付';

      // UTCの値をそのまま表示（APIがUTCとして返すが、実際はJSTの入力値そのまま）
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth() + 1;
      const day = date.getUTCDate();
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      const seconds = date.getUTCSeconds();

      return `${year}/${month}/${day} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // 結果データの前処理（メモ化）
    const processedResults = useMemo(() => {
      return results.map(result => ({
        ...result,
        formattedCreatedAt: formatDate(result.created_at),
        formattedDownloadableAt: formatDate(result.downloadableAt, true),
        tags: [
          result.searchTag1,
          result.searchTag2,
          result.searchTag3,
          result.searchTag4,
        ].filter((tag): tag is string => !!tag),
      }));
    }, [results]);

    // 削除処理
    const handleDeleteClick = (file: TeamFile | MatchFile) => {
      setDeleteTarget({ id: file.id, name: file.name });
      setDeleteModalOpen(true);
    };

    const handleDelete = async (password: string) => {
      if (!deleteTarget) return;

      try {
        await deleteFileMutation.mutateAsync({
          id: deleteTarget.id,
          deletePassword: password,
        });
        toast.success('ファイルを削除しました');
        setDeleteModalOpen(false);
        setDeleteTarget(null);
      } catch (error: any) {
        console.error('[SearchResults] Delete error:', error);
        toast.error(error.message || 'ファイルの削除に失敗しました');
      }
    };

    // ページネーションボタン生成（メモ化）
    const paginationButtons = useMemo(() => {
      const buttons: (number | 'ellipsis')[] = [];
      const { currentPage, lastPage } = meta;
      const maxVisiblePages = 5;

      if (lastPage <= maxVisiblePages) {
        // 全ページを表示
        for (let i = 1; i <= lastPage; i++) {
          buttons.push(i);
        }
      } else {
        // 省略記号付きページネーション
        if (currentPage <= 3) {
          // 最初の方のページ
          for (let i = 1; i <= 4; i++) {
            buttons.push(i);
          }
          buttons.push('ellipsis');
          buttons.push(lastPage);
        } else if (currentPage >= lastPage - 2) {
          // 最後の方のページ
          buttons.push(1);
          buttons.push('ellipsis');
          for (let i = lastPage - 3; i <= lastPage; i++) {
            buttons.push(i);
          }
        } else {
          // 中間のページ
          buttons.push(1);
          buttons.push('ellipsis');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            buttons.push(i);
          }
          buttons.push('ellipsis');
          buttons.push(lastPage);
        }
      }

      return buttons;
    }, [meta]);

    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-2 border-transparent border-t-cyan-400 rounded-full animate-spin"></div>
          <span className="ml-3 text-cyan-400">検索中...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="text-red-500 mb-4 flex flex-col items-center">
            <AlertCircle size={48} className="mb-2" />
            <p className="text-lg font-medium">{error}</p>
          </div>
        </div>
      );
    }

    if (processedResults.length === 0 && !loading) {
      return (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4 flex flex-col items-center">
            <SearchX size={48} className="mb-2" />
            <p className="text-lg font-medium">検索結果が見つかりませんでした</p>
            <p className="text-sm mt-2">別のキーワードで検索してみてください</p>
          </div>
        </div>
      );
    }

    return (
      <>
        <DeleteModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          onDelete={handleDelete}
          fileName={deleteTarget?.name || ''}
        />

        <div className="w-full mt-8">
          {/* 結果ヘッダー + ビュー切り替え */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 px-4">
            <div className="text-cyan-400 font-medium">
              {meta.total}件の結果 (ページ {meta.currentPage}/{meta.lastPage})
            </div>

            {/* ビュー切り替えトグル（デスクトップのみ表示） */}
            {!isMobileOrTablet && (
              <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                    ${viewMode === 'table'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                      : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800'}
                  `}
                  aria-label="テーブル表示"
                  title="テーブル表示"
                >
                  <LayoutList size={18} />
                  <span className="hidden sm:inline">テーブル</span>
                </button>
                <button
                  onClick={() => setViewMode('card')}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                  ${viewMode === 'card'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800'}
                `}
                aria-label="カード表示"
                title="カード表示"
              >
                <LayoutGrid size={18} />
                <span className="hidden sm:inline">カード</span>
                </button>
              </div>
            )}
          </div>

          {/* アニメーション付きビュー切り替え */}
          <AnimatePresence mode="wait">
            {viewMode === 'table' ? (
              <motion.div
                key="table"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* テーブル表示 */}
                <div className="w-full overflow-x-auto mt-4 rounded-lg border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                  <div className="w-full" style={{ minWidth: '1000px' }}>
                    {/* テーブルヘッダー */}
                    <div className="grid grid-cols-[80px_120px_1fr_180px_160px_160px_60px] bg-slate-900 border-b border-slate-800 text-slate-400 text-sm font-semibold sticky top-0">
                      <div className="p-3 text-center">DL</div>
                      <div className="p-3">オーナー名</div>
                      <div className="p-3">コメント・タグ</div>
                      <div className="p-3">ファイル名</div>
                      <div className="p-3 whitespace-nowrap">アップロード日時</div>
                      <div className="p-3 whitespace-nowrap">DL可能日時</div>
                      <div className="p-3 text-center">削除</div>
                    </div>

                    {/* テーブル本体 */}
                    <div className="divide-y divide-slate-800">
                      {processedResults.map(result => (
                        <div
                          key={result.id}
                          className="grid grid-cols-[80px_120px_1fr_180px_160px_160px_60px] hover:bg-slate-800/50 transition-colors duration-150 items-center text-sm"
                        >
                          {/* ダウンロードボタン */}
                          <div className="p-3 flex justify-center">
                            <button
                              onClick={() => onDownload(result)}
                              className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/30 rounded-full transition-all"
                              aria-label={`${result.name}をダウンロード`}
                              title="ダウンロード"
                            >
                              <Download size={20} />
                            </button>
                          </div>

                          {/* オーナー名 */}
                          <div className="p-3 text-white break-words" title={result.ownerName}>
                            {result.ownerName}
                          </div>

                          {/* コメント・タグ */}
                          <div className="p-3 text-slate-400">
                            <div className="whitespace-pre-wrap break-words mb-2">
                              {result.comment}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {result.tags.map((tag, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => onTagClick?.(tag)}
                                  className="
                                    px-2 py-0.5
                                    bg-slate-800/80
                                    border border-slate-700
                                    text-cyan-400/90
                                    text-xs
                                    rounded
                                    hover:bg-cyan-900/30 hover:border-cyan-500/50 hover:text-cyan-300
                                    transition-colors
                                  "
                                >
                                  #{tag}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* ファイル名 */}
                          <div className="p-3 text-cyan-400 break-all font-mono text-xs" title={result.name}>
                            {result.name}
                          </div>

                          {/* アップロード日時 */}
                          <div className="p-3 text-slate-300 text-xs font-mono whitespace-nowrap">
                            {result.formattedCreatedAt}
                          </div>

                          {/* ダウンロード可能日時 */}
                          <div className="p-3 text-slate-300 text-xs font-mono whitespace-nowrap">
                            {result.formattedDownloadableAt}
                          </div>

                          {/* 削除ボタン */}
                          <div className="p-3 flex justify-center">
                            {result.upload_type === '2' && (
                              <button
                                onClick={() => handleDeleteClick(result)}
                                className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-900/20 rounded-full transition-all"
                                aria-label={`${result.name}を削除`}
                                data-testid={`delete-button-${result.id}`}
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* カード表示 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 px-2">
                  {processedResults.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group relative bg-slate-900/80 border border-slate-700 rounded-xl overflow-hidden hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(0,200,255,0.15)] transition-all duration-300"
                    >
                      {/* カードヘッダー */}
                      <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 px-4 py-3 border-b border-slate-700/50">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-cyan-400 font-semibold text-sm truncate" title={result.name}>
                              <FileText size={14} className="inline mr-1.5 opacity-70" />
                              {result.name}
                            </h3>
                            <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                              <User size={12} className="opacity-70" />
                              {result.ownerName}
                            </p>
                          </div>
                          {/* アクションボタン */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onDownload(result)}
                              className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 rounded-lg transition-all"
                              aria-label={`${result.name}をダウンロード`}
                              title="ダウンロード"
                            >
                              <Download size={18} />
                            </button>
                            {result.upload_type === '2' && (
                              <button
                                onClick={() => handleDeleteClick(result)}
                                className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                                aria-label={`${result.name}を削除`}
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* カードボディ */}
                      <div className="p-4">
                        {/* コメント */}
                        {result.comment && (
                          <p className="text-slate-300 text-sm leading-relaxed mb-3 line-clamp-3">
                            {result.comment}
                          </p>
                        )}

                        {/* タグ */}
                        {result.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {result.tags.map((tag, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => onTagClick?.(tag)}
                                className="
                                  inline-flex items-center gap-1 px-2 py-0.5
                                  bg-slate-800/80 border border-slate-600
                                  text-cyan-400/90 text-xs rounded-full
                                  hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:text-cyan-300
                                  transition-all duration-200
                                "
                              >
                                <Tag size={10} />
                                {tag}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* 日時情報 */}
                        <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-700/50">
                          <div className="flex items-center gap-2">
                            <Calendar size={12} className="text-slate-500" />
                            <span>アップロード: {result.formattedCreatedAt}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Download size={12} className="text-slate-500" />
                            <span>DL可能: {result.formattedDownloadableAt}</span>
                          </div>
                        </div>
                      </div>

                      {/* ホバー時のグロー効果 */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ページネーション */}
          {meta.lastPage > 1 && (
            <div className="flex justify-center items-center mt-8 mb-12">
              <button
                onClick={() => onPageChange(meta.currentPage - 1)}
                disabled={meta.currentPage <= 1}
                className={`
                  flex items-center px-4 py-2 rounded-l-md border-r border-slate-800
                  ${meta.currentPage <= 1
                    ? 'bg-slate-900 text-slate-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-500'}
                `}
              >
                <ChevronLeft size={16} className="mr-1" /> 前へ
              </button>

              <div className="flex bg-slate-900">
                {paginationButtons.map((page, index) =>
                  page === 'ellipsis' ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-3 py-2 text-slate-500 select-none border-x border-slate-800"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`
                        px-4 py-2 min-w-[40px] border-x border-slate-800
                        ${meta.currentPage === page
                          ? 'bg-cyan-500 text-black font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'}
                      `}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => onPageChange(meta.currentPage + 1)}
                disabled={meta.currentPage >= meta.lastPage}
                className={`
                   flex items-center px-4 py-2 rounded-r-md border-l border-slate-800
                  ${meta.currentPage >= meta.lastPage
                    ? 'bg-slate-900 text-slate-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-500'}
                `}
              >
                次へ <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          )}
        </div>
      </>
    );
  },
  (prevProps, nextProps) => {
    // 基本的な比較でメモ化を最適化
    return (
      prevProps.loading === nextProps.loading &&
      prevProps.error === nextProps.error &&
      prevProps.results.length === nextProps.results.length &&
      prevProps.meta.currentPage === nextProps.meta.currentPage &&
      prevProps.meta.lastPage === nextProps.meta.lastPage &&
      prevProps.meta.total === nextProps.meta.total
    );
  }
);

SearchResults.displayName = 'SearchResults';
