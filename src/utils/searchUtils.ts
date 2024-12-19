import { SyntaxItem } from '@/types/syntax';
import { markdownSyntax } from '@/data/markdownSyntax';

// 마크다운 문법을 검색하는 함수
// 한글 이름, 영문 이름, 설명을 기준으로 검색
export const searchSyntax = (query: string): SyntaxItem[] => {
  const lowerQuery = query.toLowerCase().trim();

  return markdownSyntax.filter(
    (item) =>
      item.nameKo.toLowerCase().includes(lowerQuery) || // 한글도 toLowerCase() 적용
      item.nameEn.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) // 설명도 toLowerCase() 적용
  );
};

// 카테고리별로 마크다운 문법을 검색하는 함수
export const searchByCategory = (category: string): SyntaxItem[] => {
  return markdownSyntax.filter((item) => item.category === category);
};

// ID로 특정 마크다운 문법을 찾는 함수
export const findSyntaxById = (id: string): SyntaxItem | undefined => {
  return markdownSyntax.find((item) => item.id === id);
};

// 자동완성을 위한 마크다운 문법 검색 함수
// 특수 검색 패턴과 한글/영문 매칭을 지원
export const getAutocompleteSuggestions = (query: string): SyntaxItem[] => {
  if (!query) return [];

  const lowerQuery = query.toLowerCase().trim();

  // 특수 검색 패턴 처리 (예: "hl2" -> "Header Level 2")
  const headerLevelMatch = lowerQuery.match(/^hl(\d)$/);
  if (headerLevelMatch) {
    const level = headerLevelMatch[1];
    return markdownSyntax.filter(
      (item) => item.nameEn.toLowerCase() === `header level ${level}`
    );
  }

  // 한글 숫자 매칭 (예: "제3" -> "제목 3")
  const koreanNumberMatch = lowerQuery.match(/^제(\d+)$/);
  if (koreanNumberMatch) {
    const level = koreanNumberMatch[1];
    return markdownSyntax.filter((item) => item.nameKo === `제목 ${level}`);
  }

  return markdownSyntax
    .filter(
      (item) =>
        item.nameKo.toLowerCase().includes(lowerQuery) ||
        item.nameEn.toLowerCase().includes(lowerQuery) ||
        (lowerQuery === 'hl' &&
          item.nameEn.toLowerCase().startsWith('header level'))
    )
    .sort((a, b) => {
      const aStartsWithEn = a.nameEn.toLowerCase().startsWith(lowerQuery);
      const bStartsWithEn = b.nameEn.toLowerCase().startsWith(lowerQuery);
      const aStartsWithKo = a.nameKo.toLowerCase().startsWith(lowerQuery);
      const bStartsWithKo = b.nameKo.toLowerCase().startsWith(lowerQuery);

      if (aStartsWithEn && !bStartsWithEn) return -1;
      if (!aStartsWithEn && bStartsWithEn) return 1;
      if (aStartsWithKo && !bStartsWithKo) return -1;
      if (!aStartsWithKo && bStartsWithKo) return 1;

      return 0;
    })
    .slice(0, 7);
};

// 텍스트에서 검색어와 일치하는 부분을 하이라이트하는 함수
export const highlightSearchResults = (
  text: string,
  searchTerm: string,
  caseSensitive: boolean = false
): string => {
  if (!searchTerm) return text;

  const flags = caseSensitive ? 'g' : 'gi';
  const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedSearchTerm, flags);

  return text.replace(regex, (match) => `<mark>${match}</mark>`);
};

// 검색 결과의 위치 정보를 반환하는 함수
export const findSearchMatches = (
  text: string,
  searchTerm: string,
  caseSensitive: boolean = false
): { index: number; length: number }[] => {
  const matches: { index: number; length: number }[] = [];
  if (!searchTerm) return matches;

  const flags = caseSensitive ? 'g' : 'gi';
  const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedSearchTerm, flags);

  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push({
      index: match.index,
      length: match[0].length,
    });
  }

  return matches;
};

// 검색 결과의 컨텍스트를 추출하는 함수
export const getSearchContext = (
  text: string,
  searchTerm: string,
  contextLength: number = 50
): string[] => {
  const matches = findSearchMatches(text, searchTerm);
  return matches.map((match) => {
    const start = Math.max(0, match.index - contextLength);
    const end = Math.min(
      text.length,
      match.index + match.length + contextLength
    );
    return text.substring(start, end);
  });
};

// 검색어와 일치하는 라인 번호를 찾는 함수
export const findMatchingLines = (
  lines: string[],
  searchTerm: string,
  caseSensitive: boolean = false
): number[] => {
  if (!searchTerm) return [];

  const flags = caseSensitive ? '' : 'i';
  const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedSearchTerm, flags);

  return lines
    .map((line, index) => (regex.test(line) ? index + 1 : -1))
    .filter((index) => index !== -1);
};

// 검색어와 일치하는 다음/이전 위치로 이동하는 함수
export const findNextMatch = (
  text: string,
  searchTerm: string,
  currentPosition: number,
  direction: 'forward' | 'backward' = 'forward',
  caseSensitive: boolean = false
): number => {
  const matches = findSearchMatches(text, searchTerm, caseSensitive);
  if (matches.length === 0) return -1;

  if (direction === 'forward') {
    const nextMatch = matches.find((match) => match.index > currentPosition);
    return nextMatch ? nextMatch.index : matches[0].index;
  } else {
    const prevMatch = matches
      .reverse()
      .find((match) => match.index < currentPosition);
    return prevMatch ? prevMatch.index : matches[matches.length - 1].index;
  }
};
