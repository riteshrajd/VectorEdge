// components/SearchBar.tsx
import { useState, useEffect } from 'react';

interface SearhInstrumentsResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
  marketOpen: string;
  marketClose: string;
  timezone: string;
  currency: string;
  matchScore: string;
};

interface RawAlphaVantageResult {
  "1. symbol": string;
  "2. name": string;
  "3. type": string;
  "4. region": string;
  "5. marketOpen": string;
  "6. marketClose": string;
  "7. timezone": string;
  "8. currency": string;
  "9. matchScore": string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<SearhInstrumentsResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator
  const DEBOUNCE_DELAY = 1000; // milliseconds

  // Effect to debounce the 'query' state and update 'debouncedQuery'
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [query, DEBOUNCE_DELAY]);

  // Effect to perform the search when 'debouncedQuery' changes
  useEffect(() => {
    const performSearch = async () => {
      // Don't search if the debounced query is empty
      if (debouncedQuery.trim() === '') {
        setResults(null);
        setIsLoading(false); // Ensure loading is off if query is cleared
        return;
      }

      setIsLoading(true); // Set loading to true before starting fetch
      setResults(null); // Clear previous results immediately upon new search

      try {
        console.log(`Performing search for: ${debouncedQuery}`);
        const response = await fetch(
          `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${debouncedQuery}&apikey=${process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY}`
        );
        const data = await response.json();
        console.log(`data: ${JSON.stringify(data)}`);

        if (data.bestMatches && Array.isArray(data.bestMatches)) {
          const transformedResults: SearhInstrumentsResult[] = data.bestMatches.map((rawItem: RawAlphaVantageResult) => ({
            symbol: rawItem["1. symbol"],
            name: rawItem["2. name"],
            type: rawItem["3. type"],
            region: rawItem["4. region"],
            marketOpen: rawItem["5. marketOpen"],
            marketClose: rawItem["6. marketClose"],
            timezone: rawItem["7. timezone"],
            currency: rawItem["8. currency"],
            matchScore: rawItem["9. matchScore"],
          }));
          setResults(transformedResults);
        } else {
          setResults([]); // No matches found
        }
      } catch (error) {
        console.error("Search failed:", error);
        setResults(null); // Set results to null on error
      } finally {
        setIsLoading(false); // Always set loading to false after fetch (success or error)
      }
    };

    performSearch();
  }, [debouncedQuery]);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md max-w-md mx-auto my-8">
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type to search stocks, e.g., Reliance"
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isLoading && debouncedQuery.trim() !== '' && ( // Show searching message if loading and query is not empty
        <p className="text-center text-blue-600 mt-4 text-sm animate-pulse">Searching for {`"${debouncedQuery}"`}...</p>
      )}

      {!isLoading && results && results.length > 0 && ( // Show results only when not loading and results exist
        <div className="mt-4 border-t pt-4 border-gray-200">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Search Results:</h2>
          <ul>
            {(results || []).map((item, i) => (
              <li key={i} className="py-2 px-3 mb-1 bg-white rounded-md shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors duration-150 text-sm">
                <div className="flex justify-between items-center">
                  <p className="font-medium">{item.name} <span className="text-gray-500 text-xs">({item.symbol})</span></p>
                  <p className="text-xs text-gray-600">{item.type} | {item.region}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Message when a search has been performed, not loading, and no results were found */}
      {!isLoading && debouncedQuery.trim() !== '' && results && results.length === 0 && (
        <p className="text-center text-gray-500 mt-4 text-sm">No results found for "{debouncedQuery}". Try a different query.</p>
      )}

      {/* Initial message when no search has been performed yet and not loading */}
      {!isLoading && debouncedQuery.trim() === '' && (
        <p className="text-center text-gray-500 mt-4 text-sm">Start typing to search for instruments...</p>
      )}
    </div>
  );
}