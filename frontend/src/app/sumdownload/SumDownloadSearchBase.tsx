'use client';

import React from 'react';
import Header from '@/components/Header';
import { useSumDownloadManager } from '@/hooks/useSumDownloadManager';
import { useViewMode } from '@/hooks/useViewMode';
import { ViewToggleButton } from '@/components/search/ViewToggleButton';
import { SumDownloadForm } from '@/components/features/sumdownload/SumDownloadForm';
import { SumDownloadTable } from '@/components/features/sumdownload/SumDownloadTable';
import { SumDownloadPagination } from '@/components/features/sumdownload/SumDownloadPagination';
import { AlertCircle, LayoutGrid, LayoutList } from 'lucide-react';

interface SumDownloadSearchBaseProps {
    searchType: 'team' | 'match';
    title: string;
}

export const SumDownloadSearchBase: React.FC<SumDownloadSearchBaseProps> = ({
    searchType,
    title,
}) => {
    const {
        data,
        total,
        isSearchLoading,
        searchError,
        handleSearch,
        handleDownload,
        selectedIds,
        handleSelectionChange,
        searchQuery,
        currentPage,
        lastPage,
        handlePageChange,
    } = useSumDownloadManager({ searchType });

    // View mode state management using hook
    const { viewMode, setViewMode, isMobileOrTablet, isMounted } = useViewMode({
        storageKey: 'sumDownloadViewMode'
    });

    // クライアントサイドマウント前はローディング表示
    if (!isMounted) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-2 border-transparent border-t-cyan-400 rounded-full animate-spin"></div>
            </div>
        );
    }

    const typeLabel = searchType === 'team' ? 'チーム' : 'マッチ';

    return (
        <div className="flex flex-col min-h-screen bg-background text-white selection:bg-cyan-500/30">
            <Header />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="max-w-5xl mx-auto">
                    {/* ヒーローセクション */}
                    <div className="text-center mb-10 sm:mb-16">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tighter">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                                {title}
                            </span>
                        </h1>
                        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
                            {typeLabel}データを選択して一括ダウンロードできます。
                            <br className="hidden sm:block" />
                            条件を指定してフィルタリングも可能です。
                        </p>
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-2xl p-4 sm:p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-cyan-500/10 transition-colors duration-500" />

                        {/* 検索フォーム */}
                        <div className="flex justify-center mb-6 sm:mb-8">
                            <SumDownloadForm
                                searchType={searchType}
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

                        {/* 検索結果情報 + ビュー切り替え + ダウンロードボタン */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 px-2">
                            <div className="flex items-center gap-4">
                                <div className="text-slate-400 text-xs sm:text-sm">
                                    {total}件の{typeLabel}データが見つかりました
                                </div>
                                {data.length > 0 && (
                                    <div className="text-cyan-400 text-xs sm:text-sm font-medium">
                                        <span className="text-white font-bold">{selectedIds.length}</span>
                                        件選択中
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                {/* ビュー切り替えトグル */}
                                {!isMobileOrTablet && (
                                    <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700 rounded-lg p-1">
                                        <ViewToggleButton
                                            label="テーブル"
                                            icon={<LayoutList size={18} />}
                                            isActive={viewMode === 'table'}
                                            onClick={() => setViewMode('table')}
                                            title="テーブル表示"
                                        />
                                        <ViewToggleButton
                                            label="カード"
                                            icon={<LayoutGrid size={18} />}
                                            isActive={viewMode === 'card'}
                                            onClick={() => setViewMode('card')}
                                            title="カード表示"
                                        />
                                    </div>
                                )}

                                {/* ダウンロードボタン */}
                                {data.length > 0 && (
                                    <button
                                        onClick={handleDownload}
                                        disabled={selectedIds.length === 0 || isSearchLoading}
                                        className="
                                            px-4 py-2 
                                            bg-gradient-to-r from-cyan-600 to-blue-600 
                                            hover:from-cyan-500 hover:to-blue-500 
                                            disabled:from-slate-800 disabled:to-slate-800 
                                            text-white font-bold text-sm
                                            rounded-lg shadow-lg shadow-cyan-500/20 
                                            transition-all duration-300 transform hover:scale-[1.02] active:scale-95
                                            disabled:opacity-50 disabled:cursor-not-allowed
                                            flex items-center justify-center gap-2
                                            whitespace-nowrap
                                        "
                                    >
                                        ダウンロード
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* データテーブル/カード */}
                        <SumDownloadTable
                            data={data || []}
                            selectedIds={selectedIds}
                            onSelectionChange={handleSelectionChange}
                            loading={isSearchLoading}
                            searchType={searchType}
                            viewMode={viewMode}
                        />

                        {/* ページネーション */}
                        <SumDownloadPagination
                            currentPage={currentPage}
                            lastPage={lastPage}
                            onPageChange={handlePageChange}
                            loading={isSearchLoading}
                        />


                    </div>
                </div>
            </main>
        </div>
    );
};
