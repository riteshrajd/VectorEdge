<<<<<<< HEAD
// components/MainContent.tsx
=======
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  BarChart3,
  Activity,
  FileText,
  Users,
  Globe,
<<<<<<< HEAD
=======
  DollarSign,
  Clock,
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Star,
  Bell,
  Share2,
<<<<<<< HEAD
} from "lucide-react";
import { MainContentProps, Instrument, ChangeData } from "../types";
import TechnicalTab from "./main-content-tabs/TechnicalTab";
import FundamentalTab from "./main-content-tabs/FundamentalTab";
import NewsSentimentsTab from "./main-content-tabs/NewsSentimentsTab";
import OverviewTab from "./main-content-tabs/OverviewTab";
=======
  Volume2,
  Building2
} from 'lucide-react';
import { MainContentProps, Instrument, ChangeData } from '../types';
import OverviewTab from './Tabs/OverviewTab';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611

const MainContent: React.FC<MainContentProps> = ({ selectedInstrument }) => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isCompact, setIsCompact] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll handler for compact header
  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    const handleScroll = () => {
      const scrollTop = contentElement.scrollTop;
      // Enable compact mode after 50px scroll
      setIsCompact(scrollTop > 50);
    };

    contentElement.addEventListener("scroll", handleScroll);
    return () => contentElement.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset compact mode and scroll when instrument changes
  useEffect(() => {
    setIsCompact(false);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [selectedInstrument]);

  useEffect(() => {
    console.log(`useEffect ran`);
  }, []);

  // If no instrument is selected, show welcome screen
  if (!selectedInstrument) {
    return (
<<<<<<< HEAD
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-void-800 rounded-full flex items-center justify-center">
            <BarChart3 className="w-12 h-12 text-void-500" />
=======
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <BarChart3 className="w-12 h-12 text-muted-foreground" />
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4 font-quicksand">
            Welcome to VectorEdge Pro
          </h2>
<<<<<<< HEAD
          <p className="text-void-400 max-w-md mx-auto">
            Select an instrument from the sidebar to view detailed analysis,
            charts, and market data.
=======
          <p className="text-muted-foreground leading-relaxed">
            Select an instrument from the sidebar to view detailed analysis, charts, and market data with our advanced trading tools.
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
          </p>
        </div>
      </div>
    );
  }

  // Format change data with color
  const formatChange = (change: number, changePercent: number): ChangeData => {
    const isPositive = change >= 0;
    return {
<<<<<<< HEAD
      change: `${isPositive ? "+" : ""}${change.toFixed(2)}`,
      changePercent: `${isPositive ? "+" : ""}${changePercent.toFixed(2)}%`,
      colorClass: isPositive ? "text-green-400" : "text-red-400",
=======
      change: `${isPositive ? '+' : ''}${change.toFixed(2)}`,
      changePercent: `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%`,
      colorClass: isPositive ? 'text-green-500' : 'text-red-500'
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
    };
  };

  const changeData = formatChange(
    selectedInstrument.change,
    selectedInstrument.changePercent
  );

  // Tabs configuration
  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "technical", label: "Technical Analysis", icon: Activity },
    { id: "fundamental", label: "Fundamental Analysis", icon: FileText },
    { id: "news", label: "News & Sentiments", icon: Globe },
    { id: "social", label: "Social Signals", icon: Users },
  ];

  return (
<<<<<<< HEAD
    <div className="h-full w-full flex justify-center">
      <div className="h-full w-full max-w-[1000px] min-w-[100px] flex flex-col z-10">
        {/* Sticky Header Section */}
        <div
          className={`sticky top-0 z-20 backdrop-blur-2xl bg-amber-50/5 rounded-b-2xl transition-all duration-300 ${
            isCompact ? "py-2 shadow-lg" : "py-4"
          }`}
        >
          <div className="px-6 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`rounded-full flex items-center justify-center text-white font-bold ${
                    isCompact ? "w-8 h-8 text-sm" : "w-12 h-12 text-lg"
                  }`}
                  style={{ backgroundColor: selectedInstrument.color }}
                >
                  {selectedInstrument.symbol.substring(0, 2)}
                </div>
                <div>
                  <h1
                    className={`font-bold text-white ${
                      isCompact ? "text-lg" : "text-2xl"
                    }`}
                  >
                    {selectedInstrument.symbol}
                  </h1>
                  {!isCompact && (
                    <p className="text-void-400 text-sm">
                      {selectedInstrument.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-void-800 rounded-lg transition-colors">
                  <Star className="w-5 h-5 text-void-400 hover:text-yellow-400" />
                </button>
                <button className="p-2 hover:bg-void-800 rounded-lg transition-colors">
                  <Bell className="w-5 h-5 text-void-400" />
                </button>
                <button className="p-2 hover:bg-void-800 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5 text-void-400" />
                </button>
                <button className="p-2 hover:bg-void-800 rounded-lg transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-void-400" />
                </button>
              </div>
            </div>

            {/* Price Information */}
            <div className="flex items-center space-x-8 mt-2">
              <div>
                <div
                  className={`font-bold text-white ${
                    isCompact ? "text-lg" : "text-2xl"
                  }`}
                >
                  {selectedInstrument.symbol.includes("USD") ||
                  selectedInstrument.symbol.includes("SPX")
                    ? `$${selectedInstrument.price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}`
                    : `₹${selectedInstrument.price.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}`}
                </div>
                <div
                  className={`flex items-center space-x-2 ${changeData.colorClass} ${
                    isCompact ? "text-xs" : "text-sm"
                  }`}
                >
                  {selectedInstrument.change >= 0 ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  <span className="font-medium">
                    {changeData.change} ({changeData.changePercent})
                  </span>
                </div>
              </div>

              {/* Key Metrics - Hidden in compact mode */}
              {!isCompact && (
                <div className="grid grid-cols-4 gap-6 text-sm">
                  <div>
                    <div className="text-void-400">High</div>
                    <div className="font-medium">
                      {selectedInstrument.symbol.includes("USD") ||
                      selectedInstrument.symbol.includes("SPX")
                        ? `$${selectedInstrument.high.toLocaleString()}`
                        : `₹${selectedInstrument.high.toLocaleString()}`}
                    </div>
                  </div>
                  <div>
                    <div className="text-void-400">Low</div>
                    <div className="font-medium">
                      {selectedInstrument.symbol.includes("USD") ||
                      selectedInstrument.symbol.includes("SPX")
                        ? `$${selectedInstrument.low.toLocaleString()}`
                        : `₹${selectedInstrument.low.toLocaleString()}`}
                    </div>
                  </div>
                  <div>
                    <div className="text-void-400">Volume</div>
                    <div className="font-medium">
                      {selectedInstrument.volume}
                    </div>
                  </div>
                  <div>
                    <div className="text-void-400">Market Cap</div>
                    <div className="font-medium">
                      {selectedInstrument.marketCap}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div
            className={`border-t border-void-800 px-6 transition-all duration-300 ${
              isCompact ? "py-1" : "py-3"
            }`}
          >
            <div className="flex space-x-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1 px-1 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-400"
                        : "border-transparent text-void-400 hover:text-white"
                    } ${isCompact ? "py-1 text-sm" : "py-2 text-base"}`}
                  >
                    <Icon className={`w-4 h-4 ${isCompact ? "w-3 h-3" : ""}`} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto bg-void-900"
          style={{ minHeight: "calc(100vh - 200px)" }} // Ensure enough scrollable height
        >
          <div className="p-6">
            {activeTab === "overview" && (
              <OverviewTab instrument={selectedInstrument} />
            )}
            {activeTab === "technical" && (
              <TechnicalTab instrument={selectedInstrument} />
            )}
            {activeTab === "fundamental" && (
              <FundamentalTab instrument={selectedInstrument} />
            )}
            {activeTab === "news" && (
              <NewsSentimentsTab instrument={selectedInstrument} />
            )}
            {activeTab === "social" && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-void-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-void-400 mb-2">
                  Social Signals
                </h3>
                <p className="text-void-500">
                  Social media sentiment and signals will be displayed here.
                </p>
              </div>
            )}
          </div>
=======
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
>>>>>>> 83434d5ea574734c562d2d820931a0f62c6b4611
        </div>
      </div>
    </div>
  );
};

export default MainContent;
