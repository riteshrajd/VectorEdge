import { create } from "zustand";
import { CombinedData } from "@/types/types"; 

// Define the interface here or import it if it's in @/types/store-types
interface DataStore {
  data: CombinedData[];
  setData: (newData: CombinedData[]) => void;
  addData: (newData: CombinedData) => void;
  removeData: (ticker: string) => void; // <--- NEW METHOD
}

export const useDataStore = create<DataStore>((set) => ({
  data: [],
  
  setData: (newData) => set({ data: newData }),

  addData: (newData) => {
    set((state) => {
      const itemExists = state.data.some((item) => item.ticker === newData.ticker);
      if (itemExists) {
        // Update existing item
        return {
          data: state.data.map((item) =>
            item.ticker === newData.ticker ? newData : item
          ),
        };
      } else {
        // Add new item
        return { data: [...state.data, newData] };
      }
    });
  },

  // NEW: Removes a specific ticker from RAM
  removeData: (ticker) => {
    set((state) => ({
      data: state.data.filter((item) => item.ticker !== ticker)
    }));
  },
}));