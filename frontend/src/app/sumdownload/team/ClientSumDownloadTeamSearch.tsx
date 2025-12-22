'use client';

import type React from 'react';
import Footer from '@/components/Footer';
import {
  SumDownloadActions,
  SumDownloadForm,
  SumDownloadPagination,
  SumDownloadTable,
} from '@/components/features/sumdownload';
import Header from '@/components/Header';
import { useSumDownloadManager } from '@/hooks/useSumDownloadManager';
import { useViewMode } from '@/hooks/useViewMode';
import { AlertCircle, LayoutGrid, LayoutList } from 'lucide-react';

const ClientSumDownloadTeamSearch: React.FC = () => {
  const {
    data,
    currentPage,
    lastPage,
    total,
    selectedIds,
    selectedCount,
    isSearchLoading,
    isDownloading,
    searchError,
    handleSearch,
    handlePageChange,
    handleSelectionChange,
    handleDownload,
    searchQuery,
  } = useSumDownloadManager({ searchType: 'team' });

  // View mode state management using hook
  const { viewMode, setViewMode, isMobileOrTablet } = useViewMode({
    storageKey: 'sumDownloadViewMode'
  });

  return (
    <div className="flex flex-col min-h-screen bg-background text-white selection:bg-cyan-500/30">
      <Header />

      <main className="flex-1 w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 flex flex-col items-center">
          <div className="w-full">
            {/* ヘッダー */}
            <div className="text-center mb-8 sm:mb-10">
              <h1 className="
                text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 
                bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500
                drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]
              ">
                チームデータ一括ダウンロード
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">
                複数のチームデータを選択して一括ダウンロードできます。
              </p>
            </div>

            {/* 検索フォーム */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <SumDownloadForm
                searchType="team"
                onSearch={handleSearch}
                loading={isSearchLoading}
                initialQuery={searchQuery}
              />
            </div>

            {/* エラー表示 */}
            {searchError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3 text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>検索中にエラーが発生しました: {searchError.message}</p>
              </div>
            )}

            {/* 検索結果情報 + ビュー切り替え */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 px-2">
              <div className="text-slate-400 text-xs sm:text-sm">
                {total}件のチームデータが見つかりました
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

            {/* アクションボタン (上部) */}
            <SumDownloadActions
              selectedCount={selectedCount}
              onDownload={handleDownload}
              isDownloading={isDownloading}
              maxSelectionCount={50}
            />

            {/* データテーブル */}
            <SumDownloadTable
              data={data}
              selectedIds={selectedIds}
              onSelectionChange={handleSelectionChange}
              loading={isSearchLoading}
              searchType="team"
              viewMode={viewMode}
            />

            {/* ページネーション */}
            <SumDownloadPagination
              currentPage={currentPage}
              lastPage={lastPage}
              onPageChange={handlePageChange}
              loading={isSearchLoading}
            />

            {/* 下部アクションボタン */}
            {selectedCount > 0 && (
              <div className="flex justify-center mb-8">
                <div className="w-full">
                  <SumDownloadActions
                    selectedCount={selectedCount}
                    onDownload={handleDownload}
                    isDownloading={isDownloading}
                    maxSelectionCount={50}
                  />
                </div>
              </div>
            )}

            {/* 注意事項 */}
            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-cyan-400 font-bold text-lg mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                ダウンロードに関する注意事項
              </h2>
              <ul className="text-slate-400 text-sm leading-relaxed list-disc pl-5 space-y-1">
                <li>一度に最大50件までのチームデータをダウンロードできます。</li>
                <li>ダウンロードしたデータは自動的にZIPファイルに圧縮されます。</li>
                <li>ダウンロード履歴はアカウント設定ページで確認できます。</li>
                <li>ダウンロードに問題がある場合は、管理者にお問い合わせください。</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ClientSumDownloadTeamSearch;
