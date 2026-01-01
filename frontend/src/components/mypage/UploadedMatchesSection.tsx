'use client';

import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Z_INDEX } from '@/lib/utils';
import { deleteMyFile } from '@/utils/api';

interface MatchData {
  id: string;
  name: string;
  uploadDate: string;
  downloadableAt?: string;
  comment?: string;
}

interface UploadedMatchesSectionProps {
  initialMatches: MatchData[];
}

const UploadedMatchesSection: React.FC<UploadedMatchesSectionProps> = ({
  initialMatches,
}) => {
  // APIから渡されたデータをフロント用に自動マッピング
  const [matches, setMatches] = useState<MatchData[]>(
    (initialMatches as any[]).map(match => ({
      id: match.id,
      name: match.name ?? match.file_name ?? '',
      uploadDate: match.uploadDate ?? match.created_at ?? '',
      downloadableAt: match.downloadableAt ?? match.downloadable_at ?? '',
      comment: match.comment ?? match.file_comment ?? '',
    }))
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalComment, setModalComment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredMatches = matches.filter(match =>
    (match.name ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <h2
        style={{
          color: '#00c8ff',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '20px',
        }}
      >
        アップロードしたマッチデータ
      </h2>

      {/* 検索バー */}
      <div
        style={{
          position: 'relative',
          marginBottom: '20px',
        }}
      >
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="マッチ名またはチーム名で検索"
          style={{
            width: '100%',
            padding: '12px 16px 12px 40px',
            background: '#0F1A2E',
            border: '1px solid #1E3A5F',
            borderRadius: '6px',
            color: 'white',
            fontSize: '1rem',
          }}
        />
        <svg
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            color: '#8CB4FF',
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>

      {/* マッチデータテーブル */}
      <div
        style={{
          overflowX: 'auto',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr
              style={{
                background: '#0F1A2E',
                borderBottom: '1px solid #1E3A5F',
              }}
            >
              <th
                style={{
                  padding: '16px',
                  textAlign: 'left',
                  color: '#b0c4d8',
                  fontWeight: 'normal',
                }}
              >
                マッチ名
              </th>
              <th
                style={{
                  padding: '16px',
                  textAlign: 'left',
                  color: '#b0c4d8',
                  fontWeight: 'normal',
                }}
              >
                アップロード日
              </th>
              <th
                style={{
                  padding: '16px',
                  textAlign: 'center',
                  color: '#b0c4d8',
                  fontWeight: 'normal',
                }}
              >
                ダウンロード可能日
              </th>
              <th
                style={{
                  padding: '16px',
                  textAlign: 'center',
                  color: '#b0c8ff',
                  fontWeight: 'normal',
                }}
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredMatches.length > 0 ? (
              filteredMatches.map(match => (
                <tr
                  key={match.id}
                  style={{
                    borderBottom: '1px solid #1E3A5F',
                  }}
                >
                  <td
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      color: 'white',
                    }}
                  >
                    {match.name}
                  </td>
                  <td
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      color: '#b0c4d8',
                    }}
                  >
                    {match.uploadDate}
                  </td>
                  <td
                    style={{
                      padding: '16px',
                      textAlign: 'center',
                      color: '#b0c4d8',
                    }}
                  >
                    {match.downloadableAt ? match.downloadableAt : '-'}
                  </td>
                  <td
                    style={{
                      padding: '16px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      <button
                        style={{
                          background: 'transparent',
                          border: '1px solid #00c8ff',
                          borderRadius: '4px',
                          color: '#00c8ff',
                          padding: '6px 10px',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          setModalComment(
                            match.comment || '詳細情報がありません'
                          );
                          setModalOpen(true);
                        }}
                      >
                        詳細
                      </button>
                      <button
                        style={{
                          background: 'transparent',
                          border: '1px solid #ff4d4d',
                          borderRadius: '4px',
                          color: '#ff4d4d',
                          padding: '6px 10px',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                        }}
                        onClick={async () => {
                          if (!window.confirm('本当に削除しますか？')) return;
                          try {
                            await deleteMyFile(match.id);
                            setMatches(prev =>
                              prev.filter(m => m.id !== match.id)
                            );
                            toast.success('ファイルを削除しました');
                          } catch (e: any) {
                            toast.error(e.message || '削除に失敗しました');
                          }
                        }}
                      >
                        削除
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    padding: '32px',
                    textAlign: 'center',
                    color: '#b0c4d8',
                  }}
                >
                  {searchQuery
                    ? '検索条件に一致するマッチデータが見つかりませんでした'
                    : 'アップロードしたマッチデータはありません'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* モーダル */}
      {modalOpen && (
        <div
          role="dialog"
          aria-labelledby="match-detail-modal-title"
          aria-describedby="match-detail-modal-content"
          aria-modal="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: Z_INDEX.modal,
          }}
          onClick={() => setModalOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setModalOpen(false);
            }
          }}
        >
          <div
            style={{
              background: '#1E293B',
              color: 'white',
              borderRadius: '10px',
              padding: '32px',
              minWidth: '320px',
              maxWidth: '90vw',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="match-detail-modal-title" style={{ marginBottom: '16px' }}>マッチ詳細</h3>
            <div id="match-detail-modal-content" style={{ marginBottom: '24px', whiteSpace: 'pre-line' }}>
              {modalComment}
            </div>
            <button
              aria-label="モーダルを閉じる"
              onClick={() => setModalOpen(false)}
              style={{
                background: '#00c8ff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 24px',
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadedMatchesSection;
