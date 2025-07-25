/**
 * 検索関連の型定義
 */

import type { BaseFile, TeamFile, MatchFile } from './file';

import type { DateString } from './utils';

export interface SearchParams {
  keyword: string;
  page?: number;
  perPage?: number;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  filters?: SearchFilters;
}

export interface SearchFilters {
  tags?: string[];
  dateRange?: DateRange;
  owner?: string;
  fileType?: FileType;
}

export interface DateRange {
  start: DateString;
  end: DateString;
}

export type SortField = 'name' | 'createdAt' | 'downloadableAt' | 'ownerName';
export type SortOrder = 'asc' | 'desc';
export type FileType = 'team' | 'match' | 'all';

export interface SearchResult<T = BaseFile> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

export interface TeamSearchResult extends SearchResult<TeamFile> {}

export interface MatchSearchResult extends SearchResult<MatchFile> {}

export interface SearchState {
  query: string;
  filters: SearchFilters;
  results: BaseFile[];
  loading: boolean;
  error: string | null;
}
