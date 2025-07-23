// components/MainContent.tsx
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useStore } from "@/store/store";
import StockAnalysisReport from "../test/StockAnalysisReport2";
import { useDataStore } from "@/store/dataStroe";
import { CombinedData } from "@/types/types";
import WelcomeScreen from "./main-content-tabs/WelcomeScreen";
import { FETCH_TICK_DATA_API_ROUTE } from "@/constants/constants";

const MainContent = () => {
  const store = useStore();
  const dataStore = useDataStore();
  const [data, setData] = useState<CombinedData|null>(null);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('');

  const fetchData = useCallback(async (ticker: string, refresh: boolean = false) => {
    if (ticker.trim()) {
      setData(null);
      setError('');
      const current_data = dataStore.data;
      const selectedTicker = ticker.toUpperCase();
      const result = current_data.find(item => item.ticker === selectedTicker);
      console.log(`setting loading = true and fetching data`)
      setLoading(true);
      if (result) {
        setData(result);
        dataStore.addData(result);
      } else {
        try {
          console.log(`fetching ticker data...`)
          const response = await fetch(
            `${FETCH_TICK_DATA_API_ROUTE}?ticker=${selectedTicker}${
              refresh ? "&refresh" : ""
            }`
          );
          const fetchedData: CombinedData = await response.json()
          setData(fetchedData);
          console.log(`data fetched for ${selectedTicker}: ${fetchedData}`);
        } catch (error) {
          console.error('Error occurred while fetching data:', error instanceof Error ? error.message : error);
          setError(`Error fetching data for ticker ${selectedTicker}: ${error instanceof Error ? error.message : error}`);
        }
      }
      setLoading(false);
    }
  }, [dataStore]);

  useEffect(() => {
    if(store.selectedInstrument) { 
      console.log(`ITEM SELECTED LOG FROM in Maincontent: ${JSON.stringify(store.selectedInstrument)}`)
      const ticker: string = store.selectedInstrument.symbol;
      fetchData(ticker);
    }
  }, [fetchData, store.selectedInstrument]);



  // If no instrument is selected, show welcome screen
  if (!store.selectedInstrument) {
    return (
      <WelcomeScreen />
    );
  }

  if(error && !data) {
    return (
      <div>
        {error}
      </div>
    )
  }

  if (loading) {
    return (
      <div>
        Loading data...
      </div>
    )
  }
  return (
    <div className="h-full w-full flex justify-center bg-[var(--bg-main)] overflow-hidden">
      <StockAnalysisReport data={data}/>
    </div>
  );
};

export default MainContent;
