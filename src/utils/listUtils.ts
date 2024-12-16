import { updateCursorPosition } from './editorUtils';

// 들여쓰기 레벨에 따른 마커 결정 함수
export const getMarkerForLevel = (level: number): string => {
  switch (level) {
    case 0:
      return '-'; // 최상위 레벨
    case 1:
      return '*'; // 첫 번째 들여쓰기
    case 2:
      return '+'; // 두 번째 들여쓰기
    default:
      return '-'; // 그 이상은 다시 '-'부터
  }
};

// 현재 들여쓰기 레벨 계산
export const calculateIndentLevel = (indent: string): number => {
  return indent.length / 2;
};

// 들여쓰기 생성
export const createIndent = (level: number): string => {
  return '  '.repeat(level);
};

// 탭 키로 들여쓰기 및 마커 스타일 변경 처리
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

  // 현재 줄의 시작 위치를 찾기
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

// 순서 있는 리스트의 마커 생성
export const getOrderedListMarker = (
  level: number,
  index: number = 1
): string => {
  switch (level) {
    case 0: // 최상위: 숫자
      return `${index}. `;
    case 1: // 1단계 하위: 로마 대문자
      return `${toRomanUpper(index)}. `;
    case 2: // 2단계 하위: 알파벳 대문자
      return `${String.fromCharCode(64 + index)}. `;
    case 3: // 3단계 하위: 로마 소문자
      return `${toRomanLower(index)}. `;
    case 4: // 4단계 하위: 알파벳 소문자
      return `${String.fromCharCode(96 + index)}. `;
    default:
      return `${index}. `;
  }
};

// 로마 숫자 변환 (대문자)
export const toRomanUpper = (num: number): string => {
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  return roman[num - 1] || String(num);
};

// 로마 숫자 변환 (소문자)
export const toRomanLower = (num: number): string => {
  return toRomanUpper(num).toLowerCase();
};

// 리스트의 엔터 키 처리
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
    // 빈 항목이면 리스트 종료
    const lineStart =
      selectionStart - (indent.length + text.length + marker.length + 1);
    const newValue = markdownText.substring(0, lineStart) + '\n';
    setMarkdownText(newValue);
    updateCursorPosition(textArea, lineStart + 1);
  } else {
    // 다음 항목 추가 (현재 레벨의 마커 스타일 유지)
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
