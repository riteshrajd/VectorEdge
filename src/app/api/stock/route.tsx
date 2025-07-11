// File path: /app/api/stock/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { MainAggregator } from '@/lib/scrapers/main-aggregator';
import axios from 'axios';

async function getCompanyName(ticker: string): Promise<string> {
  try {
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v1/finance/search?q=${ticker}`
    );
    
    // Handle possible undefined response data
    if (!response.data || !response.data.quotes) {
      return `${ticker} Corporation`;
    }
    
    const result = response.data.quotes.find(
      (q: any) => q.symbol === ticker
    );
    
    return result?.longname || result?.shortname || `${ticker} Corporation`;
  } catch (error) {
    console.error(`Error fetching company name for ${ticker}:`, error);
    return `${ticker} Corporation`;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Extract ticker from query parameters
    const ticker = request.nextUrl.searchParams.get('ticker');
    
    if (!ticker) {
      return NextResponse.json(
        { error: 'Ticker parameter is required' },
        { status: 400 }
      );
    }

    const normalizedTicker = ticker.toUpperCase();
    const companyName = await getCompanyName(normalizedTicker);
    
    const aggregator = new MainAggregator();
    const stockData = await aggregator.getStockData(normalizedTicker, companyName);
    
    // Set cache headers (5 minutes cache)
    return NextResponse.json(stockData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'CDN-Cache-Control': 'public, s-maxage=300',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
      }
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}