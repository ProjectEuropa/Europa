import React from 'react';

interface SearchHeaderProps {
  title: string;
  subtitle: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  title,
  subtitle,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <div className="bg-[#020824] text-white py-4">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-1 text-white">
          {title}
        </h1>

        <p className="text-sm mb-4 text-gray-300">
          {subtitle}
        </p>

        {/* Search Section */}
        <div className="max-w-full">
          <input
            type="text"
            placeholder="Solo"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1 bg-[#0A0A20] border border-[#333] text-white placeholder-gray-500 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
