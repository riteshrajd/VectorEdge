// File path: /lib/scrapers/core/base-scraper.ts

import axios, { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import { RateLimiter } from './rate-limiter';

export abstract class BaseScraper {
  protected rateLimiter: RateLimiter;
  
  constructor(requestsPerSecond: number = 2) {
    this.rateLimiter = new RateLimiter(requestsPerSecond);
  }

  protected async fetchHTML(url: string, headers?: Record<string, string>): Promise<cheerio.CheerioAPI> {
    await this.rateLimiter.waitForNext();
    
    const defaultHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      ...headers
    };

    try {
      const response: AxiosResponse = await axios.get(url, {
        headers: defaultHeaders,
        timeout: 10000,
        maxRedirects: 5
      });
      
      return cheerio.load(response.data);
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  }

  protected async fetchJSON(url: string, headers?: Record<string, string>): Promise<any> {
    await this.rateLimiter.waitForNext();
    
    const defaultHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json',
      'Referer': 'https://finance.yahoo.com/',
      ...headers
    };

    try {
      const response = await axios.get(url, {
        headers: defaultHeaders,
        timeout: 10000
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching JSON from ${url}:`, error);
      throw error;
    }
  }

  protected parseNumber(value: string | number): number {
    if (typeof value === 'number') return value;
    if (!value || value === 'N/A' || value === '--') return 0;
    
    const cleaned = value.toString().replace(/[,%$]/g, '');
    
    if (cleaned.includes('B')) {
      return parseFloat(cleaned.replace('B', '')) * 1000000000;
    } else if (cleaned.includes('M')) {
      return parseFloat(cleaned.replace('M', '')) * 1000000;
    } else if (cleaned.includes('K')) {
      return parseFloat(cleaned.replace('K', '')) * 1000;
    }
    
    return parseFloat(cleaned) || 0;
  }

  protected parsePercentage(value: string): number {
    if (!value || value === 'N/A') return 0;
    return parseFloat(value.replace('%', '')) / 100;
  }

  protected retry<T>(fn: () => Promise<T>, retries: number = 3): Promise<T> {
    return fn().catch(err => {
      if (retries > 0) {
        console.log(`Retrying... ${retries} attempts left`);
        return new Promise(resolve => setTimeout(resolve, 1000))
          .then(() => this.retry(fn, retries - 1));
      }
      throw err;
    });
  }
}