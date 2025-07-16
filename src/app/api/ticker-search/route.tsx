import { NextResponse } from 'next/server';
import { searchTicker } from '@/lib/search/tickerSearch';
// import { CombinedData } from '@/lib/types';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ticker = url.searchParams.get('ticker')?.toUpperCase() || '';
  const limit: number= Number(url.searchParams.get('limit')) || 10;

  if(!ticker.trim()) {
    return NextResponse.json({ error: 'No ticker provided' }, { status: 400 })
  }
  const result = searchTicker(ticker, limit);
  return NextResponse.json(result);
}