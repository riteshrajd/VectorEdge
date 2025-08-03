'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useStore } from '@/store/store';
import StockAnalysisReport from './main-content-components/StockAnalysisReport';
import { useDataStore } from '@/store/dataStroe';
import { CombinedData, InstrumentCoverInfo } from '@/types/types';
import WelcomeScreen from './main-content-components/WelcomeScreen';
import { ADD_TO_SEARCH_HISTORY_API_ROUTE, FETCH_TICK_DATA_API_ROUTE } from '@/constants/constants';
import Header from './main-content-components/StockDataHeader';
import { useUserStore } from '@/store/userStore';
import ConfirmationScreen from './main-content-components/ConfirmationScreen';

const MainContent = () => {
  const store = useStore();
  const dataStore = useDataStore();
  const [data, setData] = useState<CombinedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isShrunk, setIsShrunk] = useState(false);
  const [askConfirmation, setAskConfirmation] = useState(false);
  const { user, setUser } = useUserStore();

  const updateInstrumentHistory = async (instrument: InstrumentCoverInfo) => {
    try {
      if (!user) {
        console.error('No user found for updating instrument history');
        return;
      }
      if (!instrument?.symbol || !instrument?.name) {
        console.error('Invalid instrument data:', instrument);
        return;
      }
      console.log(`Sending instrument to backend: ${JSON.stringify(instrument)}`);
      const response = await fetch(ADD_TO_SEARCH_HISTORY_API_ROUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ instrument }),
      });
      if (response.ok) {
        const { instrument_history } = await response.json();
        console.log(`Added ${instrument.name} to search history: ${JSON.stringify(instrument_history)}`);
        setUser({ ...user, instrument_history });
      } else {
        console.error(`Failed to add ${instrument.name} to history: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error adding ${instrument.name} to search history:`, error);
    }
  };

  const fetchData = useCallback(async (ticker: string, refresh: boolean = false) => {
    if (ticker.trim()) {
      setData(null);
      setError('');
      const current_data = dataStore.data;
      const selectedTicker = ticker.toUpperCase();
      const result = current_data.find((item) => item.ticker === selectedTicker);
      console.log(`Setting loading = true and fetching data`);
      setLoading(true);
      if (result && !refresh) {
        setData(result);
        dataStore.addData(result);
      } else {
        try {
          console.log(`Fetching ticker data for ${selectedTicker}...`);
          const response = await fetch(
            `${FETCH_TICK_DATA_API_ROUTE}?ticker=${selectedTicker}${refresh ? '&refresh' : ''}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
          }
          const fetchedData: CombinedData = await response.json();
          console.log(`Response received for ${selectedTicker}`);
          // setData(fetchedData); --
          dataStore.addData(fetchedData);
          return fetchedData;
        } catch (error) {
          console.error('Error fetching data:', error);
          setError(`Error fetching data for ticker ${selectedTicker}: ${error instanceof Error ? error.message : error}`);
          return null;
        }
      }
      setLoading(false);
    }
  }, [dataStore]);

  useEffect(() => {
    if(store.selectedInstrument) { 
      console.log(`ITEM SELECTED LOG FROM in Maincontent: ${JSON.stringify(store.selectedInstrument)}`)
      const data = dataStore.data.find(item => item.ticker === store.selectedInstrument?.symbol);
      if(data){
        setData(data);
        setLoading(false);
        return;
      }
      setAskConfirmation(true);
    }
  }, [dataStore.data, store.selectedInstrument]);

  const handleInstrumentDataFetch = async () => {
    setAskConfirmation(false);
    setLoading(true);
    setError('');
    const selectedInstrument = store.selectedInstrument;
    const symbol = selectedInstrument?.symbol;
    try {
      if (!symbol) {
        throw new Error('No symbol provided');
      }
      const fetchedData = await fetchData(symbol);
      store.setSearchTerm('');
      if (selectedInstrument && user && fetchedData) {
        await updateInstrumentHistory(selectedInstrument);
        setData(fetchedData);
      } else {
        console.error('No user or selectedInstrument:', { user, selectedInstrument });
      }
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      setError(`Error fetching data for ticker ${symbol}: ${error instanceof Error ? error.message : error}`);
    } finally {
      setLoading(false);
    }
  };

  if (!store.selectedInstrument) return <WelcomeScreen />
  
  if(error && !data) return (<div> {error} </div>)

  if(askConfirmation) {
    return (
      <ConfirmationScreen
        instrumentName={store.selectedInstrument.name}
        onConfirm={handleInstrumentDataFetch}
        onCancel={() => setAskConfirmation(false)}
      />
    );
  }

  if (loading) return <div>Loading data...</div>;

  return (
   <div className="h-full w-full bg-[var(--bg-main)]">
      <Header data={data} isShrunk={isShrunk} />
      <div className="h-full w-full flex justify-center bg-[var(--bg-main)] overflow-hidden">
        <StockAnalysisReport data={data} setIsShrunk={setIsShrunk} />
      </div>
    </div>
  ); 
};

export default MainContent;
