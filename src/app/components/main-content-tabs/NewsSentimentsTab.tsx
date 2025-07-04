'use client';

import React, { useState, useEffect } from 'react';
import { 
  Newspaper,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Activity,
  Twitter,
  Youtube,
  Reddit,
  Linkedin,
  Globe,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  BarChart3,
  Signal,
  Hash
} from 'lucide-react';
import { Instrument } from '../../types';
import {  socialSignalsData, extendedNewsData } from '../../data/expandedTradingData';

interface NewsSentimentsTabProps {
  instrument: Instrument | null;
}

const NewsSentimentsTab: React.FC<NewsSentimentsTabProps> = ({ instrument }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedNewsId, setExpandedNewsId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Safely get news and social signals
  const newsItems = instrument?.symbol ? extendedNewsData[instrument.symbol] || [] : [];
  const socialSignals = instrument?.symbol ? socialSignalsData[instrument.symbol] || [] : [];
  
  const filteredNews = newsItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'positive') return matchesSearch && item.sentiment === 'Positive';
    if (activeFilter === 'negative') return matchesSearch && item.sentiment === 'Negative';
    return matchesSearch;
  });
  
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return 'bg-green-500/20 text-green-400';
      case 'Negative': return 'bg-red-500/20 text-red-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };
  
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-amber-500/20 text-amber-400';
      case 'Medium': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-zinc-700 text-zinc-400';
    }
  };
  
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Twitter': return <Twitter className="w-4 h-4" />;
      case 'YouTube': return <Youtube className="w-4 h-4" />;
      case 'Reddit': return <Reddit className="w-4 h-4" />;
      case 'LinkedIn': return <Linkedin className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };
  
  const getSentimentIcon = (sentiment: string) => {
    return sentiment === 'Bullish' 
      ? <TrendingUp className="w-4 h-4" /> 
      : <TrendingDown className="w-4 h-4" />;
  };
  
  const toggleNewsExpand = (id: number) => {
    setExpandedNewsId(expandedNewsId === id ? null : id);
  };
  
  // Calculate overall sentiment score
  const sentimentScore = socialSignals.reduce((sum, signal) => sum + signal.score, 0) / (socialSignals.length || 1);
  
  // Sentiment trend data (simplified for demo)
  const sentimentTrends7d = [30, 45, 60, 55, 70, 65, 75];
  const sentimentTrends30d = [25, 35, 40, 50, 45, 60, 55, 65, 70, 75, 68, 72, 78, 80];
  
  // Calculate trend percentages
  const trend7dChange = Math.round(
    ((sentimentTrends7d[sentimentTrends7d.length - 1] - sentimentTrends7d[0]) / sentimentTrends7d[0]) * 100
  );
  
  const trend30dChange = Math.round(
    ((sentimentTrends30d[sentimentTrends30d.length - 1] - sentimentTrends30d[0]) / sentimentTrends30d[0]) * 100
  );

  if (!instrument) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <Newspaper className="w-12 h-12 mx-auto text-zinc-600" />
          <h3 className="mt-4 text-xl font-semibold text-zinc-300">Select an instrument</h3>
          <p className="text-zinc-500 mt-2">Choose an instrument to view news and sentiment data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search news..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center ${
              activeFilter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            <Globe className="w-4 h-4 mr-1" /> All
          </button>
          <button
            onClick={() => setActiveFilter('positive')}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center ${
              activeFilter === 'positive' 
                ? 'bg-green-600/20 text-green-400 border border-green-500/30' 
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-1" /> Positive
          </button>
          <button
            onClick={() => setActiveFilter('negative')}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center ${
              activeFilter === 'negative' 
                ? 'bg-red-600/20 text-red-400 border border-red-500/30' 
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            <TrendingDown className="w-4 h-4 mr-1" /> Negative
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-sm flex items-center hover:bg-zinc-700">
            <Filter className="w-4 h-4 mr-1" /> Filters
          </button>
        </div>
      </div>
      
      {isClient ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* News Section (2/3 width) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <Newspaper className="w-5 h-5 mr-2 text-blue-400" />
                Latest News
              </h3>
              <span className="text-sm text-zinc-400">{filteredNews.length} articles</span>
            </div>
            
            {filteredNews.length > 0 ? (
              <div className="space-y-4">
                {filteredNews.map((news) => (
                  <div 
                    key={news.id} 
                    className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden hover:border-zinc-600 transition-colors"
                  >
                    <div className="p-4 cursor-pointer" onClick={() => toggleNewsExpand(news.id)}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getSentimentColor(news.sentiment)}`}>
                              {news.sentiment}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getImpactColor(news.impact)}`}>
                              {news.impact} Impact
                            </span>
                            <span className="text-xs text-zinc-500">
                              {new Date(news.timestamp).toLocaleDateString('en-IN', { 
                                day: 'numeric', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </span>
                          </div>
                          
                          <h4 className="font-semibold text-white mb-2">{news.title}</h4>
                          <p className="text-sm text-zinc-400">{news.summary}</p>
                        </div>
                        
                        {news.imageUrl && (
                          <div className="ml-4 flex-shrink-0">
                            <div 
                              className="bg-zinc-800 border border-zinc-700 rounded w-16 h-16 bg-cover bg-center"
                              style={{ backgroundImage: `url(${news.imageUrl})` }}
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3 flex justify-between items-center">
                        <div className="flex items-center text-xs text-zinc-500">
                          <span className="mr-3">Source: {news.source}</span>
                          <span>By {news.author}</span>
                        </div>
                        <button className="text-zinc-500 hover:text-white">
                          {expandedNewsId === news.id ? <ChevronUp /> : <ChevronDown />}
                        </button>
                      </div>
                    </div>
                    
                    {expandedNewsId === news.id && (
                      <div className="border-t border-zinc-800 p-4 bg-zinc-950">
                        <div className="prose prose-invert max-w-none text-sm">
                          <p className="text-zinc-300 mb-4">{news.content}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {news.tags.map(tag => (
                              <span 
                                key={tag} 
                                className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-zinc-500 text-xs">
                              Related symbols: {news.relatedSymbols.join(', ')}
                            </div>
                            <a 
                              href={news.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                            >
                              Read full article <ArrowUpRight className="w-4 h-4 ml-1" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-8 text-center">
                <Newspaper className="w-12 h-12 mx-auto text-zinc-600" />
                <h4 className="mt-4 text-zinc-300">No news found</h4>
                <p className="text-zinc-500 mt-2">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
          
          {/* Sentiment Section (1/3 width) */}
          <div className="space-y-6">
            {/* Overall Sentiment */}
            <div className="bg-zinc-900 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-purple-400" />
                Overall Sentiment
              </h3>
              
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 rounded-full border-[12px] border-zinc-800"></div>
                  <div 
                    className="absolute inset-0 rounded-full border-[12px] border-green-500" 
                    style={{ 
                      clipPath: `inset(0 ${100 - sentimentScore}% 0 0)`,
                      transform: 'rotate(45deg)'
                    }}
                  ></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">
                      {sentimentScore.toFixed(0)}
                      <span className="text-xl">/100</span>
                    </span>
                    <span className={`text-sm mt-1 ${
                      sentimentScore >= 70 ? 'text-green-400' : 
                      sentimentScore >= 40 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {sentimentScore >= 70 ? 'Bullish' : 
                      sentimentScore >= 40 ? 'Neutral' : 'Bearish'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-800 rounded-lg p-3">
                  <div className="text-zinc-400 text-sm">Bullish Signals</div>
                  <div className="text-xl font-bold text-green-400">
                    {Math.round(socialSignals.filter(s => s.sentiment === 'Bullish').length / socialSignals.length * 100 || 0)}%
                  </div>
                </div>
                <div className="bg-zinc-800 rounded-lg p-3">
                  <div className="text-zinc-400 text-sm">Bearish Signals</div>
                  <div className="text-xl font-bold text-red-400">
                    {Math.round(socialSignals.filter(s => s.sentiment === 'Bearish').length / socialSignals.length * 100 || 0)}%
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="bg-zinc-800 rounded-lg p-3">
                  <div className="text-zinc-400 text-sm">Avg. Mentions</div>
                  <div className="text-lg font-bold flex items-center">
                    <Hash className="w-4 h-4 mr-1 text-zinc-400" />
                    {Math.round(socialSignals.reduce((sum, s) => sum + s.mentions, 0) / socialSignals.length || 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-zinc-800 rounded-lg p-3">
                  <div className="text-zinc-400 text-sm">24h Change</div>
                  <div className={`text-lg font-bold ${
                    socialSignals.reduce((sum, s) => sum + s.change24h, 0) / socialSignals.length >= 0 ? 
                    'text-green-400' : 'text-red-400'
                  }`}>
                    {socialSignals.reduce((sum, s) => sum + s.change24h, 0) / socialSignals.length >= 0 ? '+' : ''}
                    {(socialSignals.reduce((sum, s) => sum + s.change24h, 0) / socialSignals.length || 0).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Sentiment */}
            <div className="bg-zinc-900 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
                Social Sentiment
              </h3>
              
              <div className="space-y-4">
                {socialSignals.map((signal, index) => (
                  <div key={index} className="bg-zinc-800 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {getPlatformIcon(signal.platform)}
                        </div>
                        <span className="font-medium">{signal.platform}</span>
                      </div>
                      <div className={`flex items-center ${
                        signal.sentiment === 'Bullish' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {getSentimentIcon(signal.sentiment)}
                        <span className="ml-1 text-sm">{signal.sentiment}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <span className="text-zinc-400">Mentions: </span>
                        <span className="font-medium">{signal.mentions.toLocaleString()}</span>
                      </div>
                      <div className={`${signal.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {signal.change24h >= 0 ? '+' : ''}{signal.change24h}%
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="w-full bg-zinc-700 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            signal.sentiment === 'Bullish' ? 'bg-green-500' : 'bg-red-500'
                          }`} 
                          style={{ width: `${signal.score}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-zinc-400 mt-1">
                        <span>0</span>
                        <span>Sentiment: {signal.score}/100</span>
                        <span>100</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-1">
                      {signal.trendingTopics.slice(0, 3).map((topic, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-1 bg-zinc-700/50 text-zinc-300 rounded text-xs"
                        >
                          {topic}
                        </span>
                      ))}
                      {signal.trendingTopics.length > 3 && (
                        <span className="px-2 py-1 bg-zinc-700/50 text-zinc-300 rounded text-xs">
                          +{signal.trendingTopics.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                
                {socialSignals.length === 0 && (
                  <div className="text-center py-8 text-zinc-500">
                    <Signal className="w-12 h-12 mx-auto mb-2" />
                    <p>No social signals available</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Sentiment Trends */}
            <div className="bg-zinc-900 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-amber-400" />
                Sentiment Trends
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-400">Last 7 days</span>
                    <span className={`${trend7dChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {trend7dChange >= 0 ? '+' : ''}{trend7dChange}%
                    </span>
                  </div>
                  <div className="relative h-32 w-full">
                    <div className="absolute bottom-0 left-0 w-full h-full flex items-end space-x-1">
                      {sentimentTrends7d.map((value, i) => (
                        <div 
                          key={i}
                          className="flex-1 bg-gradient-to-t from-green-500 to-green-700 rounded-t"
                          style={{ height: `${value}%` }}
                        />
                      ))}
                    </div>
                    <div className="absolute top-0 left-0 w-full flex justify-between text-xs text-zinc-500 px-1">
                      <span>M</span>
                      <span>T</span>
                      <span>W</span>
                      <span>T</span>
                      <span>F</span>
                      <span>S</span>
                      <span>S</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-400">Last 30 days</span>
                    <span className={`${trend30dChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {trend30dChange >= 0 ? '+' : ''}{trend30dChange}%
                    </span>
                  </div>
                  <div className="relative h-32 w-full">
                    <div className="absolute bottom-0 left-0 w-full h-full flex items-end space-x-0.5">
                      {sentimentTrends30d.map((value, i) => (
                        <div 
                          key={i}
                          className="flex-1 bg-gradient-to-t from-green-500 to-green-700 rounded-t"
                          style={{ height: `${value}%` }}
                        />
                      ))}
                    </div>
                    <div className="absolute top-0 left-0 w-full flex justify-between text-[10px] text-zinc-500 px-0.5">
                      <span>W1</span>
                      <span>W2</span>
                      <span>W3</span>
                      <span>W4</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-96">
          <div className="text-zinc-500">Loading news and sentiment data...</div>
        </div>
      )}
    </div>
  );
};

export default NewsSentimentsTab;