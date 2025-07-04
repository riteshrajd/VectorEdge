'use client';

import React, { useState } from 'react';
import { 
  DollarSign,
  Clock,
  Building2, 
  Volume2,
  Maximize2,
} from 'lucide-react';
import { Instrument } from '../../types';
import { generateChartData, ChartData } from '../../data/expandedTradingData';

interface OverviewTabProps {
  instrument: Instrument;
}

const TechnicalTab: React.FC<OverviewTabProps> = ({ instrument }) => {
  const [chartPeriod, setChartPeriod] = useState('1D');
  const [chartData] = useState<ChartData[]>(() => generateChartData(instrument.symbol));

  const formatPrice = (price: number) => {
    return instrument.symbol.includes('USD') || instrument.symbol.includes('SPX') 
      ? `$${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
      : `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const chartPeriods = ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'];
  
  // Get recent chart data based on period
  const getChartDataForPeriod = (period: string) => {
    const days = {
      '1D': 1,
      '1W': 7,
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365,
      'ALL': chartData.length
    }[period] || 30;
    
    return chartData.slice(-days);
  };

  const displayData = getChartDataForPeriod(chartPeriod);
  const maxPrice = Math.max(...displayData.map(d => d.high));
  const minPrice = Math.min(...displayData.map(d => d.low));
  const priceRange = maxPrice - minPrice;

  return (
    <div className="space-y-6">
      {/* Chart Section */}
      <div className="bg-zinc-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Price Chart</h3>
          <div className="flex items-center space-x-2">
            {chartPeriods.map((period) => (
              <button
                key={period}
                onClick={() => setChartPeriod(period)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  chartPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                }`}
              >
                {period}
              </button>
            ))}
            <button className="p-1 hover:bg-zinc-700 rounded">
              <Maximize2 className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </div>
        
        {/* Chart Visualization */}
        <div className="h-80 relative bg-zinc-950 rounded p-4">
          <div className="flex items-end justify-between h-full space-x-0.5">
            {displayData.map((point, index) => {
              const isGreen = point.close >= point.open;
              const bodyHeight = Math.abs(point.close - point.open) / priceRange * 100;
              const bodyBottom = ((Math.min(point.close, point.open) - minPrice) / priceRange) * 100;
              const wickTop = ((point.high - minPrice) / priceRange) * 100;
              const wickBottom = ((point.low - minPrice) / priceRange) * 100;
              
              return (
                <div key={index} className="relative flex-1 min-w-0 group">
                  {/* Wick */}
                  <div 
                    className={`absolute w-0.5 left-1/2 transform -translate-x-1/2 ${
                      isGreen ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{
                      bottom: `${wickBottom}%`,
                      height: `${wickTop - wickBottom}%`
                    }}
                  />
                  {/* Body */}
                  <div 
                    className={`absolute w-full left-0 ${
                      isGreen ? 'bg-green-500' : 'bg-red-500'
                    } opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}
                    style={{
                      bottom: `${bodyBottom}%`,
                      height: `${Math.max(bodyHeight, 1)}%`
                    }}
                    title={`Open: ${formatPrice(point.open)}, Close: ${formatPrice(point.close)}, High: ${formatPrice(point.high)}, Low: ${formatPrice(point.low)}`}
                  />
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                    <div className="bg-zinc-800 text-white text-xs rounded p-2 whitespace-nowrap border border-zinc-700">
                      <div>O: {formatPrice(point.open)}</div>
                      <div>H: {formatPrice(point.high)}</div>
                      <div>L: {formatPrice(point.low)}</div>
                      <div>C: {formatPrice(point.close)}</div>
                      <div>V: {(point.volume / 1000000).toFixed(1)}M</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Price Scale */}
          <div className="absolute right-0 top-0 h-full flex flex-col justify-between text-xs text-zinc-400">
            <span>{formatPrice(maxPrice)}</span>
            <span>{formatPrice((maxPrice + minPrice) / 2)}</span>
            <span>{formatPrice(minPrice)}</span>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-zinc-400 text-sm">Open</div>
              <div className="text-xl font-semibold">
                {formatPrice(instrument.open)}
              </div>
            </div>
            <DollarSign className="w-6 h-6 text-zinc-400" />
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-zinc-400 text-sm">Previous Close</div>
              <div className="text-xl font-semibold">
                {formatPrice(instrument.previousClose)}
              </div>
            </div>
            <Clock className="w-6 h-6 text-zinc-400" />
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-zinc-400 text-sm">Volume</div>
              <div className="text-xl font-semibold">{instrument.volume}</div>
            </div>
            <Volume2 className="w-6 h-6 text-zinc-400" />
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-zinc-400 text-sm">Market Cap</div>
              <div className="text-xl font-semibold">{instrument.marketCap}</div>
            </div>
            <Building2 className="w-6 h-6 text-zinc-400" />
          </div>
        </div>
      </div>

      {/* Additional Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Metrics */}
        <div className="bg-zinc-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Key Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">High (52W)</span>
              <span className="font-medium">{formatPrice(instrument.high * 1.15)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Low (52W)</span>
              <span className="font-medium">{formatPrice(instrument.low * 0.85)}</span>
            </div>
            {instrument.pe > 0 && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">P/E Ratio</span>
                  <span className="font-medium">{instrument.pe.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">EPS</span>
                  <span className="font-medium">₹{instrument.eps.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Dividend Yield</span>
                  <span className="font-medium">{instrument.dividend.toFixed(2)}%</span>
                </div>
              </>
            )}
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Sector</span>
              <span className="font-medium">{instrument.sector}</span>
            </div>
          </div>
        </div>

        {/* Market Summary */}
        <div className="bg-zinc-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Market Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">{`Today's`} Range</span>
              <span className="font-medium">
                {formatPrice(instrument.low)} - {formatPrice(instrument.high)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Average Volume</span>
              <span className="font-medium">{instrument.volume}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Market Status</span>
              <span className="text-green-400 font-medium">Open</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Last Updated</span>
              <span className="font-medium">
                {new Date().toLocaleTimeString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Performance */}
      <div className="bg-zinc-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Recent Performance</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-zinc-400 text-sm">1 Week</div>
            <div className={`text-lg font-semibold ${
              instrument.change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {instrument.change >= 0 ? '+' : ''}{(instrument.change * 1.2).toFixed(2)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-zinc-400 text-sm">1 Month</div>
            <div className={`text-lg font-semibold ${
              instrument.change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {instrument.change >= 0 ? '+' : ''}{(instrument.change * 2.5).toFixed(2)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-zinc-400 text-sm">1 Year</div>
            <div className={`text-lg font-semibold ${
              instrument.change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {instrument.change >= 0 ? '+' : ''}{(instrument.change * 8.2).toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalTab;