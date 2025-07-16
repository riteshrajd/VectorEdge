'use client';
import { parseISO, format, formatDistanceToNow, differenceInMinutes } from "date-fns";
import { useState, useEffect } from 'react';
import { CombinedData, TickerInfo } from '@/lib/types/types';
import SuggestionList from './components/SuggestionList';
import StockAnalysisReport from "./StockAnalysisReport";

export default function Home() {
  const [data, setData] = useState<CombinedData | null>(null);
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<TickerInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedDate, setLastUpdatedDate] = useState<Date | null>(null);
  const [minutesSinceUpdate, setMinutesSinceUpdate] = useState<number | null>(null);
  const [formattedTimeAgo, setFormattedTimeAgo] = useState<string>("N/A");
  const [showButton, setShowButton] = useState<boolean>(true);

  useEffect(() => {
    if (data && data.last_updated) {
      const parsedDate = parseISO(data.last_updated);
      setLastUpdatedDate(parsedDate);

      const minutes = differenceInMinutes(new Date(), parsedDate);
      setMinutesSinceUpdate(minutes);

      const distance = formatDistanceToNow(parsedDate, { addSuffix: true });
      setFormattedTimeAgo(distance);

      setShowButton(minutes >= 15);
    } else {
      setLastUpdatedDate(null);
      setMinutesSinceUpdate(null);
      setFormattedTimeAgo("N/A");
      setShowButton(false);
    }
  }, [data]);


  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (ticker.trim()) {
        searchTicker(ticker.trim());
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [ticker]);

  // Fetch suggestions based on ticker input
  const searchTicker = async (ticker: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/ticker-search?ticker=${ticker.toUpperCase()}&limit=5`);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const result: TickerInfo[] = await response.json();
      setSuggestions(result);
    } catch (error) {
      console.error('Error searching for ticker:', error);
      setSuggestions([]);
      setError('Failed to load suggestions. Please try again.');
    }
  };

  // Fetch ticker data
  const fetchData = async (ticker: string, refresh: boolean = false) => {
    if (!ticker.trim()) return;
    setError(null);
    setData(null); // Reset data before loading new data
    setSuggestions([]); // Clear suggestions after successful search
    setLoading(true);
    try {
      const response = await fetch(`/api/ticker-data?ticker=${ticker.toUpperCase()}${refresh ? '&refresh' : ''}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const result: CombinedData = await response.json();
      setData(result);
      setTicker(''); // Clear input after search
    } catch (error) {
      console.error('Error fetching data:', error);
      setData(null);
      setError('No data available. Try a different ticker.');
    } finally {
      setLoading(false);
    }
  };

  // Handle manual search button click
  const handleSearch = () => {
    if (ticker.trim()) fetchData(ticker);
  };

  // Handle suggestion click
  const handleSuggestionClick = (symbol: string) => {
    setTicker(symbol);
    fetchData(symbol);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">Stock Analysis</h1>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Enter ticker (e.g., MSFT)"
          className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-30034"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Display error message if any */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Render SuggestionList component */}
      {suggestions.length > 0 && (
        <SuggestionList
          suggestions={suggestions}
          onSuggestionClick={handleSuggestionClick}
        />
      )}

      {/* Loading and data states */}
      {loading && <p className="text-center">Loading data...</p>}
      {!loading && !data && !error && (
        <p className="text-center text-gray-500">
          Enter a ticker to see stock data.
        </p>
      )}
      {data && (
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-2">
              Ticker: {data.ticker.toUpperCase()}
            </h2>

            <p>
              <strong>Last Updated:</strong>{" "}
              {lastUpdatedDate
                ? `${format(
                    lastUpdatedDate,
                    "dd/MM/yyyy, HH:mm:ss"
                  )} (${formattedTimeAgo})`
                : "N/A"}
            </p>

            {(
              <button
                onClick={() => fetchData(data.ticker.toUpperCase(), true)}
                className={`bg-[var(--bg-secondary)] text-[var(--text-primary)] px-2 pb-1 my-2 rounded hover:bg-[var(--bg-tertiary)] ${
                  loading ? "disabled" : ""
                }`}
              >
                {loading ? "refreshing..." : "Refresh Data"}
              </button>
            )}
          </section>
          <section>
            <StockAnalysisReport data={data}/>
          </section>
        </div>
      )}
    </div>
  );
}