import { scrapeYahooOverview } from './overview/scrapeYahooOverview';
import { scrapeYahooFundamental } from './fundamental/scrapeYahooFundamental';
import { scrapeYahooAnalysis } from './analysis/scrapeYahooAnalysis';
import { scrapeTradingViewTechnicals } from './technical/scrapeTradingViewTechnicals';
import { CombinedData } from '@/types/types';

export async function aggregateData(ticker: string): Promise<CombinedData> {
  const urls = {
    overview: `https://finance.yahoo.com/quote/${ticker}/`,
    fundamental: `https://finance.yahoo.com/quote/${ticker}/key-statistics/`,
    analysis: `https://finance.yahoo.com/quote/${ticker}/analysis/`,
    technicals: `https://www.tradingview.com/symbols/${ticker}/technicals/`,
  };

  const [overviewData, fundamentalData, analysisData, technicalsData] = await Promise.all([
    scrapeYahooOverview(urls.overview),
    scrapeYahooFundamental(urls.fundamental),
    scrapeYahooAnalysis(urls.analysis),
    scrapeTradingViewTechnicals(urls.technicals),
  ]);
  
  console.log(`Aggregated data for ${ticker}: ${JSON.stringify(technicalsData)}`)

  return {
    ticker,
    last_updated: new Date().toISOString(),
    overview: overviewData.overview,
    fundamental: fundamentalData.fundamental,
    analysis: analysisData.analysis,
    technicals: technicalsData.technicals,    
  };
}