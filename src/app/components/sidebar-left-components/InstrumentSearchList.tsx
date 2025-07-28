import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/store';
import { Star } from 'lucide-react';
import { TickerInfo } from '@/types/types';
import { SEARCH_TICK_API_ROUTE } from '@/constants/constants';
import SearchResultCard from './instrument-search-list-component/SearchResultCard';

export default function InstrumentSearchList() {
  const { isLeftCollapsed, searchTerm } = useStore();
  const [activeTab, setActiveTab] = useState('global');
  const [searchResult, setSearchResult] = useState<TickerInfo[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const debouncedSearchTimer = setTimeout(() => {
      const inputTerm = searchTerm.trim();
      if (inputTerm) {
        searchTicker(inputTerm);
      } else {
        setSearchResult([]);
      }
    }, 500);

    return () => clearTimeout(debouncedSearchTimer);
  }, [searchTerm]);

  const searchTicker = async (ticker: string, limit: number = 5) => {
    try {
      setError('');
      setLoading(true);
      const response = await fetch(`${SEARCH_TICK_API_ROUTE}?ticker=${ticker.toUpperCase()}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const result: TickerInfo[] = await response.json();
      setSearchResult(result);
    } catch (error) {
      console.error('Error searching for ticker:', error);
      setSearchResult([]);
      setError(`Failed to load suggestions. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (error && !isLeftCollapsed) {
    return (
      <div>
        {error}
      </div>
    )
  }
  if (loading && !isLeftCollapsed) {
    return (
      <div>
        loading data...
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-hidden flex flex-col text-white bg-[var(--bg-primary)]"> 
      {/* Tabs */}
      {!isLeftCollapsed ? (
        <div className="flex border-b border-[var(--border)]">
          <button
            onClick={() => handleTabChange('global')}
            className={`flex-1 py-2 px-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'global'
                ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--accent-main)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] border-transparent'
            }`}
          >
            Global
          </button>
          <button
            onClick={() => handleTabChange('history')}
            className={`flex-1 py-2 px-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'history'
                ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--accent-main)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] border-transparent'
            }`}
          >
            History
          </button>
        </div>
      ) : (
        <div className="flex justify-center border-b border-[var(--border)] min-h-10">
          <button
            onClick={() => handleTabChange(`${activeTab==='history' ? 'global' : 'history'}`)}
            className={`p-0.8 my-4 hover:bg-[var(--bg-hover)] rounded-lg transition-colors  `}
            aria-label="Toggle Collapse"
          >
            <Star size={16} className={`${activeTab === 'history' ? 'text-[var(--star-fill)]' : 'text-[var(--text-primary)]' }`} />
          </button>
        </div>
      )}

      {/* Instruments List */}
      <div className={`flex-1 h-full overflow-y-auto px-1 ${isLeftCollapsed ? 'pt-1' : ' '}`}>
        <ul>
          {searchResult.map((item, i) => (
            <li key={i} className={`border-[var(--border)]`}>
              <SearchResultCard instrument={item} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}