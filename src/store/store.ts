import { create } from "zustand";
import { Store } from "@/types/store-types";

export const useStore = create<Store>((set) => {
  return {
    // --states--
    instrumentHistoryList: [
      { name: "Apple Inc.", symbol: "AAPL", isFavorite: false, recomendation: "buy" },
      { name: "Tesla Inc.", symbol: "TSLA", isFavorite: false, recomendation: "hold" },
    ],
    searching: false,
    isLeftCollapsed: false,
    searchTerm: '',
    selectedInstrument: null,
    selectTheme: false,
    isMobile: false,
    mobileView: 'search',

    // --actions--
    setInstrumentHistoryList: (list) => {
      set({ instrumentHistoryList: list });
    },
    addToInstrumentToList: (instrument) =>
      set((state) => ({ instrumentHistoryList: [ instrument, ...state.instrumentHistoryList] })),
    setIsLeftCollapsed:()=>{
      set((state)=>({ isLeftCollapsed:!state.isLeftCollapsed }))
    },
    setSearching: ()=>{
      set((state)=>({searching: state.searchTerm.trim() !== ''}))
    },
    setSearchTerm:(term)=>{
      set({searchTerm: term})
    },
    setSelectedInstrument:(instrument)=>{
      set({selectedInstrument: instrument})
    },
    setSelectTheme: (value) => set({ selectTheme: value }),
    setMobileView: (view) => set({ 
      mobileView: view, 
    }),
    setIsMobile: (value) => set({ isMobile: value }),
  };
});
