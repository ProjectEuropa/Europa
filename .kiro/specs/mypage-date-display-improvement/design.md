# Design Document

## Overview

マイページのファイル一覧において、「公開日」表示を「ダウンロード日時」表示に変更する機能改善を実装します。この変更により、ユーザーはファイルがいつからダウンロード可能になるかをより明確に把握できるようになります。

## Architecture

### 現在の実装状況

- **コンポーネント**: `FileListSection.tsx`
- **データソース**: `downloadableAt`フィールド（既存）
- **表示形式**: 現在は日付のみ（YYYY/MM/DD）
- **表示位置**: テーブルの「公開日」列およびモバイル表示の公開日部分

### 変更対象

1. **テーブルヘッダー**: 「公開日」→「ダウンロード日時」
2. **表示フォーマット**: 日付のみ → 日時（YYYY/MM/DD HH:mm）
3. **モバイル表示**: 対応する部分の表示テキスト変更
4. **アクセシビリティ**: 適切なラベリングの追加

## Components and Interfaces

### 1. FileListSection Component

**変更箇所:**
- テーブルヘッダーのテキスト変更
- 日時フォーマット関数の更新
- モバイル表示のラベル変更
- アクセシビリティ属性の追加

**影響範囲:**
- デスクトップ表示のテーブルヘッダー
- モバイル表示のラベルテキスト
- 日時フォーマット処理

### 2. Date Formatting Function

**現在の実装:**
```typescript
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return dateString.slice(0, 10).replace(/-/g, '/');
};
```

**新しい実装:**
```typescript
const formatDownloadDateTime = (dateString: string) => {
  if (!dateString) return '未設定';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return '-';
  }
};
```

### 3. Type Definitions

既存の`MyPageFile`インターフェースは変更不要：
```typescript
export interface MyPageFile {
  id: string;
  name: string;
  uploadDate: string;
  downloadableAt?: string; // 既存フィールドを活用
  comment?: string;
  type: 'team' | 'match';
}
```

## Data Models

### Input Data Format

APIから受信するデータ形式（変更なし）：
```typescript
{
  id: string;
  name: string;
  uploadDate: string; // ISO 8601 format
  downloadableAt?: string; // ISO 8601 format (optional)
  comment?: string;
  type: 'team' | 'match';
}
```

### Display Data Format

表示用データの変換：
```typescript
// Before: "2024-01-15T10:30:00Z" → "2024/01/15"
// After:  "2024-01-15T10:30:00Z" → "2024/01/15 10:30"
```

## Error Handling

### 日時フォーマットエラー

1. **無効な日時文字列**: `-`を表示
2. **null/undefined値**: `未設定`を表示
3. **フォーマット例外**: `-`を表示してコンソールにエラーログ

### フォールバック戦略

```typescript
const formatDownloadDateTime = (dateString: string) => {
  if (!dateString) return '未設定';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return '-';
    }
    
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return '-';
  }
};
```

## Testing Strategy

### Unit Tests

1. **日時フォーマット関数のテスト**
   - 正常な日時文字列の変換
   - 無効な日時文字列の処理
   - null/undefined値の処理
   - エラーハンドリング

2. **コンポーネントテスト**
   - ヘッダーテキストの表示確認
   - 日時データの正しい表示
   - モバイル表示での正しいラベル
   - アクセシビリティ属性の確認

### Integration Tests

1. **ファイル一覧表示テスト**
   - 実際のAPIデータでの表示確認
   - レスポンシブ表示の動作確認

### Test Cases

```typescript
describe('formatDownloadDateTime', () => {
  it('should format valid datetime string', () => {
    expect(formatDownloadDateTime('2024-01-15T10:30:00Z'))
      .toBe('2024/01/15 10:30');
  });

  it('should return "未設定" for empty string', () => {
    expect(formatDownloadDateTime('')).toBe('未設定');
  });

  it('should return "-" for invalid date', () => {
    expect(formatDownloadDateTime('invalid-date')).toBe('-');
  });

  it('should handle null/undefined', () => {
    expect(formatDownloadDateTime(null)).toBe('未設定');
    expect(formatDownloadDateTime(undefined)).toBe('未設定');
  });
});
```

## Accessibility Considerations

### ARIA Labels

```typescript
// テーブルヘッダー
<th scope="col" aria-label="ファイルのダウンロード可能日時">
  ダウンロード日時
</th>

// データセル
<td aria-label={`ダウンロード日時: ${formattedDateTime}`}>
  {formattedDateTime}
</td>
```

### Screen Reader Support

- ヘッダーに適切な`scope`属性を設定
- 日時データに説明的な`aria-label`を提供
- 「未設定」状態の明確な表現

## Implementation Plan

### Phase 1: Core Changes
1. 日時フォーマット関数の実装
2. テーブルヘッダーの変更
3. デスクトップ表示の更新

### Phase 2: Mobile and Accessibility
1. モバイル表示の更新
2. アクセシビリティ属性の追加
3. エラーハンドリングの強化

### Phase 3: Testing and Validation
1. ユニットテストの更新
2. 統合テストの実行
3. アクセシビリティテストの実施

## Backward Compatibility

この変更は表示のみの変更であり、以下の点で後方互換性を保持：

- APIインターフェースは変更なし
- データ構造は変更なし
- 既存の`downloadableAt`フィールドを活用
- 他のコンポーネントへの影響なし

## Performance Considerations

- 日時フォーマット処理は軽量
- メモ化は不要（計算コストが低い）
- レンダリング性能への影響は最小限

## Localization

現在は日本語のみサポートしているため、`ja-JP`ロケールを使用：
```typescript
date.toLocaleString('ja-JP', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});
```

将来的な多言語対応時は、ユーザーのロケール設定に基づいて動的に変更可能。
