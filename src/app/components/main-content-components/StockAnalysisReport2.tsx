'use client';

import React, { useEffect } from 'react';
import { 
  DollarSign, 
  BarChart, 
  Percent, 
  TrendingUp, 
  TrendingDown,
  Layers,
  PieChart,
  Factory,
  BookOpen,
  Calendar,
  Award,
  Target,
  Activity,
  Brain,
  Shield,
  Zap,
  ChartLine,
  Building,
  Clock,
  Info,
  Globe,
  Eye,
  Users,
  Calculator
} from 'lucide-react';
import { CombinedData } from '@/types/types';

interface StockAnalysisReportProps {
  data: CombinedData | null;
  setIsShrunk: React.Dispatch<React.SetStateAction<boolean>>;
}

const StockAnalysisReport: React.FC<StockAnalysisReportProps> = ({ data, setIsShrunk }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const formatCurrency = (value: number | string | null | undefined) => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return 'N/A';
    return `$${numValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  };

  const formatBillions = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(value)) {
      return 'N/A';
    }
    return `$${(value / 1000000000000).toFixed(2)}T`;
  };

  const getRatingColor = (rating: string) => {
    if (!rating) return 'text-[--color-muted-foreground]';
    const normalizedRating = rating.toLowerCase();
    if (normalizedRating.includes('strong buy') || normalizedRating.includes('outperform')) return 'text-[--color-chart-1]';
    if (normalizedRating.includes('buy') || normalizedRating.includes('overweight')) return 'text-[--color-chart-2]';
    if (normalizedRating.includes('hold') || normalizedRating.includes('neutral') || normalizedRating.includes('perform')) return 'text-[--color-chart-3]';
    if (normalizedRating.includes('sell') || normalizedRating.includes('underweight')) return 'text-[--color-chart-4]';
    if (normalizedRating.includes('strong sell')) return 'text-[--color-chart-5]';
    return 'text-[--color-muted-foreground]';
  };

  const getActionColor = (action: string) => {
    if (!action) return 'text-[--color-muted-foreground]';
    if (action === 'Buy') return 'text-[--color-chart-1]';
    if (action === 'Sell') return 'text-[--color-chart-5]';
    return 'text-[--color-chart-3]';
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-[--color-chart-1]';
    if (change < 0) return 'text-[--color-chart-5]';
    return 'text-[--color-muted-foreground]';
  };

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        setIsShrunk(ref.current.scrollTop > 50);
      }
    };

    const div = ref.current;
    if (div) {
      div.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (div) {
        div.removeEventListener('scroll', handleScroll);
      }
    };
  }, [ref, setIsShrunk]);

  if (!data) {
    return (
      <div className="bg-[--color-card] rounded-lg p-6 text-center border border-[--color-border]">
        <p className="text-[--color-muted-foreground]">Stock analysis data not available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-y-auto p-1" ref={ref}>
      {/* Header Section */}
      <div className="bg-[--color-card] rounded-lg p-6 shadow-sm border border-[--color-border]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[--color-foreground]">{data.ticker}</h1>
            <p className="text-[--color-muted-foreground] text-sm">Last Updated: {new Date(data.last_updated).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[--color-foreground]">{formatCurrency(data.overview?.current_price)}</div>
            <div className={`flex items-center ${getChangeColor(data.overview?.change)}`}>
              <span className="text-lg font-semibold">{formatCurrency(data.overview?.change)}</span>
              <span className="ml-2">({data.overview?.percent_change})</span>
              {data.overview?.change > 0 ? <TrendingUp className="w-4 h-4 ml-1 text-green-500" /> : <TrendingDown className="w-4 h-4 ml-1 text-red-700" />}
            </div>
          </div>
        </div>
        
        {/* Key Overview Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-[--color-muted] rounded-lg p-3">
            <div className="text-[--color-muted-foreground] text-xs mb-1">Previous Close</div>
            <div className="font-semibold">{formatCurrency(data.overview?.previous_close)}</div>
          </div>
          <div className="bg-[--color-muted] rounded-lg p-3">
            <div className="text-[--color-muted-foreground] text-xs mb-1">Open</div>
            <div className="font-semibold">{formatCurrency(data.overview?.open)}</div>
          </div>
          <div className="bg-[--color-muted] rounded-lg p-3">
            <div className="text-[--color-muted-foreground] text-xs mb-1">Day Range</div>
            <div className="font-semibold text-xs">{data.overview?.day_range}</div>
          </div>
          <div className="bg-[--color-muted] rounded-lg p-3">
            <div className="text-[--color-muted-foreground] text-xs mb-1">52W Range</div>
            <div className="font-semibold text-xs">{data.overview?.['52_week_range']}</div>
          </div>
          <div className="bg-[--color-muted] rounded-lg p-3">
            <div className="text-[--color-muted-foreground] text-xs mb-1">Volume</div>
            <div className="font-semibold text-xs">{data.overview?.volume}</div>
          </div>
          <div className="bg-[--color-muted] rounded-lg p-3">
            <div className="text-[--color-muted-foreground] text-xs mb-1">Market Cap</div>
            <div className="font-semibold text-xs">{data.overview?.market_cap}</div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-[--color-card] rounded-lg p-6 shadow-sm border border-[--color-border]">
        <h3 className="text-xl font-bold mb-4 text-[--color-foreground] flex items-center">
          <Brain className="w-5 h-5 mr-2 text-[--color-primary]" />
          AI Insights & Recommendation
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-[--color-accent]/10 to-[--color-primary]/10 rounded-lg p-4 border border-[--color-primary]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[--color-muted-foreground] text-sm font-medium">Recommendation</span>
              <Target className="w-4 h-4 text-[--color-primary]" />
            </div>
            <div className={`text-xl font-bold ${getActionColor(data.ai_insights?.recommendation?.action)}`}>
              {data.ai_insights?.recommendation?.action || 'N/A'}
            </div>
            <div className="text-sm text-[--color-muted-foreground] mt-1">
              Confidence: {data.ai_insights?.recommendation?.confidence || 0}%
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-[--color-chart-1]/10 to-[--color-chart-2]/10 rounded-lg p-4 border border-[--color-chart-1]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[--color-muted-foreground] text-sm font-medium">Bullishness</span>
              <TrendingUp className="w-4 h-4 text-[--color-chart-1]" />
            </div>
            <div className="text-xl font-bold text-[--color-chart-1]">
              {data.ai_insights?.visualization_data?.bullishness_meter || 0}%
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-[--color-chart-5]/10 to-[--color-chart-4]/10 rounded-lg p-4 border border-[--color-chart-5]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[--color-muted-foreground] text-sm font-medium">Risk Score</span>
              <Shield className="w-4 h-4 text-[--color-chart-5]" />
            </div>
            <div className="text-xl font-bold text-[--color-chart-5]">
              {data.ai_insights?.visualization_data?.risk_score || 0}%
            </div>
          </div>
        </div>
        
        <div className="bg-[--color-muted] rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-[--color-foreground]">Analysis Summary</h4>
          <p className="text-[--color-foreground] mb-4 leading-relaxed">
            {data.ai_insights?.summary || 'No summary available'}
          </p>
          <div className="text-sm text-[--color-muted-foreground] mb-3">
            <strong>Reasoning:</strong> {data.ai_insights?.recommendation?.reasoning || 'No reasoning provided'}
          </div>
          
          <div>
            <h5 className="font-medium text-[--color-foreground] mb-2">Key Takeaways:</h5>
            <div className="space-y-2">
              {data.ai_insights?.key_takeaways?.map((takeaway, index) => (
                <div key={index} className="text-[--color-foreground] text-sm flex items-start">
                  <div className="w-2 h-2 bg-[--color-primary] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>{takeaway}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Valuation Analysis */}
      <div className="bg-[--color-card] rounded-lg p-6 shadow-sm border border-[--color-border]">
        <h3 className="text-xl font-bold mb-4 text-[--color-foreground] flex items-center">
          <Calculator className="w-5 h-5 mr-2 text-[--color-primary]" />
          Valuation Analysis (Historical Trend)
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[--color-muted]">
              <tr>
                <th className="text-left p-3 font-semibold text-[--color-foreground]">Metric</th>
                <th className="text-right p-3 font-semibold text-[--color-muted-foreground]">Current</th>
                <th className="text-right p-3 font-semibold text-[--color-muted-foreground]">3/31/2025</th>
                <th className="text-right p-3 font-semibold text-[--color-muted-foreground]">12/31/2024</th>
                <th className="text-right p-3 font-semibold text-[--color-muted-foreground]">9/30/2024</th>
                <th className="text-right p-3 font-semibold text-[--color-muted-foreground]">6/30/2024</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[--color-border]">
                <td className="p-3 font-medium">Market Cap</td>
                <td className="text-right p-3">{formatBillions(data.fundamental?.valuation_measures?.current?.market_cap)}</td>
                <td className="text-right p-3">{formatBillions(data.fundamental?.valuation_measures?.['3/31/2025']?.market_cap)}</td>
                <td className="text-right p-3">{formatBillions(data.fundamental?.valuation_measures?.['12/31/2024']?.market_cap)}</td>
                <td className="text-right p-3">{formatBillions(data.fundamental?.valuation_measures?.['9/30/2024']?.market_cap)}</td>
                <td className="text-right p-3">{formatBillions(data.fundamental?.valuation_measures?.['6/30/2024']?.market_cap)}</td>
              </tr>
              <tr className="border-b border-[--color-border]">
                <td className="p-3 font-medium">P/E Ratio</td>
                <td className="text-right p-3">{data.fundamental?.valuation_measures?.current?.trailing_pe?.toFixed(2)}</td>
                <td className="text-right p-3">{data.fundamental?.valuation_measures?.['3/31/2025']?.trailing_pe?.toFixed(2)}</td>
                <td className="text-right p-3">{data.fundamental?.valuation_measures?.['12/31/2024']?.trailing_pe?.toFixed(2)}</td>
                <td className="text-right p-3">{data.fundamental?.valuation_measures?.['9/30/2024']?.trailing_pe?.toFixed(2)}</td>
                <td className="text-right p-3">{data.fundamental?.valuation_measures?.['6/30/2024']?.trailing_pe?.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-[--color-border]">
                <td className="p-3 font-medium">Forward P/E</td>
                <td className="text-right p-3">{data.fundamental?.valuation_measures?.current?.forward_pe?.toFixed(2)}</td>
                <td className="text-right p-3">{data.fundamental?.valuation_measures?.['3/31/2025']?.forward_pe?.toFixed(2)}</td>
                <td className="text-right p-3">{data.fundamental?.valuation_measures?.['12/31/2024']?.forward_pe?.toFixed(2)}</td>
                <td className="text-right p-3">{data.fundamental?.valuation_measures?.['9/30/2024']?.forward_pe?.toFixed(2)}</td>
                <td className="text-right p-3">{data.fundamental?.valuation_measures?.['6/30/2024']?.forward_pe?.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-[--color-border]">
                <td className="p-3 font-medium">PEG Ratio</td>
                <td className="text-right p-3">{data.fundamental?.valuation_measures?.current?.peg_ratio?.toFixed(2)}</td>
                <td className="text-right p-3">{data.fundamental?.valuation_measures?.['3/31/2025']?.peg_ratio?.toFixed(2)}</td>
                <td className="text-right p-3">{data.fundamental?.valuation_measures?.['12/31/2024']?.peg_ratio?.toFixed(2)}</td>
                <td className="text-right p-3">{data.fundamental?.valuation_measures?.['9/30/2024']?.peg_ratio?.toFixed(2)}</td>
                <td className="text-right p-3">{data.fundamental?.valuation_measures?.['6/30/2024']?.peg_ratio?.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-[--color-border]">
                <td className="p-3 font-medium">Price/Book</td>
                <td className="text-right p-3">{data.fundamental?.valuation_measures?.current?.price_book?.toFixed(2)}</td>
                <td className="text-right p-3">{data.fundamental?.valuation_measures?.['3/31/2025']?.price_book?.toFixed(2)}</td>
                <td className="text-right p-3">{data.fundamental?.valuation_measures?.['12/31/2024']?.price_book?.toFixed(2)}</td>
                <td className="text-right p-3">{data.fundamental?.valuation_measures?.['9/30/2024']?.price_book?.toFixed(2)}</td>
                <td className="text-right p-3">{data.fundamental?.valuation_measures?.['6/30/2024']?.price_book?.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Health Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profitability Metrics */}
        <div className="bg-[--color-card] rounded-lg p-6 shadow-sm border border-[--color-border]">
          <h3 className="text-lg font-bold mb-4 text-[--color-foreground] flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-[--color-chart-1]" />
            Profitability
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-[--color-chart-1]/10 rounded-lg">
              <span className="text-[--color-foreground] font-medium">Profit Margin</span>
              <span className="font-bold text-[--color-chart-1]">{data.fundamental?.financial_highlights?.profitability?.profit_margin}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[--color-muted] rounded-lg">
              <span className="text-[--color-foreground] font-medium">Operating Margin</span>
              <span className="font-bold">{data.fundamental?.financial_highlights?.profitability?.operating_margin}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[--color-muted] rounded-lg">
              <span className="text-[--color-foreground] font-medium">ROE</span>
              <span className="font-bold">{data.fundamental?.financial_highlights?.management_effectiveness?.return_on_equity}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[--color-muted] rounded-lg">
              <span className="text-[--color-foreground] font-medium">ROA</span>
              <span className="font-bold">{data.fundamental?.financial_highlights?.management_effectiveness?.return_on_assets}</span>
            </div>
          </div>
        </div>

        {/* Financial Strength */}
        <div className="bg-[--color-card] rounded-lg p-6 shadow-sm border border-[--color-border]">
          <h3 className="text-lg font-bold mb-4 text-[--color-foreground] flex items-center">
            <Shield className="w-5 h-5 mr-2 text-[--color-primary]" />
            Financial Strength
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-[--color-primary]/10 rounded-lg">
              <span className="text-[--color-foreground] font-medium">Total Cash</span>
              <span className="font-bold text-[--color-primary]">{data.fundamental?.financial_highlights?.balance_sheet?.total_cash}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[--color-muted] rounded-lg">
              <span className="text-[--color-foreground] font-medium">Total Debt</span>
              <span className="font-bold">{data.fundamental?.financial_highlights?.balance_sheet?.total_debt}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[--color-muted] rounded-lg">
              <span className="text-[--color-foreground] font-medium">Debt/Equity</span>
              <span className="font-bold">{data.fundamental?.financial_highlights?.balance_sheet?.total_debt_equity}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[--color-muted] rounded-lg">
              <span className="text-[--color-foreground] font-medium">Current Ratio</span>
              <span className="font-bold">{data.fundamental?.financial_highlights?.balance_sheet?.current_ratio}</span>
            </div>
          </div>
        </div>

        {/* Growth Metrics */}
        <div className="bg-[--color-card] rounded-lg p-6 shadow-sm border border-[--color-border]">
          <h3 className="text-lg font-bold mb-4 text-[--color-foreground] flex items-center">
            <ChartLine className="w-5 h-5 mr-2 text-[--color-chart-4]" />
            Growth
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-[--color-chart-4]/10 rounded-lg">
              <span className="text-[--color-foreground] font-medium">Revenue Growth</span>
              <span className="font-bold text-[--color-chart-4]">{data.fundamental?.financial_highlights?.income_statement?.quarterly_revenue_growth}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[--color-muted] rounded-lg">
              <span className="text-[--color-foreground] font-medium">Earnings Growth</span>
              <span className="font-bold">{data.fundamental?.financial_highlights?.income_statement?.quarterly_earnings_growth}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[--color-muted] rounded-lg">
              <span className="text-[--color-foreground] font-medium">Revenue TTM</span>
              <span className="font-bold">{data.fundamental?.financial_highlights?.income_statement?.revenue_ttm}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[--color-muted] rounded-lg">
              <span className="text-[--color-foreground] font-medium">EPS TTM</span>
              <span className="font-bold">{formatCurrency(data.fundamental?.financial_highlights?.income_statement?.diluted_eps_ttm)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Trading Information */}
      <div className="bg-[--color-card] rounded-lg p-6 shadow-sm border border-[--color-border]">
        <h3 className="text-xl font-bold mb-4 text-[--color-foreground] flex items-center">
          <Activity className="w-5 h-5 mr-2 text-[--color-primary]" />
          Complete Trading Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[--color-muted] rounded-lg p-4">
            <div className="text-[--color-muted-foreground] text-sm mb-2">Beta</div>
            <div className="font-bold text-lg">{data.fundamental?.trading_information?.beta}</div>
          </div>
          <div className="bg-[--color-muted] rounded-lg p-4">
            <div className="text-[--color-muted-foreground] text-sm mb-2">52W Change</div>
            <div className="font-bold text-lg text-[--color-chart-1]">{data.fundamental?.trading_information?.['52_week_change']}</div>
          </div>
          <div className="bg-[--color-muted] rounded-lg p-4">
            <div className="text-[--color-muted-foreground] text-sm mb-2">Shares Outstanding</div>
            <div className="font-bold text-lg">{data.fundamental?.trading_information?.shares_outstanding}</div>
          </div>
          <div className="bg-[--color-muted] rounded-lg p-4">
            <div className="text-[--color-muted-foreground] text-sm mb-2">Float</div>
            <div className="font-bold text-lg">{data.fundamental?.trading_information?.float}</div>
          </div>
          <div className="bg-[--color-muted] rounded-lg p-4">
            <div className="text-[--color-muted-foreground] text-sm mb-2">Institutional Holdings</div>
            <div className="font-bold text-lg">{data.fundamental?.trading_information?.percent_held_by_institutions}</div>
          </div>
          <div className="bg-[--color-muted] rounded-lg p-4">
            <div className="text-[--color-muted-foreground] text-sm mb-2">Insider Holdings</div>
            <div className="font-bold text-lg">{data.fundamental?.trading_information?.percent_held_by_insiders}</div>
          </div>
          <div className="bg-[--color-muted] rounded-lg p-4">
            <div className="text-[--color-muted-foreground] text-sm mb-2">Short Interest</div>
            <div className="font-bold text-lg">{data.fundamental?.trading_information?.short_percent_of_float}</div>
          </div>
          <div className="bg-[--color-muted] rounded-lg p-4">
            <div className="text-[--color-muted-foreground] text-sm mb-2">Short Ratio</div>
            <div className="font-bold text-lg">{data.fundamental?.trading_information?.short_ratio}</div>
          </div>
        </div>
      </div>

      {/* Technical Analysis */}
      <div className="bg-[--color-card] rounded-lg p-6 shadow-sm border border-[--color-border]">
        <h3 className="text-xl font-bold mb-4 text-[--color-foreground] flex items-center">
          <Zap className="w-5 h-5 mr-2 text-[--color-chart-3]" />
          Technical Analysis
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Summary */}
          <div>
            <h4 className="font-semibold mb-3 text-[--color-foreground]">Technical Summary</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-[--color-chart-1]/10 to-[--color-primary]/10 rounded-lg p-4 border border-[--color-primary]">
                <div className="text-sm text-[--color-muted-foreground] mb-1">Moving Averages</div>
                <div className={`font-bold text-lg ${getActionColor(data.technicals?.summary?.moving_averages?.overall)}`}>
                  {data.technicals?.summary?.moving_averages?.overall}
                </div>
                <div className="text-xs text-[--color-muted-foreground] mt-1">
                  Buy: {data.technicals?.summary?.moving_averages?.buy} | 
                  Sell: {data.technicals?.summary?.moving_averages?.sell} | 
                  Neutral: {data.technicals?.summary?.moving_averages?.neutral}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-[--color-chart-5]/10 to-[--color-chart-4]/10 rounded-lg p-4 border border-[--color-chart-5]">
                <div className="text-sm text-[--color-muted-foreground] mb-1">Oscillators</div>
                <div className={`font-bold text-lg ${getActionColor(data.technicals?.summary?.oscillators?.overall)}`}>
                  {data.technicals?.summary?.oscillators?.overall}
                </div>
                <div className="text-xs text-[--color-muted-foreground] mt-1">
                  Buy: {data.technicals?.summary?.oscillators?.buy} | 
                  Sell: {data.technicals?.summary?.oscillators?.sell} | 
                  Neutral: {data.technicals?.summary?.oscillators?.neutral}
                </div>
              </div>
            </div>
          </div>
          
          {/* Pivot Points */}
          <div>
            <h4 className="font-semibold mb-3 text-[--color-foreground]">Key Pivot Points</h4>
            <div className="bg-[--color-muted] rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-[--color-foreground] mb-2">Classic Pivots</div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[--color-chart-1]">R1:</span>
                      <span>{formatCurrency(data.technicals?.pivots?.Classic?.R1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">P:</span>
                      <span className="font-medium">{formatCurrency(data.technicals?.pivots?.Classic?.P)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[--color-chart-5]">S1:</span>
                      <span>{formatCurrency(data.technicals?.pivots?.Classic?.S1)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-[--color-foreground] mb-2">Fibonacci</div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[--color-chart-1]">R1:</span>
                      <span>{formatCurrency(data.technicals?.pivots?.Fibonacci?.R1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">P:</span>
                      <span className="font-medium">{formatCurrency(data.technicals?.pivots?.Fibonacci?.P)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[--color-chart-5]">S1:</span>
                      <span>{formatCurrency(data.technicals?.pivots?.Fibonacci?.S1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Detailed Oscillators */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-[--color-foreground]">Oscillator Details</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[--color-muted]">
                <tr>
                  <th className="text-left p-3 font-semibold">Indicator</th>
                  <th className="text-right p-3 font-semibold">Value</th>
                  <th className="text-center p-3 font-semibold">Signal</th>
                </tr>
              </thead>
              <tbody>
                {data.technicals?.oscillators?.map((oscillator, index) => (
                  <tr key={index} className="border-b border-[--color-border]">
                    <td className="p-3 font-medium">{oscillator.name}</td>
                    <td className="text-right p-3">{oscillator.value}</td>
                    <td className="text-center p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(oscillator.action)}`}>
                        {oscillator.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Moving Averages Details */}
        <div>
          <h4 className="font-semibold mb-3 text-[--color-foreground]">Moving Averages Details</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[--color-muted]">
                <tr>
                  <th className="text-left p-3 font-semibold">Moving Average</th>
                  <th className="text-right p-3 font-semibold">Value</th>
                  <th className="text-center p-3 font-semibold">Signal</th>
                </tr>
              </thead>
              <tbody>
                {data.technicals?.moving_averages?.map((ma, index) => (
                  <tr key={index} className="border-b border-[--color-border]">
                    <td className="p-3 font-medium">{ma.name}</td>
                    <td className="text-right p-3">{formatCurrency(ma.value)}</td>
                    <td className="text-center p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(ma.action)}`}>
                        {ma.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Comprehensive Analyst Coverage */}
      <div className="bg-[--color-card] rounded-lg p-6 shadow-sm border border-[--color-border]">
        <h3 className="text-xl font-bold mb-4 text-[--color-foreground] flex items-center">
          <Award className="w-5 h-5 mr-2 text-[--color-primary]" />
          Analyst Coverage & Price Targets
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-r from-[--color-primary]/10 to-[--color-accent]/10 rounded-lg p-4 border border-[--color-primary]">
            <div className="text-center">
              <div className="text-sm text-[--color-muted-foreground] mb-1">Average Price Target</div>
              <div className="text-2xl font-bold text-[--color-primary]">{formatCurrency(data.analysis?.analyst_ratings?.price_target_avg)}</div>
              <div className="text-sm text-[--color-muted-foreground] mt-1">
                Potential Upside: {((data.analysis?.analyst_ratings?.price_target_avg / data.overview?.current_price - 1) * 100)?.toFixed(2)}%
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-[--color-chart-1]/10 to-[--color-chart-2]/10 rounded-lg p-4 border border-[--color-chart-1]">
            <div className="text-center">
              <div className="text-sm text-[--color-muted-foreground] mb-1">Highest Target</div>
              <div className="text-2xl font-bold text-[--color-chart-1]">{formatCurrency(data.analysis?.analyst_ratings?.price_target_high)}</div>
              <div className="text-sm text-[--color-muted-foreground] mt-1">
                Max Upside: {((data.analysis?.analyst_ratings?.price_target_high / data.overview?.current_price - 1) * 100)?.toFixed(2)}%
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-[--color-chart-5]/10 to-[--color-chart-4]/10 rounded-lg p-4 border border-[--color-chart-5]">
            <div className="text-center">
              <div className="text-sm text-[--color-muted-foreground] mb-1">Lowest Target</div>
              <div className="text-2xl font-bold text-[--color-chart-5]">{formatCurrency(data.analysis?.analyst_ratings?.price_target_low)}</div>
              <div className="text-sm text-[--color-muted-foreground] mt-1">
                Min Change: {((data.analysis?.analyst_ratings?.price_target_low / data.overview?.current_price - 1) * 100)?.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-[--color-foreground]">Analyst Coverage</span>
            <span className="text-sm text-[--color-muted-foreground]">{data.analysis?.analyst_ratings?.number_of_analysts} Analysts</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[--color-muted]">
              <tr>
                <th className="text-left p-3 font-semibold">Firm</th>
                <th className="text-center p-3 font-semibold">Rating</th>
                <th className="text-right p-3 font-semibold">Price Target</th>
                <th className="text-center p-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.analysis?.analyst_ratings?.ratings?.map((rating, index) => (
                <tr key={index} className="border-b border-[--color-border] hover:bg-[--color-muted]">
                  <td className="p-3 font-medium">{rating.firm}</td>
                  <td className="text-center p-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRatingColor(rating.rating)}`}>
                      {rating.rating}
                    </span>
                  </td>
                  <td className="text-right p-3 font-medium">
                    {rating.price_target ? formatCurrency(rating.price_target) : 'N/A'}
                  </td>
                  <td className="text-center p-3 text-[--color-muted-foreground]">{rating.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Earnings & Revenue Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Estimates */}
        <div className="bg-[--color-card] rounded-lg p-6 shadow-sm border border-[--color-border]">
          <h3 className="text-xl font-bold mb-4 text-[--color-foreground] flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-[--color-chart-1]" />
            Earnings Estimates
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[--color-muted]">
                <tr>
                  <th className="text-left p-3 font-semibold">Period</th>
                  <th className="text-right p-3 font-semibold">Avg Est.</th>
                  <th className="text-right p-3 font-semibold">Low</th>
                  <th className="text-right p-3 font-semibold">High</th>
                  <th className="text-right p-3 font-semibold">Year Ago</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.analysis?.earnings_estimates || {}).map(([period, estimate]) => (
                  <tr key={period} className="border-b border-[--color-border]">
                    <td className="p-3 font-medium">{period}</td>
                    <td className="text-right p-3 font-semibold">{formatCurrency(estimate.avg_estimate)}</td>
                    <td className="text-right p-3">{formatCurrency(estimate.low_estimate)}</td>
                    <td className="text-right p-3">{formatCurrency(estimate.high_estimate)}</td>
                    <td className="text-right p-3 text-[--color-muted-foreground]">{formatCurrency(estimate.year_ago_eps)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue Estimates */}
        <div className="bg-[--color-card] rounded-lg p-6 shadow-sm border border-[--color-border]">
          <h3 className="text-xl font-bold mb-4 text-[--color-foreground] flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-[--color-primary]" />
            Revenue Estimates
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[--color-muted]">
                <tr>
                  <th className="text-left p-3 font-semibold">Period</th>
                  <th className="text-right p-3 font-semibold">Avg Est.</th>
                  <th className="text-right p-3 font-semibold">Growth</th>
                  <th className="text-right p-3 font-semibold">Year Ago</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.analysis?.revenue_estimates || {}).map(([period, estimate]) => (
                  <tr key={period} className="border-b border-[--color-border]">
                    <td className="p-3 font-medium">{period}</td>
                    <td className="text-right p-3 font-semibold">{estimate.avg_estimate}</td>
                    <td className="text-right p-3 text-[--color-chart-1] font-medium">{estimate.sales_growth}</td>
                    <td className="text-right p-3 text-[--color-muted-foreground]">{estimate.year_ago_sales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Earnings History */}
      <div className="bg-[--color-card] rounded-lg p-6 shadow-sm border border-[--color-border]">
        <h3 className="text-xl font-bold mb-4 text-[--color-foreground] flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-[--color-chart-4]" />
          Earnings History & Performance
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[--color-muted]">
              <tr>
                <th className="text-left p-3 font-semibold">Quarter</th>
                <th className="text-right p-3 font-semibold">EPS Estimate</th>
                <th className="text-right p-3 font-semibold">EPS Actual</th>
                <th className="text-right p-3 font-semibold">Difference</th>
                <th className="text-right p-3 font-semibold">Surprise %</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.analysis?.earnings_history || {}).map(([quarter, history]) => (
                <tr key={quarter} className="border-b border-[--color-border]">
                  <td className="p-3 font-medium">{quarter}</td>
                  <td className="text-right p-3">{formatCurrency(history.eps_estimate)}</td>
                  <td className="text-right p-3 font-semibold">{formatCurrency(history.eps_actual)}</td>
                  <td className={`text-right p-3 font-medium ${getChangeColor(history.difference)}`}>
                    {formatCurrency(history.difference)}
                  </td>
                  <td className={`text-right p-3 font-semibold ${getChangeColor(history.difference)}`}>
                    {history.surprise_percent}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 p-4 bg-[--color-muted] rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-sm text-[--color-muted-foreground]">Next Earnings</div>
              <div className="font-bold text-lg">{data.overview?.earnings_date}</div>
            </div>
            <div>
              <div className="text-sm text-[--color-muted-foreground]">Ex-Dividend Date</div>
              <div className="font-bold text-lg">{data.overview?.ex_dividend_date}</div>
            </div>
            <div>
              <div className="text-sm text-[--color-muted-foreground]">Dividend Yield</div>
              <div className="font-bold text-lg">{data.overview?.forward_dividend_yield}</div>
            </div>
            <div>
              <div className="text-sm text-[--color-muted-foreground]">1Y Target Est.</div>
              <div className="font-bold text-lg">{formatCurrency(data.overview?.['1y_target_est'])}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Income Statement */}
      <div className="bg-[--color-card] rounded-lg p-6 shadow-sm border border-[--color-border]">
        <h3 className="text-xl font-bold mb-4 text-[--color-foreground] flex items-center">
          <Building className="w-5 h-5 mr-2 text-[--color-chart-1]" />
          Income Statement Highlights (TTM)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-[--color-chart-1]/10 rounded-lg p-4 border border-[--color-chart-1]/20">
            <div className="text-[--color-muted-foreground] text-sm mb-1">Revenue (TTM)</div>
            <div className="font-bold text-xl text-[--color-chart-1]">{data.fundamental?.financial_highlights?.income_statement?.revenue_ttm}</div>
            <div className="text-sm text-[--color-muted-foreground] mt-1">
              Per Share: {formatCurrency(data.fundamental?.financial_highlights?.income_statement?.revenue_per_share_ttm)}
            </div>
          </div>
          
          <div className="bg-[--color-primary]/10 rounded-lg p-4 border border-[--color-primary]/20">
            <div className="text-[--color-muted-foreground] text-sm mb-1">Gross Profit (TTM)</div>
            <div className="font-bold text-xl text-[--color-primary]">{data.fundamental?.financial_highlights?.income_statement?.gross_profit_ttm}</div>
          </div>
          
          <div className="bg-[--color-chart-4]/10 rounded-lg p-4 border border-[--color-chart-4]/20">
            <div className="text-[--color-muted-foreground] text-sm mb-1">EBITDA</div>
            <div className="font-bold text-xl text-[--color-chart-4]">{data.fundamental?.financial_highlights?.income_statement?.ebitda}</div>
          </div>
          
          <div className="bg-[--color-accent]/10 rounded-lg p-4 border border-[--color-accent]/20">
            <div className="text-[--color-muted-foreground] text-sm mb-1">Net Income (TTM)</div>
            <div className="font-bold text-xl text-[--color-accent]">{data.fundamental?.financial_highlights?.income_statement?.net_income_ttm}</div>
          </div>
          
          <div className="bg-[--color-chart-3]/10 rounded-lg p-4 border border-[--color-chart-3]/20">
            <div className="text-[--color-muted-foreground] text-sm mb-1">Diluted EPS (TTM)</div>
            <div className="font-bold text-xl text-[--color-chart-3]">{formatCurrency(data.fundamental?.financial_highlights?.income_statement?.diluted_eps_ttm)}</div>
          </div>
          
          <div className="bg-[--color-chart-2]/10 rounded-lg p-4 border border-[--color-chart-2]/20">
            <div className="text-[--color-muted-foreground] text-sm mb-1">Operating Cash Flow</div>
            <div className="font-bold text-xl text-[--color-chart-2]">{data.fundamental?.financial_highlights?.cash_flow_statement?.operating_cash_flow}</div>
          </div>
        </div>
      </div>

      {/* Additional Trading Metrics */}
      <div className="bg-[--color-card] rounded-lg p-6 shadow-sm border border-[--color-border]">
        <h3 className="text-xl font-bold mb-4 text-[--color-foreground] flex items-center">
          <Users className="w-5 h-5 mr-2 text-[--color-primary]" />
          Ownership & Trading Activity
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3 text-[--color-foreground]">Ownership Structure</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-[--color-primary]/10 rounded-lg">
                <span className="text-[--color-foreground]">Institutional Holdings</span>
                <span className="font-bold text-[--color-primary]">{data.fundamental?.trading_information?.percent_held_by_institutions}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[--color-muted] rounded-lg">
                <span className="text-[--color-foreground]">Insider Holdings</span>
                <span className="font-bold">{data.fundamental?.trading_information?.percent_held_by_insiders}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[--color-muted] rounded-lg">
                <span className="text-[--color-foreground]">Shares Outstanding</span>
                <span className="font-bold">{data.fundamental?.trading_information?.shares_outstanding}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[--color-muted] rounded-lg">
                <span className="text-[--color-foreground]">Float</span>
                <span className="font-bold">{data.fundamental?.trading_information?.float}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-[--color-foreground]">Short Interest & Volume</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-[--color-chart-5]/10 rounded-lg">
                <span className="text-[--color-foreground]">Shares Short</span>
                <span className="font-bold text-[--color-chart-5]">{data.fundamental?.trading_information?.shares_short}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[--color-muted] rounded-lg">
                <span className="text-[--color-foreground]">Short % of Float</span>
                <span className="font-bold">{data.fundamental?.trading_information?.short_percent_of_float}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[--color-muted] rounded-lg">
                <span className="text-[--color-foreground]">Short Ratio</span>
                <span className="font-bold">{data.fundamental?.trading_information?.short_ratio}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[--color-muted] rounded-lg">
                <span className="text-[--color-foreground]">Avg Volume (3M)</span>
                <span className="font-bold">{data.fundamental?.trading_information?.avg_vol_3month}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-semibold mb-3 text-[--color-foreground]">Moving Averages</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[--color-muted] rounded-lg p-3 text-center">
              <div className="text-[--color-muted-foreground] text-sm">50-Day MA</div>
              <div className="font-bold">{formatCurrency(data.fundamental?.trading_information?.['50_day_moving_average'])}</div>
            </div>
            <div className="bg-[--color-muted] rounded-lg p-3 text-center">
              <div className="text-[--color-muted-foreground] text-sm">200-Day MA</div>
              <div className="font-bold">{formatCurrency(data.fundamental?.trading_information?.['200_day_moving_average'])}</div>
            </div>
            <div className="bg-[--color-muted] rounded-lg p-3 text-center">
              <div className="text-[--color-muted-foreground] text-sm">52W High</div>
              <div className="font-bold text-[--color-chart-1]">{formatCurrency(data.fundamental?.trading_information?.['52_week_high'])}</div>
            </div>
            <div className="bg-[--color-muted] rounded-lg p-3 text-center">
              <div className="text-[--color-muted-foreground] text-sm">52W Low</div>
              <div className="font-bold text-[--color-chart-5]">{formatCurrency(data.fundamental?.trading_information?.['52_week_low'])}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockAnalysisReport;