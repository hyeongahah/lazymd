/**
 * 마크다운 문법 아이템의 기본 인터페이스
 * @interface SyntaxItem
 * @property {string} id - 고유 식별자
 * @property {string} nameKo - 한글 이름
 * @property {string} nameEn - 영문 이름
 * @property {string} description - 문법에 대한 설명
 * @property {string} syntax - 문법 사용 방법
 * @property {string} example - 문법 사용 예시
 * @property {string} [result] - 렌더링 결과물 (선택적)
 * @property {string} category - 문법 카테고리
 */
export interface SyntaxItem {
  id: string;
  nameKo: string;
  nameEn: string;
  description: string;
  syntax: string;
  example: string;
  result?: string;
  category: string;
}

/**
 * 마크다운 문법 카테고리의 기본 인터페이스
 * @interface SyntaxCategory
 * @property {string} id - 카테고리의 고유 식별자
 * @property {string} title - 카테고리 제목
 * @property {SyntaxItem[]} items - 카테고리에 속한 문법 아이템들의 배열
 */
export interface SyntaxCategory {
  id: string;
  title: string;
  items: SyntaxItem[];
}
