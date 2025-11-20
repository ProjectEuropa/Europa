'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import Calendar from '@/components/Calendar';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import type { Event } from '@/types/event';
import { fetchEvents } from '@/utils/api';

const InformationPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents()
      .then(events => setEvents(events)) // 配列を直接使用
      .catch(() => alert('イベント情報の取得に失敗しました'))
      .finally(() => setLoading(false));
  }, []);

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
          padding: '40px 20px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <h1
              style={{
                color: '#00c8ff',
                fontSize: '2rem',
                fontWeight: 'bold',
              }}
            >
              Information
            </h1>
            <div
              style={{
                marginLeft: '16px',
                color: '#b0c4d8',
                fontSize: '1rem',
              }}
            >
              - Carnage Heart EXA Uploader -
            </div>
          </div>

          {/* メインコンテンツ */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
            }}
          >
            {/* カレンダー */}
            <div
              style={{
                background: '#0A1022',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #1E3A5F',
              }}
            >
              <h2
                style={{
                  color: '#00c8ff',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  marginBottom: '24px',
                  textAlign: 'center',
                }}
              >
                カレンダー
              </h2>
              <div
                style={{
                  width: '100%',
                }}
              >
                <Calendar
                  initialDate={new Date()}
                  events={events.map(ev => ({
                    date: ev.deadline,
                    title: ev.name,
                    details: ev.details,
                    url: ev.url,
                  }))}
                />
              </div>
            </div>

            {/* 予定リスト（API連携） */}
            <div
              style={{
                background: '#0A1022',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #1E3A5F',
              }}
            >
              <h2
                style={{
                  color: '#00c8ff',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                }}
              >
                今後の予定
              </h2>
              {loading ? (
                <div
                  style={{
                    color: '#b0c4d8',
                    textAlign: 'center',
                    padding: '16px',
                  }}
                >
                  Loading...
                </div>
              ) : events.length === 0 ? (
                <div
                  style={{
                    color: '#b0c4d8',
                    textAlign: 'center',
                    padding: '16px',
                  }}
                >
                  予定はありません
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {events.map(ev => (
                    <div
                      key={ev.id}
                      style={{
                        display: 'flex',
                        padding: '12px',
                        background: 'rgba(0, 200, 255, 0.05)',
                        borderRadius: '8px',
                        border: '1px solid #1E3A5F',
                      }}
                    >
                      <div
                        style={{
                          width: '120px',
                          color: '#00c8ff',
                          fontWeight: 'bold',
                          flexShrink: 0,
                        }}
                      >
                        {ev.deadline
                          ? new Date(ev.deadline).toLocaleDateString('ja-JP', {
                            month: 'numeric',
                            day: 'numeric',
                            year: 'numeric',
                          })
                          : ''}
                      </div>
                      <div
                        style={{
                          flex: '1',
                          color: '#fff',
                        }}
                      >
                        <div
                          style={{ fontWeight: 'bold', marginBottom: '2px' }}
                        >
                          {ev.name}
                        </div>
                        <div style={{ fontSize: '0.95em', color: '#b0c4d8' }}>
                          {ev.details}
                        </div>
                        {ev.url && (
                          <div style={{ marginTop: '2px' }}>
                            <a
                              href={ev.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: '#8CB4FF',
                                textDecoration: 'underline',
                                fontSize: '0.95em',
                              }}
                            >
                              詳細リンク
                            </a>
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          width: '100px',
                          color: '#b0c4d8',
                          textAlign: 'right',
                          flexShrink: 0,
                        }}
                      >
                        {ev.deadline
                          ? new Date(ev.deadline).toLocaleTimeString('ja-JP', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                          : ''}
                        まで
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InformationPage;
