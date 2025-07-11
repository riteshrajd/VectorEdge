"use client";

import React from "react";
import { Instrument } from "../../../types";
import TradingViewChart from "./technical-tab-components/TradingViewChart";
import TradingViewTechnicalAnalysisWidget from "./technical-tab-components/TradingViewTechnicalAnalysisWidget";
import TradingViewMarketOverviewWidget from "./technical-tab-components/TradingViewMarketOverviewWidget";
import TradingViewForexHeatMapWidget from "./technical-tab-components/TradingViewForexHeatMapWidget";
import TradingViewEconomicCalendarWidget from "./technical-tab-components/TradingViewEconomicCalendarWidget";
import KeyMetrics from "./technical-tab-components/KeyMetrics";
import MarketSummary from "./technical-tab-components/MarketSummary";
import RecentPerformance from "./technical-tab-components/RecentPerformance";

interface Props {
  instrument: Instrument;
}

const TechnicalTab: React.FC<Props> = ({ instrument }) => {
  return (
    <div className="space-y-10 p-4">
      {/* Main Chart */}
      <div className="bg-gray-800 rounded-md p-4 shadow-sm min-h-[500px]">
        <TradingViewChart symbol={instrument.symbol} />
      </div>

      {/* Technical Indicators */}
      <div className="bg-gray-800 rounded-md p-4 shadow-sm min-h-[600px]">
        <h3 className="text-lg font-semibold text-gray-100">Technical Indicators</h3>
        <TradingViewTechnicalAnalysisWidget
          symbol={instrument.symbol}
          interval="1D"
          showTabs={false}
        />
      </div>

      
    </div>
  );
};

export default TechnicalTab;