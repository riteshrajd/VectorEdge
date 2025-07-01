// data/tradingData.js - Pseudo Database for Trading Platform

export const stocksData = [
  {
    symbol: 'NIFTY',
    name: 'Nifty 50 Index',
    price: 25517.05,
    change: -126.75,
    changePercent: -0.47,
    volume: '2.5M',
    marketCap: '₹142.5L Cr',
    sector: 'Index',
    color: '#3b82f6', // blue
    high: 25680.30,
    low: 25450.20,
    open: 25620.15,
    previousClose: 25643.80,
    pe: 0,
    eps: 0,
    dividend: 0,
    lastUpdated: new Date().toISOString()
  },
  {
    symbol: 'BANKNIFTY',
    name: 'Bank Nifty Index',
    price: 57312.75,
    change: -131.15,
    changePercent: -0.23,
    volume: '1.8M',
    marketCap: '₹85.2L Cr',
    sector: 'Banking',
    color: '#10b981', // green
    high: 57520.40,
    low: 57180.60,
    open: 57445.90,
    previousClose: 57443.90,
    pe: 0,
    eps: 0,
    dividend: 0,
    lastUpdated: new Date().toISOString()
  },
  {
    symbol: 'SENSEX',
    name: 'S&P BSE Sensex',
    price: 83006.40,
    change: -452.34,
    changePercent: -0.54,
    volume: '1.2M',
    marketCap: '₹125.8L Cr',
    sector: 'Index',
    color: '#3b82f6', // blue
    high: 83520.75,
    low: 82850.30,
    open: 83280.50,
    previousClose: 83458.74,
    pe: 0,
    eps: 0,
    dividend: 0,
    lastUpdated: new Date().toISOString()
  },
  {
    symbol: 'CNXIT',
    name: 'CNX IT Index',
    price: 38950.00,
    change: 139.25,
    changePercent: 0.36,
    volume: '890K',
    marketCap: '₹45.2L Cr',
    sector: 'Information Technology',
    color: '#8b5cf6', // purple
    high: 39120.80,
    low: 38750.20,
    open: 38820.75,
    previousClose: 38810.75,
    pe: 28.5,
    eps: 1367.2,
    dividend: 1.2,
    lastUpdated: new Date().toISOString()
  },
  {
    symbol: 'SPX',
    name: 'S&P 500 Index',
    price: 6173.07,
    change: 32.06,
    changePercent: 0.52,
    volume: '4.2B',
    marketCap: '$45.8T',
    sector: 'Index',
    color: '#ef4444', // red
    high: 6185.30,
    low: 6150.25,
    open: 6155.80,
    previousClose: 6141.01,
    pe: 0,
    eps: 0,
    dividend: 0,
    lastUpdated: new Date().toISOString()
  },
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    price: 1500.60,
    change: -14.80,
    changePercent: -0.98,
    volume: '12.5M',
    marketCap: '₹10.15L Cr',
    sector: 'Oil & Gas',
    color: '#f59e0b', // amber
    high: 1520.40,
    low: 1495.30,
    open: 1515.40,
    previousClose: 1515.40,
    pe: 14.2,
    eps: 105.7,
    dividend: 2.4,
    lastUpdated: new Date().toISOString()
  },
  {
    symbol: 'AXISBANK',
    name: 'Axis Bank Ltd',
    price: 1199.20,
    change: -25.90,
    changePercent: -2.11,
    volume: '8.9M',
    marketCap: '₹3.68L Cr',
    sector: 'Banking',
    color: '#10b981', // green
    high: 1230.50,
    low: 1185.75,
    open: 1225.10,
    previousClose: 1225.10,
    pe: 11.8,
    eps: 101.6,
    dividend: 1.8,
    lastUpdated: new Date().toISOString()
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    price: 2001.50,
    change: -13.60,
    changePercent: -0.67,
    volume: '6.7M',
    marketCap: '₹15.28L Cr',
    sector: 'Banking',
    color: '#10b981', // green
    high: 2025.80,
    low: 1985.20,
    open: 2015.10,
    previousClose: 2015.10,
    pe: 15.4,
    eps: 129.9,
    dividend: 2.1,
    lastUpdated: new Date().toISOString()
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd',
    price: 1445.80,
    change: -16.40,
    changePercent: -1.12,
    volume: '9.2M',
    marketCap: '₹10.15L Cr',
    sector: 'Banking',
    color: '#10b981', // green
    high: 1468.50,
    low: 1430.25,
    open: 1462.20,
    previousClose: 1462.20,
    pe: 13.2,
    eps: 109.5,
    dividend: 1.9,
    lastUpdated: new Date().toISOString()
  },
  {
    symbol: 'BAJFINANCE',
    name: 'Bajaj Finance Ltd',
    price: 936.50,
    change: -10.90,
    changePercent: -1.15,
    volume: '4.8M',
    marketCap: '₹5.79L Cr',
    sector: 'Financial Services',
    color: '#8b5cf6', // purple
    high: 952.80,
    low: 928.40,
    open: 947.40,
    previousClose: 947.40,
    pe: 24.8,
    eps: 37.7,
    dividend: 0.8,
    lastUpdated: new Date().toISOString()
  }
];

export const futuresData = [
  {
    symbol: 'NIFTYFUT',
    name: 'Nifty Future Current Month',
    price: 25615.00,
    change: -135.20,
    changePercent: -0.53,
    volume: '5.2M',
    marketCap: '₹142.5L Cr',
    sector: 'Futures',
    color: '#3b82f6', // blue
    high: 25780.50,
    low: 25520.30,
    open: 25720.40,
    previousClose: 25750.20,
    pe: 0,
    eps: 0,
    dividend: 0,
    expiryDate: '2025-07-31',
    contractSize: 50,
    lotSize: 50,
    lastUpdated: new Date().toISOString()
  },
  {
    symbol: 'BANKNIFTYFUT',
    name: 'Bank Nifty Future Current Month',
    price: 57521.00,
    change: -127.00,
    changePercent: -0.22,
    volume: '3.8M',
    marketCap: '₹85.2L Cr',
    sector: 'Futures',
    color: '#10b981', // green
    high: 57750.25,
    low: 57350.80,
    open: 57648.90,
    previousClose: 57648.00,
    pe: 0,
    eps: 0,
    dividend: 0,
    expiryDate: '2025-07-31',
    contractSize: 15,
    lotSize: 15,
    lastUpdated: new Date().toISOString()
  }
];

// Market status data
export const marketStatus = {
  isOpen: true,
  openTime: '09:15',
  closeTime: '15:30',
  timezone: 'IST',
  lastUpdated: new Date().toISOString(),
  preMarketOpen: '09:00',
  afterMarketClose: '16:00'
};

// User watchlist data
export const userWatchlists = [
  {
    id: 1,
    name: 'My Watchlist',
    symbols: ['NIFTY', 'BANKNIFTY', 'RELIANCE', 'HDFCBANK'],
    createdAt: '2025-06-15',
    isDefault: true
  },
  {
    id: 2,
    name: 'Banking Stocks',
    symbols: ['BANKNIFTY', 'HDFCBANK', 'ICICIBANK', 'AXISBANK'],
    createdAt: '2025-06-20',
    isDefault: false
  }
];

// Categories for filtering
export const categories = [
  { id: 'all', name: 'All', count: stocksData.length + futuresData.length },
  { id: 'indices', name: 'Indices', count: 4 },
  { id: 'banking', name: 'Banking', count: 4 },
  { id: 'it', name: 'IT', count: 1 },
  { id: 'energy', name: 'Energy', count: 1 },
  { id: 'futures', name: 'Futures', count: futuresData.length }
];

// News data (for future use)
export const newsData = [
  {
    id: 1,
    title: 'Market opens higher amid positive global cues',
    summary: 'Nifty and Sensex opened in green territory following...',
    timestamp: new Date().toISOString(),
    source: 'ET Markets',
    category: 'Market',
    relatedSymbols: ['NIFTY', 'SENSEX']
  },
  {
    id: 2,
    title: 'Banking sector under pressure after RBI announcement',
    summary: 'Bank Nifty falls as RBI maintains repo rate...',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    source: 'Bloomberg',
    category: 'Banking',
    relatedSymbols: ['BANKNIFTY', 'HDFCBANK', 'ICICIBANK']
  }
];

// Technical indicators data (for charts)
export const technicalIndicators = {
  RSI: 65.4,
  MACD: 'Bullish',
  MovingAverage50: 25420.30,
  MovingAverage200: 24980.75,
  BollingerBands: {
    upper: 25680.50,
    middle: 25520.30,
    lower: 25360.10
  },
  Support: 25400,
  Resistance: 25700
};