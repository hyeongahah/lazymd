import styles from '@/app/page.module.css';

// 타입 정의
interface TextMatch {
  start: number;
  end: number;
}

interface FormatPatterns {
  bold: RegExp;
  italic: RegExp;
  strike: RegExp;
  underline: RegExp;
  highlight: RegExp;
}

interface FormatState {
  isBold: boolean;
  isItalic: boolean;
  isStrike: boolean;
  isUnderline: boolean;
  isHighlight: boolean;
}

// 정규식 패턴
export const patterns: FormatPatterns = {
  bold: /\*\*([^*]+)\*\*/g,
  italic: /(?:\*\*)?_([^_]+)_(?!\*)|(?<=\*\*)_([^_]+)_(?=\*\*)/g,
  strike: /~~([^~]+)~~/g,
  underline: /<u>([^<]+)<\/u>/g,
  highlight: /==([^=]+)==/g,
};

// 유틸리티 함수들
export const findAllMatches = (regex: RegExp, text: string): TextMatch[] => {
  const matches: TextMatch[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  return matches;
};

export const isInRange = (
  matches: TextMatch[],
  cursorPosition: number
): boolean => {
  return matches.some(({ start, end }) => {
    return cursorPosition >= start && cursorPosition <= end;
  });
};

// 커서 위치의 포맷 상태 확인
export const checkFormatAtCursor = (
  text: string,
  cursorPosition: number
): FormatState => {
  return {
    isBold: isInRange(findAllMatches(patterns.bold, text), cursorPosition),
    isItalic: isInRange(findAllMatches(patterns.italic, text), cursorPosition),
    isStrike: isInRange(findAllMatches(patterns.strike, text), cursorPosition),
    isUnderline: isInRange(
      findAllMatches(patterns.underline, text),
      cursorPosition
    ),
    isHighlight: isInRange(
      findAllMatches(patterns.highlight, text),
      cursorPosition
    ),
  };
};

// 라인 관련 유틸리티
export function countLines(text: string): number {
  return text.split('\n').length;
}

export function getLineNumber(text: string, position: number): number {
  const textBeforeCursor = text.substring(0, position);
  return textBeforeCursor.split('\n').length;
}

export function getLineStartPosition(text: string, lineNumber: number): number {
  const lines = text.split('\n');
  let position = 0;

  for (let i = 0; i < lineNumber - 1; i++) {
    position += lines[i].length + 1;
  }

  return position;
}

export function getLineEndPosition(text: string, lineNumber: number): number {
  const lines = text.split('\n');
  let position = 0;

  for (let i = 0; i < lineNumber; i++) {
    position += lines[i].length + 1;
  }

  return position - 1;
}
