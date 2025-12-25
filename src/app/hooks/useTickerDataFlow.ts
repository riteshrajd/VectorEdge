import { useState, useEffect, useCallback } from 'react';
import { useDataStore } from '@/store/dataStroe'; 
import { useUserStore } from '@/store/userStore';
import { useStore } from '@/store/store'; // Import Main Store
import { InstrumentCoverInfo, CombinedData } from '@/types/types';
import { ADD_TO_SEARCH_HISTORY_API_ROUTE, FETCH_TICK_DATA_API_ROUTE } from '@/constants/constants';
import { useSocket } from './useSocket'; 
import { toast } from 'sonner';

export type FlowStatus = 'idle' | 'checking_cache' | 'confirmation_needed' | 'loading' | 'analyzing' | 'success' | 'error';

export const useTickerDataFlow = (selectedInstrument: InstrumentCoverInfo | null) => {
  const storedData = useDataStore((state) => state.data);
  const addData = useDataStore((state) => state.addData);
  const removeData = useDataStore((state) => state.removeData);
  const { user } = useUserStore();
  
  // Need this to switch views when clicking toast
  const setSelectedInstrument = useStore((state) => state.setSelectedInstrument);

  const [status, setStatus] = useState<FlowStatus>('idle');
  const [data, setData] = useState<CombinedData | null>(null);
  const [error, setError] = useState<string>('');
  const [socketTicker, setSocketTicker] = useState<string | null>(null);
  
  const socketData = useSocket(socketTicker);

  // --- HELPER: Update History ---
  const updateHistory = useCallback(async (instrument: InstrumentCoverInfo) => {
    if (!user) return;
    try {
      await fetch(ADD_TO_SEARCH_HISTORY_API_ROUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instrument }),
      });
    } catch (e) { console.error(e); }
  }, [user]);

  // --- EFFECT: Socket Listener & Toast Logic ---
  useEffect(() => {
    // Only run if we actually have incoming data and were listening
    if (socketData && socketTicker) {
      console.log(`📥 Hook: Socket data received for ${socketData.ticker}`);

      // 1. ALWAYS Save to Global Store (RAM)
      // This ensures if they switch to this stock later, it loads instantly (Level 1 Hit).
      addData(socketData);

      // 2. Prepare the Toast
      toast.success(`Analysis ready for ${socketData.ticker}!`, {
        description: `Price: $${socketData?.overview?.current_price || 'N/A'}`,
        action: {
          label: 'View Data',
          onClick: () => {
             // Switch the main view to this ticker
             setSelectedInstrument({ 
                symbol: socketData.ticker,
                name: socketData.ticker, // Fallback if name missing
             });
          }
        }
      });

      // 3. AUTO-UPDATE CHECK
      // Only update the current screen if the user is STILL looking at this ticker.
      const currentSymbol = selectedInstrument?.symbol.toUpperCase();
      const incomingSymbol = socketData.ticker.toUpperCase();

      if (currentSymbol === incomingSymbol) {
         console.log("✅ User is on the same ticker. Updating UI.");
         updateHistory(selectedInstrument!);
         setData(socketData);
         setStatus('success');
      } else {
         console.log("⏸️ User moved away. Data saved to RAM, but UI not updated.");
         // We do NOT call setData() or setStatus() here.
         // The user stays on their current screen (e.g., TSLA).
      }
      
      // 4. Stop listening
      setSocketTicker(null);
    }
  }, [socketData, addData, selectedInstrument, updateHistory, socketTicker, setSelectedInstrument]); 

  // --- ACTION: Fetch Data (Standard Mode) ---
  const confirmAndFetch = useCallback(async () => {
    if (!selectedInstrument) return;

    setStatus('loading');
    setError('');
    const symbol = selectedInstrument.symbol.toUpperCase();
    console.log(`🚀 ACTION: User Confirmed. Fetching ${symbol}...`);

    try {
      const response = await fetch(`${FETCH_TICK_DATA_API_ROUTE}?ticker=${symbol}`);
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'API Error');

      if (result.status === 'success') {
        console.log(`✅ API: Success.`);
        addData(result.data);
        updateHistory(selectedInstrument);
        setData(result.data);
        setStatus('success');
      } 
      else if (result.status === 'processing') {
        console.log(`⏳ API: Processing. Switching to Socket.`);
        setStatus('analyzing');
        setSocketTicker(symbol); 
      }

    } catch (err: unknown) {
      console.error('❌ Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setStatus('error');
    }
  }, [selectedInstrument, addData, updateHistory]);

  // --- ACTION: Soft Refresh ---
  const refreshData = useCallback(() => {
    if (!selectedInstrument) return;
    const symbol = selectedInstrument.symbol.toUpperCase();
    
    console.log(`🔄 REFRESH: Clearing ${symbol} from RAM and re-running checks.`);
    removeData(symbol);
    setData(null);
    setStatus('idle'); 
  }, [selectedInstrument, removeData]);

  // --- EFFECT: The Watcher (Check RAM & Redis) ---
  useEffect(() => {
    let isMounted = true;
    const checkAvailability = async () => {
      if (!selectedInstrument) {
        setStatus('idle');
        return;
      }
      
      const symbol = selectedInstrument.symbol.toUpperCase();
      
      // Safety: If we are already displaying this data, don't re-run
      if (data?.ticker === symbol) return;

      console.log(`🔍 FLOW: Checking availability for ${symbol}`);
      
      // Prevent UI jitter: only set checking if we aren't already waiting for confirmation
      setStatus((prev) => prev === 'confirmation_needed' ? prev : 'checking_cache'); 

      // Level 1: RAM
      const localData = storedData.find((item) => item.ticker === symbol);
      if (localData) {
        if (isMounted) { 
           console.log(`✅ LEVEL 1: Found in RAM.`);
           setData(localData); 
           setStatus('success'); 
        }
        return;
      }

      // Level 2: Redis
      try {
        const res = await fetch(`/api/check-cache?ticker=${symbol}`);
        const cacheResult = await res.json();
        
        if (isMounted && cacheResult.cached) {
          console.log(`✅ LEVEL 2: Found in Redis.`);
          addData(cacheResult.data);
          setData(cacheResult.data);
          setStatus('success');
          return;
        }
      } catch (err) { console.error(err); }

      // Level 3: Confirmation
      if (isMounted) {
        console.log(`✋ LEVEL 3: No cache found. Asking user.`);
        setStatus('confirmation_needed');
      }
    };

    checkAvailability();
    return () => { isMounted = false; };
  }, [selectedInstrument, storedData, addData]); 

  const resetFlow = () => {
    setStatus('idle');
    setData(null);
    setError('');
    setSocketTicker(null);
  };

  return { status, data, error, confirmAndFetch, refreshData, resetFlow };
};