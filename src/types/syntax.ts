export interface SyntaxItem {
  id: string; // 고유 식별자
  nameKo: string; // 한글 이름
  nameEn: string; // 영문 이름
  description: string; // 설명
  syntax: string; // 사용 방법
  example: string; // 예시
  result?: string; // 결과물
  category: string; // 카테고리
}
