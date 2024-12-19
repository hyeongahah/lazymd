import { create } from 'zustand';

/**
 * 메뉴 상태를 관리하는 스토어의 인터페이스
 * @interface MenuState
 * @property {boolean} isOpen - 메뉴의 열림/닫힘 상태
 * @property {Function} toggle - 메뉴 상태를 토글하는 함수
 */
interface MenuState {
  isOpen: boolean;
  toggle: () => void;
}

/**
 * Zustand를 사용한 메뉴 상태 관리 스토어
 * 메뉴의 열림/닫힘 상태를 중앙에서 관리합니다.
 */
export const useMenuStore = create<MenuState>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
