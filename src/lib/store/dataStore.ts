// File: src/store/dataStore.ts
import { create } from 'zustand';
import { fetchAllData } from '../api/fetchAllData';
import {
  cleanStockData,
  cleanNewsData,
  cleanIndicatorData,
  cleanFundamentals,
  cleanSocialData
} from '../utils/dataCleaner';

interface DataState {
  stock: any;
  fundamentals: any;
  indicators: {
    rsi: string | null;
    macd: {
      macd: string;
      signal: string;
    } | null;
  };
  news: any[];
  social: any[];
  loading: boolean;
  error: string | null;
  fetchData: (symbol: string) => Promise<void>;
}

export const useDataStore = create<DataState>((set) => ({
  stock: null,
  fundamentals: null,
  indicators: { rsi: null, macd: null },
  news: [],
  social: [],
  loading: false,
  error: null,

  fetchData: async (symbol) => {
    set({ loading: true, error: null });

    try {
      const rawData = await fetchAllData(symbol);
      if (!rawData) throw new Error('No data returned');

      set({
        stock: cleanStockData(rawData.stock),
        fundamentals: cleanFundamentals(rawData.fundamentals),
        indicators: cleanIndicatorData({
          rsi: rawData.rsi,
          macd: rawData.macd
        }),
        news: cleanNewsData(rawData.news),
        social: cleanSocialData(rawData.social),
        loading: false
      });
    } catch (error) {
      set({
        error: 'Failed to load data. Please try again later.',
        loading: false
      });
    }
  }
}));
