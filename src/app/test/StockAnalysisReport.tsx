import React from 'react';
import { CombinedData } from '@/lib/types/types';

interface StockReportProps {
  data: CombinedData;
}

const StockAnalysisReport: React.FC<StockReportProps> = ({ data }) => {
  const formattedDate = data.last_updated
    ? new Date(data.last_updated).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : 'N/A';

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {data.ticker} - {data.overview?.name || 'Alphabet Inc.'}
          </h1>
          <p className="text-sm text-gray-500">Updated: {formattedDate}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold text-green-600">
            ${data.overview.current_price}
            <span className="text-sm ml-2">{data.overview.percent_change}</span>
          </p>
        </div>
      </div>

      {/* AI-Generated Summary */}
      <section className="bg-gradient-to-br from-[#f011a6] to-[#5367ff] rounded-lg p-1 ai-overview">
        <div className='bg-white p-2 rounded-lg'>
          <section className="mb-8 bg-blue-50 p-4 rounded-lg">
            <span className="text-xl font-semibold text-white bg-gradient-to-br from-[var(--accent-ai)] to-[var(--accent-secondary-ai)] rounded-xl px-2 pb-1 pt-0.5 ai-overview">AI Insights</span>
            <p className="text-gray-700 mt-4">{data.ai_insights?.summary || 'No insights available'}</p>
            <ul className="list-disc pl-5 mt-2">
              {data.ai_insights?.key_takeaways.map((takeaway, index) => (
                <li key={index} className="text-gray-700">{takeaway}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommendation</h2>
            <p className="text-lg font-semibold text-green-600">
              {data.ai_insights?.recommendation.action} (Confidence: {data.ai_insights?.recommendation.confidence}%)
            </p>
            <p className="text-gray-700">{data.ai_insights?.recommendation.reasoning}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Visual Insights</h2>
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Bullishness Meter</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full"
                    style={{ width: `${data.ai_insights?.visualization_data.bullishness_meter}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Risk Score</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-red-500 h-4 rounded-full"
                    style={{ width: `${data.ai_insights?.visualization_data.risk_score}%` }}
                  ></div>
                </div>
              </div>
            </div>
            {/* Add Chart.js or similar for price_trend */}
            <div className="mt-4 h-40 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">[Price Trend Chart: {data.ai_insights?.visualization_data.price_trend.length} points]</p>
            </div>
          </section>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-100 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-600">Market Cap</p>
            <p className="font-semibold">{data.overview.market_cap}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-600">P/E Ratio</p>
            <p className="font-semibold">{data.overview.pe_ratio}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-600">EPS</p>
            <p className="font-semibold">{data.overview.eps}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-600">Dividend Yield</p>
            <p className="font-semibold">{data.overview.forward_dividend_yield}</p>
          </div>
        </div>
      </section>

      {/* Technical Analysis */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Technical Analysis</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600">Moving Averages</p>
            <p className="text-lg font-semibold text-green-600">
              {data.technicals.summary.moving_averages.overall} ({data.technicals.summary.moving_averages.buy}/15)
            </p>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">Oscillators</p>
            <p className="text-lg font-semibold text-yellow-600">
              {data.technicals.summary.oscillators.overall}
            </p>
          </div>
        </div>
        {/* Placeholder for a simple chart */}
        <div className="mt-4 h-40 bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">[Price Trend Chart Placeholder]</p>
        </div>
      </section>

      {/* Analyst Recommendations */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Analyst Recommendations</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Average Price Target</p>
            <p className="font-semibold">${data.analysis.analyst_ratings.price_target_avg}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Consensus</p>
            <p className="font-semibold">
              {data.analysis.analyst_ratings.ratings.filter(r => r.rating.toLowerCase().includes('buy')).length /
                data.analysis.analyst_ratings.ratings.length * 100}% Buy
            </p>
          </div>
        </div>
      </section>

      {/* Actionable Recommendation */}
      <section className="bg-green-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-green-800 mb-2">Our Recommendation</h2>
        <p className="text-gray-700">
          <strong>Hold</strong>: GOOG’s strong fundamentals and technical Buy signals make it a solid long-term investment, but its high valuation suggests caution for short-term traders.
        </p>
      </section>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 mt-6">
        Data sourced from public financial APIs. Not financial advice. Always conduct your own research.
      </p>
    </div>
  );
};

export default StockAnalysisReport;