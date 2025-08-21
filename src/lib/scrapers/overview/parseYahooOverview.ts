import { Overview } from '@/types/types';
import axios from 'axios';

export async function parseYahooOverview(rawText: string): Promise<Overview | null> {
    try {
        const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY; // Use Next.js env variable
        if (!API_KEY) throw new Error('Gemini API key not found in environment variables');
        const API_URL = process.env.NEXT_PUBLIC_GEMINI_API_URL;

        const prompt = `
Parse the following raw text from Yahoo Finance's overview page into a JSON object with a fixed structure under the root key "overview". Include these mandatory fields: "current_price", "change", "percent_change", "previous_close", "open", "bid", "ask", "day_range", "52_week_range", "volume", "avg_volume", "market_cap", "beta", "pe_ratio", "eps", "earnings_date", "forward_dividend_yield", "ex_dividend_date", "1y_target_est", each as string, float, or null.
If data is missing, use null to maintain structure. Exclude irrelevant text (e.g., navigation, ads, related tickers). Return only the JSON object, enclosed in \`\`\`json\`\`\` markers.

Example JSON:
{
  "overview": {
    "current_price": 211.16,
    "change": -1.25,
    "percent_change": "-0.59%",
    "previous_close": 212.41,
    "open": 210.57,
    "bid": 210.97,
    "ask": 220.57,
    "day_range": "209.86 - 212.13",
    "52_week_range": "169.21 - 260.10",
    "volume": "39,686,451",
    "avg_volume": "54,649,447",
    "market_cap": "3.154T",
    "beta": 1.21,
    "pe_ratio": 32.89,
    "eps": 6.42,
    "earnings_date": "Jul 31, 2025",
    "forward_dividend_yield": "1.04 (0.51%)",
    "ex_dividend_date": "May 12, 2025",
    "1y_target_est": 228.60
  }
}

Text:
${rawText.slice(0, 4000)}
`;

        const response = await axios.post(
            `${API_URL}?key=${API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.3, maxOutputTokens: 1000 }
            },
            { headers: { 'Content-Type': 'application/json' } }
        );

        const responseText = response.data.candidates[0].content.parts[0].text;
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
        if (!jsonMatch) {
            console.error('No JSON found in Gemini response:', responseText);
            return null;
        }

        let jsonOutput;
        try {
            jsonOutput = JSON.parse(jsonMatch[1]);
        } catch (e: unknown) {
            if(e instanceof Error)console.error('Failed to parse Gemini output as JSON:', e.message);
            return null;
        }

        return jsonOutput;

    } catch (error) {
        if(error instanceof Error)console.error('Error during parsing:', error.message);
        return null;
    }
}