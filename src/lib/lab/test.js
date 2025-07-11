// Add to route.ts
import axios from "axios";

async function getLivePrice(ticker) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`;
    const response = await axios.get(url);
    return response.data.chart.result[0].meta.regularMarketPrice;
  } catch {
    return -1;
  }
}

// In GET handler:
const current_price = await getLivePrice('AAPL');

console.log(`current_price: ${current_price}`)