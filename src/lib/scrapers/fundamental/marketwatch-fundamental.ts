// File path: /lib/scrapers/fundamental/marketwatch-fundamental.ts

import { BaseScraper } from '../core/base-scraper';
import { 
  FundamentalAnalysis, 
  GrowthMetrics, 
  IncomeStatement, 
  BalanceSheet, 
  CashFlow,
  Dividends,
  AnalystOpinions
} from '../core/data-models';

export class MarketWatchFundamentalScraper extends BaseScraper {
  constructor() {
    super(1.5); // MarketWatch allows slightly higher rate
  }

  async getFundamentalData(ticker: string): Promise<Partial<FundamentalAnalysis>> {
    try {
      const [growthMetrics, incomeStatement, balanceSheet, cashFlow, dividends, analystOpinions] = await Promise.all([
        this.getGrowthMetrics(ticker),
        this.getIncomeStatement(ticker),
        this.getBalanceSheet(ticker),
        this.getCashFlow(ticker),
        this.getDividends(ticker),
        this.getAnalystOpinions(ticker)
      ]);

      return {
        growth_metrics: growthMetrics,
        income_statement: incomeStatement,
        balance_sheet: balanceSheet,
        cash_flow: cashFlow,
        dividends,
        analyst_opinions: analystOpinions
      };
    } catch (error) {
      console.error(`Error scraping MarketWatch fundamental data for ${ticker}:`, error);
      throw error;
    }
  }

  private async getGrowthMetrics(ticker: string): Promise<GrowthMetrics> {
    const $ = await this.fetchHTML(`https://www.marketwatch.com/investing/stock/${ticker}/financials`);
    
    const growthMetrics: GrowthMetrics = {
      revenue_growth_yoy: 0,
      revenue_growth_qoq: 0,
      earnings_growth_yoy: 0,
      earnings_growth_qoq: 0,
      free_cash_flow_growth: 0,
      book_value_growth: 0
    };

    // Extract growth rates from financial tables
    $('table.table--primary tr').each((i, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 6) {
        const metricName = $(cells[0]).text().trim();
        const yoyGrowth = this.parsePercentage($(cells[5]).text().trim());
        
        switch (metricName) {
          case 'Sales/Revenue':
            growthMetrics.revenue_growth_yoy = yoyGrowth;
            break;
          case 'Net Income':
            growthMetrics.earnings_growth_yoy = yoyGrowth;
            break;
        }
      }
    });

    return growthMetrics;
  }

  private async getIncomeStatement(ticker: string): Promise<IncomeStatement> {
    const $ = await this.fetchHTML(`https://www.marketwatch.com/investing/stock/${ticker}/financials/income`);
    
    const incomeStatement: IncomeStatement = {
      revenue: 0,
      cost_of_revenue: 0,
      gross_profit: 0,
      operating_expenses: 0,
      operating_income: 0,
      net_income: 0,
      eps_basic: 0,
      eps_diluted: 0,
      shares_outstanding: 0
    };

    $('table.table--primary tr').each((i, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 6) {
        const metricName = $(cells[0]).text().trim();
        const latestValue = this.parseNumber($(cells[1]).text().trim());
        
        switch (metricName) {
          case 'Sales/Revenue':
            incomeStatement.revenue = latestValue;
            break;
          case 'Cost of Goods Sold':
            incomeStatement.cost_of_revenue = latestValue;
            break;
          case 'Gross Income':
            incomeStatement.gross_profit = latestValue;
            break;
          case 'Selling, General & Admin':
          case 'Research & Development':
          case 'Operating Expenses':
            incomeStatement.operating_expenses += latestValue;
            break;
          case 'Operating Income':
            incomeStatement.operating_income = latestValue;
            break;
          case 'Net Income':
            incomeStatement.net_income = latestValue;
            break;
          case 'Diluted EPS':
            incomeStatement.eps_diluted = latestValue;
            break;
          case 'Basic EPS':
            incomeStatement.eps_basic = latestValue;
            break;
          case 'Shares Outstanding (Basic)':
            incomeStatement.shares_outstanding = latestValue;
            break;
        }
      }
    });

    return incomeStatement;
  }

  private async getBalanceSheet(ticker: string): Promise<BalanceSheet> {
    const $ = await this.fetchHTML(`https://www.marketwatch.com/investing/stock/${ticker}/financials/balance-sheet`);
    
    const balanceSheet: BalanceSheet = {
      total_assets: 0,
      total_liabilities: 0,
      total_equity: 0,
      cash_and_equivalents: 0,
      total_debt: 0,
      working_capital: 0
    };

    $('table.table--primary tr').each((i, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 6) {
        const metricName = $(cells[0]).text().trim();
        const latestValue = this.parseNumber($(cells[1]).text().trim());
        
        switch (metricName) {
          case 'Total Assets':
            balanceSheet.total_assets = latestValue;
            break;
          case 'Total Liabilities':
            balanceSheet.total_liabilities = latestValue;
            break;
          case 'Total Equity':
            balanceSheet.total_equity = latestValue;
            break;
          case 'Cash & Short Term Investments':
            balanceSheet.cash_and_equivalents = latestValue;
            break;
          case 'Total Debt':
            balanceSheet.total_debt = latestValue;
            break;
          case 'Net Working Capital':
            balanceSheet.working_capital = latestValue;
            break;
        }
      }
    });

    return balanceSheet;
  }

  private async getCashFlow(ticker: string): Promise<CashFlow> {
    const $ = await this.fetchHTML(`https://www.marketwatch.com/investing/stock/${ticker}/financials/cash-flow`);
    
    const cashFlow: CashFlow = {
      operating_cash_flow: 0,
      investing_cash_flow: 0,
      financing_cash_flow: 0,
      free_cash_flow: 0,
      capex: 0
    };

    $('table.table--primary tr').each((i, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 6) {
        const metricName = $(cells[0]).text().trim();
        const latestValue = this.parseNumber($(cells[1]).text().trim());
        
        switch (metricName) {
          case 'Cash from Operating Activities':
            cashFlow.operating_cash_flow = latestValue;
            break;
          case 'Cash from Investing Activities':
            cashFlow.investing_cash_flow = latestValue;
            break;
          case 'Cash from Financing Activities':
            cashFlow.financing_cash_flow = latestValue;
            break;
          case 'Free Cash Flow':
            cashFlow.free_cash_flow = latestValue;
            break;
          case 'Capital Expenditure':
            cashFlow.capex = Math.abs(latestValue); // Typically negative
            break;
        }
      }
    });

    return cashFlow;
  }

  private async getDividends(ticker: string): Promise<Dividends> {
    const $ = await this.fetchHTML(`https://www.marketwatch.com/investing/stock/${ticker}/dividends`);
    
    const dividends: Dividends = {
      dividend_per_share: 0,
      dividend_yield: 0,
      payout_ratio: 0,
      dividend_growth_5y: 0,
      ex_dividend_date: '',
      pay_date: ''
    };

    // Extract dividend data
    $('.dividends tr').each((i, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 4) {
        const label = $(cells[0]).text().trim();
        const value = $(cells[1]).text().trim();
        
        if (label === 'Dividend') {
          dividends.dividend_per_share = this.parseNumber(value);
        } else if (label === 'Dividend Yield') {
          dividends.dividend_yield = this.parsePercentage(value);
        } else if (label === 'Payout Ratio') {
          dividends.payout_ratio = this.parsePercentage(value);
        }
      }
    });

    // Get latest dividend dates
    $('table.table--dividends tr').each((i, row) => {
      if (i === 1) { // First data row
        const cells = $(row).find('td');
        if (cells.length >= 4) {
          dividends.ex_dividend_date = new Date($(cells[0]).text().trim()).toISOString().split('T')[0];
          dividends.pay_date = new Date($(cells[1]).text().trim()).toISOString().split('T')[0];
        }
      }
    });

    // Get 5-year dividend growth
    $('.element--growth').each((i, el) => {
      const label = $(el).find('.label').text().trim();
      const value = $(el).find('.value').text().trim();
      
      if (label === '5-Year Growth Rate') {
        dividends.dividend_growth_5y = this.parsePercentage(value);
      }
    });

    return dividends;
  }

  private async getAnalystOpinions(ticker: string): Promise<AnalystOpinions> {
    const $ = await this.fetchHTML(`https://www.marketwatch.com/investing/stock/${ticker}/analystestimates`);
    
    const analystOpinions: AnalystOpinions = {
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

    // Extract consensus rating
    $('.analyst-ratings__rating').each((i, el) => {
      const rating = $(el).find('.analyst-ratings__value').text().trim();
      if (rating && i === 0) { // First rating is consensus
        analystOpinions.consensus.rating = this.normalizeRating(rating);
      }
    });

    // Extract price targets
    $('.analyst-ratings__price-target').each((i, el) => {
      const value = $(el).find('.analyst-ratings__value').text().trim();
      if (value && i === 0) { // First is average
        analystOpinions.consensus.average_price_target = this.parseNumber(value);
      } else if (value && i === 1) { // Second is high
        analystOpinions.consensus.high_target = this.parseNumber(value);
      } else if (value && i === 2) { // Third is low
        analystOpinions.consensus.low_target = this.parseNumber(value);
      }
    });

    // Extract rating distribution
    $('.analyst-ratings__distribution li').each((i, el) => {
      const label = $(el).find('.analyst-ratings__label').text().trim();
      const count = parseInt($(el).find('.analyst-ratings__count').text().trim(), 10) || 0;
      
      if (label.includes('Buy')) {
        analystOpinions.consensus.buy_ratings = count;
        analystOpinions.consensus.total_analysts += count;
      } else if (label.includes('Hold')) {
        analystOpinions.consensus.hold_ratings = count;
        analystOpinions.consensus.total_analysts += count;
      } else if (label.includes('Sell')) {
        analystOpinions.consensus.sell_ratings = count;
        analystOpinions.consensus.total_analysts += count;
      }
    });

    // Extract recent ratings
    $('table.ratings tbody tr').each((i, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 5) {
        const firm = $(cells[0]).text().trim();
        const rating = this.normalizeRating($(cells[1]).text().trim());
        const target = this.parseNumber($(cells[2]).text().trim());
        const date = new Date($(cells[3]).text().trim()).toISOString().split('T')[0];
        
        analystOpinions.recent_ratings.push({
          firm,
          rating,
          price_target: target,
          date,
          previous_rating: 'HOLD', // Not available on MarketWatch
          previous_target: 0
        });
      }
    });

    return analystOpinions;
  }

  private normalizeRating(rating: string): string {
    rating = rating.toLowerCase();
    if (rating.includes('buy') || rating.includes('outperform') || rating.includes('overweight')) {
      return 'BUY';
    } else if (rating.includes('hold') || rating.includes('neutral') || rating.includes('market perform')) {
      return 'HOLD';
    } else if (rating.includes('sell') || rating.includes('underperform') || rating.includes('underweight')) {
      return 'SELL';
    }
    return 'HOLD';
  }
}