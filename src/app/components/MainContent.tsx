"use client";

import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Activity, 
  FileText, 
  Users, 
  Globe,
  DollarSign,
  Clock,
  ArrowUp,
  ArrowDown,
  Maximize2,
  MoreHorizontal,
  Star,
  Bell,
  Share2,
  Volume2,
  Building2
} from 'lucide-react';
import { MainContentProps, Instrument, ChangeData } from '../types';
import OverviewTab from './Tabs/OverviewTab';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const MainContent: React.FC<MainContentProps> = ({ selectedInstrument }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  // If no instrument is selected, show welcome screen
  if (!selectedInstrument) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <BarChart3 className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4 font-quicksand">
            Welcome to VectorEdge Pro
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Select an instrument from the sidebar to view detailed analysis, charts, and market data with our advanced trading tools.
          </p>
        </div>
      </div>
    );
  }

  // Format change data with color
  const formatChange = (change: number, changePercent: number): ChangeData => {
    const isPositive = change >= 0;
    return {
      change: `${isPositive ? '+' : ''}${change.toFixed(2)}`,
      changePercent: `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%`,
      colorClass: isPositive ? 'text-green-500' : 'text-red-500'
    };
  };

  const changeData = formatChange(selectedInstrument.change, selectedInstrument.changePercent);

  // Tabs configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'technical', label: 'Technical Analysis', icon: Activity },
    { id: 'fundamental', label: 'Fundamental Analysis', icon: FileText },
    { id: 'news', label: 'News & Sentiments', icon: Globe },
    { id: 'social', label: 'Social Signals', icon: Users }
  ];

  // Mock chart data - in real app this would come from API
  const chartData = Array.from({ length: 50 }, (_, i) => ({
    time: i,
    price: selectedInstrument.price + (Math.random() - 0.5) * 100
  }));

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-muted/20 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                style={{ backgroundColor: selectedInstrument.color }}
              >
                {selectedInstrument.symbol.substring(0, 2)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground font-quicksand">
                  {selectedInstrument.symbol}
                </h1>
                <p className="text-muted-foreground">
                  {selectedInstrument.name}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {[
                { icon: Star, tooltip: "Add to favorites" },
                { icon: Bell, tooltip: "Set alert" },
                { icon: Share2, tooltip: "Share" },
                { icon: MoreHorizontal, tooltip: "More options" }
              ].map(({ icon: Icon, tooltip }, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Icon className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Price Information */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div>
                <div className="text-4xl font-bold text-foreground mb-2 font-mono">
                  {selectedInstrument.symbol.includes('USD') || selectedInstrument.symbol.includes('SPX') 
                    ? `$${selectedInstrument.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
                    : `₹${selectedInstrument.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                  }
                </div>
                <div className={`flex items-center space-x-2 ${changeData.colorClass}`}>
                  {selectedInstrument.change >= 0 ? (
                    <ArrowUp className="w-5 h-5" />
                  ) : (
                    <ArrowDown className="w-5 h-5" />
                  )}
                  <span className="font-semibold text-lg">
                    {changeData.change} ({changeData.changePercent})
                  </span>
                </div>
              </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "High", value: selectedInstrument.high, icon: TrendingUp },
                { label: "Low", value: selectedInstrument.low, icon: TrendingDown },
                { label: "Volume", value: selectedInstrument.volume, icon: Volume2 },
                { label: "Market Cap", value: selectedInstrument.marketCap, icon: Building2 }
              ].map(({ label, value, icon: Icon }) => (
                <Card key={label} className="bg-muted/50 border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="font-semibold text-sm">
                          {typeof value === 'number' && label !== 'Volume' && label !== 'Market Cap'
                            ? (selectedInstrument.symbol.includes('USD') || selectedInstrument.symbol.includes('SPX') 
                                ? `$${value.toLocaleString()}` 
                                : `₹${value.toLocaleString()}`)
                            : value
                          }
                        </p>
                      </div>
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
          <TabsList className="grid w-full grid-cols-5 bg-muted/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="overview" className="mt-0">
              <OverviewTab instrument={selectedInstrument} />
            </TabsContent>

            <TabsContent value="technical" className="mt-0">
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Technical Analysis</h3>
                <p className="text-muted-foreground">Advanced technical indicators and chart analysis will be displayed here.</p>
              </div>
            </TabsContent>

            <TabsContent value="fundamental" className="mt-0">
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Fundamental Analysis</h3>
                <p className="text-muted-foreground">Company fundamentals and financial data will be displayed here.</p>
              </div>
            </TabsContent>

            <TabsContent value="news" className="mt-0">
              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">News & Sentiments</h3>
                <p className="text-muted-foreground">Latest news and market sentiment analysis will be displayed here.</p>
              </div>
            </TabsContent>

            <TabsContent value="social" className="mt-0">
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Social Signals</h3>
                <p className="text-muted-foreground">Social media sentiment and signals will be displayed here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MainContent;