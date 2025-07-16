import { getData } from '@/lib/scrapers/getData';
import { NextResponse } from 'next/server';
// import { CombinedData } from '@/lib/types';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ticker = url.searchParams.get('ticker')?.toUpperCase() || 'AAPL';
  const refresh = url.searchParams.has('refresh') || false;

  try {
    const data = await getData(ticker, refresh);
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) console.error(`error during fetching data for ${ticker}:`, error.message);
    return NextResponse.json({ error: 'Failed to aggregate data' }, { status: 500 });
  }
}