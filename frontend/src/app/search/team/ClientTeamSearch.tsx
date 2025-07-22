'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DeleteModal } from '@/components/DeleteModal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import TeamCards, { type TeamData } from '@/components/search/TeamCards';
import {
  deleteSearchFile,
  searchTeams,
  tryDownloadTeamFile,
} from '@/utils/api';

export default function ClientTeamSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSearchQuery(searchParams.get('keyword') || '');
    setCurrentPage(1); // クエリ変更時は1ページ目に戻す
  }, [searchParams]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCardView, setIsCardView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    file_name: string;
  } | null>(null);

  useEffect(() => {
    const kw = searchParams.get('keyword') || '';
    setSearchQuery(kw);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    searchTeams(searchQuery, currentPage)
      .then(result => {
        setTeams(result.data ?? []);
        setCurrentPage(result.current_page ?? 1);
        setTotalPages(result.last_page ?? 1);
      })
      .catch(() => {
        setTeams([]);
        setError('検索失敗');
      })
      .finally(() => setLoading(false));
  }, [searchQuery, currentPage]);

  const handleDownload = async (team: TeamData) => {
    const result = await tryDownloadTeamFile(team.id);
    if (!result.success) {
      toast.error(result.error, { duration: 4000 });
    }
  };
  const handleDeleteClick = (team: TeamData) => {
    setDeleteTarget({ id: team.id, file_name: team.file_name });
    setDeleteModalOpen(true);
  };

  const handleDelete = async (password: string) => {
    if (!deleteTarget) return;
    try {
      const result = await deleteSearchFile(deleteTarget.id, password);
      setTeams(teams => teams.filter(t => t.id !== deleteTarget.id));
      toast.success(result.message || '削除しました');
    } catch (e: any) {
      toast.error(e.message || '削除に失敗しました');
    }
  };

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
      <DeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onDelete={handleDelete}
        fileName={deleteTarget?.file_name || ''}
      />

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

        <form
          onSubmit={e => {
            e.preventDefault();
            const params = new URLSearchParams(searchParams.toString());
            params.set('keyword', searchQuery);
            router.push(`?${params.toString()}`);
          }}
          style={{ width: '100%', maxWidth: '800px', position: 'relative' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#111A2E',
              borderRadius: '9999px',
              border: '1px solid #1E3A5F',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="チーム名"
              style={{
                width: '100%',
                padding: '14px 24px',
                background: 'transparent',
                color: '#fff',
                border: 'none',
                outline: 'none',
                fontSize: '1.1rem',
              }}
            />
            <button
              type="submit"
              aria-label="検索"
              disabled={!searchQuery.trim()}
              style={{
                background: 'linear-gradient(90deg, #3B82F6, #00c8ff)',
                border: 'none',
                borderRadius: '50%',
                width: 44,
                height: 44,
                marginLeft: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: !searchQuery.trim() ? 'not-allowed' : 'pointer',
                opacity: searchQuery.trim() ? 1 : 0.6,
                transition: 'box-shadow .2s, opacity .2s',
                boxShadow: searchQuery.trim() ? '0 0 0 2px #00c8ff33' : 'none',
              }}
              onMouseOver={e => {
                if (searchQuery.trim())
                  e.currentTarget.style.boxShadow = '0 0 8px 2px #00c8ff88';
              }}
              onMouseOut={e => {
                if (searchQuery.trim())
                  e.currentTarget.style.boxShadow = '0 0 0 2px #00c8ff33';
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="10" cy="10" r="7" stroke="#fff" strokeWidth="2" />
                <line
                  x1="16"
                  y1="16"
                  x2="20"
                  y2="20"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </form>

        {loading && (
          <div style={{ color: '#00c8ff', marginTop: 8 }}>検索中...</div>
        )}
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}

        {/* テーブル表示 */}
        {!isCardView && (
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

            {/* チームデータ行 */}
            {teams.map(team => (
              <div
                key={team.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    '100px 120px 12fr 180px 180px 180px 60px',
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
                    onClick={() => handleDownload(team)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                    }}
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
                >
                  {team.upload_owner_name}
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
                  {team.file_comment &&
                    team.file_comment
                      .split(/\r?\n/)
                      .map((line: string, idx: number, arr: string[]) => (
                        <span key={idx}>
                          {line}
                          {idx < arr.length - 1 && <br />}
                        </span>
                      ))}
                  <div style={{ marginTop: 4 }}>
                    {[
                      team.search_tag1,
                      team.search_tag2,
                      team.search_tag3,
                      team.search_tag4,
                    ]
                      .filter(Boolean)
                      .map((tag, i) => (
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
                >
                  {team.file_name}
                </div>

                {/* アップロード日時 */}
                <div
                  style={{
                    color: 'white',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {team.created_at}
                </div>

                {/* ダウンロード可能日時 */}
                <div
                  style={{
                    color: 'white',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {team.downloadable_at}
                </div>

                {/* 削除ボタン：upload_typeが'2'のときだけ表示 */}
                {team.upload_type === '2' && (
                  <div style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => handleDeleteClick(team)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                      }}
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
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {/* ページネーション */}
        {!isCardView && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 24,
            }}
          >
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              style={{
                background: currentPage <= 1 ? '#1E3A5F' : '#3B82F6',
                color: '#8CB4FF',
                border: 'none',
                borderRadius: '4px 0 0 4px',
                padding: '8px 16px',
                marginRight: 4,
                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage <= 1 ? 0.5 : 1,
              }}
            >
              前へ
            </button>
            {/* カスタムページネーションロジック */}
            {(() => {
              const pages: (number | string)[] = [];
              const pageWindow = 5;
              const startPages = Array.from(
                { length: Math.min(5, totalPages) },
                (_, i) => i + 1
              );
              const endPages = Array.from(
                { length: Math.min(5, totalPages) },
                (_, i) => totalPages - 5 + i + 1
              ).filter(p => p > 5);
              const midStart = Math.max(currentPage - pageWindow, 6);
              const midEnd = Math.min(currentPage + pageWindow, totalPages - 5);
              // 最初の5ページ
              startPages.forEach(p => {
                pages.push(p);
              });
              // ...
              if (midStart > 6) pages.push('start-ellipsis');
              // 中央ウィンドウ
              for (let p = midStart; p <= midEnd; ++p) {
                if (p > 5 && p <= totalPages - 5) pages.push(p);
              }
              // ...
              if (midEnd < totalPages - 5) pages.push('end-ellipsis');
              // 最後の5ページ
              endPages.forEach(p => {
                if (!pages.includes(p)) pages.push(p);
              });
              return pages.map((p, idx) =>
                typeof p === 'number' ? (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    style={{
                      background: currentPage === p ? '#00c8ff' : '#111A2E',
                      color: currentPage === p ? '#111A2E' : '#8CB4FF',
                      border: 'none',
                      borderRadius: 0,
                      padding: '8px 16px',
                      marginRight: 2,
                      fontWeight: currentPage === p ? 'bold' : 'normal',
                      cursor: 'pointer',
                    }}
                  >
                    {p}
                  </button>
                ) : (
                  <span
                    key={p + '-' + idx}
                    style={{
                      color: '#8CB4FF',
                      padding: '0 8px',
                      userSelect: 'none',
                    }}
                  >
                    ...
                  </span>
                )
              );
            })()}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              style={{
                background: currentPage >= totalPages ? '#1E3A5F' : '#3B82F6',
                color: '#8CB4FF',
                border: 'none',
                borderRadius: '0 4px 4px 0',
                padding: '8px 16px',
                marginLeft: 4,
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage >= totalPages ? 0.5 : 1,
              }}
            >
              次へ
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
