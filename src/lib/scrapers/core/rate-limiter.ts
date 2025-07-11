// File path: /lib/scrapers/core/rate-limiter.ts

export class RateLimiter {
  private queue: Array<{ resolve: () => void; timestamp: number }> = [];
  private requestsPerSecond: number;
  private lastRequestTime: number = 0;
  private processing: boolean = false;

  constructor(requestsPerSecond: number = 2) {
    this.requestsPerSecond = requestsPerSecond;
  }

  async waitForNext(): Promise<void> {
    return new Promise((resolve) => {
      const now = Date.now();
      this.queue.push({ resolve, timestamp: now });
      
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private processQueue(): void {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const { resolve } = this.queue.shift()!;
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minInterval = 1000 / this.requestsPerSecond;

    if (timeSinceLastRequest >= minInterval) {
      this.lastRequestTime = now;
      resolve();
      setImmediate(() => this.processQueue());
    } else {
      const delay = minInterval - timeSinceLastRequest;
      setTimeout(() => {
        this.lastRequestTime = Date.now();
        resolve();
        setImmediate(() => this.processQueue());
      }, delay);
    }
  }
}