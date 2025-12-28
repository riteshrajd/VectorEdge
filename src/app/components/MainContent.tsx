'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/store';
import { useTickerDataFlow } from '@/app/hooks/useTickerDataFlow';
import StockAnalysisReport from './main-content-components/StockAnalysisReport';
import WelcomeScreen from './main-content-components/WelcomeScreen';
import ConfirmationScreen from './main-content-components/ConfirmationScreen';
import Header from './main-content-components/StockDataHeader';
import { Loader2 } from 'lucide-react'; // Optional: Use a nice icon if you have lucide

const MainContent = () => {
  const store = useStore();
  const [isShrunk, setIsShrunk] = useState(false);

  // Use the Hook
  const { status, data, error, confirmAndFetch, refreshData, resetFlow } = useTickerDataFlow(store.selectedInstrument || null);

  // --- RENDER LOGIC ---

  // 1. Idle (No ticker selected)
  if (status === 'idle') {
    return <WelcomeScreen />;
  }

  // 2. Error
  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500">
        <p className="text-xl mb-4">Error: {error}</p>
        <button onClick={() => resetFlow()} className="px-4 py-2 bg-gray-200 rounded text-black">
          Go Back
        </button>
      </div>
    );
  }

  // 3. Checking Cache (NEW BLOCK)
  if (status === 'checking_cache') {
    return (
      <div className="flex h-full flex-col items-center justify-center text-[var(--color-muted-foreground)]">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p>Checking availability...</p>
      </div>
    );
  }

  // 4. Confirmation Screen
  if (status === 'confirmation_needed') {
    return (
      <ConfirmationScreen
        instrumentName={store.selectedInstrument?.name || ''}
        onConfirm={() => {
          store.setSearchTerm('');
          confirmAndFetch()
        }}
        onCancel={() => {
          store.setSelectedInstrument(null);
          store.setSearchTerm('');
          resetFlow();
        }}
      />
    );
  }

  // 5. Loading States (Fetching from API)
  if (status === 'loading') {
    return <div className="flex h-full items-center justify-center text-lg">Fetching Data...</div>;
  }
  
  // 6. Analyzing State (Waiting for Worker via Socket)
  if (status === 'analyzing') {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-4">
        <div className="text-xl animate-pulse font-semibold">AI Analysis in Progress...</div>
        <div className="text-sm text-gray-500">Our worker is crunching the numbers. This usually takes 5-10 seconds.</div>
        <div className="text-sm text-gray-500">You may leave this screen and come back later.</div>
      </div>
    );
  }

  // 7. Success (Show the Report)
  return (
    <div className="h-full w-full bg-[var(--color-background)] flex flex-col">
      <Header 
        data={data} 
        isShrunk={isShrunk} 
        onRefresh={refreshData} 
        isLoading={false} 
      />
      <div className="flex-1 w-full flex justify-center bg-[var(--color-background)] overflow-hidden">
        {data && <StockAnalysisReport data={data} setIsShrunk={setIsShrunk} />}
      </div>
    </div>
  );
};

export default MainContent;