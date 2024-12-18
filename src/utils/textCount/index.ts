// 글자 수 계산
export const getCharacterCount = (text: string): number => {
  return text.length;
};

// 단어 수 계산
export const getWordCount = (text: string): number => {
  // 공백을 기준으로 단어를 분리하고 빈 문자열 제거
  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  return words.length;
};

// 읽기 예상 시간 계산 (분 단위)
export const getReadingTime = (text: string): string => {
  const WORDS_PER_MINUTE = 180; // 평균 읽기 속도
  const wordCount = getWordCount(text);
  const minutes = wordCount / WORDS_PER_MINUTE;

  if (minutes < 1) {
    const seconds = Math.ceil(minutes * 60);
    return `${seconds}초`;
  }

  return `${Math.ceil(minutes)}분`;
};
