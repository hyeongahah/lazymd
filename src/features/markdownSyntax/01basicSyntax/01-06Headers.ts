import { ElementNode } from '@/types/markdown';

export const parseHeaders = (text: string): ElementNode => {
  const match = text.match(/^(#{1,6})\s+(.*)$/);
  const level = match ? match[1].length : 1;
  return {
    type: 'element',
    tagName: `h${level}`,
    properties: {},
    children: [{ type: 'text', value: match ? match[2] : text }],
  };
};

export const getHeaderMarker = (level: number): string => {
  return '#'.repeat(level) + ' ';
};

export const handleHeaders = (
  currentLine: string,
  selectionStart: number,
  markdownText: string,
  setMarkdownText: (text: string) => void,
  updateCursorPosition: (position: number) => void
): boolean => {
  const headerMatch = currentLine.match(/^(#{1,6})\s(.*)$/);
  if (!headerMatch) return false;

  const [, hashes, text] = headerMatch;
  const level = hashes.length;

  if (!text.trim()) {
    const lineStart = selectionStart - currentLine.length;
    const newValue = markdownText.slice(0, lineStart) + '\n';
    setMarkdownText(newValue);
    updateCursorPosition(lineStart + 1);
  } else {
    const insertion = `\n${getHeaderMarker(level)}`;
    const newValue =
      markdownText.slice(0, selectionStart) +
      insertion +
      markdownText.slice(selectionStart);

    setMarkdownText(newValue);
    updateCursorPosition(selectionStart + insertion.length);
  }
  return true;
};
