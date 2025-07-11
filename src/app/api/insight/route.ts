// app/api/scraper/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface CompanyOverview {
  name: string;
  ticker: string;
  industry: string;
  sector: string;
  currentPrice: string;
  priceChange: string;
  priceChangePercent: string;
  marketStatus: string;
}

export interface QuickStats {
  marketCap: string;
  peRatio: string;
  dividendYield: string;
  weekHigh52: string;
  weekLow52: string;
  avgDailyVolume: string;
}

export interface FinancialStatement {
  revenue: number[];
  cogs: number[];
  grossProfit: number[];
  operatingExpenses: number[];
  operatingIncome: number[];
  netIncome: number[];
  eps: number[];
  totalAssets: number[];
  totalLiabilities: number[];
  shareholdersEquity: number[];
  cashAndEquivalents: number[];
  shortTermDebt: number[];
  longTermDebt: number[];
  operatingCashFlow: number[];
  investingCashFlow: number[];
  financingCashFlow: number[];
  freeCashFlow: number[];
}

export interface KeyMetrics {
  grossMargin: string;
  operatingMargin: string;
  netMargin: string;
  roe: string;
  roa: string;
  currentRatio: string;
  quickRatio: string;
  debtToEquity: string;
  interestCoverage: string;
  assetTurnover: string;
  inventoryTurnover: string;
  pbRatio: string;
  evEbitda: string;
}

export interface GrowthTrends {
  revenueGrowth: number[];
  earningsGrowth: number[];
  epsGrowth: number[];
  years: string[];
}

export interface DividendInfo {
  currentYield: string;
  payoutRatio: string;
  annualDividend: string;
  paymentHistory: Array<{year: string; amount: string}>;
  exDividendDate: string;
  paymentDate: string;
}

export interface AnalystRatings {
  buyPercent: number;
  holdPercent: number;
  sellPercent: number;
  avgPriceTarget: string;
  priceTargetHigh: string;
  priceTargetLow: string;
  recentChanges: Array<{
    analyst: string;
    action: string;
    date: string;
    target: string;
  }>;
}

export interface InsiderActivity {
  trades: Array<{
    insider: string;
    action: string;
    shares: string;
    price: string;
    date: string;
  }>;
  ownershipPercent: string;
}

export interface CompetitorData {
  name: string;
  ticker: string;
  peRatio: string;
  pbRatio: string;
  roe: string;
  marketCap: string;
  revenueGrowth: string;
}

export interface NewsEvent {
  headline: string;
  source: string;
  date: string;
  url: string;
}

export interface FundamentalData {
  overview: CompanyOverview;
  quickStats: QuickStats;
  financials: FinancialStatement;
  keyMetrics: KeyMetrics;
  growthTrends: GrowthTrends;
  dividendInfo: DividendInfo;
  analystRatings: AnalystRatings;
  insiderActivity: InsiderActivity;
  competitors: CompetitorData[];
  news: NewsEvent[];
}

// Helper function to extract text safely
const safeText = (element: cheerio.Cheerio<cheerio.Element>): string => {
  return element.text().trim() || '';
};

// Helper function to extract number from text
const extractNumber = (text: string): number => {
  const match = text.replace(/[,$%]/g, '').match(/-?\d+\.?\d*/);
  return match ? parseFloat(match[0]) : 0;
};

// Helper function to format large numbers
const formatLargeNumber = (num: number): string => {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toString();
};

class StockDataScraper {
  private headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
  };

  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async scrapeYahooFinance(ticker: string): Promise<Partial<FundamentalData>> {
    try {
      const url = `https://finance.yahoo.com/quote/${ticker}`;
      const response = await axios.get(url, { headers: this.headers, timeout: 10000 });
      const $ = cheerio.load(response.data);

      // Extract company overview
      const overview: CompanyOverview = {
        name: $('h1[data-field="symbol"]').text().trim() || $('h1').first().text().trim(),
        ticker: ticker.toUpperCase(),
        industry: $('span[data-test="INDUSTRY"]').text().trim() || '',
        sector: $('span[data-test="SECTOR"]').text().trim() || '',
        currentPrice: $('fin-streamer[data-field="regularMarketPrice"]').attr('value') || $('fin-streamer[data-field="regularMarketPrice"]').text().trim(),
        priceChange: $('fin-streamer[data-field="regularMarketChange"]').attr('value') || $('fin-streamer[data-field="regularMarketChange"]').text().trim(),
        priceChangePercent: $('fin-streamer[data-field="regularMarketChangePercent"]').attr('value') || $('fin-streamer[data-field="regularMarketChangePercent"]').text().trim(),
        marketStatus: $('span[data-test="MARKET_STATUS"]').text().trim() || 'Unknown'
      };

      // Extract quick stats
      const quickStats: QuickStats = {
        marketCap: $('fin-streamer[data-field="marketCap"]').attr('value') || $('fin-streamer[data-field="marketCap"]').text().trim(),
        peRatio: $('fin-streamer[data-field="trailingPE"]').attr('value') || $('fin-streamer[data-field="trailingPE"]').text().trim(),
        dividendYield: $('fin-streamer[data-field="trailingAnnualDividendYield"]').attr('value') || $('fin-streamer[data-field="trailingAnnualDividendYield"]').text().trim(),
        weekHigh52: $('fin-streamer[data-field="fiftyTwoWeekHigh"]').attr('value') || $('fin-streamer[data-field="fiftyTwoWeekHigh"]').text().trim(),
        weekLow52: $('fin-streamer[data-field="fiftyTwoWeekLow"]').attr('value') || $('fin-streamer[data-field="fiftyTwoWeekLow"]').text().trim(),
        avgDailyVolume: $('fin-streamer[data-field="averageVolume"]').attr('value') || $('fin-streamer[data-field="averageVolume"]').text().trim()
      };

      // Extract additional stats from summary table
      const summaryTable = $('div[data-test="quote-summary"] table');
      summaryTable.find('tr').each((i, row) => {
        const cells = $(row).find('td');
        if (cells.length >= 2) {
          const label = $(cells[0]).text().trim().toLowerCase();
          const value = $(cells[1]).text().trim();
          
          if (label.includes('market cap')) quickStats.marketCap = value;
          if (label.includes('pe ratio') || label.includes('p/e')) quickStats.peRatio = value;
          if (label.includes('dividend')) quickStats.dividendYield = value;
          if (label.includes('52 week high')) quickStats.weekHigh52 = value;
          if (label.includes('52 week low')) quickStats.weekLow52 = value;
          if (label.includes('avg volume')) quickStats.avgDailyVolume = value;
        }
      });

      return { overview, quickStats };
    } catch (error) {
      console.error(`Error scraping Yahoo Finance for ${ticker}:`, error);
      return {};
    }
  }

  async scrapeFinviz(ticker: string): Promise<Partial<FundamentalData>> {
    try {
      const url = `https://finviz.com/quote.ashx?t=${ticker}`;
      const response = await axios.get(url, { headers: this.headers, timeout: 10000 });
      const $ = cheerio.load(response.data);

      const keyMetrics: Partial<KeyMetrics> = {};
      const quickStats: Partial<QuickStats> = {};

      // Extract data from snapshot table
      $('table.snapshot-table2 tr').each((i, row) => {
        const cells = $(row).find('td');
        for (let j = 0; j < cells.length; j += 2) {
          const label = $(cells[j]).text().trim();
          const value = $(cells[j + 1]).text().trim();

          switch (label) {
            case 'Market Cap':
              quickStats.marketCap = value;
              break;
            case 'P/E':
              quickStats.peRatio = value;
              break;
            case 'P/B':
              keyMetrics.pbRatio = value;
              break;
            case 'Dividend %':
              quickStats.dividendYield = value;
              break;
            case 'ROE':
              keyMetrics.roe = value;
              break;
            case 'ROA':
              keyMetrics.roa = value;
              break;
            case 'Current Ratio':
              keyMetrics.currentRatio = value;
              break;
            case 'Debt/Eq':
              keyMetrics.debtToEquity = value;
              break;
            case 'Gross Margin':
              keyMetrics.grossMargin = value;
              break;
            case 'Oper. Margin':
              keyMetrics.operatingMargin = value;
              break;
            case 'Profit Margin':
              keyMetrics.netMargin = value;
              break;
            case '52W High':
              quickStats.weekHigh52 = value;
              break;
            case '52W Low':
              quickStats.weekLow52 = value;
              break;
            case 'Avg Volume':
              quickStats.avgDailyVolume = value;
              break;
          }
        }
      });

      return { keyMetrics, quickStats };
    } catch (error) {
      console.error(`Error scraping Finviz for ${ticker}:`, error);
      return {};
    }
  }

  async scrapeYahooFinancials(ticker: string): Promise<Partial<FinancialStatement>> {
    try {
      const url = `https://finance.yahoo.com/quote/${ticker}/financials`;
      const response = await axios.get(url, { headers: this.headers, timeout: 10000 });
      const $ = cheerio.load(response.data);

      const financials: Partial<FinancialStatement> = {
        revenue: [],
        netIncome: [],
        eps: [],
        operatingIncome: [],
        grossProfit: []
      };

      // Extract financial data from the table
      $('div[data-test="fin-row"]').each((i, row) => {
        const rowTitle = $(row).find('div[data-test="fin-col"]').first().text().trim().toLowerCase();
        const values = $(row).find('div[data-test="fin-col"]').not(':first').map((_, el) => {
          const text = $(el).text().trim();
          return text && text !== '-' ? extractNumber(text) * 1000 : 0; // Convert to actual numbers
        }).get();

        if (rowTitle.includes('total revenue') || rowTitle.includes('revenue')) {
          financials.revenue = values.slice(0, 5);
        } else if (rowTitle.includes('net income')) {
          financials.netIncome = values.slice(0, 5);
        } else if (rowTitle.includes('basic eps')) {
          financials.eps = values.slice(0, 5);
        } else if (rowTitle.includes('operating income')) {
          financials.operatingIncome = values.slice(0, 5);
        } else if (rowTitle.includes('gross profit')) {
          financials.grossProfit = values.slice(0, 5);
        }
      });

      return financials;
    } catch (error) {
      console.error(`Error scraping Yahoo financials for ${ticker}:`, error);
      return {};
    }
  }

  async scrapeGoogleNews(ticker: string): Promise<NewsEvent[]> {
    try {
      const url = `https://news.google.com/rss/search?q=${ticker}+stock&hl=en-US&gl=US&ceid=US:en`;
      const response = await axios.get(url, { headers: this.headers, timeout: 10000 });
      const $ = cheerio.load(response.data, { xmlMode: true });

      const news: NewsEvent[] = [];
      
      $('item').each((i, item) => {
        if (i < 10) { // Limit to 10 news items
          const title = $(item).find('title').text().trim();
          const source = $(item).find('source').text().trim();
          const pubDate = $(item).find('pubDate').text().trim();
          const link = $(item).find('link').text().trim();

          if (title && source) {
            news.push({
              headline: title,
              source: source,
              date: pubDate,
              url: link
            });
          }
        }
      });

      return news;
    } catch (error) {
      console.error(`Error scraping Google News for ${ticker}:`, error);
      return [];
    }
  }

  async scrapeAlphaVantage(ticker: string): Promise<Partial<FundamentalData>> {
    try {
      // Using Alpha Vantage free API (requires API key)
      const API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
      const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${API_KEY}`;
      
      const response = await axios.get(url, { timeout: 10000 });
      const data = response.data;

      if (data.Symbol) {
        const overview: CompanyOverview = {
          name: data.Name || '',
          ticker: data.Symbol || ticker.toUpperCase(),
          industry: data.Industry || '',
          sector: data.Sector || '',
          currentPrice: data.Price || '',
          priceChange: '',
          priceChangePercent: '',
          marketStatus: 'Unknown'
        };

        const quickStats: QuickStats = {
          marketCap: data.MarketCapitalization || '',
          peRatio: data.PERatio || '',
          dividendYield: data.DividendYield || '',
          weekHigh52: data['52WeekHigh'] || '',
          weekLow52: data['52WeekLow'] || '',
          avgDailyVolume: ''
        };

        const keyMetrics: KeyMetrics = {
          grossMargin: data.GrossProfitTTM || '',
          operatingMargin: data.OperatingMarginTTM || '',
          netMargin: data.ProfitMargin || '',
          roe: data.ReturnOnEquityTTM || '',
          roa: data.ReturnOnAssetsTTM || '',
          currentRatio: data.CurrentRatio || '',
          quickRatio: data.QuickRatio || '',
          debtToEquity: data.DebtToEquityRatio || '',
          interestCoverage: '',
          assetTurnover: '',
          inventoryTurnover: '',
          pbRatio: data.PriceToBookRatio || '',
          evEbitda: data.EVToEBITDA || ''
        };

        return { overview, quickStats, keyMetrics };
      }

      return {};
    } catch (error) {
      console.error(`Error fetching Alpha Vantage data for ${ticker}:`, error);
      return {};
    }
  }

  async scrapeComprehensive(ticker: string): Promise<FundamentalData> {
    console.log(`Starting comprehensive scrape for ${ticker}...`);

    // Scrape from multiple sources with delays
    const [
      yahooData,
      finvizData,
      financialData,
      newsData,
      alphaVantageData
    ] = await Promise.allSettled([
      this.scrapeYahooFinance(ticker),
      this.delay(1000).then(() => this.scrapeFinviz(ticker)),
      this.delay(2000).then(() => this.scrapeYahooFinancials(ticker)),
      this.delay(3000).then(() => this.scrapeGoogleNews(ticker)),
      this.delay(4000).then(() => this.scrapeAlphaVantage(ticker))
    ]);

    // Extract successful results
    const yahoo = yahooData.status === 'fulfilled' ? yahooData.value : {};
    const finviz = finvizData.status === 'fulfilled' ? finvizData.value : {};
    const financial = financialData.status === 'fulfilled' ? financialData.value : {};
    const news = newsData.status === 'fulfilled' ? newsData.value : [];
    const alphaVantage = alphaVantageData.status === 'fulfilled' ? alphaVantageData.value : {};

    // Merge all data with priority: AlphaVantage > Yahoo > Finviz
    const mergedData: FundamentalData = {
      overview: {
        ...yahoo.overview,
        ...alphaVantage.overview,
        name: alphaVantage.overview?.name || yahoo.overview?.name || '',
        ticker: ticker.toUpperCase(),
        industry: alphaVantage.overview?.industry || yahoo.overview?.industry || '',
        sector: alphaVantage.overview?.sector || yahoo.overview?.sector || '',
        currentPrice: alphaVantage.overview?.currentPrice || yahoo.overview?.currentPrice || '',
        priceChange: yahoo.overview?.priceChange || '',
        priceChangePercent: yahoo.overview?.priceChangePercent || '',
        marketStatus: yahoo.overview?.marketStatus || 'Unknown'
      },
      quickStats: {
        ...finviz.quickStats,
        ...yahoo.quickStats,
        ...alphaVantage.quickStats,
        marketCap: alphaVantage.quickStats?.marketCap || finviz.quickStats?.marketCap || yahoo.quickStats?.marketCap || '',
        peRatio: alphaVantage.quickStats?.peRatio || finviz.quickStats?.peRatio || yahoo.quickStats?.peRatio || '',
        dividendYield: alphaVantage.quickStats?.dividendYield || finviz.quickStats?.dividendYield || yahoo.quickStats?.dividendYield || '',
        weekHigh52: alphaVantage.quickStats?.weekHigh52 || finviz.quickStats?.weekHigh52 || yahoo.quickStats?.weekHigh52 || '',
        weekLow52: alphaVantage.quickStats?.weekLow52 || finviz.quickStats?.weekLow52 || yahoo.quickStats?.weekLow52 || '',
        avgDailyVolume: finviz.quickStats?.avgDailyVolume || yahoo.quickStats?.avgDailyVolume || ''
      },
      financials: {
        revenue: financial.revenue || [],
        cogs: financial.cogs || [],
        grossProfit: financial.grossProfit || [],
        operatingExpenses: financial.operatingExpenses || [],
        operatingIncome: financial.operatingIncome || [],
        netIncome: financial.netIncome || [],
        eps: financial.eps || [],
        totalAssets: financial.totalAssets || [],
        totalLiabilities: financial.totalLiabilities || [],
        shareholdersEquity: financial.shareholdersEquity || [],
        cashAndEquivalents: financial.cashAndEquivalents || [],
        shortTermDebt: financial.shortTermDebt || [],
        longTermDebt: financial.longTermDebt || [],
        operatingCashFlow: financial.operatingCashFlow || [],
        investingCashFlow: financial.investingCashFlow || [],
        financingCashFlow: financial.financingCashFlow || [],
        freeCashFlow: financial.freeCashFlow || []
      },
      keyMetrics: {
        ...finviz.keyMetrics,
        ...alphaVantage.keyMetrics,
        grossMargin: alphaVantage.keyMetrics?.grossMargin || finviz.keyMetrics?.grossMargin || '',
        operatingMargin: alphaVantage.keyMetrics?.operatingMargin || finviz.keyMetrics?.operatingMargin || '',
        netMargin: alphaVantage.keyMetrics?.netMargin || finviz.keyMetrics?.netMargin || '',
        roe: alphaVantage.keyMetrics?.roe || finviz.keyMetrics?.roe || '',
        roa: alphaVantage.keyMetrics?.roa || finviz.keyMetrics?.roa || '',
        currentRatio: alphaVantage.keyMetrics?.currentRatio || finviz.keyMetrics?.currentRatio || '',
        quickRatio: alphaVantage.keyMetrics?.quickRatio || finviz.keyMetrics?.quickRatio || '',
        debtToEquity: alphaVantage.keyMetrics?.debtToEquity || finviz.keyMetrics?.debtToEquity || '',
        interestCoverage: alphaVantage.keyMetrics?.interestCoverage || finviz.keyMetrics?.interestCoverage || '',
        assetTurnover: alphaVantage.keyMetrics?.assetTurnover || finviz.keyMetrics?.assetTurnover || '',
        inventoryTurnover: alphaVantage.keyMetrics?.inventoryTurnover || finviz.keyMetrics?.inventoryTurnover || '',
        pbRatio: alphaVantage.keyMetrics?.pbRatio || finviz.keyMetrics?.pbRatio || '',
        evEbitda: alphaVantage.keyMetrics?.evEbitda || finviz.keyMetrics?.evEbitda || ''
      },
      growthTrends: {
        revenueGrowth: [],
        earningsGrowth: [],
        epsGrowth: [],
        years: []
      },
      dividendInfo: {
        currentYield: '',
        payoutRatio: '',
        annualDividend: '',
        paymentHistory: [],
        exDividendDate: '',
        paymentDate: ''
      },
      analystRatings: {
        buyPercent: 0,
        holdPercent: 0,
        sellPercent: 0,
        avgPriceTarget: '',
        priceTargetHigh: '',
        priceTargetLow: '',
        recentChanges: []
      },
      insiderActivity: {
        trades: [],
        ownershipPercent: ''
      },
      competitors: [],
      news: news
    };

    console.log(`Scraping completed for ${ticker}`);
    return mergedData;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get('ticker');

  if (!ticker) {
    return NextResponse.json({ error: 'Ticker parameter is required' }, { status: 400 });
  }

  try {
    const scraper = new StockDataScraper();
    const data = await scraper.scrapeComprehensive(ticker);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in scraper API:', error);
    return NextResponse.json(
      { error: 'Failed to scrape stock data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { ticker } = await request.json();
    
    if (!ticker) {
      return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
    }

    const scraper = new StockDataScraper();
    const data = await scraper.scrapeComprehensive(ticker);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in scraper API:', error);
    return NextResponse.json(
      { error: 'Failed to scrape stock data' },
      { status: 500 }
    );
  }
}