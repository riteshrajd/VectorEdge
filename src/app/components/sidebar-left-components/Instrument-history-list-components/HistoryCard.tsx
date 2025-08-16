import React, { useCallback } from 'react';
import { InstrumentCoverInfo } from '@/types/types';
import { Activity, BarChart3, Building2, DollarSign, Fuel, Globe, Landmark, PieChart, TrendingUp, Star } from 'lucide-react';
import { useStore } from '@/store/store';
import { TOGGLE_FAVORITE_API_ROUTE } from '@/constants/constants';
import { useUserStore } from '@/store/userStore';

export default function HistoryCard({ instrument }: { instrument: InstrumentCoverInfo }) {
  const { setSelectedInstrument, isLeftCollapsed } = useStore();

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

  const changeFavoriteLocally = () => {
    const user = useUserStore.getState().user;
    if(user?.instrument_history) {
      const updatedInstruments = user.instrument_history.map(item =>
        (item.symbol !== instrument.symbol ? item : { ...item, isFavorite: !item.isFavorite })
      );
      const updatedUser = { ...user, instrument_history: updatedInstruments };
      useUserStore.getState().setUser(updatedUser);
    }
  }

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`handlefavorite called`);
    changeFavoriteLocally();
    try {
      const response = await fetch(`${TOGGLE_FAVORITE_API_ROUTE}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: instrument.symbol,
        }),
      });      
      if(response.ok) {
        console.log('Successfully toggled favorite status')
      } else {
        throw new Error("Failed to toggle favorite status");
      }
    } catch (error) {
      console.log(`Error in toggling favorite status: ${error}`)
      changeFavoriteLocally();
    }
  };

  return (
    <div
      onClick={() => setSelectedInstrument(instrument)}
      className={`flex items-center py-1 ${!isLeftCollapsed ? 'pl-1 pr-2' : ''} hover:rounded-md hover:bg-sidebar-accent cursor-pointer border-b border-sidebar-border transition-colors group duration-200`}
    >
      {/* Icon */}
      <div
        className={`${isLeftCollapsed ? 'mx-auto' : 'mr-2'} flex items-center justify-center ${color} rounded-full h-8 w-8`}
      >
        <Icon size={16} className="text-white" />
      </div>
 
      {!isLeftCollapsed && (
        <>
          {/* Symbol and Name */}
          <div className="flex-1 min-w-0 w-40">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm truncate">{instrument.symbol}</span>
            </div>
            <p className="text-xs text-sidebar-accent-foreground truncate leading-tight">{instrument.name}</p>
          </div>

          <button
            onClick={handleFavoriteClick}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={instrument.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star
              size={10}
              className={instrument.isFavorite ? 'fill-sidebar-primary text-sidebar-primary' : 'text-sidebar-accent-foreground'}
            />
          </button>

          {/* Recommendation */}
          <div className="text-right ml-1 w-16 flex flex-col">
            <p className="text-xs text-sidebar-accent-foreground">Result</p>
            {instrument.recomendation && (
              <span
                className={`text-xs font-medium font-mono opacity-90 ${
                  instrument.recomendation.toLowerCase() === 'buy'
                    ? 'text-chart-2'
                    : instrument.recomendation.toLowerCase() === 'sell'
                    ? 'text-destructive'
                    : 'text-sidebar-foreground'
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