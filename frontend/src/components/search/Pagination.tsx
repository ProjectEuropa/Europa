import type React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
}) => {
  return (
    <div className="px-6 py-4 bg-blue-900/10 border-t border-blue-900/30 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <span className="text-sm text-blue-300">表示:</span>
        <select
          value={itemsPerPage}
          onChange={e => onItemsPerPageChange(Number(e.target.value))}
          className="bg-black border border-blue-800 rounded-md text-sm p-1 text-blue-200 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-blue-300">ページ:</span>
        <nav
          className="relative z-0 inline-flex rounded-md -space-x-px"
          aria-label="Pagination"
        >
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-3 py-2 border border-blue-800 bg-black text-sm font-medium ${
              currentPage === 1
                ? 'text-blue-500/50 cursor-not-allowed'
                : 'text-blue-300 hover:bg-blue-900/30 transition-colors duration-200'
            }`}
          >
            前へ
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Logic to show pages around current page
            let pageNum = i + 1;
            if (totalPages > 5) {
              if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`relative inline-flex items-center px-3 py-2 border border-blue-800 ${
                  currentPage === pageNum
                    ? 'bg-blue-700 text-white'
                    : 'bg-black text-blue-300 hover:bg-blue-900/30'
                } text-sm font-medium transition-colors duration-200`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center px-3 py-2 border border-blue-800 bg-black text-sm font-medium ${
              currentPage === totalPages
                ? 'text-blue-500/50 cursor-not-allowed'
                : 'text-blue-300 hover:bg-blue-900/30 transition-colors duration-200'
            }`}
          >
            次へ
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
