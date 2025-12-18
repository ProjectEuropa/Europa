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
    <div className="flex justify-center items-center gap-2 my-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className={`
          px-4 py-2 rounded-md
          flex items-center gap-1
          font-bold text-base
          transition-colors
          ${currentPage === 1 || loading
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-500 cursor-pointer'
          }
        `}
      >
        <ChevronLeft className="w-4 h-4" />
        前へ
      </button>

      <div className="flex items-center gap-1">
        {paginationRange.map((page, index) =>
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-slate-400 select-none"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(Number(page))}
              disabled={page === currentPage || loading}
              className={`
                min-w-[40px] py-2 rounded-md
                font-bold text-base
                transition-colors
                ${page === currentPage
                  ? 'bg-cyan-500 text-slate-900 cursor-default'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer'
                }
              `}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage || loading}
        className={`
          px-4 py-2 rounded-md
          flex items-center gap-1
          font-bold text-base
          transition-colors
          ${currentPage === lastPage || loading
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-500 cursor-pointer'
          }
        `}
      >
        次へ
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
