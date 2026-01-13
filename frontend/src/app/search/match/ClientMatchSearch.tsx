'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { SearchForm } from '@/components/search/SearchForm';
import { SearchResults } from '@/components/search/SearchResults';
import { TagCloud } from '@/components/search/TagCloud';
import { useMatchSearch, usePopularTags } from '@/hooks/useSearch';
import type { MatchFile, TeamFile } from '@/types/file';
import type { SearchParams, SortOrder } from '@/types/search';
import { tryDownloadTeamFile } from '@/utils/api';

export default function ClientMatchSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // URLパラメータからページ番号とソート順を初期化
  useEffect(() => {
    const pageParam = searchParams.get('page');
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    if (page > 0) {
      setCurrentPage(page);
    }

    const sortParam = searchParams.get('sort');
    if (sortParam === 'asc' || sortParam === 'desc') {
      setSortOrder(sortParam);
    }
  }, [searchParams]);

  // 検索パラメータの構築
  const searchQuery = searchParams.get('keyword') || '';
  const searchParamsObj: SearchParams = {
    keyword: searchQuery,
    page: currentPage,
    sortOrder,
  };

  // React Queryを使用した検索
  const {
    data: searchResult,
    isLoading,
    error,
    isError,
  } = useMatchSearch(searchParamsObj);

  // 人気タグを取得
  const { data: popularTags } = usePopularTags(10);

  // キーワード変更時のみページをリセット（ページ変更時はリセットしない）
  useEffect(() => {
    const pageParam = searchParams.get('page');
    // ページパラメータがない場合のみリセット（新しい検索の場合）
    if (!pageParam) {
      setCurrentPage(1);
    }
  }, [searchParams]);

  // ダウンロード処理
  const handleDownload = useCallback((file: TeamFile | MatchFile) => {
    // マッチファイルのみ処理
    if (file.type !== 'match') {
      toast.error('マッチファイルのみダウンロードできます');
      return;
    }

    // 非同期処理をPromiseチェーンで実行（void型を返す）
    tryDownloadTeamFile(file.id)
      .then(result => {
        if (!result.success) {
          toast.error(result.error || 'ダウンロードに失敗しました', {
            duration: 4000,
          });
        }
      })
      .catch(() => {
        toast.error('ダウンロードに失敗しました');
      });
  }, []);

  // ページ変更処理
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);

      // URLを更新
      const urlParams = new URLSearchParams(searchParams.toString());
      urlParams.set('page', page.toString());
      router.push(`?${urlParams.toString()}`);
    },
    [searchParams, router]
  );

  // 検索処理 (フォームからのコールバック)
  const handleSearch = useCallback((_params: SearchParams) => {
    setCurrentPage(1);
  }, []);

  // タグクリック処理
  const handleTagClick = useCallback((tag: string) => {
    setCurrentPage(1);
    const urlParams = new URLSearchParams(searchParams.toString());
    urlParams.set('keyword', tag);
    urlParams.set('page', '1');
    router.push(`?${urlParams.toString()}`);
  }, [searchParams, router]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0818] text-white selection:bg-cyan-500/30">
      <Header />

      <div className="flex-1 w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto py-12 px-4 flex flex-col items-center">
          <div className="w-full text-center mb-10">
            <div className="relative mb-8 pt-8">
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-3 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                マッチデータ検索
              </h1>
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-8 bg-cyan-500/50" />
                <p className="text-cyan-400 font-bold tracking-[0.2em] text-sm md:text-base uppercase opacity-90">
                  MATCH DATA SEARCH
                </p>
                <div className="h-px w-8 bg-cyan-500/50" />
              </div>
            </div>
            <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
              戦略や戦術を向上させるために、試合結果やパフォーマンスデータを分析します。
            </p>

            <div className="flex flex-col items-center w-full">
              {/* 検索フォーム */}
              <SearchForm
                searchType="match"
                placeholder="マッチ名、オーナー名、タグで検索"
                onSearch={handleSearch}
              />

              {/* 人気のタグ */}
              <div className="mt-6 w-full max-w-3xl">
                <div className="flex items-center justify-center gap-3 mb-2 text-sm text-slate-500 uppercase tracking-widest font-semibold">
                  <span className="w-8 h-[1px] bg-slate-700"></span>
                  Popular Tags
                  <span className="w-8 h-[1px] bg-slate-700"></span>
                </div>
                <TagCloud
                  tags={popularTags || []}
                  onTagClick={handleTagClick}
                  className="justify-center"
                />
              </div>
            </div>
          </div>

          {/* 検索結果 */}
          <div className="w-full">
            <SearchResults
              results={searchResult?.data || []}
              meta={
                searchResult?.meta || {
                  currentPage: 1,
                  lastPage: 1,
                  perPage: 10,
                  total: 0,
                }
              }
              loading={isLoading}
              error={isError ? 'マッチ検索に失敗しました' : null}
              onPageChange={handlePageChange}
              onDownload={handleDownload}
              onTagClick={handleTagClick}
              sortOrder={sortOrder}
              onSortChange={(order) => {
                setSortOrder(order);
                // URLを更新
                const urlParams = new URLSearchParams(searchParams.toString());
                urlParams.set('sort', order);
                router.push(`?${urlParams.toString()}`);
              }}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

