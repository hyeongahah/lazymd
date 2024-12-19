/**
 * 마크다운 리스트 관련 유틸리티 함수들을 모아둔 모듈
 * @module listUtils
 */

import { updateCursorPosition } from './editorUtils';

/**
 * 들여쓰기 레벨에 따른 마커 결정
 * @param {number} level - 들여쓰기 레벨
 * @returns {string} 리스트 마커 문자열
 */
export const getMarkerForLevel = (level: number): string => {
  return '-'; // 모든 레벨에서 '-' 사용
};

/**
 * 현재 들여쓰기 레벨 계산
 * @param {string} indent - 들여쓰기 문자열
 * @returns {number} 들여쓰기 레벨
 */
export const calculateIndentLevel = (indent: string): number => {
  return indent.length / 2;
};

/**
 * 들여쓰기 생성
 * @param {number} level - 들여쓰기 레벨
 * @returns {string} 들여쓰기 문자열
 */
export const createIndent = (level: number): string => {
  return '  '.repeat(level);
};

/**
 * 탭 키로 들여쓰기 및 마커 스타일 변경 처리
 * @param {string} indent - 현재 들여쓰기
 * @param {string} text - 현재 텍스트
 * @param {number} selectionStart - 현재 커서 위치
 * @param {string} markdownText - 전체 마크다운 텍스트
 * @param {number} currentIndentLevel - 현재 들여쓰기 레벨
 * @param {Function} getNewMarker - 새로운 마커 생성 함수
 * @param {Function} setMarkdownText - 마크다운 텍스트 설정 함수
 * @param {HTMLTextAreaElement} textArea - 텍스트 에디터 요소
 */
export const handleListIndentation = (
  indent: string,
  text: string,
  selectionStart: number,
  markdownText: string,
  currentIndentLevel: number,
  getNewMarker: (level: number) => string,
  setMarkdownText: (text: string) => void,
  textArea: HTMLTextAreaElement
) => {
  const newIndent = indent + '  ';
  const newMarker = getNewMarker(currentIndentLevel + 1);

  const currentLineStart =
    markdownText.lastIndexOf('\n', selectionStart - 1) + 1;
  const lineStart = currentLineStart >= 0 ? currentLineStart : 0;

  const newValue =
    markdownText.substring(0, lineStart) +
    newIndent +
    newMarker +
    ' ' +
    text +
    markdownText.substring(selectionStart);

  setMarkdownText(newValue);
  updateCursorPosition(
    textArea,
    lineStart + newIndent.length + newMarker.length + 1 + text.length
  );
};

/**
 * 숫자를 로마 숫자로 변환
 * @param {number} num - 변환할 숫자
 * @param {boolean} isUpperCase - 대문자 여부
 * @returns {string} 로마 숫자 문자열
 */
const toRoman = (num: number, isUpperCase: boolean): string => {
  const romanNumerals = isUpperCase
    ? ['I', 'IV', 'V', 'IX', 'X', 'XL', 'L', 'XC', 'C']
    : ['i', 'iv', 'v', 'ix', 'x', 'xl', 'l', 'xc', 'c'];
  const numbers = [1, 4, 5, 9, 10, 40, 50, 90, 100];
  let result = '';

  for (let i = numbers.length - 1; i >= 0; i--) {
    while (num >= numbers[i]) {
      result += romanNumerals[i];
      num -= numbers[i];
    }
  }
  return result;
};

/**
 * 숫자를 알파벳으로 변환
 * @param {number} num - 변환할 숫자
 * @param {boolean} isUpperCase - 대문자 여부
 * @returns {string} 알파벳 문자열
 */
const toAlpha = (num: number, isUpperCase: boolean): string => {
  const base = isUpperCase ? 65 : 97;
  return String.fromCharCode(((num - 1) % 26) + base);
};

/**
 * 들여쓰기 레벨에 따른 순서 있는 리스트 마커 스타일 결정
 * @param {number} level - 들여쓰기 레벨
 * @param {number} index - 리스트 아이템 인덱스
 * @returns {string} 마커 문자열
 */
export const getOrderedListMarker = (level: number, index: number): string => {
  const style = level % 5;
  switch (style) {
    case 0: // 숫자
      return `${index}.`;
    case 1: // 대문자 로마
      return `${toRoman(index, true)}.`;
    case 2: // 대문자 알파벳
      return `${toAlpha(index, true)}.`;
    case 3: // 소문자 로마
      return `${toRoman(index, false)}.`;
    case 4: // 소문자 알파벳
      return `${toAlpha(index, false)}.`;
    default:
      return `${index}.`;
  }
};

/**
 * 다음 레벨의 마커 가져오기
 * @param {number} currentLevel - 현재 레벨
 * @returns {string} 다음 레벨의 마커
 */
export const getNextLevelMarker = (currentLevel: number): string => {
  const nextLevel = currentLevel + 1;
  return getOrderedListMarker(nextLevel, 1);
};

/**
 * 같은 레벨의 다음 마커 가져오기
 * @param {string} currentMarker - 현재 마커
 * @param {number} level - 현재 레벨
 * @returns {string} 다음 마커
 */
export const getNextMarkerInLevel = (
  currentMarker: string,
  level: number
): string => {
  const match = currentMarker.match(/^(\d+|\w+)\./);
  if (!match) return '1.';

  const current = match[1];
  let nextIndex = 1;

  if (/^\d+$/.test(current)) {
    nextIndex = parseInt(current) + 1;
  } else if (/^[IVX]+$/i.test(current)) {
    nextIndex = romanToNumber(current) + 1;
  } else if (/^[A-Za-z]$/.test(current)) {
    const base = current.toUpperCase() === current ? 65 : 97;
    nextIndex = current.charCodeAt(0) - base + 2;
  }

  return getOrderedListMarker(level, nextIndex);
};

/**
 * 리스트의 엔터 키 처리
 * @param {string} indent - 현재 들여쓰기
 * @param {string} text - 현재 텍스트
 * @param {number} selectionStart - 현재 커서 위치
 * @param {string} markdownText - 전체 마크다운 텍스트
 * @param {Function} getMarker - 마커 생성 함수
 * @param {number} indentLevel - 들여쓰기 레벨
 * @param {string} marker - 현재 마커
 * @param {Function} getNextIndex - 다음 인덱스 계산 함수
 * @param {Function} setMarkdownText - 마크다운 텍스트 설정 함수
 * @param {HTMLTextAreaElement} textArea - 텍스트 에디터 요소
 */
export const handleListEnterKey = (
  indent: string,
  text: string,
  selectionStart: number,
  markdownText: string,
  getMarker: (level: number, index?: number) => string,
  indentLevel: number,
  marker: string,
  getNextIndex: (marker: string) => number,
  setMarkdownText: (text: string) => void,
  textArea: HTMLTextAreaElement
) => {
  if (!text.trim()) {
    const lineStart =
      selectionStart - (indent.length + text.length + marker.length + 1);
    const newValue = markdownText.substring(0, lineStart) + '\n';
    setMarkdownText(newValue);
    updateCursorPosition(textArea, lineStart + 1);
  } else {
    const nextMarker = getMarker(indentLevel, getNextIndex(marker));
    const insertion = `\n${indent}${nextMarker}`;
    const newValue =
      markdownText.substring(0, selectionStart) +
      insertion +
      markdownText.substring(selectionStart);

    setMarkdownText(newValue);
    updateCursorPosition(textArea, selectionStart + insertion.length);
  }
};

/**
 * 로마 숫자를 일반 숫자로 변환
 * @param {string} roman - 로마 숫자 문자열
 * @returns {number} 변환된 숫자
 */
function romanToNumber(roman: string): number {
  const romanValues: { [key: string]: number } = {
    i: 1,
    v: 5,
    x: 10,
    l: 50,
    c: 100,
    d: 500,
    m: 1000,
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };

  let result = 0;
  for (let i = 0; i < roman.length; i++) {
    const current = romanValues[roman[i]];
    const next = romanValues[roman[i + 1]];
    result += next > current ? -current : current;
  }
  return result;
}
