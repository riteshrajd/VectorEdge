import { create } from "zustand";
import { InstrumentCoverInfo } from "@/types/types";

interface Store {
  instrumentHistoryList: InstrumentCoverInfo[];
  searching: boolean
  isLeftCollapsed: boolean;
  searchTerm:string,
  selectedInstrument?: InstrumentCoverInfo | null;
  setIsLeftCollapsed: () => void;
  setSearchTerm: (term:string)=>void;
  setSearching:() =>void
  setInstrumentHistoryList: (list: InstrumentCoverInfo[]) => void;
  setSelectedInstrument: (instrument: InstrumentCoverInfo)=>void;
}

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

    // --actions--
    setInstrumentHistoryList: (list: InstrumentCoverInfo[]) => {
      set({ instrumentHistoryList: list });
    },
    setIsLeftCollapsed:()=>{
      set((state)=>({ isLeftCollapsed:!state.isLeftCollapsed }))
    },
    setSearching: ()=>{
      set((state)=>({searching: state.searchTerm.trim() !== ''}))
    },
    setSearchTerm:(term:string)=>{
      set({searchTerm: term})
    },
    setSelectedInstrument:(instrument:InstrumentCoverInfo)=>{
      set({selectedInstrument: instrument})
    }
  };
});
