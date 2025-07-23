import React, { useState } from 'react';
import { useStore } from '@/store/store';
import HistoryCard from './Instrument-history-list-components/HistoryCard';
import { Star } from 'lucide-react';

export default function InstrumentHistoryList() {
  const { instrumentHistoryList, isLeftCollapsed, searchTerm } = useStore();
  const [activeTab, setActiveTab] = useState('history');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Filter instruments based on search term and active tab
  const filteredData = () => {
    let filtered = instrumentHistoryList;
    
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(item =>
        item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.filter(item => {
      if(activeTab==='history')
        return true;
      else
        return item.isFavorite;
    });
  };

  return (
    <div className="h-full w-full overflow-hidden flex flex-col text-white bg-[var(--bg-primary)]">
      {/* Tabs */}
      {!isLeftCollapsed ? (
        <div className="flex border-b border-[var(--border)]">
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
          <button
            onClick={() => handleTabChange('favorite')}
            className={`flex-1 py-2 px-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'favorite'
                ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--accent-main)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] border-transparent'
            }`}
          >
            Favorites
          </button>
        </div>
      ) : (
        <div className="flex justify-center border-b border-[var(--border)] min-h-10">
          <button
            onClick={() => handleTabChange(`${activeTab==='favorite' ? 'history' : 'favorite'}`)}
            className={`p-0.8 my-4 hover:bg-[var(--bg-hover)] rounded-lg transition-colors  `}
            aria-label="Toggle Collapse"
          >
            <Star size={16} className={`${activeTab === 'favorite' ? 'text-[var(--star-fill)]' : 'text-[var(--text-primary)]' }`} />
          </button>
        </div>
      )}

      {/* Instruments List */}
      <div className={`flex-1 h-full overflow-y-auto px-1 ${isLeftCollapsed ? 'pt-1' : ' '}`}>
        <ul>
          {filteredData().map((item, i) => (
            <li key={i} className={`border-[var(--border)]`}>
              <HistoryCard instrument={item} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}