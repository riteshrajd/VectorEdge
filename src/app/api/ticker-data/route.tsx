import { getData } from '@/lib/scrapers/getData';
import { checkUserAuth } from '@/utils/authMiddleware';
import { NextResponse } from 'next/server';
// import { CombinedData } from '@/lib/types';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ticker = url.searchParams.get('ticker')?.toUpperCase() || '';
  const refresh = url.searchParams.has('refresh') || false;

  if(!ticker) return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
  if(!checkUserAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await getData(ticker, refresh);
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) console.error(`error during fetching data for ${ticker}:`, error.message);
    return NextResponse.json({ error: 'Failed to aggregate data' }, { status: 500 });
  }
}