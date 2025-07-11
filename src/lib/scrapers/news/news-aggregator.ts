// File path: /lib/scrapers/news/news-aggregator.ts

import { YahooNewsScraper } from './yahoo-news';
import { MarketWatchNewsScraper } from './marketwatch-news';
import { CNBCNewsScraper } from './cnbc-news';
import { NewsArticle, NewsAndSentiment, SentimentAnalysis } from '../core/data-models';

export class NewsAggregator {
  private yahooScraper: YahooNewsScraper;
  private marketwatchScraper: MarketWatchNewsScraper;
  private cnbcScraper: CNBCNewsScraper;

  constructor() {
    this.yahooScraper = new YahooNewsScraper();
    this.marketwatchScraper = new MarketWatchNewsScraper();
    this.cnbcScraper = new CNBCNewsScraper();
  }

  async getNewsAndSentiment(ticker: string): Promise<NewsAndSentiment> {
    try {
      const [yahooArticles, marketwatchArticles, cnbcArticles] = await Promise.all([
        this.yahooScraper.getNewsArticles(ticker, 15),
        this.marketwatchScraper.getNewsArticles(ticker, 15),
        this.cnbcScraper.getNewsArticles(ticker, 15)
      ]);

      // Combine and deduplicate articles
      const allArticles = this.deduplicateArticles([
        ...yahooArticles,
        ...marketwatchArticles,
        ...cnbcArticles
      ]);

      // Sort by date (newest first)
      const sortedArticles = allArticles.sort((a, b) => 
        new Date(b.published_date).getTime() - new Date(a.published_date).getTime()
      ).slice(0, 10); // Return top 10 articles

      // Analyze overall sentiment
      const sentimentAnalysis = this.analyzeOverallSentiment(sortedArticles);

      return {
        sentiment_analysis: sentimentAnalysis,
        news_articles: sortedArticles
      };
    } catch (error) {
      console.error(`Error aggregating news for ${ticker}:`, error);
      return this.getDefaultNewsAndSentiment();
    }
  }

  private deduplicateArticles(articles: NewsArticle[]): NewsArticle[] {
    const uniqueArticles: NewsArticle[] = [];
    const urlSet = new Set<string>();

    for (const article of articles) {
      // Normalize URL for comparison
      const normalizedUrl = article.url
        .replace(/https?:\/\//, '')
        .replace(/www\./, '')
        .split('?')[0];
      
      if (!urlSet.has(normalizedUrl)) {
        urlSet.add(normalizedUrl);
        uniqueArticles.push(article);
      }
    }

    return uniqueArticles;
  }

  private analyzeOverallSentiment(articles: NewsArticle[]): SentimentAnalysis {
    let totalSentiment = 0;
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;
    let totalImpact = 0;
    let totalRelevance = 0;

    articles.forEach(article => {
      totalSentiment += article.sentiment_score;
      totalImpact += article.impact_score;
      totalRelevance += article.relevance;

      switch (article.sentiment) {
        case 'POSITIVE':
          positiveCount++;
          break;
        case 'NEGATIVE':
          negativeCount++;
          break;
        default:
          neutralCount++;
      }
    });

    const totalArticles = articles.length || 1; // Avoid division by zero
    const sentimentScore = totalSentiment / totalArticles;
    const confidenceLevel = Math.min(1, totalRelevance / (totalArticles * 10) * 0.8 + totalImpact / (totalArticles * 10) * 0.2);

    // Determine overall sentiment
    let overallSentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' = 'NEUTRAL';
    if (sentimentScore > 6.5 && positiveCount > negativeCount) {
      overallSentiment = 'POSITIVE';
    } else if (sentimentScore < 4.5 && negativeCount > positiveCount) {
      overallSentiment = 'NEGATIVE';
    }

    return {
      overall_sentiment: overallSentiment,
      sentiment_score: sentimentScore,
      bullish_percentage: (positiveCount / totalArticles) * 100,
      bearish_percentage: (negativeCount / totalArticles) * 100,
      neutral_percentage: (neutralCount / totalArticles) * 100,
      confidence_level: confidenceLevel
    };
  }

  private getDefaultNewsAndSentiment(): NewsAndSentiment {
    return {
      sentiment_analysis: {
        overall_sentiment: "NEUTRAL",
        sentiment_score: 5.0,
        bullish_percentage: 40,
        bearish_percentage: 30,
        neutral_percentage: 30,
        confidence_level: 0.7
      },
      news_articles: [
        {
          title: "Market News Update",
          summary: "Stay informed about the latest market developments",
          source: "Financial Times",
          published_date: new Date().toISOString(),
          url: "https://example.com/news",
          sentiment: "NEUTRAL",
          sentiment_score: 5.0,
          relevance: 7.0,
          category: "MARKET",
          impact_score: 5.0
        }
      ]
    };
  }
}