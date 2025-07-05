// components/MainContent.tsx
"use client";

import React, { useState } from "react";
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

  // If no instrument is selected, show welcome screen
  if (!selectedInstrument) {
    return (
      <div className="h-full flex items-center justify-center bg-[var(--bg-main)]">
        <div className="text-center">
          <div 
            className="w-30 h-30 mx-auto mb-6 rounded-full flex items-center justify-center bg-[var(--bg-tertiary)]"
          >
            <BarChart3 className="w-16 h-16 text-[var(--text-muted)]" />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-[var(--text-primary)]">
            Welcome to Trading Dashboard
          </h2>
          <p className="max-w-md mx-auto text-[var(--text-secondary)]">
            Select an instrument from the sidebar to view detailed analysis,
            charts, and market data.
          </p>
        </div>
      </div>
    );
  }
  
  const formatChange = (change: number, changePercent: number): ChangeData => {
    const isPositive = change >= 0;
    return {
      change: `${isPositive ? "+" : ""}${change.toFixed(2)}`,
      changePercent: `${isPositive ? "+" : ""}${changePercent.toFixed(2)}%`,
      colorClass: isPositive ? "text-[var(--positive)]" : "text-[var(--negative)]",
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
    <div className="h-full w-full flex justify-center bg-[var(--bg-main)]">
      <div className="h-full w-full max-w-[1000px] min-w-[100px] flex flex-col relative z-10 overflow-hidden text-[var(--text-primary)]">
        {/* Compact Header Section */}
        <div 
          className="flex-shrink-0 p-3 border-b border-[var(--border)]"
          style={{ backgroundColor: 'var(--bg-primary)' }}
        >
          <div className="flex items-center justify-between">
            {/* Left: Symbol and Info */}
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                style={{ 
                  backgroundColor: selectedInstrument.color,
                  color: 'var(--text-primary)'
                }}
              >
                {selectedInstrument.symbol.substring(0, 2)}
              </div>
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-lg font-bold leading-tight">
                    {selectedInstrument.symbol}
                  </h1>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {selectedInstrument.name}
                  </p>
                </div>
                
                {/* Price info - inline layout */}
                <div className="flex items-center space-x-3">
                  <div className="text-lg font-bold">
                    {selectedInstrument.symbol.includes("USD") ||
                    selectedInstrument.symbol.includes("SPX")
                      ? `$${selectedInstrument.price.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}`
                      : `₹${selectedInstrument.price.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}`}
                  </div>
                  <div className={`flex items-center space-x-1 ${changeData.colorClass}`}>
                    {selectedInstrument.change >= 0 ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )}
                    <span className="text-sm font-medium">
                      {changeData.change} ({changeData.changePercent})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              <button 
                className="p-1.5 rounded-lg transition-colors duration-200 hover:bg-[var(--bg-hover)]"
              >
                <Star 
                  className="w-4 h-4 transition-colors duration-200 text-[var(--text-secondary)] hover:text-[var(--star-fill)]" 
                />
              </button>
              <button 
                className="p-1.5 rounded-lg transition-colors duration-200 hover:bg-[var(--bg-hover)]"
              >
                <Bell className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>
              <button 
                className="p-1.5 rounded-lg transition-colors duration-200 hover:bg-[var(--bg-hover)]"
              >
                <Share2 className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>
              <button 
                className="p-1.5 rounded-lg transition-colors duration-200 hover:bg-[var(--bg-hover)]"
              >
                <MoreHorizontal className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div 
          className="flex-shrink-0 border-b border-[var(--border)]"
          style={{ backgroundColor: 'var(--bg-primary)' }}
        >
          <div className="flex space-x-4 px-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 transition-colors duration-200 ${
                    isActive 
                      ? "border-[var(--accent-main)] text-[var(--accent-main)]" 
                      : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span className="text-xs font-medium">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 bg-[var(--bg-main)]">
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
              <Users className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" />
              <h3 className="text-xl font-semibold mb-2 text-[var(--text-secondary)]">
                Social Signals
              </h3>
              <p className="text-[var(--text-muted)]">
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