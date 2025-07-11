import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(geminiApiKey);

interface StockData {
  symbol: string;
  price: string;
  change: string;
  peRatio: string;
  marketCap: string;
}

export const analyzeStock = async (data: StockData) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
Give a simple and clear 2–3 sentence summary for the following stock info:

Symbol: ${data.symbol}
Price: ${data.price}
Change: ${data.change}
P/E Ratio: ${data.peRatio}
Market Cap: ${data.marketCap}

Make it sound friendly for a beginner investor.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (err) {
    console.error('Gemini error:', err);
    return 'Failed to generate summary.';
  }
};
