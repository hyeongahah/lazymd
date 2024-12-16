import { SyntaxItem } from '@/types/syntax';
import { markdownSyntax } from '@/data/markdownSyntax';

// 데이터 로드 확인을 위한 로그 추가
console.log('Loaded markdown syntax:', markdownSyntax);

export const searchSyntax = (query: string): SyntaxItem[] => {
  const lowerQuery = query.toLowerCase().trim();

  return markdownSyntax.filter(
    (item) =>
      item.nameKo.toLowerCase().includes(lowerQuery) || // 한글도 toLowerCase() 적용
      item.nameEn.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) // 설명도 toLowerCase() 적용
  );
};

// 카테고리별 검색
export const searchByCategory = (category: string): SyntaxItem[] => {
  return markdownSyntax.filter((item) => item.category === category);
};

// ID로 특정 문법 찾기
export const findSyntaxById = (id: string): SyntaxItem | undefined => {
  return markdownSyntax.find((item) => item.id === id);
};

// 자동완성을 위한 검색 함수
export const getAutocompleteSuggestions = (query: string): SyntaxItem[] => {
  if (!query) return [];

  const lowerQuery = query.toLowerCase().trim();

  // 검색 과정 디버깅을 위한 로그
  console.log('Search query:', lowerQuery);

  const results = markdownSyntax.filter(
    (item) =>
      item.nameKo.toLowerCase().includes(lowerQuery) ||
      item.nameEn.toLowerCase().includes(lowerQuery)
  );

  // 필터링 결과 확인
  console.log('Search results:', results);

  return results
    .sort((a, b) => {
      // 정확한 시작 매치를 우선순위로
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
    .slice(0, 5); // 최대 5개까지만 표시
};
