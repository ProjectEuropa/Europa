import React from 'react';

export interface TeamData {
  id: number;
  name: string;
  owner: string;
  comment: string;
  file_name: string;
  uploadDate: string;
  uploadTime: string;
}

interface TeamTableProps {
  teams: TeamData[];
  onDownload: (team: TeamData) => void;
  onDelete: (team: TeamData) => void;
}

const TeamTable: React.FC<TeamTableProps> = ({ teams, onDownload, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-blue-900/20">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-blue-300 uppercase tracking-wider w-16 whitespace-nowrap break-keep">
              ダウンロード
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-blue-300 uppercase tracking-wider w-24">
              オーナー名
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-blue-300 uppercase tracking-wider whitespace-nowrap break-keep">
              コメント
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-blue-300 uppercase tracking-wider w-32 whitespace-nowrap break-keep">
              ファイル名
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-blue-300 uppercase tracking-wider w-40">
              アップロード日時
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-blue-300 uppercase tracking-wider w-16">
              削除
            </th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <tr key={team.id} className={`${index % 2 === 0 ? 'bg-black/70' : 'bg-black/80'} border-b border-blue-900/20 hover:bg-blue-900/10 transition-colors duration-150`}>
              <td className="px-6 py-5 whitespace-nowrap break-keep">
                <button 
                  onClick={() => onDownload(team)}
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-200 transform hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="text-sm font-medium text-white">{team.owner}</div>
              </td>
              <td className="px-6 py-5">
                {team.comment.split('\n').map((line, i) => (
                  <div key={i} className={i === 0 ? "text-base font-medium text-blue-300 mb-1" : "text-sm text-blue-100"}>
                    {line}
                  </div>
                ))}
              </td>
              <td className="px-6 py-5 whitespace-nowrap break-keep">
                <div className="text-base text-blue-400 hover:text-blue-300 transition-colors duration-200 break-keep whitespace-nowrap">{team.file_name}</div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="text-sm text-white">{team.uploadDate}</div>
                <div className="text-sm text-blue-200">{team.uploadTime}</div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  onClick={() => onDelete(team)}
                  className="text-blue-400 hover:text-red-400 transition-colors duration-200 transform hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamTable;
