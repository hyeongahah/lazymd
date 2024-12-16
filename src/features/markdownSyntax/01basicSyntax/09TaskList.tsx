import { ElementNode } from '@/types/markdown';
import { CheckSquare } from 'lucide-react'; // 체크리스트 아이콘
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React from 'react';

// ... 기존 parseTaskList, handleTaskList 로직 유지 ...

// 체크리스트 버튼 컴포넌트
export function TaskListButton({ onClick }: { onClick: () => void }) {
  return (
    <ToolbarButton onClick={onClick} title='Task List'>
      <CheckSquare size={18} />
    </ToolbarButton>
  );
}

export const parseTaskList = (text: string): ElementNode => {
  const items = text.split('\n');
  const listItems = items.map((item): ElementNode => {
    const match = item.match(/^(\s*)[-*+]\s+\[([ x])\]\s*(.*)$/);
    if (!match)
      return { type: 'element', tagName: 'li', properties: {}, children: [] };

    // ... 기존 parseTaskList 로직 ...
  });

  return {
    type: 'element',
    tagName: 'ul',
    properties: { className: ['task-list'] },
    children: listItems,
  };
};

export const handleTaskList = (
  currentLine: string,
  selectionStart: number,
  markdownText: string,
  setMarkdownText: (text: string) => void,
  textArea: HTMLTextAreaElement
): boolean => {
  // ... 기존 handleTaskList 로직 ...
};
