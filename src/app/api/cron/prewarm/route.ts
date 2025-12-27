import { NextResponse } from 'next/server';
import { Queue } from 'bullmq';
import { redisConnection } from '@/lib/redis';

// Ensure this matches your worker
const QUEUE_NAME = 'ticker-queue';

const POPULAR_TICKERS = [
  {ticker: 'AAPL', name: 'Apple Inc.'}, 
  {ticker: 'MSFT', name: 'Microsoft Corp.'},
  {ticker: 'GOOGL', name: 'Alphabet Inc (Class C)'},
  {ticker: 'AMZN', name: 'Amazon.com Inc.'},
  {ticker: 'TSLA', name: 'Tesla Inc.'},
  {ticker: 'META', name: 'Meta Platforms Inc.'},
];

export async function GET() {
  const timestamp = new Date().toISOString();
  console.log(`🌙 [CRON ${timestamp}] Triggered: Starting Prewarm Job`);

  const queue = new Queue(QUEUE_NAME, {
    connection: redisConnection,
  });

  let addedCount = 0;
  const errors = [];

  try {
    for (const value of POPULAR_TICKERS) {
      try {
        const ticker = value.ticker;
        const name = value.name;

        console.log(`📥 [CRON] Enqueuing ${ticker}...`);

        await queue.add(
          'prewarm-ticker', // 👈 This name triggers the "No Socket" logic in worker
          { ticker, name },
          {
            // Create a unique job ID per day so we don't spam duplicate jobs
            jobId: `prewarm:${ticker}:${new Date().toISOString().split('T')[0]}`, 
            removeOnComplete: true,
            removeOnFail: true,
          }
        );
        addedCount++;
      } catch (innerErr) {
        console.error(`❌ [CRON] Failed to add ${value.ticker}`, innerErr);
        errors.push({ ticker: value.ticker, error: innerErr });
      }
    }
  } catch (err) {
    console.error("❌ [CRON] Critical Queue Error", err);
    return NextResponse.json({ success: false, error: 'Queue connection failed' }, { status: 500 });
  } finally {
    await queue.close();
  }

  console.log(`✅ [CRON] Finished. Added ${addedCount} jobs.`);
  
  return NextResponse.json({
    success: true,
    timestamp,
    jobsAdded: addedCount,
    errors
  });
}