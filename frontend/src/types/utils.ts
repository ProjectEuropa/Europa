/**
 * ユーティリティ型定義
 */

// 特定のプロパティをオプショナルにする
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// 特定のプロパティを必須にする
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// オブジェクトの全てのプロパティを再帰的にオプショナルにする
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// オブジェクトの全てのプロパティを再帰的に読み取り専用にする
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// オブジェクトの特定のプロパティを除外する
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// オブジェクトの特定のプロパティのみを選択する
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// オブジェクトのプロパティ名を変更する
export type Rename<T, K extends keyof T, N extends string> = {
  [P in keyof T as P extends K ? N : P]: T[P];
};

// スネークケースからキャメルケースへの変換型
export type SnakeToCamel<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamel<U>>}`
  : S;

// オブジェクトのキーをスネークケースからキャメルケースに変換
export type SnakeToCamelObject<T> = {
  [K in keyof T as K extends string ? SnakeToCamel<K> : K]: T[K] extends object
    ? SnakeToCamelObject<T[K]>
    : T[K];
};

// 日付関連
export type DateString = string; // ISO 8601 format
export type TimeString = string; // HH:mm format

// ID関連
export type ID = string | number;

// 状態関連
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// 環境変数
export interface EnvironmentVariables {
  NEXT_PUBLIC_API_BASE_URL: string;
  NEXT_PUBLIC_BASIC_AUTH_USER?: string;
  NEXT_PUBLIC_BASIC_AUTH_PASSWORD?: string;
}
