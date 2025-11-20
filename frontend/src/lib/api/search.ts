import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types/api';

export interface SearchResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
}

/**
 * チーム検索API
 */
export const searchTeams = async (keyword: string, page: number = 1) => {
    const response = await apiClient.get<SearchResponse<any>>(
        `/api/v1/search/team?keyword=${encodeURIComponent(keyword)}&page=${page}`
    );
    return response;
};

/**
 * マッチ検索API
 */
export const searchMatch = async (keyword: string, page: number = 1) => {
    const response = await apiClient.get<SearchResponse<any>>(
        `/api/v1/search/match?keyword=${encodeURIComponent(keyword)}&page=${page}`
    );
    return response;
};
