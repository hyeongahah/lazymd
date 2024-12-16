import { ElementNode } from '@/types/markdown';
import { Heading } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React from 'react';

// 헤더 파싱 로직
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

// 헤더 마커 생성
export const getHeaderMarker = (level: number): string => {
  return '#'.repeat(level) + ' ';
};

// 헤더 처리 로직
export const handleHeaders = (
  currentLine: string,
  selectionStart: number,
  markdownText: string,
  setMarkdownText: (text: string) => void,
  textArea: HTMLTextAreaElement
): boolean => {
  const headerMatch = currentLine.match(/^(#{1,6})\s(.*)$/);
  if (!headerMatch) return false;

  const [, hashes, text] = headerMatch;
  const level = hashes.length;

  if (!text.trim()) {
    const lineStart = selectionStart - currentLine.length;
    const newValue = markdownText.slice(0, lineStart) + '\n';
    setMarkdownText(newValue);
    textArea.value = newValue;
    textArea.selectionStart = lineStart + 1;
  } else {
    const insertion = `\n${getHeaderMarker(level)}`;
    const newValue =
      markdownText.slice(0, selectionStart) +
      insertion +
      markdownText.slice(selectionStart);

    setMarkdownText(newValue);
    textArea.value = newValue;
    textArea.selectionStart = selectionStart + insertion.length;
  }
  return true;
};

// 헤더 버튼 컴포넌트
export function HeaderButton({
  level,
  onClick,
}: {
  level: number;
  onClick: () => void;
}) {
  return (
    <ToolbarButton onClick={onClick} title={`Heading ${level}`}>
      <Heading size={18} />
      <span>{level}</span>
    </ToolbarButton>
  );
}
