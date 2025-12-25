// Use relative path since we are running this with ts-node
import { getData } from './src/lib/scrapers/getData.ts'; 

const run = async () => {
  const ticker = 'AAPL';
  console.log(`🔎 Testing getData for ${ticker}...`);

  try {
    // We pass 'true' to force a fresh fetch
    const data = await getData(ticker, true);
    console.log("✅ Data Received:");
    console.dir(data, { depth: null, colors: true });
  } catch (error) {
    console.error("❌ Error fetching data:", error);
  }
};

run();