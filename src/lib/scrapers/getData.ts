import fs from 'fs';
import path from 'path';
import { aggregateData } from './aggrigator';
import { getInsightData } from './generateInsight';

// Define cache directory and time limit (in milliseconds)
const CACHE_DIR = 'C:/Users/rites/Desktop/vscode/Web_Dev/projects/vectoredge-pro/src/lib/cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds


export async function getData(ticker: string, refresh: boolean): Promise<any> {
  // Ensure cache directory exists
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  const filePath = path.join(CACHE_DIR, `${ticker}.json`);

  console.log(`refreshing? ${refresh}`)

  // Check if cached data exists
  if (fs.existsSync(filePath) && !refresh) {
    try {
      const cachedData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const lastUpdated = new Date(cachedData.last_updated).getTime();
      const now = Date.now();

      // Check if cache is still valid
      if (now - lastUpdated < CACHE_DURATION) {
        console.log(`Using cached data for ${ticker}`);
        return cachedData;
      }
    } catch (error) {
      console.error(`Error reading or parsing cache for ${ticker}:`, error);
    }
  }
  
  // Fetch new data if no valid cache
  console.log(`Fetching new data for ${ticker}`);
  // const data = await aggregateData(ticker);                                    
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));                       
  console.log(`data fetched successfully! \n ${data}`)
  
  // const insights = await getInsightData(data);                                   


  const enrichedData = {
    ...data,
    // ai_insights: insights ? insights.ai_insights : null,                   
  };

  try {
    fs.writeFileSync(filePath, JSON.stringify(enrichedData, null, 2));
    console.log(`Data scraped and saved to cache for ${ticker}`);
  } catch (error) {
    console.error(`Error writing to cache for ${ticker}:`, error);
  }

  return enrichedData;
}