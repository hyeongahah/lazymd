import { ElementNode, TextNode } from '@/types/markdown';
import { List } from 'lucide-react'; // 순서 없는 리스트 아이콘
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import { updateCursorPosition } from '@/utils/editorUtils';
import {
  getMarkerForLevel,
  calculateIndentLevel,
  handleListIndentation,
} from '@/utils/listUtils';
import React from 'react';

interface ListNode extends ElementNode {
  children: (ElementNode | TextNode)[];
}

// 타입 가드 함수 추가
const isElementNode = (node: ElementNode | TextNode): node is ElementNode => {
  return node.type === 'element';
};

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
    const match = item.match(/^(\s*)(-)\s*(.*)$/);
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
      const newList: ListNode = {
        type: 'element',
        tagName: 'ul',
        properties: { className: ['unordered-list', 'nested-list'] },
        children: [listItem],
      };

      const lastItem = currentList.children[currentList.children.length - 1];
      if (lastItem && isElementNode(lastItem)) {
        lastItem.children = [...(lastItem.children || []), newList];
      }

      listStack.push(newList);
      currentList = newList;
    } else if (level < currentLevel) {
      for (let i = 0; i < currentLevel - level; i++) {
        listStack.pop();
      }
      currentList = listStack[listStack.length - 1];
      currentList.children.push(listItem);
    } else {
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
  const unorderedMatch = currentLine.match(/^(\s*)(-)\s*(.*)$/);
  if (!unorderedMatch) return false;

  const [, indent, , text] = unorderedMatch;
  const indentLevel = calculateIndentLevel(indent);

  if (isTab) {
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
    if (!text.trim()) {
      const lineStart = selectionStart - currentLine.length;
      const newValue = markdownText.substring(0, lineStart) + '\n';
      setMarkdownText(newValue);
      updateCursorPosition(textArea, lineStart + 1);
    } else {
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

// 순서 없는 리스트 버튼 컴포넌트
export function UnorderedListButton({ onClick }: { onClick: () => void }) {
  return (
    <ToolbarButton onClick={onClick} title='Unordered List'>
      <List size={18} />
    </ToolbarButton>
  );
}
