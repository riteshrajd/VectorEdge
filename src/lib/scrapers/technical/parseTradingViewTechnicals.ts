import { Technicals } from '@/types/types';
import axios from 'axios';

export async function parseTradingViewTechnicals(rawText: string): Promise<{technicals: Technicals} | null> {
    try {
        const API_KEY = process.env.GEMINI_API_KEY; // Use Next.js env variable
        if (!API_KEY) throw new Error('Gemini API key not found in environment variables');
        const API_URL = process.env.GEMINI_API_URL;

        const prompt = `
Parse the following raw text from TradingView's technicals page into a JSON object with a fixed structure under the root key "technicals". Include these mandatory sections: "summary", "oscillators", "moving_averages", "pivots".
- "summary": Object with "sell" (integer or null), "neutral" (integer or null), "buy" (integer or null), "overall" (string or null) for both Oscillators and Moving Averages.
- "oscillators": Array of objects, each with "name" (string or null), "value" (float or string with "%" or null), "action" (string: Sell/Neutral/Buy/Strong Sell/Strong Buy or null).
- "moving_averages": Array of objects, each with "name" (string or null), "value" (float or null), "action" (string: Sell/Neutral/Buy/Strong Sell/Strong Buy or null).
- "pivots": Object with sub-objects "Classic", "Fibonacci", "Camarilla", "Woodie", "DM" (if available), each containing "R3", "R2", "R1", "P", "S1", "S2", "S3" as floats or null.
If data is missing, use null to maintain structure. Exclude irrelevant text (e.g., navigation, FAQs, disclaimers). Return only the JSON object, enclosed in \`\`\`json\`\`\` markers.

Example JSON:
{
  "technicals": {
    "summary": {
      "oscillators": {"sell": 2, "neutral": 9, "buy": 0, "overall": "Neutral"},
      "moving_averages": {"sell": 1, "neutral": 1, "buy": 13, "overall": "Buy"}
    },
    "oscillators": [
      {"name": "Relative Strength Index (14)", "value": 71.71, "action": "Neutral"},
      {"name": "Stochastic %K (14, 3, 3)", "value": 88.30, "action": "Neutral"},
      {"name": "Commodity Channel Index (20)", "value": 95.74, "action": "Neutral"},
      {"name": "Average Directional Index (14)", "value": 45.35, "action": "Neutral"},
      {"name": "Awesome Oscillator", "value": 20.99, "action": "Neutral"},
      {"name": "Momentum (10)", "value": 5.87, "action": "Sell"},
      {"name": "MACD Level (12, 26)", "value": 10.93, "action": "Sell"},
      {"name": "Stochastic RSI Fast (3, 3, 14, 14)", "value": 34.92, "action": "Neutral"},
      {"name": "Williams Percent Range (14)", "value": "-10.10", "action": "Neutral"},
      {"name": "Bull Bear Power", "value": 12.04, "action": "Neutral"},
      {"name": "Ultimate Oscillator (7, 14, 28)", "value": 67.03, "action": "Neutral"}
    ],
    "moving_averages": [
      {"name": "Exponential Moving Average (10)", "value": 497.51, "action": "Buy"},
      {"name": "Simple Moving Average (10)", "value": 497.80, "action": "Buy"},
      {"name": "Exponential Moving Average (20)", "value": 490.06, "action": "Buy"},
      {"name": "Simple Moving Average (20)", "value": 490.62, "action": "Buy"},
      {"name": "Exponential Moving Average (30)", "value": 481.89, "action": "Buy"},
      {"name": "Simple Moving Average (30)", "value": 482.49, "action": "Buy"},
      {"name": "Exponential Moving Average (50)", "value": 467.09, "action": "Buy"},
      {"name": "Simple Moving Average (50)", "value": 467.24, "action": "Buy"},
      {"name": "Exponential Moving Average (100)", "value": 446.27, "action": "Buy"},
      {"name": "Simple Moving Average (100)", "value": 426.90, "action": "Buy"},
      {"name": "Exponential Moving Average (200)", "value": 431.15, "action": "Buy"},
      {"name": "Simple Moving Average (200)", "value": 426.08, "action": "Buy"},
      {"name": "Ichimoku Base Line (9, 26, 52, 26)", "value": 484.90, "action": "Neutral"},
      {"name": "Volume Weighted Moving Average (20)", "value": 490.22, "action": "Buy"},
      {"name": "Hull Moving Average (9)", "value": 503.68, "action": "Sell"}
    ],
    "pivots": {
      "Classic": {"R3": 572.76, "R2": 528.89, "R1": 513.15, "P": 485.02, "S1": 469.28, "S2": 441.15, "S3": 397.28},
      "Fibonacci": {"R3": 528.89, "R2": 512.13, "R1": 501.78, "P": 485.02, "S1": 468.26, "S2": 457.91, "S3": 441.15},
      "Camarilla": {"R3": 509.47, "R2": 505.45, "R1": 501.43, "P": 485.02, "S1": 493.39, "S2": 489.37, "S3": 485.35},
      "Woodie": {"R3": 562.28, "R2": 531.52, "R1": 518.41, "P": 487.65, "S1": 474.54, "S2": 443.78, "S3": 430.67},
      "DM": {"R3": null, "R2": null, "R1": null, "P": 488.96, "S1": 477.15, "S2": null, "S3": null}
    }
  }
}

Text:
${rawText.slice(0, 4000)}
`;

        const response = await axios.post(
            `${API_URL}?key=${API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.3, maxOutputTokens: 3000 }
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
        } catch (e) {
            if(e instanceof Error)console.error('Failed to parse Gemini output as JSON:', e.message);
            return null;
        }

        return jsonOutput;

    } catch (error: unknown) {
        console.error('Error during parsing:', error instanceof Error ? error.message : '');
        return null;
    }
}