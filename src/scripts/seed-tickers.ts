import { createClient } from '@supabase/supabase-js';
import { tickers } from '@/lib/database/tickerData';

export async function seedData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! 
  );

  console.log('Starting to seed ticker data via API route...');

  // --- THIS IS THE FIX ---
  // 1. Create a Set of seen symbols to track duplicates.
  const seen = new Set();
  
  // 2. Filter the original array, keeping only the first occurrence of each symbol.
  const uniqueTickers = tickers.filter(ticker => {
    const duplicate = seen.has(ticker.symbol);
    seen.add(ticker.symbol);
    return !duplicate;
  });
  // --- END OF FIX ---

  // 3. Map the de-duplicated array.
  const dataToInsert = uniqueTickers.map(ticker => ({
    symbol: ticker.symbol,
    name: ticker.name,
    exchange: ticker.exchange,
    yf: ticker.yf,
    tv: ticker.tv,
  }));

  const { data, error } = await supabase
    .from('ticker_data')
    .upsert(dataToInsert, { onConflict: 'symbol' });

  if (error) {
    console.error('Error seeding data:', error);
    return { success: false, message: error.message };
  }

  console.log(`🌿Successfully seeded tickers!`);
  return { success: true, message: '🌿Successfully seeded ticker data!', count: data?.length || 0 };
}