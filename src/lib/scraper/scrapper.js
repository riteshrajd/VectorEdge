// scraper.js
import axios  from 'axios';
import cheerio  from 'cheerio';

async function scrapeFundamentals(ticker) {
  const url = `https://finance.yahoo.com/quote/${ticker}/key-statistics`;
  const res = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  const $ = cheerio.load(res.data);

  const metrics = {};
  $('section[data-test="qsp-statistics"] table').each((i, table) => {
    $(table).find('tr').each((_, row) => {
      const key = $(row).find('td:nth-child(1)').text().trim();
      const value = $(row).find('td:nth-child(2)').text().trim();
      if (key && value) metrics[key] = value;
    });
  });

  function parseNum(str) {
    if (!str) return null;
    const clean = str.replace(/[$,%]/g, '').replace(/T|B|M/, m => {
      return m === 'T' ? 'e12' : m === 'B' ? 'e9' : 'e6';
    });
    return Number(clean);
  }

  return {
    market_cap: parseNum(metrics['Market Cap (intraday)']),
    pe_ratio: parseNum(metrics['Trailing P/E']),
    peg_ratio: parseNum(metrics['PEG Ratio (5 yr expected)']),
    ps_ratio: parseNum(metrics['Price/Sales (ttm)']),
    pb_ratio: parseNum(metrics['Price/Book (mrq)']),
    ev_ebitda: parseNum(metrics['Enterprise Value/EBITDA']),
    ev_sales: parseNum(metrics['Enterprise Value/Revenue']),
    price_to_cash_flow: parseNum(metrics['Price/Cash Flow (ttm)']),
    price_to_free_cash_flow: parseNum(metrics['Price/Free Cash Flow (ttm)']),
    // Financials: you can extend scraping for Balance Sheet, etc.
  };
}

export default scrapeFundamentals;
