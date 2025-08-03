'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/store';
import HistoryCard from './Instrument-history-list-components/HistoryCard';
import { Star } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

export default function InstrumentHistoryList() {
  const { isLeftCollapsed, searchTerm, selectedInstrument } = useStore();
  const instrument_history = useUserStore().user?.instrument_history || [];
  const [activeTab, setActiveTab] = useState('history');

  const filteredData = () => {
    let filtered = instrument_history;
    
    if ( searchTerm.trim() !== '') {
      filtered = filtered.filter(item =>
        item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.filter(item => {
      if (activeTab === 'history') return true;
      else return item.isFavorite;
    });
  };

  return (
    <div className="h-full w-full overflow-hidden flex flex-col text-sidebar-foreground bg-sidebar">
      {/* Tabs */}
      {!isLeftCollapsed ? (
        <div className="flex border-b border-sidebar-border">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'history'
                ? 'bg-sidebar-accent text-sidebar-foreground border-sidebar-primary'
                : 'text-sidebar-accent-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent border-transparent'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('favorite')}
            className={`flex-1 py-2 px-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'favorite'
                ? 'bg-sidebar-accent text-sidebar-foreground border-sidebar-primary'
                : 'text-sidebar-accent-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent border-transparent'
            }`}
          >
            Favorites
          </button>
        </div>
      ) : (
        <div className="flex justify-center border-b border-sidebar-border min-h-10">
          <button
            onClick={() => setActiveTab(activeTab => (`${activeTab === 'favorite' ? 'history' : 'favorite'}`))}
            className="p-0.8 my-4 hover:bg-sidebar-accent rounded-lg transition-colors"
            aria-label="Toggle Collapse"
          >
            <Star size={16} className={`${activeTab === 'favorite' ? 'text-sidebar-primary' : 'text-sidebar-foreground'}`} />
          </button>
        </div>
      )}

      {/* Instruments List */}
      <div className={`flex-1 h-full overflow-y-auto px-1 ${isLeftCollapsed ? 'pt-1' : ''}`}>
        <ul>
          {filteredData().map((item, i) => (
            <li
              key={i}
              className={`border-sidebar-border ${selectedInstrument?.symbol === item.symbol ? 'bg-sidebar-accent rounded-md' : ''}`}
            >
              <HistoryCard instrument={item} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}