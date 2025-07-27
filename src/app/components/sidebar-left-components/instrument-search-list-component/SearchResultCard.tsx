import React, { useCallback } from 'react';
import { InstrumentCoverInfo } from '@/types/types';
import { Activity, BarChart3, Building2, DollarSign, Fuel, Globe, Landmark, PieChart, TrendingUp, Star } from 'lucide-react';
import { useStore } from '@/store/store';

export default function SearchResultCard({ instrument }: { instrument: InstrumentCoverInfo }) {
  const { setInstrumentHistoryList, instrumentHistoryList, setSelectedInstrument, isLeftCollapsed, setSearchTerm } = useStore();

  const getIconForSymbol = useCallback((instrument: InstrumentCoverInfo) => {
    const icons = [Activity, BarChart3, Building2, DollarSign, Fuel, Globe, Landmark, PieChart, TrendingUp];
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-emerald-500', 'bg-red-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500', 'bg-indigo-500'];

    // Generate a pseudo-random index based on instrument symbol for consistent icon/color per instrument
    const hash = instrument.symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const iconIndex = hash % icons.length;
    const colorIndex = hash % colors.length;

    return { Icon: icons[iconIndex], color: colors[colorIndex] };
  }, []);
        
  const { Icon, color } = getIconForSymbol(instrument);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedList = instrumentHistoryList.map(item =>
      item.symbol === instrument.symbol
        ? { ...item, isFavorite: !item.isFavorite }
        : item
    );  
    setInstrumentHistoryList(updatedList);
  };

  const handleInstrumentSelect = () => {
    if(instrument){
      setSelectedInstrument(instrument)
      const updatedList = [instrument, ...instrumentHistoryList];
      setInstrumentHistoryList(updatedList);
      setSearchTerm('');
      console.log(`added ${JSON.stringify(instrument)} in history`);
    }
  }


  return (
    <div
      onClick={handleInstrumentSelect}
      className={`flex items-center py-1 ${!isLeftCollapsed ? 'pl-1 pr-2' : ''} hover:bg-[var(--bg-hover)] cursor-pointer border-b border-[var(--border-secondary)] transition-colors group duration-200`}
    >
      {/* Icon */}
      <div
        className={`${isLeftCollapsed ? 'mx-auto' : 'mr-2'} flex items-center justify-center ${color} rounded-full h-8 w-8`}
      >
        <Icon size={16} className="text-[var(--text-primary)]" />
      </div>

      {!isLeftCollapsed && (
        <>
          {/* Symbol and Name */}
          <div className="flex-1 min-w-0 w-40">
            <div className="flex items-center justify-between">
              <span className={`font-medium text-sm truncate`}>{instrument.symbol}</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] truncate leading-tight">{instrument.name}</p>
          </div>

          <button
            onClick={handleFavoriteClick}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={instrument.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star
              size={10}
              className={instrument.isFavorite ? 'fill-[var(--star-fill)] text-[var(--star-fill)]' : 'text-[var(--text-muted)]'}
            />
          </button>

          {/* recomendation */}
          <div className="text-right ml-1 w-16 flex flex-col">
            <p className='text-xs text-[var(--text-muted)]'>Result</p>
            {instrument.recomendation && (
              <span
                className={`text-xs font-medium font-mono opacity-90 ${
                  instrument.recomendation.toLowerCase() === 'buy'
                    ? 'text-[var(--positive)]'
                    : instrument.recomendation.toLowerCase() === 'sell'
                    ? 'text-[var(--negative)]'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                {instrument.recomendation.toUpperCase()}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}