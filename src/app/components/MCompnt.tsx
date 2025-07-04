// components/MainContent.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  BarChart3,
  Activity,
  FileText,
  Users,
  Globe,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Star,
  Bell,
  Share2,
} from "lucide-react";
import { MainContentProps, Instrument, ChangeData } from "../types";
import TechnicalTab from "./main-content-tabs/TechnicalTab";
import FundamentalTab from "./main-content-tabs/FundamentalTab";
import NewsSentimentsTab from "./main-content-tabs/NewsSentimentsTab";
import OverviewTab from "./main-content-tabs/OverviewTab";

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

  // Reset compact mode when instrument changes
  useEffect(() => {
    setIsCompact(false);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [selectedInstrument]);

  useEffect(() => {
    console.log(`useEffect ran`);
  }, [])


  // If no instrument is selected, show welcome screen
  if (!selectedInstrument) {
    return (
      <div className="h-full flex items-center justify-center bg-void-950">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-void-800 rounded-full flex items-center justify-center">
            <BarChart3 className="w-12 h-12 text-void-500" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Welcome to Trading Dashboard
          </h2>
          <p className="text-void-400 max-w-md mx-auto">
            Select an instrument from the sidebar to view detailed analysis,
            charts, and market data.
          </p>
        </div>
      </div>
    );
  }

  // Format change data with color
  const formatChange = (change: number, changePercent: number): ChangeData => {
    const isPositive = change >= 0;
    return {
      change: `${isPositive ? "+" : ""}${change.toFixed(2)}`,
      changePercent: `${isPositive ? "+" : ""}${changePercent.toFixed(2)}%`,
      colorClass: isPositive ? "text-green-400" : "text-red-400",
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
    <div className="h-full w-full bg-void-900 flex justify-center">
      <div className="h-full w-full max-w-[1000px] min-w-[100px] flex flex-col relative z-10">
        {/* Sticky Header Section */}
        <div 
          className={`sticky top-0 z-20 bg-void-900 transition-all duration-300 ${
            isCompact ? "border-b border-void-800 shadow-lg" : ""
          }`}
        >
          <div 
            className={`transition-all duration-300 ${
              isCompact ? "p-3" : "p-6 border-b border-void-800"
            }`}
          >
            <div className={`flex items-center justify-between ${isCompact ? "mb-2" : "mb-4"}`}>
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
                  <h1 className={`font-bold text-white ${isCompact ? "text-lg" : "text-2xl"}`}>
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
            <div className="flex items-center space-x-8">
              <div>
                <div className={`font-bold text-white ${isCompact ? "text-xl" : "text-3xl mb-1"}`}>
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
                    isCompact ? "text-sm" : ""
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
          <div className="border-b border-void-800">
            <div className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-1 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-400"
                        : "border-transparent text-void-400 hover:text-white"
                    } ${isCompact ? "py-2" : "py-4"}`}
                  >
                    <Icon className="w-4 h-4" />
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
          className="flex-1 overflow-y-auto"
        >
          <div className="p-6">
            {activeTab === "overview" && (
              <OverviewTab instrument={selectedInstrument} />
            )}
            {activeTab === "technical" && (
              <div className="text-center py-12">
                <TechnicalTab instrument={selectedInstrument} />
              </div>
            )}
            {activeTab === "fundamental" && (
              <div className="text-center py-12">
                <FundamentalTab instrument={selectedInstrument} />
              </div>
            )}
            {activeTab === "news" && (
              <div className="text-center py-12">
                <NewsSentimentsTab instrument={selectedInstrument} />
              </div>
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
        </div>
      </div>
    </div>
  );
};

export default MainContent;
