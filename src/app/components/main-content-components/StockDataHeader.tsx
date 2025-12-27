'use client';

import React from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Clock } from 'lucide-react';
import { CombinedData } from '@/types/types';

interface HeaderProps {
  data: CombinedData | null;
  isShrunk: boolean;
  onRefresh: () => void;
  isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({ data, isShrunk, onRefresh, isLoading }) => {
  
  // 1. Extract the string safely once
  const percentChangeStr = data?.overview?.percent_change || '';

  // 2. Logic Fix: Check if it is negative. 
  // If it does NOT start with '-', we assume it's positive (covers "5.2%", "+5.2%", "0.0%")
  const isPositiveChange = !percentChangeStr.startsWith('-');

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <header
      className={`bg-[var(--color-card)] text-[var(--color-chart-5)] transition-all duration-200 ease-in-out ${
        isShrunk ? 'h-14 py-1' : 'h-20 py-4'
      } border-b border-[var(--color-border)] shadow-md`}
    >
      <div className="max-w-[90%] mx-auto px-4 sm:px-4 lg:px-6 flex items-center justify-between h-full transition-all duration-200">
        
        {/* LEFT SECTION: Ticker & Name */}
        <div className="flex items-center space-x-3">
          <div>
            <h1 className={`font-bold ${isShrunk ? 'text-base' : 'text-2xl'} transition-all duration-200`}>
              {data?.ticker || 'N/A'}
            </h1>
            <p className={`text-[var(--color-muted-foreground)] ${isShrunk ? 'text-[0.65rem]' : 'text-sm'} transition-all duration-200`}>
              {`${data?.ticker} Inc.`} {/* Fallback/Placeholder */}
            </p>
          </div>
        </div>

        {/* RIGHT SECTION: Price, Stats & Actions */}
        <div className="flex items-center space-x-6 text-[var(--color-muted-foreground)]">
          
          {/* Price & Change */}
          <div className="flex items-center hidden sm:flex">
            <span className={`font-semibold ${isShrunk ? 'text-sm' : 'text-lg'} transition-all duration-200 text-foreground`}>
              {data?.overview?.current_price ? formatCurrency(data.overview.current_price) : 'N/A'}
            </span>
            
            <div className="flex items-center ml-2">
              {/* Color Logic: Uses isPositiveChange boolean */}
              <span className={`text-xs ${isPositiveChange ? 'text-[#50ff7a]' : 'text-red-500'}`}>
                {percentChangeStr || 'N/A'}
              </span>

              {/* Icon Logic: Uses isPositiveChange boolean */}
              {isPositiveChange ? (
                <TrendingUp className={`ml-1 ${isShrunk ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-[#50ff7a]`} />
              ) : (
                <TrendingDown className={`ml-1 ${isShrunk ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-red-500`} />
              )}
            </div>
          </div>

          {/* Market Cap */}
          <div className="text-right hidden md:block">
            <span className={`block text-[var(--color-muted-foreground)] ${isShrunk ? 'text-[0.6rem]' : 'text-xs'}`}>
              Market Cap
            </span>
            <p className={`font-medium text-foreground ${isShrunk ? 'text-xs' : 'text-sm'}`}>
              {data?.overview?.market_cap || 'N/A'}
            </p>
          </div>

          {/* Last Updated */}
          <div className="text-right hidden lg:block">
            <span className={`block text-[var(--color-muted-foreground)] ${isShrunk ? 'text-[0.6rem]' : 'text-xs'}`}>
              Last Updated
            </span>
            <div className="flex items-center justify-end gap-1">
              <Clock className="w-3 h-3 text-[var(--color-muted-foreground)]" />
              <p className={`font-medium text-foreground ${isShrunk ? 'text-xs' : 'text-sm'}`}>
                {formatDate(data?.last_updated)}
              </p>
            </div>
          </div>

          {/* Refresh Button */}
          <button 
            onClick={onRefresh}
            disabled={isLoading}
            className={`
              flex items-center justify-center p-2 rounded-full
              bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 
              text-[var(--color-secondary-foreground)] transition-all
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              ${isShrunk ? 'w-8 h-8' : 'w-10 h-10'}
            `}
            title="Force Refresh Data"
          >
            <RefreshCw className={`${isShrunk ? 'w-4 h-4' : 'w-5 h-5'} ${isLoading ? 'animate-spin' : ''}`} />
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header;