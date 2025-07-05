// components/MainContent.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  FileText,
  Users,
  Globe,
  Calendar,
  DollarSign,
  Percent,
  Volume2,
  Building2,
  Clock,
  ArrowUp,
  ArrowDown,
  Maximize2,
  MoreHorizontal,
  Star,
  Bell,
  Share2,
} from "lucide-react";
import { MainContentProps, Instrument, ChangeData } from "../types";
import TechnicalTab from "./main-content-tabs/TechnicalTab";
import FundamentalTab from "./main-content-tabs/FundamentalTab";
import NewsSentimentsTab from "./main-content-tabs/NewsSentimentsTab";
import Image from "next/image";
import OverviewTab from "./main-content-tabs/OverviewTab";

const MainContent: React.FC<MainContentProps> = ({ selectedInstrument }) => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle scroll to transform header
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const scrollTop = contentRef.current.scrollTop;
        const shouldBeCompact = scrollTop > 10; // Transform after 50px of scroll
        
        if (shouldBeCompact !== isHeaderCompact) {
          setIsHeaderCompact(shouldBeCompact);
        }
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener("scroll", handleScroll);
      return () => contentElement.removeEventListener("scroll", handleScroll);
    }
  }, [isHeaderCompact]);

  // Reset header state when tab changes
  useEffect(() => {
    setIsHeaderCompact(false);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  // If no instrument is selected, show welcome screen
  if (!selectedInstrument) {
    return (
      <div className="h-full flex items-center justify-center">
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

  // Mock chart data - in real app this would come from API
  const chartData = Array.from({ length: 50 }, (_, i) => ({
    time: i,
    price: selectedInstrument.price + (Math.random() - 0.5) * 100,
  }));

  return (
    <div className="h-full w-full flex justify-center">
      <div className="h-full w-full max-w-[1000px] min-w-[100px] flex flex-col text-white relative z-10 overflow-hidden">
        {/* Animated Header Section */}
        <div 
          className={`border-b border-void-800 flex-shrink-0 transition-all duration-300 ease-in-out ${
            isHeaderCompact ? 'p-3' : 'p-6'
          }`}
        >
          <div className={`flex items-center justify-between transition-all duration-300 ease-in-out ${
            isHeaderCompact ? 'space-y-0' : 'mb-4'
          }`}>
            {/* Left: Symbol and Info */}
            <div className={`flex items-center transition-all duration-300 ease-in-out ${
              isHeaderCompact ? 'space-x-3' : 'space-x-4'
            }`}>
              <div
                className={`rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 ease-in-out ${
                  isHeaderCompact 
                    ? 'w-8 h-8 text-xs' 
                    : 'w-12 h-12 text-sm'
                }`}
                style={{ backgroundColor: selectedInstrument.color }}
              >
                {selectedInstrument.symbol.substring(0, 2)}
              </div>
              <div className={`transition-all duration-300 ease-in-out ${
                isHeaderCompact ? 'flex items-center space-x-4' : 'block'
              }`}>
                <div>
                  <h1 className={`font-bold text-white leading-tight transition-all duration-300 ease-in-out ${
                    isHeaderCompact ? 'text-lg' : 'text-2xl'
                  }`}>
                    {selectedInstrument.symbol}
                  </h1>
                  <p className={`text-void-400 transition-all duration-300 ease-in-out ${
                    isHeaderCompact ? 'text-xs' : 'text-sm'
                  }`}>
                    {selectedInstrument.name}
                  </p>
                </div>
                
                {/* Price info - moves inline when compact */}
                <div className={`transition-all duration-300 ease-in-out ${
                  isHeaderCompact ? 'flex items-center space-x-3' : 'mt-2'
                }`}>
                  <div className={`font-bold text-white transition-all duration-300 ease-in-out ${
                    isHeaderCompact ? 'text-lg' : 'text-3xl mb-1'
                  }`}>
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
                    className={`flex items-center space-x-1 transition-all duration-300 ease-in-out ${changeData.colorClass}`}
                  >
                    {selectedInstrument.change >= 0 ? (
                      <ArrowUp className={`transition-all duration-300 ease-in-out ${
                        isHeaderCompact ? 'w-3 h-3' : 'w-4 h-4'
                      }`} />
                    ) : (
                      <ArrowDown className={`transition-all duration-300 ease-in-out ${
                        isHeaderCompact ? 'w-3 h-3' : 'w-4 h-4'
                      }`} />
                    )}
                    <span className={`font-medium transition-all duration-300 ease-in-out ${
                      isHeaderCompact ? 'text-sm' : 'text-base'
                    }`}>
                      {changeData.change} ({changeData.changePercent})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex items-center transition-all duration-300 ease-in-out ${
              isHeaderCompact ? 'space-x-1' : 'space-x-2'
            }`}>
              <button className={`hover:bg-void-800 rounded-lg transition-all duration-300 ease-in-out ${
                isHeaderCompact ? 'p-1.5' : 'p-2'
              }`}>
                <Star className={`text-void-400 hover:text-yellow-400 transition-all duration-300 ease-in-out ${
                  isHeaderCompact ? 'w-4 h-4' : 'w-5 h-5'
                }`} />
              </button>
              <button className={`hover:bg-void-800 rounded-lg transition-all duration-300 ease-in-out ${
                isHeaderCompact ? 'p-1.5' : 'p-2'
              }`}>
                <Bell className={`text-void-400 transition-all duration-300 ease-in-out ${
                  isHeaderCompact ? 'w-4 h-4' : 'w-5 h-5'
                }`} />
              </button>
              <button className={`hover:bg-void-800 rounded-lg transition-all duration-300 ease-in-out ${
                isHeaderCompact ? 'p-1.5' : 'p-2'
              }`}>
                <Share2 className={`text-void-400 transition-all duration-300 ease-in-out ${
                  isHeaderCompact ? 'w-4 h-4' : 'w-5 h-5'
                }`} />
              </button>
              <button className={`hover:bg-void-800 rounded-lg transition-all duration-300 ease-in-out ${
                isHeaderCompact ? 'p-1.5' : 'p-2'
              }`}>
                <MoreHorizontal className={`text-void-400 transition-all duration-300 ease-in-out ${
                  isHeaderCompact ? 'w-4 h-4' : 'w-5 h-5'
                }`} />
              </button>
            </div>
          </div>

          {/* Key Metrics - Hidden when compact, shown when expanded */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isHeaderCompact 
              ? 'max-h-0 opacity-0 transform -translate-y-2' 
              : 'max-h-20 opacity-100 transform translate-y-0'
          }`}>
            <div className="flex items-center space-x-8 text-sm pt-2">
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
                <div className="font-medium">{selectedInstrument.volume}</div>
              </div>
              <div>
                <div className="text-void-400">Market Cap</div>
                <div className="font-medium">
                  {selectedInstrument.marketCap}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-void-800 flex-shrink-0">
          <div className={`flex transition-all duration-300 ease-in-out ${
            isHeaderCompact ? 'space-x-4 px-4' : 'space-x-8 px-6'
          }`}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 border-b-2 transition-all duration-300 ease-in-out ${
                    isHeaderCompact ? 'py-2 px-1' : 'py-4 px-1'
                  } ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-void-400 hover:text-white"
                  }`}
                >
                  <Icon className={`transition-all duration-300 ease-in-out ${
                    isHeaderCompact ? 'w-3 h-3' : 'w-4 h-4'
                  }`} />
                  <span className={`font-medium transition-all duration-300 ease-in-out ${
                    isHeaderCompact ? 'text-xs' : 'text-sm'
                  }`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto p-6 scroll-smooth"
          style={{ scrollBehavior: 'smooth' }}
        >
          {activeTab === "overview" && (
            <div>
              <OverviewTab instrument={selectedInstrument} />
              <div className="mt-6">
                <FundamentalTab instrument={selectedInstrument} />
              </div>
              <div className="mt-6">
                <FundamentalTab instrument={selectedInstrument} />
              </div>
              <div className="mt-6">
                <FundamentalTab instrument={selectedInstrument} />
              </div>
            </div>
          )}

          {activeTab === "technical" && (
            <div>
              <TechnicalTab instrument={selectedInstrument} />
              <div className="mt-6">
                <FundamentalTab instrument={selectedInstrument} />
              </div>
              <div className="mt-6">
                <FundamentalTab instrument={selectedInstrument} />
              </div>
              <div className="mt-6">
                <FundamentalTab instrument={selectedInstrument} />
              </div>
            </div>
          )}

          {activeTab === "fundamental" && (
            <div>
              <FundamentalTab instrument={selectedInstrument} />
              <div className="mt-6">
                <FundamentalTab instrument={selectedInstrument} />
              </div>
              <div className="mt-6">
                <FundamentalTab instrument={selectedInstrument} />
              </div>
              <div className="mt-6">
                <FundamentalTab instrument={selectedInstrument} />
              </div>
            </div>
          )}

          {activeTab === "news" && (
            <div>
              <NewsSentimentsTab instrument={selectedInstrument} />
              <div className="mt-6">
                <FundamentalTab instrument={selectedInstrument} />
              </div>
              <div className="mt-6">
                <FundamentalTab instrument={selectedInstrument} />
              </div>
              <div className="mt-6">
                <FundamentalTab instrument={selectedInstrument} />
              </div>
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
  );
};

export default MainContent;