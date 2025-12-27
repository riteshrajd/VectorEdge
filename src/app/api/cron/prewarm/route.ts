import { NextResponse } from 'next/server';
import { Queue } from 'bullmq';
import { redisConnection } from '@/lib/redis';

// Ensure this matches your worker
const QUEUE_NAME = 'ticker-queue';

const POPULAR_TICKERS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA'
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
    for (const ticker of POPULAR_TICKERS) {
      try {
        console.log(`📥 [CRON] Enqueuing ${ticker}...`);

        await queue.add(
          'prewarm-ticker', // 👈 This name triggers the "No Socket" logic in worker
          { ticker },
          {
            // Create a unique job ID per day so we don't spam duplicate jobs
            jobId: `prewarm:${ticker}:${new Date().toISOString().split('T')[0]}`, 
            removeOnComplete: true,
            removeOnFail: true,
          }
        );
        addedCount++;
      } catch (innerErr) {
        console.error(`❌ [CRON] Failed to add ${ticker}`, innerErr);
        errors.push({ ticker, error: innerErr });
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