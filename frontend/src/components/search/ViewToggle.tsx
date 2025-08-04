import type React from 'react';

interface ViewToggleProps {
  viewMode: 'table' | 'card';
  toggleViewMode: () => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  toggleViewMode,
}) => {
  return (
    <div className="mt-12 bg-black p-6 rounded shadow-lg border border-blue-900/30 transition-all duration-300 hover:border-blue-700/50 group">
      <div className="flex items-start mb-4">
        <div className="mr-4 text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-blue-300 mb-2">
            表示形式を切り替える
          </h3>
          <p className="text-blue-100 text-sm mb-4">
            スマートフォンでの表示に最適化されたカード表示も利用できます。
          </p>
          <div className="flex justify-center items-center space-x-4">
            <span
              className={`font-medium transition-colors duration-200 ${viewMode === 'table' ? 'text-blue-300' : 'text-blue-500/50'}`}
            >
              テーブル表示
            </span>
            <div
              onClick={toggleViewMode}
              className="w-16 h-6 bg-gray-900 rounded-full p-1 cursor-pointer transition-all duration-300 ease-in-out"
            >
              <div
                className={`bg-blue-500 w-6 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${viewMode === 'card' ? 'translate-x-8' : ''}`}
              ></div>
            </div>
            <span
              className={`font-medium transition-colors duration-200 ${viewMode === 'card' ? 'text-blue-300' : 'text-blue-500/50'}`}
            >
              カード表示
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewToggle;
