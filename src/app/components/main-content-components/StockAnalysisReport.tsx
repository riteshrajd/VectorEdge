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
  Zap
} from 'lucide-react';
import { CombinedData } from '@/types/types';

interface StockAnalysisReportProps {
  data: CombinedData|null;
  setIsShrunk: React.Dispatch<React.SetStateAction<boolean>>;
}

const StockAnalysisReport: React.FC<StockAnalysisReportProps> = ({ data, setIsShrunk }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  };

  const getRatingColor = (rating: string) => {
    const normalizedRating = rating.toLowerCase();
    if (normalizedRating.includes('strong buy') || normalizedRating.includes('outperform')) return 'text-[#50ff7a]';
    if (normalizedRating.includes('buy') || normalizedRating.includes('overweight')) return 'text-[#4db04d]';
    if (normalizedRating.includes('hold') || normalizedRating.includes('neutral') || normalizedRating.includes('perform')) return 'text-yellow-400';
    if (normalizedRating.includes('sell') || normalizedRating.includes('underweight')) return 'text-orange-500';
    if (normalizedRating.includes('strong sell')) return 'text-red-500';
    return 'text-primary';
  };

  const getActionColor = (action: string) => {
    if (action === 'Buy') return 'text-[#50ff7a]';
    if (action === 'Sell') return 'text-red-500';
    return 'text-yellow-400';
  };

  const getRecommendationColor = (action: string) => {
    if (action === 'Buy') return 'text-[#50ff7a]';
    if (action === 'Sell') return 'text-red-500';
    return 'text-yellow-400';
  };

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        setIsShrunk(ref.current.scrollTop > 50);
      }
    };

    const div = ref.current;
    if(div) {
      div.addEventListener('scroll', handleScroll);
    }

    return () => {
      if(div) {
        div.removeEventListener('scroll', handleScroll);
      }
    }
    
  }, [ref, setIsShrunk]);

  if (!data) {
    return (
      <div className="bg-[var(--bg-card-primary)] rounded-lg p-6 text-center">
        <p className="text-[var(--text-secondary)]">Stock analysis data not available</p>
      </div>
    );
  }


  if(!data) {
    return null;
  }

  return (
    <div className="space-y-6 overflow-y-auto" ref={ref}>
      {/* AI Insights Summary */}
      <div className="bg-[var(--bg-card-primary)] rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)] flex items-center">
          <Brain className="w-5 h-5 mr-2 text-purple-400" />
          AI Insights & Recommendation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[var(--bg-card-secondary)] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--text-secondary)] text-sm">Recommendation</span>
              <Target className="w-4 h-4 text-[var(--text-secondary)]" />
            </div>
            <div className={`text-lg font-semibold ${getRecommendationColor(data.ai_insights?.recommendation?.action)}`}>
              {data.ai_insights?.recommendation?.action || 'N/A'}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">
              {data.ai_insights?.recommendation?.confidence || 0}% Confidence
            </div>
          </div>
          
          <div className="bg-[var(--bg-card-secondary)] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--text-secondary)] text-sm">Bullishness</span>
              <TrendingUp className="w-4 h-4 text-[var(--text-secondary)]" />
            </div>
            <div className="text-lg font-semibold text-[var(--positive)]">
              {data.ai_insights?.visualization_data?.bullishness_meter || 0}%
            </div>
          </div>
          
          <div className="bg-[var(--bg-card-secondary)] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--text-secondary)] text-sm">Risk Score</span>
              <Shield className="w-4 h-4 text-[var(--text-secondary)]" />
            </div>
            <div className="text-lg font-semibold text-orange-400">
              {data.ai_insights?.visualization_data?.risk_score || 0}%
            </div>
          </div>
        </div>
        
        <div className="bg-[var(--bg-card-secondary)] rounded-lg p-4">
          <h4 className="font-medium mb-2">Summary</h4>
          <p className="text-[var(--text-secondary)] text-sm mb-4">
            {data.ai_insights?.summary || 'No summary available'}
          </p>
          <div className="space-y-2">
            <h5 className="font-medium text-sm">Key Takeaways:</h5>
            {data.ai_insights?.key_takeaways?.map((takeaway, index) => (
              <div key={index} className="text-[var(--text-secondary)] text-sm flex items-start">
                <span className="w-2 h-2 bg-[var(--accent-main)] rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                {takeaway}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Valuation Metrics */}
      <div className="bg-[var(--bg-card-primary)] rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)] flex items-center">
          <BarChart className="w-5 h-5 mr-2 text-[var(--accent-main)]" />
          Valuation Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--bg-card-secondary)] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--text-secondary)] text-sm">Market Cap</span>
              <DollarSign className="w-4 h-4 text-[var(--text-secondary)]" />
            </div>
            <div className="text-lg font-semibold">{data.overview?.market_cap || 'N/A'}</div>
          </div>
          
          <div className="bg-[var(--bg-card-secondary)] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--text-secondary)] text-sm">P/E Ratio</span>
              <Percent className="w-4 h-4 text-[var(--text-secondary)]" />
            </div>
            <div className="text-lg font-semibold">{data.overview?.pe_ratio || 'N/A'}</div>
          </div>
          
          <div className="bg-[var(--bg-card-secondary)] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--text-secondary)] text-sm">PEG Ratio</span>
              <TrendingUp className="w-4 h-4 text-[var(--text-secondary)]" />
            </div>
            <div className="text-lg font-semibold">{data.fundamental?.valuation_measures?.current?.peg_ratio || 'N/A'}</div>
          </div>
          
          <div className="bg-[var(--bg-card-secondary)] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--text-secondary)] text-sm">P/B Ratio</span>
              <BookOpen className="w-4 h-4 text-[var(--text-secondary)]" />
            </div>
            <div className="text-lg font-semibold">{data.fundamental?.valuation_measures?.current?.price_book || 'N/A'}</div>
          </div>
        </div>
      </div>

      {/* Financial Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profitability */}
        <div className="bg-[var(--bg-card-primary)] rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)] flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-[var(--positive)]" />
            Profitability
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">ROE</span>
              <span className="font-medium">{data.fundamental?.financial_highlights?.management_effectiveness?.return_on_equity || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">ROA</span>
              <span className="font-medium">{data.fundamental?.financial_highlights?.management_effectiveness?.return_on_assets || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">Operating Margin</span>
              <span className="font-medium">{data.fundamental?.financial_highlights?.profitability?.operating_margin || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">Profit Margin</span>
              <span className="font-medium">{data.fundamental?.financial_highlights?.profitability?.profit_margin || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">EPS (TTM)</span>
              <span className="font-medium">{formatCurrency(data.overview?.eps || 0)}</span>
            </div>
          </div>
        </div>

        {/* Financial Strength */}
        <div className="bg-[var(--bg-card-primary)] rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)] flex items-center">
            <Layers className="w-5 h-5 mr-2 text-[var(--accent-main)]" />
            Financial Strength
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">Debt to Equity</span>
              <span className="font-medium">{data.fundamental?.financial_highlights?.balance_sheet?.total_debt_equity || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">Current Ratio</span>
              <span className="font-medium">{data.fundamental?.financial_highlights?.balance_sheet?.current_ratio || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">Total Cash</span>
              <span className="font-medium">{data.fundamental?.financial_highlights?.balance_sheet?.total_cash || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">Total Debt</span>
              <span className="font-medium">{data.fundamental?.financial_highlights?.balance_sheet?.total_debt || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Operating Cash Flow</span>
              <span className="font-medium">{data.fundamental?.financial_highlights?.cash_flow_statement?.operating_cash_flow || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Growth & Trading Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Metrics */}
        <div className="bg-[var(--bg-card-primary)] rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)] flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-[var(--positive)]" />
            Growth Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">Revenue Growth (QoQ)</span>
              <span className="font-medium text-[var(--positive)]">{data.fundamental?.financial_highlights?.income_statement?.quarterly_revenue_growth || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">Earnings Growth (QoQ)</span>
              <span className="font-medium text-[var(--positive)]">{data.fundamental?.financial_highlights?.income_statement?.quarterly_earnings_growth || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">Revenue (TTM)</span>
              <span className="font-medium">{data.fundamental?.financial_highlights?.income_statement?.revenue_ttm || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Net Income (TTM)</span>
              <span className="font-medium">{data.fundamental?.financial_highlights?.income_statement?.net_income_ttm || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Trading Information */}
        <div className="bg-[var(--bg-card-primary)] rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)] flex items-center">
            <Activity className="w-5 h-5 mr-2 text-[var(--accent-main)]" />
            Trading Information
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">Beta</span>
              <span className="font-medium">{data.overview?.beta || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">52W Range</span>
              <span className="font-medium">{data.overview?.['52_week_range'] || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">Volume</span>
              <span className="font-medium">{data.overview?.volume || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">Avg Volume</span>
              <span className="font-medium">{data.overview?.avg_volume || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Dividend Yield</span>
              <span className="font-medium">{data.overview?.forward_dividend_yield || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Analysis */}
      <div className="bg-[var(--bg-card-primary)] rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)] flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-400" />
          Technical Analysis Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--bg-card-secondary)] rounded-lg p-4">
            <h4 className="font-medium mb-3">Moving Averages</h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--text-secondary)]">Overall Signal</span>
              <span className={`font-medium ${getActionColor(data.technicals?.summary?.moving_averages?.overall)}`}>
                {data.technicals?.summary?.moving_averages?.overall || 'N/A'}
              </span>
            </div>
            <div className="text-sm text-[var(--text-secondary)]">
              Buy: {data.technicals?.summary?.moving_averages?.buy || 0} | 
              Sell: {data.technicals?.summary?.moving_averages?.sell || 0} | 
              Neutral: {data.technicals?.summary?.moving_averages?.neutral || 0}
            </div>
          </div>
          
          <div className="bg-[var(--bg-card-secondary)] rounded-lg p-4">
            <h4 className="font-medium mb-3">Oscillators</h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--text-secondary)]">Overall Signal</span>
              <span className={`font-medium ${getActionColor(data.technicals?.summary?.oscillators?.overall)}`}>
                {data.technicals?.summary?.oscillators?.overall || 'N/A'}
              </span>
            </div>
            <div className="text-sm text-[var(--text-secondary)]">
              Buy: {data.technicals?.summary?.oscillators?.buy || 0} | 
              Sell: {data.technicals?.summary?.oscillators?.sell || 0} | 
              Neutral: {data.technicals?.summary?.oscillators?.neutral || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Analyst Ratings */}
      <div className="bg-[var(--bg-card-primary)] rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)] flex items-center">
          <Award className="w-5 h-5 mr-2 text-purple-400" />
          Analyst Ratings & Targets
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--bg-card-secondary)] rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[var(--text-secondary)] text-sm">Average Target</span>
                <div className="text-2xl font-bold text-[var(--positive)] mt-1">
                  {formatCurrency(data.analysis?.analyst_ratings?.price_target_avg || 0)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[var(--text-secondary)] text-sm">Current Price</span>
                <div className="text-xl font-semibold mt-1">{formatCurrency(data.overview?.current_price || 0)}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Target High</span>
                <span>{formatCurrency(data.analysis?.analyst_ratings?.price_target_high || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Target Low</span>
                <span>{formatCurrency(data.analysis?.analyst_ratings?.price_target_low || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Potential Upside</span>
                <span className="text-[var(--positive)]">
                  {((data.analysis?.analyst_ratings?.price_target_avg / data.overview?.current_price - 1) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--bg-card-secondary)] rounded-lg p-4">
            <h4 className="font-medium mb-3">Recent Ratings</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {data.analysis?.analyst_ratings?.ratings?.slice(0, 5).map((rating, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium">{rating.firm}</div>
                    <div className="text-[var(--text-secondary)] text-xs">{rating.date}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${getRatingColor(rating.rating)}`}>
                      {rating.rating}
                    </div>
                    {rating.price_target && (
                      <div className="text-[var(--text-secondary)] text-xs">
                        {formatCurrency(rating.price_target)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Earnings & Revenue Estimates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Estimates */}
        <div className="bg-[var(--bg-card-primary)] rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)] flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-[var(--positive)]" />
            Earnings Estimates
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-[var(--text-secondary)]">
              <thead className="text-xs uppercase bg-[var(--bg-card-secondary)] text-[var(--text-secondary)]">
                <tr>
                  <th className="px-3 py-2">Period</th>
                  <th className="px-3 py-2">Estimate</th>
                  <th className="px-3 py-2">High</th>
                  <th className="px-3 py-2">Low</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.analysis?.earnings_estimates || {}).map(([period, estimate]) => (
                  <tr key={period} className="border-b border-[var(--border)]">
                    <td className="px-3 py-2 font-medium">{period}</td>
                    <td className="px-3 py-2">{formatCurrency(estimate.avg_estimate)}</td>
                    <td className="px-3 py-2">{formatCurrency(estimate.high_estimate)}</td>
                    <td className="px-3 py-2">{formatCurrency(estimate.low_estimate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue Estimates */}
        <div className="bg-[var(--bg-card-primary)] rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)] flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-[var(--accent-main)]" />
            Revenue Estimates
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-[var(--text-secondary)]">
              <thead className="text-xs uppercase bg-[var(--bg-card-secondary)] text-[var(--text-secondary)]">
                <tr>
                  <th className="px-3 py-2">Period</th>
                  <th className="px-3 py-2">Estimate</th>
                  <th className="px-3 py-2">Growth</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.analysis?.revenue_estimates || {}).map(([period, estimate]) => (
                  <tr key={period} className="border-b border-[var(--border)]">
                    <td className="px-3 py-2 font-medium">{period}</td>
                    <td className="px-3 py-2">{estimate.avg_estimate}</td>
                    <td className="px-3 py-2 text-[var(--positive)]">{estimate.sales_growth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockAnalysisReport;