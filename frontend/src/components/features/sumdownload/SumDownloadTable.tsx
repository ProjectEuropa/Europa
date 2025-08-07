import React from 'react';
import { formatDate } from '@/utils/dateFormatters';

// 一括ダウンロード用の日付フォーマット関数
const formatDownloadableDate = (dateString?: string | null): string => {
  if (!dateString || dateString.trim() === '') {
    return '即座にダウンロード可能';
  }
  return formatDate(dateString);
};

export interface SumDownloadItem {
  id: number;
  file_name: string;
  upload_owner_name: string;
  created_at: string;
  file_comment: string;
  downloadable_at?: string | null;
  search_tag1?: string;
  search_tag2?: string;
  search_tag3?: string;
  search_tag4?: string;
}

interface SumDownloadTableProps {
  data: SumDownloadItem[];
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  loading?: boolean;
  searchType: 'team' | 'match';
}

export const SumDownloadTable = ({
  data,
  selectedIds,
  onSelectionChange,
  loading = false,
  searchType,
}: SumDownloadTableProps) => {
  const handleSelectAll = (checked: boolean) => {
    onSelectionChange(checked ? data.map(item => item.id) : []);
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const isAllSelected = selectedIds.length === data.length && data.length > 0;
  const isIndeterminate =
    selectedIds.length > 0 && selectedIds.length < data.length;

  const renderTags = (item: SumDownloadItem) => {
    const tags = [
      item.search_tag1,
      item.search_tag2,
      item.search_tag3,
      item.search_tag4,
    ].filter(Boolean);

    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          marginTop: '4px',
        }}
      >
        {tags.map((tag, index) => (
          <span
            key={index}
            style={{
              background: '#1E3A5F',
              color: '#8CB4FF',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '0.75rem',
              whiteSpace: 'nowrap',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    );
  };

  const renderComment = (comment: string) => {
    if (!comment) return '';

    return comment.split(/\r?\n/).map((line, idx) => (
      <span key={idx}>
        {line}
        {idx < comment.split(/\r?\n/).length - 1 && <br />}
      </span>
    ));
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '32px 0',
        }}
      >
        <svg
          style={{
            width: '24px',
            height: '24px',
            animation: 'spin 1s linear infinite',
            color: '#00c8ff',
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="2" x2="12" y2="6"></line>
          <line x1="12" y1="18" x2="12" y2="22"></line>
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
          <line x1="2" y1="12" x2="6" y2="12"></line>
          <line x1="18" y1="12" x2="22" y2="12"></line>
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
        </svg>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', color: '#b0c4d8' }}>
        {searchType === 'team' ? 'チームデータ' : 'マッチデータ'}
        が見つかりませんでした
      </div>
    );
  }

  return (
    <div
      style={{
        border: '1px solid #1E3A5F',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: '#020824',
        }}
      >
        <thead>
          <tr
            style={{ background: '#1E3A5F', borderBottom: '1px solid #2D4A6B' }}
          >
            <th
              style={{ width: '50px', padding: '12px 16px', textAlign: 'left' }}
            >
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={e => handleSelectAll(e.target.checked)}
                disabled={loading}
                aria-label="すべて選択"
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: '#00c8ff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
                ref={el => {
                  if (el && isIndeterminate) {
                    el.indeterminate = true;
                  }
                }}
              />
            </th>
            <th
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                color: '#fff',
                fontWeight: '600',
              }}
            >
              {searchType === 'team' ? 'チーム名' : 'マッチ名'}
            </th>
            <th
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                color: '#fff',
                fontWeight: '600',
              }}
            >
              オーナー
            </th>
            <th
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                color: '#fff',
                fontWeight: '600',
              }}
            >
              アップロード日
            </th>
            <th
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                color: '#fff',
                fontWeight: '600',
              }}
            >
              ダウンロード可能日
            </th>
            <th
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                color: '#fff',
                fontWeight: '600',
              }}
            >
              コメント・タグ
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr
              key={item.id}
              style={{
                background: selectedIds.includes(item.id)
                  ? '#0A1A2A'
                  : 'transparent',
                borderBottom: '1px solid #1E3A5F',
              }}
            >
              <td style={{ padding: '12px 16px' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={e => handleSelectItem(item.id, e.target.checked)}
                  disabled={loading}
                  aria-label={`${item.file_name}を選択`}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: '#00c8ff',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                />
              </td>
              <td
                style={{
                  padding: '12px 16px',
                  color: '#fff',
                  fontWeight: '500',
                }}
              >
                {item.file_name}
              </td>
              <td style={{ padding: '12px 16px', color: '#b0c4d8' }}>
                {item.upload_owner_name}
              </td>
              <td style={{ padding: '12px 16px', color: '#b0c4d8' }}>
                {formatDate(item.created_at)}
              </td>
              <td style={{ padding: '12px 16px', color: '#b0c4d8' }}>
                {formatDownloadableDate(item.downloadable_at)}
              </td>
              <td style={{ padding: '12px 16px', color: '#b0c4d8' }}>
                <div>
                  {renderComment(item.file_comment)}
                  {renderTags(item)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
