import axios from 'axios';

export async function parseYahooAnalysis(rawText: string): Promise<any> {
    try {
        const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY; // Replace with your Gemini API key
        const API_URL = process.env.NEXT_PUBLIC_GEMINI_API_URL;

        const prompt = `
Parse the following raw text from Yahoo Finance's analysis page into a JSON object with a fixed structure under the root key "analysis". Include these mandatory sections: "earnings_estimates", "revenue_estimates", "earnings_history", "analyst_ratings".
- "earnings_estimates": Object with keys "Current Qtr", "Next Qtr", "Current Year", "Next Year", each with "avg_estimate", "low_estimate", "high_estimate", "year_ago_eps" as floats or null if missing.
- "revenue_estimates": Object with the same 4 keys, each with "avg_estimate", "low_estimate", "high_estimate", "year_ago_sales", "sales_growth" as strings (e.g., "73.79B", "14.01%") or null.
- "earnings_history": Object with up to 4 past quarters (e.g., "6/30/2024", "9/30/2024", "12/31/2024", "3/31/2025" or latest available), each with "eps_estimate", "eps_actual", "difference", "surprise_percent" as floats or strings with "%" or null.
- "analyst_ratings": Object with "current_rating" (string or null), "price_target_avg", "price_target_low", "price_target_high" (floats or null), "number_of_analysts" (integer or null), and "ratings" array with all available entries, each with "firm" (string or null), "rating" (string or null), "price_target" (float or null), "date" (string or null).
If data is missing, use null to maintain structure but do not pad arrays with null to enforce length. Exclude irrelevant text (e.g., navigation, ads). Return only the JSON object, enclosed in \`\`\`json\`\`\` markers.

Example JSON:
{
  "analysis": {
    "earnings_estimates": {
      "Current Qtr": {"avg_estimate": 3.38, "low_estimate": 3.3, "high_estimate": 3.57, "year_ago_eps": 2.95},
      "Next Qtr": {"avg_estimate": 3.55, "low_estimate": 3.39, "high_estimate": 3.7, "year_ago_eps": 3.3},
      "Current Year": {"avg_estimate": 13.4, "low_estimate": 13.11, "high_estimate": 13.79, "year_ago_eps": 11.8},
      "Next Year": {"avg_estimate": 15.14, "low_estimate": 14.26, "high_estimate": 16.53, "year_ago_eps": 13.4}
    },
    "revenue_estimates": {
      "Current Qtr": {"avg_estimate": "73.79B", "low_estimate": "72.57B", "high_estimate": "74.46B", "year_ago_sales": "64.73B", "sales_growth": "14.01%"},
      "Next Qtr": {"avg_estimate": "74.1B", "low_estimate": "71.5B", "high_estimate": "75.3B", "year_ago_sales": "65.58B", "sales_growth": "12.99%"},
      "Current Year": {"avg_estimate": "279.03B", "low_estimate": "276.5B", "high_estimate": "283.15B", "year_ago_sales": "245.12B", "sales_growth": "13.83%"},
      "Next Year": {"avg_estimate": "316.49B", "low_estimate": "304.63B", "high_estimate": "338.89B", "year_ago_sales": "279.03B", "sales_growth": "13.43%"}
    },
    "earnings_history": {
      "6/30/2024": {"eps_estimate": 2.93, "eps_actual": 2.95, "difference": 0.02, "surprise_percent": "0.53%"},
      "9/30/2024": {"eps_estimate": 3.11, "eps_actual": 3.3, "difference": 0.19, "surprise_percent": "6.25%"},
      "12/31/2024": {"eps_estimate": 3.1, "eps_actual": 3.23, "difference": 0.13, "surprise_percent": "4.06%"},
      "3/31/2025": {"eps_estimate": 3.22, "eps_actual": 3.46, "difference": 0.24, "surprise_percent": "7.59%"}
    },
    "analyst_ratings": {
      "current_rating": null,
      "price_target_avg": 522.26,
      "price_target_low": 432,
      "price_target_high": 700,
      "number_of_analysts": 24,
      "ratings": [
        {"firm": "Evercore ISI Group", "rating": "OUTPERFORM", "price_target": 515, "date": "2025-05-22"},
        {"firm": "Bernstein", "rating": "OUTPERFORM", "price_target": 520, "date": "2025-05-02"}
      ]
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
        } catch (error) {
            console.error('Failed to parse Gemini output as JSON:', responseText);
            return null;
        }

        return jsonOutput;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error during parsing:', error.message);
        return null;
    }
}