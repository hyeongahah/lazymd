import { SyntaxItem } from '@/types/syntax';
import { markdownSyntax } from '@/data/markdownSyntax';

export const searchSyntax = (query: string): SyntaxItem[] => {
  const lowerQuery = query.toLowerCase().trim();

  return markdownSyntax.filter(
    (item) =>
      item.nameKo.includes(query) || // 한글 이름 검색
      item.nameEn.toLowerCase().includes(lowerQuery) || // 영문 이름 검색 (대소문자 구분 없음)
      item.description.includes(query) // 설명 검색
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
