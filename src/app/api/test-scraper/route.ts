import { NextResponse } from 'next/server';
import { getData } from '@/lib/scrapers/getData'; // Adjust this path if needed

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Default to 'AAPL' if no ticker is provided
  const ticker = searchParams.get('ticker')?.toUpperCase() || 'AAPL';

  console.log(`🧪 TEST ROUTE: Starting scrape for ${ticker}...`);

  try {
    const data = await getData(ticker);

    return NextResponse.json({
      status: 'success',
      ticker,
      data: data
    });

  } catch (error: unknown) {
    console.error(`❌ TEST ROUTE Error:`, error);
    return NextResponse.json({ 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Scraping failed' 
    }, { status: 500 });
  } 
}