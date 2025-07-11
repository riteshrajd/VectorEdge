// File path: /lib/scrapers/core/price-fetcher.ts

import axios from 'axios';

export class PriceFetcher {
  static async getCurrentPrice(ticker: string): Promise<number> {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`;
      const response = await axios.get(url);
      return response.data.chart.result[0].meta.regularMarketPrice;
    } catch (error) {
      console.error(`Error fetching price for ${ticker}:`, error);
      return 0;
    }
  }

  static async getMarketStatus(): Promise<'OPEN' | 'CLOSED'> {
    try {
      // Simple market hours check (weekdays 9:30-16:00 ET)
      const now = new Date();
      const utcHours = now.getUTCHours();
      const utcDay = now.getUTCDay();
      
      // Convert to ET: UTC-4 (EDT) or UTC-5 (EST)
      const etHours = (utcHours - 4) % 24;
      
      // Monday-Friday 9:30-16:00 ET
      if (utcDay >= 1 && utcDay <= 5 && etHours >= 9.5 && etHours < 16) {
        return 'OPEN';
      }
      return 'CLOSED';
    } catch {
      return 'CLOSED';
    }
  }
}