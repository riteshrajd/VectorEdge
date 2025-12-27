import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/store';
import { TickerInfo } from '@/types/types';
import { SEARCH_TICK_API_ROUTE } from '@/constants/constants';
import SearchResultCard from './instrument-search-list-component/SearchResultCard';
import { Spinner } from './instrument-search-list-component/Spinner'

export default function InstrumentSearchList() {
  const { isLeftCollapsed, searchTerm } = useStore();
  const [searchResult, setSearchResult] = useState<TickerInfo[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const debouncedSearchTimer = setTimeout(() => {
      const inputTerm = searchTerm.trim();
      if (inputTerm) {
        searchTicker(inputTerm);
      } else {
        setSearchResult([]);
      }
    }, 1000);

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
      <div className="p-4 text-sm text-destructive">
        {error}
      </div>
    )
  }
  if (loading && !isLeftCollapsed) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-sm text-sidebar-foreground">
        <Spinner className="mb-2 h-6 w-6" />
        loading data...
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-hidden flex flex-col text-sidebar-foreground bg-sidebar"> 
      {/* Instruments List */}
      <div className={`flex-1 h-full overflow-y-auto px-1 ${isLeftCollapsed ? 'pt-1' : ''}`}>
        <ul>
          {searchResult.map((item, i) => (
            <li key={i} className={`border-b border-sidebar-border`}>
              <SearchResultCard instrument={item} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}