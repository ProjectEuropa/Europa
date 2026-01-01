'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import Calendar from '@/components/Calendar';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useBreakpoint } from '@/components/layout/responsive';
import type { Event } from '@/types/event';
import { fetchEvents } from '@/utils/api';

const InformationPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    fetchEvents()
      .then(events => setEvents(events)) // 配列を直接使用
      .catch(() => alert('イベント情報の取得に失敗しました'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0818] text-white selection:bg-cyan-500/30">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 md:py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-cyan-400 font-extrabold text-xs md:text-sm tracking-[2px] md:tracking-[3px] uppercase animate-pulse shadow-cyan-500/50 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] mb-2 md:mb-4">
              INFORMATION
            </h2>
            <h1 className="text-white font-black text-3xl md:text-6xl tracking-tight cyber-title drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] mb-4 md:mb-6">
              お知らせ
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-lg px-4">
              大会スケジュールやメンテナンス情報など、重要なお知らせを確認できます。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            {/* カレンダー */}
            <div className="lg:col-span-2">
              <div className="bg-[#0d1124]/80 backdrop-blur-md border border-cyan-500/20 rounded-xl md:rounded-2xl p-4 md:p-8 shadow-[0_0_30px_-5px_rgba(0,0,0,0.3)]">
                <h2 className="text-lg md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                  <span className="w-1 h-6 md:h-8 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
                  イベントカレンダー
                </h2>
                <div className="w-full overflow-x-auto">
                  <Calendar
                    initialDate={new Date()}
                    size={isMobile ? 'small' : 'large'}
                    events={events.map(ev => {
                      // APIからのUTC日付文字列から、登録時に意図した"日付"を抽出
                      // 例: "2026-01-08T23:59:59.000Z" は「1月8日」として登録された
                      const d = new Date(ev.deadline);
                      // UTC日付部分をそのまま使用（ユーザーが登録した日付）
                      const year = d.getUTCFullYear();
                      const month = d.getUTCMonth();
                      const date = d.getUTCDate();
                      // ローカルタイムゾーンで同じ日付を表す新しいDateオブジェクトを作成
                      const localDate = new Date(year, month, date, 12, 0, 0);
                      return {
                        date: localDate.toISOString(),
                        title: ev.name,
                        details: ev.details,
                        url: ev.url,
                      };
                    })}
                  />
                </div>
              </div>
            </div>

            {/* 予定リスト（API連携） */}
            <div className="lg:col-span-1">
              <div className="bg-[#0d1124]/80 backdrop-blur-md border border-cyan-500/20 rounded-xl md:rounded-2xl p-4 md:p-8 shadow-[0_0_30px_-5px_rgba(0,0,0,0.3)]">
                <h2 className="text-base md:text-xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                  <span className="w-1 h-5 md:h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
                  今後の予定
                </h2>

                {loading ? (
                  <div className="flex items-center justify-center py-12 text-slate-400 animate-pulse">
                    Loading...
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
                    予定はありません
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 md:gap-4 max-h-[400px] md:max-h-[600px] overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
                    {events.map(ev => (
                      <div
                        key={ev.id}
                        className="group bg-slate-900/50 border border-slate-800 rounded-lg md:rounded-xl p-3 md:p-4 hover:border-cyan-500/40 hover:bg-cyan-900/10 transition-all duration-300"
                      >
                        <div className="flex items-center gap-2 md:gap-3 mb-2">
                          <div className="flex items-center gap-1 md:gap-2 text-cyan-400 font-bold text-xs md:text-sm bg-cyan-950/30 px-2 md:px-3 py-1 rounded border border-cyan-900/50 font-mono shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                            <span className="text-cyan-600 text-[10px] md:text-xs">締切</span>
                            <span className="text-cyan-300">
                              {ev.deadline
                                ? (() => {
                                  const d = new Date(ev.deadline);
                                  // UTC日付を使用（登録時の意図した日付）
                                  return `${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2, '0')}.${String(d.getUTCDate()).padStart(2, '0')}`;
                                })()
                                : ''}
                            </span>
                            <span className="text-cyan-700">|</span>
                            <span className="text-cyan-500">
                              {ev.deadline
                                ? (() => {
                                  const d = new Date(ev.deadline);
                                  // UTC時間を使用（登録時の意図した時間）
                                  const hours = String(d.getUTCHours()).padStart(2, '0');
                                  const minutes = String(d.getUTCMinutes()).padStart(2, '0');
                                  return `${hours}:${minutes}`;
                                })()
                                : ''}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-white font-bold mb-2 group-hover:text-cyan-300 transition-colors">
                          {ev.name}
                        </h3>

                        <p className="text-sm text-slate-400 mb-3 line-clamp-3">
                          {ev.details}
                        </p>

                        {ev.url && (
                          <a
                            href={ev.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs text-blue-400 hover:text-blue-300 hover:underline gap-1 transition-colors"
                          >
                            詳細リンク
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Force recompile: Refactored functionality
export default InformationPage;
