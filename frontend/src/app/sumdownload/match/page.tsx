'use client';

import React, { useState } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

interface TeamData {
  id: string;
  name: string;
  owner: string;
  uploadDate: string;
  downloadCount: number;
  fileSize: string;
  selected: boolean;
}

const SumDownloadTeamPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [teamData, setTeamData] = useState<TeamData[]>([
    {
      id: '1',
      name: 'Alpha Squad',
      owner: 'Takeshi',
      uploadDate: '2025-05-01',
      downloadCount: 128,
      fileSize: '2.4 MB',
      selected: false
    },
    {
      id: '2',
      name: 'Beta Team',
      owner: 'Yuki',
      uploadDate: '2025-05-02',
      downloadCount: 95,
      fileSize: '1.8 MB',
      selected: false
    },
    {
      id: '3',
      name: 'Gamma Force',
      owner: 'Kenji',
      uploadDate: '2025-05-03',
      downloadCount: 76,
      fileSize: '3.1 MB',
      selected: false
    },
    {
      id: '4',
      name: 'Delta Squad',
      owner: 'Haruka',
      uploadDate: '2025-05-04',
      downloadCount: 42,
      fileSize: '2.2 MB',
      selected: false
    },
    {
      id: '5',
      name: 'Epsilon Team',
      owner: 'Satoshi',
      uploadDate: '2025-05-05',
      downloadCount: 31,
      fileSize: '1.5 MB',
      selected: false
    },
    {
      id: '6',
      name: 'Zeta Force',
      owner: 'Akira',
      uploadDate: '2025-05-06',
      downloadCount: 18,
      fileSize: '2.7 MB',
      selected: false
    }
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setTeamData(teamData.map(team => ({
      ...team,
      selected: newSelectAll
    })));
  };

  const handleSelectTeam = (id: string) => {
    const updatedTeamData = teamData.map(team =>
      team.id === id ? { ...team, selected: !team.selected } : team
    );
    setTeamData(updatedTeamData);
    setSelectAll(updatedTeamData.every(team => team.selected));
  };

  const handleDownload = () => {
    const selectedTeams = teamData.filter(team => team.selected);
    if (selectedTeams.length === 0) {
      alert('ダウンロードするマッチを選択してください');
      return;
    }

    setIsDownloading(true);

    // 実際のアプリケーションでは、ここでAPIを呼び出してファイルをダウンロード
    console.log('ダウンロード対象:', selectedTeams);

    // ダウンロードの模擬（実際のアプリケーションではAPIコールに置き換え）
    setTimeout(() => {
      setIsDownloading(false);
      alert(`${selectedTeams.length}個のマッチデータをダウンロードしました`);
    }, 1500);
  };

  const filteredTeamData = teamData.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCount = teamData.filter(team => team.selected).length;
  const totalFileSize = teamData
    .filter(team => team.selected)
    .reduce((total, team) => total + parseFloat(team.fileSize.replace(' MB', '')), 0)
    .toFixed(1);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'rgb(var(--background-rgb))'
    }}>
      <Header />

      <main style={{
        flex: '1',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h1 style={{
            color: '#00c8ff',
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '8px'
          }}>
            マッチデータ一括ダウンロード
          </h1>
          <p style={{
            color: '#b0c4d8',
            fontSize: '1rem',
            marginBottom: '24px'
          }}>
            複数のマッチデータを選択して一括ダウンロードできます。
          </p>

          {/* 検索バー */}
          <div style={{
            display: 'flex',
            marginBottom: '24px'
          }}>
            <div style={{
              position: 'relative',
              flex: '1',
              marginRight: '16px'
            }}>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="マッチ名またはオーナー名で検索"
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 40px',
                  background: '#0F1A2E',
                  border: '1px solid #1E3A5F',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '1rem'
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
                  color: '#8CB4FF'
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
            <button
              onClick={handleDownload}
              disabled={isDownloading || selectedCount === 0}
              style={{
                padding: '0 24px',
                background: '#00c8ff',
                color: '#020824',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: selectedCount === 0 || isDownloading ? 'not-allowed' : 'pointer',
                opacity: selectedCount === 0 || isDownloading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isDownloading ? (
                <>
                  <svg
                    style={{
                      width: '20px',
                      height: '20px',
                      animation: 'spin 1s linear infinite'
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
                      height: '20px'
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
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div style={{
              color: '#b0c4d8',
              fontSize: '0.9rem'
            }}>
              {filteredTeamData.length}件のマッチデータが見つかりました
            </div>
            <div style={{
              color: '#00c8ff',
              fontSize: '0.9rem'
            }}>
              {selectedCount > 0 ? `${selectedCount}件選択中 (合計 ${totalFileSize} MB)` : ''}
            </div>
          </div>

          {/* チームデータテーブル */}
          <div style={{
            background: '#0A1022',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            border: '1px solid #1E3A5F',
            marginBottom: '32px'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
              <tr style={{
                background: '#0F1A2E',
                borderBottom: '1px solid #1E3A5F'
              }}>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  color: '#b0c4d8',
                  fontWeight: 'normal',
                  width: '40px'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: '#00c8ff'
                      }}
                    />
                  </label>
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  color: '#b0c4d8',
                  fontWeight: 'normal'
                }}>
                  マッチ名
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  color: '#b0c4d8',
                  fontWeight: 'normal'
                }}>
                  オーナー
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  color: '#b0c4d8',
                  fontWeight: 'normal'
                }}>
                  アップロード日
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'center',
                  color: '#b0c4d8',
                  fontWeight: 'normal'
                }}>
                  DL数
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'center',
                  color: '#b0c4d8',
                  fontWeight: 'normal'
                }}>
                  サイズ
                </th>
              </tr>
              </thead>
              <tbody>
              {filteredTeamData.length > 0 ? (
                filteredTeamData.map((team) => (
                  <tr
                    key={team.id}
                    style={{
                      borderBottom: '1px solid #1E3A5F',
                      background: team.selected ? 'rgba(0, 200, 255, 0.05)' : 'transparent',
                      transition: 'background 0.2s'
                    }}
                  >
                    <td style={{
                      padding: '16px',
                      textAlign: 'left'
                    }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="checkbox"
                          checked={team.selected}
                          onChange={() => handleSelectTeam(team.id)}
                          style={{
                            width: '18px',
                            height: '18px',
                            accentColor: '#00c8ff'
                          }}
                        />
                      </label>
                    </td>
                    <td style={{
                      padding: '16px',
                      textAlign: 'left',
                      color: 'white',
                      fontWeight: team.selected ? 'bold' : 'normal'
                    }}>
                      {team.name}
                    </td>
                    <td style={{
                      padding: '16px',
                      textAlign: 'left',
                      color: '#b0c4d8'
                    }}>
                      {team.owner}
                    </td>
                    <td style={{
                      padding: '16px',
                      textAlign: 'left',
                      color: '#b0c4d8'
                    }}>
                      {team.uploadDate}
                    </td>
                    <td style={{
                      padding: '16px',
                      textAlign: 'center',
                      color: '#8CB4FF'
                    }}>
                      {team.downloadCount}
                    </td>
                    <td style={{
                      padding: '16px',
                      textAlign: 'center',
                      color: '#8CB4FF'
                    }}>
                      {team.fileSize}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: '32px',
                      textAlign: 'center',
                      color: '#b0c4d8'
                    }}
                  >
                    検索条件に一致するマッチデータが見つかりませんでした
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          </div>

          {/* ダウンロードボタン（下部） */}
          {selectedCount > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '32px'
            }}>
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
                  gap: '8px'
                }}
              >
                {isDownloading ? (
                  <>
                    <svg
                      style={{
                        width: '20px',
                        height: '20px',
                        animation: 'spin 1s linear infinite'
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
                        height: '20px'
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
                    選択したチームデータをダウンロード ({selectedCount}件 / {totalFileSize} MB)
                  </>
                )}
              </button>
            </div>
          )}

          {/* 注意事項 */}
          <div style={{
            background: '#0A1022',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #1E3A5F'
          }}>
            <h2 style={{
              color: '#00c8ff',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg
                style={{
                  width: '20px',
                  height: '20px'
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
            <ul style={{
              color: '#b0c4d8',
              fontSize: '0.9rem',
              lineHeight: '1.6',
              paddingLeft: '20px'
            }}>
              <li>一度に最大10件までのチームデータをダウンロードできます。</li>
              <li>ダウンロードしたデータは自動的にZIPファイルに圧縮されます。</li>
              <li>ダウンロード履歴はアカウント設定ページで確認できます。</li>
              <li>ダウンロードに問題がある場合は、管理者にお問い合わせください。</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SumDownloadTeamPage;
