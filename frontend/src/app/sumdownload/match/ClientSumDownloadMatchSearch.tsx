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
import { AlertCircle } from 'lucide-react';

const ClientSumDownloadMatchSearch: React.FC = () => {
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
  } = useSumDownloadManager({ searchType: 'match' });

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
                マッチデータ一括ダウンロード
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">
                複数のマッチデータを選択して一括ダウンロードできます。
              </p>
            </div>

            {/* 検索フォーム */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <SumDownloadForm
                searchType="match"
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

            {/* 検索結果情報 */}
            <div className="flex justify-between items-center mb-4 px-2">
              <div className="text-slate-400 text-xs sm:text-sm">
                {total}件のマッチデータが見つかりました
              </div>
              {selectedCount > 0 && (
                <div className="text-cyan-400 text-sm">
                  {selectedCount}件選択中
                </div>
              )}
            </div>

            {/* アクションボタン */}
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
              searchType="match"
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
              <div className="flex justify-center my-8">
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
                <li>一度に最大50件までのマッチデータをダウンロードできます。</li>
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

export default ClientSumDownloadMatchSearch;

