type Instrument = {
  symbol: string;
  name: string;
  price: number;
  change: number;
};

type MarketData = {
  instruments: Instrument[];
  lastUpdated: Date;
};


// step 2 -> mock api client (instead of real http calls)
class MockApiClient {
  async fetchMarketData(): Promise<MarketData> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      instruments: [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 182.52, change: 1.24 },
        { symbol: 'MSFT', name: 'Microsoft', price: 340.65, change: -0.32 },
        { symbol: 'GOOGL', name: 'Alphabet', price: 138.21, change: 0.87 },
      ],
      lastUpdated: new Date(),
    }
  }
}

// step 3 -> data cleaner and transformer
class DataProcessor {
  process(rawData: MarketData): MarketData {
    // simple transformation: format  numbers
    return {
      instruments: rawData.instruments.map(instrument => ({
        ...instrument,
        price: Number(instrument.price.toFixed(2)),
        change: Number(instrument.change.toFixed(2)),
      })),
      lastUpdated: rawData.lastUpdated,
    }
  }
}

const createMarketStore = () => {
  let data: MarketData | null = null;
  let loading  = false;
  let error: string | null = null;

  const subscribers = new Set<() => void>();

  return {
    getData: () => data,
    isLoading: () => loading,
    getError: () => error,

    fetchData: async () => {
      loading = true;
      error = null;
      subscribers.forEach(sub => sub());

      try {
        const api = new MockApiClient();
        const processor = new DataProcessor();
        
        const rawData = await api.fetchMarketData();
        data = processor.process(rawData);
      } catch (err) {
        error = 'Failed to load data';
        console.error(err)
      } finally {
        loading = false;
        subscribers.forEach(sub => sub());
      }
    },
    subscriber: (callback: () => void) => {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    }
  };
};

// step 5: create store instance
const marketStore = createMarketStore();

// step 6: ui component
function App() {
  const [data, setData] = React.useState<MarketData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // conect to store
  React.useEffect(() => {
    return marketStore.subscriber(() => {
      setData(marketStore.getData());
      setLoading(marketStore.isLoading());
      setError(marketStore.getError());
    });
  }, []);

  // fetch data on mount
  React.useEffect(()=> {
    marketStore.fetchData()
  }, []);

  if (loading) return <div> Loading market data... </div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <div>
      <h1>Market Data (Updated: {data.lastUpdated.toLocaleTimeString()})</h1>
      <ul>
        {data.instruments.map(stock => (
          <li key={stock.symbol}>
            {stock.name} ({stock.symbol}): ${stock.price}
            <span style={{color: stock.change >= 0 ? 'green' : 'red' }}>
              {stock.change >= 0 ? '↑' : '↓'} {Math.abs(stock.change)}%
            </span>
          </li>
        ))}
      </ul>
      <button onClick={() => marketStore.fetchData()}>
        Refresh Data;
      </button>
    </div>
  );
}

export default App();