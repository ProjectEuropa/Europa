'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  useDeleteFile,
  useMyMatchFiles,
  useMyTeamFiles,
} from '@/hooks/api/useMyPage';
import type { MyPageFile } from '@/types/user';
import { useAuthStore } from '@/stores/authStore';
import { formatDownloadDateTime, formatUploadDateTime } from '@/utils/dateFormatters';

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
  console.log('Auth state:', { user: !!user, token: !!token, isAuthenticated });

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
        style={{
          background: '#0A1022',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #1E3A5F',
          marginBottom: '24px',
          textAlign: 'center',
        }}
      >
        <p style={{ color: '#ff6b6b', margin: 0 }}>
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



  const formatFileSize = (size?: number) => {
    if (!size) return '';
    if (size < 1024) return `${size}B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
    return `${(size / (1024 * 1024)).toFixed(1)}MB`;
  };

  if (isLoading) {
    return (
      <div
        style={{
          background: '#0A1022',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #1E3A5F',
          marginBottom: '24px',
          textAlign: 'center',
        }}
      >
        <div style={{ color: '#b0c4d8' }}>
          {isTeam ? 'チーム' : 'マッチ'}データを読み込み中...
        </div>
      </div>
    );
  }

  if (error) {
    console.error(`${isTeam ? 'Team' : 'Match'} files error:`, error);
    return (
      <div
        style={{
          background: '#0A1022',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #1E3A5F',
          marginBottom: '24px',
        }}
      >
        <p style={{ color: '#ff6b6b', margin: 0, marginBottom: '12px' }}>
          {isTeam ? 'チーム' : 'マッチ'}データの読み込みに失敗しました
        </p>
        <details style={{ color: '#b0c4d8', fontSize: '0.9rem' }}>
          <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
            エラー詳細を表示
          </summary>
          <pre style={{
            background: '#0F1A2E',
            padding: '8px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '0.8rem',
            whiteSpace: 'pre-wrap'
          }}>
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div
      style={{
        background: '#0A1022',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #1E3A5F',
        marginBottom: '24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h2
          style={{
            color: '#00c8ff',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            margin: 0,
          }}
        >
          {isTeam ? 'アップロードしたチーム' : 'アップロードしたマッチ'}
        </h2>
      </div>

      {/* 検索バー */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder={`${isTeam ? 'チーム' : 'マッチ'}を検索...`}
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            background: '#0F1A2E',
            border: '1px solid #1E3A5F',
            borderRadius: '6px',
            color: 'white',
            padding: '10px 12px',
            fontSize: '1rem',
            width: '100%',
          }}
        />
      </div>

      {filteredFiles.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            color: '#b0c4d8',
            padding: '40px 20px',
          }}
        >
          {files.length === 0
            ? `${isTeam ? 'チーム' : 'マッチ'}データがありません`
            : '検索条件に一致するファイルがありません'}
        </div>
      ) : (
        <div>
          {/* デスクトップ表示 */}
          <div
            style={{
              display: isMobile ? 'none' : 'block',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1E3A5F' }}>
                  <th
                    scope="col"
                    aria-label="ファイル名"
                    style={{
                      color: '#8CB4FF',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      padding: '12px 8px',
                      textAlign: 'left',
                    }}
                  >
                    ファイル名
                  </th>
                  <th
                    scope="col"
                    aria-label="ファイルのアップロード日時"
                    style={{
                      color: '#8CB4FF',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      padding: '12px 8px',
                      textAlign: 'left',
                    }}
                  >
                    アップロード日
                  </th>
                  <th
                    scope="col"
                    aria-label="ファイルのダウンロード可能日時"
                    style={{
                      color: '#8CB4FF',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      padding: '12px 8px',
                      textAlign: 'left',
                    }}
                  >
                    ダウンロード日時
                  </th>
                  <th
                    scope="col"
                    aria-label="ファイル操作"
                    style={{
                      color: '#8CB4FF',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      padding: '12px 8px',
                      textAlign: 'center',
                    }}
                  >
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map(file => (
                  <tr
                    key={file.id}
                    style={{ borderBottom: '1px solid #1E3A5F' }}
                  >
                    <td
                      aria-label={`ファイル名: ${file.name}`}
                      style={{ padding: '12px 8px', color: 'white' }}
                    >
                      {file.name}
                    </td>
                    <td
                      aria-label={`アップロード日時: ${formatUploadDateTime(file.uploadDate)}`}
                      style={{ padding: '12px 8px', color: '#b0c4d8' }}
                    >
                      {formatUploadDateTime(file.uploadDate)}
                    </td>
                    <td
                      aria-label={`ダウンロード日時: ${formatDownloadDateTime(file.downloadableAt)}`}
                      style={{ padding: '12px 8px', color: '#b0c4d8' }}
                    >
                      {formatDownloadDateTime(file.downloadableAt)}
                    </td>
                    <td
                      aria-label={`${file.name}の操作`}
                      style={{
                        padding: '12px 8px',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          justifyContent: 'center',
                        }}
                      >
                        {file.comment && (
                          <button
                            onClick={() => handleCommentClick(file)}
                            aria-label={`${file.name}のコメントを表示`}
                            style={{
                              background: 'transparent',
                              border: '1px solid #8CB4FF',
                              borderRadius: '4px',
                              color: '#8CB4FF',
                              padding: '4px 8px',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                            }}
                          >
                            コメント
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(file.id)}
                          disabled={deleteFileMutation.isPending}
                          aria-label={`${file.name}を削除`}
                          style={{
                            background: 'transparent',
                            border: '1px solid #ff6b6b',
                            borderRadius: '4px',
                            color: '#ff6b6b',
                            padding: '4px 8px',
                            fontSize: '0.8rem',
                            cursor: deleteFileMutation.isPending
                              ? 'not-allowed'
                              : 'pointer',
                            opacity: deleteFileMutation.isPending ? 0.5 : 1,
                          }}
                        >
                          削除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* モバイル表示 */}
          <div
            style={{
              display: isMobile ? 'block' : 'none',
            }}
          >
            {filteredFiles.map(file => (
              <div
                key={file.id}
                style={{
                  background: '#0F1A2E',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '12px',
                  border: '1px solid #1E3A5F',
                }}
              >
                <div
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                  }}
                >
                  {file.name}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.9rem',
                    color: '#b0c4d8',
                    marginBottom: '12px',
                  }}
                >
                  <span>アップロード: {formatUploadDateTime(file.uploadDate)}</span>
                  <span>
                    公開: {formatDownloadDateTime(file.downloadableAt)}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'flex-end',
                  }}
                >
                  {file.comment && (
                    <button
                      onClick={() => handleCommentClick(file)}
                      style={{
                        background: 'transparent',
                        border: '1px solid #8CB4FF',
                        borderRadius: '4px',
                        color: '#8CB4FF',
                        padding: '6px 12px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      コメント
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(file.id)}
                    disabled={deleteFileMutation.isPending}
                    style={{
                      background: 'transparent',
                      border: '1px solid #ff6b6b',
                      borderRadius: '4px',
                      color: '#ff6b6b',
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      cursor: deleteFileMutation.isPending
                        ? 'not-allowed'
                        : 'pointer',
                      opacity: deleteFileMutation.isPending ? 0.5 : 1,
                    }}
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
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              background: '#0A1022',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #1E3A5F',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3
              style={{
                color: '#00c8ff',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '16px',
              }}
            >
              {selectedFile.name} のコメント
            </h3>
            <div
              style={{
                background: '#0F1A2E',
                borderRadius: '6px',
                padding: '12px',
                border: '1px solid #1E3A5F',
                color: 'white',
                lineHeight: '1.5',
                marginBottom: '20px',
                minHeight: '100px',
                whiteSpace: 'pre-wrap',
              }}
            >
              {modalComment || 'コメントはありません'}
            </div>
            <div style={{ textAlign: 'right' }}>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  background: '#00c8ff',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#020824',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
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
