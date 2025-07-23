import { similarity } from "../utils/scoreSimilarity";
import { tickers } from "../database/tickerData";
import { TickerInfo } from "../../types/types";

// const tickersOld: TickerInfo[] = [
//   { name: "Apple", symbol: "AAPL", exchange: "NASDAQ" },
//   { name: "Microsoft", symbol: "MSFT", exchange: "NASDAQ" },
//   { name: "Alphabet", symbol: "GOOGL", exchange: "NASDAQ" },
//   { name: "Amazon", symbol: "AMZN", exchange: "NASDAQ" },
//   { name: "Meta Platforms", symbol: "META", exchange: "NASDAQ" },
//   { name: "Tesla", symbol: "TSLA", exchange: "NASDAQ" },
//   { name: "NVIDIA", symbol: "NVDA", exchange: "NASDAQ" },
//   { name: "Berkshire Hathaway", symbol: "BRK-B", exchange: "NYSE" },
//   { name: "JPMorgan Chase", symbol: "JPM", exchange: "NYSE" },
//   { name: "Johnson & Johnson", symbol: "JNJ", exchange: "NYSE" },
// ];


export function searchTicker(query: string, limit: number = 5): TickerInfo[] {
  const q = query.toLowerCase();
  const match = tickers.map((ticker) => {
    const nameScore = similarity(q, ticker.name.toLowerCase());
    const symbolScore = similarity(q, ticker.symbol.toLowerCase());
    const score = Math.max(nameScore, symbolScore);
    return {...ticker, score};
  })
  .filter((item) => (item.score > 0.2))
  .sort((a, b) => (b.score - a.score))
  .slice(0, limit);

  return match
}

