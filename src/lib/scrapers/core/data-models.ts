// File path: /lib/scrapers/core/data-models.ts

export interface StockData {
  ticker: string;
  company_name: string;
  last_updated: string;
  market_status: string;
  current_price: number;
  currency: string;
  overview: Overview;
  technical_analysis: TechnicalAnalysis;
  fundamental_analysis: FundamentalAnalysis;
  news_and_sentiment: NewsAndSentiment;
  options_data: OptionsData;
  economic_indicators: EconomicIndicators;
  competitors: Competitors;
  risk_analysis: RiskAnalysis;
  forecasts: Forecasts;
  alerts: Alerts;
}

export interface Overview {
  market_cap: number;
  pe_ratio: number;
  eps: number;
  dividend_yield: number;
  "52_week_high": number;
  "52_week_low": number;
  volume: number;
  avg_volume: number;
  beta: number;
  analyst_rating: string;
  price_target: number;
  recommendation_score: number;
  risk_score: number;
  momentum_score: number;
  value_score: number;
  growth_score: number;
  profitability_score: number;
  financial_health: string;
}

export interface TechnicalAnalysis {
  price_data: PriceData;
  moving_averages: MovingAverages;
  technical_indicators: TechnicalIndicators;
  support_resistance: SupportResistance;
  volume_analysis: VolumeAnalysis;
  patterns: Patterns;
  signals: Signals;
}

export interface PriceData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  vwap: number;
  change: number;
  change_percent: number;
}

export interface MovingAverages {
  sma_20: number;
  sma_50: number;
  sma_200: number;
  ema_12: number;
  ema_26: number;
  ema_50: number;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: {
    macd_line: number;
    signal_line: number;
    histogram: number;
  };
  bollinger_bands: {
    upper: number;
    middle: number;
    lower: number;
    width: number;
  };
  stochastic: {
    k_percent: number;
    d_percent: number;
  };
  williams_r: number;
  cci: number;
  atr: number;
  adx: number;
}

export interface SupportResistance {
  resistance_levels: number[];
  support_levels: number[];
  pivot_points: {
    pivot: number;
    r1: number;
    r2: number;
    r3: number;
    s1: number;
    s2: number;
    s3: number;
  };
}

export interface VolumeAnalysis {
  volume_trend: string;
  volume_sma_20: number;
  volume_ratio: number;
  on_balance_volume: number;
  accumulation_distribution: number;
  money_flow_index: number;
}

export interface Patterns {
  chart_patterns: string[];
  candlestick_patterns: string[];
  trend_direction: string;
  trend_strength: number;
}

export interface Signals {
  buy_signals: string[];
  sell_signals: string[];
  overall_signal: string;
  signal_strength: number;
}

export interface FundamentalAnalysis {
  financial_metrics: FinancialMetrics;
  profitability: Profitability;
  financial_health: FinancialHealth;
  growth_metrics: GrowthMetrics;
  income_statement: IncomeStatement;
  balance_sheet: BalanceSheet;
  cash_flow: CashFlow;
  dividends: Dividends;
}

export interface FinancialMetrics {
  market_cap: number;
  enterprise_value: number;
  pe_ratio: number;
  peg_ratio: number;
  ps_ratio: number;
  pb_ratio: number;
  ev_ebitda: number;
  ev_sales: number;
  price_to_cash_flow: number;
  price_to_free_cash_flow: number;
}

export interface Profitability {
  gross_margin: number;
  operating_margin: number;
  net_margin: number;
  roe: number;
  roa: number;
  roic: number;
  roc: number;
}

export interface FinancialHealth {
  debt_to_equity: number;
  debt_to_assets: number;
  current_ratio: number;
  quick_ratio: number;
  cash_ratio: number;
  interest_coverage: number;
  debt_coverage: number;
}

export interface GrowthMetrics {
  revenue_growth_yoy: number;
  revenue_growth_qoq: number;
  earnings_growth_yoy: number;
  earnings_growth_qoq: number;
  free_cash_flow_growth: number;
  book_value_growth: number;
}

export interface IncomeStatement {
  revenue: number;
  cost_of_revenue: number;
  gross_profit: number;
  operating_expenses: number;
  operating_income: number;
  net_income: number;
  eps_basic: number;
  eps_diluted: number;
  shares_outstanding: number;
}

export interface BalanceSheet {
  total_assets: number;
  total_liabilities: number;
  total_equity: number;
  cash_and_equivalents: number;
  total_debt: number;
  working_capital: number;
}

export interface CashFlow {
  operating_cash_flow: number;
  investing_cash_flow: number;
  financing_cash_flow: number;
  free_cash_flow: number;
  capex: number;
}

export interface Dividends {
  dividend_per_share: number;
  dividend_yield: number;
  payout_ratio: number;
  dividend_growth_5y: number;
  ex_dividend_date: string;
  pay_date: string;
}

export interface NewsAndSentiment {
  sentiment_analysis: SentimentAnalysis;
  news_articles: NewsArticle[];
  social_sentiment: SocialSentiment;
  analyst_opinions: AnalystOpinions;
  insider_trading: InsiderTrading;
  institutional_activity: InstitutionalActivity;
}

export interface SentimentAnalysis {
  overall_sentiment: string;
  sentiment_score: number;
  bullish_percentage: number;
  bearish_percentage: number;
  neutral_percentage: number;
  confidence_level: number;
}

export interface NewsArticle {
  title: string;
  summary: string;
  source: string;
  published_date: string;
  url: string;
  sentiment: string;
  sentiment_score: number;
  relevance: number;
  category: string;
  impact_score: number;
}

export interface SocialSentiment {
  twitter_sentiment: {
    sentiment: string;
    sentiment_score: number;
    volume: number;
    engagement: number;
    trending_hashtags: string[];
  };
  reddit_sentiment: {
    sentiment: string;
    sentiment_score: number;
    mentions: number;
    upvote_ratio: number;
    popular_subreddits: string[];
  };
  stocktwits_sentiment: {
    sentiment: string;
    sentiment_score: number;
    bullish_percentage: number;
    bearish_percentage: number;
    message_volume: number;
  };
}

export interface AnalystOpinions {
  recent_ratings: AnalystRating[];
  consensus: {
    rating: string;
    average_price_target: number;
    high_target: number;
    low_target: number;
    total_analysts: number;
    buy_ratings: number;
    hold_ratings: number;
    sell_ratings: number;
  };
}

export interface AnalystRating {
  firm: string;
  rating: string;
  price_target: number;
  date: string;
  previous_rating: string;
  previous_target: number;
}

export interface InsiderTrading {
  recent_transactions: InsiderTransaction[];
  insider_sentiment: string;
  net_insider_buying: number;
  insider_ownership: number;
}

export interface InsiderTransaction {
  insider_name: string;
  title: string;
  transaction_type: string;
  shares: number;
  price: number;
  date: string;
  value: number;
}

export interface InstitutionalActivity {
  recent_changes: InstitutionalChange[];
  institutional_ownership: number;
  top_holders: InstitutionalHolder[];
}

export interface InstitutionalChange {
  institution: string;
  change_type: string;
  shares_change: number;
  new_position: number;
  percent_change: number;
  date: string;
}

export interface InstitutionalHolder {
  institution: string;
  shares: number;
  percentage: number;
}

export interface OptionsData {
  options_chain: OptionsChain;
  options_metrics: OptionsMetrics;
}

export interface OptionsChain {
  expiration_dates: string[];
  calls: OptionContract[];
  puts: OptionContract[];
}

export interface OptionContract {
  strike: number;
  expiration: string;
  bid: number;
  ask: number;
  volume: number;
  open_interest: number;
  implied_volatility: number;
}

export interface OptionsMetrics {
  put_call_ratio: number;
  max_pain: number;
  implied_volatility: number;
  iv_rank: number;
  iv_percentile: number;
}

export interface EconomicIndicators {
  macro_environment: {
    gdp_growth: number;
    unemployment_rate: number;
    inflation_rate: number;
    interest_rate: number;
    vix: number;
    dollar_index: number;
  };
  sector_performance: {
    technology: number;
    sp500: number;
    nasdaq: number;
    sector_ranking: number;
  };
}

export interface Competitors {
  peer_comparison: Competitor[];
}

export interface Competitor {
  ticker: string;
  name: string;
  market_cap: number;
  pe_ratio: number;
  price_change: number;
  relative_strength: number;
}

export interface RiskAnalysis {
  risk_metrics: {
    beta: number;
    sharpe_ratio: number;
    sortino_ratio: number;
    max_drawdown: number;
    var_1d: number;
    var_5d: number;
  };
  risk_factors: string[];
}

export interface Forecasts {
  price_predictions: {
    "1_week": number;
    "1_month": number;
    "3_month": number;
    "6_month": number;
    "1_year": number;
  };
  earnings_forecast: {
    next_quarter_eps: number;
    next_year_eps: number;
    revenue_growth_next_year: number;
  };
}

export interface Alerts {
  price_alerts: string[];
  volume_alerts: string[];
  technical_alerts: string[];
  fundamental_alerts: string[];
  news_alerts: string[];
}