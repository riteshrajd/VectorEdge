import { NextResponse } from 'next/server';
import { searchTickersInDB } from '@/lib/actions/ticker-data-db-actions';
// import { CombinedData } from '@/lib/types';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ticker = url.searchParams.get('ticker')?.toUpperCase() || '';

  if(!ticker.trim()) {
    return NextResponse.json({ error: 'No ticker provided' }, { status: 400 })
  }
  const result = await searchTickersInDB(ticker);
  return NextResponse.json(result);
}