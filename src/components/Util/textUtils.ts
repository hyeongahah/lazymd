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

// 유틸리티 함수들
export const getTextArea = () =>
  document.querySelector(`.${styles.editor}`) as HTMLTextAreaElement;

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

// 정규식 패턴
export const patterns: FormatPatterns = {
  bold: /\*\*([^*]+)\*\*/g,
  italic: /(?:\*\*)?\*([^*]+)\*(?!\*)|(?<=\*\*)\*([^*]+)\*(?=\*\*)/g,
  strike: /~~([^~]+)~~/g,
  underline: /<u>([^<]+)<\/u>/g,
  highlight: /<mark>([^<]*)<\/mark>/g,
};

// 커서 위치의 포맷 상태 확인
export const checkFormatAtCursor = (
  markdownText: string,
  cursorPosition: number
): FormatState => {
  return {
    isBold: isInRange(
      findAllMatches(patterns.bold, markdownText),
      cursorPosition
    ),
    isItalic: isInRange(
      findAllMatches(patterns.italic, markdownText),
      cursorPosition
    ),
    isStrike: isInRange(
      findAllMatches(patterns.strike, markdownText),
      cursorPosition
    ),
    isUnderline: isInRange(
      findAllMatches(patterns.underline, markdownText),
      cursorPosition
    ),
    isHighlight: isInRange(
      findAllMatches(patterns.highlight, markdownText),
      cursorPosition
    ),
  };
};
