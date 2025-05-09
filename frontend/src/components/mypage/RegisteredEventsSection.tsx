'use client';

import React, { useState } from 'react';

// イベント種別の定義
type EventType = '大会' | '告知' | 'その他';

interface EventData {
  id: string;
  name: string;
  details: string;
  url: string;
  deadline: string;
  endDisplayDate: string;
  type: EventType;
  status: '承認済' | '審査中' | '非公開';
  registeredDate: string;
}

interface RegisteredEventsSectionProps {
  initialEvents: EventData[];
}

const RegisteredEventsSection: React.FC<RegisteredEventsSectionProps> = ({ initialEvents }) => {
  // setEventsは現在使用されていないが、将来的に使用する可能性があるため、
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [events, setEvents] = useState<EventData[]>(initialEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // ステータスに応じた色を返す関数
  const getStatusColor = (status: string) => {
    switch (status) {
      case '承認済':
        return '#4CAF50';
      case '審査中':
        return '#FFC107';
      case '非公開':
        return '#9E9E9E';
      default:
        return '#b0c4d8';
    }
  };

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
        登録したイベント
      </h2>

      {/* 検索・フィルター */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          position: 'relative',
          flex: '1',
          minWidth: '200px'
        }}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="イベント名で検索"
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
        
        <div style={{
          minWidth: '200px'
        }}>
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#0F1A2E',
              border: '1px solid #1E3A5F',
              borderRadius: '6px',
              color: 'white',
              fontSize: '1rem',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300c8ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px'
            }}
          >
            <option value="all">すべてのステータス</option>
            <option value="承認済">承認済</option>
            <option value="審査中">審査中</option>
            <option value="非公開">非公開</option>
          </select>
        </div>
      </div>

      {/* イベントデータテーブル */}
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
                イベント名
              </th>
              <th style={{
                padding: '16px',
                textAlign: 'left',
                color: '#b0c4d8',
                fontWeight: 'normal'
              }}>
                種別
              </th>
              <th style={{
                padding: '16px',
                textAlign: 'left',
                color: '#b0c4d8',
                fontWeight: 'normal'
              }}>
                締切日
              </th>
              <th style={{
                padding: '16px',
                textAlign: 'left',
                color: '#b0c4d8',
                fontWeight: 'normal'
              }}>
                表示最終日
              </th>
              <th style={{
                padding: '16px',
                textAlign: 'center',
                color: '#b0c4d8',
                fontWeight: 'normal'
              }}>
                ステータス
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
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <tr
                  key={event.id}
                  style={{
                    borderBottom: '1px solid #1E3A5F'
                  }}
                >
                  <td style={{
                    padding: '16px',
                    textAlign: 'left',
                    color: 'white'
                  }}>
                    {event.name}
                  </td>
                  <td style={{
                    padding: '16px',
                    textAlign: 'left',
                    color: '#b0c4d8'
                  }}>
                    {event.type}
                  </td>
                  <td style={{
                    padding: '16px',
                    textAlign: 'left',
                    color: '#b0c4d8'
                  }}>
                    {event.deadline}
                  </td>
                  <td style={{
                    padding: '16px',
                    textAlign: 'left',
                    color: '#b0c4d8'
                  }}>
                    {event.endDisplayDate}
                  </td>
                  <td style={{
                    padding: '16px',
                    textAlign: 'center'
                  }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      backgroundColor: `${getStatusColor(event.status)}20`,
                      color: getStatusColor(event.status),
                      border: `1px solid ${getStatusColor(event.status)}`
                    }}>
                      {event.status}
                    </span>
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
                  {searchQuery || statusFilter !== 'all' ? '検索条件に一致するイベントが見つかりませんでした' : '登録したイベントはありません'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegisteredEventsSection;
