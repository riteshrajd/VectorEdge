// File path: /lib/scrapers/news/marketwatch-news.ts

import { BaseScraper } from '../core/base-scraper';
import { NewsArticle } from '../core/data-models';

export class MarketWatchNewsScraper extends BaseScraper {
  constructor() {
    super(2); // MarketWatch allows moderate scraping
  }

  async getNewsArticles(ticker: string, maxArticles: number = 10): Promise<NewsArticle[]> {
    try {
      const $ = await this.fetchHTML(`https://www.marketwatch.com/investing/stock/${ticker}`);
      const articles: NewsArticle[] = [];

      // Extract news items from the main stock page
      $('div.article__content').each((i, element) => {
        if (articles.length >= maxArticles) return;
        
        const title = $(element).find('h3.article__headline a').text().trim();
        const url = $(element).find('h3.article__headline a').attr('href') || '';
        const summary = $(element).find('p.article__summary').text().trim();
        const source = 'MarketWatch';
        const timeText = $(element).find('span.article__timestamp').text().trim();
        
        if (title && url) {
          const publishedDate = this.parseTimeText(timeText);
          const fullUrl = url.startsWith('http') ? url : `https://www.marketwatch.com${url}`;
          
          articles.push({
            title,
            summary,
            source,
            published_date: publishedDate.toISOString(),
            url: fullUrl,
            sentiment: 'NEUTRAL',
            sentiment_score: 5.0,
            relevance: 8.5, // MarketWatch is finance-focused so higher relevance
            category: 'GENERAL',
            impact_score: 6.0
          });
        }
      });

      return this.analyzeSentiment(articles);
    } catch (error) {
      console.error(`Error scraping MarketWatch news for ${ticker}:`, error);
      return [];
    }
  }

  private parseTimeText(timeText: string): Date {
    const now = new Date();
    
    // MarketWatch uses formats like "4:10p ET" or "Jan. 3, 2025"
    if (timeText.includes('ET')) {
      const timeMatch = timeText.match(/(\d{1,2}):(\d{2})([ap])/);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1], 10);
        const minutes = parseInt(timeMatch[2], 10);
        const period = timeMatch[3];
        
        if (period === 'p' && hours < 12) hours += 12;
        if (period === 'a' && hours === 12) hours = 0;
        
        const date = new Date();
        date.setHours(hours, minutes);
        return date;
      }
    }
    
    // Try parsing as full date
    const dateMatch = timeText.match(/([A-Za-z]+)\.?\s+(\d{1,2}),\s+(\d{4})/);
    if (dateMatch) {
      const month = this.parseMonth(dateMatch[1]);
      const day = parseInt(dateMatch[2], 10);
      const year = parseInt(dateMatch[3], 10);
      
      if (month && day && year) {
        return new Date(year, month, day);
      }
    }
    
    return now;
  }

  private parseMonth(monthStr: string): number {
    const months: Record<string, number> = {
      'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3,
      'may': 4, 'jun': 5, 'jul': 6, 'aug': 7,
      'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
    };
    return months[monthStr.toLowerCase().substring(0, 3)] || 0;
  }

  private analyzeSentiment(articles: NewsArticle[]): NewsArticle[] {
    // More sophisticated analysis for MarketWatch
    return articles.map(article => {
      const text = `${article.title} ${article.summary}`.toLowerCase();
      let sentimentScore = 5.0;
      let impactScore = article.impact_score || 5.0;
      let category = article.category;
      
      // Sentiment detection
      if (text.includes('upgrade') || text.includes('buy') || text.includes('outperform')) {
        sentimentScore += 2.5;
      }
      if (text.includes('downgrade') || text.includes('sell') || text.includes('underperform')) {
        sentimentScore -= 2.5;
      }
      if (text.includes('beat') || text.includes('exceed') || text.includes('surpass')) {
        sentimentScore += 1.5;
      }
      if (text.includes('miss') || text.includes('cut') || text.includes('reduce')) {
        sentimentScore -= 1.5;
      }
      
      // Category detection
      if (text.includes('earnings') || text.includes('results') || text.includes('quarter')) {
        category = 'EARNINGS';
        impactScore += 1.5;
      }
      if (text.includes('product') || text.includes('launch') || text.includes('release')) {
        category = 'PRODUCT';
        impactScore += 1.0;
      }
      if (text.includes('merger') || text.includes('acquisition') || text.includes('takeover')) {
        category = 'MERGERS';
        impactScore += 2.0;
      }
      if (text.includes('regulation') || text.includes('lawsuit') || text.includes('investigation')) {
        category = 'REGULATORY';
        impactScore += 1.5;
      }
      
      // Determine sentiment category
      let sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' = 'NEUTRAL';
      if (sentimentScore > 6.5) sentiment = 'POSITIVE';
      else if (sentimentScore < 3.5) sentiment = 'NEGATIVE';
      
      return {
        ...article,
        sentiment,
        sentiment_score: Math.max(0, Math.min(10, sentimentScore)),
        category,
        impact_score: Math.max(0, Math.min(10, impactScore))
      };
    });
  }
}