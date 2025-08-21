import puppeteer, { Page } from "puppeteer";
import { parseYahooAnalysis } from "./parseYahooAnalysis";
import { Analysis } from "@/types/types";

export async function scrapeYahooAnalysis(url: string): Promise<{analysis: Analysis} | null> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.setViewport({ width: 1280, height: 800 });

    // navigation
    console.log(`Navigating to ${url}`);
    await navigateWithRetry(page, url);

    console.log(`analysis page loaded`);

    try {
      await page.waitForSelector('button[title="10"]', { timeout: 5000 });
      await page.click('button[title="10"]');
      console.log('Clicked button with title="10"');
      await new Promise((resolve) =>
        setTimeout(resolve, 500 + Math.random() * 500)
      );
    } catch (e: unknown) {
      if (e instanceof Error)
        console.warn('Failed to click button with title="10":', e.message);
    }

    try {
      await page.waitForSelector('div[role="option"][data-value="25"]', {
        timeout: 5000,
      });
      await page.click('div[role="option"][data-value="25"]');
      console.log("Selected option for 25 analyst ratings");
      await new Promise((resolve) =>
        setTimeout(resolve, 500 + Math.random() * 500)
      );
    } catch (e: unknown) {
      if (e instanceof Error)
        console.warn(
          'Failed to select option with data-value="25":',
          e.message
        );
    }

    // text extraction
    const pageText = await extractTextWithRetry(page);
    console.log('Extracted text from analysis page');

    const cleanedText = pageText.replace(/\n+/g, "\n").trim();
    const jsonData = await parseTextWithRetry(cleanedText);
    console.log(`JSON analysis data extracted`)
    return jsonData ? jsonData : null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error during scraping:", error.message);
    }
    throw error;
  } finally {
    await browser.close();
    console.log("Browser closed");
  }
}

// Helper function to retry navigation
async function navigateWithRetry(page: Page, url: string, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
      return;
    } catch (error: unknown) {
      if (i === retries - 1) throw error;
      if (error instanceof Error) {
        console.log(`Retry ${i + 1} for ${url} due to: ${error.message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 5000)); // 5s delay before retry
    }
  }
}

// Helper function to retry text extraction
async function extractTextWithRetry(page: Page, retries = 5): Promise<string> {
  for (let i = 0; i < retries; i++) {
    try {
      const text = await page.evaluate(() => document.body.innerText);
      if (text && text.length > 0) return text; // Ensure non-empty text
      throw new Error("Empty or invalid page content");
    } catch (error) {
      if (i === retries - 2)
        await page.reload({ waitUntil: "networkidle2", timeout: 60000 }); // Reload before last retry
      if (i === retries - 1) throw error;
      if (error instanceof Error) console.log(
        `Retry ${i + 1} for text extraction due to: ${error.message}`
      );
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 3s delay before retry
    }
  }
  // This line should be unreachable if retries > 0, but is needed for type safety
  throw new Error("Text extraction failed after all retries.");
}

async function parseTextWithRetry(cleanedText: string, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      const jsonData = await parseYahooAnalysis(cleanedText);
      return jsonData
    } catch (error) {
      if (i === retries - 1) throw error;
      if (error instanceof Error) console.log(`Retry ${i + 1} for text parsing due to: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 3s delay before retry
    }
  }
}
