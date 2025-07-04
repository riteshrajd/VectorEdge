// components/MainContent.tsx
"use client";

import React, { useState } from "react";
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

const MainContent: React.FC<MainContentProps> = ({ selectedInstrument }) => {
  const [activeTab, setActiveTab] = useState<string>("overview");

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

  // Mock chart data - in real app this would come from API
  const chartData = Array.from({ length: 50 }, (_, i) => ({
    time: i,
    price: selectedInstrument.price + (Math.random() - 0.5) * 100,
  }));

  return (
    <div className="h-full w-full bg-void-900 flex justify-center">
      <div className="h-full w-full max-w-[1000px] min-w-[100px] flex-col text-white relative z-10 overflow-clip">
        {/* Header Section */}
        <div className="border-b border-void-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: selectedInstrument.color }}
              >
                {selectedInstrument.symbol.substring(0, 2)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {selectedInstrument.symbol}
                </h1>
                <p className="text-void-400 text-sm">
                  {selectedInstrument.name}
                </p>
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
              <div className="text-3xl font-bold text-white mb-1">
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
                className={`flex items-center space-x-2 ${changeData.colorClass}`}
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

            {/* Key Metrics */}
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
        <div className="border-b border-void-800">
          <div className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-void-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 h-full p-6 overflow-y-scroll">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Chart Placeholder */}
              <div className="bg-void-900 rounded-lg p-6 h-96">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Price Chart
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                      1D
                    </button>
                    <button className="px-3 py-1 bg-void-700 text-void-300 rounded text-sm hover:bg-void-600">
                      1W
                    </button>
                    <button className="px-3 py-1 bg-void-700 text-void-300 rounded text-sm hover:bg-void-600">
                      1M
                    </button>
                    <button className="px-3 py-1 bg-void-700 text-void-300 rounded text-sm hover:bg-void-600">
                      1Y
                    </button>
                    <button className="p-1 hover:bg-void-700 rounded">
                      <Maximize2 className="w-4 h-4 text-void-400" />
                    </button>
                  </div>
                </div>

                {/* Simple chart visualization */}
                <div className="h-full flex items-end space-x-1">
                  {chartData.map((point, index) => (
                    <div
                      key={index}
                      className="bg-blue-500 w-2 opacity-70 hover:opacity-100 transition-opacity"
                      style={{
                        height: `${Math.max(
                          10,
                          (point.price / selectedInstrument.price) * 100
                        )}%`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-void-900 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-void-400 text-sm">Open</div>
                      <div className="text-xl font-semibold">
                        {selectedInstrument.symbol.includes("USD") ||
                        selectedInstrument.symbol.includes("SPX")
                          ? `$${selectedInstrument.open.toLocaleString()}`
                          : `₹${selectedInstrument.open.toLocaleString()}`}
                      </div>
                    </div>
                    <DollarSign className="w-6 h-6 text-void-400" />
                  </div>
                </div>

                <div className="bg-void-900 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-void-400 text-sm">
                        Previous Close
                      </div>
                      <div className="text-xl font-semibold">
                        {selectedInstrument.symbol.includes("USD") ||
                        selectedInstrument.symbol.includes("SPX")
                          ? `$${selectedInstrument.previousClose.toLocaleString()}`
                          : `₹${selectedInstrument.previousClose.toLocaleString()}`}
                      </div>
                    </div>
                    <Clock className="w-6 h-6 text-void-400" />
                  </div>
                </div>

                {selectedInstrument.pe > 0 && (
                  <div className="bg-void-900 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-void-400 text-sm">P/E Ratio</div>
                        <div className="text-xl font-semibold">
                          {selectedInstrument.pe.toFixed(1)}
                        </div>
                      </div>
                      <Percent className="w-6 h-6 text-void-400" />
                    </div>
                  </div>
                )}

                <div className="bg-void-900 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-void-400 text-sm">Sector</div>
                      <div className="text-xl font-semibold">
                        {selectedInstrument.sector}
                      </div>
                    </div>
                    <Building2 className="w-6 h-6 text-void-400" />
                  </div>
                </div>
              </div>

              {/* Additional Info for Futures */}
              {"expiryDate" in selectedInstrument && (
                <div className="bg-void-900 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Futures Information
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-void-400 text-sm">Expiry Date</div>
                      <div className="font-medium">
                        {selectedInstrument.expiryDate}
                      </div>
                    </div>
                    <div>
                      <div className="text-void-400 text-sm">Contract Size</div>
                      <div className="font-medium">
                        {selectedInstrument.contractSize}
                      </div>
                    </div>
                    <div>
                      <div className="text-void-400 text-sm">Lot Size</div>
                      <div className="font-medium">
                        {selectedInstrument.lotSize}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
  );
};

export default MainContent;
