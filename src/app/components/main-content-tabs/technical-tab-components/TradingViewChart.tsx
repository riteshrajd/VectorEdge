// src/components/TradingViewChart.tsx
'use client';

import React, { useEffect, useRef } from 'react';

interface Props {
  symbol: string; // Example: "NASDAQ:AAPL"
  height?: string;
  width?: string;
  theme?: string;
}

const TradingViewChart = ({ symbol, height = '500px', width = '100%', theme='dark' }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      // @ts-expect-error i dont know
      new TradingView.widget({
        container_id: ref.current!.id,
        width,
        height,
        symbol,
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: theme,
        style: '1',
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        allow_symbol_change: true,
        hide_top_toolbar: true,
      });
    };

    ref.current.innerHTML = ''; // clear old chart
    ref.current.appendChild(script);
  }, [height, symbol, width]);

  return <div id={`tradingview_${symbol}`} ref={ref} style={{ height, width }} />;
};

export default TradingViewChart;
