// File path: /lib/scrapers/fundamental/yahoo-fundamental.ts

import { BaseScraper } from '../core/base-scraper';
import { 
  FundamentalAnalysis, 
  FinancialMetrics, 
  Profitability, 
  FinancialHealth, 
  GrowthMetrics, 
  IncomeStatement, 
  BalanceSheet, 
  CashFlow, 
  Dividends 
} from '../core/data-models';

export class YahooFundamentalScraper extends BaseScraper {
  constructor() {
    super(1); // Conservative rate limit for Yahoo Finance
  }

  async getFundamentalData(ticker: string): Promise<Partial<FundamentalAnalysis>> {
    try {
      const [financialMetrics, profitability, financialHealth, growthMetrics] = await Promise.all([
        this.getFinancialMetrics(ticker),
        this.getProfitabilityMetrics(ticker),
        this.getFinancialHealthMetrics(ticker),
        this.getGrowthMetrics(ticker)
      ]);

      const [incomeStatement, balanceSheet, cashFlow, dividends] = await Promise.all([
        this.getIncomeStatement(ticker),
        this.getBalanceSheet(ticker),
        this.getCashFlow(ticker),
        this.getDividends(ticker)
      ]);

      return {
        financial_metrics: financialMetrics,
        profitability,
        financial_health: financialHealth,
        growth_metrics: growthMetrics,
        income_statement: incomeStatement,
        balance_sheet: balanceSheet,
        cash_flow: cashFlow,
        dividends
      };
    } catch (error) {
      console.error(`Error scraping Yahoo fundamental data for ${ticker}:`, error);
      throw error;
    }
  }

  // Update in yahoo-fundamental.ts
  private async getFinancialMetrics(ticker: string): Promise<FinancialMetrics> {
    const $ = await this.fetchHTML(`https://finance.yahoo.com/quote/${ticker}/key-statistics?p=${ticker}`);
    
    // New selector for modern Yahoo Finance layout
    const extractValue = (label: string) => {
      const element = $(`td:contains("${label}")`).next();
      return this.parseNumber(element.text());
    };

    return {
      market_cap: extractValue('Market Cap (intraday)'),
      enterprise_value: extractValue('Enterprise Value'),
      pe_ratio: extractValue('Trailing P/E'),
      peg_ratio: extractValue('PEG Ratio'),
      ps_ratio: extractValue('Price/Sales'),
      pb_ratio: extractValue('Price/Book'),
      ev_ebitda: extractValue('Enterprise Value/EBITDA'),
      ev_sales: extractValue('Enterprise Value/Revenue'),
      price_to_cash_flow: extractValue('Price/Cash Flow'),
      price_to_free_cash_flow: extractValue('Price/Free Cash Flow')
    };
  }

  private async getProfitabilityMetrics(ticker: string): Promise<Profitability> {
    const $ = await this.fetchHTML(`https://finance.yahoo.com/quote/${ticker}/key-statistics`);
    
    const metrics: Record<string, number> = {};
    const metricKeys = [
      'Profit Margin', 'Operating Margin', 
      'Return on Equity', 'Return on Assets', 
      'Return on Invested Capital', 'Return on Capital'
    ];

    $('section[data-test="qsp-statistics"] tr').each((i, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 2) {
        const key = $(cells[0]).text().trim();
        const value = $(cells[1]).text().trim();
        
        if (metricKeys.includes(key)) {
          metrics[key] = this.parsePercentage(value);
        }
      }
    });

    return {
      gross_margin: metrics['Gross Margin'] || 0,
      operating_margin: metrics['Operating Margin'] || 0,
      net_margin: metrics['Profit Margin'] || 0,
      roe: metrics['Return on Equity'] || 0,
      roa: metrics['Return on Assets'] || 0,
      roic: metrics['Return on Invested Capital'] || 0,
      roc: metrics['Return on Capital'] || 0
    };
  }

  private async getFinancialHealthMetrics(ticker: string): Promise<FinancialHealth> {
    const $ = await this.fetchHTML(`https://finance.yahoo.com/quote/${ticker}/key-statistics`);
    
    const metrics: Record<string, number> = {};
    const metricKeys = [
      'Total Debt/Equity', 'Debt/Assets', 
      'Current Ratio', 'Quick Ratio', 
      'Cash Ratio', 'Interest Coverage', 
      'Debt Coverage'
    ];

    $('section[data-test="qsp-statistics"] tr').each((i, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 2) {
        const key = $(cells[0]).text().trim();
        const value = $(cells[1]).text().trim();
        
        if (metricKeys.includes(key)) {
          metrics[key] = this.parseNumber(value);
        }
      }
    });

    return {
      debt_to_equity: metrics['Total Debt/Equity'] || 0,
      debt_to_assets: metrics['Debt/Assets'] || 0,
      current_ratio: metrics['Current Ratio'] || 0,
      quick_ratio: metrics['Quick Ratio'] || 0,
      cash_ratio: metrics['Cash Ratio'] || 0,
      interest_coverage: metrics['Interest Coverage'] || 0,
      debt_coverage: metrics['Debt Coverage'] || 0
    };
  }

  private async getGrowthMetrics(ticker: string): Promise<GrowthMetrics> {
    const $ = await this.fetchHTML(`https://finance.yahoo.com/quote/${ticker}/analysis`);
    
    const growthMetrics: GrowthMetrics = {
      revenue_growth_yoy: 0,
      revenue_growth_qoq: 0,
      earnings_growth_yoy: 0,
      earnings_growth_qoq: 0,
      free_cash_flow_growth: 0,
      book_value_growth: 0
    };

    // Extract growth estimates
    $('section[data-test="qsp-analyst"] table').each((i, table) => {
      const rows = $(table).find('tr');
      if (rows.length > 1) {
        const header = $(rows[0]).find('th').map((j, th) => $(th).text().trim()).get();
        const data = $(rows[1]).find('td').map((j, td) => $(td).text().trim()).get();
        
        if (header.includes('Growth Estimates') && data.length >= 5) {
          growthMetrics.revenue_growth_yoy = this.parsePercentage(data[1]);
          growthMetrics.earnings_growth_yoy = this.parsePercentage(data[3]);
        }
      }
    });

    return growthMetrics;
  }

  private async getIncomeStatement(ticker: string): Promise<IncomeStatement> {
    const $ = await this.fetchHTML(`https://finance.yahoo.com/quote/${ticker}/financials`);
    
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

    $('div[data-test="fin-row"]').each((i, row) => {
      const title = $(row).find('div[title]').text().trim();
      const values = $(row).find('span').map((j, span) => $(span).text().trim()).get();
      const value = values.length > 0 ? this.parseNumber(values[values.length - 1]) : 0;
      
      switch (title) {
        case 'Total Revenue':
          incomeStatement.revenue = value;
          break;
        case 'Cost of Revenue':
          incomeStatement.cost_of_revenue = value;
          break;
        case 'Gross Profit':
          incomeStatement.gross_profit = value;
          break;
        case 'Operating Expense':
          incomeStatement.operating_expenses = value;
          break;
        case 'Operating Income':
          incomeStatement.operating_income = value;
          break;
        case 'Net Income':
          incomeStatement.net_income = value;
          break;
        case 'Basic EPS':
          incomeStatement.eps_basic = value;
          break;
        case 'Diluted EPS':
          incomeStatement.eps_diluted = value;
          break;
        case 'Basic Shares Outstanding':
          incomeStatement.shares_outstanding = value;
          break;
      }
    });

    return incomeStatement;
  }

  private async getBalanceSheet(ticker: string): Promise<BalanceSheet> {
    const $ = await this.fetchHTML(`https://finance.yahoo.com/quote/${ticker}/balance-sheet`);
    
    const balanceSheet: BalanceSheet = {
      total_assets: 0,
      total_liabilities: 0,
      total_equity: 0,
      cash_and_equivalents: 0,
      total_debt: 0,
      working_capital: 0
    };

    $('div[data-test="fin-row"]').each((i, row) => {
      const title = $(row).find('div[title]').text().trim();
      const values = $(row).find('span').map((j, span) => $(span).text().trim()).get();
      const value = values.length > 0 ? this.parseNumber(values[values.length - 1]) : 0;
      
      switch (title) {
        case 'Total Assets':
          balanceSheet.total_assets = value;
          break;
        case 'Total Liabilities':
          balanceSheet.total_liabilities = value;
          break;
        case 'Total Equity':
          balanceSheet.total_equity = value;
          break;
        case 'Cash And Cash Equivalents':
          balanceSheet.cash_and_equivalents = value;
          break;
        case 'Total Debt':
          balanceSheet.total_debt = value;
          break;
        case 'Net Working Capital':
          balanceSheet.working_capital = value;
          break;
      }
    });

    return balanceSheet;
  }

  private async getCashFlow(ticker: string): Promise<CashFlow> {
    const $ = await this.fetchHTML(`https://finance.yahoo.com/quote/${ticker}/cash-flow`);
    
    const cashFlow: CashFlow = {
      operating_cash_flow: 0,
      investing_cash_flow: 0,
      financing_cash_flow: 0,
      free_cash_flow: 0,
      capex: 0
    };

    $('div[data-test="fin-row"]').each((i, row) => {
      const title = $(row).find('div[title]').text().trim();
      const values = $(row).find('span').map((j, span) => $(span).text().trim()).get();
      const value = values.length > 0 ? this.parseNumber(values[values.length - 1]) : 0;
      
      switch (title) {
        case 'Operating Cash Flow':
          cashFlow.operating_cash_flow = value;
          break;
        case 'Investing Cash Flow':
          cashFlow.investing_cash_flow = value;
          break;
        case 'Financing Cash Flow':
          cashFlow.financing_cash_flow = value;
          break;
        case 'Free Cash Flow':
          cashFlow.free_cash_flow = value;
          break;
        case 'Capital Expenditure':
          cashFlow.capex = value;
          break;
      }
    });

    return cashFlow;
  }

  private async getDividends(ticker: string): Promise<Dividends> {
    const $ = await this.fetchHTML(`https://finance.yahoo.com/quote/${ticker}/key-statistics`);
    
    const dividends: Dividends = {
      dividend_per_share: 0,
      dividend_yield: 0,
      payout_ratio: 0,
      dividend_growth_5y: 0,
      ex_dividend_date: '',
      pay_date: ''
    };

    // Find dividend data
    $('section[data-test="qsp-statistics"] tr').each((i, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 2) {
        const key = $(cells[0]).text().trim();
        const value = $(cells[1]).text().trim();
        
        if (key.includes('Forward Annual Dividend Rate')) {
          dividends.dividend_per_share = this.parseNumber(value);
        } else if (key.includes('Forward Annual Dividend Yield')) {
          dividends.dividend_yield = this.parsePercentage(value);
        } else if (key.includes('Payout Ratio')) {
          dividends.payout_ratio = this.parsePercentage(value);
        } else if (key.includes('5 Year Average Dividend Yield')) {
          dividends.dividend_growth_5y = this.parsePercentage(value);
        }
      }
    });

    // Get dividend dates from dividend history
    try {
      const history$ = await this.fetchHTML(`https://finance.yahoo.com/quote/${ticker}/history?period1=0&period2=9999999999&interval=div%7Csplit&filter=div`);
      
      history$('table[data-test="historical-prices"] tbody tr').each((i, row) => {
        const cells = history$(row).find('td');
        if (cells.length >= 2 && i === 0) {
          const dateText = history$(cells[0]).text().trim();
          const valueText = history$(cells[1]).text().trim();
          
          if (valueText.includes('Dividend')) {
            dividends.ex_dividend_date = new Date(dateText).toISOString().split('T')[0];
            // Pay date is typically 30 days after ex-dividend
            const payDate = new Date(dateText);
            payDate.setDate(payDate.getDate() + 30);
            dividends.pay_date = payDate.toISOString().split('T')[0];
          }
        }
      });
    } catch (error) {
      console.error('Error fetching dividend dates:', error);
    }

    return dividends;
  }
}