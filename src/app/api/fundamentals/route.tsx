// pages/api/fundamentals/[ticker].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import scrapeFundamentals from '@/lib/scraper/scrapper';

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { ticker } = req.query;
  if (!ticker || typeof ticker !== 'string') {
    return res.status(400).json({ error: 'Ticker required' });
  }
  try {
    const data = await scrapeFundamentals(ticker.toUpperCase());
    return res.status(200).json({ ticker: ticker.toUpperCase(), fundamental_analysis: { financial_metrics: data } });
  } catch (err) {
    return res.status(500).json({ error: 'Scraping failed', details: err.toString() });
  }
}
