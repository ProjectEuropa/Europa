import { TeamData } from './TeamTable';

// チームデータのモック
export const MOCK_TEAMS: TeamData[] = [
  {
    id: 1,
    name: "Cパッド",
    owner: "M2",
    comment: "■中小CPUハンデ戦\nオーナー名：M2\nチーム名：Cパッド\nコメント：パッドくんです",
    filename: "CB.CHE",
    uploadDate: "2025-04-21",
    uploadTime: "23:45"
  },
  {
    id: 2,
    name: "Cチキン",
    owner: "M2",
    comment: "■中小CPUハンデ戦\nオーナー名：M2\nチーム名：Cチキン\nコメント：チキンです",
    filename: "CC.CHE",
    uploadDate: "2025-04-21",
    uploadTime: "23:44"
  },
  {
    id: 3,
    name: "GrayGhost",
    owner: "UNANA",
    comment: "■中小CPUハンデ戦\nオーナー名：UNANA\nチーム名：GrayGhost\nコメント：中チップアラクネー\n音の機体を小修整",
    filename: "GRGTM112.CHE",
    uploadDate: "2025-04-21",
    uploadTime: "23:17"
  },
  {
    id: 4,
    name: "サイバーファルコン",
    owner: "Masato",
    comment: "■高速攻撃型\nオーナー名：Masato\nチーム名：サイバーファルコン\nコメント：素早い展開と強力な火力が特徴",
    filename: "FALCON.CHE",
    uploadDate: "2025-04-20",
    uploadTime: "18:30"
  },
  {
    id: 5,
    name: "ディフェンダーX",
    owner: "Yuki",
    comment: "■防御型\nオーナー名：Yuki\nチーム名：ディフェンダーX\nコメント：堅固な防御を誇るOKE。耐久力と反撃能力に優れている",
    filename: "DEFX.CHE",
    uploadDate: "2025-04-19",
    uploadTime: "14:22"
  }
];

// クイックフィルターのキーワード
export const QUICK_FILTERS = [
  "大会ゲスト許可",
  "フリーOKE",
  "アラクネー"
];
