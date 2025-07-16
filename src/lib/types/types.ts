export interface Overview {
  current_price: number | null;
  change: number | null;
  percent_change: string | null;
  previous_close: number | null;
  open: number | null;
  bid: number | null;
  ask: number | null;
  day_range: string | null;
  '52_week_range': string | null;
  volume: string | null;
  avg_volume: string | null;
  market_cap: string | null;
  beta: number | null;
  pe_ratio: number | null;
  eps: number | null;
  earnings_date: string | null;
  forward_dividend_yield: string | null;
  ex_dividend_date: string | null;
  '1y_target_est': number | null;
}

export interface Fundamental {
  valuation_measures: {
    current: {
      market_cap: number | null;
      enterprise_value: number | null;
      trailing_pe: number | null;
      forward_pe: number | null;
      peg_ratio: number | null;
      price_sales: number | null;
      price_book: number | null;
      enterprise_value_revenue: number | null;
      enterprise_value_ebitda: number | null;
    };
    [key: string]: { [key: string]: number | null } | undefined;
  };
  financial_highlights: {
    fiscal_year_ends: string | null;
    most_recent_quarter: string | null;
    profitability: { profit_margin: string | null; operating_margin: string | null };
    management_effectiveness: { return_on_assets: string | null; return_on_equity: string | null };
    income_statement: {
      revenue_ttm: string | null;
      revenue_per_share_ttm: string | null;
      quarterly_revenue_growth: string | null;
      gross_profit_ttm: string | null;
      ebitda: string | null;
      net_income_ttm: string | null;
      diluted_eps_ttm: string | null;
      quarterly_earnings_growth: string | null;
    };
    balance_sheet: {
      total_cash: string | null;
      total_cash_per_share: string | null;
      total_debt: string | null;
      total_debt_equity: string | null;
      current_ratio: string | null;
      book_value_per_share: string | null;
    };
    cash_flow_statement: { operating_cash_flow: string | null; levered_free_cash_flow: string | null };
  };
  trading_information: {
    beta: string | number | null;
    '52_week_change': string | null;
    '52_week_high': number | null;
    '52_week_low': number | null;
    '50_day_moving_average': number | null;
    '200_day_moving_average': number | null;
    avg_vol_3month: string | null;
    avg_vol_10day: string | null;
    shares_outstanding: string | null;
    float: string | null;
    percent_held_by_insiders: string | null;
    percent_held_by_institutions: string | null;
    shares_short: string | null;
    short_ratio: number | null;
    short_percent_of_float: string | null;
    short_percent_of_shares_outstanding: string | null;
    shares_short_prior_month: string | null;
  };
}

export interface Analysis {
  earnings_estimates: {
    'Current Qtr': { avg_estimate: number | null; low_estimate: number | null; high_estimate: number | null; year_ago_eps: number | null };
    'Next Qtr': { avg_estimate: number | null; low_estimate: number | null; high_estimate: number | null; year_ago_eps: number | null };
    'Current Year': { avg_estimate: number | null; low_estimate: number | null; high_estimate: number | null; year_ago_eps: number | null };
    'Next Year': { avg_estimate: number | null; low_estimate: number | null; high_estimate: number | null; year_ago_eps: number | null };
  };
  revenue_estimates: {
    'Current Qtr': { avg_estimate: string | null; low_estimate: string | null; high_estimate: string | null; year_ago_sales: string | null; sales_growth: string | null };
    'Next Qtr': { avg_estimate: string | null; low_estimate: string | null; high_estimate: string | null; year_ago_sales: string | null; sales_growth: string | null };
    'Current Year': { avg_estimate: string | null; low_estimate: string | null; high_estimate: string | null; year_ago_sales: string | null; sales_growth: string | null };
    'Next Year': { avg_estimate: string | null; low_estimate: string | null; high_estimate: string | null; year_ago_sales: string | null; sales_growth: string | null };
  };
  earnings_history: { [key: string]: { eps_estimate: number | string | null; eps_actual: number | string | null; difference: number | string | null; surprise_percent: string | null } };
  analyst_ratings: {
    current_rating: string | null;
    price_target_avg: number | null;
    price_target_low: number | null;
    price_target_high: number | null;
    number_of_analysts: number | null;
    ratings: Array<{ firm: string | null; rating: string | null; price_target: number | null; date: string | null }>;
  };
}

export interface Technicals {
  summary: {
    oscillators: { sell: number | null; neutral: number | null; buy: number | null; overall: string | null };
    moving_averages: { sell: number | null; neutral: number | null; buy: number | null; overall: string | null };
  };
  oscillators: Array<{ name: string | null; value: number | string | null; action: string | null }>;
  moving_averages: Array<{ name: string | null; value: number | null; action: string | null }>;
  pivots: {
    Classic?: { R3: number | null; R2: number | null; R1: number | null; P: number | null; S1: number | null; S2: number | null; S3: number | null };
    Fibonacci?: { R3: number | null; R2: number | null; R1: number | null; P: number | null; S1: number | null; S2: number | null; S3: number | null };
    Camarilla?: { R3: number | null; R2: number | null; R1: number | null; P: number | null; S1: number | null; S2: number | null; S3: number | null };
    Woodie?: { R3: number | null; R2: number | null; R1: number | null; P: number | null; S1: number | null; S2: number | null; S3: number | null };
    DM?: { R3: number | null; R2: number | null; R1: number | null; P: number | null; S1: number | null; S2: number | null; S3: number | null };
  };
}

export interface CombinedData {
  ticker: string;
  last_updated: string;
  overview: Overview;
  fundamental: Fundamental;
  analysis: Analysis;
  technicals: Technicals;
  ai_insights: {
    summary: string;
    recommendation: {
      action: 'Buy' | 'Sell' | 'Hold';
      confidence: number;
      reasoning: string;
    };
    key_takeaways: string[];
    visualization_data: {
      price_trend: { x: string; y: number }[];
      bullishness_meter: number;
      risk_score: number;
    };
  } | null;
}

export interface TickerInfo {
  name: string;
  symbol: string;
  exchange: string;
  yf: string;
  tv: string;
  score?: number;
}