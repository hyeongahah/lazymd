import { create } from 'zustand';
import { SyntaxItem } from '@/types/syntax';

interface SearchStore {
  isSearchModalOpen: boolean;
  searchResult: SyntaxItem | null;
  openSearchModal: () => void;
  closeSearchModal: () => void;
  setSearchResult: (result: SyntaxItem | null) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  isSearchModalOpen: false,
  searchResult: null,
  openSearchModal: () => set({ isSearchModalOpen: true }),
  closeSearchModal: () => set({ isSearchModalOpen: false }),
  setSearchResult: (result) => set({ searchResult: result }),
}));
