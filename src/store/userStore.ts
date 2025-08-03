import { UserStore } from '@/types/store-types';
import { create } from 'zustand';

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
