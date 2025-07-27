'use client';

import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { CombinedData } from '@/types/types';

interface HeaderProps {
  data: CombinedData | null;
  isShrunk: boolean;
}

const Header: React.FC<HeaderProps> = ({ data, isShrunk }) => {
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  };

  const getPercentChangeColor = (percentChange: string) => {
    return percentChange.startsWith('+') ? 'text-[#50ff7a]' : 'text-red-500';
  };

  return (
    <header
      className={`bg-[var(--bg-card-primary)] text-[var(--text-primary)] transition-all duration-200 ease-in-out ${
        isShrunk ? 'h-14 py-1' : 'h-20 py-4'
      } border-b border-[var(--border)] shadow-md`}
    >
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-4 lg:px-6 flex items-center justify-between transition-all duration-200`}
      >
        <div className="flex items-center space-x-3">
          <div>
            <h1
              className={`font-bold ${
                isShrunk ? 'text-base' : 'text-2xl'
              } transition-all duration-200`}
            >
              {data?.ticker || 'N/A'}
            </h1>
            <p
              className={`text-[var(--text-secondary)] ${
                isShrunk ? 'text-[0.65rem]' : 'text-sm'
              } transition-all duration-200`}
            >
              {'Apple Inc.'} {/* Fallback as company_name not provided */}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <DollarSign
              className={`text-[var(--accent-main)] ${
                isShrunk ? 'w-3.5 h-3.5' : 'w-5 h-5'
              } mr-1 transition-all duration-200`}
            />
            <span
              className={`font-semibold ${
                isShrunk ? 'text-sm' : 'text-lg'
              } transition-all duration-200`}
            >
              {data?.overview?.current_price
                ? formatCurrency(data.overview.current_price)
                : 'N/A'}
            </span>
            <span
              className={`ml-1.5 text-xs ${getPercentChangeColor(
                data?.overview?.percent_change || ''
              )} transition-all duration-200`}
            >
              {data?.overview?.percent_change || 'N/A'}
            </span>
            {data?.overview?.percent_change?.startsWith('+') ? (
              <TrendingUp
                className={`ml-1 ${
                  isShrunk ? 'w-3.5 h-3.5' : 'w-5 h-5'
                } text-[#50ff7a] transition-all duration-200`}
              />
            ) : (
              <TrendingDown
                className={`ml-1 ${
                  isShrunk ? 'w-3.5 h-3.5' : 'w-5 h-5'
                } text-red-500 transition-all duration-200`}
              />
            )}
          </div>
          <div>
            <span
              className={`text-[var(--text-secondary)] ${
                isShrunk ? 'text-xs' : 'text-sm'
              } transition-all duration-200`}
            >
              Market Cap
            </span>
            <p
              className={`font-medium ${
                isShrunk ? 'text-xs' : 'text-base'
              } transition-all duration-200`}
            >
              {data?.overview?.market_cap || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;