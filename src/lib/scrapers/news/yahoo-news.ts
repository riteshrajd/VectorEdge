// File path: /lib/scrapers/news/yahoo-news.ts

import { BaseScraper } from '../core/base-scraper';
import { NewsArticle } from '../core/data-models';

export class YahooNewsScraper extends BaseScraper {
  constructor() {
    super(2); // Higher rate limit for news scraping
  }

  async getNewsArticles(ticker: string, maxArticles: number = 10): Promise<NewsArticle[]> {
    try {
      const $ = await this.fetchHTML(`https://finance.yahoo.com/quote/${ticker}/news`);
      const articles: NewsArticle[] = [];

      // Extract news items
      $('li.js-stream-content').each((i, element) => {
        if (articles.length >= maxArticles) return;
        
        const title = $(element).find('h3').text().trim();
        const summary = $(element).find('p').text().trim();
        const source = $(element).find('div span').first().text().trim();
        const timeText = $(element).find('time').text().trim();
        const url = $(element).find('a').attr('href') || '';
        
        if (title && url) {
          const publishedDate = this.parseTimeText(timeText);
          const fullUrl = url.startsWith('http') ? url : `https://finance.yahoo.com${url}`;
          
          articles.push({
            title,
            summary,
            source,
            published_date: publishedDate.toISOString(),
            url: fullUrl,
            sentiment: 'NEUTRAL', // Will be analyzed later
            sentiment_score: 5.0,
            relevance: 8.0,
            category: 'GENERAL',
            impact_score: 5.0
          });
        }
      });

      // Analyze sentiment for articles
      return this.analyzeSentiment(articles);
    } catch (error) {
      console.error(`Error scraping Yahoo news for ${ticker}:`, error);
      return [];
    }
  }

  private parseTimeText(timeText: string): Date {
    const now = new Date();
    
    if (timeText.includes('min')) {
      const mins = parseInt(timeText.replace(/\D/g, ''), 10) || 0;
      return new Date(now.getTime() - mins * 60000);
    }
    
    if (timeText.includes('hour')) {
      const hours = parseInt(timeText.replace(/\D/g, ''), 10) || 0;
      return new Date(now.getTime() - hours * 3600000);
    }
    
    if (timeText.includes('day')) {
      const days = parseInt(timeText.replace(/\D/g, ''), 10) || 0;
      return new Date(now.getTime() - days * 86400000);
    }
    
    return now;
  }

  private async analyzeSentiment(articles: NewsArticle[]): Promise<NewsArticle[]> {
    // Simple sentiment analysis based on keywords
    const sentimentKeywords = {
      positive: ['buy', 'strong', 'beat', 'growth', 'upgrade', 'bullish', 'win', 'gain', 'success'],
      negative: ['sell', 'weak', 'miss', 'cut', 'downgrade', 'bearish', 'loss', 'drop', 'fail']
    };

    return articles.map(article => {
      let positiveCount = 0;
      let negativeCount = 0;
      let totalKeywords = 0;
      
      // Analyze title and summary
      const text = `${article.title} ${article.summary}`.toLowerCase();
      
      sentimentKeywords.positive.forEach(word => {
        if (text.includes(word)) {
          positiveCount++;
          totalKeywords++;
        }
      });
      
      sentimentKeywords.negative.forEach(word => {
        if (text.includes(word)) {
          negativeCount++;
          totalKeywords++;
        }
      });
      
      // Calculate sentiment score (0-10)
      let sentimentScore = 5.0;
      if (totalKeywords > 0) {
        sentimentScore = 5 + ((positiveCount - negativeCount) / totalKeywords) * 5;
      }
      
      // Determine sentiment category
      let sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' = 'NEUTRAL';
      if (sentimentScore > 6.5) sentiment = 'POSITIVE';
      else if (sentimentScore < 3.5) sentiment = 'NEGATIVE';
      
      // Estimate impact score based on source and content
      let impactScore = 5.0;
      if (article.source.includes('Reuters') || article.source.includes('Bloomberg')) {
        impactScore += 2.0;
      }
      if (text.includes('earnings') || text.includes('results')) {
        impactScore += 1.5;
      }
      if (text.includes('upgrade') || text.includes('downgrade')) {
        impactScore += 2.0;
      }
      
      return {
        ...article,
        sentiment,
        sentiment_score: Math.max(0, Math.min(10, sentimentScore)),
        impact_score: Math.max(0, Math.min(10, impactScore))
      };
    });
  }
}