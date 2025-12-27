import { scrapeYahooOverview } from './overview/scrapeYahooOverview';
import { scrapeYahooFundamental } from './fundamental/scrapeYahooFundamental';
import { scrapeYahooAnalysis } from './analysis/scrapeYahooAnalysis';
import { scrapeTradingViewTechnicals } from './technical/scrapeTradingViewTechnicals';
import { CombinedData } from '@/types/types';

export async function aggregateData(ticker: string): Promise<CombinedData> {
  const baseYahoo = `https://finance.yahoo.com/quote/${ticker}`;
  const baseTV = `https://www.tradingview.com/symbols/${ticker}`;

  const overviewUrl = `${baseYahoo}/`;
  const fundamentalUrl = `${baseYahoo}/key-statistics/`;
  const analysisUrl = `${baseYahoo}/analysis/`;
  const technicalsUrl = `${baseTV}/technicals/`;

  // 1️⃣ OVERVIEW (fail immediately)
  const overviewData = await scrapeYahooOverview(overviewUrl);
  if (!overviewData) {
    throw new Error('Overview scrape failed');
  }

  // 2️⃣ FUNDAMENTAL
  const fundamentalData = await scrapeYahooFundamental(fundamentalUrl);
  if (!fundamentalData) {
    throw new Error('Fundamental scrape failed');
  }

  // 3️⃣ ANALYSIS
  const analysisData = await scrapeYahooAnalysis(analysisUrl);
  if (!analysisData) {
    throw new Error('Analysis scrape failed');
  }

  // 4️⃣ TECHNICALS
  const technicalsData = await scrapeTradingViewTechnicals(technicalsUrl);
  if (!technicalsData) {
    throw new Error('Technicals scrape failed');
  }

  return {
    ticker,
    last_updated: new Date().toISOString(),
    overview: overviewData.overview,
    fundamental: fundamentalData.fundamental,
    analysis: analysisData.analysis,
    technicals: technicalsData.technicals,
  };
}
