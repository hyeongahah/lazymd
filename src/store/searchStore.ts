import { create } from 'zustand';

interface SearchStore {
  isSearchOpen: boolean;
  toggleSearch: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  isSearchOpen: false,
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
}));
