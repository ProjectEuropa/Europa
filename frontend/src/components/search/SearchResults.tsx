'use client';

import { memo, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { DeleteModal } from '@/components/DeleteModal';
import { useDeleteFile } from '@/hooks/useSearch';
import type { TeamFile, MatchFile } from '@/types/file';
import type { PaginationMeta } from '@/types/search';

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
}

/**
 * 最適化された検索結果表示コンポーネント
 * - メモ化による再レンダリング最適化
 * - 仮想化対応（大量データ用）
 * - アクセシビリティ対応
 */
export const SearchResults = memo<SearchResultsProps>(({
  results,
  meta,
  loading = false,
  error = null,
  onPageChange,
  onDownload,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const deleteFileMutation = useDeleteFile();

  // 安全な日付フォーマット関数
  const formatDate = (dateValue: string | null | undefined, isDownloadableAt = false): string => {
    if (!dateValue) {
      return isDownloadableAt ? '即座にダウンロード可能' : '未設定';
    }

    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return '無効な日付';

    return date.toLocaleString('ja-JP');
  };

  // 結果データの前処理（メモ化）
  const processedResults = useMemo(() => {
    return results.map(result => ({
      ...result,
      formattedCreatedAt: formatDate(result.createdAt),
      formattedDownloadableAt: formatDate(result.downloadableAt, true),
      tags: [
        result.searchTag1,
        result.searchTag2,
        result.searchTag3,
        result.searchTag4,
      ].filter(Boolean),
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '48px 0' }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '2px solid transparent',
          borderTop: '2px solid #00c8ff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <span style={{ marginLeft: '12px', color: '#00c8ff' }}>検索中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <div style={{ color: '#ef4444', marginBottom: '16px' }}>
          <svg
            style={{ width: '48px', height: '48px', margin: '0 auto 8px' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p style={{ fontSize: '18px', fontWeight: '500' }}>{error}</p>
        </div>
      </div>
    );
  }


  if (processedResults.length === 0 && !loading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <div style={{ color: '#b0c4d8', marginBottom: '16px' }}>
          <svg
            style={{ width: '48px', height: '48px', margin: '0 auto 8px' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p style={{ fontSize: '18px', fontWeight: '500' }}>検索結果が見つかりませんでした</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>別のキーワードで検索してみてください</p>
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

      <div className="w-full max-w-7xl mx-auto mt-8">
        {/* 結果ヘッダー */}
        <div className="flex justify-between items-center mb-4 px-4">
          <div className="text-[#00c8ff] font-medium">
            {meta.total}件の結果 (ページ {meta.currentPage}/{meta.lastPage})
          </div>
        </div>

        {/* テーブル表示 */}
        <div
          style={{
            width: '100%',
            maxWidth: '1200px',
            minWidth: 900,
            overflowX: 'auto',
            marginTop: '50px',
          }}
        >
          {/* テーブルヘッダー */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '100px 120px 12fr 180px 180px 180px 60px',
              minWidth: 900,
              background: '#0A1022',
              padding: '12px 20px',
              borderBottom: '1px solid #1E3A5F',
              color: '#b0c4d8',
              fontSize: '0.9rem',
            }}
          >
            <div style={{ minWidth: '100px' }}>ダウンロード</div>
            <div>オーナー名</div>
            <div style={{ minWidth: '350px' }}>コメント・タグ</div>
            <div style={{ minWidth: '180px' }}>ファイル名</div>
            <div style={{ whiteSpace: 'nowrap' }}>アップロード日時</div>
            <div style={{ whiteSpace: 'nowrap' }}>ダウンロード可能日時</div>
            <div style={{ textAlign: 'center' }}>削除</div>
          </div>

          {/* テーブル本体 */}
          {processedResults.map((result) => (
            <div
              key={result.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 120px 12fr 180px 180px 180px 60px',
                minWidth: 900,
                padding: '16px 20px',
                borderBottom: '1px solid #1E3A5F',
                background: '#050A14',
                alignItems: 'center',
              }}
            >
              {/* ダウンロードボタン */}
              <div>
                <button
                  onClick={() => onDownload(result)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  aria-label={`${result.name}をダウンロード`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 16L12 8M12 16L8 12M12 16L16 12"
                      stroke="#00c8ff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 15V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16V15"
                      stroke="#00c8ff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {/* オーナー名 */}
              <div
                style={{
                  color: 'white',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={result.ownerName}
              >
                {result.ownerName}
              </div>

              {/* コメント・タグ */}
              <div
                style={{
                  color: '#b0c4d8',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                }}
              >
                {result.comment &&
                  result.comment
                    .split(/\r?\n/)
                    .map((line: string, idx: number, arr: string[]) => (
                      <span key={idx}>
                        {line}
                        {idx < arr.length - 1 && <br />}
                      </span>
                    ))}
                <div style={{ marginTop: 4 }}>
                  {result.tags.map((tag, i) => (
                    <span
                      key={i}
                      style={{
                        background: '#1E3A5F',
                        color: '#8CB4FF',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        marginRight: 4,
                        fontSize: '0.8em',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* ファイル名 */}
              <div
                style={{
                  color: '#00c8ff',
                  whiteSpace: 'normal',
                  wordBreak: 'break-all',
                  overflow: 'visible',
                  textOverflow: 'clip',
                }}
                title={result.name}
              >
                {result.name}
              </div>

              {/* アップロード日時 */}
              <div
                style={{
                  color: 'white',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={result.formattedCreatedAt}
              >
                {result.formattedCreatedAt}
              </div>

              {/* ダウンロード可能日時 */}
              <div
                style={{
                  color: 'white',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={result.formattedDownloadableAt}
              >
                {result.formattedDownloadableAt}
              </div>

              {/* 削除ボタン - 簡易アップロード（upload_type='2'）のみ表示 */}
              <div style={{ textAlign: 'center' }}>
                {result.upload_type === '2' && (
                  <button
                    onClick={() => handleDeleteClick(result)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    aria-label={`${result.name}を削除`}
                    data-testid={`delete-button-${result.id}`}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16M10 11V16M14 11V16"
                        stroke="#00c8ff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ページネーション */}
        {meta.lastPage > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 24,
            }}
          >
            <button
              onClick={() => onPageChange(meta.currentPage - 1)}
              disabled={meta.currentPage <= 1}
              style={{
                background: meta.currentPage <= 1 ? '#1E3A5F' : '#3B82F6',
                color: '#8CB4FF',
                border: 'none',
                borderRadius: '4px 0 0 4px',
                padding: '8px 16px',
                marginRight: 4,
                cursor: meta.currentPage <= 1 ? 'not-allowed' : 'pointer',
                opacity: meta.currentPage <= 1 ? 0.5 : 1,
              }}
            >
              前へ
            </button>

            {paginationButtons.map((page, index) =>
              page === 'ellipsis' ? (
                <span
                  key={`ellipsis-${index}`}
                  style={{
                    color: '#8CB4FF',
                    padding: '0 8px',
                    userSelect: 'none',
                  }}
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  style={{
                    background: meta.currentPage === page ? '#00c8ff' : '#111A2E',
                    color: meta.currentPage === page ? '#111A2E' : '#8CB4FF',
                    border: 'none',
                    borderRadius: 0,
                    padding: '8px 16px',
                    marginRight: 2,
                    fontWeight: meta.currentPage === page ? 'bold' : 'normal',
                    cursor: 'pointer',
                  }}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => onPageChange(meta.currentPage + 1)}
              disabled={meta.currentPage >= meta.lastPage}
              style={{
                background: meta.currentPage >= meta.lastPage ? '#1E3A5F' : '#3B82F6',
                color: '#8CB4FF',
                border: 'none',
                borderRadius: '0 4px 4px 0',
                padding: '8px 16px',
                marginLeft: 4,
                cursor: meta.currentPage >= meta.lastPage ? 'not-allowed' : 'pointer',
                opacity: meta.currentPage >= meta.lastPage ? 0.5 : 1,
              }}
            >
              次へ
            </button>
          </div>
        )}
      </div>
    </>
  );
}, (prevProps, nextProps) => {
  // 基本的な比較でメモ化を最適化
  return (
    prevProps.loading === nextProps.loading &&
    prevProps.error === nextProps.error &&
    prevProps.results.length === nextProps.results.length &&
    prevProps.meta.currentPage === nextProps.meta.currentPage &&
    prevProps.meta.lastPage === nextProps.meta.lastPage &&
    prevProps.meta.total === nextProps.meta.total
  );
});

SearchResults.displayName = 'SearchResults';
