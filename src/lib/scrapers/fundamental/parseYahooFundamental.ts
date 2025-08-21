import { Fundamental } from '@/types/types';
import axios from 'axios';

export async function parseYahooFundamental(rawText: string): Promise<Fundamental | null> {
    try {
        const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY; // Use Next.js env variable
        if (!API_KEY) throw new Error('Gemini API key not found in environment variables');
        const API_URL = process.env.NEXT_PUBLIC_GEMINI_API_URL;

        const prompt = `
Parse the following raw text from Yahoo Finance's key statistics page into a JSON object with a fixed structure under the root key "fundamental". Include these mandatory sections: "valuation_measures", "financial_highlights", "trading_information".
- "valuation_measures": Object with a "current" key and up to 5 historical periods (e.g., "3/31/2025", "12/31/2024", "9/30/2024", "6/30/2024", "3/31/2024"), each containing "market_cap", "enterprise_value", "trailing_pe", "forward_pe", "peg_ratio", "price_sales", "price_book", "enterprise_value_revenue", "enterprise_value_ebitda" as floats or null.
- "financial_highlights": Object with "fiscal_year_ends" (string or null), "most_recent_quarter" (string or null), "profitability" (object with "profit_margin", "operating_margin" as strings with "%" or null), "management_effectiveness" (object with "return_on_assets", "return_on_equity" as strings with "%" or null), "income_statement" (object with "revenue_ttm", "revenue_per_share_ttm", "quarterly_revenue_growth", "gross_profit_ttm", "ebitda", "net_income_ttm", "diluted_eps_ttm", "quarterly_earnings_growth" as strings or null), "balance_sheet" (object with "total_cash", "total_cash_per_share", "total_debt", "total_debt_equity", "current_ratio", "book_value_per_share" as strings or null), "cash_flow_statement" (object with "operating_cash_flow", "levered_free_cash_flow" as strings or null).
- "trading_information": Object with "beta", "52_week_change", "52_week_high", "52_week_low", "50_day_moving_average", "200_day_moving_average", "avg_vol_3month", "avg_vol_10day", "shares_outstanding", "float", "percent_held_by_insiders", "percent_held_by_institutions", "shares_short", "short_ratio", "short_percent_of_float", "short_percent_of_shares_outstanding", "shares_short_prior_month" as strings, floats, or null.
If data is missing, use null to maintain structure. Exclude irrelevant text (e.g., navigation, ads, related tickers). Return only the JSON object, enclosed in \`\`\`json\`\`\` markers.

Example JSON:
{
  "fundamental": {
    "valuation_measures": {
      "current": {"market_cap": 1001.23, "enterprise_value": 985.93, "trailing_pe": 179.15, "forward_pe": 161.29, "peg_ratio": 5.48, "price_sales": 11.49, "price_book": 13.53, "enterprise_value_revenue": 10.30, "enterprise_value_ebitda": 72.36},
      "3/31/2025": {"market_cap": 834.50, "enterprise_value": 811.56, "trailing_pe": 127.04, "forward_pe": 92.59, "peg_ratio": 3.15, "price_sales": 9.28, "price_book": 11.45, "enterprise_value_revenue": 9.19, "enterprise_value_ebitda": 64.56},
      "12/31/2024": {"market_cap": 1300.00, "enterprise_value": 1280.00, "trailing_pe": 110.64, "forward_pe": 117.65, "peg_ratio": 4.90, "price_sales": 14.51, "price_book": 18.57, "enterprise_value_revenue": 13.15, "enterprise_value_ebitda": 92.37},
      "9/30/2024": {"market_cap": 839.05, "enterprise_value": 820.84, "trailing_pe": 73.49, "forward_pe": 89.29, "peg_ratio": 4.06, "price_sales": 9.58, "price_book": 12.62, "enterprise_value_revenue": 8.61, "enterprise_value_ebitda": 63.49},
      "6/30/2024": {"market_cap": 631.08, "enterprise_value": 614.13, "trailing_pe": 50.61, "forward_pe": 80.00, "peg_ratio": 3.53, "price_sales": 7.29, "price_book": 9.82, "enterprise_value_revenue": 6.48, "enterprise_value_ebitda": 44.51},
      "3/31/2024": {"market_cap": 559.85, "enterprise_value": 540.33, "trailing_pe": 40.88, "forward_pe": 56.82, "peg_ratio": 2.07, "price_sales": 6.33, "price_book": 8.95, "enterprise_value_revenue": 5.58, "enterprise_value_ebitda": 36.52}
    },
    "financial_highlights": {
      "fiscal_year_ends": "12/31/2024",
      "most_recent_quarter": "3/31/2025",
      "profitability": {"profit_margin": "6.38%", "operating_margin": "2.55%"},
      "management_effectiveness": {"return_on_assets": "3.72%", "return_on_equity": "8.77%"},
      "income_statement": {"revenue_ttm": "95.72B", "revenue_per_share_ttm": "29.87", "quarterly_revenue_growth": "-9.20%", "gross_profit_ttm": "16.91B", "ebitda": "12.55B", "net_income_ttm": "6.11B", "diluted_eps_ttm": "1.76", "quarterly_earnings_growth": "-70.60%"},
      "balance_sheet": {"total_cash": "37B", "total_cash_per_share": "11.49", "total_debt": "13.13B", "total_debt_equity": "17.41%", "current_ratio": "2.00", "book_value_per_share": "23.18"},
      "cash_flow_statement": {"operating_cash_flow": "16.84B", "levered_free_cash_flow": "3.36B"}
    },
    "trading_information": {
      "beta": "2.46",
      "52_week_change": "24.09%",
      "52_week_high": "488.54",
      "52_week_low": "182.00",
      "50_day_moving_average": "320.08",
      "200_day_moving_average": "316.23",
      "avg_vol_3month": "112.08M",
      "avg_vol_10day": "98.17M",
      "shares_outstanding": "3.22B",
      "float": "2.8B",
      "percent_held_by_insiders": "12.89%",
      "percent_held_by_institutions": "50.13%",
      "shares_short": "77.1M",
      "short_ratio": "0.64",
      "short_percent_of_float": "2.75%",
      "short_percent_of_shares_outstanding": "2.39%",
      "shares_short_prior_month": "85.02M"
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
            if(error instanceof Error)console.error('Failed to parse Gemini output as JSON:', error.message);
            return null;
        }

        return jsonOutput;

    } catch (error) {
        if(error instanceof Error)console.error('Error during parsing:', error.message);
        return null;
    }
}