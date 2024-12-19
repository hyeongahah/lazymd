import type { Handler } from 'mdast-util-to-hast';
import { Node } from 'unist';

/**
 * 마크다운 노드의 기본 인터페이스
 * @interface BasicNode
 * @extends Node
 * @property {string} type - 노드 유형
 * @property {number} [depth] - 헤더 레벨 (1-6)
 * @property {boolean} [ordered] - 순서 있는 리스트 여부
 * @property {boolean} [checked] - 체크박스 상태
 * @property {boolean} [spread] - 리스트 아이템 간격
 * @property {string} [value] - 텍스트 내용
 * @property {BasicNode[]} [children] - 하위 노드 배열
 * @property {string} [lang] - 코드 블록 언어
 * @property {string} [meta] - 코드 블록 메타데이터
 * @property {string} [url] - 링크, 이미지 URL
 * @property {string} [title] - 링크, 이미지 타이틀
 * @property {string} [alt] - 이미지 대체 텍스트
 * @property {Array<'left' | 'center' | 'right' | null>} [align] - 테이블 정렬
 */
export interface BasicNode extends Node {
  type: string;
  depth?: number;
  ordered?: boolean;
  checked?: boolean;
  spread?: boolean;
  value?: string;
  children?: BasicNode[];
  lang?: string;
  meta?: string;
  url?: string;
  title?: string;
  alt?: string;
  align?: Array<'left' | 'center' | 'right' | null>;
}

/**
 * Rehype 변환 옵션 인터페이스
 * @interface RehypeOptions
 * @template T
 * @property {boolean} allowDangerousHtml - 위험한 HTML 허용 여부
 * @property {boolean} [allowDangerousCharacters] - 위험한 문자 허용 여부
 * @property {Object} handlers - 노드 타입별 처리기
 */
export interface RehypeOptions<T extends Node> {
  allowDangerousHtml: boolean;
  allowDangerousCharacters?: boolean;
  handlers: {
    [key: string]: (h: Handler, node: T) => ElementNode;
  };
}

/**
 * HTML 요소 노드 인터페이스
 * @interface ElementNode
 * @property {string} type - 노드 타입 ('element')
 * @property {string} tagName - HTML 태그 이름
 * @property {Object} properties - 요소 속성
 * @property {(ElementNode | TextNode)[]} children - 하위 노드
 */
export interface ElementNode {
  type: 'element';
  tagName: string;
  properties: {
    className?: string[];
    [key: string]: any;
  };
  children: (ElementNode | TextNode)[];
}

/**
 * 텍스트 노드 인터페이스
 * @interface TextNode
 * @property {string} type - 노드 타입 ('text')
 * @property {string} value - 텍스트 내용
 */
export interface TextNode {
  type: 'text';
  value: string;
}

/**
 * 테이블 노드 인터페이스
 * @interface TableNode
 * @extends BasicNode
 * @property {string} type - 테이블 노드 타입 ('table')
 * @property {Array<'left' | 'center' | 'right' | null>} [align] - 열 정렬
 * @property {TableRowNode[]} children - 테이블 행
 */
export interface TableNode extends BasicNode {
  type: 'table';
  align?: Array<'left' | 'center' | 'right' | null>;
  children: TableRowNode[];
}

/**
 * 테이블 행 노드 인터페이스
 * @interface TableRowNode
 * @extends BasicNode
 * @property {string} type - 테이블 행 노드 타입 ('tableRow')
 * @property {TableCellNode[]} children - 테이블 셀
 */
export interface TableRowNode extends BasicNode {
  type: 'tableRow';
  children: TableCellNode[];
}

/**
 * 테이블 셀 노드 인터페이스
 * @interface TableCellNode
 * @extends BasicNode
 * @property {string} type - 테이블 셀 노드 타입 ('tableCell')
 * @property {BasicNode[]} children - 셀 내용
 */
export interface TableCellNode extends BasicNode {
  type: 'tableCell';
  children: BasicNode[];
}

/**
 * 수학 수식 노드 인터페이스
 * @interface MathNode
 * @extends BasicNode
 * @property {string} type - 수식 노드 타입 ('math' | 'inlineMath')
 * @property {string} value - 수식 내용
 */
export interface MathNode extends BasicNode {
  type: 'math' | 'inlineMath';
  value: string;
}

/**
 * 코드 블록 노드 인터페이스
 * @interface CodeNode
 * @extends BasicNode
 * @property {string} type - 코드 블록 노드 타입 ('code')
 * @property {string} [lang] - 프로그래밍 언어
 * @property {string} [meta] - 메타데이터
 * @property {string} value - 코드 내용
 */
export interface CodeNode extends BasicNode {
  type: 'code';
  lang?: string;
  meta?: string;
  value: string;
}

/**
 * 리스트 노드 인터페이스
 * @interface ListNode
 * @extends ElementNode
 * @property {ElementNode[]} children - 리스트 아이템
 */
export interface ListNode extends ElementNode {
  children: ElementNode[];
}

/**
 * 순서 있는 리스트 노드 인터페이스
 * @interface OrderedListNode
 * @extends ListNode
 * @property {boolean} ordered - 순서 있는 리스트 여부
 */
export interface OrderedListNode extends ListNode {
  ordered: boolean;
}

/**
 * 마크다운 에디터의 설정 옵션 인터페이스
 * @interface MarkdownEditorOptions
 * @property {boolean} [lineNumbers] - 줄 번호 표시 여부
 * @property {boolean} [lineWrapping] - 줄 바꿈 사용 여부
 * @property {string} [theme] - 에디터 테마
 * @property {boolean} [autoSave] - 자동 저장 사용 여부
 */
export interface MarkdownEditorOptions {
  lineNumbers?: boolean;
  lineWrapping?: boolean;
  theme?: string;
  autoSave?: boolean;
}

/**
 * 마크다운 렌더링 설정 옵션 인터페이스
 * @interface MarkdownRenderOptions
 * @property {boolean} [sanitize] - HTML 살균 처리 여부
 * @property {boolean} [breaks] - 줄바꿈 처리 여부
 * @property {boolean} [linkify] - URL 자동 링크 변환 여부
 */
export interface MarkdownRenderOptions {
  sanitize?: boolean;
  breaks?: boolean;
  linkify?: boolean;
}

/**
 * 마크다운 문서의 메타데이터 인터페이스
 * @interface MarkdownMetadata
 * @property {string} title - 문서 제목
 * @property {string} [description] - 문서 설명
 * @property {string[]} [tags] - 문서 태그 목록
 * @property {Date} [createdAt] - 생성 일시
 * @property {Date} [updatedAt] - 수정 일시
 */
export interface MarkdownMetadata {
  title: string;
  description?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
