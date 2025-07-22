'use client';

import React, { useState } from 'react';
import { sumDLSearchTeam, sumDownload } from '@/utils/api';

// --- ページネーション型 ---
type PaginationMeta = {
  current_page: number;
  last_page: number;
  total: number;
};

// --- ページ番号配列生成 ---
function getPaginationRange(current: number, last: number, delta = 2) {
  const range: (number | string)[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(last - 1, current + delta);

  range.push(1);
  if (left > 2) range.push('...');
  for (let i = left; i <= right; i++) range.push(i);
  if (right < last - 1) range.push('...');
  if (last > 1) range.push(last);
  return range;
}

import Footer from '@/components/Footer';
import Header from '@/components/Header';

export interface TeamData {
  id: string;
  file_name: string;
  upload_owner_name: string;
  created_at: string;
  file_comment: string;
  downloadable_at: string;
  search_tag1: string;
  search_tag2: string;
  search_tag3: string;
  search_tag4: string;
  selected: boolean;
}

const ClientSumDownloadTeamSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [teamData, setTeamData] = useState<TeamData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 50;
  // 検索実行（ページ指定）
  const handleSearch = async (keyword: string, page: number = 1) => {
    try {
      const result = await sumDLSearchTeam(keyword, page);
      const mapped = (result.data || []).map((item: any) => ({
        id: String(item.id),
        file_name: item.file_name || '',
        upload_owner_name: item.upload_owner_name || '',
        created_at: item.created_at || '',
        file_comment: item.file_comment || '',
        downloadable_at: item.downloadable_at || '',
        search_tag1: item.search_tag1 || '',
        search_tag2: item.search_tag2 || '',
        search_tag3: item.search_tag3 || '',
        search_tag4: item.search_tag4 || '',
        selected: false,
      }));
      setTeamData(mapped);
      setCurrentPage(result.current_page || 1);
      setLastPage(result.last_page || 1);
      setTotal(result.total || 0);
      setSelectAll(false);
    } catch (e) {
      setTeamData([]);
      setSelectAll(false);
    }
  };

  // 初回マウント時に即検索
  React.useEffect(() => {
    handleSearch('', 1);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery, 1);
  };

  // ページ切り替え
  const handlePageChange = (page: number) => {
    handleSearch(searchQuery, page);
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setTeamData(teamData.map(team => ({ ...team, selected: newSelectAll })));
  };
  const handleSelectTeam = (id: string) => {
    const updated = teamData.map(team =>
      team.id === id ? { ...team, selected: !team.selected } : team
    );
    setTeamData(updated);
    setSelectAll(updated.every(team => team.selected));
  };

  const handleDownload = async () => {
    const selectedTeams = teamData.filter(team => team.selected);
    if (selectedTeams.length === 0) {
      alert('ダウンロードするチームを選択してください');
      return;
    }
    setIsDownloading(true);
    try {
      await sumDownload(selectedTeams.map(team => Number(team.id)));
    } catch (e: any) {
      alert('ダウンロードに失敗しました');
    } finally {
      setIsDownloading(false);
    }
  };

  const selectedCount = teamData.filter(team => team.selected).length;

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
          <h1
            style={{
              color: '#00c8ff',
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}
          >
            チームデータ一括ダウンロード
          </h1>
          <p
            style={{
              color: '#b0c4d8',
              fontSize: '1rem',
              marginBottom: '24px',
            }}
          >
            複数のチームデータを選択して一括ダウンロードできます。
          </p>

          {/* 検索バー */}
          <div
            style={{
              display: 'flex',
              marginBottom: '24px',
              alignItems: 'center',
            }}
          >
            <form
              onSubmit={handleSearchSubmit}
              style={{
                display: 'flex',
                flex: 1,
                position: 'relative',
                marginRight: '16px',
              }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="チーム名"
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  paddingRight: '60px',
                  borderRadius: '50px',
                  border: 'none',
                  background: '#020824',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none',
                  boxShadow: 'inset 0 0 0 2px #1E3A5F',
                }}
                aria-label="検索ワード"
              />
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: 4,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#3B82F6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  height: 40,
                  width: 40,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1,
                }}
                aria-label="検索実行"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </form>

            {/* ダウンロードボタン */}
            <button
              onClick={handleDownload}
              disabled={isDownloading || selectedCount === 0}
              style={{
                padding: '0 24px',
                background: '#00c8ff',
                color: '#020824',
                border: 'none',
                borderRadius: '24px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor:
                  selectedCount === 0 || isDownloading
                    ? 'not-allowed'
                    : 'pointer',
                opacity: selectedCount === 0 || isDownloading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                height: 48,
                marginLeft: 16,
              }}
            >
              {isDownloading ? (
                <>
                  <svg
                    style={{
                      width: '20px',
                      height: '20px',
                      animation: 'spin 1s linear infinite',
                    }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                  </svg>
                  ダウンロード中...
                </>
              ) : (
                <>
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
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  ダウンロード ({selectedCount})
                </>
              )}
            </button>
          </div>

          {/* 選択情報 */}
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
              {teamData.length}件のチームデータが見つかりました
            </div>
            <div
              style={{
                color: '#00c8ff',
                fontSize: '0.9rem',
              }}
            >
              {/* {selectedCount > 0 ? `${selectedCount}件選択中 (合計 ${totalFileSize} MB)` : ''} */}
            </div>
          </div>

          {/* チームデータテーブル */}
          <div
            style={{
              background: '#0A1022',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              border: '1px solid #1E3A5F',
              marginBottom: '32px',
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
                      width: '40px',
                    }}
                  >
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: '#00c8ff',
                        }}
                      />
                    </label>
                  </th>
                  <th
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      color: '#b0c4d8',
                      fontWeight: 'normal',
                    }}
                  >
                    チーム名
                  </th>
                  <th
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      color: '#b0c4d8',
                      fontWeight: 'normal',
                    }}
                  >
                    オーナー
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
                      textAlign: 'left',
                      color: '#b0c4d8',
                      fontWeight: 'normal',
                    }}
                  >
                    ダウンロード可能日
                  </th>
                  <th
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      color: '#b0c4d8',
                      fontWeight: 'normal',
                    }}
                  >
                    コメント
                  </th>
                </tr>
              </thead>
              <tbody>
                {teamData.map((team, index) => (
                  <tr
                    key={index + (currentPage - 1) * pageSize}
                    style={{
                      background: index % 2 === 0 ? '#0F1A2E' : '#0A1022',
                      borderBottom: '1px solid #1E3A5F',
                    }}
                  >
                    <td
                      style={{
                        padding: '16px',
                        textAlign: 'left',
                        color: '#b0c4d8',
                        fontWeight: 'normal',
                        width: '40px',
                      }}
                    >
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={team.selected}
                          onChange={() => handleSelectTeam(team.id)}
                          style={{
                            width: '18px',
                            height: '18px',
                            accentColor: '#00c8ff',
                            cursor: 'pointer',
                            marginRight: '8px',
                          }}
                        />
                      </label>
                    </td>
                    <td
                      style={{
                        padding: '16px',
                        textAlign: 'left',
                        color: '#b0c4d8',
                        fontWeight: 'normal',
                      }}
                    >
                      {team.file_name}
                    </td>
                    <td
                      style={{
                        padding: '16px',
                        textAlign: 'left',
                        color: '#b0c4d8',
                        fontWeight: 'normal',
                      }}
                    >
                      {team.upload_owner_name}
                    </td>
                    <td
                      style={{
                        padding: '16px',
                        textAlign: 'left',
                        color: '#b0c4d8',
                        fontWeight: 'normal',
                        lineHeight: 1.5,
                      }}
                    >
                      <div>{team.created_at}</div>
                    </td>
                    <td
                      style={{
                        padding: '16px',
                        textAlign: 'left',
                        color: '#b0c4d8',
                        fontWeight: 'normal',
                      }}
                    >
                      {team.downloadable_at}
                    </td>
                    <td
                      style={{
                        padding: '16px',
                        textAlign: 'left',
                        color: '#b0c4d8',
                        fontWeight: 'normal',
                      }}
                    >
                      {team.file_comment
                        ? team.file_comment.split(/\r?\n/).map((line, idx) => (
                            <React.Fragment key={idx}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))
                        : ''}
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ページネーション（サンプルUI風） */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
              margin: '24px 0',
            }}
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: '8px 18px',
                borderRadius: 6,
                border: 'none',
                background: currentPage === 1 ? '#1E3A5F' : '#3B82F6',
                color: currentPage === 1 ? '#8CB4FF' : '#fff',
                fontWeight: 'bold',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                marginRight: 8,
              }}
            >
              前へ
            </button>
            {getPaginationRange(currentPage, lastPage, 2).map((page, idx) =>
              page === '...' ? (
                <span
                  key={`ellipsis-${idx}`}
                  style={{ color: '#8CB4FF', padding: '0 10px' }}
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(Number(page))}
                  disabled={page === currentPage}
                  style={{
                    minWidth: 40,
                    padding: '8px 0',
                    borderRadius: 6,
                    border: 'none',
                    background: page === currentPage ? '#00c8ff' : '#19223a',
                    color: page === currentPage ? '#020824' : '#8CB4FF',
                    fontWeight: 'bold',
                    cursor: page === currentPage ? 'default' : 'pointer',
                    fontSize: '1rem',
                    marginRight: 4,
                  }}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === lastPage}
              style={{
                padding: '8px 18px',
                borderRadius: 6,
                border: 'none',
                background: currentPage === lastPage ? '#1E3A5F' : '#3B82F6',
                color: currentPage === lastPage ? '#8CB4FF' : '#fff',
                fontWeight: 'bold',
                cursor: currentPage === lastPage ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                marginLeft: 8,
              }}
            >
              次へ
            </button>
          </div>

          {/* ダウンロードボタン（下部） */}
          {selectedCount > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '32px',
              }}
            >
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                style={{
                  padding: '16px 32px',
                  background: '#00c8ff',
                  color: '#020824',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: isDownloading ? 'not-allowed' : 'pointer',
                  opacity: isDownloading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {isDownloading ? (
                  <>
                    <svg
                      style={{
                        width: '20px',
                        height: '20px',
                        animation: 'spin 1s linear infinite',
                      }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="2" x2="12" y2="6"></line>
                      <line x1="12" y1="18" x2="12" y2="22"></line>
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                      <line x1="2" y1="12" x2="6" y2="12"></line>
                      <line x1="18" y1="12" x2="22" y2="12"></line>
                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                    </svg>
                    ダウンロード中...
                  </>
                ) : (
                  <>
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
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </>
                )}
              </button>
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
              <li>一度に最大50件までのチームデータをダウンロードできます。</li>
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

export default ClientSumDownloadTeamSearch;
