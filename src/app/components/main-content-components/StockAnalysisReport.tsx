'use client';

import React, { useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  Target, 
  Brain, 
  Shield, 
  Zap, 
  Activity,
  Users,
  Scale,
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { CombinedData } from '@/types/types';

interface StockAnalysisReportProps {
  data: CombinedData | null;
  setIsShrunk: React.Dispatch<React.SetStateAction<boolean>>;
}

const StockAnalysisReport: React.FC<StockAnalysisReportProps> = ({ data, setIsShrunk }) => {
  const ref = useRef<HTMLDivElement>(null);

  // --- Helpers ---
  const formatCurrency = (val: number | null) => {
    if (val === null || val === undefined) return 'N/A';
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(num) ? 'N/A' : `$${num.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  };

  const formatCompact = (val: number | null) => {
    if (!val) return 'N/A';
    if (typeof val === 'string' && /[KMBT]$/i.test(val)) return val;
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 2 }).format(num);
  };

  const getColorClass = (val: number | null, type: 'text' | 'bg' | 'border' = 'text') => {
    let isPos = false;
    if (typeof val === 'number') isPos = val > 0;

    if (type === 'bg') return isPos ? 'bg-emerald-500/10' : 'bg-rose-500/10';
    if (type === 'border') return isPos ? 'border-emerald-500/20' : 'border-rose-500/20';
    return isPos ? 'text-emerald-500' : 'text-rose-500';
  };

  const getRatingColor = (rating: string) => {
    const r = rating?.toLowerCase() || '';
    if (r.includes('buy') || r.includes('outperform')) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (r.includes('sell') || r.includes('underweight')) return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
    return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
  };

  // --- Scroll Handler ---
  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) setIsShrunk(ref.current.scrollTop > 50);
    };
    const div = ref.current;
    if (div) div.addEventListener('scroll', handleScroll);
    return () => { if (div) div.removeEventListener('scroll', handleScroll); };
  }, [ref, setIsShrunk]);

  if (!data) return <div className="p-6 text-center text-muted-foreground">No Data Available</div>;

  const { overview, fundamental, analysis, technicals, ai_insights } = data;
  const priceTrendData = ai_insights?.visualization_data?.price_trend || [];

  return (
    <div className="space-y-6 overflow-y-auto p-2 pb-20 scrollbar-hide" ref={ref}>
      
      {/* --- SECTION 1: AI INSIGHTS & CHART (The Hero) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: AI Recommendation Card */}
        <div className="lg:col-span-1 bg-[var(--color-card)] rounded-xl p-5 border border-[var(--color-border)] shadow-sm flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5 text-violet-500" />
                    <h2 className="font-bold text-lg text-foreground">AI Verdict</h2>
                </div>

                <div className={`p-4 rounded-lg border mb-4 flex items-center justify-between ${getRatingColor(ai_insights?.recommendation?.action || '')}`}>
                    <div>
                        <div className="text-xs uppercase font-bold tracking-wider opacity-80">Action</div>
                        <div className="text-2xl font-bold">{ai_insights?.recommendation?.action || 'Hold'}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs opacity-80">Confidence</div>
                        <div className="text-xl font-bold">{ai_insights?.recommendation?.confidence}%</div>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {ai_insights?.summary}
                </p>
                
                <div className="text-xs bg-muted/50 p-3 rounded border border-border/50">
                    <span className="font-semibold text-foreground">Reasoning: </span> 
                    <span className="text-muted-foreground">{ai_insights?.recommendation?.reasoning}</span>
                </div>
            </div>

            {/* Bullish/Risk Meters */}
            <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <TrendingUp className="w-3 h-3 text-emerald-500" /> Bullishness
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${ai_insights?.visualization_data?.bullishness_meter || 0}%` }} />
                    </div>
                    <div className="text-right text-xs font-bold mt-1 text-emerald-600">{ai_insights?.visualization_data?.bullishness_meter}%</div>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Shield className="w-3 h-3 text-rose-500" /> Risk Score
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500" style={{ width: `${ai_insights?.visualization_data?.risk_score || 0}%` }} />
                    </div>
                    <div className="text-right text-xs font-bold mt-1 text-rose-600">{ai_insights?.visualization_data?.risk_score}%</div>
                </div>
            </div>
        </div>

        {/* Right: Price Trend Chart */}
        <div className="lg:col-span-2 bg-[var(--color-card)] rounded-xl p-5 border border-[var(--color-border)] shadow-sm min-h-[300px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    Projected Trend
                </h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">10 Day Forecast</span>
            </div>
            
            <div className="flex-1 w-full h-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={priceTrendData}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                        <XAxis 
                            dataKey="x" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 10, fill: 'var(--color-muted-foreground)'}} 
                            dy={10}
                        />
                        <YAxis 
                            domain={['auto', 'auto']} 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 10, fill: 'var(--color-muted-foreground)'}} 
                            tickFormatter={(val) => `$${val}`}
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                            itemStyle={{ color: 'var(--color-foreground)' }}
                            formatter={(val: number | undefined) => [`$${val}`, 'Price']}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="y" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorPrice)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* --- SECTION 2: FUNDAMENTAL GRID --- */}
      <div className="bg-[var(--color-card)] rounded-xl p-6 border border-[var(--color-border)] shadow-sm">
        <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-500" />
            Core Fundamentals
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[
                { label: 'Market Cap', val: fundamental?.valuation_measures?.current?.market_cap, suffix: 'B' },
                { label: 'P/E Ratio', val: fundamental?.valuation_measures?.current?.trailing_pe },
                { label: 'Forward P/E', val: fundamental?.valuation_measures?.current?.forward_pe },
                { label: 'PEG Ratio', val: fundamental?.valuation_measures?.current?.peg_ratio },
                { label: 'Price/Book', val: fundamental?.valuation_measures?.current?.price_book },
                { label: 'Profit Margin', val: fundamental?.financial_highlights?.profitability?.profit_margin, color: true },
                { label: 'Beta', val: fundamental?.trading_information?.beta },
                { label: 'Div Yield', val: overview?.forward_dividend_yield },
                { label: 'Short Ratio', val: fundamental?.trading_information?.short_ratio },
                { label: 'Instit. Held', val: fundamental?.trading_information?.percent_held_by_institutions },
            ].map((item, i) => (
                <div key={i} className="p-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/40 transition-colors">
                    <div className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">{item.label}</div>
                    <div className={`font-semibold text-sm ${item.color ? getColorClass(Number(item.val)) : 'text-foreground'}`}>
                        {item.val ? `${item.val}${item.suffix || ''}` : '--'}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* --- SECTION 3: ANALYST TARGETS & ESTIMATES --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Price Targets Visual */}
          <div className="bg-[var(--color-card)] rounded-xl p-6 border border-[var(--color-border)] shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-500" />
                  Analyst Targets
              </h3>
              
              <div className="relative pt-8 pb-4 px-2">
                  {/* The Bar */}
                  <div className="h-2 bg-gradient-to-r from-rose-400 to-emerald-400 rounded-full w-full opacity-80" />
                  
                  {/* Low Marker */}
                  <div className="absolute top-0 left-0 -translate-x-0 flex flex-col items-start">
                      <span className="text-xs font-bold text-rose-500">{formatCurrency(analysis!.analyst_ratings?.price_target_low)}</span>
                      <span className="text-[10px] text-muted-foreground">Low</span>
                  </div>

                  {/* High Marker */}
                  <div className="absolute top-0 right-0 translate-x-0 flex flex-col items-end">
                      <span className="text-xs font-bold text-emerald-500">{formatCurrency(analysis!.analyst_ratings?.price_target_high)}</span>
                      <span className="text-[10px] text-muted-foreground">High</span>
                  </div>

                  {/* Average Marker (Centered roughly) */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <span className="text-sm font-extrabold text-foreground">{formatCurrency(analysis!.analyst_ratings?.price_target_avg)}</span>
                      <span className="text-[10px] text-muted-foreground">Average</span>
                      <div className="w-0.5 h-3 bg-foreground mt-1"></div>
                  </div>
              </div>

              <div className="mt-6 flex justify-between items-center bg-muted/30 p-3 rounded-lg border border-border/50">
                  <div className="text-sm">Based on <strong>{analysis?.analyst_ratings?.number_of_analysts}</strong> Analysts</div>
                  <div className={`text-sm font-bold px-3 py-1 rounded bg-background border ${getRatingColor(analysis?.analyst_ratings?.current_rating || '')}`}>
                      {analysis?.analyst_ratings?.current_rating}
                  </div>
              </div>
          </div>

          {/* Earnings & Revenue Estimates Table */}
          <div className="bg-[var(--color-card)] rounded-xl p-6 border border-[var(--color-border)] shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Consensus Estimates
              </h3>
              
              <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                      <thead>
                          <tr className="border-b border-border/50 text-xs text-muted-foreground">
                              <th className="text-left py-2 font-medium">Period</th>
                              <th className="text-right py-2 font-medium">EPS Avg</th>
                              <th className="text-right py-2 font-medium">Rev Avg</th>
                              <th className="text-right py-2 font-medium">Growth</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                          {(['Current Qtr', 'Next Qtr', 'Current Year', 'Next Year'] as const).map((key) => {
                              const eps = analysis!.earnings_estimates?.[key];
                              const rev = analysis!.revenue_estimates?.[key];
                              if (!eps && !rev) return null;
                              return (
                                  <tr key={key}>
                                      <td className="py-3 font-medium text-foreground/90">{key}</td>
                                      <td className="py-3 text-right">{eps?.avg_estimate || '-'}</td>
                                      <td className="py-3 text-right">{rev?.avg_estimate ? formatCompact(Number(rev.avg_estimate)) : '-'}</td>
                                      <td className={`py-3 text-right ${getColorClass(Number(rev?.sales_growth))}`}>
                                          {rev?.sales_growth || '-'}
                                      </td>
                                  </tr>
                              )
                          })}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>

      {/* --- SECTION 4: TECHNICALS SUMMARY --- */}
      <div className="bg-[var(--color-card)] rounded-xl p-6 border border-[var(--color-border)] shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Technical Signals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Moving Averages */}
              <div className="bg-muted/20 rounded-lg p-4 border border-border/50">
                  <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-sm">Moving Averages</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded border ${getRatingColor(technicals?.summary?.moving_averages?.overall || 'Neutral')}`}>
                          {technicals?.summary?.moving_averages?.overall}
                      </span>
                  </div>
                  <div className="flex gap-1 h-2 rounded-full overflow-hidden">
                      <div style={{ flex: technicals!.summary?.moving_averages?.buy?.toString() }} className="bg-emerald-500" />
                      <div style={{ flex: technicals!.summary?.moving_averages?.neutral?.toString() }} className="bg-gray-400" />
                      <div style={{ flex: technicals!.summary?.moving_averages?.sell?.toString() }} className="bg-rose-500" />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                      <span>Buy: {technicals?.summary?.moving_averages?.buy}</span>
                      <span>Sell: {technicals?.summary?.moving_averages?.sell}</span>
                  </div>
              </div>

              {/* Oscillators */}
              <div className="bg-muted/20 rounded-lg p-4 border border-border/50">
                  <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-sm">Oscillators</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded border ${getRatingColor(technicals?.summary?.oscillators?.overall || 'Neutral')}`}>
                          {technicals?.summary?.oscillators?.overall}
                      </span>
                  </div>
                  <div className="flex gap-1 h-2 rounded-full overflow-hidden">
                      <div style={{ flex: technicals?.summary?.oscillators?.buy?.toString() }} className="bg-emerald-500" />
                      <div style={{ flex: technicals?.summary?.oscillators?.neutral?.toString() }} className="bg-gray-400" />
                      <div style={{ flex: technicals?.summary?.oscillators?.sell?.toString() }} className="bg-rose-500" />
                  </div>
                   <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                      <span>Buy: {technicals?.summary?.oscillators?.buy}</span>
                      <span>Sell: {technicals?.summary?.oscillators?.sell}</span>
                  </div>
              </div>
          </div>
      </div>
      
    </div>
  );
};

export default StockAnalysisReport;