'use client';

import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
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
    <div className="bg-[#0A1022] rounded-xl p-6 border border-[#1E3A5F] mb-6">
      <h2 className="text-[#00c8ff] text-2xl font-bold mb-5">
        アップロードしたマッチデータ
      </h2>

      {/* 検索バー */}
      <div className="relative mb-5">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="マッチ名またはチーム名で検索"
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

      {/* マッチデータテーブル */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0F1A2E] border-b border-[#1E3A5F]">
              <th className="p-4 text-left text-[#b0c4d8] font-normal">
                マッチ名
              </th>
              <th className="p-4 text-left text-[#b0c4d8] font-normal">
                アップロード日
              </th>
              <th className="p-4 text-center text-[#b0c4d8] font-normal">
                ダウンロード可能日
              </th>
              <th className="p-4 text-center text-[#b0c8ff] font-normal">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredMatches.length > 0 ? (
              filteredMatches.map(match => (
                <tr
                  key={match.id}
                  className="border-b border-[#1E3A5F]"
                >
                  <td className="p-4 text-left text-white">
                    {match.name}
                  </td>
                  <td className="p-4 text-left text-[#b0c4d8]">
                    {match.uploadDate}
                  </td>
                  <td className="p-4 text-center text-[#b0c4d8]">
                    {match.downloadableAt ? match.downloadableAt : '-'}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-transparent border border-[#00c8ff] rounded text-[#00c8ff] py-1.5 px-2.5 text-[0.8rem] cursor-pointer"
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
                        className="bg-transparent border border-[#ff4d4d] rounded text-[#ff4d4d] py-1.5 px-2.5 text-[0.8rem] cursor-pointer"
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
                  className="p-8 text-center text-[#b0c4d8]"
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
          className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[1000]"
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
            <h3 id="match-detail-modal-title" className="mb-4">マッチ詳細</h3>
            <div id="match-detail-modal-content" className="mb-6 whitespace-pre-line">
              {modalComment}
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

export default UploadedMatchesSection;
