import { create } from "zustand";
import { DataStore } from "@/types/store-types";

export const useDataStore = create<DataStore>((set) => ({
  data: [],
  setData: (newData) => set({data: newData}),
  addData: (newData) => {
    set(state => {
      const itemExists = state.data.some(item => item.ticker === newData.ticker);
      if (itemExists) {
        return {
          data: state.data.map(item =>
            item.ticker === newData.ticker ? newData : item
          )
        };
      } else {
        return { data: [...state.data, newData] };
      }      
    })
  },
}));
