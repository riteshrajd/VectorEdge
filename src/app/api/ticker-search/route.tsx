import { NextResponse } from 'next/server';
import { searchTickersInDB } from '@/lib/actions/ticker-data-db-actions';
import { checkUserAuth } from '@/utils/authMiddleware';
// import { CombinedData } from '@/lib/types';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ticker = url.searchParams.get('ticker')?.toUpperCase() || '';

  if(!checkUserAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if(!ticker.trim()) {
    return NextResponse.json({ error: 'No ticker provided' }, { status: 400 })
  }
  const result = await searchTickersInDB(ticker);
  return NextResponse.json(result);
}