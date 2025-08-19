import { aggregateData } from './aggrigator';
import { getInsightData } from './generateInsight';
import { CombinedData } from '@/types/types';

// Define cache directory and time limit (in milliseconds)
const CACHE_DURATION = 24 * 60 * 60 * 1000 * 7; // 7 days in milliseconds

import { fetchCachedTickerData, updateCachedTickerData } from '@/lib/actions/ticker-data-db-actions';


export async function getData(ticker: string, refresh: boolean): Promise<CombinedData> {
  console.log(`refreshing? ${refresh}`)

  if (!refresh) {
    const { data: cachedData } = await fetchCachedTickerData(ticker);
    
    if (cachedData) {
      const lastUpdated = new Date(cachedData.last_updated).getTime();
      const now = Date.now();

      // Check if cache is still valid
      if (now - lastUpdated < CACHE_DURATION) {
        console.log(`Using cached data for ${ticker} from DB`);
        return cachedData;
      }
    }
  }
  
  // Fetch new data if no valid cache
  console.log(`Fetching new data for ${ticker}`);
  const data = await aggregateData(ticker);
  // const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));                         
  const insights = await getInsightData(data);                                   


  const enrichedData = {
    ...data,
    ai_insights: insights ? insights.ai_insights : null,                   
  };

  // --- 3. Replace fs.writeFileSync with a database call ---
  const { error } = await updateCachedTickerData(ticker, enrichedData as CombinedData);
  if (error) {
    console.error(`Error writing to DB cache for ${ticker}:`, error);
  } else {
    console.log(`Data scraped and saved to DB cache for ${ticker}`);
  }

  return enrichedData as CombinedData;
}