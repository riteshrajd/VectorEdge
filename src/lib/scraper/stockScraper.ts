// lib/stockScraper.ts
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

class StockScraper {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async scrapeYahooFinance(ticker: string): Promise<Partial<FundamentalData>> {
    const baseUrl = `https://finance.yahoo.com/quote/${ticker}`;
    
    try {
      const response = await axios.get(baseUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);

      // Company Overview
      const overview: CompanyOverview = {
        name: $('h1[data-field="symbol"]').text().trim(),
        ticker: ticker.toUpperCase(),
        industry: $('span[data-test="INDUSTRY"]').text().trim(),
        sector: $('span[data-test="SECTOR"]').text().trim(),
        currentPrice: $('fin-streamer[data-field="regularMarketPrice"]').text().trim(),
        priceChange: $('fin-streamer[data-field="regularMarketChange"]').text().trim(),
        priceChangePercent: $('fin-streamer[data-field="regularMarketChangePercent"]').text().trim(),
        marketStatus: $('span[data-test="MARKET_STATUS"]').text().trim()
      };

      // Quick Stats
      const quickStats: QuickStats = {
        marketCap: $('fin-streamer[data-field="marketCap"]').text().trim(),
        peRatio: $('fin-streamer[data-field="trailingPE"]').text().trim(),
        dividendYield: $('fin-streamer[data-field="trailingAnnualDividendYield"]').text().trim(),
        weekHigh52: $('fin-streamer[data-field="fiftyTwoWeekHigh"]').text().trim(),
        weekLow52: $('fin-streamer[data-field="fiftyTwoWeekLow"]').text().trim(),
        avgDailyVolume: $('fin-streamer[data-field="averageVolume"]').text().trim()
      };

      return { overview, quickStats };
    } catch (error) {
      console.error(`Error scraping Yahoo Finance for ${ticker}:`, error);
      return {};
    }
  }

  async scrapeFinancials(ticker: string): Promise<Partial<FinancialStatement>> {
    const financialsUrl = `https://finance.yahoo.com/quote/${ticker}/financials`;
    
    try {
      const response = await axios.get(financialsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);

      // Extract financial data from tables
      const revenue: number[] = [];
      const netIncome: number[] = [];
      const eps: number[] = [];

      $('div[data-test="fin-row"]').each((i, element) => {
        const rowTitle = $(element).find('div[data-test="fin-col"]').first().text().trim();
        const values = $(element).find('div[data-test="fin-col"]').not(':first').map((_, el) => {
          const text = $(el).text().trim();
          return text ? parseFloat(text.replace(/[,$]/g, '')) : 0;
        }).get();

        if (rowTitle.includes('Total Revenue')) {
          revenue.push(...values);
        } else if (rowTitle.includes('Net Income')) {
          netIncome.push(...values);
        } else if (rowTitle.includes('Basic EPS')) {
          eps.push(...values);
        }
      });

      return {
        revenue: revenue.slice(0, 5),
        netIncome: netIncome.slice(0, 5),
        eps: eps.slice(0, 5)
      };
    } catch (error) {
      console.error(`Error scraping financials for ${ticker}:`, error);
      return {};
    }
  }

  async scrapeMarketWatch(ticker: string): Promise<Partial<FundamentalData>> {
    const url = `https://www.marketwatch.com/investing/stock/${ticker}`;
    
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);

      // Key Metrics
      const keyMetrics: Partial<KeyMetrics> = {
        grossMargin: $('mw-rangeBar[data-module="KeyData"] li:contains("Gross Margin")').find('.primary').text().trim(),
        operatingMargin: $('mw-rangeBar[data-module="KeyData"] li:contains("Operating Margin")').find('.primary').text().trim(),
        netMargin: $('mw-rangeBar[data-module="KeyData"] li:contains("Net Margin")').find('.primary').text().trim(),
        roe: $('mw-rangeBar[data-module="KeyData"] li:contains("Return on Equity")').find('.primary').text().trim(),
        roa: $('mw-rangeBar[data-module="KeyData"] li:contains("Return on Assets")').find('.primary').text().trim()
      };

      return { keyMetrics };
    } catch (error) {
      console.error(`Error scraping MarketWatch for ${ticker}:`, error);
      return {};
    }
  }

  async scrapeFinviz(ticker: string): Promise<Partial<FundamentalData>> {
    const url = `https://finviz.com/quote.ashx?t=${ticker}`;
    
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);

      // Extract data from Finviz snapshot table
      const quickStats: Partial<QuickStats> = {};
      const keyMetrics: Partial<KeyMetrics> = {};

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
          }
        }
      });

      return { quickStats, keyMetrics };
    } catch (error) {
      console.error(`Error scraping Finviz for ${ticker}:`, error);
      return {};
    }
  }

  async scrapeGoogleFinance(ticker: string): Promise<Partial<FundamentalData>> {
    const url = `https://www.google.com/finance/quote/${ticker}:NASDAQ`;
    
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);

      // Extract news
      const news: NewsEvent[] = [];
      $('div[data-article-id]').each((i, element) => {
        const headline = $(element).find('div[role="heading"]').text().trim();
        const source = $(element).find('div[data-source]').text().trim();
        const date = $(element).find('div[data-date]').text().trim();
        const url = $(element).find('a').attr('href') || '';

        if (headline && source) {
          news.push({ headline, source, date, url });
        }
      });

      return { news: news.slice(0, 10) };
    } catch (error) {
      console.error(`Error scraping Google Finance for ${ticker}:`, error);
      return {};
    }
  }

  async scrapeSeekingAlpha(ticker: string): Promise<Partial<FundamentalData>> {
    const url = `https://seekingalpha.com/symbol/${ticker}`;
    
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);

      // Analyst Ratings
      const analystRatings: Partial<AnalystRatings> = {
        buyPercent: 0,
        holdPercent: 0,
        sellPercent: 0,
        avgPriceTarget: '',
        priceTargetHigh: '',
        priceTargetLow: '',
        recentChanges: []
      };

      // Extract analyst data
      $('div[data-test-id="analyst-ratings"]').each((i, element) => {
        const ratings = $(element).find('div[data-test-id="rating-breakdown"]');
        // Parse ratings data here
      });

      return { analystRatings };
    } catch (error) {
      console.error(`Error scraping Seeking Alpha for ${ticker}:`, error);
      return {};
    }
  }

  async scrapeComprehensive(ticker: string): Promise<FundamentalData> {
    console.log(`Starting comprehensive scrape for ${ticker}...`);

    // Scrape from multiple sources
    const [
      yahooData,
      financialData,
      marketWatchData,
      finvizData,
      googleData,
      seekingAlphaData
    ] = await Promise.all([
      this.scrapeYahooFinance(ticker),
      this.scrapeFinancials(ticker),
      this.scrapeMarketWatch(ticker),
      this.scrapeFinviz(ticker),
      this.scrapeGoogleFinance(ticker),
      this.scrapeSeekingAlpha(ticker)
    ]);

    // Merge all data
    const mergedData: FundamentalData = {
      overview: yahooData.overview || {} as CompanyOverview,
      quickStats: { ...yahooData.quickStats, ...finvizData.quickStats } as QuickStats,
      financials: financialData as FinancialStatement,
      keyMetrics: { ...marketWatchData.keyMetrics, ...finvizData.keyMetrics } as KeyMetrics,
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
      analystRatings: seekingAlphaData.analystRatings || {} as AnalystRatings,
      insiderActivity: {
        trades: [],
        ownershipPercent: ''
      },
      competitors: [],
      news: googleData.news || []
    };

    console.log(`Scraping completed for ${ticker}`);
    return mergedData;
  }
}

export default StockScraper;