// src/app/analysis/page.tsx
'use client';

import { useState } from 'react';
import { useSocket } from '../hooks/useSocket';

export default function AnalysisPage() {
  const [ticker, setTicker] = useState('');
  const [status, setStatus] = useState('idle'); // idle | processing | success
  const [activeTicker, setActiveTicker] = useState<string | null>(null);
  
  // Use our custom hook! It starts listening as soon as 'activeTicker' is set.
  const liveData = useSocket(activeTicker);

  const handleAnalyze = async () => {
    if (!ticker) return;
    
    setStatus('processing');
    setActiveTicker(ticker); // Start the socket listener

    // 1. Call the API (The Smart Waiter)
    const response = await fetch('/api/ticker-data', {
      method: 'POST',
      body: JSON.stringify({ ticker }),
    });
    
    const result = await response.json();
    
    // If it was a Cache HIT, we get data immediately
    if (result.status === 'success') {
        setStatus('success');
    }
    // If it was a Cache MISS, the API returns 'processing', and we wait for the Socket.
  };

  return (
    <div className="p-10 max-w-xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">VectorEdge Real-Time Analyzer</h1>
      
      <div className="flex gap-2 mb-6">
        <input 
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          placeholder="Enter Ticker (e.g. AAPL)"
          className="border p-2 rounded w-full text-black"
        />
        <button 
          onClick={handleAnalyze}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Analyze
        </button>
      </div>

      {/* STATUS INDICATORS */}
      {status === 'processing' && !liveData && (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded animate-pulse">
           ⏳ Request Accepted. Worker is processing... (Wait for it!)
        </div>
      )}

      {/* SHOW LIVE DATA (From Socket or Cache) */}
      {liveData && (
        <div className="p-6 bg-green-100 text-green-900 rounded border border-green-300 mt-4">
          <h2 className="text-xl font-bold">🚀 Analysis Complete!</h2>
          <p><strong>Ticker:</strong> {liveData.ticker}</p>
          <p><strong>Price:</strong> ${liveData.price}</p>
          <p><strong>AI Verdict:</strong> {liveData.analysis}</p>
          <p className="text-xs text-gray-500 mt-2">Received live via Socket.io</p>
        </div>
      )}
    </div>
  );
}