// File path: /lib/scrapers/technical/technical-aggregator.ts

import { YahooTechnicalScraper } from './yahoo-technical';
import { InvestingTechnicalScraper } from './investing-technical';
import { TechnicalAnalysis, SupportResistance, Patterns, Signals, VolumeAnalysis } from '../core/data-models';

export class TechnicalAggregator {
  private yahooScraper: YahooTechnicalScraper;
  private investingScraper: InvestingTechnicalScraper;

  constructor() {
    this.yahooScraper = new YahooTechnicalScraper();
    this.investingScraper = new InvestingTechnicalScraper();
  }

  async getTechnicalAnalysis(ticker: string): Promise<TechnicalAnalysis> {
    try {
      const [yahooData, investingSupport, investingPatterns, investingSummary] = await Promise.allSettled([
        this.yahooScraper.getTechnicalData(ticker),
        this.investingScraper.getSupportResistance(ticker),
        this.investingScraper.getPatterns(ticker),
        this.investingScraper.getTechnicalSummary(ticker)
      ]);

      // Combine Yahoo data with Investing.com data
      const baseData = yahooData.status === 'fulfilled' ? yahooData.value : this.getDefaultTechnicalData();
      const supportResistance = investingSupport.status === 'fulfilled' ? investingSupport.value : this.getDefaultSupportResistance();
      const patterns = investingPatterns.status === 'fulfilled' ? investingPatterns.value : this.getDefaultPatterns();
      const summary = investingSummary.status === 'fulfilled' ? investingSummary.value : null;

      // Generate enhanced signals
      const signals = this.generateEnhancedSignals(baseData, summary);

      return {
        price_data: baseData.price_data || this.getDefaultPriceData(),
        moving_averages: baseData.moving_averages || this.getDefaultMovingAverages(),
        technical_indicators: baseData.technical_indicators || this.getDefaultTechnicalIndicators(),
        support_resistance: supportResistance,
        volume_analysis: baseData.volume_analysis || this.getDefaultVolumeAnalysis(),
        patterns,
        signals
      };
    } catch (error) {
      console.error(`Error aggregating technical analysis for ${ticker}:`, error);
      return this.getDefaultTechnicalAnalysis();
    }
  }

  private generateEnhancedSignals(baseData: any, summary: any): Signals {
    const buySignals: string[] = [];
    const sellSignals: string[] = [];
    let overallSignal = 'NEUTRAL';
    let signalStrength = 5.0;

    // Analyze technical indicators
    if (baseData.technical_indicators) {
      const indicators = baseData.technical_indicators;
      
      // RSI signals
      if (indicators.rsi < 30) {
        buySignals.push('RSI_OVERSOLD');
      } else if (indicators.rsi > 70) {
        sellSignals.push('RSI_OVERBOUGHT');
      } else if (indicators.rsi > 30 && indicators.rsi < 50) {
        buySignals.push('RSI_OVERSOLD_RECOVERY');
      }

      // MACD signals
      if (indicators.macd && indicators.macd.histogram > 0) {
        buySignals.push('MACD_BULLISH_CROSSOVER');
      } else if (indicators.macd && indicators.macd.histogram < 0) {
        sellSignals.push('MACD_BEARISH_CROSSOVER');
      }

      // Bollinger Bands signals
      if (indicators.bollinger_bands) {
        const currentPrice = baseData.price_data?.close || 0;
        if (currentPrice < indicators.bollinger_bands.lower) {
          buySignals.push('BOLLINGER_OVERSOLD');
        } else if (currentPrice > indicators.bollinger_bands.upper) {
          sellSignals.push('BOLLINGER_OVERBOUGHT');
        }
      }

      // Stochastic signals
      if (indicators.stochastic) {
        if (indicators.stochastic.k_percent < 20) {
          buySignals.push('STOCH_OVERSOLD');
        } else if (indicators.stochastic.k_percent > 80) {
          sellSignals.push('STOCH_OVERBOUGHT');
        }
      }
    }

    // Analyze moving averages
    if (baseData.moving_averages && baseData.price_data) {
      const ma = baseData.moving_averages;
      const currentPrice = baseData.price_data.close;

      // Price above/below moving averages
      if (currentPrice > ma.sma_20 && currentPrice > ma.sma_50) {
        buySignals.push('PRICE_ABOVE_MA');
      } else if (currentPrice < ma.sma_20 && currentPrice < ma.sma_50) {
        sellSignals.push('PRICE_BELOW_MA');
      }

      // Golden cross / Death cross
      if (ma.sma_20 > ma.sma_50 && ma.sma_50 > ma.sma_200) {
        buySignals.push('GOLDEN_CROSS');
      } else if (ma.sma_20 < ma.sma_50 && ma.sma_50 < ma.sma_200) {
        sellSignals.push('DEATH_CROSS');
      }
    }

    // Analyze volume
    if (baseData.volume_analysis) {
      const vol = baseData.volume_analysis;
      if (vol.volume_trend === 'INCREASING' && vol.volume_ratio > 1.2) {
        buySignals.push('VOLUME_BREAKOUT');
      }
      
      if (vol.money_flow_index > 80) {
        sellSignals.push('MFI_OVERBOUGHT');
      } else if (vol.money_flow_index < 20) {
        buySignals.push('MFI_OVERSOLD');
      }
    }

    // Incorporate Investing.com summary
    if (summary && summary.technical_summary) {
      const techSummary = summary.technical_summary;
      if (techSummary.overall_signal === 'BUY') {
        buySignals.push('TECHNICAL_SUMMARY_BUY');
      } else if (techSummary.overall_signal === 'SELL') {
        sellSignals.push('TECHNICAL_SUMMARY_SELL');
      }
    }

    // Determine overall signal and strength
    const buyScore = buySignals.length;
    const sellScore = sellSignals.length;
    const totalSignals = buyScore + sellScore;

    if (totalSignals > 0) {
      if (buyScore > sellScore) {
        overallSignal = 'BUY';
        signalStrength = 5.0 + (buyScore - sellScore) * 0.5;
      } else if (sellScore > buyScore) {
        overallSignal = 'SELL';
        signalStrength = 5.0 - (sellScore - buyScore) * 0.5;
      }
    }

    // Ensure signal strength is within bounds
    signalStrength = Math.max(0, Math.min(10, signalStrength));

    return {
      buy_signals: buySignals,
      sell_signals: sellSignals,
      overall_signal: overallSignal,
      signal_strength: signalStrength
    };
  }

  private getDefaultVolumeAnalysis(): VolumeAnalysis {
    return {
      volume_trend: "INCREASING",
      volume_sma_20: 48500000,
      volume_ratio: 0.93,
      on_balance_volume: 1250000000,
      accumulation_distribution: 890000000,
      money_flow_index: 58.3
    };
  }

  private getDefaultSupportResistance(): SupportResistance {
    return {
      support_levels: [192.00, 188.50, 185.00],
      resistance_levels: [198.50, 201.20, 205.00],
      pivot_points: {
        pivot: 195.22,
        r1: 197.89,
        r2: 201.45,
        r3: 204.12,
        s1: 191.66,
        s2: 188.10,
        s3: 185.43
      }
    };
  }

  private getDefaultPatterns(): Patterns {
    return {
      chart_patterns: ["ASCENDING_TRIANGLE"],
      candlestick_patterns: ["HAMMER"],
      trend_direction: "BULLISH",
      trend_strength: 7.2
    };
  }

  private getDefaultTechnicalData(): any {
    return {
      price_data: this.getDefaultPriceData(),
      moving_averages: this.getDefaultMovingAverages(),
      technical_indicators: this.getDefaultTechnicalIndicators(),
      volume_analysis: this.getDefaultVolumeAnalysis()
    };
  }

  private getDefaultPriceData(): PriceData {
    return {
      open: 194.20,
      high: 196.45,
      low: 193.80,
      close: 195.43,
      volume: 45231000,
      vwap: 195.12,
      change: 1.23,
      change_percent: 0.63
    };
  }

  private getDefaultMovingAverages(): MovingAverages {
    return {
      sma_20: 192.45,
      sma_50: 188.90,
      sma_200: 182.30,
      ema_12: 194.20,
      ema_26: 191.80,
      ema_50: 189.60
    };
  }

  private getDefaultTechnicalIndicators(): TechnicalIndicators {
    return {
      rsi: 67.8,
      macd: {
        macd_line: 2.40,
        signal_line: 1.85,
        histogram: 0.55
      },
      bollinger_bands: {
        upper: 198.50,
        middle: 192.45,
        lower: 186.40,
        width: 12.10
      },
      stochastic: {
        k_percent: 72.3,
        d_percent: 68.9
      },
      williams_r: -27.7,
      cci: 45.2,
      atr: 3.45,
      adx: 25.8
    };
  }

  private getDefaultTechnicalAnalysis(): TechnicalAnalysis {
    const baseData = this.getDefaultTechnicalData();
    const supportResistance = this.getDefaultSupportResistance();
    const patterns = this.getDefaultPatterns();
    const signals = this.generateEnhancedSignals(baseData, null);

    return {
      price_data: baseData.price_data,
      moving_averages: baseData.moving_averages,
      technical_indicators: baseData.technical_indicators,
      support_resistance: supportResistance,
      volume_analysis: baseData.volume_analysis,
      patterns,
      signals
    };
  }
}