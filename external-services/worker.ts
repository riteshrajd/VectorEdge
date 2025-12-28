// worker.ts
import { Worker, Job } from 'bullmq';
import { Emitter } from '@socket.io/redis-emitter';
import { redisConnection } from '../src/lib/redis.ts'; 
import { getData } from '../src/lib/scrapers/getData.ts';
import http from 'http';

// Initialize Socket Emitter
const io = new Emitter(redisConnection);
const QUEUE_NAME = 'ticker-queue';

console.log("------------------------------------------");
console.log(`🚀 WORKER STARTED`);
console.log(`   Queue: ${QUEUE_NAME}`);
console.log("------------------------------------------");

// --- CORE LOGIC: Used by both User & Prewarm ---
// Returns the data if successful, handles Locking & Caching internally.
async function processAndCacheTicker(ticker: string, jobId: string, name: string = '') {
    const lockKey = `lock:${ticker}`;
    const cacheKey = `ticker:${ticker}`;

    // 1. Check Cache
    const cachedResult = await redisConnection.get(cacheKey);
    if (cachedResult) {
        console.log(`🧠 [${jobId}] Found ${ticker} in cache.`);
        return { source: 'cache', data: JSON.parse(cachedResult) };
    }

    // 2. Acquire Lock (5 mins)
    const acquiredLock = await redisConnection.set(lockKey, 'processing', 'EX', 60 * 5, 'NX');
    if (!acquiredLock) {
        console.log(`🔒 [${jobId}] Lock busy for ${ticker}. Skipping.`);
        return { source: 'locked', data: null };
    }

    try {
        // 3. Fetch Data (Heavy Operation)
        console.log(`⏳ [${jobId}] Fetching external data for ${ticker}: ${name}...`);
        
        // Simulating delay or calling real scraper
        await new Promise((resolve) => setTimeout(resolve, 5000)); 
        const result = await getData(ticker, name);

        // 4. Save to Redis Cache (30 Days)
        await redisConnection.set(cacheKey, JSON.stringify(result), 'EX', 60 * 60 * 2);
        console.log(`📦 [${jobId}] Cached ${ticker} to Redis.`);
        console.log(`***Woker -> data cached: ${JSON.stringify(result)}`);

        return { source: 'fetch', data: result };

    } catch (error) {
        console.error(`❌ [${jobId}] Failed processing ${ticker}:`, error);
        throw error;
    } finally {
        // 5. Release Lock
        await redisConnection.del(lockKey);
    }
}

// --- WORKER DEFINITION ---
const worker = new Worker(QUEUE_NAME, async (job: Job) => {
    const { ticker, name} = job.data;
    
    // Switch behavior based on Job Name
    if (job.name === 'prewarm-ticker') {
        // === PREWARM MODE ===
        // Just fetch and cache. NO SOCKETS.
        console.log(`🌙 [Prewarm] Starting ${ticker}...`);
        await processAndCacheTicker(ticker, job.id!, name);
        console.log(`✅ [Prewarm] Finished ${ticker}.`);
        return { status: 'prewarmed' };
    } 
    else {
        // === USER MODE ===
        // Fetch, Cache, AND Notify User via Socket.
        console.log(`👤 [User] Processing request for ${ticker}...`);
        
        await new Promise((resolve) => setTimeout(resolve, 5000));


        const result = await processAndCacheTicker(ticker, job.id!, name);

        // If locked or skipped, we might send a specific status, 
        // but generally we only emit if we have data.
        if (result.data) {
            io.to(ticker).emit('job-completed', result.data);
            console.log(`📡 [User] Signal sent to room: ${ticker}`);
        }
        
        return result.data;
    }

}, {
    connection: redisConnection,
    concurrency: 5, // Can handle multiple prewarms at once
});

worker.on('completed', (job) => {
    console.log(`🎉 Job ${job.id} (${job.name}) completed.`);
});

worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed: ${err.message}`);
});


// --- RENDER KEEP-ALIVE ---
// This dummy server prevents Render from killing the worker for being "unresponsive"
const PORT = process.env.PORT || 8080;
const healthServer = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Worker is active and processing jobs.');
});

healthServer.listen(PORT, () => {
  console.log(`Worker health check listener running on port ${PORT}`);
});