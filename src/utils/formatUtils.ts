/**
 * 마크다운 텍스트 포맷팅 관련 유틸리티 함수들을 모아둔 모듈
 * @module formatUtils
 */

/**
 * 텍스트 포맷팅을 위한 옵션 인터페이스
 * @interface FormatOptions
 * @property {string} markdownText - 마크다운 텍스트
 * @property {number} selectionStart - 선택 시작 위치
 * @property {number} selectionEnd - 선택 끝 위치
 */
interface FormatOptions {
  markdownText: string;
  selectionStart: number;
  selectionEnd: number;
}

/**
 * 텍스트 포맷팅 유틸리티 객체
 * 다양한 마크다운 포맷팅 기능을 제공
 */
export const formatText = {
  /**
   * 선택된 텍스트를 볼드체로 변환
   * @param {FormatOptions} options - 포맷팅 옵션
   * @returns {string} 변환된 텍스트
   */
  bold: ({
    markdownText,
    selectionStart,
    selectionEnd,
  }: FormatOptions): string => {
    const before = markdownText.slice(0, selectionStart);
    const selection = markdownText.slice(selectionStart, selectionEnd);
    const after = markdownText.slice(selectionEnd);
    return `${before}**${selection}**${after}`;
  },

  /**
   * 선택된 텍스트를 이탤릭체로 변환
   * @param {FormatOptions} options - 포맷팅 옵션
   * @returns {string} 변환된 텍스트
   */
  italic: ({
    markdownText,
    selectionStart,
    selectionEnd,
  }: FormatOptions): string => {
    const before = markdownText.slice(0, selectionStart);
    const selection = markdownText.slice(selectionStart, selectionEnd);
    const after = markdownText.slice(selectionEnd);
    return `${before}*${selection}*${after}`;
  },
};

/**
 * 텍스트의 모든 포맷팅을 제거
 * @param {string} text - 원본 텍스트
 * @returns {string} 포맷팅이 제거된 텍스트
 */
export const clearFormatting = (text: string): string => {
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/~~/g, '')
    .replace(/<u>|<\/u>/g, '')
    .replace(/<mark>|<\/mark>/g, '');
};
