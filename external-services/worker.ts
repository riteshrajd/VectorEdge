// worker.ts

import { Worker } from 'bullmq';
import { Emitter } from '@socket.io/redis-emitter';
// FIX 1: Correct path (assuming worker.ts is in root)
import { redisConnection } from '../src/lib/redis.ts'; 

// We can reuse the connection for the Emitter
const io = new Emitter(redisConnection);

const QUEUE_NAME = 'ticker-queue';

console.log("------------------------------------------");
console.log(`🚀 WORKER STARTED`);
console.log(`   Queue: ${QUEUE_NAME}`);
console.log(`   Redis: ${process.env.REDIS_URL || 'localhost'}`);
console.log("------------------------------------------");

const worker = new Worker(QUEUE_NAME, async (job) => {
    const { ticker } = job.data;
    const lockKey = `lock:${ticker}`;

    // --- 1. Optimization Check ---
    // If another worker just finished this job 1ms ago, we don't want to redo it.
    const cachedResult = await redisConnection.get(`ticker:${ticker}`);

    if (cachedResult) {
        console.log(`🧠 Worker found ${ticker} in cache. Skipping analysis.`);
        const parsedResult = JSON.parse(cachedResult);
        
        // Notify the user instantly
        io.to(ticker).emit('job-completed', parsedResult);
        
        // FIX 2: STOP HERE! Don't do the work.
        return parsedResult; 
    }

    // --- 2. Locking ---
    // Attempt to acquire a lock for 5 minutes
    const aquiredLock = await redisConnection.set(lockKey, 'processing', 'EX', 60*5, 'NX');

    if (!aquiredLock) {
        console.log(`🔒 Lock exists for ${ticker}. Skipping job ${job.id}.`);
        return { status: 'skipped', message: 'Already processing.' };
    }

    try {
        // --- 3. The Work ---
        console.log(`⏳ Simulating 5-second analysis for ${ticker}...`);
        
        // 
        
        await new Promise((resolve) => setTimeout(resolve, 15000));

        const result = {
            ticker: ticker,
            price: parseFloat((Math.random() * 1000).toFixed(2)), 
            analysis: "Gemini AI says: Bullish based on recent market trends.",
            timestamp: new Date().toISOString(),
        };

        console.log(`✅ Analysis complete for ${ticker}. Emitting...`);
        
        // --- 4. Notify Frontend ---
        io.to(ticker).emit('job-completed', result);
        console.log(`📡 Signal sent to room: ${ticker}`);

        // --- 5. Save to Cache ---
        const cacheKey = `ticker:${ticker}`;
        await redisConnection.set(cacheKey, JSON.stringify(result), 'EX', 60*60*24*30); // 30 Days
        console.log(`📦 Saved to Redis.`);

        return result;

    } catch (error) {
        console.error(`❌ Job failed for ${ticker}:`, error);
        throw error;
    } finally {
        // --- 6. Cleanup ---
        await redisConnection.del(lockKey);
    }
}, {
    connection: redisConnection,
    concurrency: 1,
});

worker.on('completed', (job) => {
    console.log(`🎉 Job ${job.id} finished successfully.`);
});

worker.on('failed', (job, error) => {
    console.error(`❌ Job ${job?.id} failed:`, error);
});


/*

ritesh@fedora:~/Desktop/vscode/web-dev/VectorEdge/external-services$ docker exec -it vectoredge_redis redis-cli
127.0.0.1:6379> DEL ticker:TSLA
(integer) 1
127.0.0.1:6379> exit
ritesh@fedora:~/Desktop/vscode/web-dev/VectorEdge/external-services$

i think something got fucked up, cause everything works fine but when i select tsla then there are infinite checing loop


✋ LEVEL 3: No cache found. Asking user. useTickerDataFlow.ts:173:33
🔍 FLOW: Checking availability for TSLA useTickerDataFlow.ts:123:14
🔍 FLOW: Checking availability for TSLA useTickerDataFlow.ts:123:14
✋ LEVEL 3: No cache found. Asking user. useTickerDataFlow.ts:153:16
🔍 FLOW: Checking availability for TSLA useTickerDataFlow.ts:123:14
🔍 FLOW: Checking availability for TSLA useTickerDataFlow.ts:123:14
✋ LEVEL 3: No cache found. Asking user. useTickerDataFlow.ts:153:16
🔍 FLOW: Checking availability for TSLA useTickerDataFlow.ts:123:14
🔍 FLOW: Checking availability for TSLA useTickerDataFlow.ts:123:14
✋ LEVEL 3: No cache found. Asking user. useTickerDataFlow.ts:153:16
🔍 FLOW: Checking availability for TSLA useTickerDataFlow.ts:123:14
🔍 FLOW: Checking availability for TSLA useTickerDataFlow.ts:123:14
✋ LEVEL 3: No cache found. Asking user. useTickerDataFlow.ts:153:16
🔍 FLOW: Checking availability for TSLA useTickerDataFlow.ts:123:14
🔍 FLOW: Checking availability for TSLA useTickerDataFlow.ts:123:14
✋ LEVEL 3: No cache found. Asking user. useTickerDataFlow.ts:153:16
🔍 FLOW: Checking availability for TSLA useTickerDataFlow.ts:123:14
🔍 FLOW: Checking availability for TSLA useTickerDataFlow.ts:123:14
✋ LEVEL 3: No cache found. Asking user. useTickerDataFlow.ts:153:16
🔍 FLOW: Checking availability for TSLA useTickerDataFlow.ts:123:14
🔍 FLOW: Checking availability for TSLA useTickerDataFlow.ts:123:14
✋ LEVEL 3: No cache found. Asking user. useTickerDataFlow.ts:153:16
🔍 FLOW: Checking availability for TSLA useTickerDataFlow.ts:123:14
🔍 FLOW: Checking availability for TSLA useTickerDataFlow.ts:123:14
✋ LEVEL 3: No cache found. Asking user. useTickerDataFlow.ts:153:16
🔍 FLOW: Checking availability for TSLA useTickerDataFlow.ts:123:14
🔍 FLOW: Checking availability for TSLA useTickerDataFlow.ts:123:14
✋ LEVEL 3: No cache found. Asking user. useTickerDataFlow.ts:153:16
🔍 FLOW: Checking availability for TSLA

*/
