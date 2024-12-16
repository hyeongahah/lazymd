import { ElementNode, TextNode } from '@/types/markdown';
import { ListOrdered } from 'lucide-react'; // 순서 있는 리스트 아이콘
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import { updateCursorPosition } from '@/utils/editorUtils';
import {
  calculateIndentLevel,
  handleListIndentation,
  getOrderedListMarker,
  handleListEnterKey,
} from '@/utils/listUtils';
import React from 'react';

// ... 기존 parseOrderedList, handleOrderedList 로직 유지 ...

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

  // ... 기존 parseOrderedList 로직 ...
  return listStack[0];
};

export const handleOrderedList = (
  currentLine: string,
  selectionStart: number,
  isTab: boolean,
  markdownText: string,
  setMarkdownText: (text: string) => void,
  textArea: HTMLTextAreaElement
): boolean => {
  // ... 기존 handleOrderedList 로직 ...
};

// 순서 있는 리스트 버튼 컴포넌트
export function OrderedListButton({ onClick }: { onClick: () => void }) {
  return (
    <ToolbarButton onClick={onClick} title='Ordered List'>
      <ListOrdered size={18} />
    </ToolbarButton>
  );
}
