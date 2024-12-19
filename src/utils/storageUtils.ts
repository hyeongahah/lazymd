/**
 * 로컬 스토리지 관련 유틸리티 함수들을 모아둔 모듈
 * @module storageUtils
 */

/**
 * 로컬 스토리지에 데이터 저장
 * @param {string} key - 저장할 데이터의 키
 * @param {any} value - 저장할 데이터 값
 * @throws {Error} 저장 실패 시 에러 발생
 */
export const setStorageItem = (key: string, value: any): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    throw error;
  }
};

/**
 * 로컬 스토리지에서 데이터 불러오기
 * @param {string} key - 불러올 데이터의 키
 * @param {any} defaultValue - 데이터가 없을 경우 반환할 기본값
 * @returns {any} 저장된 데이터 또는 기본값
 */
export const getStorageItem = (key: string, defaultValue: any = null): any => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * 로컬 스토리지에서 데이터 삭제
 * @param {string} key - 삭제할 데이터의 키
 */
export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * 로컬 스토리지 전체 초기화
 */
export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};
