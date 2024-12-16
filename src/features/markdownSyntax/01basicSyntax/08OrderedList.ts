import { ElementNode, TextNode } from '@/types/markdown';
import { updateCursorPosition } from '@/utils/editorUtils';
import {
  calculateIndentLevel,
  handleListIndentation,
  getOrderedListMarker,
  handleListEnterKey,
} from '@/utils/listUtils';

interface ListNode extends ElementNode {
  children: (ElementNode | TextNode)[];
}

const isElementNode = (node: ElementNode | TextNode): node is ElementNode => {
  return node.type === 'element';
};

export const parseOrderedList = (text: string): ElementNode => {
  const items = text.split('\n');
  let currentLevel = 0;
  let currentList: ListNode = {
    type: 'element',
    tagName: 'ol',
    properties: { className: ['ordered-list'] },
    children: [],
  };
  let listStack: ListNode[] = [currentList];

  items.forEach((item) => {
    const match = item.match(/^(\s*)([0-9]+|[IVXLCDM]+|[A-Z]|[a-z])\.\s*(.*)$/);
    if (!match) return;

    const [, indent, , content] = match;
    const level = Math.floor(indent.length / 2);

    const listItem: ElementNode = {
      type: 'element',
      tagName: 'li',
      properties: { className: ['list-item'] },
      children: [{ type: 'text', value: content.trim() }],
    };

    if (level > currentLevel) {
      // 새로운 하위 리스트 생성
      const newList: ListNode = {
        type: 'element',
        tagName: 'ol',
        properties: {
          className: ['ordered-list', 'nested-list', `level-${level}`],
        },
        children: [listItem],
      };

      // 현재 리스트의 마지막 아이템에 새 리스트 추가
      const lastItem = currentList.children[currentList.children.length - 1];
      if (lastItem && isElementNode(lastItem)) {
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
      currentList.children.push(listItem);
    } else {
      // 같은 레벨
      currentList.children.push(listItem);
    }

    currentLevel = level;
  });

  return listStack[0];
};

const getListMarker = (level: number, index: number = 1): string => {
  switch (level) {
    case 0:
      return `${index}. `;
    case 1:
      return `${toRomanUpper(index)}. `;
    case 2:
      return `${String.fromCharCode(64 + index)}. `;
    case 3:
      return `${toRomanLower(index)}. `;
    case 4:
      return `${String.fromCharCode(96 + index)}. `;
    default:
      return `${index}. `;
  }
};

const toRomanUpper = (num: number): string => {
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  return roman[num - 1] || String(num);
};

const toRomanLower = (num: number): string => {
  return toRomanUpper(num).toLowerCase();
};

const getNextIndex = (marker: string): number => {
  if (/^\d+$/.test(marker)) {
    return parseInt(marker) + 1;
  }
  if (/^[IVXLCDM]+$/.test(marker)) {
    const romanNums = [
      'I',
      'II',
      'III',
      'IV',
      'V',
      'VI',
      'VII',
      'VIII',
      'IX',
      'X',
    ];
    const currentIndex = romanNums.indexOf(marker);
    return currentIndex + 2;
  }
  if (/^[A-Z]$/.test(marker)) {
    return marker.charCodeAt(0) - 64 + 1;
  }
  if (/^[a-z]$/.test(marker)) {
    return marker.charCodeAt(0) - 96 + 1;
  }
  return 1;
};

export const handleOrderedList = (
  currentLine: string,
  selectionStart: number,
  isTab: boolean,
  markdownText: string,
  setMarkdownText: (text: string) => void,
  textArea: HTMLTextAreaElement
): boolean => {
  const orderedMatch = currentLine.match(
    /^(\s*)([0-9]+|[IVXLCDM]+|[A-Z]|[a-z])\.\s*(.*)$/
  );
  if (!orderedMatch) return false;

  const [, indent, marker, text] = orderedMatch;
  const indentLevel = calculateIndentLevel(indent);

  if (isTab) {
    const currentIndex = parseInt(marker) || 1;
    handleListIndentation(
      indent,
      text,
      selectionStart,
      markdownText,
      indentLevel,
      (level) => getOrderedListMarker(level, currentIndex),
      setMarkdownText,
      textArea
    );
  } else {
    handleListEnterKey(
      indent,
      text,
      selectionStart,
      markdownText,
      getOrderedListMarker,
      indentLevel,
      marker,
      getNextIndex,
      setMarkdownText,
      textArea
    );
  }
  return true;
};
