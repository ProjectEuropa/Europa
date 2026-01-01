import type React from 'react';

export interface MatchData {
  id: number;
  title: string;
  date: string;
  time: string;
  teams: string[];
  result: string;
  comment: string;
  filename: string;
  uploadDate: string;
  uploadTime: string;
  downloadDate?: string;
}

interface MatchCardsProps {
  matches: MatchData[];
  onDownload: (match: MatchData) => void;
  onDelete: (match: MatchData) => void;
}

const MatchCards: React.FC<MatchCardsProps> = ({
  matches,
  onDownload,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 p-4">
      {matches.map(match => (
        <div
          key={match.id}
          className="bg-[#050A14] border border-[#1E3A5F] rounded-lg overflow-hidden transition-all duration-300"
        >
          <div className="p-5">
            {/* カードヘッダー */}
            <div className="flex justify-between items-start mb-3">
              <div className="font-bold text-[#8CB4FF] text-[1.1rem] whitespace-nowrap break-keep">
                <div className="font-bold text-[#8CB4FF] mb-1 whitespace-nowrap break-keep">
                  ■{match.date}
                </div>
                <span className="whitespace-nowrap break-keep">
                  {match.title}
                </span>
              </div>
              <div className="text-[0.9rem] text-[#00c8ff] whitespace-nowrap break-keep">
                {match.filename}
              </div>
            </div>

            {/* マッチ情報 */}
            <div className="text-[0.9rem] text-white mb-2">
              <div className="mb-1">
                <span className="text-[#b0c4d8]">時間: </span>
                {match.time}
              </div>
              <div className="mb-1">
                <span className="text-[#b0c4d8]">参加チーム: </span>
                {match.teams.join(', ')}
              </div>
              <div className="mb-1">
                <span className="text-[#b0c4d8]">結果: </span>
                {match.result}
              </div>
            </div>

            {/* コメント */}
            <div className="text-[0.9rem] text-[#b0c4d8] mb-3 bg-[rgba(14,22,40,0.5)] p-2 rounded max-h-20 overflow-auto">
              {match.comment.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>

            {/* アップロード情報とアクション */}
            <div className="flex justify-between items-center text-[0.8rem] text-[#6A7A8C]">
              <div>
                アップロード: {match.uploadDate} {match.uploadTime}
              </div>

              {/* アクションボタン */}
              <div className="flex gap-2">
                <button
                  onClick={() => onDownload(match)}
                  className="bg-transparent border-none text-[#00c8ff] cursor-pointer p-[5px]"
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
                <button
                  onClick={() => onDelete(match)}
                  className="bg-transparent border-none text-[#00c8ff] cursor-pointer p-[5px]"
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
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchCards;
