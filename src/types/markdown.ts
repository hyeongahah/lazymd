import type { Handler } from 'mdast-util-to-hast';
import { Node } from 'unist';

export type CustomHandler<T extends Node> = (
  h: Handler,
  node: T
) => {
  type: string;
  tagName: string;
  properties: Record<string, unknown>;
  children?: unknown[];
};

export interface RehypeOptions<T extends Node> {
  allowDangerousHtml: boolean;
  handlers: {
    [key: string]: CustomHandler<T>;
  };
}

export interface BasicNode extends Node {
  depth?: number;
  ordered?: boolean;
  checked?: boolean;
  value?: string;
  children?: BasicNode[];
  properties?: Record<string, unknown>;
}

export interface CodeNode extends Node {
  value?: string;
  lang?: string;
}

export interface LinkNode extends Node {
  url?: string;
  title?: string;
  children?: Node[];
}

export interface ImageNode extends Node {
  url?: string;
  title?: string;
  alt?: string;
}

export interface TableNode extends Node {
  align?: string[];
  children?: Node[];
}

export interface EscapeNode extends Node {
  value: string;
}

export interface HtmlNode extends Node {
  value: string;
  type: 'html';
}

export interface ExtendedNode extends Node {
  value?: string;
  children?: ExtendedNode[];
  data?: {
    hName?: string;
    hProperties?: Record<string, unknown>;
  };
}

export interface MiscNode extends Node {
  value?: string;
  children?: MiscNode[];
  checked?: boolean;
  lang?: string;
  data?: {
    hProperties?: Record<string, unknown>;
  };
}

export interface ListItemNode extends Node {
  checked?: boolean;
  value?: string;
  children?: Node[];
  spread?: boolean;
}

export interface DynamicNode extends Node {
  value?: string;
  children?: DynamicNode[];
  identifier?: string;
  data?: {
    hProperties?: Record<string, unknown>;
    props?: Record<string, unknown>;
    options?: Record<string, unknown>;
  };
}

export interface YamlNode extends Node {
  value: string;
}

// ... 다른 노드 타입들도 여기에 추가
