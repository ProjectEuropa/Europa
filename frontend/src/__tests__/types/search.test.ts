import { describe, expect, it } from 'vitest';
import type { BaseFile, MatchFile, TeamFile } from '@/types/file';
import type {
  DateRange,
  FileType,
  MatchSearchResult,
  PaginationMeta,
  SearchFilters,
  SearchParams,
  SearchResult,
  SearchState,
  SortField,
  SortOrder,
  TeamSearchResult,
} from '@/types/search';

describe('Search Types', () => {
  describe('SearchParams', () => {
    it('should accept valid search parameters', () => {
      const searchParams: SearchParams = {
        keyword: 'test',
        page: 1,
        perPage: 10,
        sortBy: 'name',
        sortOrder: 'asc',
        filters: {
          tags: ['tag1', 'tag2'],
          owner: 'testuser',
          fileType: 'team',
        },
      };

      expect(searchParams.keyword).toBe('test');
      expect(searchParams.page).toBe(1);
      expect(searchParams.perPage).toBe(10);
      expect(searchParams.sortBy).toBe('name');
      expect(searchParams.sortOrder).toBe('asc');
    });

    it('should work with minimal parameters', () => {
      const searchParams: SearchParams = {
        keyword: 'minimal',
      };

      expect(searchParams.keyword).toBe('minimal');
      expect(searchParams.page).toBeUndefined();
      expect(searchParams.perPage).toBeUndefined();
    });
  });

  describe('SearchFilters', () => {
    it('should accept all filter options', () => {
      const filters: SearchFilters = {
        tags: ['javascript', 'react'],
        dateRange: {
          start: '2024-01-01',
          end: '2024-12-31',
        },
        owner: 'john_doe',
        fileType: 'match',
      };

      expect(filters.tags).toEqual(['javascript', 'react']);
      expect(filters.dateRange?.start).toBe('2024-01-01');
      expect(filters.dateRange?.end).toBe('2024-12-31');
      expect(filters.owner).toBe('john_doe');
      expect(filters.fileType).toBe('match');
    });

    it('should work with empty filters', () => {
      const filters: SearchFilters = {};

      expect(filters.tags).toBeUndefined();
      expect(filters.dateRange).toBeUndefined();
      expect(filters.owner).toBeUndefined();
      expect(filters.fileType).toBeUndefined();
    });
  });

  describe('DateRange', () => {
    it('should define start and end dates', () => {
      const dateRange: DateRange = {
        start: '2024-01-01',
        end: '2024-01-31',
      };

      expect(dateRange.start).toBe('2024-01-01');
      expect(dateRange.end).toBe('2024-01-31');
    });
  });

  describe('Type Unions', () => {
    it('should accept valid SortField values', () => {
      const sortFields: SortField[] = [
        'name',
        'created_at',
        'downloadableAt',
        'ownerName',
      ];

      sortFields.forEach(field => {
        const sortBy: SortField = field;
        expect(['name', 'created_at', 'downloadableAt', 'ownerName']).toContain(
          sortBy
        );
      });
    });

    it('should accept valid SortOrder values', () => {
      const sortOrders: SortOrder[] = ['asc', 'desc'];

      sortOrders.forEach(order => {
        const sortOrder: SortOrder = order;
        expect(['asc', 'desc']).toContain(sortOrder);
      });
    });

    it('should accept valid FileType values', () => {
      const fileTypes: FileType[] = ['team', 'match', 'all'];

      fileTypes.forEach(type => {
        const fileType: FileType = type;
        expect(['team', 'match', 'all']).toContain(fileType);
      });
    });
  });

  describe('SearchResult', () => {
    it('should structure search results correctly', () => {
      const mockFiles: BaseFile[] = [
        {
          id: 1,
          name: 'test-file.txt',
          ownerName: 'testuser',
          comment: 'Test comment',
          downloadableAt: '2024-01-01T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          searchTag1: 'tag1',
          searchTag2: 'tag2',
          searchTag3: null,
          searchTag4: null,
        },
      ];

      const paginationMeta: PaginationMeta = {
        currentPage: 1,
        lastPage: 5,
        perPage: 10,
        total: 50,
      };

      const searchResult: SearchResult<BaseFile> = {
        data: mockFiles,
        meta: paginationMeta,
      };

      expect(searchResult.data).toHaveLength(1);
      expect(searchResult.data[0].name).toBe('test-file.txt');
      expect(searchResult.meta.currentPage).toBe(1);
      expect(searchResult.meta.total).toBe(50);
    });
  });

  describe('PaginationMeta', () => {
    it('should contain pagination information', () => {
      const meta: PaginationMeta = {
        currentPage: 2,
        lastPage: 10,
        perPage: 20,
        total: 200,
      };

      expect(meta.currentPage).toBe(2);
      expect(meta.lastPage).toBe(10);
      expect(meta.perPage).toBe(20);
      expect(meta.total).toBe(200);
    });
  });

  describe('Specialized Search Results', () => {
    it('should work with TeamSearchResult', () => {
      const teamFile: TeamFile = {
        id: 1,
        name: 'team-file.txt',
        ownerName: 'teamowner',
        comment: 'Team file comment',
        downloadableAt: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        searchTag1: 'team',
        searchTag2: null,
        searchTag3: null,
        searchTag4: null,
        type: 'team',
      };

      const teamSearchResult: TeamSearchResult = {
        data: [teamFile],
        meta: {
          currentPage: 1,
          lastPage: 1,
          perPage: 10,
          total: 1,
        },
      };

      expect(teamSearchResult.data[0].type).toBe('team');
    });

    it('should work with MatchSearchResult', () => {
      const matchFile: MatchFile = {
        id: 1,
        name: 'match-file.txt',
        ownerName: 'matchowner',
        comment: 'Match file comment',
        downloadableAt: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        searchTag1: 'match',
        searchTag2: null,
        searchTag3: null,
        searchTag4: null,
        type: 'match',
      };

      const matchSearchResult: MatchSearchResult = {
        data: [matchFile],
        meta: {
          currentPage: 1,
          lastPage: 1,
          perPage: 10,
          total: 1,
        },
      };

      expect(matchSearchResult.data[0].type).toBe('match');
    });
  });

  describe('SearchState', () => {
    it('should represent search component state', () => {
      const searchState: SearchState = {
        query: 'test query',
        filters: {
          tags: ['react'],
          fileType: 'team',
        },
        results: [],
        loading: false,
        error: null,
      };

      expect(searchState.query).toBe('test query');
      expect(searchState.filters.fileType).toBe('team');
      expect(searchState.loading).toBe(false);
      expect(searchState.error).toBeNull();
    });

    it('should handle error state', () => {
      const errorState: SearchState = {
        query: 'failed query',
        filters: {},
        results: [],
        loading: false,
        error: 'Search failed',
      };

      expect(errorState.error).toBe('Search failed');
      expect(errorState.results).toHaveLength(0);
    });

    it('should handle loading state', () => {
      const loadingState: SearchState = {
        query: 'loading query',
        filters: {},
        results: [],
        loading: true,
        error: null,
      };

      expect(loadingState.loading).toBe(true);
      expect(loadingState.error).toBeNull();
    });
  });
});
