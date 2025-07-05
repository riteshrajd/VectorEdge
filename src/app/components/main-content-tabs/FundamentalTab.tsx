'use client';

import React from 'react';
import { 
  DollarSign, 
  BarChart, 
  Percent, 
  TrendingUp, 
  TrendingDown,
  Layers,
  PieChart,
  Factory,
  BookOpen,
  Calendar,
  Award,
  Target
} from 'lucide-react';
import { Instrument } from '../../types';
import { fundamentalData } from '../../data/expandedTradingData';

interface FundamentalTabProps {
  instrument: Instrument;
}

const FundamentalTab: React.FC<FundamentalTabProps> = ({ instrument }) => {
  const fundamental = fundamentalData[instrument.symbol] || null;
  
  const formatValue = (value: string | number) => {
    if (typeof value === 'string') return value;
    return value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Strong Buy': return 'text-green-400';
      case 'Buy': return 'text-green-300';
      case 'Hold': return 'text-yellow-400';
      case 'Sell': return 'text-orange-500';
      case 'Strong Sell': return 'text-red-500';
      default: return 'text-white';
    }
  };

  if (!fundamental) {
    return (
      <div className="bg-[var(--bg-tertiary)] rounded-lg p-6 text-center">
        <p className="text-zinc-400">Fundamental data not available for {instrument.name}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Valuation Metrics */}
      <div className="bg-[var(--bg-tertiary)] rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
          <BarChart className="w-5 h-5 mr-2 text-blue-400" />
          Valuation Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--bg-primary)] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400 text-sm">Market Cap</span>
              <DollarSign className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-lg font-semibold">{fundamental.marketCap}</div>
          </div>
          
          <div className="bg-[var(--bg-primary)] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400 text-sm">P/E Ratio</span>
              <Percent className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-lg font-semibold">{fundamental.peRatio}</div>
          </div>
          
          <div className="bg-[var(--bg-primary)] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400 text-sm">PEG Ratio</span>
              <TrendingUp className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-lg font-semibold">{fundamental.pegRatio}</div>
          </div>
          
          <div className="bg-[var(--bg-primary)] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400 text-sm">P/B Ratio</span>
              <BookOpen className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-lg font-semibold">{fundamental.pbRatio}</div>
          </div>
        </div>
      </div>

      {/* Financial Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profitability */}
        <div className="bg-[var(--bg-tertiary)] rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
            Profitability
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <span className="text-zinc-400">ROE</span>
              <span className="font-medium">{fundamental.roe}%</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <span className="text-zinc-400">ROA</span>
              <span className="font-medium">{fundamental.roa}%</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <span className="text-zinc-400">Gross Margin</span>
              <span className="font-medium">{fundamental.grossMargin}%</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <span className="text-zinc-400">Operating Margin</span>
              <span className="font-medium">{fundamental.operatingMargin}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Net Margin</span>
              <span className="font-medium">{fundamental.netMargin}%</span>
            </div>
          </div>
        </div>

        {/* Financial Strength */}
        <div className="bg-[var(--bg-tertiary)] rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
            <Layers className="w-5 h-5 mr-2 text-blue-400" />
            Financial Strength
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <span className="text-zinc-400">Debt to Equity</span>
              <span className="font-medium">{fundamental.debtToEquity}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <span className="text-zinc-400">Current Ratio</span>
              <span className="font-medium">{fundamental.currentRatio}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <span className="text-zinc-400">Quick Ratio</span>
              <span className="font-medium">{fundamental.quickRatio}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <span className="text-zinc-400">Interest Coverage</span>
              <span className="font-medium">8.2x</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Cash Flow (OCF)</span>
              <span className="font-medium">₹15,240 Cr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Growth & Dividends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Metrics */}
        <div className="bg-[var(--bg-tertiary)] rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
            Growth Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <span className="text-zinc-400">Revenue Growth (YoY)</span>
              <span className="font-medium text-green-400">+{fundamental.revenueGrowth}%</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <span className="text-zinc-400">EPS Growth (YoY)</span>
              <span className="font-medium text-green-400">+{fundamental.earningsGrowth}%</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <span className="text-zinc-400">EBITDA Growth</span>
              <span className="font-medium text-green-400">+18.3%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">FCF Growth</span>
              <span className="font-medium text-green-400">+22.7%</span>
            </div>
          </div>
        </div>

        {/* Dividends & Yield */}
        <div className="bg-[var(--bg-tertiary)] rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-yellow-400" />
            Dividends & Yield
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <span className="text-zinc-400">Dividend Yield</span>
              <span className="font-medium">{fundamental.dividendYield}%</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <span className="text-zinc-400">Payout Ratio</span>
              <span className="font-medium">{fundamental.payoutRatio}%</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <span className="text-zinc-400">Dividend Growth</span>
              <span className="font-medium text-green-400">+12.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Next Ex-Date</span>
              <span className="font-medium">15 Sep 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analyst Ratings */}
      <div className="bg-[var(--bg-tertiary)] rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
          <Award className="w-5 h-5 mr-2 text-purple-400" />
          Analyst Ratings & Targets
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-zinc-400 text-sm">Consensus Rating</span>
                <div className={`text-xl font-semibold mt-1 ${getRatingColor(fundamental.analystRating)}`}>
                  {fundamental.analystRating}
                </div>
              </div>
              <div className="text-right">
                <span className="text-zinc-400 text-sm">Analysts</span>
                <div className="text-xl font-semibold mt-1">{fundamental.analystCount}</div>
              </div>
            </div>
            
            <div className="bg-[var(--bg-primary)] rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-zinc-400">Target Price</span>
                <Target className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="text-2xl font-bold text-green-400">
                ₹{fundamental.targetPrice.toLocaleString('en-IN')}
              </div>
              <div className="mt-1 text-sm text-zinc-400">
                {((fundamental.targetPrice / instrument.price - 1) * 100).toFixed(2)}% Upside
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--bg-primary)] rounded-lg p-4">
            <h4 className="font-medium mb-3">Rating Distribution</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-20 text-zinc-400 text-sm">Strong Buy</div>
                <div className="flex-1 bg-zinc-700 rounded h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded" 
                    style={{ width: '62%' }}
                  ></div>
                </div>
                <div className="w-10 text-right text-sm">62%</div>
              </div>
              <div className="flex items-center">
                <div className="w-20 text-zinc-400 text-sm">Buy</div>
                <div className="flex-1 bg-zinc-700 rounded h-2.5">
                  <div 
                    className="bg-green-400 h-2.5 rounded" 
                    style={{ width: '22%' }}
                  ></div>
                </div>
                <div className="w-10 text-right text-sm">22%</div>
              </div>
              <div className="flex items-center">
                <div className="w-20 text-zinc-400 text-sm">Hold</div>
                <div className="flex-1 bg-zinc-700 rounded h-2.5">
                  <div 
                    className="bg-yellow-500 h-2.5 rounded" 
                    style={{ width: '10%' }}
                  ></div>
                </div>
                <div className="w-10 text-right text-sm">10%</div>
              </div>
              <div className="flex items-center">
                <div className="w-20 text-zinc-400 text-sm">Sell</div>
                <div className="flex-1 bg-zinc-700 rounded h-2.5">
                  <div 
                    className="bg-orange-500 h-2.5 rounded" 
                    style={{ width: '4%' }}
                  ></div>
                </div>
                <div className="w-10 text-right text-sm">4%</div>
              </div>
              <div className="flex items-center">
                <div className="w-20 text-zinc-400 text-sm">Strong Sell</div>
                <div className="flex-1 bg-zinc-700 rounded h-2.5">
                  <div 
                    className="bg-red-500 h-2.5 rounded" 
                    style={{ width: '2%' }}
                  ></div>
                </div>
                <div className="w-10 text-right text-sm">2%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Statements */}
      <div className="bg-[var(--bg-tertiary)] rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
          Financial Statements (Last Fiscal Year)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-zinc-400">
            <thead className="text-xs uppercase bg-[var(--bg-primary)] text-zinc-400">
              <tr>
                <th className="px-4 py-3">Metric</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">YoY Change</th>
                <th className="px-4 py-3">Industry Avg</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-800">
                <td className="px-4 py-3 font-medium text-white">Revenue</td>
                <td className="px-4 py-3">{fundamental.revenue}</td>
                <td className="px-4 py-3 text-green-400">+{fundamental.revenueGrowth}%</td>
                <td className="px-4 py-3">₹6,54,320 Cr</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="px-4 py-3 font-medium text-white">Net Income</td>
                <td className="px-4 py-3">{fundamental.earnings}</td>
                <td className="px-4 py-3 text-green-400">+{fundamental.earningsGrowth}%</td>
                <td className="px-4 py-3">₹38,450 Cr</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="px-4 py-3 font-medium text-white">Operating Cash Flow</td>
                <td className="px-4 py-3">₹72,850 Cr</td>
                <td className="px-4 py-3 text-green-400">+18.3%</td>
                <td className="px-4 py-3">₹58,230 Cr</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="px-4 py-3 font-medium text-white">Total Assets</td>
                <td className="px-4 py-3">₹12,45,600 Cr</td>
                <td className="px-4 py-3 text-green-400">+15.7%</td>
                <td className="px-4 py-3">₹9,87,450 Cr</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-white">Total Debt</td>
                <td className="px-4 py-3">₹2,15,400 Cr</td>
                <td className="px-4 py-3 text-red-400">+8.2%</td>
                <td className="px-4 py-3">₹2,45,800 Cr</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FundamentalTab;