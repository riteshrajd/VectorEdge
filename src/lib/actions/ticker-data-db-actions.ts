'use server';

import { CombinedData, TickerInfo } from "@/types/types";
import { createClient } from "@/utils/supabase/server";

/**
 * Searches for tickers directly in the Supabase database.
 * @param query The user's search term.
 * @param limit The maximum number of results to return.
 * @returns A promise that resolves to an array of matching TickerInfo objects.
 */
export async function searchTickersInDB(
  query: string,
): Promise<TickerInfo[]> {
  if (!query.trim()) {
    return [];
  }

  const supabase = await createClient();

  // The `ilike` operator performs a case-insensitive "contains" search.
  // The `%` is a wildcard character.
  const searchTerm = `%${query}%`;

  const { data, error } = await supabase
    .from('ticker_data') // Your table name
    .select('symbol, name, exchange, yf, tv')
    // Use .or() to find matches in either the name OR the symbol column
    .or(`name.ilike.${searchTerm},symbol.ilike.${searchTerm}`);

  if (error) {
    console.error("Database search error:", error);
    return []; // Return an empty array on error
  }

  return data as TickerInfo[];
}

/**
 * Fetches cached data for a specific ticker from the database.
 * @param ticker who's data needs to be fetched
 * @returns the fetched json data from db
 */
export async function fetchCachedTickerData(ticker: string): Promise<{ data: CombinedData | null, error: unknown }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('ticker_data') // Your table name
    .select('analysis_data, last_updated')
    .eq('symbol', ticker)
    .single(); // Use .single() to get one row or null

  if (error || !data || !data.analysis_data) {
    return { data: null, error };
  }

  // Reconstruct the CombinedData object from the analysis_data column
  return { data: data.analysis_data as CombinedData, error: null };
}


/**
 * Updates the cached data for a specific ticker in the database.
 * @param ticker who's data that needs to be updated
 * @param newData the new data
 * @returns error if any during updation
 */
export async function updateCachedTickerData(ticker: string, newData: CombinedData): Promise<{ error: unknown }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('ticker_data')
    .update({
      analysis_data: newData,
      last_updated: new Date().toISOString(), // Set the new timestamp
    })
    .eq('symbol', ticker);

  return { error };
}