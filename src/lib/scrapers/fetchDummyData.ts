import type { CombinedData, AIInsights } from '../../types/types.ts';

/* ------------------ helpers ------------------ */

const rand = (min: number, max: number, decimals = 2) =>
  Number((Math.random() * (max - min) + min).toFixed(decimals));

const pick = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const randDate = () =>
  new Date(Date.now() - Math.random() * 1e11).toISOString().split('T')[0];

/* ------------------ AI INSIGHTS ------------------ */

function generateAIInsights(): AIInsights {
  const action = pick<"Buy" | "Sell" | "Hold">(["Buy", "Sell", "Hold"]);

  return {
    summary:
      "The stock shows balanced momentum with mixed technical and fundamental signals.",
    recommendation: {
      action,
      confidence: rand(55, 85, 0),
      reasoning:
        "This recommendation is based on valuation metrics, recent price behavior, and earnings expectations.",
    },
    key_takeaways: [
      "Price is trading near key moving averages",
      "Valuation metrics suggest fair pricing",
      "Earnings growth remains stable",
      "Volume trends indicate moderate participation",
    ],
    visualization_data: {
      price_trend: Array.from({ length: 10 }).map((_, i) => ({
        x: `Day ${i + 1}`,
        y: rand(140, 200),
      })),
      bullishness_meter: rand(40, 75, 0),
      risk_score: rand(25, 65, 0),
    },
  };
}

/* ------------------ MAIN FUNCTION ------------------ */

export async function fetchDummyData(ticker: string, name: string): Promise<CombinedData> {
  const price = rand(140, 200);

  return {
    ticker: ticker.toUpperCase(),
    last_updated: new Date().toISOString(),
    name,
    overview: {
      current_price: price,
      change: rand(-3, 3),
      percent_change: `${rand(-2, 2)}%`,
      previous_close: price - rand(-2, 2),
      open: price - rand(-1, 1),
      bid: price - 0.2,
      ask: price + 0.2,
      day_range: `${rand(135, 145)} - ${rand(195, 205)}`,
      "52_week_range": `${rand(110, 130)} - ${rand(210, 250)}`,
      volume: `${rand(10, 80, 0)}M`,
      avg_volume: `${rand(20, 90, 0)}M`,
      market_cap: `${rand(500, 3000, 0)}B`,
      beta: rand(0.8, 1.5),
      pe_ratio: rand(15, 40),
      eps: rand(3, 10),
      earnings_date: randDate(),
      forward_dividend_yield: `${rand(0.5, 2)}%`,
      ex_dividend_date: randDate(),
      "1y_target_est": rand(160, 230),
    },

    fundamental: {
      valuation_measures: {
        current: {
          market_cap: rand(500, 3000),
          enterprise_value: rand(600, 3200),
          trailing_pe: rand(15, 40),
          forward_pe: rand(12, 35),
          peg_ratio: rand(0.8, 2),
          price_sales: rand(3, 12),
          price_book: rand(5, 25),
          enterprise_value_revenue: rand(3, 10),
          enterprise_value_ebitda: rand(8, 25),
        },
      },
      financial_highlights: {
        fiscal_year_ends: "Sep 30",
        most_recent_quarter: randDate(),
        profitability: {
          profit_margin: `${rand(15, 35)}%`,
          operating_margin: `${rand(10, 30)}%`,
        },
        management_effectiveness: {
          return_on_assets: `${rand(5, 15)}%`,
          return_on_equity: `${rand(20, 60)}%`,
        },
        income_statement: {
          revenue_ttm: `${rand(200, 400)}B`,
          revenue_per_share_ttm: `${rand(10, 30)}`,
          quarterly_revenue_growth: `${rand(2, 15)}%`,
          gross_profit_ttm: `${rand(100, 200)}B`,
          ebitda: `${rand(80, 150)}B`,
          net_income_ttm: `${rand(50, 120)}B`,
          diluted_eps_ttm: `${rand(5, 10)}`,
          quarterly_earnings_growth: `${rand(3, 20)}%`,
        },
        balance_sheet: {
          total_cash: `${rand(50, 150)}B`,
          total_cash_per_share: `${rand(3, 10)}`,
          total_debt: `${rand(80, 200)}B`,
          total_debt_equity: `${rand(40, 150)}%`,
          current_ratio: `${rand(0.8, 2)}`,
          book_value_per_share: `${rand(5, 20)}`,
        },
        cash_flow_statement: {
          operating_cash_flow: `${rand(80, 150)}B`,
          levered_free_cash_flow: `${rand(50, 120)}B`,
        },
      },
      trading_information: {
        beta: rand(0.8, 1.5),
        "52_week_change": `${rand(-10, 30)}%`,
        "52_week_high": rand(200, 260),
        "52_week_low": rand(110, 150),
        "50_day_moving_average": rand(150, 190),
        "200_day_moving_average": rand(140, 180),
        avg_vol_3month: `${rand(20, 80)}M`,
        avg_vol_10day: `${rand(25, 90)}M`,
        shares_outstanding: `${rand(10, 20)}B`,
        float: `${rand(9, 19)}B`,
        percent_held_by_insiders: `${rand(0.1, 2)}%`,
        percent_held_by_institutions: `${rand(60, 90)}%`,
        shares_short: `${rand(50, 200)}M`,
        short_ratio: rand(1, 5),
        short_percent_of_float: `${rand(0.5, 5)}%`,
        short_percent_of_shares_outstanding: `${rand(0.5, 4)}%`,
        shares_short_prior_month: `${rand(40, 180)}M`,
      },
    },

    analysis: {
      earnings_estimates: {
        "Current Qtr": {
          avg_estimate: rand(1, 3),
          low_estimate: rand(0.8, 2),
          high_estimate: rand(2, 4),
          year_ago_eps: rand(0.8, 2),
        },
        "Next Qtr": {
          avg_estimate: rand(1.2, 3.5),
          low_estimate: rand(1, 2.5),
          high_estimate: rand(2.5, 4.5),
          year_ago_eps: rand(1, 2),
        },
        "Current Year": {
          avg_estimate: rand(6, 10),
          low_estimate: rand(5, 8),
          high_estimate: rand(8, 12),
          year_ago_eps: rand(5, 9),
        },
        "Next Year": {
          avg_estimate: rand(7, 12),
          low_estimate: rand(6, 10),
          high_estimate: rand(9, 14),
          year_ago_eps: rand(6, 10),
        },
      },
      revenue_estimates: {
        "Current Qtr": {
          avg_estimate: `${rand(80, 120)}B`,
          low_estimate: `${rand(70, 100)}B`,
          high_estimate: `${rand(100, 140)}B`,
          year_ago_sales: `${rand(70, 100)}B`,
          sales_growth: `${rand(2, 10)}%`,
        },
        "Next Qtr": {
          avg_estimate: `${rand(85, 130)}B`,
          low_estimate: `${rand(75, 110)}B`,
          high_estimate: `${rand(110, 150)}B`,
          year_ago_sales: `${rand(80, 110)}B`,
          sales_growth: `${rand(3, 12)}%`,
        },
        "Current Year": {
          avg_estimate: `${rand(300, 420)}B`,
          low_estimate: `${rand(280, 380)}B`,
          high_estimate: `${rand(350, 450)}B`,
          year_ago_sales: `${rand(280, 380)}B`,
          sales_growth: `${rand(3, 10)}%`,
        },
        "Next Year": {
          avg_estimate: `${rand(320, 450)}B`,
          low_estimate: `${rand(300, 420)}B`,
          high_estimate: `${rand(380, 500)}B`,
          year_ago_sales: `${rand(300, 420)}B`,
          sales_growth: `${rand(4, 12)}%`,
        },
      },
      earnings_history: {},
      analyst_ratings: {
        current_rating: pick(["Buy", "Hold", "Outperform"]),
        price_target_avg: rand(170, 240),
        price_target_low: rand(150, 180),
        price_target_high: rand(220, 280),
        number_of_analysts: rand(20, 45, 0),
        ratings: [],
      },
    },

    technicals: {
      summary: {
        oscillators: {
          sell: rand(1, 5, 0),
          neutral: rand(3, 7, 0),
          buy: rand(2, 6, 0),
          overall: pick(["Buy", "Neutral", "Sell"]),
        },
        moving_averages: {
          sell: rand(1, 5, 0),
          neutral: rand(3, 7, 0),
          buy: rand(2, 6, 0),
          overall: pick(["Buy", "Neutral", "Sell"]),
        },
      },
      oscillators: [],
      moving_averages: [],
      pivots: {},
    },

    ai_insights: generateAIInsights(),
  };
}
