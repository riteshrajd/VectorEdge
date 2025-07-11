// types/index.ts - Type definitions for the trading platform

export interface BaseInstrument {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  sector: string;
  color: string;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  pe: number;
  eps: number;
  dividend: number;
  lastUpdated: string;
}

export interface Stock extends BaseInstrument {
  // Additional stock-specific properties can be added here
}

export interface Future extends BaseInstrument {
  expiryDate: string;
  contractSize: number;
  lotSize: number;
}

export type Instrument = Stock | Future;

export interface MarketStatus {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  timezone: string;
  lastUpdated: string;
  preMarketOpen: string;
  afterMarketClose: string;
}

export interface UserWatchlist {
  id: number;
  name: string;
  symbols: string[];
  createdAt: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  timestamp: string;
  source: string;
  category: string;
  relatedSymbols: string[];
}

export interface BollingerBands {
  upper: number;
  middle: number;
  lower: number;
}

export interface TechnicalIndicators {
  RSI: number;
  MACD: string;
  MovingAverage50: number;
  MovingAverage200: number;
  BollingerBands: BollingerBands;
  Support: number;
  Resistance: number;
}

export interface ChangeData {
  change: string;
  changePercent: string;
  colorClass: string;
}

export type TabType = 'stocks' | 'futures';

// Props interfaces
export interface SidebarLeftProps {
  onItemSelect?: (item: Instrument) => void;
}

export interface MainContentProps {
  selectedInstrument?: Instrument | null;
}

export interface HeaderProps {
  // Add header props as needed
}

export interface SidebarRightProps {
  // Add right sidebar props as needed
}