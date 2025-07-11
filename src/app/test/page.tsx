// app/insight/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

// Define types matching your API response
interface CompanyOverview {
  name: string;
  ticker: string;
  industry: string;
  sector: string;
  currentPrice: string;
  priceChange: string;
  priceChangePercent: string;
  marketStatus: string;
}

interface QuickStats {
  marketCap: string;
  peRatio: string;
  dividendYield: string;
  weekHigh52: string;
  weekLow52: string;
  avgDailyVolume: string;
}

interface FinancialStatement {
  revenue: number[];
  netIncome: number[];
  eps: number[];
  // Include other financial properties as needed
}

interface KeyMetrics {
  grossMargin: string;
  operatingMargin: string;
  netMargin: string;
  roe: string;
  roa: string;
  currentRatio: string;
  quickRatio: string;
  debtToEquity: string;
  pbRatio: string;
  evEbitda: string;
}

interface GrowthTrends {
  revenueGrowth: number[];
  years: string[];
}

interface DividendInfo {
  currentYield: string;
  payoutRatio: string;
  annualDividend: string;
}

interface AnalystRatings {
  buyPercent: number;
  holdPercent: number;
  sellPercent: number;
  avgPriceTarget: string;
}

interface InsiderActivity {
  trades: Array<{
    insider: string;
    action: string;
    shares: string;
    price: string;
    date: string;
  }>;
}

interface CompetitorData {
  name: string;
  ticker: string;
  peRatio: string;
}

interface NewsEvent {
  headline: string;
  source: string;
  date: string;
  url: string;
}

interface FundamentalData {
  overview: CompanyOverview;
  quickStats: QuickStats;
  financials: FinancialStatement;
  keyMetrics: KeyMetrics;
  growthTrends: GrowthTrends;
  dividendInfo: DividendInfo;
  analystRatings: AnalystRatings;
  insiderActivity: InsiderActivity;
  competitors: CompetitorData[];
  news: NewsEvent[];
}

export default function StockInsightPage() {
  const searchParams = useSearchParams();
  const ticker = searchParams.get('ticker');
  const [data, setData] = useState<FundamentalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/insight?ticker=${ticker}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticker]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading {ticker} data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold">Error</h2>
          <p className="mt-2">{error}</p>
          <p className="mt-2">Please try again or check the ticker symbol</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">No Data Found</h2>
          <p className="mt-2">Could not find data for {ticker}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {data.overview.name} ({data.overview.ticker})
          </h1>
          <div className="mt-4 flex justify-center items-center">
            <span className="text-4xl font-bold text-gray-900">
              ${data.overview.currentPrice}
            </span>
            <span
              className={`ml-4 text-xl font-semibold ${
                data.overview.priceChange.startsWith('-')
                  ? 'text-red-600'
                  : 'text-green-600'
              }`}
            >
              {data.overview.priceChange} ({data.overview.priceChangePercent})
            </span>
            <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {data.overview.marketStatus}
            </span>
          </div>
          <p className="mt-2 text-gray-600">
            {data.overview.sector} | {data.overview.industry}
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <Section title="Key Metrics">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                  title="Market Cap"
                  value={data.quickStats.marketCap}
                />
                <MetricCard title="P/E Ratio" value={data.quickStats.peRatio} />
                <MetricCard
                  title="Dividend Yield"
                  value={data.quickStats.dividendYield}
                />
                <MetricCard
                  title="52W Range"
                  value={`${data.quickStats.weekLow52} - ${data.quickStats.weekHigh52}`}
                />
                <MetricCard
                  title="Volume"
                  value={data.quickStats.avgDailyVolume}
                />
                <MetricCard
                  title="Gross Margin"
                  value={data.keyMetrics.grossMargin}
                />
                <MetricCard
                  title="ROE"
                  value={data.keyMetrics.roe}
                />
                <MetricCard
                  title="Debt/Equity"
                  value={data.keyMetrics.debtToEquity}
                />
              </div>
            </Section>

            {/* Financial Highlights */}
            <Section title="Financial Highlights">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Metric
                      </th>
                      {data.growthTrends.years.map((year, index) => (
                        <th
                          key={index}
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {year}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <FinancialRow
                      title="Revenue"
                      values={data.financials.revenue}
                      format="currency"
                    />
                    <FinancialRow
                      title="Net Income"
                      values={data.financials.netIncome}
                      format="currency"
                    />
                    <FinancialRow
                      title="EPS"
                      values={data.financials.eps}
                      format="decimal"
                    />
                    <FinancialRow
                      title="Revenue Growth"
                      values={data.growthTrends.revenueGrowth}
                      format="percent"
                    />
                  </tbody>
                </table>
              </div>
            </Section>

            {/* Analyst Ratings */}
            <Section title="Analyst Ratings">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-green-600">
                      Buy: {data.analystRatings.buyPercent}%
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      Hold: {data.analystRatings.holdPercent}%
                    </span>
                    <span className="text-sm font-medium text-red-600">
                      Sell: {data.analystRatings.sellPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: `${data.analystRatings.buyPercent}%` }}
                    ></div>
                    <div
                      className="bg-gray-400 h-2.5 rounded-full -mt-2.5"
                      style={{
                        width: `${data.analystRatings.holdPercent}%`,
                        marginLeft: `${data.analystRatings.buyPercent}%`
                      }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">Avg. Target Price</p>
                    <p className="text-xl font-bold">
                      ${data.analystRatings.avgPriceTarget}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">Dividend Yield</p>
                    <p className="text-xl font-bold">
                      {data.dividendInfo.currentYield}
                    </p>
                  </div>
                </div>
              </div>
            </Section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Competitors */}
            <Section title="Competitors">
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {data.competitors.map((competitor, index) => (
                    <li key={index}>
                      <a
                        href={`/insight?ticker=${competitor.ticker}`}
                        className="block hover:bg-gray-50"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-indigo-600 truncate">
                              {competitor.name} ({competitor.ticker})
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                P/E: {competitor.peRatio}
                              </p>
                            </div>
                          </div>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Section>

            {/* Insider Activity */}
            <Section title="Recent Insider Activity">
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {data.insiderActivity.trades.slice(0, 3).map((trade, index) => (
                    <li key={index}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {trade.insider}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                trade.action.includes('Buy')
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {trade.action}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {trade.shares} shares @ ${trade.price}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            {trade.date}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Section>

            {/* News */}
            <Section title="Latest News">
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {data.news.slice(0, 4).map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block hover:bg-gray-50"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-indigo-600 truncate">
                              {item.headline}
                            </p>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                {item.source}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              {item.date}
                            </div>
                          </div>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable section component
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-lg font-medium text-gray-900 mb-4">{title}</h2>
    {children}
  </div>
);

// Metric card component
const MetricCard = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <p className="mt-1 text-lg font-semibold text-gray-900">{value}</p>
  </div>
);

// Financial table row component
const FinancialRow = ({
  title,
  values,
  format
}: {
  title: string;
  values: number[];
  format: 'currency' | 'percent' | 'decimal';
}) => {
  const formatValue = (value: number) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    if (format === 'percent') {
      return `${(value * 100).toFixed(2)}%`;
    }
    return value.toFixed(2);
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {title}
      </td>
      {values.map((val, idx) => (
        <td key={idx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
          {formatValue(val)}
        </td>
      ))}
    </tr>
  );
};