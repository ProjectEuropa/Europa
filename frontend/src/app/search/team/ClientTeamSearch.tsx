"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { searchTeams } from '@/utils/api';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import TeamCards, { TeamData } from '../../../components/search/TeamCards';

export default function ClientTeamSearch() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSearchQuery(searchParams.get('keyword') || '');
    setCurrentPage(1); // クエリ変更時は1ページ目に戻す
  }, [searchParams]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCardView, setIsCardView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const kw = searchParams.get('keyword') || '';
    setSearchQuery(kw);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    searchTeams(searchQuery, currentPage)
      .then(result => {
        setTeams(result.data ?? []);
        setCurrentPage(result.current_page ?? 1);
        setTotalPages(result.last_page ?? 1);
      })
      .catch(() => {
        setTeams([]);
        setError('検索失敗');
      })
      .finally(() => setLoading(false));
  }, [searchQuery, currentPage]);

  const handleDownload = (team: TeamData) => {
    console.log(`Downloading team: ${team.file_name}`);
    // 実際のダウンロード処理をここに実装
  };

  const handleDelete = (team: TeamData) => {
    console.log(`Deleting team: ${team.file_name}`);
    // 実際の削除処理をここに実装
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      background: "rgb(var(--background-rgb))"
    }}>
      <Header />

      <div style={{
        flex: "1",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px"
      }}>
        <div style={{
          textAlign: "center",
          marginBottom: "40px"
        }}>
          <h1 style={{
            color: "#8CB4FF",
            fontWeight: "bold",
            fontSize: "2.5rem",
            marginBottom: "16px"
          }}>
            Search Team
          </h1>
          <p style={{
            color: "#b0c4d8",
            fontSize: "1.1rem",
            marginBottom: "40px"
          }}>
            チームデータの検索が可能です
          </p>
        </div>

        <div style={{
          width: "100%",
          maxWidth: "800px",
          position: "relative"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            background: "#111A2E",
            borderRadius: "9999px",
            border: "1px solid #1E3A5F",
            overflow: "hidden",
            position: "relative"
          }}>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="チーム名"
              style={{
                width: "100%",
                padding: "14px 24px",
                background: "transparent",
                color: "#fff",
                border: "none",
                outline: "none",
                fontSize: "1.1rem"
              }}
            />
          </div>
        </div>

        {loading && <div style={{ color: '#00c8ff', marginTop: 8 }}>検索中...</div>}
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}

        {/* テーブル表示 */}
        {!isCardView && (
          <div style={{
            width: "100%",
            maxWidth: "1000px",
            minWidth: 900,
            overflowX: "auto",
            marginTop: "50px"
          }}>
            {/* テーブルヘッダー */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "100px 120px 1fr 180px 150px 180px 60px",
              minWidth: 900,
              background: "#0A1022",
              padding: "12px 20px",
              borderBottom: "1px solid #1E3A5F",
              color: "#b0c4d8",
              fontSize: "0.9rem"
            }}>
              <div>ダウンロード</div>
              <div>オーナー名</div>
              <div>コメント・タグ</div>
              <div>ファイル名</div>
              <div>アップロード日時</div>
              <div>ダウンロード可能日時</div>
              <div style={{ textAlign: "center" }}>削除</div>
            </div>

            {/* チームデータ行 */}
            {teams.map(team => (
              <div key={team.id} style={{
                display: "grid",
                gridTemplateColumns: "100px 120px 1fr 180px 150px 180px 60px",
                minWidth: 900,
                padding: "16px 20px",
                borderBottom: "1px solid #1E3A5F",
                background: "#050A14",
                alignItems: "center"
              }}>
                {/* ダウンロードボタン */}
                <div>
                  <button
                    onClick={() => handleDownload(team)}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 16L12 8M12 16L8 12M12 16L16 12" stroke="#00c8ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 15V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16V15" stroke="#00c8ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                {/* オーナー名 */}
                <div style={{ color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{team.upload_owner_name}</div>

                {/* コメント・タグ */}
                <div style={{ color: "#b0c4d8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {team.file_comment}
                  <div style={{ marginTop: 4 }}>
                    {[team.search_tag1, team.search_tag2, team.search_tag3, team.search_tag4].filter(Boolean).map((tag, i) => (
                      <span key={i} style={{ background: '#1E3A5F', color: '#8CB4FF', borderRadius: '4px', padding: '2px 6px', marginRight: 4, fontSize: '0.8em', whiteSpace: 'nowrap' }}>{tag}</span>
                    ))}
                  </div>
                </div>

                {/* ファイル名 */}
                <div style={{ color: "#00c8ff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{team.file_name}</div>

                {/* アップロード日時 */}
                <div style={{ color: "white", whiteSpace: "nowrap" }}>
                  {team.created_at}
                </div>

                {/* ダウンロード可能日時 */}
                <div style={{ color: "white", whiteSpace: "nowrap" }}>
                  {team.downloadable_at}
                </div>

                {/* 削除ボタン */}
                <div style={{ textAlign: "center" }}>
                  <button
                    onClick={() => handleDelete(team)}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16M10 11V16M14 11V16" stroke="#00c8ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* ページネーション */}
        {!isCardView && (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: 24
          }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              style={{
                background: currentPage <= 1 ? '#1E3A5F' : '#3B82F6',
                color: '#8CB4FF',
                border: 'none',
                borderRadius: '4px 0 0 4px',
                padding: '8px 16px',
                marginRight: 4,
                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage <= 1 ? 0.5 : 1
              }}>
              前へ
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  background: currentPage === i + 1 ? '#00c8ff' : '#111A2E',
                  color: currentPage === i + 1 ? '#111A2E' : '#8CB4FF',
                  border: 'none',
                  borderRadius: 0,
                  padding: '8px 16px',
                  marginRight: 2,
                  fontWeight: currentPage === i + 1 ? 'bold' : 'normal',
                  cursor: 'pointer'
                }}>
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              style={{
                background: currentPage >= totalPages ? '#1E3A5F' : '#3B82F6',
                color: '#8CB4FF',
                border: 'none',
                borderRadius: '0 4px 4px 0',
                padding: '8px 16px',
                marginLeft: 4,
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage >= totalPages ? 0.5 : 1
              }}>
              次へ
            </button>
          </div>
        )}
        {/* カード表示 */}
        {isCardView && (
          <div style={{
            background: "#050A14",
            borderBottom: "1px solid #1E3A5F"
          }}>
            <TeamCards
              teams={teams}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
