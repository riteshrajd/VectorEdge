import { scrapeTradingViewTechnicals } from '@/lib/scrapers/technical/scrapeTradingViewTechnicals';
import { NextResponse } from 'next/server';
// import { CombinedData } from '@/lib/types';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ticker = url.searchParams.get('ticker')?.toUpperCase() || 'AAPL';
  try {
    const data = await scrapeTradingViewTechnicals(ticker);
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) console.error(`error during fetching data for ${ticker}:`, error.message);
    return NextResponse.json({ error: 'Failed to aggregate data' }, { status: 500 });
  }
}