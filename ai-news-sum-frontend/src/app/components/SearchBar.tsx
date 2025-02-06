import React, { useState } from 'react';
import { Loader2, Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (topic: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onSearch(topic.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic to analyze news (e.g., 'AI advancements')"
          className="w-full px-4 py-3 pl-12 pr-16 text-gray-900 placeholder-gray-500
           bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
           disabled={isLoading}
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Searching...</span>
            </div>
          ) : (
            'Search'
          )}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;