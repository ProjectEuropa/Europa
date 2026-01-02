'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import {
  useDeleteFile,
  useMyMatchFiles,
  useMyTeamFiles,
} from '@/hooks/api/useMyPage';
import { useAuthStore } from '@/stores/authStore';
import type { MyPageFile } from '@/types/user';
import {
  formatDownloadDateTime,
  formatUploadDateTime,
  getAccessibilityDateInfo,
} from '@/utils/dateFormatters';

interface FileListSectionProps {
  type: 'team' | 'match';
}

const FileListSection: React.FC<FileListSectionProps> = ({ type }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalComment, setModalComment] = useState('');
  const [selectedFile, setSelectedFile] = useState<MyPageFile | null>(null);
  const [isMobile, setIsMobile] = useState(() => {
    // サーバーサイドレンダリング中はfalseに設定
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  // 認証状態を確認
  const { user, token, isAuthenticated } = useAuthStore();

  // 条件付きでフックを使用
  const teamQuery = useMyTeamFiles();
  const matchQuery = useMyMatchFiles();
  const deleteFileMutation = useDeleteFile();

  const isTeam = type === 'team';
  const query = isTeam ? teamQuery : matchQuery;
  const { data: files = [], isLoading, error } = query;

  // 認証されていない場合の早期リターン
  if (!isAuthenticated || !user) {
    return (
      <div
        className="bg-[#0A1022] rounded-xl p-6 border border-[#1E3A5F] mb-6 text-center"
      >
        <p className="text-[#ff6b6b] m-0">
          {isTeam ? 'チーム' : 'マッチ'}データを表示するにはログインが必要です
        </p>
      </div>
    );
  }

  // レスポンシブ対応
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 初期チェック（サーバーサイドレンダリング後）
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredFiles = files.filter(file =>
    (file.name ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCommentClick = (file: MyPageFile) => {
    setSelectedFile(file);
    setModalComment(file.comment ?? '');
    setModalOpen(true);
  };

  const handleDelete = async (fileId: string) => {
    if (window.confirm('このファイルを削除しますか？')) {
      try {
        await deleteFileMutation.mutateAsync(fileId);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const _formatFileSize = (size?: number) => {
    if (!size) return '';
    if (size < 1024) return `${size}B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
    return `${(size / (1024 * 1024)).toFixed(1)}MB`;
  };

  if (isLoading) {
    return (
      <div
        className="bg-[#0A1022] rounded-xl p-6 border border-[#1E3A5F] mb-6 text-center"
      >
        <div className="text-[#b0c4d8]">
          {isTeam ? 'チーム' : 'マッチ'}データを読み込み中...
        </div>
      </div>
    );
  }

  if (error) {
    console.error(`${isTeam ? 'Team' : 'Match'} files error:`, error);
    return (
      <div className="bg-[#0A1022] rounded-xl p-6 border border-[#1E3A5F] mb-6">
        <p className="text-[#ff6b6b] m-0 mb-3">
          {isTeam ? 'チーム' : 'マッチ'}データの読み込みに失敗しました
        </p>
        <details className="text-[#b0c4d8] text-[0.9rem]">
          <summary className="cursor-pointer mb-2">
            エラー詳細を表示
          </summary>
          <pre className="bg-[#0F1A2E] p-2 rounded overflow-auto text-[0.8rem] whitespace-pre-wrap">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div className="bg-[#0A1022] rounded-xl p-6 border border-[#1E3A5F] mb-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-[#00c8ff] text-2xl font-bold m-0">
          {isTeam ? 'アップロードしたチーム' : 'アップロードしたマッチ'}
        </h2>
      </div>

      {/* 検索バー */}
      <div className="mb-5">
        <label
          htmlFor={`search-${isTeam ? 'team' : 'match'}-files`}
          className="sr-only"
        >
          {isTeam ? 'チーム' : 'マッチ'}ファイルを検索
        </label>
        <input
          id={`search-${isTeam ? 'team' : 'match'}-files`}
          type="text"
          placeholder={`${isTeam ? 'チーム' : 'マッチ'}を検索...`}
          value={searchQuery}
          onChange={handleSearchChange}
          aria-label={`${isTeam ? 'チーム' : 'マッチ'}ファイルを検索`}
          aria-describedby={`search-help-${isTeam ? 'team' : 'match'}`}
          role="searchbox"
          className="bg-[#0F1A2E] border border-[#1E3A5F] rounded-md text-white py-2.5 px-3 text-base w-full"
        />
        <div
          id={`search-help-${isTeam ? 'team' : 'match'}`}
          className="sr-only"
        >
          ファイル名で検索できます。検索結果は入力と同時に更新されます。
        </div>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="text-center text-[#b0c4d8] py-10 px-5">
          {files.length === 0
            ? `${isTeam ? 'チーム' : 'マッチ'}データがありません`
            : '検索条件に一致するファイルがありません'}
        </div>
      ) : (
        <div>
          {/* デスクトップ表示 */}
          <div className={isMobile ? 'hidden' : 'block'}>
            <table
              className="w-full border-collapse"
              aria-label={`${isTeam ? 'チーム' : 'マッチ'}ファイル一覧テーブル`}
            >
              <caption className="sr-only">
                {isTeam
                  ? 'アップロードしたチームファイル'
                  : 'アップロードしたマッチファイル'}
                の一覧。
                ファイル名、アップロード日時、ダウンロード日時、操作ボタンが表示されています。
              </caption>
              <thead>
                <tr className="border-b border-[#1E3A5F]">
                  <th
                    scope="col"
                    aria-label="ファイル名"
                    className="text-[#8CB4FF] text-[0.9rem] font-bold py-3 px-2 text-left"
                  >
                    ファイル名
                  </th>
                  <th
                    scope="col"
                    aria-label="ファイルのアップロード日時"
                    className="text-[#8CB4FF] text-[0.9rem] font-bold py-3 px-2 text-left"
                  >
                    アップロード日
                  </th>
                  <th
                    scope="col"
                    aria-label="ファイルのダウンロード可能日時"
                    className="text-[#8CB4FF] text-[0.9rem] font-bold py-3 px-2 text-left"
                  >
                    ダウンロード日時
                  </th>
                  <th
                    scope="col"
                    aria-label="ファイル操作"
                    className="text-[#8CB4FF] text-[0.9rem] font-bold py-3 px-2 text-center"
                  >
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map(file => {
                  const uploadFormatted = formatUploadDateTime(file.uploadDate);
                  const downloadFormatted = formatDownloadDateTime(
                    file.downloadableAt ?? null
                  );
                  const uploadAccessibility = getAccessibilityDateInfo(
                    file.uploadDate,
                    uploadFormatted,
                    'upload'
                  );
                  const downloadAccessibility = getAccessibilityDateInfo(
                    file.downloadableAt ?? null,
                    downloadFormatted,
                    'download'
                  );

                  return (
                    <tr
                      key={file.id}
                      className="border-b border-[#1E3A5F]"
                    >
                      <td
                        aria-label={`ファイル名: ${file.name}`}
                        title={`ファイル名: ${file.name}`}
                        className="py-3 px-2 text-white"
                      >
                        {file.name}
                      </td>
                      <td
                        aria-label={uploadAccessibility.ariaLabel}
                        title={uploadAccessibility.title}
                        className="py-3 px-2 text-[#b0c4d8]"
                      >
                        {uploadFormatted}
                      </td>
                      <td
                        aria-label={downloadAccessibility.ariaLabel}
                        title={downloadAccessibility.title}
                        className="py-3 px-2 text-[#b0c4d8]"
                      >
                        {downloadFormatted}
                      </td>
                      <td
                        aria-label={`${file.name}の操作`}
                        title={`${file.name}に対する操作ボタン`}
                        className="py-3 px-2 text-center"
                      >
                        <div className="flex gap-2 justify-center">
                          {file.comment && (
                            <button
                              onClick={() => handleCommentClick(file)}
                              onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  handleCommentClick(file);
                                }
                              }}
                              aria-label={`${file.name}のコメントを表示`}
                              title={`${file.name}のコメントを表示します`}
                              tabIndex={0}
                              className="bg-transparent border border-[#8CB4FF] rounded text-[#8CB4FF] py-1 px-2 text-[0.8rem] cursor-pointer"
                            >
                              コメント
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(file.id)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleDelete(file.id);
                              }
                            }}
                            disabled={deleteFileMutation.isPending}
                            aria-label={`${file.name}を削除`}
                            aria-describedby={
                              deleteFileMutation.isPending
                                ? `delete-status-${file.id}`
                                : undefined
                            }
                            title={
                              deleteFileMutation.isPending
                                ? '削除処理中です'
                                : `${file.name}を削除します`
                            }
                            tabIndex={0}
                            className={`bg-transparent border border-[#ff6b6b] rounded text-[#ff6b6b] py-1 px-2 text-[0.8rem] ${
                              deleteFileMutation.isPending
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-pointer'
                            }`}
                          >
                            削除
                          </button>
                          {deleteFileMutation.isPending && (
                            <span
                              id={`delete-status-${file.id}`}
                              className="sr-only"
                            >
                              削除処理中です
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* モバイル表示 */}
          <div className={isMobile ? 'block' : 'hidden'}>
            {filteredFiles.map(file => (
              <div
                key={file.id}
                className="bg-[#0F1A2E] rounded-lg p-4 mb-3 border border-[#1E3A5F]"
              >
                <div className="text-white font-bold mb-2">
                  {file.name}
                </div>
                <div className="flex justify-between items-center text-[0.9rem] text-[#b0c4d8] mb-3">
                  <span>
                    アップロード: {formatUploadDateTime(file.uploadDate)}
                  </span>
                  <span>
                    公開: {formatDownloadDateTime(file.downloadableAt ?? null)}
                  </span>
                </div>
                <div className="flex gap-2 justify-end">
                  {file.comment && (
                    <button
                      onClick={() => handleCommentClick(file)}
                      className="bg-transparent border border-[#8CB4FF] rounded text-[#8CB4FF] py-1.5 px-3 text-[0.8rem] cursor-pointer"
                    >
                      コメント
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(file.id)}
                    disabled={deleteFileMutation.isPending}
                    className={`bg-transparent border border-[#ff6b6b] rounded text-[#ff6b6b] py-1.5 px-3 text-[0.8rem] ${
                      deleteFileMutation.isPending
                        ? 'cursor-not-allowed opacity-50'
                        : 'cursor-pointer'
                    }`}
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* コメントモーダル */}
      {modalOpen && selectedFile && (
        <div
          role="dialog"
          aria-labelledby="comment-modal-title"
          aria-describedby="comment-modal-content"
          aria-modal="true"
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-modal"
          onClick={() => setModalOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setModalOpen(false);
            }
          }}
        >
          <div
            className="bg-[#0A1022] rounded-xl p-6 border border-[#1E3A5F] max-w-[500px] w-[90%] max-h-[80vh] overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            <h3
              id="comment-modal-title"
              className="text-[#00c8ff] text-xl font-bold mb-4"
            >
              {selectedFile.name} のコメント
            </h3>
            <div
              id="comment-modal-content"
              className="bg-[#0F1A2E] rounded-md p-3 border border-[#1E3A5F] text-white leading-relaxed mb-5 min-h-[100px] whitespace-pre-wrap"
            >
              {modalComment || 'コメントはありません'}
            </div>
            <div className="text-right">
              <button
                aria-label="モーダルを閉じる"
                onClick={() => setModalOpen(false)}
                className="bg-[#00c8ff] border-none rounded-md text-[#020824] py-2 px-4 text-[0.9rem] font-bold cursor-pointer"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileListSection;
