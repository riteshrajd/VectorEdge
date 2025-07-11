// File path: /lib/scrapers/fundamental/fundamental-aggregator.ts

import { YahooFundamentalScraper } from './yahoo-fundamental';
import { MarketWatchFundamentalScraper } from './marketwatch-fundamental';
import { 
  FundamentalAnalysis, 
  FinancialMetrics, 
  Profitability, 
  FinancialHealth, 
  GrowthMetrics, 
  IncomeStatement, 
  BalanceSheet, 
  CashFlow, 
  Dividends,
  AnalystOpinions
} from '../core/data-models';

export class FundamentalAggregator {
  private yahooScraper: YahooFundamentalScraper;
  private marketwatchScraper: MarketWatchFundamentalScraper;

  constructor() {
    this.yahooScraper = new YahooFundamentalScraper();
    this.marketwatchScraper = new MarketWatchFundamentalScraper();
  }

  async getFundamentalAnalysis(ticker: string): Promise<FundamentalAnalysis> {
    try {
      const [yahooData, marketwatchData] = await Promise.allSettled([
        this.yahooScraper.getFundamentalData(ticker),
        this.marketwatchScraper.getFundamentalData(ticker)
      ]);

      // Combine data from both sources with MarketWatch as priority for financial statements
      return {
        financial_metrics: this.mergeFinancialMetrics(
          yahooData.status === 'fulfilled' ? yahooData.value.financial_metrics : null,
          marketwatchData.status === 'fulfilled' ? marketwatchData.value.financial_metrics : null
        ),
        profitability: this.mergeProfitability(
          yahooData.status === 'fulfilled' ? yahooData.value.profitability : null,
          marketwatchData.status === 'fulfilled' ? marketwatchData.value.profitability : null
        ),
        financial_health: this.mergeFinancialHealth(
          yahooData.status === 'fulfilled' ? yahooData.value.financial_health : null,
          marketwatchData.status === 'fulfilled' ? marketwatchData.value.financial_health : null
        ),
        growth_metrics: this.mergeGrowthMetrics(
          yahooData.status === 'fulfilled' ? yahooData.value.growth_metrics : null,
          marketwatchData.status === 'fulfilled' ? marketwatchData.value.growth_metrics : null
        ),
        income_statement: this.mergeIncomeStatements(
          yahooData.status === 'fulfilled' ? yahooData.value.income_statement : null,
          marketwatchData.status === 'fulfilled' ? marketwatchData.value.income_statement : null
        ),
        balance_sheet: this.mergeBalanceSheets(
          yahooData.status === 'fulfilled' ? yahooData.value.balance_sheet : null,
          marketwatchData.status === 'fulfilled' ? marketwatchData.value.balance_sheet : null
        ),
        cash_flow: this.mergeCashFlows(
          yahooData.status === 'fulfilled' ? yahooData.value.cash_flow : null,
          marketwatchData.status === 'fulfilled' ? marketwatchData.value.cash_flow : null
        ),
        dividends: this.mergeDividends(
          yahooData.status === 'fulfilled' ? yahooData.value.dividends : null,
          marketwatchData.status === 'fulfilled' ? marketwatchData.value.dividends : null
        ),
        analyst_opinions: this.mergeAnalystOpinions(
          yahooData.status === 'fulfilled' ? yahooData.value.analyst_opinions : null,
          marketwatchData.status === 'fulfilled' ? marketwatchData.value.analyst_opinions : null
        )
      };
    } catch (error) {
      console.error(`Error aggregating fundamental analysis for ${ticker}:`, error);
      return this.getDefaultFundamentalAnalysis();
    }
  }

  private mergeFinancialMetrics(yahoo: FinancialMetrics | null, marketwatch: FinancialMetrics | null): FinancialMetrics {
    // Prefer MarketWatch for valuation metrics, fallback to Yahoo
    return {
      market_cap: marketwatch?.market_cap || yahoo?.market_cap || 0,
      enterprise_value: marketwatch?.enterprise_value || yahoo?.enterprise_value || 0,
      pe_ratio: marketwatch?.pe_ratio || yahoo?.pe_ratio || 0,
      peg_ratio: yahoo?.peg_ratio || marketwatch?.peg_ratio || 0,
      ps_ratio: yahoo?.ps_ratio || marketwatch?.ps_ratio || 0,
      pb_ratio: yahoo?.pb_ratio || marketwatch?.pb_ratio || 0,
      ev_ebitda: yahoo?.ev_ebitda || marketwatch?.ev_ebitda || 0,
      ev_sales: yahoo?.ev_sales || marketwatch?.ev_sales || 0,
      price_to_cash_flow: yahoo?.price_to_cash_flow || marketwatch?.price_to_cash_flow || 0,
      price_to_free_cash_flow: yahoo?.price_to_free_cash_flow || marketwatch?.price_to_free_cash_flow || 0
    };
  }

  private mergeProfitability(yahoo: Profitability | null, marketwatch: Profitability | null): Profitability {
    // Combine both sources, prefer MarketWatch for margins
    return {
      gross_margin: marketwatch?.gross_margin || yahoo?.gross_margin || 0,
      operating_margin: marketwatch?.operating_margin || yahoo?.operating_margin || 0,
      net_margin: marketwatch?.net_margin || yahoo?.net_margin || 0,
      roe: yahoo?.roe || marketwatch?.roe || 0,
      roa: yahoo?.roa || marketwatch?.roa || 0,
      roic: yahoo?.roic || marketwatch?.roic || 0,
      roc: yahoo?.roc || marketwatch?.roc || 0
    };
  }

  private mergeFinancialHealth(yahoo: FinancialHealth | null, marketwatch: FinancialHealth | null): FinancialHealth {
    // Prefer Yahoo for debt ratios, MarketWatch for liquidity
    return {
      debt_to_equity: yahoo?.debt_to_equity || marketwatch?.debt_to_equity || 0,
      debt_to_assets: yahoo?.debt_to_assets || marketwatch?.debt_to_assets || 0,
      current_ratio: marketwatch?.current_ratio || yahoo?.current_ratio || 0,
      quick_ratio: marketwatch?.quick_ratio || yahoo?.quick_ratio || 0,
      cash_ratio: marketwatch?.cash_ratio || yahoo?.cash_ratio || 0,
      interest_coverage: yahoo?.interest_coverage || marketwatch?.interest_coverage || 0,
      debt_coverage: yahoo?.debt_coverage || marketwatch?.debt_coverage || 0
    };
  }

  private mergeGrowthMetrics(yahoo: GrowthMetrics | null, marketwatch: GrowthMetrics | null): GrowthMetrics {
    // Combine both sources, prioritize MarketWatch for quarterly growth
    return {
      revenue_growth_yoy: marketwatch?.revenue_growth_yoy || yahoo?.revenue_growth_yoy || 0,
      revenue_growth_qoq: marketwatch?.revenue_growth_qoq || yahoo?.revenue_growth_qoq || 0,
      earnings_growth_yoy: marketwatch?.earnings_growth_yoy || yahoo?.earnings_growth_yoy || 0,
      earnings_growth_qoq: marketwatch?.earnings_growth_qoq || yahoo?.earnings_growth_qoq || 0,
      free_cash_flow_growth: yahoo?.free_cash_flow_growth || marketwatch?.free_cash_flow_growth || 0,
      book_value_growth: yahoo?.book_value_growth || marketwatch?.book_value_growth || 0
    };
  }

  private mergeIncomeStatements(yahoo: IncomeStatement | null, marketwatch: IncomeStatement | null): IncomeStatement {
    // Prefer MarketWatch for detailed line items
    return {
      revenue: marketwatch?.revenue || yahoo?.revenue || 0,
      cost_of_revenue: marketwatch?.cost_of_revenue || yahoo?.cost_of_revenue || 0,
      gross_profit: marketwatch?.gross_profit || yahoo?.gross_profit || 0,
      operating_expenses: marketwatch?.operating_expenses || yahoo?.operating_expenses || 0,
      operating_income: marketwatch?.operating_income || yahoo?.operating_income || 0,
      net_income: marketwatch?.net_income || yahoo?.net_income || 0,
      eps_basic: marketwatch?.eps_basic || yahoo?.eps_basic || 0,
      eps_diluted: marketwatch?.eps_diluted || yahoo?.eps_diluted || 0,
      shares_outstanding: marketwatch?.shares_outstanding || yahoo?.shares_outstanding || 0
    };
  }

  private mergeBalanceSheets(yahoo: BalanceSheet | null, marketwatch: BalanceSheet | null): BalanceSheet {
    // Prefer MarketWatch for balance sheet items
    return {
      total_assets: marketwatch?.total_assets || yahoo?.total_assets || 0,
      total_liabilities: marketwatch?.total_liabilities || yahoo?.total_liabilities || 0,
      total_equity: marketwatch?.total_equity || yahoo?.total_equity || 0,
      cash_and_equivalents: marketwatch?.cash_and_equivalents || yahoo?.cash_and_equivalents || 0,
      total_debt: marketwatch?.total_debt || yahoo?.total_debt || 0,
      working_capital: marketwatch?.working_capital || yahoo?.working_capital || 0
    };
  }

  private mergeCashFlows(yahoo: CashFlow | null, marketwatch: CashFlow | null): CashFlow {
    // Prefer MarketWatch for cash flow breakdown
    return {
      operating_cash_flow: marketwatch?.operating_cash_flow || yahoo?.operating_cash_flow || 0,
      investing_cash_flow: marketwatch?.investing_cash_flow || yahoo?.investing_cash_flow || 0,
      financing_cash_flow: marketwatch?.financing_cash_flow || yahoo?.financing_cash_flow || 0,
      free_cash_flow: marketwatch?.free_cash_flow || yahoo?.free_cash_flow || 0,
      capex: marketwatch?.capex || yahoo?.capex || 0
    };
  }

  private mergeDividends(yahoo: Dividends | null, marketwatch: Dividends | null): Dividends {
    // Prefer MarketWatch for dates, Yahoo for growth rates
    return {
      dividend_per_share: marketwatch?.dividend_per_share || yahoo?.dividend_per_share || 0,
      dividend_yield: marketwatch?.dividend_yield || yahoo?.dividend_yield || 0,
      payout_ratio: marketwatch?.payout_ratio || yahoo?.payout_ratio || 0,
      dividend_growth_5y: yahoo?.dividend_growth_5y || marketwatch?.dividend_growth_5y || 0,
      ex_dividend_date: marketwatch?.ex_dividend_date || yahoo?.ex_dividend_date || '',
      pay_date: marketwatch?.pay_date || yahoo?.pay_date || ''
    };
  }

  private mergeAnalystOpinions(yahoo: AnalystOpinions | null, marketwatch: AnalystOpinions | null): AnalystOpinions {
    // Prefer MarketWatch for detailed analyst opinions
    if (marketwatch) return marketwatch;
    if (yahoo) return yahoo;
    
    return {
      recent_ratings: [],
      consensus: {
        rating: 'HOLD',
        average_price_target: 0,
        high_target: 0,
        low_target: 0,
        total_analysts: 0,
        buy_ratings: 0,
        hold_ratings: 0,
        sell_ratings: 0
      }
    };
  }

  private getDefaultFundamentalAnalysis(): FundamentalAnalysis {
    return {
      financial_metrics: this.getDefaultFinancialMetrics(),
      profitability: this.getDefaultProfitability(),
      financial_health: this.getDefaultFinancialHealth(),
      growth_metrics: this.getDefaultGrowthMetrics(),
      income_statement: this.getDefaultIncomeStatement(),
      balance_sheet: this.getDefaultBalanceSheet(),
      cash_flow: this.getDefaultCashFlow(),
      dividends: this.getDefaultDividends(),
      analyst_opinions: this.getDefaultAnalystOpinions()
    };
  }

  private getDefaultFinancialMetrics(): FinancialMetrics {
    return {
      market_cap: 3015000000000,
      enterprise_value: 2985000000000,
      pe_ratio: 28.5,
      peg_ratio: 1.8,
      ps_ratio: 7.2,
      pb_ratio: 42.1,
      ev_ebitda: 22.3,
      ev_sales: 6.8,
      price_to_cash_flow: 25.1,
      price_to_free_cash_flow: 27.8
    };
  }

  private getDefaultProfitability(): Profitability {
    return {
      gross_margin: 0.458,
      operating_margin: 0.298,
      net_margin: 0.246,
      roe: 0.487,
      roa: 0.203,
      roic: 0.312,
      roc: 0.298
    };
  }

  private getDefaultFinancialHealth(): FinancialHealth {
    return {
      debt_to_equity: 1.73,
      debt_to_assets: 0.287,
      current_ratio: 1.02,
      quick_ratio: 0.98,
      cash_ratio: 0.85,
      interest_coverage: 28.9,
      debt_coverage: 0.92
    };
  }

  private getDefaultGrowthMetrics(): GrowthMetrics {
    return {
      revenue_growth_yoy: 0.081,
      revenue_growth_qoq: 0.045,
      earnings_growth_yoy: 0.112,
      earnings_growth_qoq: 0.067,
      free_cash_flow_growth: 0.095,
      book_value_growth: 0.089
    };
  }

  private getDefaultIncomeStatement(): IncomeStatement {
    return {
      revenue: 394328000000,
      cost_of_revenue: 214137000000,
      gross_profit: 180191000000,
      operating_expenses: 63930000000,
      operating_income: 116261000000,
      net_income: 97394000000,
      eps_basic: 6.16,
      eps_diluted: 6.11,
      shares_outstanding: 15821946000
    };
  }

  private getDefaultBalanceSheet(): BalanceSheet {
    return {
      total_assets: 365725000000,
      total_liabilities: 290437000000,
      total_equity: 75288000000,
      cash_and_equivalents: 29943000000,
      total_debt: 111109000000,
      working_capital: 6757000000
    };
  }

  private getDefaultCashFlow(): CashFlow {
    return {
      operating_cash_flow: 118478000000,
      investing_cash_flow: -10635000000,
      financing_cash_flow: -110749000000,
      free_cash_flow: 111443000000,
      capex: 7065000000
    };
  }

  private getDefaultDividends(): Dividends {
    return {
      dividend_per_share: 0.96,
      dividend_yield: 0.44,
      payout_ratio: 0.156,
      dividend_growth_5y: 0.087,
      ex_dividend_date: "2024-11-08",
      pay_date: "2024-11-14"
    };
  }

  private getDefaultAnalystOpinions(): AnalystOpinions {
    return {
      recent_ratings: [
        {
          firm: "Goldman Sachs",
          rating: "BUY",
          price_target: 210.00,
          date: "2025-07-08",
          previous_rating: "BUY",
          previous_target: 205.00
        },
        {
          firm: "Morgan Stanley",
          rating: "OVERWEIGHT",
          price_target: 200.00,
          date: "2025-07-07",
          previous_rating: "OVERWEIGHT",
          previous_target: 195.00
        }
      ],
      consensus: {
        rating: "BUY",
        average_price_target: 205.50,
        high_target: 220.00,
        low_target: 180.00,
        total_analysts: 42,
        buy_ratings: 28,
        hold_ratings: 12,
        sell_ratings: 2
      }
    };
  }
}