import { ElementNode } from '@/types/markdown';
import { CheckSquare } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React from 'react';

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
    const match = item.match(/^(\s*)[-*+]\s*\[([ x])\]\s(.*)$/);
    if (!match) {
      return { type: 'element', tagName: 'li', properties: {}, children: [] };
    }

    const [, indent, checked, content] = match;

    return {
      type: 'element',
      tagName: 'li',
      properties: {
        className: ['task-list-item', indent ? 'nested-list' : ''],
        style: {
          display: 'flex',
          alignItems: 'center',
          paddingLeft: indent ? `${indent.length * 8}px` : '0',
        },
      },
      children: [
        {
          type: 'element',
          tagName: 'input',
          properties: {
            type: 'checkbox',
            checked: checked === 'x',
            disabled: true,
            style: {
              margin: '0 8px 0 0',
              width: '16px',
              height: '16px',
            },
          },
          children: [],
        },
        { type: 'text', value: content.trimStart() },
      ],
    };
  });

  return {
    type: 'element',
    tagName: 'ul',
    properties: {
      className: ['task-list'],
      style: { listStyle: 'none', padding: 0 },
    },
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
  const lines = markdownText.split('\n');
  const currentLineIndex =
    markdownText.slice(0, selectionStart).split('\n').length - 1;
  lines[currentLineIndex] = `- [ ] ${lines[currentLineIndex].trim()}`;
  setMarkdownText(lines.join('\n'));
  return true;
};
