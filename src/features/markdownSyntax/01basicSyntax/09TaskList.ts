import { ElementNode } from '@/types/markdown';

export const parseTaskList = (text: string): ElementNode => {
  const items = text.split('\n');
  const listItems = items.map((item): ElementNode => {
    const match = item.match(/^(\s*)[-*+]\s+\[([ x])\]\s*(.*)$/);
    if (!match)
      return { type: 'element', tagName: 'li', properties: {}, children: [] };

    const [, indent, checked, content] = match;
    const level = Math.floor(indent.length / 2);

    return {
      type: 'element',
      tagName: 'li',
      properties: { className: ['task-list-item'] },
      children: [
        {
          type: 'element',
          tagName: 'input',
          properties: {
            type: 'checkbox',
            className: ['task-checkbox'],
            checked: checked === 'x',
            disabled: true,
          },
          children: [],
        },
        { type: 'text', value: content.trim() },
      ],
    };
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
  updateCursorPosition: (position: number) => void
): boolean => {
  const taskMatch = currentLine.match(/^(\s*)[-*+]\s+\[([ x])\]\s*(.*)$/);
  if (!taskMatch) return false;

  const [, indent, checked, text] = taskMatch;

  if (!text.trim()) {
    const lineStart = selectionStart - currentLine.length;
    const newValue = markdownText.substring(0, lineStart) + '\n';
    setMarkdownText(newValue);
    updateCursorPosition(lineStart + 1);
  } else {
    const insertion = `\n${indent}- [ ] `;
    const newValue =
      markdownText.substring(0, selectionStart) +
      insertion +
      markdownText.substring(selectionStart);

    setMarkdownText(newValue);
    updateCursorPosition(selectionStart + insertion.length);
  }
  return true;
};
