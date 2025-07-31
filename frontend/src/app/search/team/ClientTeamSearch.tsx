'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { SearchForm } from '@/components/search/SearchForm';
import { SearchResults } from '@/components/search/SearchResults';
import { useTeamSearch } from '@/hooks/useSearch';
import type { MatchFile, TeamFile } from '@/types/file';
import type { SearchParams } from '@/types/search';
import { tryDownloadTeamFile } from '@/utils/api';

export default function ClientTeamSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  // URLパラメータからページ番号を初期化
  useEffect(() => {
    const pageParam = searchParams.get('page');
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    if (page > 0) {
      setCurrentPage(page);
    }
  }, [searchParams]);

  // 検索パラメータの構築
  const searchQuery = searchParams.get('keyword') || '';
  const searchParamsObj: SearchParams = {
    keyword: searchQuery,
    page: currentPage,
  };

  // React Queryを使用した検索
  const {
    data: searchResult,
    isLoading,
    error,
    isError,
  } = useTeamSearch(searchParamsObj);

  // キーワード変更時のみページをリセット（ページ変更時はリセットしない）
  useEffect(() => {
    const pageParam = searchParams.get('page');
    // ページパラメータがない場合のみリセット（新しい検索の場合）
    if (!pageParam) {
      setCurrentPage(1);
    }
  }, [searchQuery, searchParams]);

  // ダウンロード処理
  const handleDownload = useCallback((file: TeamFile | MatchFile) => {
    // チームファイルのみ処理
    if (file.type !== 'team') {
      toast.error('チームファイルのみダウンロードできます');
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

  // 検索処理
  const handleSearch = useCallback((params: SearchParams) => {
    setCurrentPage(1);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'rgb(var(--background-rgb))',
      }}
    >
      <Header />

      <div
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 20px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          <h1
            style={{
              color: '#8CB4FF',
              fontWeight: 'bold',
              fontSize: '2.5rem',
              marginBottom: '16px',
            }}
          >
            Search Team
          </h1>
          <p
            style={{
              color: '#b0c4d8',
              fontSize: '1.1rem',
              marginBottom: '40px',
            }}
          >
            チームデータの検索が可能です
          </p>
        </div>

        {/* 検索フォーム */}
        <SearchForm
          searchType="team"
          placeholder="チーム名を入力してください"
          onSearch={handleSearch}
        />

        {/* 検索結果 */}
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
          error={isError ? 'チーム検索に失敗しました' : null}
          onPageChange={handlePageChange}
          onDownload={handleDownload}
        />
      </div>

      <Footer />
    </div>
  );
}
