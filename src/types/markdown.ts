import type { Handler } from 'mdast-util-to-hast';
import { Node } from 'unist';

// 기본 노드 타입
export interface BasicNode extends Node {
  type: string;
  depth?: number; // 헤더 레벨 (1-6)
  ordered?: boolean; // 순서 있는 리스트
  checked?: boolean; // 체크박스
  spread?: boolean; // 리스트 아이템 간격
  value?: string; // 텍스트 내용
  children?: BasicNode[];
  lang?: string; // 코드 블록 언어
  meta?: string; // 코드 블록 메타데이터
  url?: string; // 링크, 이미지 URL
  title?: string; // 링크, 이미지 타이틀
  alt?: string; // 이미지 대체 텍스트
  align?: Array<'left' | 'center' | 'right' | null>; // 테이블 정렬
}

// Rehype 옵션 타입
export interface RehypeOptions<T extends Node> {
  allowDangerousHtml: boolean;
  allowDangerousCharacters?: boolean;
  handlers: {
    [key: string]: (
      h: Handler,
      node: T
    ) => {
      type: string;
      tagName?: string;
      properties?: Record<string, unknown>;
      value?: string;
      children?: unknown[];
    };
  };
}

// 테이블 관련 타입
export interface TableNode extends BasicNode {
  type: 'table';
  align?: Array<'left' | 'center' | 'right' | null>;
  children: TableRowNode[];
}

export interface TableRowNode extends BasicNode {
  type: 'tableRow';
  children: TableCellNode[];
}

export interface TableCellNode extends BasicNode {
  type: 'tableCell';
  children: BasicNode[];
}

// 수학 수식 관련 타입
export interface MathNode extends BasicNode {
  type: 'math' | 'inlineMath';
  value: string;
}

// 코드 블록 관련 타입
export interface CodeNode extends BasicNode {
  type: 'code';
  lang?: string;
  meta?: string;
  value: string;
}
