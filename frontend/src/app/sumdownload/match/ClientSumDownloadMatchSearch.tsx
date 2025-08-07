'use client';

import React from 'react';
import Footer from '@/components/Footer';
import {
  SumDownloadActions,
  SumDownloadForm,
  SumDownloadPagination,
  SumDownloadTable,
} from '@/components/features/sumdownload';
import Header from '@/components/Header';
import { useSumDownloadManager } from '@/hooks/useSumDownloadManager';

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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'rgb(var(--background-rgb))',
      }}
    >
      <Header />

      <main
        style={{
          flex: '1',
          padding: '20px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {/* ヘッダー */}
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <h1
              style={{
                color: '#00c8ff',
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              マッチデータ一括ダウンロード
            </h1>
            <p
              style={{
                color: '#b0c4d8',
                fontSize: '1rem',
                marginBottom: '24px',
              }}
            >
              複数のマッチデータを選択して一括ダウンロードできます。
            </p>
          </div>

          {/* 検索フォーム */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '32px',
            }}
          >
            <SumDownloadForm
              searchType="match"
              onSearch={handleSearch}
              loading={isSearchLoading}
              initialQuery={searchQuery}
            />
          </div>

          {/* エラー表示 */}
          {searchError && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
              }}
            >
              <p style={{ color: '#ef4444' }}>
                検索中にエラーが発生しました: {searchError.message}
              </p>
            </div>
          )}

          {/* 検索結果情報 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                color: '#b0c4d8',
                fontSize: '0.9rem',
              }}
            >
              {total}件のマッチデータが見つかりました
            </div>
            {selectedCount > 0 && (
              <div
                style={{
                  color: '#00c8ff',
                  fontSize: '0.9rem',
                }}
              >
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

          {/* 下部ダウンロードボタン */}
          {selectedCount > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '32px',
              }}
            >
              <SumDownloadActions
                selectedCount={selectedCount}
                onDownload={handleDownload}
                isDownloading={isDownloading}
                maxSelectionCount={50}
              />
            </div>
          )}

          {/* 注意事項 */}
          <div
            style={{
              background: '#0A1022',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #1E3A5F',
            }}
          >
            <h2
              style={{
                color: '#00c8ff',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <svg
                style={{
                  width: '20px',
                  height: '20px',
                }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              ダウンロードに関する注意事項
            </h2>
            <ul
              style={{
                color: '#b0c4d8',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                paddingLeft: '20px',
              }}
            >
              <li>一度に最大50件までのマッチデータをダウンロードできます。</li>
              <li>
                ダウンロードしたデータは自動的にZIPファイルに圧縮されます。
              </li>
              <li>ダウンロード履歴はアカウント設定ページで確認できます。</li>
              <li>
                ダウンロードに問題がある場合は、管理者にお問い合わせください。
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ClientSumDownloadMatchSearch;
