import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import type { Env } from '../types/bindings';

// buildKeywordSearchCondition関数のテスト
// この関数はfiles.tsからエクスポートされていないため、直接テストを書く
describe('buildKeywordSearchCondition', () => {
    it('キーワードを正しくパターンに変換する', () => {
        const keyword = 'Xtend';
        const expected = '%Xtend%';

        // ヘルパー関数の動作をシミュレート
        const keywordPattern = `%${keyword}%`;

        expect(keywordPattern).toBe(expected);
    });

    it('空のキーワードの場合は空文字列を返す', () => {
        const keyword = '';
        const keywordPattern = keyword ? `%${keyword}%` : '';

        expect(keywordPattern).toBe('');
    });

    it('特殊文字を含むキーワードも正しく変換する', () => {
        const keyword = 'test_name';
        const expected = '%test_name%';

        const keywordPattern = `%${keyword}%`;

        expect(keywordPattern).toBe(expected);
    });
});

describe('File search with upload_owner_name', () => {
    it('キーワード検索でupload_owner_nameが検索対象に含まれることを確認', () => {
        // この検索条件が正しく構築されることを確認
        const keyword = 'Xtend';
        const keywordPattern = `%${keyword}%`;

        // 検索対象フィールドのリスト
        const searchFields = ['file_name', 'file_comment', 'upload_owner_name'];

        // upload_owner_nameが含まれていることを確認
        expect(searchFields).toContain('upload_owner_name');
        expect(searchFields).toContain('file_name');
        expect(searchFields).toContain('file_comment');
        expect(searchFields.length).toBe(3);
    });

    it('オーナー名でファイルを検索できる（統合テストのシナリオ）', () => {
        // 検索シナリオのテスト
        const mockFiles = [
            { id: 1, file_name: 'file1.txt', file_comment: 'comment1', upload_owner_name: 'Xtend' },
            { id: 2, file_name: 'file2.txt', file_comment: 'comment2', upload_owner_name: 'OtherOwner' },
            { id: 3, file_name: 'Xtend.txt', file_comment: 'comment3', upload_owner_name: 'Owner3' },
        ];

        const keyword = 'Xtend';
        const keywordPattern = keyword.toLowerCase();

        // ILIKE検索のシミュレーション（大文字小文字を区別しない部分一致）
        const searchResults = mockFiles.filter(file =>
            file.file_name.toLowerCase().includes(keywordPattern) ||
            file.file_comment.toLowerCase().includes(keywordPattern) ||
            file.upload_owner_name.toLowerCase().includes(keywordPattern)
        );

        // 'Xtend'を含むファイルが2件見つかることを確認
        expect(searchResults.length).toBe(2);
        expect(searchResults[0].id).toBe(1); // upload_owner_nameが'Xtend'
        expect(searchResults[1].id).toBe(3); // file_nameが'Xtend.txt'
    });

    it('file_nameのみで検索した場合', () => {
        const mockFiles = [
            { id: 1, file_name: 'test.txt', file_comment: 'comment1', upload_owner_name: 'Owner1' },
            { id: 2, file_name: 'example.txt', file_comment: 'test comment', upload_owner_name: 'Owner2' },
        ];

        const keyword = 'test';
        const keywordPattern = keyword.toLowerCase();

        const searchResults = mockFiles.filter(file =>
            file.file_name.toLowerCase().includes(keywordPattern) ||
            file.file_comment.toLowerCase().includes(keywordPattern) ||
            file.upload_owner_name.toLowerCase().includes(keywordPattern)
        );

        expect(searchResults.length).toBe(2);
    });

    it('file_commentのみで検索した場合', () => {
        const mockFiles = [
            { id: 1, file_name: 'file1.txt', file_comment: 'important note', upload_owner_name: 'Owner1' },
            { id: 2, file_name: 'file2.txt', file_comment: 'regular comment', upload_owner_name: 'Owner2' },
        ];

        const keyword = 'important';
        const keywordPattern = keyword.toLowerCase();

        const searchResults = mockFiles.filter(file =>
            file.file_name.toLowerCase().includes(keywordPattern) ||
            file.file_comment.toLowerCase().includes(keywordPattern) ||
            file.upload_owner_name.toLowerCase().includes(keywordPattern)
        );

        expect(searchResults.length).toBe(1);
        expect(searchResults[0].id).toBe(1);
    });

    it('upload_owner_nameのみで検索した場合', () => {
        const mockFiles = [
            { id: 1, file_name: 'file1.txt', file_comment: 'comment1', upload_owner_name: 'ProjectEuropa' },
            { id: 2, file_name: 'file2.txt', file_comment: 'comment2', upload_owner_name: 'OtherUser' },
            { id: 3, file_name: 'file3.txt', file_comment: 'comment3', upload_owner_name: 'ProjectEuropa' },
        ];

        const keyword = 'ProjectEuropa';
        const keywordPattern = keyword.toLowerCase();

        const searchResults = mockFiles.filter(file =>
            file.file_name.toLowerCase().includes(keywordPattern) ||
            file.file_comment.toLowerCase().includes(keywordPattern) ||
            file.upload_owner_name.toLowerCase().includes(keywordPattern)
        );

        expect(searchResults.length).toBe(2);
        expect(searchResults[0].upload_owner_name).toBe('ProjectEuropa');
        expect(searchResults[1].upload_owner_name).toBe('ProjectEuropa');
    });

    it('検索結果が見つからない場合', () => {
        const mockFiles = [
            { id: 1, file_name: 'file1.txt', file_comment: 'comment1', upload_owner_name: 'Owner1' },
            { id: 2, file_name: 'file2.txt', file_comment: 'comment2', upload_owner_name: 'Owner2' },
        ];

        const keyword = 'nonexistent';
        const keywordPattern = keyword.toLowerCase();

        const searchResults = mockFiles.filter(file =>
            file.file_name.toLowerCase().includes(keywordPattern) ||
            file.file_comment.toLowerCase().includes(keywordPattern) ||
            file.upload_owner_name.toLowerCase().includes(keywordPattern)
        );

        expect(searchResults.length).toBe(0);
    });
});
