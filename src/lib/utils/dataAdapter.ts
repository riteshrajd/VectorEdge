// utils/dataAdapter.ts
import { Instrument, Stock } from '../../types';
import newData from '../data/newData.json'; // Your JSON data


export const transformData = (): Stock[] => {
  return Object.entries(newData.instruments).map(([symbolKey, instrument]) => ({
    symbol: symbolKey,
    name: instrument.overview.name,
    price: instrument.overview.current_price,
    change: parseFloat(instrument.overview.change), // Convert "+156.25" → 156.25
    changePercent: parseFloat(instrument.overview.change_percent), // "+0.72%" → 0.72
    volume: instrument.overview.volume.toString(),
    marketCap: instrument.overview.market_cap || "N/A",
    sector: instrument.overview.sector,
    color: getColorBySector(instrument.overview.sector), // Implement this
    high: instrument.overview.day_high,
    low: instrument.overview.day_low,
    open: 0, // Not in new data
    previousClose: 0, // Not in new data
    pe: 0,
    eps: 0,
    dividend: 0,
    lastUpdated: new Date().toISOString() // Or use instrument.overview.last_updated
  }));
};

// Helper to assign colors by sector (like before)
const getColorBySector = (sector: string): string => {
  const colors: Record<string, string> = {
    'Index': '#3b82f6',
    'Banking': '#ef4444',
    // Add other sectors...
  };
  return colors[sector] || '#6b7280';
};