import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SumDownloadPaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

function getPaginationRange(current: number, last: number, delta = 2) {
  const range: (number | string)[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(last - 1, current + delta);

  range.push(1);
  if (left > 2) range.push('...');
  for (let i = left; i <= right; i++) range.push(i);
  if (right < last - 1) range.push('...');
  if (last > 1) range.push(last);
  return range;
}

export const SumDownloadPagination = ({
  currentPage,
  lastPage,
  onPageChange,
  loading = false,
}: SumDownloadPaginationProps) => {
  if (lastPage <= 1) return null;

  const paginationRange = getPaginationRange(currentPage, lastPage);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        margin: '24px 0',
      }}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        style={{
          padding: '8px 18px',
          borderRadius: 6,
          border: 'none',
          background: currentPage === 1 || loading ? '#1E3A5F' : '#3B82F6',
          color: currentPage === 1 || loading ? '#8CB4FF' : '#fff',
          fontWeight: 'bold',
          cursor: currentPage === 1 || loading ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
          marginRight: 8,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <ChevronLeft style={{ width: '16px', height: '16px' }} />
        前へ
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {paginationRange.map((page, index) =>
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              style={{ color: '#8CB4FF', padding: '0 10px' }}
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(Number(page))}
              disabled={page === currentPage || loading}
              style={{
                minWidth: 40,
                padding: '8px 0',
                borderRadius: 6,
                border: 'none',
                background: page === currentPage ? '#00c8ff' : '#19223a',
                color: page === currentPage ? '#020824' : '#8CB4FF',
                fontWeight: 'bold',
                cursor: page === currentPage || loading ? 'default' : 'pointer',
                fontSize: '1rem',
                marginRight: 4,
              }}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage || loading}
        style={{
          padding: '8px 18px',
          borderRadius: 6,
          border: 'none',
          background: currentPage === lastPage || loading ? '#1E3A5F' : '#3B82F6',
          color: currentPage === lastPage || loading ? '#8CB4FF' : '#fff',
          fontWeight: 'bold',
          cursor: currentPage === lastPage || loading ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
          marginLeft: 8,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        次へ
        <ChevronRight style={{ width: '16px', height: '16px' }} />
      </button>
    </div>
  );
};
