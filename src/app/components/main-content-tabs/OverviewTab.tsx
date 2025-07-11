// components/main-content-tabs/OverviewTab.tsx
import React from "react";
import {
  DollarSign,
  Clock,
  Percent,
  Building2,
  Maximize2,
} from "lucide-react";
import { Instrument } from '@/types';

interface OverviewTabProps {
  instrument: Instrument;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ instrument }) => {
  // Mock chart data - in real app this would come from API
  const chartData = Array.from({ length: 50 }, (_, i) => ({
    time: i,
    price: (Math.random())*100,
  }));

  return (
    <div className="space-y-6">
      {/* Chart Placeholder */}
      <div className="bg-[var(--bg-tertiary)] rounded-lg p-6 pb-16 h-96">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Price Chart</h3>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
              1D
            </button>
            <button className="px-3 py-1 bg-void-700 text-void-300 rounded text-sm hover:bg-void-600">
              1W
            </button>
            <button className="px-3 py-1 bg-void-700 text-void-300 rounded text-sm hover:bg-void-600">
              1M
            </button>
            <button className="px-3 py-1 bg-void-700 text-void-300 rounded text-sm hover:bg-void-600">
              1Y
            </button>
            <button className="p-1 hover:bg-void-700 rounded">
              <Maximize2 className="w-4 h-4 text-void-400" />
            </button>
          </div>
        </div>

        {/* Simple chart visualization */}
        <div className="h-full flex items-end space-x-1">
          {chartData.map((point, index) => (
            <div
              key={index}
              className="bg-blue-500 w-2 opacity-70 hover:opacity-100 transition-opacity"
              style={{
                height: `${Math.max(
                  10,
                  (point.price) 
                )}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--bg-tertiary)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-void-400 text-sm">Open</div>
              <div className="text-xl font-semibold">
                {instrument.symbol.includes("USD") ||
                instrument.symbol.includes("SPX")
                  ? `$${instrument.open.toLocaleString()}`
                  : `₹${instrument.open.toLocaleString()}`}
              </div>
            </div>
            <DollarSign className="w-6 h-6 text-void-400" />
          </div>
        </div>

        <div className="bg-[var(--bg-tertiary)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-void-400 text-sm">Previous Close</div>
              <div className="text-xl font-semibold">
                {instrument.symbol.includes("USD") ||
                instrument.symbol.includes("SPX")
                  ? `$${instrument.previousClose.toLocaleString()}`
                  : `₹${instrument.previousClose.toLocaleString()}`}
              </div>
            </div>
            <Clock className="w-6 h-6 text-void-400" />
          </div>
        </div>

        {instrument.pe > 0 && (
          <div className="bg-[var(--bg-tertiary)] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-void-400 text-sm">P/E Ratio</div>
                <div className="text-xl font-semibold">
                  {instrument.pe.toFixed(1)}
                </div>
              </div>
              <Percent className="w-6 h-6 text-void-400" />
            </div>
          </div>
        )}

        <div className="bg-[var(--bg-tertiary)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-void-400 text-sm">Sector</div>
              <div className="text-xl font-semibold">{instrument.sector}</div>
            </div>
            <Building2 className="w-6 h-6 text-void-400" />
          </div>
        </div>
      </div>

      {/* Additional Info for Futures */}
      {"expiryDate" in instrument && (
        <div className="bg-[var(--bg-tertiary)] rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Futures Information</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-void-400 text-sm">Expiry Date</div>
              <div className="font-medium">{instrument.expiryDate}</div>
            </div>
            <div>
              <div className="text-void-400 text-sm">Contract Size</div>
              <div className="font-medium">{instrument.contractSize}</div>
            </div>
            <div>
              <div className="text-void-400 text-sm">Lot Size</div>
              <div className="font-medium">{instrument.lotSize}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewTab;