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
      <div className="bg-[#0A1022] rounded-xl p-6 border border-[#1E3A5F] mb-6 text-center">
        <div className="text-[#b0c4d8]">イベント情報を読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0A1022] rounded-xl p-6 border border-[#1E3A5F] mb-6">
        <p className="text-[#ff6b6b] m-0">
          イベント情報の読み込みに失敗しました
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0A1022] rounded-xl p-6 border border-[#1E3A5F] mb-6">
      <h2 className="text-[#00c8ff] text-2xl font-bold mb-5">
        登録したイベント
      </h2>

      {/* 検索・フィルター */}
      <div className="flex gap-4 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="イベント名で検索"
            className="w-full py-3 pl-10 pr-4 bg-[#0F1A2E] border border-[#1E3A5F] rounded-md text-white text-base"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8CB4FF]"
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
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0F1A2E] border-b border-[#1E3A5F]">
              <th className="p-4 text-left text-[#b0c4d8] font-normal">
                イベント名
              </th>
              <th className="p-4 text-left text-[#b0c4d8] font-normal">
                種別
              </th>
              <th className="p-4 text-left text-[#b0c4d8] font-normal">
                締切日
              </th>
              <th className="p-4 text-left text-[#b0c4d8] font-normal">
                表示最終日
              </th>
              <th className="p-4 text-center text-[#b0c4d8] font-normal">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <tr
                  key={event.id}
                  className="border-b border-[#1E3A5F]"
                >
                  <td className="p-4 text-left text-white">
                    {event.name}
                  </td>
                  <td className="p-4 text-left text-[#b0c4d8]">
                    {getEventTypeDisplay(event.type)}
                  </td>
                  <td className="p-4 text-left text-[#b0c4d8]">
                    {(() => {
                      if (!event.deadline) return '';
                      const d = new Date(event.deadline);
                      const hours = String(d.getUTCHours()).padStart(2, '0');
                      const minutes = String(d.getUTCMinutes()).padStart(2, '0');
                      return `${d.getUTCFullYear()}/${d.getUTCMonth() + 1}/${d.getUTCDate()} ${hours}:${minutes}`;
                    })()}
                  </td>
                  <td className="p-4 text-left text-[#b0c4d8]">
                    {(() => {
                      if (!event.endDisplayDate) return '';
                      const d = new Date(event.endDisplayDate);
                      const hours = String(d.getUTCHours()).padStart(2, '0');
                      const minutes = String(d.getUTCMinutes()).padStart(2, '0');
                      return `${d.getUTCFullYear()}/${d.getUTCMonth() + 1}/${d.getUTCDate()} ${hours}:${minutes}`;
                    })()}
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-transparent border border-[#00c8ff] rounded text-[#00c8ff] py-1.5 px-2.5 text-[0.8rem] cursor-pointer"
                        onClick={() => {
                          setModalDetails(event.details);
                          setModalOpen(true);
                        }}
                      >
                        詳細
                      </button>
                      <button
                        className="bg-transparent border border-[#ff4d4d] rounded text-[#ff4d4d] py-1.5 px-2.5 text-[0.8rem] cursor-pointer"
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
                  className="p-8 text-center text-[#b0c4d8]"
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
          className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center justify-center"
          style={{ zIndex: Z_INDEX.modal }}
          onClick={() => setModalOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setModalOpen(false);
            }
          }}
        >
          <div
            className="bg-[#1E293B] text-white rounded-[10px] p-8 min-w-[320px] max-w-[90vw] shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="event-detail-modal-title" className="mb-4">イベント詳細</h3>
            <div id="event-detail-modal-content" className="mb-6 whitespace-pre-line">
              {modalDetails || '詳細情報がありません'}
            </div>
            <button
              aria-label="モーダルを閉じる"
              onClick={() => setModalOpen(false)}
              className="bg-[#00c8ff] text-white border-none rounded-md py-2 px-6 text-base cursor-pointer"
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
