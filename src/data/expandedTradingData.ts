// data/expandedTradingData.ts - Complete Trading Data for All Tabs

import { 
  Stock, 
  Future, 
  MarketStatus, 
  UserWatchlist, 
  Category, 
  NewsItem, 
  TechnicalIndicators 
} from '../types';

// Extended types for additional data
export interface ChartData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface FundamentalData {
  marketCap: string;
  enterpriseValue: string;
  peRatio: number;
  pegRatio: number;
  pbRatio: number;
  debtToEquity: number;
  currentRatio: number;
  quickRatio: number;
  roe: number;
  roa: number;
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  revenue: string;
  revenueGrowth: number;
  earnings: string;
  earningsGrowth: number;
  bookValue: number;
  dividendYield: number;
  payoutRatio: number;
  beta: number;
  eps: number;
  forwardPE: number;
  priceToSales: number;
  priceToBook: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  analystRating: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  targetPrice: number;
  analystCount: number;
}

export interface TechnicalAnalysis {
  rsi: {
    value: number;
    signal: 'Oversold' | 'Overbought' | 'Neutral';
    period: number;
  };
  macd: {
    macd: number;
    signal: number;
    histogram: number;
    trend: 'Bullish' | 'Bearish' | 'Neutral';
  };
  movingAverages: {
    sma20: number;
    sma50: number;
    sma200: number;
    ema20: number;
    ema50: number;
    ema200: number;
  };
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
    bandwidth: number;
  };
  supportResistance: {
    resistance1: number;
    resistance2: number;
    resistance3: number;
    support1: number;
    support2: number;
    support3: number;
  };
  oscillators: {
    stochastic: number;
    williamsR: number;
    cci: number;
    momentum: number;
  };
  pivotPoints: {
    pivot: number;
    r1: number;
    r2: number;
    r3: number;
    s1: number;
    s2: number;
    s3: number;
  };
  patterns: string[];
  overallSignal: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  summary: string;
}

export interface SocialSignal {
  platform: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  score: number;
  mentions: number;
  change24h: number;
  icon: string;
  trendingTopics: string[];
}

export interface NewsItemExtended extends NewsItem {
  content: string;
  imageUrl?: string;
  author: string;
  url: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  impact: 'High' | 'Medium' | 'Low';
  tags: string[];
}

// Sample Chart Data (OHLCV)

// Deterministic data generation
export const generateChartData = (symbol: string, days: number = 365): ChartData[] => {
  const data: ChartData[] = [];
  // Create a seed based on symbol for deterministic results
  const seed = Array.from(symbol).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Simple deterministic PRNG
  const random = (index: number) => {
    const x = Math.sin(seed + index) * 10000;
    return x - Math.floor(x);
  };

  let currentPrice = symbol === 'NIFTY' ? 25500 : 
                    symbol === 'RELIANCE' ? 1500 : 
                    symbol === 'BANKNIFTY' ? 57000 : 1200;
  
  for (let i = days; i >= 0; i--) {
    const volatility = 0.02;
    const change = (random(i) - 0.5) * volatility * currentPrice;
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + random(i * 2) * 0.01 * currentPrice;
    const low = Math.min(open, close) - random(i * 3) * 0.01 * currentPrice;
    const volume = Math.floor(random(i * 4) * 10000000) + 1000000;
    
    data.push({
      timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume
    });
    
    currentPrice = close;
  }
  
  return data;
};

// Fundamental Data for major instruments
export const fundamentalData: Record<string, FundamentalData> = {
  'NIFTY': {
    marketCap: '₹142.5L Cr',
    enterpriseValue: 'N/A',
    peRatio: 22.8,
    pegRatio: 1.45,
    pbRatio: 3.2,
    debtToEquity: 0,
    currentRatio: 0,
    quickRatio: 0,
    roe: 14.2,
    roa: 8.5,
    grossMargin: 0,
    operatingMargin: 0,
    netMargin: 0,
    revenue: 'N/A',
    revenueGrowth: 0,
    earnings: 'N/A',
    earningsGrowth: 12.5,
    bookValue: 0,
    dividendYield: 1.2,
    payoutRatio: 0,
    beta: 1.0,
    eps: 0,
    forwardPE: 21.5,
    priceToSales: 0,
    priceToBook: 3.2,
    fiftyTwoWeekHigh: 26277.35,
    fiftyTwoWeekLow: 21281.45,
    analystRating: 'Buy',
    targetPrice: 26500,
    analystCount: 25
  },
  'RELIANCE': {
    marketCap: '₹10.15L Cr',
    enterpriseValue: '₹11.28L Cr',
    peRatio: 14.2,
    pegRatio: 1.8,
    pbRatio: 1.9,
    debtToEquity: 0.21,
    currentRatio: 1.45,
    quickRatio: 0.85,
    roe: 13.8,
    roa: 8.2,
    grossMargin: 42.5,
    operatingMargin: 18.7,
    netMargin: 7.8,
    revenue: '₹7,92,756 Cr',
    revenueGrowth: 8.5,
    earnings: '₹61,962 Cr',
    earningsGrowth: 15.2,
    bookValue: 789.50,
    dividendYield: 2.4,
    payoutRatio: 34.2,
    beta: 0.95,
    eps: 105.7,
    forwardPE: 13.8,
    priceToSales: 1.28,
    priceToBook: 1.9,
    fiftyTwoWeekHigh: 1642.80,
    fiftyTwoWeekLow: 1289.50,
    analystRating: 'Buy',
    targetPrice: 1650,
    analystCount: 42
  },
  'HDFCBANK': {
    marketCap: '₹15.28L Cr',
    enterpriseValue: 'N/A',
    peRatio: 15.4,
    pegRatio: 1.6,
    pbRatio: 2.8,
    debtToEquity: 0,
    currentRatio: 0,
    quickRatio: 0,
    roe: 18.2,
    roa: 1.8,
    grossMargin: 0,
    operatingMargin: 0,
    netMargin: 24.5,
    revenue: '₹1,85,406 Cr',
    revenueGrowth: 12.8,
    earnings: '₹45,432 Cr',
    earningsGrowth: 18.5,
    bookValue: 714.80,
    dividendYield: 2.1,
    payoutRatio: 32.5,
    beta: 0.88,
    eps: 129.9,
    forwardPE: 14.2,
    priceToSales: 8.24,
    priceToBook: 2.8,
    fiftyTwoWeekHigh: 2145.75,
    fiftyTwoWeekLow: 1825.50,
    analystRating: 'Strong Buy',
    targetPrice: 2200,
    analystCount: 38
  }
};

// Technical Analysis Data
export const technicalAnalysisData: Record<string, TechnicalAnalysis> = {
  'NIFTY': {
    rsi: { value: 65.4, signal: 'Neutral', period: 14 },
    macd: { macd: 45.8, signal: 38.2, histogram: 7.6, trend: 'Bullish' },
    movingAverages: {
      sma20: 25420.30,
      sma50: 25280.75,
      sma200: 24890.50,
      ema20: 25445.80,
      ema50: 25295.20,
      ema200: 24920.30
    },
    bollingerBands: {
      upper: 25680.50,
      middle: 25520.30,
      lower: 25360.10,
      bandwidth: 1.26
    },
    supportResistance: {
      resistance1: 25650,
      resistance2: 25750,
      resistance3: 25850,
      support1: 25400,
      support2: 25300,
      support3: 25200
    },
    oscillators: {
      stochastic: 68.5,
      williamsR: -31.5,
      cci: 85.2,
      momentum: 2.45
    },
    pivotPoints: {
      pivot: 25517.05,
      r1: 25587.30,
      r2: 25657.55,
      r3: 25727.80,
      s1: 25446.80,
      s2: 25376.55,
      s3: 25306.30
    },
    patterns: ['Ascending Triangle', 'Higher Highs', 'Volume Breakout'],
    overallSignal: 'Buy',
    summary: 'Technical indicators suggest a bullish trend with strong momentum. RSI shows room for further upside.'
  },
  'RELIANCE': {
    rsi: { value: 42.8, signal: 'Neutral', period: 14 },
    macd: { macd: -2.3, signal: -1.8, histogram: -0.5, trend: 'Bearish' },
    movingAverages: {
      sma20: 1485.60,
      sma50: 1520.40,
      sma200: 1545.80,
      ema20: 1490.20,
      ema50: 1515.70,
      ema200: 1540.30
    },
    bollingerBands: {
      upper: 1535.80,
      middle: 1500.60,
      lower: 1465.40,
      bandwidth: 4.7
    },
    supportResistance: {
      resistance1: 1520,
      resistance2: 1540,
      resistance3: 1565,
      support1: 1485,
      support2: 1465,
      support3: 1445
    },
    oscillators: {
      stochastic: 35.2,
      williamsR: -64.8,
      cci: -45.6,
      momentum: -1.8
    },
    pivotPoints: {
      pivot: 1500.60,
      r1: 1515.80,
      r2: 1531.00,
      r3: 1546.20,
      s1: 1485.40,
      s2: 1470.20,
      s3: 1455.00
    },
    patterns: ['Descending Channel', 'Lower Lows', 'Consolidation'],
    overallSignal: 'Hold',
    summary: 'Mixed signals with downward pressure. Stock is testing support levels with potential for reversal.'
  }
};

// Social Signals Data
export const socialSignalsData: Record<string, SocialSignal[]> = {
  'NIFTY': [
    {
      platform: 'Twitter',
      sentiment: 'Bullish',
      score: 72,
      mentions: 15420,
      change24h: 8.5,
      icon: '𝕏',
      trendingTopics: ['#NiftyBullish', '#IndianMarkets', '#RallyMode']
    },
    {
      platform: 'Reddit',
      sentiment: 'Bullish',
      score: 68,
      mentions: 3840,
      change24h: 12.3,
      icon: '🔴',
      trendingTopics: ['r/IndiaInvestments', 'Market Rally', 'Long Term']
    },
    {
      platform: 'Telegram',
      sentiment: 'Neutral',
      score: 55,
      mentions: 8920,
      change24h: -2.1,
      icon: '📱',
      trendingTopics: ['Technical Analysis', 'Options', 'Day Trading']
    },
    {
      platform: 'YouTube',
      sentiment: 'Bullish',
      score: 74,
      mentions: 2650,
      change24h: 15.8,
      icon: '📺',
      trendingTopics: ['Market Update', 'Analysis Video', 'Stock Tips']
    }
  ],
  'RELIANCE': [
    {
      platform: 'Twitter',
      sentiment: 'Bearish',
      score: 38,
      mentions: 8520,
      change24h: -15.2,
      icon: '𝕏',
      trendingTopics: ['#RelianceDown', '#OilPrices', '#Concerns']
    },
    {
      platform: 'Reddit',
      sentiment: 'Neutral',
      score: 52,
      mentions: 1940,
      change24h: -5.8,
      icon: '🔴',
      trendingTopics: ['Earnings', 'Dividend', 'Long Hold']
    },
    {
      platform: 'LinkedIn',
      sentiment: 'Bullish',
      score: 65,
      mentions: 1280,
      change24h: 3.4,
      icon: '💼',
      trendingTopics: ['Business News', 'Industry Updates', 'Investment']
    }
  ]
};

// Extended News Data
export const extendedNewsData: Record<string, NewsItemExtended[]> = {
  'NIFTY': [
    {
      id: 1,
      title: 'Nifty 50 Hits New All-Time High Amid Strong FII Inflows',
      summary: 'The benchmark index surged to a record high as foreign institutional investors pumped in ₹15,000 crore in the past week.',
      content: 'The Nifty 50 index reached an unprecedented milestone today, touching 25,680 points during intraday trading before settling at 25,517. This remarkable rally has been fueled by sustained foreign institutional investor (FII) inflows, which have totaled ₹15,000 crore over the past week. Market experts attribute this surge to positive global sentiment, robust domestic economic indicators, and renewed confidence in emerging markets. The financial sector led the charge with HDFC Bank, ICICI Bank, and Axis Bank posting significant gains. Technology stocks also contributed substantially to the rally, with investors showing increased appetite for Indian IT companies amid global digital transformation trends.',
      timestamp: new Date().toISOString(),
      source: 'Economic Times',
      category: 'Market',
      relatedSymbols: ['NIFTY', 'HDFCBANK', 'ICICIBANK'],
      imageUrl: '/api/placeholder/400/200',
      author: 'Rajesh Kumar',
      url: 'https://economictimes.com/nifty-ath',
      sentiment: 'Positive',
      impact: 'High',
      tags: ['FII', 'All-Time High', 'Market Rally', 'Banking']
    },
    {
      id: 2,
      title: 'Q3 Earnings Season: 75% of Nifty Companies Beat Estimates',
      summary: 'Strong quarterly results drive market optimism as three-quarters of index constituents exceed analyst expectations.',
      content: 'The ongoing Q3 earnings season has delivered exceptional results, with 75% of Nifty 50 companies surpassing analyst estimates. This remarkable performance has reinforced investor confidence and provided fundamental support to the ongoing market rally. Key highlights include robust revenue growth across sectors, improved profit margins, and better-than-expected guidance from management teams.',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      source: 'Business Standard',
      category: 'Earnings',
      relatedSymbols: ['NIFTY'],
      author: 'Priya Sharma',
      url: 'https://business-standard.com/earnings-beat',
      sentiment: 'Positive',
      impact: 'High',
      tags: ['Earnings', 'Q3 Results', 'Beat Estimates']
    }
  ],
  'RELIANCE': [
    {
      id: 3,
      title: 'Reliance Industries Announces Strategic Partnership with Meta',
      summary: 'RIL and Meta to collaborate on digital infrastructure and e-commerce initiatives in India.',
      content: 'Reliance Industries Limited has announced a groundbreaking strategic partnership with Meta Platforms Inc. to accelerate digital transformation across India. The collaboration will focus on expanding digital infrastructure, enhancing e-commerce capabilities through Jio Platforms, and developing innovative solutions for the Indian market. This partnership is expected to strengthen Reliance\'s position in the digital ecosystem and create new revenue streams.',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      source: 'Mint',
      category: 'Corporate',
      relatedSymbols: ['RELIANCE'],
      imageUrl: '/api/placeholder/400/200',
      author: 'Ankit Patel',
      url: 'https://mint.com/reliance-meta-partnership',
      sentiment: 'Positive',
      impact: 'Medium',
      tags: ['Partnership', 'Digital', 'Meta', 'Jio']
    }
  ]
};

// Export all data
export {
  stocksData,
  futuresData,
  marketStatus,
  userWatchlists,
  categories,
  newsData,
  technicalIndicators
} from './tradingData';