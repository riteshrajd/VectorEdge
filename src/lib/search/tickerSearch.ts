import { similarity } from "@/helpers/scoreSimilarity";
import { tickers } from "../database/tickerData";
import { TickerInfo } from "../../types/types";

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

