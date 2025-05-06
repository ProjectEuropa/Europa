import React from 'react';

export interface TeamData {
  id: number;
  name: string;
  owner: string;
  comment: string;
  filename: string;
  uploadDate: string;
  uploadTime: string;
  downloadDate?: string;
}

interface TeamCardsProps {
  teams: TeamData[];
  onDownload: (team: TeamData) => void;
  onDelete: (team: TeamData) => void;
}

const TeamCards: React.FC<TeamCardsProps> = ({ teams, onDownload, onDelete }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '16px',
      padding: '16px'
    }}>
      {teams.map((team) => (
        <div key={team.id} style={{
          background: '#050A14',
          border: '1px solid #1E3A5F',
          borderRadius: '8px',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ padding: '20px' }}>
            {/* カードヘッダー */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px'
            }}>
              <div style={{ 
                fontWeight: 'bold', 
                color: '#8CB4FF',
                fontSize: '1.1rem'
              }}>
                <div style={{ 
                  fontWeight: 'bold', 
                  color: '#8CB4FF',
                  marginBottom: '4px'
                }}>■中小CPUハンデ戦</div>
                {team.name}
              </div>
              <div style={{ 
                fontSize: '0.9rem', 
                color: '#00c8ff' 
              }}>{team.filename}</div>
            </div>
            
            {/* オーナー情報 */}
            <div style={{ 
              fontSize: '0.9rem', 
              color: 'white',
              marginBottom: '8px'
            }}>
              オーナー名: {team.owner}
            </div>
            
            {/* コメント */}
            <div style={{ 
              fontSize: '0.9rem', 
              color: '#b0c4d8',
              marginBottom: '16px',
              lineHeight: '1.4'
            }}>
              コメント: {team.name === "GrayGhost" ? "中チップアラクネー\n音の機体を小修整" : team.name === "Cパッド" ? "パッドくんです" : "チキンです"}
            </div>
            
            {/* カードフッター */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.8rem',
              color: '#b0c4d8'
            }}>
              {/* 日時情報 */}
              <div>
                <div>アップロード: {team.uploadDate} {team.uploadTime}</div>
                {team.downloadDate && (
                  <div>ダウンロード可能: {team.downloadDate} 10:00〜</div>
                )}
              </div>
              
              {/* アクションボタン */}
              <div style={{
                display: 'flex',
                gap: '8px'
              }}>
                <button 
                  onClick={() => onDownload(team)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#00c8ff',
                    cursor: 'pointer',
                    padding: '5px'
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16L12 8M12 16L8 12M12 16L16 12" stroke="#00c8ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 15V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16V15" stroke="#00c8ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button 
                  onClick={() => onDelete(team)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#00c8ff',
                    cursor: 'pointer',
                    padding: '5px'
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16M10 11V16M14 11V16" stroke="#00c8ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

export default TeamCards;
