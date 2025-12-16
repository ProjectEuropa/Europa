import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import files from './files';
import type { Env } from '../types/bindings';

// Mock dependencies
vi.mock('@neondatabase/serverless', () => ({
    neon: vi.fn(),
}));

vi.mock('../middleware/auth', () => ({
    authMiddleware: vi.fn((c, next) => next()),
    optionalAuthMiddleware: vi.fn((c, next) => next()),
}));

describe('files route - keyword search', () => {
    let mockSql: any;
    let app: Hono<{ Bindings: Env }>;

    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks();

        // Setup mock SQL function
        mockSql = vi.fn();

        // Import neon mock
        const { neon } = require('@neondatabase/serverless');
        neon.mockReturnValue(mockSql);

        // Create app instance
        app = new Hono<{ Bindings: Env }>();
        app.route('/api/v2/files', files);
    });

    describe('upload_owner_name search functionality', () => {
        it('キーワード検索でオーナー名が検索対象に含まれる（keyword only）', async () => {
            // Setup: mock database responses
            mockSql.mockResolvedValueOnce([{ count: '1' }]); // count query
            mockSql.mockResolvedValueOnce([
                {
                    id: 1,
                    upload_user_id: 1,
                    upload_owner_name: 'Xtend',
                    file_name: 'test.xtn',
                    file_path: 'files/1/test.xtn',
                    file_size: 1024,
                    file_comment: 'Test file',
                    data_type: '1',
                    downloadable_at: null,
                    created_at: new Date(),
                    updated_at: new Date(),
                }
            ]); // files query
            mockSql.mockResolvedValueOnce([]); // tags query

            // Mock environment
            const mockEnv = {
                DATABASE_URL: 'mock-url',
                FILES_BUCKET: {} as any,
                JWT_SECRET: 'test-secret',
                RESEND_API_KEY: 'test-key',
                FRONTEND_URL: 'http://localhost:3000',
            };

            // Execute: search with keyword
            const req = new Request('http://localhost/api/v2/files?keyword=Xtend');
            const res = await app.request(req, mockEnv);

            // Verify: response
            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data.data.files).toHaveLength(1);
            expect(data.data.files[0].upload_owner_name).toBe('Xtend');

            // Verify: SQL query includes upload_owner_name in search
            expect(mockSql).toHaveBeenCalledTimes(3);
            const countQuery = mockSql.mock.calls[0];
            const filesQuery = mockSql.mock.calls[1];

            // Check that the query contains the ILIKE pattern for upload_owner_name
            expect(countQuery[0]).toContain('upload_owner_name ILIKE');
            expect(filesQuery[0]).toContain('upload_owner_name ILIKE');
        });

        it('キーワード検索でオーナー名が検索対象に含まれる（keyword + data_type）', async () => {
            // Setup: mock database responses
            mockSql.mockResolvedValueOnce([{ count: '1' }]); // count query
            mockSql.mockResolvedValueOnce([
                {
                    id: 2,
                    upload_user_id: 2,
                    upload_owner_name: 'Xtend',
                    file_name: 'another.xtn',
                    file_path: 'files/2/another.xtn',
                    file_size: 2048,
                    file_comment: 'Another test',
                    data_type: '1',
                    downloadable_at: null,
                    created_at: new Date(),
                    updated_at: new Date(),
                }
            ]); // files query
            mockSql.mockResolvedValueOnce([]); // tags query

            // Mock environment
            const mockEnv = {
                DATABASE_URL: 'mock-url',
                FILES_BUCKET: {} as any,
                JWT_SECRET: 'test-secret',
                RESEND_API_KEY: 'test-key',
                FRONTEND_URL: 'http://localhost:3000',
            };

            // Execute: search with keyword and data_type
            const req = new Request('http://localhost/api/v2/files?keyword=Xtend&data_type=1');
            const res = await app.request(req, mockEnv);

            // Verify: response
            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data.data.files).toHaveLength(1);

            // Verify: SQL query includes upload_owner_name in search
            expect(mockSql).toHaveBeenCalledTimes(3);
            const countQuery = mockSql.mock.calls[0];
            const filesQuery = mockSql.mock.calls[1];

            expect(countQuery[0]).toContain('upload_owner_name ILIKE');
            expect(filesQuery[0]).toContain('upload_owner_name ILIKE');
        });

        it('キーワード検索でオーナー名が検索対象に含まれる（keyword + upload_user_id）', async () => {
            // Setup: mock database responses
            mockSql.mockResolvedValueOnce([{ count: '1' }]); // count query
            mockSql.mockResolvedValueOnce([
                {
                    id: 3,
                    upload_user_id: 5,
                    upload_owner_name: 'Xtend',
                    file_name: 'user_file.xtn',
                    file_path: 'files/3/user_file.xtn',
                    file_size: 512,
                    file_comment: 'User specific file',
                    data_type: '1',
                    downloadable_at: null,
                    created_at: new Date(),
                    updated_at: new Date(),
                }
            ]); // files query
            mockSql.mockResolvedValueOnce([]); // tags query

            // Mock environment
            const mockEnv = {
                DATABASE_URL: 'mock-url',
                FILES_BUCKET: {} as any,
                JWT_SECRET: 'test-secret',
                RESEND_API_KEY: 'test-key',
                FRONTEND_URL: 'http://localhost:3000',
            };

            // Execute: search with keyword and upload_user_id
            const req = new Request('http://localhost/api/v2/files?keyword=Xtend&upload_user_id=5');
            const res = await app.request(req, mockEnv);

            // Verify: response
            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data.data.files).toHaveLength(1);

            // Verify: SQL query includes upload_owner_name in search
            expect(mockSql).toHaveBeenCalledTimes(3);
            const countQuery = mockSql.mock.calls[0];
            const filesQuery = mockSql.mock.calls[1];

            expect(countQuery[0]).toContain('upload_owner_name ILIKE');
            expect(filesQuery[0]).toContain('upload_owner_name ILIKE');
        });

        it('キーワード検索でオーナー名が検索対象に含まれる（keyword + data_type + upload_user_id）', async () => {
            // Setup: mock database responses
            mockSql.mockResolvedValueOnce([{ count: '1' }]); // count query
            mockSql.mockResolvedValueOnce([
                {
                    id: 4,
                    upload_user_id: 5,
                    upload_owner_name: 'Xtend',
                    file_name: 'complete.xtn',
                    file_path: 'files/4/complete.xtn',
                    file_size: 4096,
                    file_comment: 'Complete test',
                    data_type: '1',
                    downloadable_at: null,
                    created_at: new Date(),
                    updated_at: new Date(),
                }
            ]); // files query
            mockSql.mockResolvedValueOnce([]); // tags query

            // Mock environment
            const mockEnv = {
                DATABASE_URL: 'mock-url',
                FILES_BUCKET: {} as any,
                JWT_SECRET: 'test-secret',
                RESEND_API_KEY: 'test-key',
                FRONTEND_URL: 'http://localhost:3000',
            };

            // Execute: search with all parameters
            const req = new Request('http://localhost/api/v2/files?keyword=Xtend&data_type=1&upload_user_id=5');
            const res = await app.request(req, mockEnv);

            // Verify: response
            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data.data.files).toHaveLength(1);

            // Verify: SQL query includes upload_owner_name in search
            expect(mockSql).toHaveBeenCalledTimes(3);
            const countQuery = mockSql.mock.calls[0];
            const filesQuery = mockSql.mock.calls[1];

            expect(countQuery[0]).toContain('upload_owner_name ILIKE');
            expect(filesQuery[0]).toContain('upload_owner_name ILIKE');
        });

        it('キーワードなしの検索ではオーナー名検索が行われない', async () => {
            // Setup: mock database responses
            mockSql.mockResolvedValueOnce([{ count: '2' }]); // count query
            mockSql.mockResolvedValueOnce([
                {
                    id: 5,
                    upload_user_id: 1,
                    upload_owner_name: 'User1',
                    file_name: 'file1.xtn',
                    file_path: 'files/5/file1.xtn',
                    file_size: 100,
                    file_comment: 'File 1',
                    data_type: '1',
                    downloadable_at: null,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    id: 6,
                    upload_user_id: 2,
                    upload_owner_name: 'Xtend',
                    file_name: 'file2.xtn',
                    file_path: 'files/6/file2.xtn',
                    file_size: 200,
                    file_comment: 'File 2',
                    data_type: '1',
                    downloadable_at: null,
                    created_at: new Date(),
                    updated_at: new Date(),
                }
            ]); // files query
            mockSql.mockResolvedValueOnce([]); // tags query

            // Mock environment
            const mockEnv = {
                DATABASE_URL: 'mock-url',
                FILES_BUCKET: {} as any,
                JWT_SECRET: 'test-secret',
                RESEND_API_KEY: 'test-key',
                FRONTEND_URL: 'http://localhost:3000',
            };

            // Execute: search without keyword
            const req = new Request('http://localhost/api/v2/files');
            const res = await app.request(req, mockEnv);

            // Verify: response
            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data.data.files).toHaveLength(2);

            // Verify: SQL query does NOT include upload_owner_name search (no keyword)
            expect(mockSql).toHaveBeenCalledTimes(3);
            const countQuery = mockSql.mock.calls[0];
            const filesQuery = mockSql.mock.calls[1];

            expect(countQuery[0]).not.toContain('ILIKE');
            expect(filesQuery[0]).not.toContain('ILIKE');
        });
    });
});
