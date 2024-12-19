/**
 * 자동 저장 관련 유틸리티 함수들을 모아둔 모듈
 * @module autoSaveUtils
 */

/**
 * 자동 저장을 위한 로컬 스토리지 키
 * @constant {string}
 */
const AUTO_SAVE_KEY = 'markdown_autosave';

/**
 * 자동 저장 디바운스 시간 (5초)
 * @constant {number}
 */
const DEBOUNCE_DELAY = 5000;

let autoSaveTimer: NodeJS.Timeout;

/**
 * 마크다운 내용을 자동 저장 (디바운스 적용)
 * 마지막 수정 후 5초 동안 추가 수정이 없을 때 저장 실행
 * @param {string} content - 저장할 마크다운 내용
 */
export const autoSave = (content: string) => {
  // 이전 타이머 취소
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer);
  }

  // 새로운 타이머 설정
  autoSaveTimer = setTimeout(() => {
    localStorage.setItem(AUTO_SAVE_KEY, content);
  }, DEBOUNCE_DELAY);
};

/**
 * 자동 저장된 마크다운 내용을 불러오기
 * @returns {string} 저장된 마크다운 내용 또는 빈 문자열
 */
export const loadAutoSavedContent = (): string => {
  const savedContent = localStorage.getItem(AUTO_SAVE_KEY);
  return savedContent || '';
};

/**
 * 자동 저장된 마크다운 내용을 삭제
 * 로컬 스토리지에서 저장된 내용을 완전히 제거
 */
export const clearAutoSavedContent = () => {
  localStorage.removeItem(AUTO_SAVE_KEY);
};
