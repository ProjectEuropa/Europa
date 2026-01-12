import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

/**
 * fixturesディレクトリのパス (ESモジュール対応)
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURES_DIR = path.join(__dirname, '../fixtures');

/**
 * 実際のサンプルチームファイルを読み込む
 */
export function loadSampleTeamFile(): Buffer {
  return fs.readFileSync(path.join(FIXTURES_DIR, 'sample-team.CHE'));
}

/**
 * 実際のサンプルマッチファイルを読み込む
 */
export function loadSampleMatchFile(): Buffer {
  return fs.readFileSync(path.join(FIXTURES_DIR, 'sample-match.CHE'));
}

/**
 * テスト用のCHEファイルコンテンツを生成（モック用）
 */
export function createMockCheFile(sizeInBytes: number = 1024): Buffer {
  const header = Buffer.from('CHE_FILE_HEADER_V1');
  const padding = Buffer.alloc(Math.max(0, sizeInBytes - header.length));
  return Buffer.concat([header, padding]);
}

/**
 * 最小サイズのCHEファイル
 */
export function createMinimalCheFile(): Buffer {
  return createMockCheFile(100);
}

/**
 * チームデータ用のCHEファイル（25KB以下）
 */
export function createTeamCheFile(sizeInKB: number = 10): Buffer {
  const sizeInBytes = sizeInKB * 1024;
  return createMockCheFile(sizeInBytes);
}

/**
 * マッチデータ用のCHEファイル（260KB以下）
 */
export function createMatchCheFile(sizeInKB: number = 50): Buffer {
  const sizeInBytes = sizeInKB * 1024;
  return createMockCheFile(sizeInBytes);
}

/**
 * オーバーサイズのCHEファイル（テスト用）
 */
export function createOversizedTeamFile(): Buffer {
  return createMockCheFile(30 * 1024); // 30KB > 25KB
}

export function createOversizedMatchFile(): Buffer {
  return createMockCheFile(300 * 1024); // 300KB > 260KB
}

/**
 * 不正なファイル形式のテストデータ
 */
export function createInvalidFormatFile(): Buffer {
  return Buffer.from('This is not a CHE file');
}

/**
 * テストデータの定義
 */
export const uploadTestData = {
  validTeam: {
    ownerName: 'テストオーナー',
    comment: 'これはテスト用のチームデータです。',
    deletePassword: 'test123',
    tags: ['攻撃型', 'カウンター'],
    fileName: 'test-team.CHE',
  },
  validMatch: {
    ownerName: 'マッチオーナー',
    comment: '接戦の試合でした。',
    deletePassword: 'match456',
    tags: ['熱戦', 'ハイライト'],
    fileName: 'test-match.CHE',
  },
  longComment: 'A'.repeat(500),
  maxTags: ['タグ1', 'タグ2', 'タグ3', 'タグ4'],
};

/**
 * アップロードAPI成功モック
 */
export async function mockUploadSuccess(page: Page, fileType: 'team' | 'match' = 'team') {
  await page.route('**/api/v2/files', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            file: {
              id: 1,
              file_name: 'uploaded-file.CHE',
              file_comment: 'Test comment',
              upload_owner_name: 'Test Owner',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              downloadable_at: new Date().toISOString(),
              tags: ['tag1', 'tag2'],
            },
          },
        }),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * アップロードAPIエラーモック
 */
export async function mockUploadError(
  page: Page,
  status: number = 500,
  message: string = 'アップロードに失敗しました'
) {
  await page.route('**/api/v2/files', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify({
          message,
          ...(status === 422 && {
            errors: {
              file: ['ファイルが無効です'],
            },
          }),
        }),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * バリデーションエラーモック（422）
 */
export async function mockValidationError(
  page: Page,
  errors: Record<string, string[]>
) {
  await page.route('**/api/v2/files', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Validation failed',
          errors,
        }),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * タグ取得APIモック
 */
export async function mockFetchTags(page: Page, tags: string[] = ['人気タグ1', '人気タグ2', '人気タグ3']) {
  await page.route('**/api/v2/files/tags', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: { tags },
      }),
    });
  });
}

/**
 * アップロード成功後のファイルデータ（検索結果に使用）
 */
export interface UploadedFileData {
  id: number;
  file_name: string;
  file_comment: string;
  upload_owner_name: string;
  tags: string[];
}

/**
 * アップロード成功モック（アップロードしたファイル情報を返す）
 */
export async function mockUploadSuccessWithData(
  page: Page,
  fileData: UploadedFileData
) {
  await page.route('**/api/v2/files', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            file: {
              id: fileData.id,
              file_name: fileData.file_name,
              file_comment: fileData.file_comment,
              upload_owner_name: fileData.upload_owner_name,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              downloadable_at: new Date().toISOString(),
              tags: fileData.tags,
            },
          },
        }),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * 検索API成功モック
 */
export async function mockSearchFiles(
  page: Page,
  fileType: 'team' | 'match',
  files: UploadedFileData[]
) {
  const dataType = fileType === 'team' ? '1' : '2';
  await page.route(`**/api/v2/files?data_type=${dataType}*`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          files: files.map(f => ({
            id: f.id,
            file_name: f.file_name,
            file_comment: f.file_comment,
            upload_owner_name: f.upload_owner_name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            downloadable_at: new Date().toISOString(),
            tags: f.tags,
          })),
          pagination: {
            page: 1,
            limit: 10,
            total: files.length,
          },
        },
      }),
    });
  });
}
