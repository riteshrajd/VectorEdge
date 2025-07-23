import { create } from "zustand";
import { CombinedData } from "@/types/types";

interface DataStore {
  data: CombinedData[];
  setData: (newData: CombinedData[]) => void;
  addData: (newData: CombinedData) => void; 
  updateData: (newData: CombinedData) => void; 
}

export const useDataStore = create<DataStore>((set) => ({
  data: [],
  setData: (newData) => set({data: newData}),
  addData: (newData) => {
    set(state => ({data: [...state.data, newData]}))
  },
  updateData: (newData) => {
    set(state => ({
      data: state.data.map(item => item.ticker === newData.ticker ? newData : item)
    }))
  },
}));
