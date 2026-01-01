'use client';

import type React from 'react';
import { useState } from 'react';
import { useDeleteEvent, useMyEvents } from '@/hooks/api/useMyPage';
import { Z_INDEX } from '@/lib/utils';
import { getEventTypeDisplay } from '@/schemas/event';
import type { MyPageEvent } from '@/types/user';

const RegisteredEventsSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDetails, setModalDetails] = useState('');
  const { data: events = [], isLoading, error } = useMyEvents();
  const deleteEventMutation = useDeleteEvent();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = (event?.name ?? '')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

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
        <div style={{ color: '#b0c4d8' }}>イベント情報を読み込み中...</div>
      </div>
    );
  }

  if (error) {
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
        <p style={{ color: '#ff6b6b', margin: 0 }}>
          イベント情報の読み込みに失敗しました
        </p>
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
      <h2
        style={{
          color: '#00c8ff',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '20px',
        }}
      >
        登録したイベント
      </h2>

      {/* 検索・フィルター */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            position: 'relative',
            flex: '1',
            minWidth: '200px',
          }}
        >
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
      </div>

      {/* イベントデータテーブル */}
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
                イベント名
              </th>
              <th
                style={{
                  padding: '16px',
                  textAlign: 'left',
                  color: '#b0c4d8',
                  fontWeight: 'normal',
                }}
              >
                種別
              </th>
              <th
                style={{
                  padding: '16px',
                  textAlign: 'left',
                  color: '#b0c4d8',
                  fontWeight: 'normal',
                }}
              >
                締切日
              </th>
              <th
                style={{
                  padding: '16px',
                  textAlign: 'left',
                  color: '#b0c4d8',
                  fontWeight: 'normal',
                }}
              >
                表示最終日
              </th>
              <th
                style={{
                  padding: '16px',
                  textAlign: 'center',
                  color: '#b0c4d8',
                  fontWeight: 'normal',
                }}
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <tr
                  key={event.id}
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
                    {event.name}
                  </td>
                  <td
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      color: '#b0c4d8',
                    }}
                  >
                    {getEventTypeDisplay(event.type)}
                  </td>
                  <td
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      color: '#b0c4d8',
                    }}
                  >
                    {(() => {
                      if (!event.deadline) return '';
                      const d = new Date(event.deadline);
                      const hours = String(d.getUTCHours()).padStart(2, '0');
                      const minutes = String(d.getUTCMinutes()).padStart(2, '0');
                      return `${d.getUTCFullYear()}/${d.getUTCMonth() + 1}/${d.getUTCDate()} ${hours}:${minutes}`;
                    })()}
                  </td>
                  <td
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      color: '#b0c4d8',
                    }}
                  >
                    {(() => {
                      if (!event.endDisplayDate) return '';
                      const d = new Date(event.endDisplayDate);
                      const hours = String(d.getUTCHours()).padStart(2, '0');
                      const minutes = String(d.getUTCMinutes()).padStart(2, '0');
                      return `${d.getUTCFullYear()}/${d.getUTCMonth() + 1}/${d.getUTCDate()} ${hours}:${minutes}`;
                    })()}
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
                          setModalDetails(event.details);
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
                          if (
                            !window.confirm(
                              '本当にこのイベントを削除しますか？'
                            )
                          )
                            return;
                          try {
                            await deleteEventMutation.mutateAsync(event.id);
                          } catch (error) {
                            console.error('Delete failed:', error);
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
                  colSpan={6}
                  style={{
                    padding: '32px',
                    textAlign: 'center',
                    color: '#b0c4d8',
                  }}
                >
                  {searchQuery
                    ? '検索条件に一致するイベントが見つかりませんでした'
                    : '登録したイベントはありません'}
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
          aria-labelledby="event-detail-modal-title"
          aria-describedby="event-detail-modal-content"
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
            <h3 id="event-detail-modal-title" style={{ marginBottom: '16px' }}>イベント詳細</h3>
            <div id="event-detail-modal-content" style={{ marginBottom: '24px', whiteSpace: 'pre-line' }}>
              {modalDetails || '詳細情報がありません'}
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

export default RegisteredEventsSection;
