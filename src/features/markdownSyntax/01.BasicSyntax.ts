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
    const item: ElementNode = {
      type: 'element' as const,
      tagName: 'li',
      properties: { className: ['list-item'] },
      children: [
        {
          type: 'text' as const,
          value: ordered
            ? line.replace(/^\s*\d+\.\s+/, '').trim()
            : line.replace(/^\s*[-*+]\s+/, '').trim(),
        },
      ],
    };

    if (level > prevLevel) {
      // 하위 리스트 생성
      const subList: ElementNode = {
        type: 'element' as const,
        tagName: ordered ? 'ol' : 'ul', // 리스트 타입에 따라 태그 선택
        properties: {
          className: [
            ordered ? 'ordered-list' : 'unordered-list',
            'nested-list',
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

// 8. Ordered List: `1.`, `2.`
const parseOrderedList = (content: string): ElementNode => ({
  type: 'element' as const,
  tagName: 'ol',
  properties: { className: ['ordered-list'] },
  children: parseListItems(content, /^\d+\.\s+/, true), // ordered = true 전달
});

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
