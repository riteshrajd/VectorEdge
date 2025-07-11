// File path: /lib/scrapers/news/cnbc-news.ts

import { BaseScraper } from '../core/base-scraper';
import { NewsArticle } from '../core/data-models';

export class CNBCNewsScraper extends BaseScraper {
  constructor() {
    super(2); // CNBC allows moderate scraping
  }

  async getNewsArticles(ticker: string, maxArticles: number = 10): Promise<NewsArticle[]> {
    try {
      const $ = await this.fetchHTML(`https://www.cnbc.com/quotes/${ticker}`);
      const articles: NewsArticle[] = [];

      // Extract news items from CNBC quote page
      $('div.Card-standardBreakerCard').each((i, element) => {
        if (articles.length >= maxArticles) return;
        
        const title = $(element).find('a.Card-title').text().trim();
        const url = $(element).find('a.Card-title').attr('href') || '';
        const timeText = $(element).find('time').text().trim();
        const source = 'CNBC';
        
        if (title && url) {
          const publishedDate = this.parseTimeText(timeText);
          const fullUrl = url.startsWith('http') ? url : `https://www.cnbc.com${url}`;
          
          articles.push({
            title,
            summary: '', // CNBC doesn't provide summaries on this page
            source,
            published_date: publishedDate.toISOString(),
            url: fullUrl,
            sentiment: 'NEUTRAL',
            sentiment_score: 5.0,
            relevance: 9.0, // CNBC is highly relevant for financial news
            category: 'GENERAL',
            impact_score: 7.0
          });
        }
      });

      // Fetch summaries for each article
      return this.enrichArticles(articles);
    } catch (error) {
      console.error(`Error scraping CNBC news for ${ticker}:`, error);
      return [];
    }
  }

  private parseTimeText(timeText: string): Date {
    // CNBC uses formats like "2 Hours Ago" or "2023-12-15"
    const now = new Date();
    
    if (timeText.includes('Hour')) {
      const hours = parseInt(timeText.replace(/\D/g, ''), 10) || 0;
      return new Date(now.getTime() - hours * 3600000);
    }
    
    if (timeText.includes('Minute')) {
      const minutes = parseInt(timeText.replace(/\D/g, ''), 10) || 0;
      return new Date(now.getTime() - minutes * 60000);
    }
    
    if (timeText.includes('Day')) {
      // Fixed regex syntax - added missing slashes
      const days = parseInt(timeText.replace(/\D/g, ''), 10) || 0;
      return new Date(now.getTime() - days * 86400000);
    }
    
    // Try parsing as ISO date
    if (/^\d{4}-\d{2}-\d{2}$/.test(timeText)) {
      return new Date(timeText);
    }
    
    return now;
  }

  private async enrichArticles(articles: NewsArticle[]): Promise<NewsArticle[]> {
    // Fetch each article to get the full content and summary
    const enrichedArticles = [];
    
    for (const article of articles) {
      try {
        const $ = await this.fetchHTML(article.url);
        const summary = $('div.group p').first().text().trim().substring(0, 200) + '...';
        
        enrichedArticles.push({
          ...article,
          summary,
          // Additional processing can be done here
        });
      } catch (error) {
        console.error(`Error fetching article ${article.url}:`, error);
        enrichedArticles.push(article); // Keep without summary
      }
    }
    
    return this.analyzeSentiment(enrichedArticles);
  }

  private analyzeSentiment(articles: NewsArticle[]): NewsArticle[] {
    // CNBC-specific sentiment analysis
    return articles.map(article => {
      const text = `${article.title} ${article.summary}`.toLowerCase();
      let sentimentScore = 5.0;
      
      // CNBC often includes analyst ratings in titles
      if (text.includes('upgrades') || text.includes('initiates buy')) {
        sentimentScore += 3.0;
      } else if (text.includes('downgrades') || text.includes('initiates sell')) {
        sentimentScore -= 3.0;
      }
      
      // Earnings reports
      if (text.includes('beats estimates')) {
        sentimentScore += 2.0;
      } else if (text.includes('misses estimates')) {
        sentimentScore -= 2.0;
      }
      
      // Market reactions
      if (text.includes('jumps') || text.includes('surges') || text.includes('soars')) {
        sentimentScore += 1.5;
      } else if (text.includes('drops') || text.includes('plunges') || text.includes('tumbles')) {
        sentimentScore -= 1.5;
      }
      
      // Determine sentiment category
      let sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' = 'NEUTRAL';
      if (sentimentScore > 6.5) sentiment = 'POSITIVE';
      else if (sentimentScore < 3.5) sentiment = 'NEGATIVE';
      
      return {
        ...article,
        sentiment,
        sentiment_score: Math.max(0, Math.min(10, sentimentScore))
      };
    });
  }
}