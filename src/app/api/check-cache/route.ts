// src/app/api/check-cache/route.ts

import { NextResponse } from 'next/server';
import { redisConnection } from '@/lib/redis';

export async function GET(request: Request) {
  try {
    // 1. Get Ticker from URL
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');

    if (!ticker) {
      return NextResponse.json({ message: 'Ticker symbol is required' }, { status: 400 });
    }

    // 2. Check Redis for the Data
    const cacheKey = `ticker:${ticker.toUpperCase()}`;
    const cachedDataString = await redisConnection.get(cacheKey);

    if (cachedDataString) {
      // ✅ HIT: Data found in Redis
      // We must parse the string back into JSON before sending it
      const data = JSON.parse(cachedDataString);

      return NextResponse.json({
        cached: true,
        data: data
      });
    } else {
      // ❌ MISS: Data not in Redis
      return NextResponse.json({ 
        cached: false 
      });
    }

  } catch (error) {
    console.error('❌ Redis Check Error:', error);
    // If Redis fails, we return cached: false so the app can still try to fetch manually
    return NextResponse.json({ cached: false }, { status: 500 });
  }
}