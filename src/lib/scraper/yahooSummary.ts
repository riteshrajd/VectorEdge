import axios from 'axios';
import * as cheerio from 'cheerio';

export const scrapeYahooSummary = async (symbol: string) => {
  const url = `https://finance.yahoo.com/quote/${symbol}`;

  const res = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0'
    }
  });

  const $ = cheerio.load(res.data);

  const price = $('fin-streamer[data-field="regularMarketPrice"]').first().text();
  const change = $('fin-streamer[data-field="regularMarketChangePercent"]').first().text();
  const peRatio = $('td:contains("PE Ratio (TTM)")').next().text();
  const marketCap = $('td:contains("Market Cap")').next().text();

  return {
    symbol,
    price,
    change,
    peRatio,
    marketCap
  };
};
