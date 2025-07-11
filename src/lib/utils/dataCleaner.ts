// File: src/utils/dataCleaner.ts

// Clean price data from GLOBAL_QUOTE
export const cleanStockData = (rawData: any) => {
  if (!rawData) return null;

  return {
    symbol: rawData['01. symbol'],
    price: parseFloat(rawData['05. price']),
    change: parseFloat(rawData['09. change']),
    changePercent: rawData['10. change percent'],
    lastUpdated: new Date().toISOString()
  };
};

// Clean news array
export const cleanNewsData = (rawArticles: any[]) => {
  return rawArticles.map(article => ({
    title: article.title,
    source: article.source?.name,
    description: article.description,
    url: article.url,
    publishedAt: article.publishedAt
  }));
};

// Clean indicator values (rsi & macd as flat input)
export const cleanIndicatorData = (raw: { rsi: string | null, macd: { macd: string, signal: string } | null }) => {
  return {
    rsi: raw.rsi ? parseFloat(raw.rsi) : null,
    macd: raw.macd
      ? {
          macd: parseFloat(raw.macd.macd),
          signal: parseFloat(raw.macd.signal)
        }
      : null
  };
};

// Clean overview/fundamentals
export const cleanFundamentals = (raw: any) => {
  if (!raw) return null;

  return {
    peRatio: parseFloat(raw.PERatio || 0),
    marketCap: parseFloat(raw.MarketCapitalization || 0),
    dividendYield: parseFloat(raw.DividendYield || 0),
    profitMargin: parseFloat(raw.ProfitMargin || 0),
    returnOnEquity: parseFloat(raw.ReturnOnEquityTTM || 0),
    eps: parseFloat(raw.EPS || 0),
    sector: raw.Sector,
    industry: raw.Industry
  };
};

// Clean StockTwits data
export const cleanSocialData = (raw: any[]) => {
  return raw.map(item => ({
    user: item.user,
    sentiment: item.sentiment?.basic || 'none',
    message: item.body,
    createdAt: item.created_at
  }));
};
