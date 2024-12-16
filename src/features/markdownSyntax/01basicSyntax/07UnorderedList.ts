import { ElementNode, TextNode } from '@/types/markdown';
import { updateCursorPosition } from '@/utils/editorUtils';
import {
  getMarkerForLevel,
  calculateIndentLevel,
  handleListIndentation,
} from '@/utils/listUtils';

interface ListNode extends ElementNode {
  children: (ElementNode | TextNode)[];
}

export const parseUnorderedList = (text: string): ElementNode => {
  const items = text.split('\n');
  let currentLevel = 0;
  let currentList: ListNode = {
    type: 'element',
    tagName: 'ul',
    properties: { className: ['unordered-list'] },
    children: [],
  };
  let listStack: ListNode[] = [currentList];

  items.forEach((item) => {
    const match = item.match(/^(\s*)([-*+])\s*(.*)$/);
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
        tagName: 'ul',
        properties: { className: ['unordered-list', 'nested-list'] },
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

export const handleUnorderedList = (
  currentLine: string,
  selectionStart: number,
  isTab: boolean,
  markdownText: string,
  setMarkdownText: (text: string) => void,
  textArea: HTMLTextAreaElement
): boolean => {
  const unorderedMatch = currentLine.match(/^(\s*)([-*+])\s*(.*)$/);
  if (!unorderedMatch) return false;

  const [, indent, , text] = unorderedMatch;
  const indentLevel = calculateIndentLevel(indent);

  if (isTab) {
    // 탭 키 처리: 들여쓰기와 마커 변경
    handleListIndentation(
      indent,
      text,
      selectionStart,
      markdownText,
      indentLevel,
      getMarkerForLevel,
      setMarkdownText,
      textArea
    );
  } else {
    // 엔터 키 처리
    if (!text.trim()) {
      // 빈 항목이면 리스트 종료
      const lineStart = selectionStart - currentLine.length;
      const newValue = markdownText.substring(0, lineStart) + '\n';
      setMarkdownText(newValue);
      updateCursorPosition(textArea, lineStart + 1);
    } else {
      // 현재 들여쓰기 레벨의 마커 유지
      const currentMarker = getMarkerForLevel(indentLevel);
      const insertion = `\n${indent}${currentMarker} `;
      const newValue =
        markdownText.substring(0, selectionStart) +
        insertion +
        markdownText.substring(selectionStart);

      setMarkdownText(newValue);
      updateCursorPosition(textArea, selectionStart + insertion.length);
    }
  }
  return true;
};

// 타입 가드 함수 추가
const isElementNode = (node: ElementNode | TextNode): node is ElementNode => {
  return node.type === 'element';
};
