'use server'
import axios from "axios";
import { AIInsights, CombinedData } from "@/types/types";

async function insightGenerator(
  data: CombinedData
): Promise<{ ai_insights: AIInsights }> {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY)
      throw new Error("Gemini API key not found in environment variables");
    const API_URL = process.env.GEMINI_API_URL;

    // Construct a prompt summarizing key data points for AI processing
    const prompt = `
Given the following stock data for ${
      data.ticker
    }, generate actionable insights for traders in a fixed JSON structure. Focus on valuation, growth, technical signals, and analyst sentiment. Return a JSON object with:
- "summary": A 2-3 sentence overview of the stock's performance and outlook.
- "recommendation": An object with "action" (Buy, Sell, Hold), "confidence" (0-100), and "reasoning" (1-2 sentences explaining the recommendation).
- "key_takeaways": An array of 3-5 concise bullet points highlighting critical insights.
- "visualization_data": An object with:
  - "price_trend": An array of 5 objects with "x" (date string, e.g., "2025-07-15") and "y" (price, inferred from data).
  - "bullishness_meter": A number (0-100) reflecting buy sentiment based on technicals and analyst ratings.
  - "risk_score": A number (0-100) reflecting risk based on beta, valuation, and debt.

Return the JSON in \`\`\`json\`\`\` markers. Use the provided data to ensure accuracy and relevance.

Data:
- Current Price: ${data.overview?.current_price}
- P/E Ratio: ${data.overview?.pe_ratio}
- EPS: ${data.overview?.eps}
- Market Cap: ${data.overview?.market_cap}
- Beta: ${data.overview?.beta}
- 52-Week Range: ${data.overview ? data.overview["52_week_range"] : 'null'}
- Revenue Growth (Quarterly): ${
      data.fundamental?.financial_highlights.income_statement
        .quarterly_revenue_growth
    }
- Profit Margin: ${
      data.fundamental?.financial_highlights.profitability.profit_margin
    }
- Total Debt/Equity: ${
      data.fundamental?.financial_highlights.balance_sheet.total_debt_equity
    }
- Moving Averages: ${data.technicals?.summary.moving_averages.overall} (${
      data.technicals?.summary.moving_averages.buy
    }/15)
- Oscillators: ${data.technicals?.summary.oscillators.overall}
- Analyst Price Target: ${data.analysis?.analyst_ratings.price_target_avg}
- Analyst Buy Ratings: ${
      data.analysis?.analyst_ratings.ratings.filter(
        (r) =>
          r.rating?.toLowerCase().includes("buy") ||
          r.rating?.toLowerCase().includes("outperform") ||
          r.rating?.toLowerCase().includes("overweight")
      ).length
    }/${data.analysis?.analyst_ratings.ratings.length}
- Last Updated: ${data.last_updated}

Example JSON:
\`\`\`json
{
  "summary": "AAPL shows stable growth with strong fundamentals, but its high valuation suggests caution.",
  "recommendation": {
    "action": "Hold",
    "confidence": 70,
    "reasoning": "High P/E ratio indicates overvaluation, but consistent revenue growth supports stability."
  },
  "key_takeaways": [
    "High P/E ratio of 32.89 suggests premium valuation.",
    "Strong 5.1% quarterly revenue growth.",
    "Technical signals indicate Buy (11/15 moving averages).",
    "Analyst consensus leans bullish with $228.60 target."
  ],
  "visualization_data": {
    "price_trend": [
      { "x": "2025-07-10", "y": 210.50 },
      { "x": "2025-07-11", "y": 211.00 },
      { "x": "2025-07-12", "y": 210.80 },
      { "x": "2025-07-13", "y": 211.20 },
      { "x": "2025-07-14", "y": 211.16 }
    ],
    "bullishness_meter": 75,
    "risk_score": 60
  }
}
\`\`\`
`;

    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.15,
          maxOutputTokens: 2000,
          topP: 0.95,
        },
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const responseText = response.data.candidates[0].content.parts[0].text;
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) {
      console.error("No JSON found in Gemini response:", responseText);
      throw new Error("No JSON found in Gemini response");
    }
    console.log(`Generated Insights for ${data.ticker}:\n${responseText}`);

    const ai_insights: AIInsights = JSON.parse(jsonMatch[1]);
    console.log(`✅generated insights: ${JSON.stringify(ai_insights)}`);
    return { ai_insights };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Error generating insights for ${data.ticker}: ${errorMessage}`);
    throw new Error(`Insight generation failed: ${errorMessage}`);
  }
}


export async function getInsightData(
  data: CombinedData,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<{ai_insights: AIInsights} | null> {
  for(let attempt = 1; attempt<=maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt} to fetch insights for ${data.ticker}`);
      const result = await insightGenerator(data);
      console.log(`Success in generating ai insight on attempt ${attempt} for ${data.ticker}`);
      return result;
    } catch (error) { 
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Attempt ${attempt} failed for ${data.ticker}: ${errorMessage}`);
      if (attempt === maxRetries) {
        console.error(`All ${maxRetries} attempts failed for ${data.ticker}`);
        return null;
      }
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  return null;
}