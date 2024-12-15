// src/features/markdownSyntax/BasicSyntax.ts
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import rehypeStringify from 'rehype-stringify';
import { BasicNode, ElementNode } from '@/types/markdown';

// 리스트 아이템의 들여쓰기 레벨을 계산하는 함수
const getIndentLevel = (line: string): number => {
  const match = line.match(/^\s*/);
  return match ? Math.floor(match[0].length / 2) : 0;
};

// 리스트 파싱을 위한 유틸리티 함수
const parseListItems = (
  content: string,
  pattern: RegExp,
  ordered: boolean = false
): ElementNode[] => {
  const lines = content.split('\n');
  const result: ElementNode[] = [];
  let currentParent = result;
  let prevLevel = 0;
  let parents: ElementNode[][] = [result];

  lines.forEach((line) => {
    if (!pattern.test(line.trim())) return;

    const level = getIndentLevel(line);
    // 순서 있는 리스트의 마커 스타일 결정
    const listMarker =
      line.match(/^(\s*)([0-9]+|[IVXLCDM]+|[A-Z]|[a-z])\./)?.[2] || '';

    const item: ElementNode = {
      type: 'element' as const,
      tagName: 'li',
      properties: {
        className: ['list-item'],
        'data-marker': listMarker, // 마커 스타일 저장
      },
      children: [
        {
          type: 'text' as const,
          value: ordered
            ? line
                .replace(/^\s*(?:[0-9]+|[IVXLCDM]+|[A-Z]|[a-z])\.\s+/, '')
                .trim()
            : line.replace(/^\s*[-*+]\s+/, '').trim(),
        },
      ],
    };

    if (level > prevLevel) {
      // 하위 리스트 생성
      const subList: ElementNode = {
        type: 'element' as const,
        tagName: ordered ? 'ol' : 'ul',
        properties: {
          className: [
            ordered ? 'ordered-list' : 'unordered-list',
            'nested-list',
            `level-${level}`, // 레벨 정보 추가
          ],
        },
        children: [],
      };

      // 마지막 아이템에 하위 리스트 추가
      const lastItem = currentParent[currentParent.length - 1];
      if (lastItem) {
        lastItem.children = [...(lastItem.children || []), subList];
      }

      currentParent = subList.children as ElementNode[];
      parents.push(currentParent);
    } else if (level < prevLevel) {
      // 상위 리스트로 이동
      const steps = prevLevel - level;
      for (let i = 0; i < steps; i++) {
        parents.pop();
      }
      currentParent = parents[parents.length - 1];
    }

    currentParent.push(item);
    prevLevel = level;
  });

  return result;
};

// 7. Unordered List: `-`, `*`, `+`
const parseUnorderedList = (content: string): ElementNode => ({
  type: 'element' as const,
  tagName: 'ul',
  properties: { className: ['unordered-list'] },
  children: parseListItems(content, /^[-*+]\s+/),
});

interface OrderedListNode extends ElementNode {
  children: ElementNode[];
}

// 8. Ordered List: `1.`, `2.`
const parseOrderedList = (content: string): ElementNode => {
  const lines = content.split('\n');
  const root: OrderedListNode = {
    type: 'element' as const,
    tagName: 'ol',
    properties: { className: ['ordered-list'] },
    children: [],
  };

  let currentList: OrderedListNode = root;
  let currentLevel = 0;
  let listStack: OrderedListNode[] = [root];

  lines.forEach((line) => {
    const indentMatch = line.match(/^(\s*)/);
    const level = indentMatch ? Math.floor(indentMatch[1].length / 2) : 0;
    const itemMatch = line.match(
      /^(\s*)([0-9]+|[IVXLCDM]+|[A-Z]|[a-z])\.\s*(.*)$/
    );

    if (itemMatch) {
      const [, , marker, text] = itemMatch;

      if (level > currentLevel) {
        // 새로운 하위 리스트 생성
        const newList: OrderedListNode = {
          type: 'element' as const,
          tagName: 'ol',
          properties: {
            className: [
              'ordered-list',
              'nested-list',
              `level-${level}`, // 레벨 정보 추가
            ],
          },
          children: [],
        };

        // 현재 리스트의 마지막 아이템에 새 리스트 추가
        const lastItem = currentList.children[currentList.children.length - 1];
        if (lastItem) {
          lastItem.children = [...(lastItem.children || []), newList];
        }

        listStack.push(newList);
        currentList = newList;
      } else if (level < currentLevel) {
        // 상위 리스트로 이동
        for (let i = 0; i < currentLevel - level; i++) {
          listStack.pop();
        }
        currentList = listStack[listStack.length - 1];
      }

      // 리스트 아이템 추가
      const item: ElementNode = {
        type: 'element' as const,
        tagName: 'li',
        properties: {
          className: ['list-item'],
          'data-level': level.toString(), // 레벨 정보 추가
        },
        children: [{ type: 'text' as const, value: text.trim() }],
      };

      currentList.children.push(item);
      currentLevel = level;
    }
  });

  return root;
};

// 9. Task List: `[ ]`, `[x]`
const parseTaskList = (content: string): ElementNode => {
  const items = content
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim();
      // 정확한 체크박스 형식인 경우만 처리
      return /^[-*+]\s+\[([ x])\]\s+\S/.test(trimmed);
    })
    .map((line) => {
      const checked = line.includes('[x]');
      return {
        type: 'element' as const,
        tagName: 'li',
        properties: {
          className: ['task-list-item'],
          'data-checked': checked,
        },
        children: [
          {
            type: 'element' as const,
            tagName: 'input',
            properties: {
              type: 'checkbox',
              checked,
              disabled: true,
              className: ['task-checkbox'],
            },
            children: [],
          },
          {
            type: 'text' as const,
            value: ' ' + line.replace(/^[-*+]\s+\[[ x]\]\s+/, '').trim(),
          },
        ],
      };
    });

  return {
    type: 'element' as const,
    tagName: 'ul',
    properties: { className: ['task-list'] },
    children: items,
  };
};

export const basicSyntax = async (content: string): Promise<string> => {
  const processor = unified()
    .use(remarkParse)
    .use(() => (tree: BasicNode) => {
      const blocks = content.split('\n\n');

      return {
        type: 'root',
        children: blocks.map((block) => {
          const trimmedBlock = block.trim();

          // Task List 체크
          if (/^[-*+]\s+\[[ x]\]/.test(trimmedBlock)) {
            return parseTaskList(trimmedBlock);
          }

          // Ordered List 체크
          if (/^\d+\.\s+/.test(trimmedBlock)) {
            return parseOrderedList(trimmedBlock);
          }

          // Unordered List 체크
          if (/^[-*+]\s+/.test(trimmedBlock)) {
            return parseUnorderedList(trimmedBlock);
          }

          // 기본 문단 처리
          return {
            type: 'element',
            tagName: 'p',
            properties: {},
            children: [{ type: 'text', value: trimmedBlock }],
          };
        }),
      };
    })
    .use(rehypeStringify);

  const result = await processor.process(content);
  return result.toString();
};
