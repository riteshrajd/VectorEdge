// File: src/components/OverviewTab.jsx
import React, { useEffect } from 'react';
import { useDataStore } from '@/lib/store/dataStore';

const OverviewTab = ({ symbol }) => {
  const {
    stock,
    fundamentals,
    indicators,
    news,
    loading,
    error,
    fetchData
  } = useDataStore();

  useEffect(() => {
    fetchData(symbol);
  }, [symbol, fetchData]);

  if (loading) return <div className="p-4">Loading data...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 space-y-6">
      {/* Stock Overview */}
      {stock && (
        <div>
          <h2 className="text-2xl font-bold">
            {symbol} - ${stock.price.toFixed(2)}
            <span className={`ml-2 text-${stock.change >= 0 ? 'green' : 'red'}-500`}>
              {stock.change >= 0 ? '↑' : '↓'} {Math.abs(stock.change)} ({stock.changePercent})
            </span>
          </h2>
          <p className="text-gray-500 text-sm">Last updated: {stock.lastUpdated}</p>
        </div>
      )}

      {/* Fundamentals */}
      {fundamentals && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Fundamentals</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div><strong>Market Cap:</strong> ${(fundamentals.marketCap / 1e9).toFixed(1)}B</div>
            <div><strong>P/E Ratio:</strong> {fundamentals.peRatio}</div>
            <div><strong>Dividend Yield:</strong> {fundamentals.dividendYield}%</div>
            <div><strong>Profit Margin:</strong> {fundamentals.profitMargin}%</div>
            <div><strong>ROE:</strong> {fundamentals.returnOnEquity}%</div>
            <div><strong>EPS:</strong> {fundamentals.eps}</div>
            <div><strong>Sector:</strong> {fundamentals.sector}</div>
            <div><strong>Industry:</strong> {fundamentals.industry}</div>
          </div>
        </div>
      )}

      {/* Technical Indicators */}
      {indicators && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Technical Indicators</h3>
          <div className="flex gap-6 flex-wrap text-sm">
            {/* RSI */}
            <div className="bg-gray-100 p-4 rounded shadow-sm w-40">
              <p>RSI (14)</p>
              <p className={`text-${indicators.rsi > 70 ? 'red' : indicators.rsi < 30 ? 'green' : 'gray'}-500 font-bold text-lg`}>
                {indicators.rsi && indicators.rsi.toFixed(2)}
              </p>
              <p>
                {indicators.rsi > 70 ? 'Overbought' : indicators.rsi < 30 ? 'Oversold' : 'Neutral'}
              </p>
            </div>
            {/* MACD */}
            {indicators.macd && (
              <div className="bg-gray-100 p-4 rounded shadow-sm w-40">
                <p>MACD</p>
                <p className="text-blue-600 font-bold text-lg">{indicators.macd.macd.toFixed(2)}</p>
                <p className="text-gray-600 text-sm">Signal: {indicators.macd.signal.toFixed(2)}</p>
                <p className="text-xs">
                  {indicators.macd.macd > indicators.macd.signal ? 'Bullish Crossover' : 'Bearish Crossover'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* News Section */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Latest News</h3>
        <div className="space-y-4">
          {news.slice(0, 3).map((article, i) => (
            <div key={i} className="border-b pb-3">
              <h4 className="font-medium">{article.title}</h4>
              <p className="text-sm text-gray-600">{article.source} • {new Date(article.publishedAt).toLocaleDateString()}</p>
              <p className="text-sm mt-1">{article.description}</p>
              <a href={article.url} target="_blank" rel="noreferrer" className="text-blue-500 text-sm">
                Read more →
              </a>
            </div>
          ))}
          {news.length > 3 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-center">
              <p>Plus members get unlimited news access</p>
              <button className="mt-2 px-4 py-1 bg-blue-500 text-white rounded">
                Upgrade to Plus
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
