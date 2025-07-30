import { describe, expect, it } from 'vitest';
import { z } from 'zod';

// 仮想的なファイルスキーマ（実際の実装がない場合）
const FileSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1).max(255),
  size: z.number().nonnegative(),
  type: z.string().min(1),
  url: z.string().url().optional(),
  uploadedAt: z.string().datetime(),
  uploadedBy: z.number().positive(),
});

const FileUploadSchema = z.object({
  file: z.instanceof(File),
  description: z.string().max(500).optional(),
  tags: z.array(z.string()).max(10).optional(),
  isPublic: z.boolean().default(false),
});

const FileSearchSchema = z.object({
  query: z.string().min(1).max(100),
  type: z.enum(['all', 'image', 'document', 'video', 'audio']).default('all'),
  sortBy: z.enum(['name', 'size', 'date']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().positive().default(1),
  limit: z.number().positive().max(100).default(20),
});

type File = z.infer<typeof FileSchema>;
type FileUpload = z.infer<typeof FileUploadSchema>;
type FileSearch = z.infer<typeof FileSearchSchema>;

describe('File Schemas', () => {
  describe('FileSchema', () => {
    it('should validate correct file data', () => {
      const validFile = {
        id: 1,
        name: 'test.pdf',
        size: 1024,
        type: 'application/pdf',
        url: 'https://example.com/files/test.pdf',
        uploadedAt: '2024-01-01T00:00:00Z',
        uploadedBy: 1,
      };

      const result = FileSchema.safeParse(validFile);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validFile);
      }
    });

    it('should reject invalid file data', () => {
      const invalidFile = {
        id: -1, // negative ID
        name: '', // empty name
        size: -100, // negative size
        type: '',
        uploadedAt: 'invalid-date',
        uploadedBy: 0, // zero ID
      };

      const result = FileSchema.safeParse(invalidFile);
      expect(result.success).toBe(false);
    });

    it('should allow optional URL field', () => {
      const fileWithoutUrl = {
        id: 1,
        name: 'test.pdf',
        size: 1024,
        type: 'application/pdf',
        uploadedAt: '2024-01-01T00:00:00Z',
        uploadedBy: 1,
      };

      const result = FileSchema.safeParse(fileWithoutUrl);
      expect(result.success).toBe(true);
    });

    it('should validate URL format when provided', () => {
      const fileWithInvalidUrl = {
        id: 1,
        name: 'test.pdf',
        size: 1024,
        type: 'application/pdf',
        url: 'not-a-valid-url',
        uploadedAt: '2024-01-01T00:00:00Z',
        uploadedBy: 1,
      };

      const result = FileSchema.safeParse(fileWithInvalidUrl);
      expect(result.success).toBe(false);
    });
  });

  describe('FileUploadSchema', () => {
    it('should validate correct file upload data', () => {
      const mockFile = new File(['content'], 'test.txt', {
        type: 'text/plain',
      });
      const validUpload = {
        file: mockFile,
        description: 'Test file upload',
        tags: ['test', 'document'],
        isPublic: true,
      };

      const result = FileUploadSchema.safeParse(validUpload);
      expect(result.success).toBe(true);
    });

    it('should require file field', () => {
      const uploadWithoutFile = {
        description: 'Test file upload',
      };

      const result = FileUploadSchema.safeParse(uploadWithoutFile);
      expect(result.success).toBe(false);
    });

    it('should allow optional fields', () => {
      const mockFile = new File(['content'], 'test.txt', {
        type: 'text/plain',
      });
      const minimalUpload = {
        file: mockFile,
      };

      const result = FileUploadSchema.safeParse(minimalUpload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isPublic).toBe(false); // default value
      }
    });

    it('should validate description length', () => {
      const mockFile = new File(['content'], 'test.txt', {
        type: 'text/plain',
      });
      const uploadWithLongDescription = {
        file: mockFile,
        description: 'a'.repeat(501), // exceeds 500 character limit
      };

      const result = FileUploadSchema.safeParse(uploadWithLongDescription);
      expect(result.success).toBe(false);
    });

    it('should validate tags array length', () => {
      const mockFile = new File(['content'], 'test.txt', {
        type: 'text/plain',
      });
      const uploadWithManyTags = {
        file: mockFile,
        tags: Array(11).fill('tag'), // exceeds 10 tag limit
      };

      const result = FileUploadSchema.safeParse(uploadWithManyTags);
      expect(result.success).toBe(false);
    });
  });

  describe('FileSearchSchema', () => {
    it('should validate correct search data', () => {
      const validSearch = {
        query: 'test document',
        type: 'document' as const,
        sortBy: 'name' as const,
        sortOrder: 'asc' as const,
        page: 2,
        limit: 50,
      };

      const result = FileSearchSchema.safeParse(validSearch);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validSearch);
      }
    });

    it('should apply default values', () => {
      const minimalSearch = {
        query: 'test',
      };

      const result = FileSearchSchema.safeParse(minimalSearch);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.type).toBe('all');
        expect(result.data.sortBy).toBe('date');
        expect(result.data.sortOrder).toBe('desc');
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(20);
      }
    });

    it('should reject empty query', () => {
      const searchWithEmptyQuery = {
        query: '',
      };

      const result = FileSearchSchema.safeParse(searchWithEmptyQuery);
      expect(result.success).toBe(false);
    });

    it('should reject invalid enum values', () => {
      const searchWithInvalidType = {
        query: 'test',
        type: 'invalid-type',
      };

      const result = FileSearchSchema.safeParse(searchWithInvalidType);
      expect(result.success).toBe(false);
    });

    it('should reject invalid page and limit values', () => {
      const searchWithInvalidPagination = {
        query: 'test',
        page: 0, // must be positive
        limit: 101, // exceeds max of 100
      };

      const result = FileSearchSchema.safeParse(searchWithInvalidPagination);
      expect(result.success).toBe(false);
    });

    it('should validate query length', () => {
      const searchWithLongQuery = {
        query: 'a'.repeat(101), // exceeds 100 character limit
      };

      const result = FileSearchSchema.safeParse(searchWithLongQuery);
      expect(result.success).toBe(false);
    });
  });
});
