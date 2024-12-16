import { ElementNode } from '@/types/markdown';
import { Heading } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React from 'react';
import { getCurrentLine } from '@/utils/editorUtils';
import { updateCursorPosition } from '@/utils/editorUtils';

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
  level: number,
  markdownText: string,
  selectionStart: number,
  setMarkdownText: (text: string) => void,
  textArea: HTMLTextAreaElement | null
): void => {
  if (!textArea) return;

  // 현재 라인 가져오기
  const currentLine = getCurrentLine(markdownText, selectionStart);

  // 이미 헤더가 있는지 확인
  const headerMatch = currentLine.match(/^(#{1,6})\s(.*)$/);
  if (headerMatch) {
    // 기존 헤더 제거하고 새 헤더 추가
    const [, , text] = headerMatch;
    const newHeader = `${'#'.repeat(level)} ${text}`;
    const newText = markdownText.replace(currentLine, newHeader);
    setMarkdownText(newText);

    // 포커스 설정 및 커서 위치 조정
    textArea.focus();
    const newPosition = selectionStart + (level - headerMatch[1].length);
    updateCursorPosition(textArea, newPosition);
  } else {
    // 새 헤더 추가
    const prefix = '#'.repeat(level) + ' ';
    const text = currentLine.trim();
    const newHeader = prefix + text;
    const newText = markdownText.replace(currentLine, newHeader);
    setMarkdownText(newText);

    // 포커스 설정 및 커서 위치 조정
    textArea.focus();
    const newPosition = selectionStart + prefix.length;
    updateCursorPosition(textArea, newPosition);
  }
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
