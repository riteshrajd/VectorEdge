import { fetchDummyData } from './fetchDummyData.ts';
import { aggregateData } from './aggrigator';
// import { getInsightData } from './generateInsight';
import type { CombinedData } from '../../types/types.ts';

export async function getData(ticker: string): Promise<CombinedData> {
  console.log(`⚡ worker: Fetching FRESH data for ${ticker}...`);

  let data: CombinedData;

  try {
    data = await aggregateData(ticker);
  } catch (error) {
    if(error instanceof Error) console.log(`error occured during scrapping data: ${error.message} \nfalling back to preloaded data`)
    console.warn('⚠️ Scraping failed, using free Yahoo data');   
    data = await fetchDummyData(ticker);
    return data;
  }

  // let insights = null;
  // try {u
  //   const insightResult = await getInsightData(data);
  //   insights = insightResult?.ai_insights ?? null;
  // } catch (e) {
  //   console.error('AI Insight generation failed:', e);
  // }

  return {
    ...data,
    ai_insights: null,
  };
}
