import { describe, it, expect } from 'vitest';
import { buildFileQueryWhere, type FileQueryFilters } from './query-builder';

describe('buildFileQueryWhere', () => {
  describe('基本的な条件', () => {
    it('フィルター条件がない場合は空のWHERE句を返す', () => {
      const filters: FileQueryFilters = {};
      const result = buildFileQueryWhere(filters);

      expect(result.whereClause).toBe('');
      expect(result.whereParams).toEqual([]);
    });

    it('data_typeのみ指定した場合', () => {
      const filters: FileQueryFilters = { data_type: '1' };
      const result = buildFileQueryWhere(filters);

      expect(result.whereClause).toBe('WHERE data_type = $1');
      expect(result.whereParams).toEqual(['1']);
    });

    it('targetUserIdのみ指定した場合', () => {
      const filters: FileQueryFilters = { targetUserId: 123 };
      const result = buildFileQueryWhere(filters);

      expect(result.whereClause).toBe('WHERE upload_user_id = $1');
      expect(result.whereParams).toEqual([123]);
    });

    it('tagFilteredFileIdsのみ指定した場合', () => {
      const filters: FileQueryFilters = { tagFilteredFileIds: [1, 2, 3] };
      const result = buildFileQueryWhere(filters);

      expect(result.whereClause).toBe('WHERE id = ANY($1)');
      expect(result.whereParams).toEqual([[1, 2, 3]]);
    });
  });

  describe('キーワード検索', () => {
    it('keywordのみ指定した場合、3つのパラメータとして正しく展開され、downloadable_at条件も追加される', () => {
      const filters: FileQueryFilters = { keyword: 'test' };
      const result = buildFileQueryWhere(filters);

      expect(result.whereClause).toBe(
        "WHERE (file_name ILIKE '%' || $1 || '%' ESCAPE '\\' OR file_comment ILIKE '%' || $2 || '%' ESCAPE '\\' OR upload_owner_name ILIKE '%' || $3 || '%' ESCAPE '\\') AND (downloadable_at IS NULL OR downloadable_at <= NOW() AT TIME ZONE 'Asia/Tokyo')"
      );
      expect(result.whereParams).toEqual(['test', 'test', 'test']);
      expect(result.whereParams.length).toBe(3);
    });

    it('keywordに特殊文字が含まれる場合もそのまま渡される', () => {
      const filters: FileQueryFilters = { keyword: "test'OR'1'='1" };
      const result = buildFileQueryWhere(filters);

      expect(result.whereParams).toEqual([
        "test'OR'1'='1",
        "test'OR'1'='1",
        "test'OR'1'='1",
      ]);
    });

    it('keywordにSQLワイルドカード文字が含まれる場合はエスケープされる', () => {
      const filters: FileQueryFilters = { keyword: '%_test%' };
      const result = buildFileQueryWhere(filters);

      // %, _ はエスケープされる
      expect(result.whereParams).toEqual(['\\%\\_test\\%', '\\%\\_test\\%', '\\%\\_test\\%']);
    });

    it('keywordが空文字列の場合は条件に含まれない', () => {
      const filters: FileQueryFilters = { keyword: '' };
      const result = buildFileQueryWhere(filters);

      expect(result.whereClause).toBe('');
      expect(result.whereParams).toEqual([]);
    });
  });

  describe('複数条件の組み合わせ', () => {
    it('data_typeとtargetUserIdを組み合わせた場合', () => {
      const filters: FileQueryFilters = {
        data_type: '2',
        targetUserId: 456,
      };
      const result = buildFileQueryWhere(filters);

      expect(result.whereClause).toBe('WHERE data_type = $1 AND upload_user_id = $2');
      expect(result.whereParams).toEqual(['2', 456]);
    });

    it('data_typeとkeywordを組み合わせた場合、パラメータインデックスが正しい', () => {
      const filters: FileQueryFilters = {
        data_type: '1',
        keyword: 'search',
      };
      const result = buildFileQueryWhere(filters);

      expect(result.whereClause).toBe(
        "WHERE data_type = $1 AND (file_name ILIKE '%' || $2 || '%' ESCAPE '\\' OR file_comment ILIKE '%' || $3 || '%' ESCAPE '\\' OR upload_owner_name ILIKE '%' || $4 || '%' ESCAPE '\\') AND (downloadable_at IS NULL OR downloadable_at <= NOW() AT TIME ZONE 'Asia/Tokyo')"
      );
      expect(result.whereParams).toEqual(['1', 'search', 'search', 'search']);
      expect(result.whereParams.length).toBe(4);
    });

    it('targetUserIdとkeywordを組み合わせた場合、パラメータインデックスが正しい', () => {
      const filters: FileQueryFilters = {
        targetUserId: 789,
        keyword: 'test',
      };
      const result = buildFileQueryWhere(filters);

      expect(result.whereClause).toBe(
        "WHERE upload_user_id = $1 AND (file_name ILIKE '%' || $2 || '%' ESCAPE '\\' OR file_comment ILIKE '%' || $3 || '%' ESCAPE '\\' OR upload_owner_name ILIKE '%' || $4 || '%' ESCAPE '\\') AND (downloadable_at IS NULL OR downloadable_at <= NOW() AT TIME ZONE 'Asia/Tokyo')"
      );
      expect(result.whereParams).toEqual([789, 'test', 'test', 'test']);
      expect(result.whereParams.length).toBe(4);
    });

    it('keywordとtagFilteredFileIdsを組み合わせた場合、パラメータインデックスが正しい', () => {
      const filters: FileQueryFilters = {
        keyword: 'example',
        tagFilteredFileIds: [10, 20, 30],
      };
      const result = buildFileQueryWhere(filters);

      expect(result.whereClause).toBe(
        "WHERE (file_name ILIKE '%' || $1 || '%' OR file_comment ILIKE '%' || $2 || '%' OR upload_owner_name ILIKE '%' || $3 || '%') AND (downloadable_at IS NULL OR downloadable_at <= NOW() AT TIME ZONE 'Asia/Tokyo') AND id = ANY($4)"
      );
      expect(result.whereParams).toEqual(['example', 'example', 'example', [10, 20, 30]]);
      expect(result.whereParams.length).toBe(4);
    });

    it('すべての条件を組み合わせた場合、パラメータインデックスが正しい', () => {
      const filters: FileQueryFilters = {
        data_type: '1',
        targetUserId: 100,
        keyword: 'full',
        tagFilteredFileIds: [1, 2],
      };
      const result = buildFileQueryWhere(filters);

      expect(result.whereClause).toBe(
        "WHERE data_type = $1 AND upload_user_id = $2 AND (file_name ILIKE '%' || $3 || '%' OR file_comment ILIKE '%' || $4 || '%' OR upload_owner_name ILIKE '%' || $5 || '%') AND (downloadable_at IS NULL OR downloadable_at <= NOW() AT TIME ZONE 'Asia/Tokyo') AND id = ANY($6)"
      );
      expect(result.whereParams).toEqual(['1', 100, 'full', 'full', 'full', [1, 2]]);
      expect(result.whereParams.length).toBe(6);
    });
  });

  describe('パラメータの順序とインデックス', () => {
    it('各パラメータが連続したインデックスを持つ', () => {
      const filters: FileQueryFilters = {
        data_type: '2',
        targetUserId: 999,
        keyword: 'sequential',
      };
      const result = buildFileQueryWhere(filters);

      // WHERE句内のプレースホルダー番号を抽出
      const placeholders = result.whereClause.match(/\$\d+/g) || [];
      const indices = placeholders.map(p => parseInt(p.substring(1)));

      // インデックスが1から始まり連続していることを確認
      // data_type (1) + targetUserId (1) + keyword (3) = 5 parameters
      expect(indices).toEqual([1, 2, 3, 4, 5]);
      expect(Math.max(...indices)).toBe(result.whereParams.length);
    });

    it('tagFilteredFileIdsが空配列の場合は条件に含まれない', () => {
      const filters: FileQueryFilters = {
        data_type: '1',
        tagFilteredFileIds: [],
      };
      const result = buildFileQueryWhere(filters);

      expect(result.whereClause).toBe('WHERE data_type = $1');
      expect(result.whereParams).toEqual(['1']);
    });
  });

  describe('エッジケース', () => {
    it('keywordに日本語が含まれる場合', () => {
      const filters: FileQueryFilters = { keyword: 'テスト検索' };
      const result = buildFileQueryWhere(filters);

      expect(result.whereParams).toEqual(['テスト検索', 'テスト検索', 'テスト検索']);
    });

    it('keywordにスペースが含まれる場合', () => {
      const filters: FileQueryFilters = { keyword: 'multiple words search' };
      const result = buildFileQueryWhere(filters);

      expect(result.whereParams).toEqual([
        'multiple words search',
        'multiple words search',
        'multiple words search',
      ]);
    });

    it('data_typeが文字列の数値として渡される場合', () => {
      const filters: FileQueryFilters = { data_type: '1' };
      const result = buildFileQueryWhere(filters);

      expect(result.whereParams[0]).toBe('1');
      expect(typeof result.whereParams[0]).toBe('string');
    });

    it('targetUserIdが数値として渡される場合', () => {
      const filters: FileQueryFilters = { targetUserId: 42 };
      const result = buildFileQueryWhere(filters);

      expect(result.whereParams[0]).toBe(42);
      expect(typeof result.whereParams[0]).toBe('number');
    });

    it('tagFilteredFileIdsが大量のIDを含む場合', () => {
      const largeIdArray = Array.from({ length: 100 }, (_, i) => i + 1);
      const filters: FileQueryFilters = { tagFilteredFileIds: largeIdArray };
      const result = buildFileQueryWhere(filters);

      expect(result.whereClause).toBe('WHERE id = ANY($1)');
      expect(result.whereParams).toEqual([largeIdArray]);
      expect((result.whereParams[0] as number[]).length).toBe(100);
    });
  });

  describe('セキュリティ: SQLインジェクション対策', () => {
    it('keywordにSQLコメント構文が含まれる場合もパラメータ化される', () => {
      const filters: FileQueryFilters = { keyword: "test';--" };
      const result = buildFileQueryWhere(filters);

      // パラメータ化されているため、WHERE句にはプレースホルダーのみ
      expect(result.whereClause).not.toContain("test';--");
      expect(result.whereClause).toContain('$1');
      expect(result.whereParams).toEqual(["test';--", "test';--", "test';--"]);
    });

    it('keywordにUNION攻撃パターンが含まれる場合もパラメータ化される', () => {
      const filters: FileQueryFilters = { keyword: "' UNION SELECT * FROM users--" };
      const result = buildFileQueryWhere(filters);

      expect(result.whereClause).not.toContain('UNION');
      expect(result.whereParams).toEqual([
        "' UNION SELECT * FROM users--",
        "' UNION SELECT * FROM users--",
        "' UNION SELECT * FROM users--",
      ]);
    });
  });
});
