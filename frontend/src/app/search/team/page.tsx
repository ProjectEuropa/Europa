'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import TeamCards, { TeamData } from '@/components/search/TeamCards';
import { searchTeams } from '@/utils/api';
import ClientTeamSearch from './ClientTeamSearch';

export default function TeamSearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientTeamSearch />
    </Suspense>
  );
}
//
//   useEffect(() => {
//     const kw = searchParams.get('keyword') || '';
//     setSearchQuery(kw);
//   }, [searchParams]);
//
//   useEffect(() => {
//     setLoading(true);
//     setError(null);
//     searchTeams(searchQuery)
//       .then(result => setTeams(result.data ?? []))
//       .catch(() => {
//         setTeams([]);
//         setError('検索失敗');
//       })
//       .finally(() => setLoading(false));
//   }, [searchQuery]);
//
//   const handleDownload = (team: TeamData) => {
//     console.log(`Downloading team: ${team.name}`);
//     // 実際のダウンロード処理をここに実装
//   };
//
//   const handleDelete = (team: TeamData) => {
//     console.log(`Deleting team: ${team.name}`);
//     // 実際の削除処理をここに実装
//   };
//
//   return (
//     <div style={{
//       display: "flex",
//       flexDirection: "column",
//       minHeight: "100vh",
//       background: "rgb(var(--background-rgb))"
//     }}>
//       <Header />
//
//       <div style={{
//         flex: "1",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         padding: "40px 20px"
//       }}>
//         <div style={{
//           textAlign: "center",
//           marginBottom: "40px"
//         }}>
//           <h1 style={{
//             color: "#8CB4FF",
//             fontWeight: "bold",
//             fontSize: "2.5rem",
//             marginBottom: "16px"
//           }}>
//             Search Team
//           </h1>
//           <p style={{
//             color: "#b0c4d8",
//             fontSize: "1.1rem",
//             marginBottom: "40px"
//           }}>
//             チームデータの検索が可能です
//           </p>
//         </div>
//
//         <div style={{
//           width: "100%",
//           maxWidth: "800px",
//           position: "relative"
//         }}>
//           <div style={{
//             display: "flex",
//             alignItems: "center",
//             background: "#111A2E",
//             borderRadius: "9999px",
//             border: "1px solid #1E3A5F",
//             overflow: "hidden",
//             position: "relative"
//           }}>
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={e => setSearchQuery(e.target.value)}
//               placeholder="チーム名"
//               style={{
//                 width: "100%",
//                 padding: "14px 24px",
//                 background: "transparent",
//                 border: "none",
//                 outline: "none",
//                 color: "#4A6FA5",
//                 fontSize: "1.1rem"
//               }}
//             />
//             <div style={{
//               position: "absolute",
//               right: "4px",
//               top: "50%",
//               transform: "translateY(-50%)"
//             }}>
//               <button style={{
//                 background: "#3B82F6",
//                 borderRadius: "9999px",
//                 padding: "12px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 border: "none",
//                 cursor: "pointer"
//               }}>
//                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//
//         {/* チームファイル一覧セクション */}
//         <div style={{
//           width: "100%",
//           maxWidth: "1000px",
//           marginTop: "50px"
//         }}>
//           {/* ヘッダー部分 */}
//           <div style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             padding: "16px 20px",
//             background: "#0A1022",
//             borderRadius: "8px 8px 0 0",
//             borderBottom: "1px solid #1E3A5F"
//           }}>
//             <h2 style={{
//               color: "#00c8ff",
//               fontSize: "1.2rem",
//               fontWeight: "bold"
//             }}>
//               Team Files
//             </h2>
//             <div style={{
//               color: "#00c8ff",
//               fontSize: "0.9rem",
//               cursor: "pointer"
//             }}>
//               Sort by: 新着順 ▼
//             </div>
//           </div>
//
//           {/* テーブル表示 */}
//           {!isCardView && (
//             <>
//               {/* テーブルヘッダー */}
//               <div style={{
//                 display: "grid",
//                 gridTemplateColumns: "100px 100px 1fr 180px 150px 150px 60px",
//                 background: "#0A1022",
//                 padding: "12px 20px",
//                 borderBottom: "1px solid #1E3A5F",
//                 color: "#b0c4d8",
//                 fontSize: "0.9rem"
//               }}>
//                 <div>ダウンロード</div>
//                 <div>オーナー名</div>
//                 <div>コメント</div>
//                 <div>ファイル名</div>
//                 <div>アップロード日時</div>
//                 <div>ダウンロード可能日時</div>
//                 <div style={{ textAlign: "center" }}>削除</div>
//               </div>
//
//               {/* チームデータ行 */}
//               {teams.map(team => (
//                 <div key={team.id} style={{
//                   display: "grid",
//                   gridTemplateColumns: "100px 100px 1fr 180px 150px 150px 60px",
//                   padding: "16px 20px",
//                   borderBottom: "1px solid #1E3A5F",
//                   background: "#050A14"
//                 }}>
//                   {/* ダウンロードボタン */}
//                   <div>
//                     <button
//                       onClick={() => handleDownload(team)}
//                       style={{
//                         background: "transparent",
//                         border: "none",
//                         cursor: "pointer"
//                       }}
//                     >
//                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M12 16L12 8M12 16L8 12M12 16L16 12" stroke="#00c8ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                         <path d="M3 15V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16V15" stroke="#00c8ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                       </svg>
//                     </button>
//                   </div>
//
//                   {/* アップロード者名 */}
//                   <div style={{ color: "white" }}>{team.upload_owner_name}</div>
//
//                   {/* ファイルコメント */}
//                   <div style={{ color: "#b0c4d8" }}>
//                     {team.file_comment}
//                   </div>
//
//                   {/* ファイル名 */}
//                   <div style={{ color: "#00c8ff" }}>{team.file_name}</div>
//
//                   {/* アップロード日時 */}
//                   <div style={{ color: "white" }}>
//                     {team.created_at}
//                   </div>
//
//                   {/* ダウンロード可能日時 */}
//                   <div style={{ color: "white" }}>
//                     {team.downloadable_at}
//                   </div>
//
//                   {/* 削除ボタン */}
//                   <div style={{ textAlign: "center" }}>
//                     <button
//                       onClick={() => handleDelete(team)}
//                       style={{
//                         background: "transparent",
//                         border: "none",
//                         cursor: "pointer"
//                       }}
//                     >
//                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16M10 11V16M14 11V16" stroke="#00c8ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                       </svg>
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </>
//           )}
//
//           {/* カード表示 */}
//           {isCardView && (
//             <div style={{
//               background: "#050A14",
//               borderBottom: "1px solid #1E3A5F"
//             }}>
//               <TeamCards
//                 teams={teams}
//                 onDownload={handleDownload}
//                 onDelete={handleDelete}
//               />
//             </div>
//           )}
//
//           {/* ページネーション */}
//           <div style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             padding: "12px 20px",
//             background: "#0A1022",
//             borderRadius: isCardView ? "0" : "0 0 8px 8px",
//             borderTop: "1px solid #1E3A5F"
//           }}>
//             <div style={{ display: "flex", alignItems: "center" }}>
//               <span style={{ color: "#b0c4d8", marginRight: "10px" }}>表示:</span>
//               <select style={{
//                 background: "#111A2E",
//                 border: "1px solid #1E3A5F",
//                 color: "white",
//                 padding: "4px 8px",
//                 borderRadius: "4px"
//               }}>
//                 <option>10</option>
//                 <option>20</option>
//                 <option>50</option>
//               </select>
//             </div>
//
//             <div style={{ display: "flex", alignItems: "center" }}>
//               <span style={{ color: "#b0c4d8", marginRight: "10px" }}>ページ:</span>
//               <div style={{ display: "flex" }}>
//                 <button style={{
//                   background: "#111A2E",
//                   border: "1px solid #1E3A5F",
//                   color: "#00c8ff",
//                   padding: "4px 12px",
//                   borderRadius: "4px 0 0 4px"
//                 }}>
//                   前へ
//                 </button>
//                 <button style={{
//                   background: "#00c8ff",
//                   border: "1px solid #00c8ff",
//                   color: "#111A2E",
//                   padding: "4px 12px",
//                   fontWeight: "bold"
//                 }}>
//                   1
//                 </button>
//                 <button style={{
//                   background: "#111A2E",
//                   border: "1px solid #1E3A5F",
//                   color: "#00c8ff",
//                   padding: "4px 12px"
//                 }}>
//                   2
//                 </button>
//                 <button style={{
//                   background: "#111A2E",
//                   border: "1px solid #1E3A5F",
//                   color: "#00c8ff",
//                   padding: "4px 12px"
//                 }}>
//                   3
//                 </button>
//                 <button style={{
//                   background: "#111A2E",
//                   border: "1px solid #1E3A5F",
//                   color: "#00c8ff",
//                   padding: "4px 12px",
//                   borderRadius: "0 4px 4px 0"
//                 }}>
//                   次へ
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//
//         {/* 表示形式切り替え */}
//         <div style={{
//           width: "100%",
//           maxWidth: "1000px",
//           marginTop: "30px",
//           background: "#0A1022",
//           borderRadius: "8px",
//           padding: "16px 20px"
//         }}>
//           <div style={{
//             display: "flex",
//             alignItems: "center",
//             color: "#00c8ff",
//             fontSize: "1.1rem",
//             fontWeight: "bold",
//             marginBottom: "10px"
//           }}>
//             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "10px" }}>
//               <path d="M4 6H20M4 12H20M4 18H20" stroke="#00c8ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//             表示形式を切り替える
//           </div>
//           <p style={{ color: "#b0c4d8", fontSize: "0.9rem" }}>
//             スマートフォンでの表示に最適化されたカード表示も利用できます。
//           </p>
//           <div style={{
//             display: "flex",
//             alignItems: "center",
//             marginTop: "16px"
//           }}>
//             <span style={{ color: "#b0c4d8", marginRight: "10px" }}>テーブル表示</span>
//             <div
//               style={{
//                 width: "40px",
//                 height: "20px",
//                 background: "#00c8ff",
//                 borderRadius: "10px",
//                 position: "relative",
//                 margin: "0 10px",
//                 cursor: "pointer"
//               }}
//               onClick={() => setIsCardView(!isCardView)}
//             >
//               <div style={{
//                 width: "16px",
//                 height: "16px",
//                 background: "white",
//                 borderRadius: "50%",
//                 position: "absolute",
//                 top: "2px",
//                 left: isCardView ? "20px" : "4px",
//                 transition: "left 0.3s ease"
//               }}></div>
//             </div>
//             <span style={{ color: "#b0c4d8" }}>カード表示</span>
//           </div>
//         </div>
//       </div>
//
//       <Footer />
//     </div>
//   );
// }
