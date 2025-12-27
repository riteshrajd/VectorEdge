import { NextResponse } from 'next/server';
import { Queue } from 'bullmq';
import { redisConnection } from '@/lib/redis';

// Ensure this matches the queue name in your worker.ts
const QUEUE_NAME = 'ticker-queue';

// Create the queue instance sharing the same Redis connection logic
const tickerQueue = new Queue(QUEUE_NAME, { connection: redisConnection });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get('ticker');
  const name = searchParams.get('name');

  console.log(`🔵 API: /ticker-data called for: ${ticker}`);

  try {
    if (!ticker) {
      return NextResponse.json({ message: 'Ticker is required' }, { status: 400 });
    }

    const normalizedTicker = ticker.toUpperCase();

    // 1. Check Cache First (Standard Efficiency Check)
    const cacheKey = `ticker:${normalizedTicker}`;
    const cachedData = await redisConnection.get(cacheKey);

    if (cachedData) { 
      console.log(`✅ API: Cache HIT for ${normalizedTicker}. Serving from Redis.`);
      return NextResponse.json({
        status: 'success',
        source: 'cache',
        data: JSON.parse(cachedData),
      }, { status: 200 });
    }

    // 2. Cache Miss? Add to Queue.
    console.log(`🟡 API: Cache MISS for ${normalizedTicker}. Adding job to queue.`);
    
    await tickerQueue.add('analyze-stock', { ticker: normalizedTicker, name });

    // 3. Return "Processing" immediately so frontend knows to listen to Socket
    return NextResponse.json({
      status: 'processing',
      message: 'Analysis has been started. You will be notified when it is complete.',
      ticker: normalizedTicker,
    }, { status: 202 });

  } catch (error) {
    console.error('🔴 API: Error', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
} 