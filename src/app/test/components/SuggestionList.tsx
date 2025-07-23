import React from 'react';
import { TickerInfo } from '@/types/types';

interface SuggestionListProps {
  suggestions: TickerInfo[];
  onSuggestionClick: (symbol: string) => void;
}

const SuggestionList: React.FC<SuggestionListProps> = ({ suggestions, onSuggestionClick }) => {
  return (
    <div className="mb-6">
      <ul className="list-none p-0 max-h-60 overflow-y-auto border rounded">
        {suggestions.length > 0 ? (
          suggestions.map((item) => (
            <li
              key={item.symbol}
              className="p-3 border-b last:border-b-0 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSuggestionClick(item.symbol)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <strong>{item.name}</strong> ({item.symbol})
                </div>
                <div className="text-gray-600">{item.exchange}</div>
              </div>
            </li>
          ))
        ) : (
          <li className="p-3 text-gray-500">No suggestions found</li>
        )}
      </ul>
    </div>
  );
};

export default SuggestionList;