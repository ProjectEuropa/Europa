import type React from 'react';

interface QuickFiltersProps {
  onFilterClick: (filter: string) => void;
}

const QuickFilters: React.FC<QuickFiltersProps> = ({ onFilterClick }) => {
  return (
    <div className="bg-gray-950 p-5 rounded shadow-lg mb-8 flex flex-wrap gap-3 transition-all duration-300 border border-blue-900/30">
      <span className="text-blue-300 font-medium">クイック検索:</span>
      <button
        onClick={() => onFilterClick('大会ゲスト許可')}
        className="bg-blue-900/30 px-4 py-1.5 rounded-full text-sm hover:bg-blue-900/60 text-blue-300 transition-colors duration-200 border border-blue-800/50"
      >
        大会ゲスト許可
      </button>
      <button
        onClick={() => onFilterClick('フリーOKE')}
        className="bg-blue-900/30 px-4 py-1.5 rounded-full text-sm hover:bg-blue-900/60 text-blue-300 transition-colors duration-200 border border-blue-800/50"
      >
        フリーOKE
      </button>
      <button
        onClick={() => onFilterClick('アラクネー')}
        className="bg-blue-900/30 px-4 py-1.5 rounded-full text-sm hover:bg-blue-900/60 text-blue-300 transition-colors duration-200 border border-blue-800/50"
      >
        アラクネー
      </button>
    </div>
  );
};

export default QuickFilters;
