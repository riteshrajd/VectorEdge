import puppeteer, { Page } from 'puppeteer';
import { parseYahooFundamental } from './parseYahooFundamental';
import { Fundamental } from '@/types/types';

export async function scrapeYahooFundamental(url: string): Promise<Fundamental | null> {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1280, height: 800 });

        // navigation
        console.log(`Navigating to ${url}`);
        await navigateWithRetry(page, url);

        console.log(`fundamental page loaded successfully`);

        // extract text
        const pageText = await extractTextWithRetry(page);
        console.log('Extracted text from technical page');

        const cleanedText = pageText ? pageText.replace(/\n+/g, '\n').trim() : '';
        const jsonData = await parseTextWithRetry(cleanedText);
        console.log(`JSON fundamental data extracted`);
        return jsonData ? jsonData : null;

    } catch (error) {
        if(error instanceof Error)console.error('Error during scraping:', error.message);
        throw error;

    } finally {
        await browser.close();
        console.log('Browser closed');
    }
}


async function navigateWithRetry(page: Page, url: string, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      return;
    } catch (error) {
      if (i === retries - 1) throw error;
      if(error instanceof Error)console.log(`Retry ${i + 1} for ${url} due to: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // 5s delay before retry
    }
  }
}

// Helper function to retry text extraction
async function extractTextWithRetry(page: Page, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      const text = await page.evaluate(() => document.body.innerText);
      if (text && text.length > 0) return text; // Ensure non-empty text
      throw new Error('Empty or invalid page content');
    } catch (error) {
      if (i === retries - 2) await page.reload({ waitUntil: 'networkidle2', timeout: 60000 }); // Reload before last retry
      if (i === retries - 1) throw error;
      if(error instanceof Error)console.log(`Retry ${i + 1} for text extraction due to: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 3s delay before retry
    }
  }
}

async function parseTextWithRetry(cleanedText: string, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      const jsonData = await parseYahooFundamental(cleanedText);
      return jsonData
    } catch (error) {
      if (i === retries - 1) throw error;
      if(error instanceof Error)console.log(`Retry ${i + 1} for text parsing due to: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 3s delay before retry
    }
  }
}