import {
  FETCH_TICK_DATA_API_ROUTE,
} from "@/constants/constants";
import { CombinedData } from "@/types/types";

export const fetchTickerData = async (
  ticker: string,
  refresh: boolean = false
): Promise<CombinedData> => {
  if (!ticker.trim()) {
    throw new Error("Ticker cannot be empty");
  }

  const response = await fetch(
    `${FETCH_TICK_DATA_API_ROUTE}?ticker=${ticker.toUpperCase()}${
      refresh ? "&refresh" : ""
    }`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  return response.json() as Promise<CombinedData>;
};

