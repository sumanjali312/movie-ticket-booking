import React from 'react';
import { useLocation } from 'react-router-dom';

const SearchResults = () => {
  const query = new URLSearchParams(useLocation().search).get('q');

  return (
    <div className="text-white p-4 min-h-screen bg-black">
      <h2 className="text-xl md:text-2xl lg:text-3xl mb-4 font-semibold">
        Search Results for: "<span className="text-yellow-400">{query}</span>"
      </h2>

      {/* Responsive grid for results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* TODO: Replace with filtered movie cards */}
        <div className="bg-gray-800 rounded-lg p-4 h-40">Movie 1</div>
        <div className="bg-gray-800 rounded-lg p-4 h-40">Movie 2</div>
        <div className="bg-gray-800 rounded-lg p-4 h-40">Movie 3</div>
        <div className="bg-gray-800 rounded-lg p-4 h-40">Movie 4</div>
        {/* ... */}
      </div>
    </div>
  );
};

export default SearchResults;
