'use client';

import React, { useState } from 'react';

interface MatchData {
  id: string;
  name: string;
  teams: string;
  uploadDate: string;
  downloadCount: number;
  fileSize: string;
}

interface UploadedMatchesSectionProps {
  initialMatches: MatchData[];
}

const UploadedMatchesSection: React.FC<UploadedMatchesSectionProps> = ({ initialMatches }) => {
  // setMatchesは現在使用されていないが、将来的に使用する可能性があるため、
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [matches, setMatches] = useState<MatchData[]>(initialMatches);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredMatches = matches.filter(match => 
    match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.teams.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{
      background: '#0A1022',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #1E3A5F',
      marginBottom: '24px'
    }}>
      <h2 style={{
        color: '#00c8ff',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '20px'
      }}>
        アップロードしたマッチデータ
      </h2>

      {/* 検索バー */}
      <div style={{
        position: 'relative',
        marginBottom: '20px'
      }}>
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

      {/* マッチデータテーブル */}
      <div style={{
        overflowX: 'auto'
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
                対戦チーム
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
              <th style={{
                padding: '16px',
                textAlign: 'center',
                color: '#b0c4d8',
                fontWeight: 'normal'
              }}>
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match) => (
                <tr
                  key={match.id}
                  style={{
                    borderBottom: '1px solid #1E3A5F'
                  }}
                >
                  <td style={{
                    padding: '16px',
                    textAlign: 'left',
                    color: 'white'
                  }}>
                    {match.name}
                  </td>
                  <td style={{
                    padding: '16px',
                    textAlign: 'left',
                    color: '#b0c4d8'
                  }}>
                    {match.teams}
                  </td>
                  <td style={{
                    padding: '16px',
                    textAlign: 'left',
                    color: '#b0c4d8'
                  }}>
                    {match.uploadDate}
                  </td>
                  <td style={{
                    padding: '16px',
                    textAlign: 'center',
                    color: '#8CB4FF'
                  }}>
                    {match.downloadCount}
                  </td>
                  <td style={{
                    padding: '16px',
                    textAlign: 'center',
                    color: '#8CB4FF'
                  }}>
                    {match.fileSize}
                  </td>
                  <td style={{
                    padding: '16px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '8px'
                    }}>
                      <button
                        style={{
                          background: 'transparent',
                          border: '1px solid #00c8ff',
                          borderRadius: '4px',
                          color: '#00c8ff',
                          padding: '6px 10px',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
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
                          cursor: 'pointer'
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
                  colSpan={6}
                  style={{
                    padding: '32px',
                    textAlign: 'center',
                    color: '#b0c4d8'
                  }}
                >
                  {searchQuery ? '検索条件に一致するマッチデータが見つかりませんでした' : 'アップロードしたマッチデータはありません'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UploadedMatchesSection;
