// ファイルのデータタイプ定数
export const DATA_TYPE = {
  TEAM: '1',
  MATCH: '2',
} as const;

export type DataType = (typeof DATA_TYPE)[keyof typeof DATA_TYPE];
