"use client";

import React, { useState, useEffect } from 'react';
import { 
  DollarSign,
  Clock,
  Building2, 
  Volume2,
  Maximize2,
} from 'lucide-react';
import { Instrument } from '../../types';
import { generateChartData, ChartData } from '../../data/expandedTradingData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OverviewTabProps {
  instrument: Instrument;
}

const TechnicalTab: React.FC<OverviewTabProps> = ({ instrument }) => {
  const [chartPeriod, setChartPeriod] = useState('1D');
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Initialize chart data on client side to avoid hydration mismatch
  useEffect(() => {
    setChartData(generateChartData(instrument.symbol));
  }, [instrument.symbol]);

  const formatPrice = (price: number) => {
    return instrument.symbol.includes('USD') || instrument.symbol.includes('SPX') 
      ? `$${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
      : `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const chartPeriods = ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'];
  
  // Get recent chart data based on period
  const getChartDataForPeriod = (period: string) => {
    const days = {
      '1D': 1,
      '1W': 7,
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365,
      'ALL': chartData.length
    }[period] || 30;
    
    return chartData.slice(-days);
  };

  const displayData = getChartDataForPeriod(chartPeriod);
  const maxPrice = displayData.length > 0 ? Math.max(...displayData.map(d => d.high)) : 0;
  const minPrice = displayData.length > 0 ? Math.min(...displayData.map(d => d.low)) : 0;
  const priceRange = maxPrice - minPrice;

  // Show loading state while chart data is being generated
  if (chartData.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Price Chart</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 relative bg-muted/20 rounded-lg p-4 flex items-center justify-center">
              <div className="text-muted-foreground">Loading chart data...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chart Section */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Price Chart</CardTitle>
            <div className="flex items-center space-x-2">
              <Tabs value={chartPeriod} onValueChange={setChartPeriod}>
                <TabsList className="bg-muted/50">
                  {chartPeriods.map((period) => (
                    <TabsTrigger
                      key={period}
                      value={period}
                      className="text-xs px-3 py-1"
                    >
                      {period}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Chart Visualization */}
          <div className="h-80 relative bg-muted/20 rounded-lg p-4">
            <div className="flex items-end justify-between h-full space-x-0.5">
              {displayData.map((point, index) => {
                const isGreen = point.close >= point.open;
                const bodyHeight = Math.abs(point.close - point.open) / priceRange * 100;
                const bodyBottom = ((Math.min(point.close, point.open) - minPrice) / priceRange) * 100;
                const wickTop = ((point.high - minPrice) / priceRange) * 100;
                const wickBottom = ((point.low - minPrice) / priceRange) * 100;
                
                return (
                  <div key={index} className="relative flex-1 min-w-0 group">
                    {/* Wick */}
                    <div 
                      className={`absolute w-0.5 left-1/2 transform -translate-x-1/2 ${
                        isGreen ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{
                        bottom: `${wickBottom}%`,
                        height: `${wickTop - wickBottom}%`
                      }}
                    />
                    {/* Body */}
                    <div 
                      className={`absolute w-full left-0 ${
                        isGreen ? 'bg-green-500' : 'bg-red-500'
                      } opacity-80 hover:opacity-100 transition-opacity cursor-pointer rounded-sm`}
                      style={{
                        bottom: `${bodyBottom}%`,
                        height: `${Math.max(bodyHeight, 1)}%`
                      }}
                      title={`Open: ${formatPrice(point.open)}, Close: ${formatPrice(point.close)}, High: ${formatPrice(point.high)}, Low: ${formatPrice(point.low)}`}
                    />
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                      <Card className="bg-popover text-popover-foreground text-xs p-2 whitespace-nowrap shadow-lg">
                        <div>O: {formatPrice(point.open)}</div>
                        <div>H: {formatPrice(point.high)}</div>
                        <div>L: {formatPrice(point.low)}</div>
                        <div>C: {formatPrice(point.close)}</div>
                        <div>V: {(point.volume / 1000000).toFixed(1)}M</div>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Price Scale */}
            <div className="absolute right-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground pr-2">
              <span>{formatPrice(maxPrice)}</span>
              <span>{formatPrice((maxPrice + minPrice) / 2)}</span>
              <span>{formatPrice(minPrice)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Open", value: formatPrice(instrument.open), icon: DollarSign },
          { label: "Previous Close", value: formatPrice(instrument.previousClose), icon: Clock },
          { label: "Volume", value: instrument.volume, icon: Volume2 },
          { label: "Market Cap", value: instrument.marketCap, icon: Building2 }
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="bg-muted/30 border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-muted-foreground text-sm">{label}</div>
                  <div className="text-xl font-semibold">{value}</div>
                </div>
                <Icon className="w-6 h-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Metrics */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "High (52W)", value: formatPrice(instrument.high * 1.15) },
              { label: "Low (52W)", value: formatPrice(instrument.low * 0.85) },
              ...(instrument.pe > 0 ? [
                { label: "P/E Ratio", value: instrument.pe.toFixed(1) },
                { label: "EPS", value: `₹${instrument.eps.toFixed(2)}` },
                { label: "Dividend Yield", value: `${instrument.dividend.toFixed(2)}%` }
              ] : []),
              { label: "Sector", value: instrument.sector }
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Market Summary */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Market Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Today's Range", value: `${formatPrice(instrument.low)} - ${formatPrice(instrument.high)}` },
              { label: "Average Volume", value: instrument.volume },
              { label: "Market Status", value: "Open", valueClass: "text-green-500" },
              { label: "Last Updated", value: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }
            ].map(({ label, value, valueClass }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-muted-foreground">{label}</span>
                <span className={`font-medium ${valueClass || ''}`}>{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Performance */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            {[
              { period: "1 Week", change: (instrument.change * 1.2).toFixed(2) },
              { period: "1 Month", change: (instrument.change * 2.5).toFixed(2) },
              { period: "1 Year", change: (instrument.change * 8.2).toFixed(2) }
            ].map(({ period, change }) => (
              <div key={period} className="text-center">
                <div className="text-muted-foreground text-sm">{period}</div>
                <div className={`text-lg font-semibold ${
                  parseFloat(change) >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {parseFloat(change) >= 0 ? '+' : ''}{change}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicalTab;