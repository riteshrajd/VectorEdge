"use client";

import React, { useEffect, useRef } from "react";

interface Props {
  symbol: string;
  interval: string;
  showTabs?: boolean;
}

const TradingViewTechnicalAnalysisWidget: React.FC<Props> = ({
  symbol,
  interval,
  showTabs = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      interval,
      width: "300px",
      isTransparent: true,
      height: "300px",
      symbol,
      showIntervalTabs: showTabs,
      displayMode: "single",
      locale: "en",
      colorTheme: "dark",
    });

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current && script.parentNode === containerRef.current) {
        containerRef.current.removeChild(script);
      }
    };
  }, [symbol, interval, showTabs]);

  return (
    <div className="h-full w-full" ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export default TradingViewTechnicalAnalysisWidget;