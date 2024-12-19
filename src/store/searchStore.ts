import { create } from 'zustand';
import { SyntaxItem } from '@/types/syntax';

/**
 * 검색 기능 관련 상태를 관리하는 스토어의 인터페이스
 * @interface SearchStore
 * @property {boolean} isSearchModalOpen - 검색 모달의 열림/닫힘 상태
 * @property {SyntaxItem | null} searchResult - 검색 결과 아이템
 * @property {Function} openSearchModal - 검색 모달을 여는 함수
 * @property {Function} closeSearchModal - 검색 모달을 닫는 함수
 * @property {Function} setSearchResult - 검색 결과를 설정하는 함수
 */
interface SearchStore {
  isSearchModalOpen: boolean;
  searchResult: SyntaxItem | null;
  openSearchModal: () => void;
  closeSearchModal: () => void;
  setSearchResult: (result: SyntaxItem | null) => void;
}

/**
 * Zustand를 사용한 검색 상태 관리 스토어
 * 검색 모달의 상태와 검색 결과를 중앙에서 관리합니다.
 */
export const useSearchStore = create<SearchStore>((set) => ({
  isSearchModalOpen: false,
  searchResult: null,
  openSearchModal: () => set({ isSearchModalOpen: true }),
  closeSearchModal: () => set({ isSearchModalOpen: false }),
  setSearchResult: (result) => set({ searchResult: result }),
}));
